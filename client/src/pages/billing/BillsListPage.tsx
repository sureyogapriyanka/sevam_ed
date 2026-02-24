import { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';

// ─── Types ────────────────────────────────────────────────────────────────────

type BillStatus = 'draft' | 'pending' | 'paid' | 'partially_paid' | 'cancelled';
type PaymentMethod = 'cash' | 'card' | 'upi' | 'online';

interface BillSummaryStats {
    totalBills: number;
    totalRevenue: number;
    pendingAmount: number;
    todayRevenue: number;
    billsByStatus: Record<string, number>;
}

interface Bill {
    _id: string;
    billNumber: string;
    patientName: string;
    items: { total: number }[];
    grandTotal: number;
    amountPaid: number;
    balanceDue: number;
    status: BillStatus;
    createdAt: string;
}

interface Filters {
    search: string;
    status: string;
    startDate: string;
    endDate: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const API = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
const PER_PAGE = 10;

const STATUS_META: Record<BillStatus, { label: string; cls: string }> = {
    draft: { label: 'Draft', cls: 'bg-gray-100 text-gray-600' },
    pending: { label: 'Pending', cls: 'bg-yellow-100 text-yellow-700' },
    paid: { label: 'Paid', cls: 'bg-green-100 text-green-700' },
    partially_paid: { label: 'Partially Paid', cls: 'bg-blue-100 text-blue-700' },
    cancelled: { label: 'Cancelled', cls: 'bg-red-100 text-red-700' },
};

const STAT_CARDS = [
    { key: 'totalBills', label: 'Total Bills', icon: '🧾', color: 'from-blue-500 to-blue-600', money: false },
    { key: 'totalRevenue', label: 'Total Revenue', icon: '💰', color: 'from-green-500 to-green-600', money: true },
    { key: 'pendingAmount', label: 'Pending Amount', icon: '⏳', color: 'from-yellow-500 to-yellow-600', money: true },
    { key: 'todayRevenue', label: "Today's Revenue", icon: '📈', color: 'from-purple-500 to-purple-600', money: true },
] as const;

const fmt = (n: number) => `₹${n.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
const fmtDate = (d: string) => new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

const PAYMENT_METHODS: { key: PaymentMethod; label: string }[] = [
    { key: 'cash', label: '💵 Cash' },
    { key: 'card', label: '💳 Card' },
    { key: 'upi', label: '📱 UPI' },
    { key: 'online', label: '🌐 Online' },
];

// ─── Spinner ──────────────────────────────────────────────────────────────────

function Spinner({ color = 'border-blue-500' }: { color?: string }) {
    return <div className={`animate-spin h-5 w-5 rounded-full border-2 ${color} border-t-transparent`} />;
}

// ─── Quick Pay Modal ──────────────────────────────────────────────────────────

function QuickPayModal({
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
            onClick={(e) => e.target === e.currentTarget && onClose()}>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl">×</button>
                <h3 className="text-lg font-bold text-gray-800 mb-0.5">Quick Payment</h3>
                <p className="text-sm text-gray-500 mb-1">
                    Bill: <span className="font-mono font-medium">{bill.billNumber}</span>
                </p>
                <p className="text-sm text-gray-500 mb-4">
                    Patient: <span className="font-medium">{bill.patientName}</span>
                </p>

                {error && <div className="mb-3 bg-red-50 text-red-700 text-sm px-3 py-2 rounded-lg border border-red-100">{error}</div>}

                <label className="block text-sm font-medium text-gray-700 mb-1">Amount (₹)</label>
                <input type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} min={1}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-green-400" />

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
                    {loading ? <><Spinner color="border-white" /> Processing...</> : '✓ Confirm Payment'}
                </button>
            </div>
        </div>
    );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function BillsListPage() {
    const navigate = useNavigate();
    const token = localStorage.getItem('token') || '';

    // Data
    const [bills, setBills] = useState<Bill[]>([]);
    const [stats, setStats] = useState<BillSummaryStats | null>(null);
    const [loadingBills, setLoadingBills] = useState(true);
    const [loadingStats, setLoadingStats] = useState(true);

    // Filters
    const [filters, setFilters] = useState<Filters>({ search: '', status: '', startDate: '', endDate: '' });
    const [applied, setApplied] = useState<Filters>({ search: '', status: '', startDate: '', endDate: '' });

    // Pagination
    const [page, setPage] = useState(1);

    // Pay modal
    const [payBill, setPayBill] = useState<Bill | null>(null);

    // ─── Fetch stats ─────────────────────────────────────────────────────────

    const fetchStats = useCallback(async () => {
        setLoadingStats(true);
        try {
            const res = await fetch(`${API}/billing/stats/summary`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) setStats(await res.json());
        } catch { /* silent */ }
        finally { setLoadingStats(false); }
    }, [token]);

    // ─── Fetch bills ──────────────────────────────────────────────────────────

    const fetchBills = useCallback(async () => {
        setLoadingBills(true);
        try {
            const params = new URLSearchParams();
            if (applied.status) params.set('status', applied.status);
            if (applied.startDate) params.set('startDate', applied.startDate);
            if (applied.endDate) params.set('endDate', applied.endDate);

            const res = await fetch(`${API}/billing?${params}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            setBills(Array.isArray(data) ? data : []);
            setPage(1);
        } catch { setBills([]); }
        finally { setLoadingBills(false); }
    }, [token, applied]);

    useEffect(() => { fetchStats(); }, [fetchStats]);
    useEffect(() => { fetchBills(); }, [fetchBills]);

    // ─── Delete ──────────────────────────────────────────────────────────────

    const handleDelete = async (bill: Bill) => {
        if (!confirm(`Delete bill ${bill.billNumber}?`)) return;
        try {
            const res = await fetch(`${API}/billing/${bill._id}`, {
                method: 'DELETE', headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) { setBills((p) => p.filter((b) => b._id !== bill._id)); fetchStats(); }
        } catch { /* silent */ }
    };

    // ─── Client-side search filter ────────────────────────────────────────────

    const displayed = bills.filter((b) => {
        const q = applied.search.toLowerCase();
        if (!q) return true;
        return b.patientName.toLowerCase().includes(q) || b.billNumber.toLowerCase().includes(q);
    });

    const totalPages = Math.ceil(displayed.length / PER_PAGE) || 1;
    const paginated = displayed.slice((page - 1) * PER_PAGE, page * PER_PAGE);
    const start = (page - 1) * PER_PAGE + 1;
    const end = Math.min(page * PER_PAGE, displayed.length);

    const applyFilters = () => { setApplied({ ...filters }); };
    const clearFilters = () => {
        const empty: Filters = { search: '', status: '', startDate: '', endDate: '' };
        setFilters(empty);
        setApplied(empty);
    };

    // ─── Render ──────────────────────────────────────────────────────────────

    return (
        <div className="min-h-screen bg-gray-50 p-6 space-y-6">

            {/* ── Page Header ──────────────────────────────────────────────────── */}
            <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Billing Management</h1>
                    <p className="text-gray-400 text-sm mt-0.5">View and manage all patient bills</p>
                </div>
                <button onClick={() => navigate('/billing/create')}
                    className="flex items-center gap-2 bg-green-600 text-white px-4 py-2.5 rounded-xl font-medium hover:bg-green-700 transition text-sm shadow-sm">
                    <span className="text-lg leading-none">+</span> Create New Bill
                </button>
            </div>

            {/* ── Stats Row ────────────────────────────────────────────────────── */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {STAT_CARDS.map((card) => (
                    <div key={card.key} className={`bg-gradient-to-br ${card.color} rounded-2xl p-5 text-white shadow-sm`}>
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium opacity-90">{card.label}</span>
                            <span className="text-2xl">{card.icon}</span>
                        </div>
                        {loadingStats ? (
                            <div className="h-8 w-24 bg-white/20 rounded-lg animate-pulse" />
                        ) : (
                            <p className="text-2xl font-black">
                                {card.money
                                    ? `₹${(stats?.[card.key] as number ?? 0).toLocaleString('en-IN')}`
                                    : (stats?.[card.key] ?? 0).toString()
                                }
                            </p>
                        )}
                    </div>
                ))}
            </div>

            {/* ── Filter Bar ───────────────────────────────────────────────────── */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
                <div className="flex flex-wrap gap-3 items-end">

                    {/* Search */}
                    <div className="flex-1 min-w-[200px]">
                        <label className="block text-xs text-gray-500 font-medium mb-1">Search</label>
                        <input
                            value={filters.search}
                            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                            placeholder="Patient name or bill number..."
                            className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                        />
                    </div>

                    {/* Status */}
                    <div className="min-w-[160px]">
                        <label className="block text-xs text-gray-500 font-medium mb-1">Status</label>
                        <select
                            value={filters.status}
                            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                            className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition bg-white"
                        >
                            <option value="">All Statuses</option>
                            <option value="draft">Draft</option>
                            <option value="pending">Pending</option>
                            <option value="paid">Paid</option>
                            <option value="partially_paid">Partially Paid</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                    </div>

                    {/* Start Date */}
                    <div className="min-w-[140px]">
                        <label className="block text-xs text-gray-500 font-medium mb-1">From Date</label>
                        <input type="date" value={filters.startDate}
                            onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                            className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                        />
                    </div>

                    {/* End Date */}
                    <div className="min-w-[140px]">
                        <label className="block text-xs text-gray-500 font-medium mb-1">To Date</label>
                        <input type="date" value={filters.endDate}
                            onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                            className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                        />
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-2 self-end">
                        <button onClick={applyFilters}
                            className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-blue-700 transition">
                            Apply
                        </button>
                        <button onClick={clearFilters}
                            className="bg-gray-100 text-gray-600 px-4 py-2 rounded-xl text-sm font-medium hover:bg-gray-200 transition">
                            Clear
                        </button>
                    </div>
                </div>
            </div>

            {/* ── Bills Table ──────────────────────────────────────────────────── */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {loadingBills ? (
                    <div className="flex items-center justify-center py-20 gap-3 text-gray-400">
                        <Spinner /> <span>Loading bills...</span>
                    </div>
                ) : paginated.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-gray-400 space-y-3">
                        <div className="text-6xl">🧾</div>
                        <p className="font-medium text-gray-500 text-lg">No bills found</p>
                        <p className="text-sm text-center">
                            {applied.search || applied.status ? 'Try clearing your filters.' : 'Create your first bill!'}
                        </p>
                        {!applied.search && !applied.status && (
                            <button onClick={() => navigate('/billing/create')}
                                className="mt-2 bg-green-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-green-700 transition">
                                + Create New Bill
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 border-b border-gray-100 text-xs text-gray-500 uppercase tracking-wide">
                                <tr>
                                    {['Bill No.', 'Patient', 'Date', 'Items', 'Grand Total', 'Paid', 'Balance', 'Status', 'Actions'].map((h) => (
                                        <th key={h} className="px-4 py-3 text-left font-semibold">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {paginated.map((bill) => {
                                    const meta = STATUS_META[bill.status] ?? { label: bill.status, cls: 'bg-gray-100 text-gray-600' };
                                    const canPay = bill.status === 'pending' || bill.status === 'partially_paid';
                                    const canDel = bill.status === 'draft';

                                    return (
                                        <tr key={bill._id} className="hover:bg-gray-50 transition">
                                            {/* Bill Number */}
                                            <td className="px-4 py-3">
                                                <Link to={`/billing/${bill._id}`}
                                                    className="font-mono text-blue-600 hover:underline font-semibold text-xs">
                                                    {bill.billNumber}
                                                </Link>
                                            </td>
                                            {/* Patient */}
                                            <td className="px-4 py-3 font-medium text-gray-800">{bill.patientName}</td>
                                            {/* Date */}
                                            <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{fmtDate(bill.createdAt)}</td>
                                            {/* Items Count */}
                                            <td className="px-4 py-3 text-gray-500 text-center">{bill.items.length}</td>
                                            {/* Grand Total */}
                                            <td className="px-4 py-3 font-semibold text-gray-800">{fmt(bill.grandTotal)}</td>
                                            {/* Amount Paid */}
                                            <td className="px-4 py-3 text-green-600 font-medium">{fmt(bill.amountPaid)}</td>
                                            {/* Balance Due */}
                                            <td className="px-4 py-3">
                                                <span className={`font-semibold ${bill.balanceDue > 0 ? 'text-red-600' : 'text-gray-400'}`}>
                                                    {fmt(bill.balanceDue)}
                                                </span>
                                            </td>
                                            {/* Status */}
                                            <td className="px-4 py-3">
                                                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${meta.cls}`}>
                                                    {meta.label}
                                                </span>
                                            </td>
                                            {/* Actions */}
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-1.5">
                                                    <Link to={`/billing/${bill._id}`}
                                                        className="p-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition" title="View">
                                                        👁️
                                                    </Link>
                                                    {canPay && (
                                                        <button onClick={() => setPayBill(bill)}
                                                            className="p-1.5 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition" title="Pay">
                                                            💰
                                                        </button>
                                                    )}
                                                    {canDel && (
                                                        <button onClick={() => handleDelete(bill)}
                                                            className="p-1.5 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition" title="Delete">
                                                            🗑️
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* ── Pagination ────────────────────────────────────────────────── */}
                {!loadingBills && paginated.length > 0 && (
                    <div className="flex items-center justify-between px-5 py-4 border-t border-gray-100 text-sm text-gray-500">
                        <span>Showing <b className="text-gray-700">{start}–{end}</b> of <b className="text-gray-700">{displayed.length}</b> bills</span>
                        <div className="flex items-center gap-2">
                            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
                                className="px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-100 disabled:opacity-40 transition">
                                ← Prev
                            </button>
                            <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg font-medium">
                                {page} / {totalPages}
                            </span>
                            <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                                className="px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-100 disabled:opacity-40 transition">
                                Next →
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* ── Quick Pay Modal ───────────────────────────────────────────────── */}
            {payBill && (
                <QuickPayModal
                    bill={payBill}
                    onClose={() => setPayBill(null)}
                    onSuccess={() => { fetchBills(); fetchStats(); setPayBill(null); }}
                />
            )}
        </div>
    );
}
