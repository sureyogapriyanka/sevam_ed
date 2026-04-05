import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Clock, Search as SearchIcon, Loader2 } from 'lucide-react';
import { apiCall } from '../../utils/api';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';

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
    const [selectedPatient, setSelectedPatient] = React.useState<Patient | null>(null);
    const [searchQuery, setSearchQuery] = React.useState('');
    const [searchResults, setSearchResults] = React.useState<Patient[]>([]);
    const [showDropdown, setShowDropdown] = React.useState(false);
    const [patientLoading, setPatientLoading] = React.useState(false);
    const [allPatients, setAllPatients] = React.useState<Patient[]>([]);

    // Diagnosis
    const [chiefComplaint, setChiefComplaint] = React.useState('');
    const [diagnosis, setDiagnosis] = React.useState('');
    const [notes, setNotes] = React.useState('');

    // Lab tests
    const [testInput, setTestInput] = React.useState('');
    const [labTests, setLabTests] = React.useState<string[]>([]);

    // Follow-up
    const [followUpDate, setFollowUpDate] = React.useState('');
    const [followUpNotes, setFollowUpNotes] = React.useState('');

    // Medicines
    const [medicines, setMedicines] = React.useState<Medicine[]>([newMed()]);

    // Submission
    const [submitting, setSubmitting] = React.useState(false);
    const [error, setError] = React.useState('');

    // ─── Auto-fetch patient from appointment ────────────────────────────────────

    React.useEffect(() => {
        if (!appointmentId) return;
        const fetchAppt = async () => {
            setPatientLoading(true);
            try {
                const appt = await apiCall(`/appointments/${appointmentId}`);
                if (!appt) return;
                const p = typeof appt.patientId === 'object' ? appt.patientId : null;
                if (p) setSelectedPatient({ _id: p._id, name: p.name, age: p.age, gender: p.gender, bloodGroup: p.bloodGroup, phone: p.phone });
            } catch (err) {
                console.error("Failed to fetch appointment context", err);
            } finally {
                setPatientLoading(false);
            }
        };
        fetchAppt();
    }, [appointmentId, token]);

    // Load initial patients for fast cache
    React.useEffect(() => {
        const load = async () => {
            try {
                const data = await apiCall('/patients');
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
    }, []);

    // Integrated search (local cache + remote fallback)
    React.useEffect(() => {
        if (!searchQuery.trim()) { setSearchResults([]); setShowDropdown(false); return; }
        
        const q = searchQuery.toLowerCase();
        
        // 1. Local filter
        const filtered = allPatients.filter(p =>
            p.name.toLowerCase().includes(q) || (p.phone && p.phone.includes(q))
        ).slice(0, 8);
        
        if (filtered.length > 0) {
            setSearchResults(filtered);
            setShowDropdown(true);
        } else if (searchQuery.length > 2) {
            // 2. Remote fallback if not found in initial 50
            const delayDebounceFn = setTimeout(async () => {
                try {
                    const data = await apiCall(`/patients?search=${searchQuery}`);
                    const remoteResults = (Array.isArray(data) ? data : []).map((p: any) => ({
                        _id: p._id,
                        name: p.userId?.name || p.name || 'Unknown',
                        age: p.userId?.age || p.age,
                        gender: p.userId?.gender || p.gender,
                        bloodGroup: p.userId?.bloodGroup || p.bloodGroup || p.bloodType,
                        phone: p.userId?.phone || p.phone
                    }));
                    setSearchResults(remoteResults);
                    setShowDropdown(remoteResults.length > 0);
                } catch { /* silent */ }
            }, 500);
            return () => clearTimeout(delayDebounceFn);
        } else {
            setSearchResults([]);
            setShowDropdown(false);
        }
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

            // AUTOMATIC WORKFLOW COMPLETION: Mark appointment as completed
            if (appointmentId && status === 'active') {
                try {
                    await apiCall(`/flow/end-consultation/${appointmentId}`, {
                        method: 'POST',
                        body: JSON.stringify({ 
                            prescriptionId: data._id,
                            diagnosis,
                            notes,
                            treatmentPlan: 'Prescription Issued' 
                        })
                    });
                } catch (flowErr) {
                    console.error("Failed to sync flow completion", flowErr);
                    // Do not block since prescription is already created
                }
            }

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

            <div className="max-w-screen-2xl mx-auto px-4 md:px-6 py-6 h-[calc(100vh-80px)]">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">

                    {/* ══ LEFT COLUMN: FORM ═════════════════════════════════════════════════ */}
                    <div className="space-y-5 overflow-y-auto pr-2 custom-scrollbar">

                        {/* Patient Selection */}
                        <Section title="👤 Patient Details">
                            {patientLoading ? (
                                <div className="h-12 bg-gray-100 rounded-xl animate-pulse" />
                            ) : selectedPatient ? (
                                <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex justify-between items-start">
                                    <div>
                                        <p className="font-bold text-blue-900">{selectedPatient.name}</p>
                                        <p className="text-blue-600 text-xs mt-0.5 space-x-3">
                                            {selectedPatient.age && <span>Age: {selectedPatient.age}</span>}
                                            {selectedPatient.gender && <span>{selectedPatient.gender}</span>}
                                            {selectedPatient.bloodGroup && <span>🩸 {selectedPatient.bloodGroup}</span>}
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
                                        placeholder="Search patient..."
                                        className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                                    />
                                    {showDropdown && searchResults.length > 0 && (
                                        <div className="absolute z-[100] top-full left-0 right-0 bg-white border-2 border-blue-100 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] mt-2 overflow-hidden max-h-80 overflow-y-auto custom-scrollbar animate-in fade-in slide-in-from-top-2 duration-200">
                                            {searchResults.map((p) => (
                                                <button key={p._id} type="button"
                                                    onClick={() => { setSelectedPatient(p); setShowDropdown(false); setSearchQuery(''); }}
                                                    className="w-full text-left px-5 py-4 hover:bg-blue-50 border-b border-slate-50 last:border-0 transition-colors group">
                                                    <div className="flex justify-between items-center">
                                                        <p className="font-black text-slate-800 group-hover:text-blue-600 uppercase text-sm">{p.name}</p>
                                                        <Badge variant="outline" className="text-[8px] font-black uppercase text-slate-400 border-slate-200">ID: {p._id.slice(-6).toUpperCase()}</Badge>
                                                    </div>
                                                    <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mt-1">
                                                        {[p.age && `${p.age} Years`, p.gender, p.bloodGroup && `Blood: ${p.bloodGroup}`].filter(Boolean).join(' · ')}
                                                    </p>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </Section>

                        {/* Clinical Notes */}
                        <Section title="🩺 Clinical Observations">
                            <div className="space-y-3">
                                <div>
                                    <label className="block text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1">Chief Complaint</label>
                                    <textarea rows={2} value={chiefComplaint} onChange={(e) => setChiefComplaint(e.target.value)}
                                        placeholder="Reason for visit..."
                                        className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
                                </div>
                                <div>
                                    <label className="block text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1">Diagnosis</label>
                                    <textarea rows={2} value={diagnosis} onChange={(e) => setDiagnosis(e.target.value)}
                                        placeholder="Primary diagnosis..."
                                        className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
                                </div>
                            </div>
                        </Section>

                        {/* Medicines */}
                        <Section title="💊 Medication (Rx)">
                            <div className="space-y-4">
                                {medicines.map((med, idx) => (
                                    <div key={med.id} className="bg-slate-50 border border-slate-200 rounded-2xl p-6 relative group">
                                        <div className="flex items-center justify-between mb-4">
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Medicine #{idx + 1}</span>
                                            {medicines.length > 1 && (
                                                <button onClick={() => removeMed(med.id)}
                                                    className="text-slate-300 hover:text-rose-500 transition-colors">×</button>
                                            )}
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="col-span-2">
                                                <label className="block text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1.5">Medicine Name</label>
                                                <input value={med.name} onChange={(e) => updateMed(med.id, 'name', e.target.value)}
                                                    placeholder="Enter medicine..."
                                                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition" />
                                            </div>
                                            <div>
                                                <label className="block text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1.5">Dosage</label>
                                                <input value={med.dosage} onChange={(e) => updateMed(med.id, 'dosage', e.target.value)}
                                                    placeholder="e.g. 500mg"
                                                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition" />
                                            </div>
                                            <div>
                                                <label className="block text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1.5">Duration</label>
                                                <input value={med.duration} onChange={(e) => updateMed(med.id, 'duration', e.target.value)}
                                                    placeholder="e.g. 5 Days"
                                                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition" />
                                            </div>
                                            <div>
                                                <label className="block text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1.5">Frequency</label>
                                                <select value={med.frequency} onChange={(e) => updateMed(med.id, 'frequency', e.target.value)}
                                                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm bg-white outline-none transition">
                                                    {FREQUENCY_OPTIONS.map((f) => <option key={f} value={f}>{f}</option>)}
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1.5">Timing</label>
                                                <select value={med.timing} onChange={(e) => updateMed(med.id, 'timing', e.target.value as Timing)}
                                                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm bg-white outline-none transition">
                                                    {TIMING_OPTIONS.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                <button onClick={() => setMedicines((p) => [...p, newMed()])} type="button"
                                    className="w-full py-4 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 text-xs font-black uppercase tracking-widest hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50/50 transition-all">
                                    + Add Medication
                                </button>
                            </div>
                        </Section>

                        {/* Lab Tests */}
                        <Section title="🔬 Diagnostic Orders">
                            <div className="flex gap-2 mb-4">
                                <input value={testInput} onChange={(e) => setTestInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTest(testInput))}
                                    placeholder="Add test..."
                                    className="flex-1 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                                <button onClick={() => addTest(testInput)}
                                    className="bg-slate-900 text-white px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-black transition">Add</button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {QUICK_TESTS.map((t) => (
                                    <button key={t} onClick={() => addTest(t)} type="button"
                                        className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border transition ${labTests.includes(t) ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-400 border-slate-100 hover:border-blue-200 hover:text-blue-600'
                                            }`}>
                                        {t}
                                    </button>
                                ))}
                            </div>
                        </Section>

                        {/* Footer Actions */}
                        <div className="flex gap-4 pt-4 sticky bottom-0 bg-gray-50 pb-6">
                            <button onClick={() => handleSubmit('draft')} disabled={submitting}
                                className="flex-1 py-4 bg-white border border-slate-200 text-slate-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition active:scale-95 disabled:opacity-50">
                                Save Draft
                            </button>
                            <button onClick={() => handleSubmit('active')} disabled={submitting}
                                className="flex-[2] py-4 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 shadow-xl shadow-blue-500/20 transition active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2">
                                {submitting ? 'Processing...' : 'Issue Prescription'}
                            </button>
                        </div>
                    </div>

                    {/* ══ RIGHT COLUMN: LIVE PREVIEW ═════════════════════════════════════════ */}
                    <div className="hidden lg:block h-full">
                        <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-blue-900/5 border border-slate-200 h-full flex flex-col overflow-hidden relative">
                            {/* Paper Effect */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/50 rounded-bl-[5rem] -mr-16 -mt-16 pointer-events-none" />
                            
                            <div className="p-10 flex-1 overflow-y-auto custom-scrollbar relative">
                                {/* Header */}
                                <div className="flex justify-between items-start mb-10">
                                    <div>
                                        <h2 className="text-2xl font-black text-blue-900 leading-none">Rx PREVIEW</h2>
                                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] mt-2">Professional Medical Document</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-black text-slate-900">SevaOnline Hospital</p>
                                        <p className="text-[10px] font-bold text-slate-400">Clinical Department</p>
                                    </div>
                                </div>

                                <div className="space-y-8">
                                    {/* Patient Strip */}
                                    <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 flex justify-between items-center">
                                        <div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Patient</p>
                                            <p className="text-lg font-black text-slate-900">{selectedPatient?.name || '—'}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</p>
                                            <p className="text-sm font-bold text-slate-600">{new Date().toLocaleDateString()}</p>
                                        </div>
                                    </div>

                                    {/* Clinical Info */}
                                    <div className="grid grid-cols-2 gap-8">
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Chief Complaint</p>
                                            <p className="text-xs font-bold text-slate-700 leading-loose">{chiefComplaint || '—'}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Clinical Diagnosis</p>
                                            <p className="text-xs font-black text-blue-600 leading-loose uppercase italic">{diagnosis || '—'}</p>
                                        </div>
                                    </div>

                                    {/* Watermark Rx */}
                                    <div className="flex items-center gap-4 py-4">
                                        <span className="text-6xl font-black italic text-slate-100 select-none">Rx</span>
                                        <div className="h-px flex-1 bg-slate-100" />
                                    </div>

                                    {/* Medicines */}
                                    <div className="space-y-6">
                                        {medicines.filter(m => m.name).length === 0 ? (
                                            <div className="py-10 text-center border-2 border-dashed border-slate-50 rounded-3xl">
                                                <p className="text-xs font-bold text-slate-300 uppercase tracking-widest italic">No medications listed</p>
                                            </div>
                                        ) : (
                                            medicines.filter(m => m.name).map((med, i) => (
                                                <div key={i} className="flex gap-4">
                                                    <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-xs font-black shrink-0 border border-blue-100">
                                                        {i + 1}
                                                    </div>
                                                    <div className="flex-1 space-y-1">
                                                        <div className="flex items-baseline justify-between gap-4">
                                                            <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight">{med.name}</h4>
                                                            <div className="h-px flex-1 bg-slate-50" />
                                                            <span className="text-[10px] font-black text-blue-500 uppercase">{med.dosage}</span>
                                                        </div>
                                                        <div className="flex items-center gap-4">
                                                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                                                                <Clock className="h-3 w-3" /> {med.frequency} · {med.duration}
                                                            </p>
                                                            <span className="w-1 h-1 bg-slate-200 rounded-full" />
                                                            <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest">{med.timing.replace('_', ' ')}</p>
                                                        </div>
                                                        {med.instructions && (
                                                            <p className="text-[10px] text-slate-400 italic">" {med.instructions} "</p>
                                                        )}
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>

                                    {/* Lab Tests */}
                                    {labTests.length > 0 && (
                                        <div className="pt-8 border-t border-slate-100">
                                            <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-4">Diagnostic Recommendations</p>
                                            <div className="flex flex-wrap gap-3">
                                                {labTests.map(t => (
                                                    <div key={t} className="px-3 py-1.5 bg-slate-50 rounded-xl text-[10px] font-bold text-slate-600 border border-slate-100">
                                                        🔬 {t}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Doc Footer */}
                                <div className="mt-16 text-center">
                                    <div className="inline-block px-8 py-px bg-slate-100 rounded-full mb-2" />
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Medical Signature Required</p>
                                    <p className="text-[9px] text-slate-300 mt-4 italic">SevaOnline Secure Clinical Portal ― Document Hash: {Math.random().toString(36).substring(7).toUpperCase()}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ─── Helper Component ─────────────────────────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="px-5 py-3 border-b border-gray-100">
                <h3 className="font-semibold text-gray-700 text-sm">{title}</h3>
            </div>
            <div className="p-5">{children}</div>
        </div>
    );
}
