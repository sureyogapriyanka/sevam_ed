import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// ─── Types ────────────────────────────────────────────────────────────────────

type Status = 'active' | 'completed' | 'cancelled' | 'draft';

interface Medicine {
    name: string; dosage: string; frequency: string;
    duration: string; timing: string; instructions: string;
}

interface Prescription {
    _id: string;
    prescriptionNumber: string;
    patientName: string;
    doctorName: string;
    doctorSpecialization?: string;
    chiefComplaint: string;
    diagnosis: string;
    medicines: Medicine[];
    labTests: string[];
    followUpDate?: string | null;
    followUpNotes?: string;
    status: Status;
    issuedAt: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const API = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
const token = () => localStorage.getItem('token') || '';

const fmtDate = (d: string) =>
    new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

const daysFromNow = (d: string) => {
    const diff = new Date(d).getTime() - Date.now();
    return Math.ceil(diff / 864e5);
};

const STATUS_STYLE: Record<Status, string> = {
    active: 'bg-green-100 text-green-700',
    completed: 'bg-blue-100 text-blue-700',
    cancelled: 'bg-red-100 text-red-700',
    draft: 'bg-gray-100 text-gray-500',
};

// ─── Skeleton Card ────────────────────────────────────────────────────────────

function SkeletonCard() {
    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4 animate-pulse">
            <div className="flex justify-between">
                <div className="h-4 bg-gray-100 rounded w-24" />
                <div className="h-4 bg-gray-100 rounded w-20" />
            </div>
            <div className="h-5 bg-gray-100 rounded w-40" />
            <div className="space-y-2">
                <div className="h-3 bg-gray-100 rounded w-full" />
                <div className="h-3 bg-gray-100 rounded w-3/4" />
            </div>
            <div className="flex gap-2">
                {[1, 2, 3].map((i) => <div key={i} className="h-6 bg-gray-100 rounded-full w-20" />)}
            </div>
        </div>
    );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function PatientPrescriptionsPage() {
    const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Get patientId from stored user
    const me = (() => { try { return JSON.parse(localStorage.getItem('user') || '{}'); } catch { return {}; } })();
    const patientId = me._id || me.id || '';

    // ─── Fetch ────────────────────────────────────────────────────────────────

    useEffect(() => {
        if (!patientId) { setLoading(false); setError('Could not determine patient ID.'); return; }
        (async () => {
            try {
                const res = await fetch(`${API}/prescriptions/patient/${patientId}`, {
                    headers: { Authorization: `Bearer ${token()}` },
                });
                if (!res.ok) throw new Error();
                setPrescriptions(await res.json());
            } catch { setError('Failed to load your prescriptions.'); }
            finally { setLoading(false); }
        })();
    }, [patientId]);

    // ─── Render ───────────────────────────────────────────────────────────────

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8 max-w-3xl mx-auto">

            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <span className="text-blue-600 font-black italic text-3xl">Rx</span> My Prescriptions
                </h1>
                <p className="text-gray-400 text-sm">View your prescription history</p>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm mb-4">{error}</div>
            )}

            {/* Loading */}
            {loading && (
                <div className="space-y-4">
                    {Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)}
                </div>
            )}

            {/* Empty State */}
            {!loading && !error && prescriptions.length === 0 && (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm py-20 text-center">
                    <p className="text-5xl mb-4">🏥</p>
                    <p className="text-gray-600 font-semibold text-lg">No prescriptions yet</p>
                    <p className="text-gray-400 text-sm mt-2 max-w-xs mx-auto">
                        Your doctor will add prescriptions after your consultation.
                    </p>
                </div>
            )}

            {/* Prescription Cards */}
            {!loading && prescriptions.length > 0 && (
                <div className="space-y-4">
                    {prescriptions.map((p) => {
                        const followDays = p.followUpDate ? daysFromNow(p.followUpDate) : null;
                        const followUrgent = followDays !== null && followDays >= 0 && followDays <= 3;

                        return (
                            <div key={p._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

                                {/* Card Header */}
                                <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-gray-50">
                                    <div className="flex items-center gap-2">
                                        <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg">
                                            {p.prescriptionNumber}
                                        </span>
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold capitalize ${STATUS_STYLE[p.status]}`}>
                                            {p.status}
                                        </span>
                                    </div>
                                    <span className="text-xs text-gray-400">{fmtDate(p.issuedAt)}</span>
                                </div>

                                <div className="px-5 py-4 space-y-3">

                                    {/* Doctor Info */}
                                    <div>
                                        <p className="font-bold text-gray-800">Dr. {p.doctorName}</p>
                                        {p.doctorSpecialization && (
                                            <p className="text-gray-400 text-xs">{p.doctorSpecialization}</p>
                                        )}
                                    </div>

                                    {/* Diagnosis */}
                                    <div className="space-y-1 text-sm">
                                        <div className="flex gap-2">
                                            <span className="text-gray-400 min-w-[110px] text-xs">Chief Complaint</span>
                                            <span className="text-gray-700">{p.chiefComplaint}</span>
                                        </div>
                                        <div className="flex gap-2">
                                            <span className="text-gray-400 min-w-[110px] text-xs">Diagnosis</span>
                                            <span className="text-gray-800 font-semibold">{p.diagnosis}</span>
                                        </div>
                                    </div>

                                    {/* Medicines as pills */}
                                    {p.medicines.length > 0 && (
                                        <div>
                                            <p className="text-xs text-gray-400 font-semibold mb-1.5 uppercase tracking-wider">Medicines</p>
                                            <div className="flex flex-wrap gap-2">
                                                {p.medicines.map((m, i) => (
                                                    <span key={i}
                                                        className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-medium border border-blue-100"
                                                        title={`${m.frequency} · ${m.duration} · ${m.timing}`}>
                                                        💊 {m.name} {m.dosage}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Lab Tests */}
                                    {p.labTests.length > 0 && (
                                        <div>
                                            <p className="text-xs text-gray-400 font-semibold mb-1.5 uppercase tracking-wider">Lab Tests</p>
                                            <div className="flex flex-wrap gap-2">
                                                {p.labTests.map((t, i) => (
                                                    <span key={i} className="bg-purple-50 text-purple-700 px-2.5 py-1 rounded-full text-xs font-medium">
                                                        🔬 {t}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Follow-up */}
                                    {p.followUpDate && (
                                        <div className={`rounded-xl px-3 py-2 text-sm ${followUrgent ? 'bg-orange-50 text-orange-700' : 'bg-gray-50 text-gray-600'}`}>
                                            {followUrgent && <span className="font-bold">⚠️ </span>}
                                            <span className="font-medium">Follow-up:</span> {fmtDate(p.followUpDate)}
                                            {followDays === 0 && <span className="ml-1 text-xs font-bold">(Today!)</span>}
                                            {followDays === 1 && <span className="ml-1 text-xs font-bold">(Tomorrow)</span>}
                                            {followDays !== null && followDays > 1 && followDays <= 3 && <span className="ml-1 text-xs font-bold">(In {followDays} days)</span>}
                                            {p.followUpNotes && <p className="text-xs mt-0.5 opacity-75">{p.followUpNotes}</p>}
                                        </div>
                                    )}

                                    {/* Action Buttons */}
                                    <div className="flex gap-3 pt-1">
                                        <Link to={`/prescriptions/${p._id}`}
                                            className="flex-1 text-center py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition">
                                            View Full Prescription
                                        </Link>
                                        <Link to={`/prescriptions/${p._id}`}
                                            className="flex items-center gap-1.5 px-4 py-2 bg-gray-100 text-gray-600 rounded-xl text-sm font-semibold hover:bg-gray-200 transition">
                                            ⬇️ PDF
                                        </Link>
                                    </div>

                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
