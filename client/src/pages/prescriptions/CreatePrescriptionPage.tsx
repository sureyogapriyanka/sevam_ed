import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

// ─── Types ────────────────────────────────────────────────────────────────────

type Timing = 'before_meal' | 'after_meal' | 'with_meal' | 'empty_stomach' | 'bedtime';

interface Medicine {
    id: string; // local only
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
    timing: Timing;
    instructions: string;
}

interface Patient {
    _id: string;
    name: string;
    age?: number;
    gender?: string;
    bloodGroup?: string;
    phone?: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const API = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const FREQUENCY_OPTIONS = [
    'Once daily', 'Twice daily', 'Three times daily',
    'Four times daily', 'Every 6 hours', 'Every 8 hours',
    'As needed', 'At bedtime',
];

const TIMING_OPTIONS: { value: Timing; label: string }[] = [
    { value: 'after_meal', label: 'After meal' },
    { value: 'before_meal', label: 'Before meal' },
    { value: 'with_meal', label: 'With meal' },
    { value: 'empty_stomach', label: 'Empty stomach' },
    { value: 'bedtime', label: 'Bedtime' },
];

const QUICK_TESTS = ['Blood Test', 'Urine Test', 'X-Ray', 'ECG', 'MRI', 'CT Scan', 'Ultrasound', 'Blood Sugar'];

const uid = () => Math.random().toString(36).slice(2, 9);

const newMed = (): Medicine => ({
    id: uid(), name: '', dosage: '', frequency: 'Twice daily',
    duration: '', timing: 'after_meal', instructions: '',
});

// ─── Main Component ───────────────────────────────────────────────────────────

export default function CreatePrescriptionPage() {
    const navigate = useNavigate();
    const [params] = useSearchParams();
    const appointmentId = params.get('appointmentId') || '';
    const token = localStorage.getItem('token') || '';

    // Patient state
    const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<Patient[]>([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [patientLoading, setPatientLoading] = useState(false);
    const [allPatients, setAllPatients] = useState<Patient[]>([]);

    // Diagnosis
    const [chiefComplaint, setChiefComplaint] = useState('');
    const [diagnosis, setDiagnosis] = useState('');
    const [notes, setNotes] = useState('');

    // Lab tests
    const [testInput, setTestInput] = useState('');
    const [labTests, setLabTests] = useState<string[]>([]);

    // Follow-up
    const [followUpDate, setFollowUpDate] = useState('');
    const [followUpNotes, setFollowUpNotes] = useState('');

    // Medicines
    const [medicines, setMedicines] = useState<Medicine[]>([newMed()]);

    // Submission
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    // ─── Auto-fetch patient from appointment ────────────────────────────────────

    useEffect(() => {
        if (!appointmentId) return;
        const fetchAppt = async () => {
            setPatientLoading(true);
            try {
                const res = await fetch(`${API}/appointments/${appointmentId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (!res.ok) return;
                const appt = await res.json();
                const p = typeof appt.patientId === 'object' ? appt.patientId : null;
                if (p) setSelectedPatient({ _id: p._id, name: p.name, age: p.age, gender: p.gender, bloodGroup: p.bloodGroup, phone: p.phone });
            } catch { /* silent */ }
            finally { setPatientLoading(false); }
        };
        fetchAppt();
    }, [appointmentId, token]);

    // Load all patients once for fast local search (normalise userId.name → name)
    useEffect(() => {
        const load = async () => {
            try {
                const res = await fetch(`${API}/patients`, { headers: { Authorization: `Bearer ${token}` } });
                if (!res.ok) return;
                const data = await res.json();
                const normalised: Patient[] = (Array.isArray(data) ? data : []).map((p: any) => ({
                    _id: p._id,
                    name: p.userId?.name || p.name || 'Unknown',
                    age: p.userId?.age || p.age,
                    gender: p.userId?.gender || p.gender,
                    bloodGroup: p.userId?.bloodGroup || p.bloodGroup || p.bloodType,
                    phone: p.userId?.phone || p.phone
                }));
                setAllPatients(normalised);
            } catch { /* silent */ }
        };
        load();
    }, [token]);

    // Local search filter
    useEffect(() => {
        if (!searchQuery.trim()) { setSearchResults([]); setShowDropdown(false); return; }
        const q = searchQuery.toLowerCase();
        const filtered = allPatients.filter(p =>
            p.name.toLowerCase().includes(q) || (p.phone && p.phone.includes(searchQuery))
        ).slice(0, 8);
        setSearchResults(filtered);
        setShowDropdown(filtered.length > 0);
    }, [searchQuery, allPatients]);

    // ─── Medicine helpers ────────────────────────────────────────────────────────

    const updateMed = (id: string, field: keyof Medicine, value: string) =>
        setMedicines((prev) => prev.map((m) => m.id === id ? { ...m, [field]: value } : m));

    const removeMed = (id: string) =>
        setMedicines((prev) => prev.length > 1 ? prev.filter((m) => m.id !== id) : prev);

    // ─── Lab test helpers ────────────────────────────────────────────────────────

    const addTest = (t: string) => {
        const val = t.trim();
        if (val && !labTests.includes(val)) setLabTests((p) => [...p, val]);
        setTestInput('');
    };

    const removeTest = (t: string) => setLabTests((p) => p.filter((x) => x !== t));

    // ─── Validation ──────────────────────────────────────────────────────────────

    const validate = (): string => {
        if (!selectedPatient) return 'Please select a patient.';
        if (!chiefComplaint.trim()) return 'Chief complaint is required.';
        if (!diagnosis.trim()) return 'Diagnosis is required.';
        for (const m of medicines) {
            if (!m.name.trim()) return 'Each medicine must have a name.';
            if (!m.dosage.trim()) return 'Each medicine must have a dosage.';
            if (!m.frequency.trim()) return 'Each medicine must have a frequency.';
            if (!m.duration.trim()) return 'Each medicine must have a duration.';
        }
        return '';
    };

    // ─── Submit ──────────────────────────────────────────────────────────────────

    const handleSubmit = async (status: 'active' | 'draft') => {
        const err = validate();
        if (err) { setError(err); return; }
        setError('');
        setSubmitting(true);
        try {
            const payload = {
                patientId: selectedPatient!._id,
                patientName: selectedPatient!.name,
                patientAge: selectedPatient!.age || undefined,
                patientGender: selectedPatient!.gender || '',
                patientBloodGroup: selectedPatient!.bloodGroup || '',
                appointmentId: appointmentId || undefined,
                chiefComplaint,
                diagnosis,
                notes,
                medicines: medicines.map(({ id: _id, ...rest }) => rest),
                labTests,
                followUpDate: followUpDate || undefined,
                followUpNotes,
                status,
            };

            const res = await fetch(`${API}/prescriptions`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify(payload),
            });
            const data = await res.json();
            if (!res.ok) { setError(data.message || 'Failed to create prescription.'); return; }
            navigate(`/prescriptions/${data._id}`);
        } catch {
            setError('Network error. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    // ─── Render ──────────────────────────────────────────────────────────────────

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Page Header */}
            <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center gap-4 sticky top-0 z-10">
                <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-gray-600 transition text-sm flex items-center gap-1">
                    ← Back
                </button>
                <div>
                    <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <span className="text-blue-600 text-2xl font-black italic">Rx</span> Write Prescription
                    </h1>
                    <p className="text-gray-400 text-xs">Fill in all details to issue a prescription</p>
                </div>
            </div>

            {error && (
                <div className="mx-6 mt-4 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">
                    {error}
                </div>
            )}

            <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* ══ LEFT COLUMN ══════════════════════════════════════════════════════ */}
                <div className="space-y-5">

                    {/* Patient Selection */}
                    <Section title="👤 Patient">
                        {patientLoading ? (
                            <div className="h-12 bg-gray-100 rounded-xl animate-pulse" />
                        ) : selectedPatient ? (
                            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex justify-between items-start">
                                <div>
                                    <p className="font-bold text-blue-900">{selectedPatient.name}</p>
                                    <p className="text-blue-600 text-sm mt-0.5 space-x-3">
                                        {selectedPatient.age && <span>Age: {selectedPatient.age}</span>}
                                        {selectedPatient.gender && <span>{selectedPatient.gender}</span>}
                                        {selectedPatient.bloodGroup && <span>🩸 {selectedPatient.bloodGroup}</span>}
                                        {selectedPatient.phone && <span>📞 {selectedPatient.phone}</span>}
                                    </p>
                                </div>
                                {!appointmentId && (
                                    <button onClick={() => { setSelectedPatient(null); setSearchQuery(''); }}
                                        className="text-blue-400 hover:text-red-500 text-xl leading-none">×</button>
                                )}
                            </div>
                        ) : (
                            <div className="relative">
                                <input
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search patient by name..."
                                    className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                                />
                                {showDropdown && searchResults.length > 0 && (
                                    <div className="absolute z-20 top-full left-0 right-0 bg-white border border-gray-200 rounded-xl shadow-lg mt-1 overflow-hidden">
                                        {searchResults.map((p) => (
                                            <button key={p._id} type="button"
                                                onClick={() => { setSelectedPatient(p); setShowDropdown(false); setSearchQuery(''); }}
                                                className="w-full text-left px-4 py-3 hover:bg-blue-50 border-b border-gray-50 last:border-0 text-sm">
                                                <p className="font-medium text-gray-800">{p.name}</p>
                                                <p className="text-gray-400 text-xs">{[p.age && `${p.age}y`, p.gender, p.phone].filter(Boolean).join(' · ')}</p>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </Section>

                    {/* Clinical Notes */}
                    <Section title="🩺 Clinical Notes">
                        <div className="space-y-3">
                            <div>
                                <label className="block text-xs text-gray-500 font-medium mb-1">Chief Complaint <span className="text-red-500">*</span></label>
                                <textarea rows={2} value={chiefComplaint} onChange={(e) => setChiefComplaint(e.target.value)}
                                    placeholder="What brings the patient in today?"
                                    className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
                            </div>
                            <div>
                                <label className="block text-xs text-gray-500 font-medium mb-1">Diagnosis / Impression <span className="text-red-500">*</span></label>
                                <textarea rows={2} value={diagnosis} onChange={(e) => setDiagnosis(e.target.value)}
                                    placeholder="Diagnosis / Impression"
                                    className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
                            </div>
                            <div>
                                <label className="block text-xs text-gray-500 font-medium mb-1">Additional Notes</label>
                                <textarea rows={2} value={notes} onChange={(e) => setNotes(e.target.value)}
                                    placeholder="Extra notes..."
                                    className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
                            </div>
                        </div>
                    </Section>

                    {/* Lab Tests */}
                    <Section title="🔬 Lab Tests Ordered">
                        <div className="flex gap-2 mb-3">
                            <input value={testInput} onChange={(e) => setTestInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTest(testInput))}
                                placeholder="Add a test..."
                                className="flex-1 border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            <button onClick={() => addTest(testInput)}
                                className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-blue-700 transition">Add</button>
                        </div>

                        {/* Quick-add chips */}
                        <div className="flex flex-wrap gap-2 mb-3">
                            {QUICK_TESTS.map((t) => (
                                <button key={t} onClick={() => addTest(t)} type="button"
                                    className={`px-3 py-1 rounded-full text-xs font-medium border transition ${labTests.includes(t) ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-200 text-gray-500 hover:border-blue-400 hover:text-blue-600'
                                        }`}>
                                    {t}
                                </button>
                            ))}
                        </div>

                        {/* Added tests */}
                        {labTests.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {labTests.map((t) => (
                                    <span key={t} className="flex items-center gap-1 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">
                                        {t}
                                        <button onClick={() => removeTest(t)} className="text-blue-400 hover:text-red-500 ml-0.5">×</button>
                                    </span>
                                ))}
                            </div>
                        )}
                    </Section>

                    {/* Follow-up */}
                    <Section title="📅 Follow-up">
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-xs text-gray-500 font-medium mb-1">Follow-up Date</label>
                                <input type="date" value={followUpDate} onChange={(e) => setFollowUpDate(e.target.value)}
                                    className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>
                            <div>
                                <label className="block text-xs text-gray-500 font-medium mb-1">Follow-up Notes</label>
                                <input value={followUpNotes} onChange={(e) => setFollowUpNotes(e.target.value)}
                                    placeholder="Follow-up notes..."
                                    className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>
                        </div>
                    </Section>
                </div>

                {/* ══ RIGHT COLUMN ══════════════════════════════════════════════════════ */}
                <div className="space-y-5">

                    {/* Medicines */}
                    <Section title="💊 Medicines Prescribed">
                        <div className="space-y-3">
                            {medicines.map((med, idx) => (
                                <div key={med.id} className="bg-gray-50 border border-gray-200 rounded-2xl p-4 relative">
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Medicine #{idx + 1}</span>
                                        {medicines.length > 1 && (
                                            <button onClick={() => removeMed(med.id)}
                                                className="text-red-400 hover:text-red-600 text-lg leading-none font-bold transition">×</button>
                                        )}
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="col-span-2">
                                            <label className="block text-xs text-gray-500 font-medium mb-1">Medicine Name <span className="text-red-500">*</span></label>
                                            <input value={med.name} onChange={(e) => updateMed(med.id, 'name', e.target.value)}
                                                placeholder="e.g. Paracetamol"
                                                className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                        </div>
                                        <div>
                                            <label className="block text-xs text-gray-500 font-medium mb-1">Dosage <span className="text-red-500">*</span></label>
                                            <input value={med.dosage} onChange={(e) => updateMed(med.id, 'dosage', e.target.value)}
                                                placeholder="e.g. 500mg"
                                                className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                        </div>
                                        <div>
                                            <label className="block text-xs text-gray-500 font-medium mb-1">Duration <span className="text-red-500">*</span></label>
                                            <input value={med.duration} onChange={(e) => updateMed(med.id, 'duration', e.target.value)}
                                                placeholder="e.g. 5 days"
                                                className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                        </div>
                                        <div>
                                            <label className="block text-xs text-gray-500 font-medium mb-1">Frequency <span className="text-red-500">*</span></label>
                                            <select value={med.frequency} onChange={(e) => updateMed(med.id, 'frequency', e.target.value)}
                                                className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                                                {FREQUENCY_OPTIONS.map((f) => <option key={f} value={f}>{f}</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs text-gray-500 font-medium mb-1">Timing</label>
                                            <select value={med.timing} onChange={(e) => updateMed(med.id, 'timing', e.target.value as Timing)}
                                                className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                                                {TIMING_OPTIONS.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                                            </select>
                                        </div>
                                        <div className="col-span-2">
                                            <label className="block text-xs text-gray-500 font-medium mb-1">Special Instructions</label>
                                            <input value={med.instructions} onChange={(e) => updateMed(med.id, 'instructions', e.target.value)}
                                                placeholder="e.g. Shake well before use"
                                                className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                        </div>
                                    </div>
                                </div>
                            ))}

                            <button onClick={() => setMedicines((p) => [...p, newMed()])} type="button"
                                className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-blue-300 text-blue-600 py-3 rounded-2xl text-sm font-medium hover:border-blue-500 hover:bg-blue-50 transition">
                                + Add Medicine
                            </button>
                        </div>
                    </Section>

                    {/* Action Buttons */}
                    <div className="flex gap-3 sticky bottom-6">
                        <button onClick={() => handleSubmit('draft')} disabled={submitting}
                            className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold text-sm hover:bg-gray-200 transition disabled:opacity-60">
                            Save Draft
                        </button>
                        <button onClick={() => handleSubmit('active')} disabled={submitting}
                            className="flex-1 flex items-center justify-center gap-2 py-3 bg-green-600 text-white rounded-xl font-semibold text-sm hover:bg-green-700 transition disabled:opacity-60">
                            {submitting && <div className="animate-spin h-4 w-4 rounded-full border-2 border-white border-t-transparent" />}
                            {submitting ? 'Issuing…' : '✓ Issue Prescription'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ─── Helper Component ─────────────────────────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-5 py-3 border-b border-gray-100">
                <h3 className="font-semibold text-gray-700 text-sm">{title}</h3>
            </div>
            <div className="p-5">{children}</div>
        </div>
    );
}
