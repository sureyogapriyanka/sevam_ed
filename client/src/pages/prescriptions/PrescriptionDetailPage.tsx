import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// ─── Types ────────────────────────────────────────────────────────────────────

type PrescStatus = 'active' | 'completed' | 'cancelled' | 'draft';
type Timing = 'before_meal' | 'after_meal' | 'with_meal' | 'empty_stomach' | 'bedtime';

interface Medicine {
    name: string; dosage: string; frequency: string;
    duration: string; timing: Timing; instructions: string;
}

interface Prescription {
    _id: string;
    prescriptionNumber: string;
    patientId: string | { _id: string; name: string };
    patientName: string;
    patientAge?: number;
    patientGender?: string;
    patientBloodGroup?: string;
    doctorName: string;
    doctorSpecialization?: string;
    doctorPhone?: string;
    doctorId: string | { _id: string };
    appointmentId?: string | null;
    chiefComplaint: string;
    diagnosis: string;
    notes?: string;
    medicines: Medicine[];
    labTests: string[];
    followUpDate?: string | null;
    followUpNotes?: string;
    status: PrescStatus;
    issuedAt: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const API = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const STATUS_STYLE: Record<PrescStatus, string> = {
    active: 'bg-green-100 text-green-700',
    completed: 'bg-blue-100 text-blue-700',
    cancelled: 'bg-red-100 text-red-700',
    draft: 'bg-gray-100 text-gray-600',
};

const TIMING_STYLE: Record<Timing, { label: string; cls: string }> = {
    after_meal: { label: 'After meal', cls: 'bg-green-100 text-green-700' },
    before_meal: { label: 'Before meal', cls: 'bg-blue-100 text-blue-700' },
    with_meal: { label: 'With meal', cls: 'bg-yellow-100 text-yellow-700' },
    empty_stomach: { label: 'Empty stomach', cls: 'bg-orange-100 text-orange-700' },
    bedtime: { label: 'Bedtime', cls: 'bg-purple-100 text-purple-700' },
};

const fmtDate = (d: string) =>
    new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

// ─── Main Component ───────────────────────────────────────────────────────────

export default function PrescriptionDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const token = localStorage.getItem('token') || '';
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

    const [presc, setPresc] = useState<Prescription | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [pdfing, setPdfing] = useState(false);
    const [copied, setCopied] = useState(false);

    const prescriptionRef = useRef<HTMLDivElement>(null);

    // ─── Fetch ──────────────────────────────────────────────────────────────────

    const fetchPresc = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API}/prescriptions/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) { setError('Prescription not found.'); return; }
            setPresc(await res.json());
        } catch { setError('Failed to load prescription.'); }
        finally { setLoading(false); }
    }, [id, token]);

    useEffect(() => { fetchPresc(); }, [fetchPresc]);

    // ─── PDF Generation ──────────────────────────────────────────────────────────

    const generatePDF = async () => {
        if (!prescriptionRef.current || !presc) return;
        setPdfing(true);
        try {
            const canvas = await html2canvas(prescriptionRef.current, { scale: 2, useCORS: true, logging: false });
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const imgW = 210;
            const imgH = (canvas.height * imgW) / canvas.width;
            pdf.addImage(imgData, 'PNG', 0, 0, imgW, imgH);
            pdf.save(`Prescription-${presc.prescriptionNumber}.pdf`);
        } finally {
            setPdfing(false);
        }
    };

    // ─── Share ──────────────────────────────────────────────────────────────────

    const handleShare = async () => {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    // ─── Loading / Error ────────────────────────────────────────────────────────

    if (loading) return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="text-center space-y-3">
                <div className="mx-auto w-8 h-8 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
                <p className="text-gray-400 text-sm">Loading prescription...</p>
            </div>
        </div>
    );

    if (error || !presc) return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="text-center space-y-3">
                <div className="text-5xl">📋</div>
                <p className="text-gray-600 font-medium">{error || 'Prescription not found'}</p>
                <Link to="/prescriptions" className="text-blue-600 hover:underline text-sm">← Back</Link>
            </div>
        </div>
    );

    const doctorId = typeof presc.doctorId === 'object' ? presc.doctorId._id : presc.doctorId;
    const isOwner = String(currentUser.id) === String(doctorId) || String(currentUser._id) === String(doctorId);
    const canEdit = isOwner && presc.status === 'active';

    // ─── Render ─────────────────────────────────────────────────────────────────

    return (
        <>
            <style>{`
        @media print {
          .no-print { display: none !important; }
          .print-doc { box-shadow: none !important; border: none !important; }
          body { background: white !important; }
        }
      `}</style>

            <div className="min-h-screen bg-gray-50 p-4 md:p-8">

                {/* ── ACTION BAR ─────────────────────────────────────────────────── */}
                <div className="no-print flex flex-wrap items-center gap-3 mb-6">
                    <Link to="/prescriptions" className="text-gray-400 hover:text-gray-600 text-sm flex items-center gap-1">
                        ← Back
                    </Link>
                    <div className="flex items-center gap-2">
                        <span className="font-mono text-sm font-semibold text-gray-700">{presc.prescriptionNumber}</span>
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${STATUS_STYLE[presc.status]}`}>
                            {presc.status.charAt(0).toUpperCase() + presc.status.slice(1)}
                        </span>
                    </div>
                    <div className="ml-auto flex flex-wrap gap-2">
                        <button onClick={() => window.print()}
                            className="flex items-center gap-1.5 bg-gray-700 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition">
                            🖨️ Print
                        </button>
                        <button onClick={generatePDF} disabled={pdfing}
                            className="flex items-center gap-1.5 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition disabled:opacity-60">
                            {pdfing ? '...' : '⬇️ Download PDF'}
                        </button>
                        <button onClick={handleShare}
                            className="flex items-center gap-1.5 bg-white border border-gray-200 text-gray-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition">
                            {copied ? '✓ Copied!' : '🔗 Share'}
                        </button>
                    </div>
                </div>

                {/* ── PRESCRIPTION DOCUMENT ──────────────────────────────────────── */}
                <div ref={prescriptionRef}
                    className="print-doc max-w-3xl mx-auto bg-white rounded-2xl shadow-md overflow-hidden relative">

                    {/* Watermark */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
                        <span className="text-[200px] font-black italic text-gray-100 leading-none">Rx</span>
                    </div>

                    <div className="relative z-10">

                        {/* ── HEADER ─────────────────────────────────────────────────── */}
                        <div className="px-8 pt-8 pb-4">
                            <div className="flex justify-between items-start">
                                {/* Doctor info */}
                                <div>
                                    <h1 className="text-2xl font-black text-blue-900">Dr. {presc.doctorName}</h1>
                                    {presc.doctorSpecialization && (
                                        <p className="text-gray-500 text-sm">{presc.doctorSpecialization}</p>
                                    )}
                                    {presc.doctorPhone && (
                                        <p className="text-gray-400 text-sm">📞 {presc.doctorPhone}</p>
                                    )}
                                </div>
                                {/* Hospital info */}
                                <div className="text-right">
                                    <p className="font-bold text-gray-800">SevaOnline Hospital</p>
                                    <p className="text-gray-400 text-xs">123 Medical Street, Healthcare City</p>
                                    <p className="text-gray-500 text-sm mt-1">{fmtDate(presc.issuedAt)}</p>
                                </div>
                            </div>
                            {/* Divider */}
                            <div className="mt-4 h-1 bg-gradient-to-r from-blue-600 to-blue-400 rounded-full" />
                        </div>

                        {/* ── PATIENT INFO STRIP ──────────────────────────────────────── */}
                        <div className="bg-gray-50 mx-8 rounded-xl px-5 py-3 flex flex-wrap gap-4 text-sm">
                            <span><span className="text-gray-400">Patient:</span> <b className="text-gray-800">{presc.patientName}</b></span>
                            {presc.patientAge && <span><span className="text-gray-400">Age:</span> <b>{presc.patientAge} yrs</b></span>}
                            {presc.patientGender && <span><span className="text-gray-400">Gender:</span> <b>{presc.patientGender}</b></span>}
                            {presc.patientBloodGroup && <span><span className="text-gray-400">Blood Group:</span> <b className="text-red-600">{presc.patientBloodGroup}</b></span>}
                            <span className="ml-auto"><span className="text-gray-400">Rx No:</span> <b className="font-mono text-blue-700">{presc.prescriptionNumber}</b></span>
                        </div>

                        <div className="px-8 py-5 space-y-5">

                            {/* ── DIAGNOSIS ────────────────────────────────────────────── */}
                            <div className="space-y-2">
                                <DocRow label="Chief Complaint" value={presc.chiefComplaint} />
                                <DocRow label="Diagnosis" value={presc.diagnosis} bold />
                                {presc.notes && <DocRow label="Notes" value={presc.notes} />}
                            </div>

                            {/* ── MEDICINES TABLE ───────────────────────────────────────── */}
                            <div>
                                <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                                    <span>💊</span> Medicines Prescribed
                                </h3>
                                <div className="overflow-x-auto rounded-xl border border-gray-100">
                                    <table className="w-full text-sm">
                                        <thead className="bg-blue-600 text-white text-xs">
                                            <tr>
                                                {['#', 'Medicine', 'Dosage', 'Frequency', 'Duration', 'Timing', 'Instructions'].map((h) => (
                                                    <th key={h} className="px-3 py-2.5 text-left font-semibold">{h}</th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {presc.medicines.map((med, i) => {
                                                const tm = TIMING_STYLE[med.timing] ?? { label: med.timing, cls: 'bg-gray-100 text-gray-600' };
                                                return (
                                                    <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                                        <td className="px-3 py-2.5 text-gray-400 font-mono text-xs">{i + 1}</td>
                                                        <td className="px-3 py-2.5 font-semibold text-gray-800">{med.name}</td>
                                                        <td className="px-3 py-2.5 text-gray-600">{med.dosage}</td>
                                                        <td className="px-3 py-2.5 text-gray-600">{med.frequency}</td>
                                                        <td className="px-3 py-2.5 text-gray-600">{med.duration}</td>
                                                        <td className="px-3 py-2.5">
                                                            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${tm.cls}`}>{tm.label}</span>
                                                        </td>
                                                        <td className="px-3 py-2.5 text-gray-400 italic text-xs">{med.instructions || '—'}</td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* ── LAB TESTS ────────────────────────────────────────────── */}
                            {presc.labTests.length > 0 && (
                                <div>
                                    <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                                        <span>🔬</span> Lab Tests Ordered
                                    </h3>
                                    <ol className="space-y-1">
                                        {presc.labTests.map((t, i) => (
                                            <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
                                                <span className="text-blue-400">☐</span>
                                                <span>{i + 1}. {t}</span>
                                            </li>
                                        ))}
                                    </ol>
                                </div>
                            )}

                            {/* ── FOLLOW-UP ────────────────────────────────────────────── */}
                            {presc.followUpDate && (
                                <div className="bg-blue-50 rounded-xl px-4 py-3">
                                    <p className="text-sm font-semibold text-blue-800">
                                        📅 Follow-up on: {fmtDate(presc.followUpDate)}
                                    </p>
                                    {presc.followUpNotes && (
                                        <p className="text-blue-600 text-sm mt-1">{presc.followUpNotes}</p>
                                    )}
                                </div>
                            )}

                            {/* ── FOOTER ───────────────────────────────────────────────── */}
                            <div className="border-t border-gray-100 pt-4 space-y-1 text-center">
                                <p className="text-gray-400 text-xs">This prescription is computer generated and valid without signature</p>
                                <p className="text-gray-500 text-xs font-medium">Dr. {presc.doctorName} · SevaOnline Hospital</p>
                                <p className="text-gray-300 text-xs">Issued via SevaOnline HMS</p>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

// ─── Helper ───────────────────────────────────────────────────────────────────

function DocRow({ label, value, bold = false }: { label: string; value: string; bold?: boolean }) {
    return (
        <div className="flex gap-2 text-sm">
            <span className="text-gray-400 min-w-[130px] shrink-0">{label}:</span>
            <span className={`text-gray-800 ${bold ? 'font-bold' : ''}`}>{value}</span>
        </div>
    );
}
