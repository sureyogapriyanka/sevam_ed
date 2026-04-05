import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiCall } from '../../utils/api';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Badge } from '../../components/ui/badge';
import { Label } from '../../components/ui/label';
import { useToast } from '../../hooks/use-toast';
import MedicalReportForm from '../../components/doctor/MedicalReportForm';
import {
    Stethoscope,
    History,
    Activity,
    Heart,
    Thermometer,
    Wind,
    Scale,
    FileText,
    Pill,
    CheckCircle2,
    ArrowLeft
} from 'lucide-react';
import AppointmentFlowStatus from '../../components/AppointmentFlowStatus';

const ConsultationPage: React.FC = () => {
    const { appointmentId } = useParams<{ appointmentId: string }>();
    const navigate = useNavigate();
    const { toast } = useToast();
    const [diagnosis, setDiagnosis] = useState('');
    const [treatmentPlan, setTreatmentPlan] = useState('');
    const [notes, setNotes] = useState('');
    const [prescriptionId, setPrescriptionId] = useState<string | null>(null);
    const [showReportForm, setShowReportForm] = useState(false);

    // Fetch Full Appointment Data including Vitals and History
    const { data: appointment, isLoading } = useQuery<any>({
        queryKey: [`/api/appointments/${appointmentId}`],
        queryFn: () => apiCall(`/appointments/${appointmentId}`),
    });

    const endConsultationMutation = useMutation({
        mutationFn: () => apiCall(`/flow/end-consultation/${appointmentId}`, {
            method: 'POST',
            body: JSON.stringify({
                diagnosis,
                treatmentPlan,
                notes,
                prescriptionId
            })
        }),
        onSuccess: () => {
            toast({
                title: "Consultation Complete",
                description: "Session saved. Reception has been notified for billing.",
            });
            navigate('/doctor/overview');
        }
    });

    const generateReportMutation = useMutation({
        mutationFn: (reportData: any) => apiCall(`/flow/report/${appointmentId}`, {
            method: 'POST',
            body: JSON.stringify({ reportData })
        }),
        onSuccess: () => {
            toast({
                title: "Report Generated",
                description: "Official PDF has been created and saved to patient records.",
            });
            endConsultationMutation.mutate();
        }
    });

    if (isLoading) return <div className="p-20 text-center font-black animate-pulse">LOADING CLINICAL DATA...</div>;

    const vitals = appointment?.vitalsId || {};

    return (
        <div className="space-y-6 pb-20 max-w-7xl mx-auto">
            {/* Header / Workflow Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-[2rem] border-2 border-slate-100 shadow-sm">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => navigate('/doctor/overview')} className="rounded-full">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                            <Stethoscope className="h-6 w-6 text-blue-600" />
                            Active Consultation
                        </h1>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">
                            Patient: {appointment?.patientId?.name} · Token: {appointment?.tokenNumber}
                        </p>
                    </div>
                </div>
                <div className="min-w-[400px]">
                    <AppointmentFlowStatus currentStatus="consulting" />
                </div>
            </div>

            {showReportForm ? (
                <div className="animate-in fade-in slide-in-from-bottom-10 duration-700">
                    <div className="flex justify-center mb-8">
                        <Button variant="ghost" onClick={() => setShowReportForm(false)} className="font-black text-xs uppercase tracking-widest text-slate-400 hover:text-blue-600">
                            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Clinical Notes
                        </Button>
                    </div>
                    <MedicalReportForm 
                        appointmentId={appointmentId!} 
                        patientName={appointment?.patientId?.name || 'Patient'} 
                        doctorName={appointment?.doctorId?.name || 'Physician'}
                        onSubmit={(data) => generateReportMutation.mutate(data)}
                    />
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in duration-500">
                    {/* LEFT COL: Patient History & Vitals */}
                    <div className="lg:col-span-1 space-y-6">
                        <Card className="border-none shadow-lg rounded-[2.5rem] overflow-hidden">
                            <CardHeader className="bg-slate-900 text-white p-6">
                                <CardTitle className="text-lg font-bold flex items-center gap-2">
                                    <Activity className="h-5 w-5 text-blue-400" />
                                    Recorded Vitals
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <VitalCard icon={<Activity className="text-blue-500" />} label="BP" value={vitals.bloodPressure || '--'} unit="mmHg" />
                                    <VitalCard icon={<Heart className="text-rose-500" />} label="Pulse" value={vitals.heartRate || '--'} unit="bpm" />
                                    <VitalCard icon={<Thermometer className="text-amber-500" />} label="Temp" value={vitals.temperature || '--'} unit="°F" />
                                    <VitalCard icon={<Wind className="text-sky-500" />} label="SpO2" value={vitals.spO2 || '--'} unit="%" />
                                    <VitalCard icon={<Scale className="text-purple-500" />} label="Weight" value={vitals.weight || '--'} unit="kg" />
                                </div>
                                <div className="mt-6 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                    <p className="text-[10px] font-black text-slate-400 uppercase mb-2">Nurse's Notes</p>
                                    <p className="text-xs font-medium text-slate-700 italic">
                                        "{vitals.notes || 'No clinical observations reported.'}"
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-none shadow-lg rounded-[2.5rem] overflow-hidden">
                            <CardHeader className="bg-slate-50 p-6 border-b">
                                <CardTitle className="text-lg font-bold flex items-center gap-2">
                                    <History className="h-5 w-5 text-slate-400" />
                                    Clinical History
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="space-y-4">
                                    <div className="p-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-center">
                                        <p className="text-xs text-slate-400 font-bold italic">Previous encounter data will appear here.</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* RIGHT COL: Consultation Form */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card className="border-none shadow-xl rounded-[2.5rem] p-8">
                            <div className="space-y-8">
                                <div className="space-y-4">
                                    <Label className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                                        <FileText className="h-4 w-4 text-blue-600" />
                                        Clinical Diagnosis
                                    </Label>
                                    <Textarea
                                        className="min-h-[120px] rounded-3xl border-2 bg-slate-50 font-medium p-6 focus:ring-blue-500"
                                        placeholder="Enter primary diagnosis..."
                                        value={diagnosis}
                                        onChange={(e) => setDiagnosis(e.target.value)}
                                    />
                                </div>

                                <div className="space-y-4">
                                    <Label className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                                        <History className="h-4 w-4 text-purple-600" />
                                        Treatment Plan & Advice
                                    </Label>
                                    <Textarea
                                        className="min-h-[120px] rounded-3xl border-2 bg-slate-50 font-medium p-6 focus:ring-purple-500"
                                        placeholder="Enter treatment instructions..."
                                        value={treatmentPlan}
                                        onChange={(e) => setTreatmentPlan(e.target.value)}
                                    />
                                </div>

                                <div className="pt-6 border-t border-slate-100 flex flex-col md:flex-row gap-4">
                                    <Button
                                        variant="outline"
                                        className="h-16 flex-1 rounded-2xl border-2 font-black text-lg gap-3 hover:bg-slate-50"
                                        onClick={() => navigate(`/prescriptions/create?appointmentId=${appointmentId}`)}
                                    >
                                        <Pill className="h-6 w-6 text-indigo-600" />
                                        WRITE PRESCRIPTION (Rx)
                                    </Button>
                                    {prescriptionId && (
                                        <Badge className="h-16 px-6 bg-emerald-50 text-emerald-700 border-2 border-emerald-100 rounded-2xl font-black">
                                            RX GENERATED ✓
                                        </Badge>
                                    )}
                                </div>
                            </div>

                            <div className="mt-12 flex gap-4">
                                <Button
                                    className="h-16 flex-[2] bg-blue-600 hover:bg-blue-700 text-white font-black text-lg rounded-3xl shadow-xl shadow-blue-100 gap-3 transition-all active:scale-95"
                                    onClick={() => setShowReportForm(true)}
                                    disabled={!diagnosis}
                                >
                                    <FileText className="h-6 w-6" />
                                    PREPARE FORMAL REPORT
                                </Button>
                                <Button variant="ghost" className="h-16 flex-1 rounded-3xl font-black text-slate-400" onClick={() => endConsultationMutation.mutate()}>
                                    QUICK FINISH (No Report)
                                </Button>
                            </div>
                        </Card>
                    </div>
                </div>
            )}
        </div>
    );
};

const VitalCard = ({ icon, label, value, unit }: any) => (
    <div className="bg-slate-50 p-4 rounded-3xl border border-slate-100 flex flex-col items-center text-center">
        <div className="bg-white p-2 rounded-xl shadow-sm mb-2">{icon}</div>
        <p className="text-[10px] font-black text-slate-400 uppercase">{label}</p>
        <div className="flex items-baseline gap-1 mt-1">
            <span className="text-lg font-black text-slate-900">{value}</span>
            <span className="text-[10px] font-bold text-slate-500">{unit}</span>
        </div>
    </div>
);

export default ConsultationPage;
