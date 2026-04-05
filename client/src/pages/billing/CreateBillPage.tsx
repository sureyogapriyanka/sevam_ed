import { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';

// ─── Types ────────────────────────────────────────────────────────────────────

type ItemCategory = 'consultation' | 'medicine' | 'lab_test' | 'procedure' | 'room' | 'other';
type PaymentMethod = 'cash' | 'card' | 'upi' | 'insurance' | 'online';
type BillStatus = 'draft' | 'pending';

interface BillItem {
    id: string; // local only for React key
    description: string;
    category: ItemCategory;
    quantity: number;
    unitPrice: number;
    total: number;
}

interface PatientResult {
    _id: string;
    name: string;
    age?: number;
    bloodGroup?: string;
    phone?: string;
}

const API = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const CATEGORY_LABELS: Record<ItemCategory, string> = {
    consultation: 'Consultation',
    medicine: 'Medicine',
    lab_test: 'Lab Test',
    procedure: 'Procedure',
    room: 'Room Charge',
    other: 'Other',
};

const PAYMENT_METHODS: { key: PaymentMethod; label: string; icon: string }[] = [
    { key: 'cash', label: 'Cash', icon: '💵' },
    { key: 'card', label: 'Card', icon: '💳' },
    { key: 'upi', label: 'UPI', icon: '📱' },
    { key: 'insurance', label: 'Insurance', icon: '🛡️' },
    { key: 'online', label: 'Online', icon: '🌐' },
];

let itemIdCounter = 0;
const newItem = (overrides: Partial<BillItem> = {}): BillItem => {
    const qty = overrides.quantity ?? 1;
    const price = overrides.unitPrice ?? 0;
    return {
        id: String(++itemIdCounter),
        description: '',
        category: 'other',
        quantity: qty,
        unitPrice: price,
        total: qty * price,
        ...overrides,
    };
};

// ─── Spinner ──────────────────────────────────────────────────────────────────
function Spinner() {
    return (
        <svg className="animate-spin h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
        </svg>
    );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function CreateBillPage() {
    const navigate = useNavigate();
    const token = localStorage.getItem('token') || '';

    // Patient search
    const [search, setSearch] = useState('');
    const [searchResults, setSearchResults] = useState<PatientResult[]>([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [selectedPatient, setSelectedPatient] = useState<PatientResult | null>(null);
    const [searchLoading, setSearchLoading] = useState(false);

    // Bill items
    const [items, setItems] = useState<BillItem[]>([
        newItem({ description: 'Consultation Fee', category: 'consultation', quantity: 1, unitPrice: 500, total: 500 })
    ]);

    // Financials
    const [taxPercent, setTaxPercent] = useState(0);
    const [discountPercent, setDiscountPercent] = useState(0);

    // Payment
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');

    // Insurance
    const [insuranceProvider, setInsuranceProvider] = useState('');
    const [insurancePolicyNumber, setInsurancePolicyNumber] = useState('');
    const [insuranceCoverage, setInsuranceCoverage] = useState(0);

    // Notes
    const [notes, setNotes] = useState('');

    // Submission
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // ─── Live calculations ─────────────────────────────────────────────────────
    const subtotal = items.reduce((s, i) => s + i.total, 0);
    const taxAmount = (subtotal * taxPercent) / 100;
    const discountAmount = (subtotal * discountPercent) / 100;
    const grandTotal = subtotal + taxAmount - discountAmount;

    const fmt = (n: number) => `₹${n.toFixed(2)}`;

    // ─── Patient search debounce ───────────────────────────────────────────────
    useEffect(() => {
        if (!search.trim() || search.length < 2) { setSearchResults([]); return; }
        const timer = setTimeout(async () => {
            setSearchLoading(true);
            try {
                const res = await fetch(`${API}/patients?search=${encodeURIComponent(search)}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = await res.json();
                setSearchResults(Array.isArray(data) ? data.slice(0, 6) : []);
                setShowDropdown(true);
            } catch { setSearchResults([]); }
            finally { setSearchLoading(false); }
        }, 350);
        return () => clearTimeout(timer);
    }, [search, token]);

    const selectPatient = (p: PatientResult) => {
        setSelectedPatient(p);
        setSearch(p.name);
        setShowDropdown(false);
        setSearchResults([]);
    };

    // ─── Item helpers ──────────────────────────────────────────────────────────
    const updateItem = (id: string, field: keyof BillItem, raw: string | number) => {
        setItems((prev) => prev.map((item) => {
            if (item.id !== id) return item;
            const updated = { ...item, [field]: raw };
            updated.total = Number(((updated.quantity || 1) * (updated.unitPrice || 0)).toFixed(2));
            return updated;
        }));
    };

    const addItem = () => setItems((prev) => [...prev, newItem()]);

    const removeItem = (id: string) => {
        if (items.length === 1) return; // keep minimum 1
        setItems((prev) => prev.filter((i) => i.id !== id));
    };

    // ─── Submit ────────────────────────────────────────────────────────────────
    const handleSubmit = async (status: BillStatus) => {
        setError('');
        if (!selectedPatient) { setError('Please select a patient.'); return; }
        if (!items.length) { setError('At least one item is required.'); return; }
        for (const item of items) {
            if (!item.description.trim()) { setError('All item descriptions are required.'); return; }
            if (item.unitPrice <= 0) { setError('All item unit prices must be greater than 0.'); return; }
        }

        setSubmitting(true);
        try {
            const payload = {
                patientId: selectedPatient._id,
                patientName: selectedPatient.name,
                items: items.map(({ id: _id, ...rest }) => rest), // strip local id
                taxPercent,
                discountPercent,
                notes,
                status,
                paymentMethod,
                ...(paymentMethod === 'insurance' && { insuranceProvider, insurancePolicyNumber, insuranceCoverage }),
            };

            const res = await fetch(`${API}/billing`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify(payload),
            });
            const data = await res.json();

            if (!res.ok) { setError(data.message || 'Failed to create bill.'); return; }

            setSuccess('Bill created successfully!');
            setTimeout(() => navigate(`/billing/${data._id}`), 1200);
        } catch {
            setError('Network error. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    // ─── Input base class ──────────────────────────────────────────────────────
    const inputCls = 'border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full transition';

    // ─── Render ────────────────────────────────────────────────────────────────
    return (
        <div className="min-h-screen bg-gray-50 p-6">
            {/* ── Page Header ──────────────────────────────────────────────────── */}
            <div className="flex items-center gap-3 mb-6">
                <Link to="/admin" className="text-gray-400 hover:text-gray-600 transition text-sm flex items-center gap-1">
                    ← Back
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Create New Bill</h1>
                    <p className="text-gray-400 text-sm">Fill in the details to generate a patient bill</p>
                </div>
            </div>

            {/* ── Error / Success banners ───────────────────────────────────────── */}
            {error && (
                <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                    ❌ {error}
                </div>
            )}
            {success && (
                <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm">
                    ✅ {success}
                </div>
            )}

            <div className="flex gap-6 items-start">

                {/* ══════════════════ LEFT PANEL (60%) ══════════════════ */}
                <div className="flex-[3] space-y-5">

                    {/* ── Patient Selection ─────────────────────────────── */}
                    <div className="bg-white rounded-2xl shadow-sm p-5 border border-gray-100">
                        <h2 className="font-semibold text-gray-800 mb-3">Patient</h2>
                        <div className="relative">
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => { setSearch(e.target.value); setSelectedPatient(null); }}
                                onFocus={() => searchResults.length > 0 && setShowDropdown(true)}
                                placeholder="🔍 Search patient by name..."
                                className={inputCls}
                            />
                            {searchLoading && (
                                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                    <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full" />
                                </div>
                            )}
                            {showDropdown && searchResults.length > 0 && (
                                <div className="absolute z-20 top-full mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg max-h-52 overflow-y-auto">
                                    {searchResults.map((p) => (
                                        <button
                                            key={p._id}
                                            onMouseDown={() => selectPatient(p)}
                                            className="w-full text-left px-4 py-2.5 hover:bg-blue-50 transition text-sm flex justify-between"
                                        >
                                            <span className="font-medium text-gray-800">{p.name}</span>
                                            <span className="text-gray-400 text-xs">{p.age ? `${p.age} yrs` : ''} {p.bloodGroup || ''}</span>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Selected patient info card */}
                        {selectedPatient && (
                            <div className="mt-3 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 flex flex-wrap gap-4 text-sm">
                                <span><b className="text-gray-700">Name:</b> {selectedPatient.name}</span>
                                {selectedPatient.age && <span><b className="text-gray-700">Age:</b> {selectedPatient.age} yrs</span>}
                                {selectedPatient.bloodGroup && <span><b className="text-gray-700">Blood:</b> {selectedPatient.bloodGroup}</span>}
                                {selectedPatient.phone && <span><b className="text-gray-700">Phone:</b> {selectedPatient.phone}</span>}
                            </div>
                        )}
                    </div>

                    {/* ── Bill Items ───────────────────────────────────────── */}
                    <div className="bg-white rounded-2xl shadow-sm p-5 border border-gray-100">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="font-semibold text-gray-800">Bill Items</h2>
                            <button onClick={addItem}
                                className="flex items-center gap-1 bg-blue-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-blue-700 transition">
                                + Add Item
                            </button>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="text-left text-gray-400 border-b text-xs uppercase tracking-wide">
                                        <th className="pb-2 font-medium w-[30%]">Description</th>
                                        <th className="pb-2 font-medium w-[18%]">Category</th>
                                        <th className="pb-2 font-medium w-[10%]">Qty</th>
                                        <th className="pb-2 font-medium w-[14%]">Unit Price (₹)</th>
                                        <th className="pb-2 font-medium w-[14%]">Total (₹)</th>
                                        <th className="pb-2 font-medium w-[6%]"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {items.map((item) => (
                                        <tr key={item.id} className="align-middle">
                                            <td className="py-2 pr-2">
                                                <input value={item.description}
                                                    onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                                                    placeholder="e.g. Consultation Fee"
                                                    className={inputCls}
                                                />
                                            </td>
                                            <td className="py-2 pr-2">
                                                <select value={item.category}
                                                    onChange={(e) => updateItem(item.id, 'category', e.target.value as ItemCategory)}
                                                    className={inputCls}>
                                                    {(Object.keys(CATEGORY_LABELS) as ItemCategory[]).map((k) => (
                                                        <option key={k} value={k}>{CATEGORY_LABELS[k]}</option>
                                                    ))}
                                                </select>
                                            </td>
                                            <td className="py-2 pr-2">
                                                <input type="number" min={1} value={item.quantity}
                                                    onChange={(e) => updateItem(item.id, 'quantity', Number(e.target.value))}
                                                    className={inputCls}
                                                />
                                            </td>
                                            <td className="py-2 pr-2">
                                                <input type="number" min={0} step="0.01" value={item.unitPrice}
                                                    onChange={(e) => updateItem(item.id, 'unitPrice', Number(e.target.value))}
                                                    className={inputCls}
                                                />
                                            </td>
                                            <td className="py-2 pr-2">
                                                <div className="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 text-sm font-medium">
                                                    {fmt(item.total)}
                                                </div>
                                            </td>
                                            <td className="py-2">
                                                <button onClick={() => removeItem(item.id)}
                                                    disabled={items.length === 1}
                                                    className="w-7 h-7 flex items-center justify-center rounded-lg bg-red-50 text-red-500 hover:bg-red-100 disabled:opacity-30 disabled:cursor-not-allowed transition text-base">
                                                    ×
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* ── Notes ───────────────────────────────────────────── */}
                    <div className="bg-white rounded-2xl shadow-sm p-5 border border-gray-100">
                        <h2 className="font-semibold text-gray-800 mb-3">Notes</h2>
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            rows={3}
                            placeholder="Additional notes or instructions..."
                            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none transition"
                        />
                    </div>
                </div>

                {/* ══════════════════ RIGHT PANEL (40%) ══════════════════ */}
                <div className="flex-[2] space-y-5 sticky top-6">

                    {/* ── Bill Summary Card ─────────────────────────────── */}
                    <div className="bg-white rounded-2xl shadow-sm p-5 border border-gray-100">
                        <h2 className="font-semibold text-gray-800 mb-4">Bill Summary</h2>

                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between text-gray-600">
                                <span>Subtotal</span>
                                <span className="font-medium text-gray-800">{fmt(subtotal)}</span>
                            </div>

                            {/* Tax */}
                            <div className="flex items-center justify-between gap-2">
                                <span className="text-gray-600 whitespace-nowrap">Tax (%)</span>
                                <div className="flex items-center gap-2">
                                    <input type="number" min={0} max={100} value={taxPercent}
                                        onChange={(e) => setTaxPercent(Number(e.target.value))}
                                        className="w-16 border border-gray-300 rounded-lg px-2 py-1 text-sm text-right focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <span className="text-gray-500 text-xs w-24 text-right">{fmt(taxAmount)}</span>
                                </div>
                            </div>

                            {/* Discount */}
                            <div className="flex items-center justify-between gap-2">
                                <span className="text-gray-600 whitespace-nowrap">Discount (%)</span>
                                <div className="flex items-center gap-2">
                                    <input type="number" min={0} max={100} value={discountPercent}
                                        onChange={(e) => setDiscountPercent(Number(e.target.value))}
                                        className="w-16 border border-gray-300 rounded-lg px-2 py-1 text-sm text-right focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <span className="text-gray-500 text-xs w-24 text-right">-{fmt(discountAmount)}</span>
                                </div>
                            </div>

                            <hr className="border-gray-200 my-1" />

                            {/* Grand Total */}
                            <div className="flex justify-between items-center bg-green-50 rounded-xl px-4 py-3">
                                <span className="font-bold text-gray-700">Grand Total</span>
                                <span className="text-2xl font-bold text-green-600">{fmt(grandTotal)}</span>
                            </div>
                        </div>
                    </div>

                    {/* ── Payment Method ───────────────────────────────────── */}
                    <div className="bg-white rounded-2xl shadow-sm p-5 border border-gray-100">
                        <h2 className="font-semibold text-gray-800 mb-3">Payment Method</h2>
                        <div className="grid grid-cols-3 gap-2">
                            {PAYMENT_METHODS.map((pm) => (
                                <button key={pm.key}
                                    onClick={() => setPaymentMethod(pm.key)}
                                    className={`flex flex-col items-center gap-1 py-2.5 px-2 rounded-xl border text-xs font-medium transition ${paymentMethod === pm.key
                                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                                            : 'border-gray-200 text-gray-500 hover:border-gray-300 hover:bg-gray-50'
                                        }`}>
                                    <span className="text-xl">{pm.icon}</span>
                                    {pm.label}
                                </button>
                            ))}
                        </div>

                        {/* Insurance fields */}
                        {paymentMethod === 'insurance' && (
                            <div className="mt-4 space-y-3 border-t border-gray-100 pt-4">
                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">Insurance Provider</label>
                                    <input value={insuranceProvider} onChange={(e) => setInsuranceProvider(e.target.value)}
                                        placeholder="e.g. Star Health" className={inputCls} />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">Policy Number</label>
                                    <input value={insurancePolicyNumber} onChange={(e) => setInsurancePolicyNumber(e.target.value)}
                                        placeholder="POL-XXXXXXXX" className={inputCls} />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">Coverage Amount (₹)</label>
                                    <input type="number" value={insuranceCoverage} onChange={(e) => setInsuranceCoverage(Number(e.target.value))}
                                        placeholder="0" className={inputCls} />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* ── Action Buttons ────────────────────────────────────── */}
                    <div className="flex flex-col gap-3">
                        <button onClick={() => handleSubmit('draft')} disabled={submitting}
                            className="w-full flex items-center justify-center gap-2 py-3 bg-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-300 transition disabled:opacity-60">
                            {submitting ? <Spinner /> : '📄'} Save as Draft
                        </button>
                        <button onClick={() => handleSubmit('pending')} disabled={submitting}
                            className="w-full flex items-center justify-center gap-2 py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition disabled:opacity-60">
                            {submitting ? <Spinner /> : '🧾'} Generate Bill
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
