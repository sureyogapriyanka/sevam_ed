import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
    Thermometer,
    Activity,
    Heart,
    Wind,
    Scale,
    Save,
    ArrowLeft,
    UserCircle,
    Search,
    AlertTriangle,
    CheckCircle,
    Ruler
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from "../../components/ui/dialog";
import { toast } from "../../hooks/use-toast";
import { apiRequest, queryClient } from "../../lib/queryClient";

// --- CUSTOM COMPONENTS ---

export function VitalsModal({ isOpen, onClose, patientId: initialPatientId }: { isOpen: boolean, onClose: () => void, patientId?: string }) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0 border-none bg-slate-50">
                <div className="p-6">
                    <RecordVitalsForm initialPatientId={initialPatientId} onCancel={onClose} onSuccess={onClose} isModal={true} />
                </div>
            </DialogContent>
        </Dialog>
    );
}

// --- MAIN SUB-COMPONENT (FORM) ---

function RecordVitalsForm({ initialPatientId, onCancel, onSuccess, isModal }: any) {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const patientIdFromUrl = searchParams.get('patientId');
    const targetPatientId = initialPatientId || patientIdFromUrl;

    const [selectedPatientId, setSelectedPatientId] = useState(targetPatientId || "");
    const [searchQuery, setSearchQuery] = useState("");
    const [showCriticalWarning, setShowCriticalWarning] = useState(false);

    const [formData, setFormData] = useState({
        systolic: "",
        diastolic: "",
        temperature: "",
        tempUnit: "C",
        pulse: "",
        spO2: "",
        respiratoryRate: "",
        weight: "",
        height: "",
        notes: "",
        wardId: "",
        bedNumber: ""
    });

    // Fetch Patients for selection
    const { data: allPatients = [] } = useQuery<any[]>({
        queryKey: ["/api/patients"],
    });

    // Fetch Wards for dropdown
    const { data: wards = [] } = useQuery<any[]>({
        queryKey: ["/api/wards"],
    });

    const filteredPatients = useMemo(() => {
        if (!searchQuery) return [];
        return allPatients.filter(p =>
            p.userId?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.id.toLowerCase().includes(searchQuery.toLowerCase())
        ).slice(0, 5);
    }, [allPatients, searchQuery]);

    const selectedPatient = useMemo(() => {
        return allPatients.find(p => p.id === selectedPatientId);
    }, [allPatients, selectedPatientId]);

    // --- LIVE STATUS LOGIC ---

    const statuses = useMemo(() => {
        let bp = { label: "Normal", color: "text-emerald-600", bg: "bg-emerald-50", level: "normal" };
        const sys = parseInt(formData.systolic);
        const dia = parseInt(formData.diastolic);
        if (sys >= 180 || dia >= 120) bp = { label: "CRITICAL", color: "text-white", bg: "bg-rose-600", level: "critical" };
        else if (sys >= 140 || dia >= 90) bp = { label: "HIGH", color: "text-amber-700", bg: "bg-amber-50", level: "high" };
        else if (sys < 90 || dia < 60) bp = { label: "LOW", color: "text-blue-700", bg: "bg-blue-50", level: "low" };

        let temp = { label: "Normal", color: "text-emerald-600", bg: "bg-emerald-50" };
        const tVal = parseFloat(formData.temperature);
        if (tVal > 39.5) temp = { label: "HIGH FEVER", color: "text-white", bg: "bg-rose-600" };
        else if (tVal > 37.5) temp = { label: "FEVER", color: "text-amber-700", bg: "bg-amber-50" };
        else if (tVal < 35 && formData.temperature) temp = { label: "HYPOTHERMIA", color: "text-blue-700", bg: "bg-blue-50" };

        let spo2 = { label: "Normal", color: "text-emerald-600", bg: "bg-emerald-50" };
        const sVal = parseInt(formData.spO2);
        if (sVal < 90) spo2 = { label: "CRITICAL", color: "text-white", bg: "bg-rose-600" };
        else if (sVal < 95) spo2 = { label: "LOW", color: "text-amber-700", bg: "bg-amber-50" };

        let pulse = { label: "Normal", color: "text-emerald-600", bg: "bg-emerald-50" };
        const pVal = parseInt(formData.pulse);
        if (pVal > 100) pulse = { label: "HIGH", color: "text-amber-700", bg: "bg-amber-50" };
        else if (pVal < 60 && formData.pulse) pulse = { label: "LOW", color: "text-blue-700", bg: "bg-blue-50" };

        const hasCritical = bp.level === 'critical' || temp.label === 'HIGH FEVER' || spo2.label === 'CRITICAL';

        return { bp, temp, spo2, pulse, hasCritical };
    }, [formData]);

    const bmi = useMemo(() => {
        const w = parseFloat(formData.weight);
        const h = parseFloat(formData.height);
        if (w && h) return (w / Math.pow(h / 100, 2)).toFixed(1);
        return null;
    }, [formData.weight, formData.height]);

    const mutation = useMutation({
        mutationFn: async (data: any) => apiRequest("POST", "/api/vitals", data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/vitals/alerts"] });
            toast({ title: "Vitals Recorded", description: "Patient metrics have been saved successfully." });
            if (onSuccess) onSuccess();
            else navigate('/nurse/dashboard');
        },
        onError: (err: any) => {
            toast({ title: "Submission Failed", description: err.message, variant: "destructive" });
        }
    });

    const triggerSubmit = () => {
        const data = {
            patientId: selectedPatientId,
            patientName: selectedPatient?.userId?.name,
            wardId: formData.wardId,
            bedNumber: formData.bedNumber,
            bloodPressure: {
                systolic: parseInt(formData.systolic),
                diastolic: parseInt(formData.diastolic)
            },
            temperature: {
                value: formData.tempUnit === 'F' ? (parseFloat(formData.temperature) - 32) * 5 / 9 : parseFloat(formData.temperature),
                unit: 'C'
            },
            pulse: { value: parseInt(formData.pulse) },
            spO2: { value: parseInt(formData.spO2) },
            respiratoryRate: { value: parseInt(formData.respiratoryRate) },
            weight: parseFloat(formData.weight),
            height: parseFloat(formData.height),
            notes: formData.notes
        };
        mutation.mutate(data);
    };

    const handleActualSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedPatientId) return toast({ title: "No Patient Selected", variant: "destructive" });
        if (statuses.hasCritical) setShowCriticalWarning(true);
        else triggerSubmit();
    };

    return (
        <div className="space-y-6">
            {!isModal && (
                <div className="flex items-center gap-4 mb-8">
                    <Button variant="ghost" size="icon" onClick={() => onCancel ? onCancel() : navigate(-1)}>
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Record Clinical Vitals</h1>
                        <p className="text-slate-500 font-medium">Real-time health metric recording and alert tracking.</p>
                    </div>
                </div>
            )}

            {/* PATIENT SELECTION */}
            {!targetPatientId && (
                <Card className="border-none shadow-sm relative z-50">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-bold flex items-center gap-2">
                            <Search className="w-4 h-4 text-blue-600" />
                            Step 1: Patient Selection
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="relative">
                            <Input
                                placeholder="Search by name or ID..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="h-11 pl-10 bg-slate-50 border-slate-200"
                            />
                            <Search className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />

                            {filteredPatients.length > 0 && (
                                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-100 rounded-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2">
                                    {filteredPatients.map(p => (
                                        <button
                                            key={p.id}
                                            className="w-full text-left p-4 hover:bg-blue-50 transition-colors flex items-center justify-between group"
                                            onClick={() => {
                                                setSelectedPatientId(p.id);
                                                setSearchQuery("");
                                            }}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold group-hover:bg-blue-600 group-hover:text-white transition-all">
                                                    {p.userId?.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-900">{p.userId?.name}</p>
                                                    <p className="text-[10px] font-bold text-slate-400">ID: {p.id.slice(-6).toUpperCase()} · {p.userId?.age}y · {p.userId?.gender}</p>
                                                </div>
                                            </div>
                                            <Badge variant="outline" className="text-[10px] font-bold">Select</Badge>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            )}

            <form onSubmit={handleActualSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-10">
                <div className="lg:col-span-2 space-y-6">
                    {/* VITALS ENTRY FORM GRID */}
                    <Card className="border-none shadow-sm overflow-hidden">
                        <CardHeader className="bg-slate-50/50 border-b border-slate-100">
                            <CardTitle className="text-base font-bold flex items-center gap-2">
                                <Activity className="w-5 h-5 text-rose-500" />
                                Step 2: Vital Observations
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-8 grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-8">

                            {/* BP */}
                            <div className="space-y-4">
                                <Label className="flex items-center justify-between">
                                    <span className="font-black text-slate-700 uppercase tracking-wider text-[11px]">Blood Pressure (mmHg)</span>
                                    <Badge className={`${statuses.bp.bg} ${statuses.bp.color} border-none font-black text-[9px] h-4`}>{statuses.bp.label}</Badge>
                                </Label>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="relative">
                                        <Input type="number" required placeholder="Sys" value={formData.systolic} onChange={e => setFormData({ ...formData, systolic: e.target.value })} className="h-11 bg-slate-50 font-bold text-lg text-center" />
                                        <p className="absolute bottom-1 right-2 text-[9px] font-bold text-slate-300">SYS</p>
                                    </div>
                                    <div className="relative">
                                        <Input type="number" required placeholder="Dia" value={formData.diastolic} onChange={e => setFormData({ ...formData, diastolic: e.target.value })} className="h-11 bg-slate-50 font-bold text-lg text-center" />
                                        <p className="absolute bottom-1 right-2 text-[9px] font-bold text-slate-300">DIA</p>
                                    </div>
                                </div>
                            </div>

                            {/* SpO2 */}
                            <div className="space-y-4">
                                <Label className="flex items-center justify-between">
                                    <span className="font-black text-slate-700 uppercase tracking-wider text-[11px]">Oxygen Saturation (%)</span>
                                    <Badge className={`${statuses.spo2.bg} ${statuses.spo2.color} border-none font-black text-[9px] h-4`}>{statuses.spo2.label}</Badge>
                                </Label>
                                <div className="relative">
                                    <Wind className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
                                    <Input type="number" required placeholder="98" value={formData.spO2} onChange={e => setFormData({ ...formData, spO2: e.target.value })} className="h-11 pl-10 bg-slate-50 font-bold text-lg" />
                                    <div className="absolute right-0 bottom-[-6px] left-0 h-1 bg-slate-100 rounded-full overflow-hidden">
                                        <div className={`h-full transition-all duration-500 ${parseInt(formData.spO2) < 90 ? 'bg-rose-500' : parseInt(formData.spO2) < 95 ? 'bg-amber-400' : 'bg-emerald-500'}`} style={{ width: `${Math.min(100, parseInt(formData.spO2) || 0)}%` }}></div>
                                    </div>
                                </div>
                            </div>

                            {/* Temperature */}
                            <div className="space-y-4">
                                <Label className="flex items-center justify-between">
                                    <span className="font-black text-slate-700 uppercase tracking-wider text-[11px]">Body Temperature</span>
                                    <Badge className={`${statuses.temp.bg} ${statuses.temp.color} border-none font-black text-[9px] h-4`}>{statuses.temp.label}</Badge>
                                </Label>
                                <div className="flex gap-2">
                                    <div className="relative flex-1">
                                        <Thermometer className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
                                        <Input type="number" step="0.1" required placeholder="36.5" value={formData.temperature} onChange={e => setFormData({ ...formData, temperature: e.target.value })} className="h-11 pl-10 bg-slate-50 font-bold text-lg" />
                                    </div>
                                    <select
                                        className="h-11 px-3 rounded-lg border border-slate-200 bg-white font-bold text-sm"
                                        value={formData.tempUnit}
                                        onChange={e => setFormData({ ...formData, tempUnit: e.target.value })}
                                    >
                                        <option value="C">°C</option>
                                        <option value="F">°F</option>
                                    </select>
                                </div>
                            </div>

                            {/* Pulse */}
                            <div className="space-y-4">
                                <Label className="flex items-center justify-between">
                                    <span className="font-black text-slate-700 uppercase tracking-wider text-[11px]">Pulse Rate (bpm)</span>
                                    <Badge className={`${statuses.pulse.bg} ${statuses.pulse.color} border-none font-black text-[9px] h-4`}>{statuses.pulse.label}</Badge>
                                </Label>
                                <div className="relative">
                                    <Heart className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
                                    <Input type="number" required placeholder="72" value={formData.pulse} onChange={e => setFormData({ ...formData, pulse: e.target.value })} className="h-11 pl-10 bg-slate-50 font-bold text-lg" />
                                </div>
                            </div>

                        </CardContent>
                    </Card>

                    {/* OPTIONAL FIELDS */}
                    <Card className="border-none shadow-sm overflow-hidden">
                        <CardHeader className="bg-slate-50/50 border-b border-slate-100">
                            <CardTitle className="text-sm font-bold flex items-center gap-2">
                                <Ruler className="w-4 h-4 text-indigo-500" />
                                Physical Metrics & Notes
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-8 space-y-8">
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                <div className="space-y-2">
                                    <Label className="font-bold text-slate-600 text-xs">Weight (kg)</Label>
                                    <div className="relative">
                                        <Scale className="absolute left-3 top-3 w-4 h-4 text-slate-300" />
                                        <Input type="number" step="0.1" placeholder="70" value={formData.weight} onChange={e => setFormData({ ...formData, weight: e.target.value })} className="pl-10 h-10 bg-slate-50" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="font-bold text-slate-600 text-xs">Height (cm)</Label>
                                    <div className="relative">
                                        <Ruler className="absolute left-3 top-3 w-4 h-4 text-slate-300" />
                                        <Input type="number" placeholder="175" value={formData.height} onChange={e => setFormData({ ...formData, height: e.target.value })} className="pl-10 h-10 bg-slate-50" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="font-bold text-slate-600 text-xs">Resp. Rate (bpm)</Label>
                                    <div className="relative">
                                        <Wind className="absolute left-3 top-3 w-4 h-4 text-slate-300" />
                                        <Input type="number" placeholder="16" value={formData.respiratoryRate} onChange={e => setFormData({ ...formData, respiratoryRate: e.target.value })} className="pl-10 h-10 bg-slate-50" />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label className="font-bold text-slate-600 text-xs">Clinical Observations / Notes</Label>
                                <Textarea
                                    placeholder="Add any specific nursing observations..."
                                    className="min-h-[100px] bg-slate-50 border-slate-200"
                                    value={formData.notes}
                                    onChange={e => setFormData({ ...formData, notes: e.target.value })}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* SUMMARY RIGHT PANEL */}
                <div className="lg:col-span-1 space-y-6">
                    {/* Patient Info Sticker */}
                    <Card className="border-none shadow-md bg-white">
                        <CardHeader className="pb-3 border-b border-slate-50">
                            <CardTitle className="text-xs font-black text-slate-400 uppercase tracking-widest">Target Patient</CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            {selectedPatient ? (
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-blue-200">
                                        {selectedPatient.userId?.name.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="text-xl font-black text-slate-900 leading-none mb-1">{selectedPatient.userId?.name}</p>
                                        <div className="flex gap-2 items-center">
                                            <Badge variant="outline" className="text-[10px] font-bold h-5">{selectedPatient.userId?.age}y · {selectedPatient.userId?.gender}</Badge>
                                            <p className="text-[11px] font-bold text-slate-400"># {selectedPatient.id.slice(-6).toUpperCase()}</p>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-6">
                                    <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <UserCircle className="w-6 h-6 text-slate-300" />
                                    </div>
                                    <p className="text-slate-400 font-bold text-sm italic">No Patient Selected</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Calculations Sidebar */}
                    <Card className="border-none shadow-sm bg-indigo-50/50">
                        <CardHeader>
                            <CardTitle className="text-xs font-black text-indigo-400 uppercase tracking-widest">Status Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 space-y-6">
                            <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-indigo-100/50">
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase">Calculated BMI</p>
                                    <p className="text-2xl font-black text-slate-900">{bmi || '--'}</p>
                                </div>
                                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                                    <Scale size={20} />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <p className="text-[10px] font-bold text-slate-400 uppercase">Vital Indicators</p>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between text-[11px] font-bold p-2 bg-white rounded-lg border border-slate-100">
                                        <span className="text-slate-500">BP Status</span>
                                        <span className={statuses.bp.color}>{statuses.bp.label}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-[11px] font-bold p-2 bg-white rounded-lg border border-slate-100">
                                        <span className="text-slate-500">Temp Status</span>
                                        <span className={statuses.temp.color}>{statuses.temp.label}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-[11px] font-bold p-2 bg-white rounded-lg border border-slate-100">
                                        <span className="text-slate-500">Oxygen (SpO2)</span>
                                        <span className={statuses.spo2.color}>{statuses.spo2.label}</span>
                                    </div>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                disabled={mutation.isPending || !selectedPatientId}
                                className={`w-full h-14 font-black transition-all ${statuses.hasCritical ? 'bg-rose-600 hover:bg-rose-700' : 'bg-blue-600 hover:bg-blue-700'} shadow-lg`}
                            >
                                {mutation.isPending ? "SAVING..." : (
                                    <span className="flex items-center gap-2">
                                        <Save size={20} />
                                        RECORD VITALS
                                    </span>
                                )}
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </form>

            {/* CRITICAL WARNING DIALOG */}
            <Dialog open={showCriticalWarning} onOpenChange={setShowCriticalWarning}>
                <DialogContent className="border-rose-200">
                    <DialogHeader>
                        <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mb-4">
                            <AlertTriangle className="w-8 h-8 text-rose-600 animate-pulse" />
                        </div>
                        <DialogTitle className="text-2xl font-black text-slate-900">Critical Vitals Alert!</DialogTitle>
                        <DialogDescription className="text-slate-500 text-base py-2">
                            The metrics you've entered for <span className="font-bold text-slate-900">{selectedPatient?.userId?.name}</span> fall into the CRITICAL range. This will trigger emergency system-wide alerts for Doctors and Senior Staff.
                            <br /><br />
                            Are you certain these values are accurate?
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-3 mt-4">
                        <Button variant="outline" className="font-bold" onClick={() => setShowCriticalWarning(false)}>RE-CHECK VITALS</Button>
                        <Button className="bg-rose-600 hover:bg-rose-700 font-bold" onClick={() => {
                            setShowCriticalWarning(false);
                            triggerSubmit();
                        }}>PROCEED & ALERT STAFF</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default function RecordVitalsPage() {
    return (
        <div className="container mx-auto py-6">
            <RecordVitalsForm />
        </div>
    );
}
