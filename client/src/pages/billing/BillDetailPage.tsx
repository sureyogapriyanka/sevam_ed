import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

// ─── Types ────────────────────────────────────────────────────────────────────

type BillStatus = 'draft' | 'pending' | 'paid' | 'partially_paid' | 'cancelled';
type PaymentMethod = 'cash' | 'card' | 'upi' | 'insurance' | 'online';
type ItemCategory = 'consultation' | 'medicine' | 'lab_test' | 'procedure' | 'room' | 'other';

interface BillItem {
    description: string;
    category: ItemCategory;
    quantity: number;
    unitPrice: number;
    total: number;
}

interface Bill {
    _id: string;
    billNumber: string;
    patientId: { _id: string; name: string } | string;
    patientName: string;
    appointmentId?: string | null;
    items: BillItem[];
    subtotal: number;
    taxPercent: number;
    taxAmount: number;
    discountPercent: number;
    discountAmount: number;
    grandTotal: number;
    status: BillStatus;
    paymentMethod: PaymentMethod | null;
    amountPaid: number;
    balanceDue: number;
    paidAt: string | null;
    insuranceProvider?: string;
    insurancePolicyNumber?: string;
    insuranceCoverage?: number;
    notes?: string;
    createdAt: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const API = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const STATUS_STYLES: Record<BillStatus, string> = {
    draft: 'bg-gray-100 text-gray-600',
    pending: 'bg-yellow-100 text-yellow-700',
    paid: 'bg-green-100 text-green-700',
    partially_paid: 'bg-blue-100 text-blue-700',
    cancelled: 'bg-red-100 text-red-700',
};

const STATUS_LABELS: Record<BillStatus, string> = {
    draft: 'Draft',
    pending: 'Pending',
    paid: 'Paid ✓',
    partially_paid: 'Partial',
    cancelled: 'Cancelled',
};

const CATEGORY_LABELS: Record<ItemCategory, string> = {
    consultation: 'Consultation',
    medicine: 'Medicine',
    lab_test: 'Lab Test',
    procedure: 'Procedure',
    room: 'Room',
    other: 'Other',
};

const CATEGORY_COLORS: Record<ItemCategory, string> = {
    consultation: 'bg-blue-100 text-blue-700',
    medicine: 'bg-green-100 text-green-700',
    lab_test: 'bg-purple-100 text-purple-700',
    procedure: 'bg-orange-100 text-orange-700',
    room: 'bg-pink-100 text-pink-700',
    other: 'bg-gray-100 text-gray-600',
};

const PAYMENT_METHODS: { key: PaymentMethod; label: string }[] = [
    { key: 'cash', label: '💵 Cash' },
    { key: 'card', label: '💳 Card' },
    { key: 'upi', label: '📱 UPI' },
    { key: 'online', label: '🌐 Online' },
];

const fmt = (n: number) => `₹${n.toFixed(2)}`;

const fmtDate = (d: string) =>
    new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

const fmtDateTime = (d: string) =>
    new Date(d).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

// ─── Spinner ──────────────────────────────────────────────────────────────────

function Spinner({ color = 'border-blue-500' }: { color?: string }) {
    return (
        <div className={`animate-spin h-5 w-5 rounded-full border-2 ${color} border-t-transparent`} />
    );
}

// ─── Pay Modal ────────────────────────────────────────────────────────────────

function PayModal({
    bill, onClose, onSuccess,
}: { bill: Bill; onClose: () => void; onSuccess: () => void }) {
    const token = localStorage.getItem('token') || '';
    const [amount, setAmount] = useState(bill.balanceDue);
    const [method, setMethod] = useState<PaymentMethod>('cash');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handlePay = async () => {
        if (!amount || amount <= 0) { setError('Enter a valid amount.'); return; }
        setLoading(true);
        try {
            const res = await fetch(`${API}/billing/${bill._id}/pay`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ paymentMethod: method, amountPaid: amount }),
            });
            if (res.ok) { onSuccess(); onClose(); }
            else { const d = await res.json(); setError(d.message || 'Payment failed.'); }
        } catch { setError('Network error.'); }
        finally { setLoading(false); }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4 print:hidden"
            onClick={(e) => e.target === e.currentTarget && onClose()}>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl">×</button>
                <h3 className="text-lg font-bold text-gray-800 mb-1">Mark as Paid</h3>
                <p className="text-sm text-gray-500 mb-4">Bill: <span className="font-mono font-medium">{bill.billNumber}</span></p>

                {error && <div className="mb-3 bg-red-50 text-red-700 text-sm px-3 py-2 rounded-lg">{error}</div>}

                <label className="block text-sm font-medium text-gray-700 mb-1">Amount (₹)</label>
                <input type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} min={1}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-green-500" />

                <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
                <div className="grid grid-cols-2 gap-2 mb-5">
                    {PAYMENT_METHODS.map((pm) => (
                        <button key={pm.key} type="button" onClick={() => setMethod(pm.key)}
                            className={`py-2 px-3 rounded-xl border text-sm font-medium transition ${method === pm.key ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-200 text-gray-500 hover:border-gray-300'
                                }`}>
                            {pm.label}
                        </button>
                    ))}
                </div>

                <button onClick={handlePay} disabled={loading}
                    className="w-full flex items-center justify-center gap-2 bg-green-600 text-white py-2.5 rounded-xl font-semibold hover:bg-green-700 transition disabled:opacity-60">
                    {loading && <Spinner color="border-white" />}
                    {loading ? 'Processing...' : 'Confirm Payment'}
                </button>
            </div>
        </div>
    );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function BillDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const token = localStorage.getItem('token') || '';

    const [bill, setBill] = useState<Bill | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showPay, setShowPay] = useState(false);
    const [canceling, setCanceling] = useState(false);

    const fetchBill = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API}/billing/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) { setError('Bill not found.'); return; }
            setBill(await res.json());
        } catch { setError('Failed to load bill.'); }
        finally { setLoading(false); }
    }, [id, token]);

    useEffect(() => { fetchBill(); }, [fetchBill]);

    const handleCancel = async () => {
        if (!bill || !confirm('Cancel this bill?')) return;
        setCanceling(true);
        try {
            const res = await fetch(`${API}/billing/${bill._id}/cancel`, {
                method: 'PUT', headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) fetchBill();
        } finally { setCanceling(false); }
    };

    // ─── Loading / Error ────────────────────────────────────────────────────────

    if (loading) return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="text-center space-y-3">
                <div className="mx-auto w-fit"><Spinner color="border-blue-500" /></div>
                <p className="text-gray-400 text-sm">Loading bill...</p>
            </div>
        </div>
    );

    if (error || !bill) return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="text-center space-y-3">
                <div className="text-5xl">🧾</div>
                <p className="text-gray-600 font-medium">{error || 'Bill not found'}</p>
                <Link to="/billing" className="text-blue-600 hover:underline text-sm">← Back to Bills</Link>
            </div>
        </div>
    );

    const canAct = bill.status === 'pending' || bill.status === 'draft' || bill.status === 'partially_paid';

    // ─── Render ─────────────────────────────────────────────────────────────────

    return (
        <>
            {/* ── Print Styles ──────────────────────────────────────────────── */}
            <style>{`
        @media print {
          .no-print { display: none !important; }
          .print-doc { box-shadow: none !important; margin: 0 !important; border-radius: 0 !important; }
          body { background: white !important; }
        }
      `}</style>

            <div className="min-h-screen bg-gray-50 p-4 md:p-8">

                {/* ══ ACTION BAR (not printed) ═════════════════════════════════════ */}
                <div className="no-print flex flex-wrap items-center gap-3 mb-6">
                    <Link to="/billing" className="text-gray-400 hover:text-gray-600 transition text-sm flex items-center gap-1">
                        ← Back to Bills
                    </Link>

                    {/* Status badge */}
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${STATUS_STYLES[bill.status]}`}>
                        {STATUS_LABELS[bill.status]}
                    </span>

                    <div className="ml-auto flex flex-wrap gap-2">
                        {canAct && (
                            <>
                                <button onClick={() => setShowPay(true)}
                                    className="flex items-center gap-1.5 bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition">
                                    💰 Mark as Paid
                                </button>
                                <Link to={`/billing/edit/${bill._id}`}
                                    className="flex items-center gap-1.5 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition">
                                    ✏️ Edit
                                </Link>
                                <button onClick={handleCancel} disabled={canceling}
                                    className="flex items-center gap-1.5 bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-600 transition disabled:opacity-60">
                                    {canceling ? <Spinner color="border-white" /> : '🚫'} Cancel
                                </button>
                            </>
                        )}
                        <button onClick={() => window.print()}
                            className="flex items-center gap-1.5 bg-gray-700 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition">
                            🖨️ Print Bill
                        </button>
                        <button onClick={() => window.print()}
                            className="flex items-center gap-1.5 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition">
                            ⬇️ Download PDF
                        </button>
                    </div>
                </div>

                {/* ══ BILL DOCUMENT ═══════════════════════════════════════════════ */}
                <div className="print-doc max-w-4xl mx-auto bg-white rounded-2xl shadow-md overflow-hidden">

                    {/* ── Header ──────────────────────────────────────────────────── */}
                    <div className="bg-gradient-to-r from-blue-700 to-blue-500 px-8 py-6 text-white flex justify-between items-start">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center text-blue-700 font-black text-2xl shadow">
                                S
                            </div>
                            <div>
                                <h1 className="text-2xl font-black tracking-tight">SevaOnline Hospital</h1>
                                <p className="text-blue-100 text-sm">Quality Healthcare for Everyone</p>
                            </div>
                        </div>
                        <div className="text-right space-y-1">
                            <p className="text-xs text-blue-200 uppercase tracking-widest">Bill Number</p>
                            <p className="text-xl font-bold font-mono">{bill.billNumber}</p>
                            <p className="text-blue-100 text-sm">{fmtDate(bill.createdAt)}</p>
                            <span className={`inline-block px-3 py-0.5 rounded-full text-xs font-bold ${STATUS_STYLES[bill.status]}`}>
                                {STATUS_LABELS[bill.status]}
                            </span>
                        </div>
                    </div>

                    <div className="px-8 py-6 space-y-6">

                        {/* ── Patient Info ────────────────────────────────────────── */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                                <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold mb-2">Patient Information</p>
                                <InfoRow label="Patient Name" value={bill.patientName} />
                                <InfoRow label="Patient ID" value={typeof bill.patientId === 'string' ? bill.patientId : bill.patientId._id} mono />
                                {bill.appointmentId && <InfoRow label="Appointment" value={bill.appointmentId} mono />}
                            </div>
                            <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                                <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold mb-2">Bill Information</p>
                                <InfoRow label="Date" value={fmtDate(bill.createdAt)} />
                                <InfoRow label="Status" value={STATUS_LABELS[bill.status]} />
                                {bill.paymentMethod && <InfoRow label="Payment Method" value={bill.paymentMethod.toUpperCase()} />}
                                {bill.paidAt && <InfoRow label="Paid On" value={fmtDateTime(bill.paidAt)} />}
                            </div>
                        </div>

                        {/* ── Items Table ─────────────────────────────────────────── */}
                        <div>
                            <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold mb-3">Bill Items</p>
                            <div className="overflow-x-auto rounded-xl border border-gray-100">
                                <table className="w-full text-sm">
                                    <thead className="bg-blue-600 text-white text-xs">
                                        <tr>
                                            {['#', 'Description', 'Category', 'Qty', 'Unit Price', 'Total'].map((h) => (
                                                <th key={h} className="px-4 py-3 text-left font-semibold">{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {bill.items.map((item, i) => (
                                            <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                                <td className="px-4 py-3 text-gray-400 font-mono text-xs">{i + 1}</td>
                                                <td className="px-4 py-3 text-gray-800 font-medium">{item.description}</td>
                                                <td className="px-4 py-3">
                                                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${CATEGORY_COLORS[item.category] || 'bg-gray-100 text-gray-600'}`}>
                                                        {CATEGORY_LABELS[item.category] || item.category}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-gray-600">{item.quantity}</td>
                                                <td className="px-4 py-3 text-gray-600">{fmt(item.unitPrice)}</td>
                                                <td className="px-4 py-3 text-gray-800 font-semibold">{fmt(item.total)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* ── Financial Summary ────────────────────────────────────── */}
                        <div className="flex justify-end">
                            <div className="w-full max-w-sm space-y-2 bg-gray-50 rounded-2xl p-5">
                                <FinRow label="Subtotal" value={fmt(bill.subtotal)} />
                                <FinRow label={`Tax (${bill.taxPercent}%)`} value={fmt(bill.taxAmount)} />
                                <FinRow label={`Discount (${bill.discountPercent}%)`} value={`-${fmt(bill.discountAmount)}`} />
                                <div className="border-t-2 border-gray-300 my-2" />
                                <div className="flex justify-between items-center">
                                    <span className="font-black text-gray-800 text-base">Grand Total</span>
                                    <span className="font-black text-green-600 text-2xl">{fmt(bill.grandTotal)}</span>
                                </div>
                                <div className="border-t border-gray-200 pt-2 space-y-1">
                                    <FinRow label="Amount Paid" value={fmt(bill.amountPaid)} />
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Balance Due</span>
                                        <span className={`font-bold ${bill.balanceDue > 0 ? 'text-red-600' : 'text-green-600'}`}>
                                            {fmt(bill.balanceDue)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ── Insurance ────────────────────────────────────────────── */}
                        {bill.insuranceProvider && (
                            <div className="bg-indigo-50 rounded-xl p-4 space-y-1">
                                <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold mb-2">Insurance Details</p>
                                <InfoRow label="Provider" value={bill.insuranceProvider} />
                                {bill.insurancePolicyNumber && <InfoRow label="Policy Number" value={bill.insurancePolicyNumber} mono />}
                                {bill.insuranceCoverage !== undefined && bill.insuranceCoverage > 0 && (
                                    <InfoRow label="Coverage" value={fmt(bill.insuranceCoverage)} />
                                )}
                            </div>
                        )}

                        {/* ── Notes ────────────────────────────────────────────────── */}
                        {bill.notes && (
                            <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-4">
                                <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold mb-1">Notes</p>
                                <p className="text-gray-700 text-sm">{bill.notes}</p>
                            </div>
                        )}

                        {/* ── Footer ───────────────────────────────────────────────── */}
                        <div className="border-t border-gray-100 pt-5 text-center space-y-1">
                            <p className="text-gray-500 text-sm font-medium">Thank you for choosing SevaOnline Hospital</p>
                            <p className="text-gray-400 text-xs">For queries contact: support@sevaonline.com</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Pay Modal ─────────────────────────────────────────────────── */}
            {showPay && bill && (
                <PayModal bill={bill} onClose={() => setShowPay(false)} onSuccess={fetchBill} />
            )}
        </>
    );
}

// ─── Small helpers ────────────────────────────────────────────────────────────

function InfoRow({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
    return (
        <div className="flex justify-between text-sm gap-2">
            <span className="text-gray-400 whitespace-nowrap">{label}:</span>
            <span className={`text-gray-700 font-medium text-right ${mono ? 'font-mono text-xs' : ''}`}>{value}</span>
        </div>
    );
}

function FinRow({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex justify-between text-sm">
            <span className="text-gray-500">{label}</span>
            <span className="font-medium text-gray-700">{value}</span>
        </div>
    );
}
