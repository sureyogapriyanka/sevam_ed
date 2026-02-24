import { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// ─── Types ────────────────────────────────────────────────────────────────────

type Status = 'active' | 'completed' | 'cancelled' | 'draft';

interface Prescription {
    _id: string;
    prescriptionNumber: string;
    patientName: string;
    patientId: string | { _id: string; name: string };
    doctorId: string | { _id: string };
    diagnosis: string;
    medicines: { name: string }[];
    followUpDate?: string | null;
    status: Status;
    issuedAt: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const API = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
const token = () => localStorage.getItem('token') || '';
const user = () => { try { return JSON.parse(localStorage.getItem('user') || '{}'); } catch { return {}; } };

const fmtDate = (d: string) =>
    new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

const isToday = (d: string) => {
    const n = new Date(); const t = new Date(d);
    return t.getFullYear() === n.getFullYear() && t.getMonth() === n.getMonth() && t.getDate() === n.getDate();
};
const isThisWeek = (d: string) => { const t = new Date(d); const n = new Date(); const diff = (n.getTime() - t.getTime()) / 864e5; return diff >= 0 && diff < 7; };
const isThisMonth = (d: string) => { const t = new Date(d); const n = new Date(); return t.getFullYear() === n.getFullYear() && t.getMonth() === n.getMonth(); };

const STATUS_STYLE: Record<Status, string> = {
    active: 'bg-green-100 text-green-700',
    completed: 'bg-blue-100 text-blue-700',
    cancelled: 'bg-red-100 text-red-700',
    draft: 'bg-gray-100 text-gray-500',
};

// ─── Skeleton Row ─────────────────────────────────────────────────────────────

function SkeletonRow() {
    return (
        <tr className="border-b border-gray-50">
            {Array.from({ length: 8 }).map((_, i) => (
                <td key={i} className="px-4 py-3"><div className="h-4 bg-gray-100 rounded animate-pulse" style={{ width: `${60 + i * 10}%` }} /></td>
            ))}
        </tr>
    );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function PrescriptionsListPage() {
    const navigate = useNavigate();
    const me = user();

    const [all, setAll] = useState<Prescription[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Filters
    const [search, setSearch] = useState('');
    const [statusF, setStatusF] = useState<'all' | Status>('all');
    const [dateF, setDateF] = useState<'today' | 'week' | 'month' | 'all'>('all');
    const [cancelling, setCancelling] = useState<string | null>(null);

    // ─── Fetch ────────────────────────────────────────────────────────────────

    useEffect(() => {
        (async () => {
            try {
                const res = await fetch(`${API}/prescriptions`, { headers: { Authorization: `Bearer ${token()}` } });
                if (!res.ok) throw new Error();
                setAll(await res.json());
            } catch { setError('Failed to load prescriptions.'); }
            finally { setLoading(false); }
        })();
    }, []);

    // ─── Stats ────────────────────────────────────────────────────────────────

    const stats = useMemo(() => ({
        total: all.length,
        active: all.filter((p) => p.status === 'active').length,
        thisMonth: all.filter((p) => isThisMonth(p.issuedAt)).length,
    }), [all]);

    // ─── Filtered list ────────────────────────────────────────────────────────

    const filtered = useMemo(() => {
        let list = all;
        if (statusF !== 'all') list = list.filter((p) => p.status === statusF);
        if (dateF === 'today') list = list.filter((p) => isToday(p.issuedAt));
        if (dateF === 'week') list = list.filter((p) => isThisWeek(p.issuedAt));
        if (dateF === 'month') list = list.filter((p) => isThisMonth(p.issuedAt));
        if (search.trim()) {
            const q = search.toLowerCase();
            list = list.filter(
                (p) =>
                    p.patientName.toLowerCase().includes(q) ||
                    (p.prescriptionNumber || '').toLowerCase().includes(q)
            );
        }
        return list;
    }, [all, statusF, dateF, search]);

    // ─── Cancel handler ───────────────────────────────────────────────────────

    const handleCancel = async (id: string) => {
        if (!confirm('Cancel this prescription?')) return;
        setCancelling(id);
        try {
            const res = await fetch(`${API}/prescriptions/${id}`, {
                method: 'DELETE', headers: { Authorization: `Bearer ${token()}` },
            });
            if (res.ok) setAll((prev) => prev.map((p) => p._id === id ? { ...p, status: 'cancelled' } : p));
        } finally { setCancelling(null); }
    };

    // ─── Render ───────────────────────────────────────────────────────────────

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8">

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <span className="text-blue-600 font-black italic text-3xl">Rx</span> Prescriptions
                    </h1>
                    <p className="text-gray-400 text-sm">Manage and view all prescriptions</p>
                </div>
                <Link to="/prescriptions/create"
                    className="flex items-center gap-2 bg-green-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-green-700 transition shadow-sm">
                    + Write Prescription
                </Link>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-4 mb-6">
                {[
                    { label: 'Total', value: stats.total, color: 'bg-blue-50   text-blue-700', icon: '📋' },
                    { label: 'Active', value: stats.active, color: 'bg-green-50  text-green-700', icon: '✅' },
                    { label: 'This Month', value: stats.thisMonth, color: 'bg-purple-50 text-purple-700', icon: '📅' },
                ].map((s) => (
                    <div key={s.label} className={`rounded-2xl p-4 flex items-center gap-3 ${s.color}`}>
                        <span className="text-2xl">{s.icon}</span>
                        <div>
                            <p className="text-2xl font-black">{loading ? '—' : s.value}</p>
                            <p className="text-xs font-semibold opacity-70">{s.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Filter Bar */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-4 py-3 mb-5 flex flex-wrap gap-3 items-center">
                <input value={search} onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by patient name or Rx number…"
                    className="flex-1 min-w-[200px] border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />

                <div className="flex gap-1">
                    {(['all', 'active', 'completed', 'cancelled'] as const).map((s) => (
                        <button key={s} onClick={() => setStatusF(s)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition ${statusF === s ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>
                            {s === 'all' ? 'All' : s}
                        </button>
                    ))}
                </div>

                <div className="flex gap-1">
                    {([['today', 'Today'], ['week', 'This Week'], ['month', 'This Month'], ['all', 'All Time']] as const).map(([v, l]) => (
                        <button key={v} onClick={() => setDateF(v)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${dateF === v ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>
                            {l}
                        </button>
                    ))}
                </div>
            </div>

            {/* Table */}
            {error ? (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">{error}</div>
            ) : (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    {['Rx Number', 'Patient', 'Date', 'Diagnosis', 'Medicines', 'Follow-up', 'Status', 'Actions'].map((h) => (
                                        <th key={h} className="px-4 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {loading
                                    ? Array.from({ length: 6 }).map((_, i) => <SkeletonRow key={i} />)
                                    : filtered.length === 0
                                        ? (
                                            <tr>
                                                <td colSpan={8} className="py-20 text-center">
                                                    <p className="text-4xl mb-3">📋</p>
                                                    <p className="text-gray-500 font-medium">No prescriptions found</p>
                                                    <Link to="/prescriptions/create" className="mt-3 inline-block text-blue-600 hover:underline text-sm">
                                                        Write your first prescription
                                                    </Link>
                                                </td>
                                            </tr>
                                        )
                                        : filtered.map((p) => {
                                            const myId = me._id || me.id || '';
                                            const doctorId = typeof p.doctorId === 'object' ? p.doctorId._id : p.doctorId;
                                            const isOwner = String(myId) === String(doctorId);
                                            return (
                                                <tr key={p._id} className="border-b border-gray-50 hover:bg-gray-50 transition">
                                                    <td className="px-4 py-3">
                                                        <Link to={`/prescriptions/${p._id}`}
                                                            className="font-mono font-semibold text-blue-600 hover:underline text-xs">
                                                            {p.prescriptionNumber}
                                                        </Link>
                                                    </td>
                                                    <td className="px-4 py-3 font-medium text-gray-800 whitespace-nowrap">{p.patientName}</td>
                                                    <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{fmtDate(p.issuedAt)}</td>
                                                    <td className="px-4 py-3 text-gray-600 max-w-[180px]">
                                                        <span title={p.diagnosis}>{p.diagnosis.length > 30 ? p.diagnosis.slice(0, 30) + '…' : p.diagnosis}</span>
                                                    </td>
                                                    <td className="px-4 py-3 text-center">
                                                        <span className="bg-blue-50 text-blue-700 font-bold px-2 py-0.5 rounded-full text-xs">{p.medicines.length}</span>
                                                    </td>
                                                    <td className="px-4 py-3 text-gray-500 whitespace-nowrap text-xs">
                                                        {p.followUpDate ? fmtDate(p.followUpDate) : <span className="text-gray-300">None</span>}
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold capitalize ${STATUS_STYLE[p.status]}`}>
                                                            {p.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <div className="flex items-center gap-1.5">
                                                            <Link to={`/prescriptions/${p._id}`}
                                                                className="text-xs bg-blue-50 text-blue-600 px-2.5 py-1 rounded-lg hover:bg-blue-100 transition font-medium">
                                                                View
                                                            </Link>
                                                            <Link to={`/prescriptions/${p._id}`}
                                                                title="Download PDF"
                                                                className="text-xs bg-indigo-50 text-indigo-600 px-2 py-1 rounded-lg hover:bg-indigo-100 transition">
                                                                ⬇️
                                                            </Link>
                                                            {isOwner && p.status === 'active' && (
                                                                <button onClick={() => handleCancel(p._id)}
                                                                    disabled={cancelling === p._id}
                                                                    title="Cancel prescription"
                                                                    className="text-xs bg-red-50 text-red-500 px-2 py-1 rounded-lg hover:bg-red-100 transition disabled:opacity-50">
                                                                    {cancelling === p._id ? '…' : '✕'}
                                                                </button>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                }
                            </tbody>
                        </table>
                    </div>
                    {!loading && filtered.length > 0 && (
                        <div className="px-4 py-2 border-t border-gray-50 text-xs text-gray-400">
                            Showing {filtered.length} of {all.length} prescriptions
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
