import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
    Thermometer,
    Activity,
    Heart,
    Wind,
    Scale,
    Save,
    ArrowLeft,
    UserCircle
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { toast } from "../../hooks/use-toast";
import { apiRequest } from "../../lib/queryClient";

export default function NurseVitalsPage() {
    const { patientId } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        temperature: "",
        systolic: "",
        diastolic: "",
        pulseRate: "",
        spo2: "",
        respiratoryRate: "",
        weight: "",
        notes: ""
    });

    // Fetch Patient Details
    const { data: patient, isLoading } = useQuery<any>({
        queryKey: [`/api/patients/${patientId}`],
        enabled: !!patientId,
    });

    const mutation = useMutation({
        mutationFn: async (data: any) => {
            return apiRequest("POST", "/api/vitals", data);
        },
        onSuccess: () => {
            toast({
                title: "Vitals Recorded",
                description: "Patient clinical metrics have been successfully saved.",
            });
            navigate('/nurse/dashboard');
        },
        onError: (error: any) => {
            toast({
                title: "Error",
                description: error.message || "Failed to record vitals.",
                variant: "destructive",
            });
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        mutation.mutate({
            patientId,
            temperature: parseFloat(formData.temperature),
            bloodPressure: {
                systolic: parseInt(formData.systolic),
                diastolic: parseInt(formData.diastolic)
            },
            pulseRate: parseInt(formData.pulseRate),
            spo2: parseInt(formData.spo2),
            respiratoryRate: parseInt(formData.respiratoryRate),
            weight: parseFloat(formData.weight),
            notes: formData.notes
        });
    };

    if (isLoading) return <div className="p-10 text-center">Loading patient data...</div>;

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
                    <ArrowLeft className="w-5 h-5" />
                </Button>
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Record Vitals</h1>
                    <p className="text-slate-500 text-sm">Update clinical observations for {patient?.userId?.name || 'Patient'}</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Patient Summary Card */}
                    <Card className="md:col-span-1 border-blue-100 bg-blue-50/30">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-bold flex items-center gap-2">
                                <UserCircle className="w-4 h-4 text-blue-600" />
                                Patient Summary
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase">Name</p>
                                <p className="text-sm font-bold text-slate-900">{patient?.userId?.name}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase">Age</p>
                                    <p className="text-sm font-bold text-slate-900">{patient?.userId?.age} Years</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase">Gender</p>
                                    <p className="text-sm font-bold text-slate-900 capitalize">{patient?.userId?.gender}</p>
                                </div>
                            </div>
                            <div className="pt-2 border-t border-blue-100">
                                <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Primary Diagnosis</p>
                                <Badge className="bg-white text-blue-700 border-blue-200">Post-Op Recovery</Badge>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Vitals Form */}
                    <div className="md:col-span-2 space-y-6">
                        <Card className="shadow-sm border-slate-200">
                            <CardHeader className="bg-slate-50/50 border-b border-slate-100">
                                <CardTitle className="text-base font-bold flex items-center gap-2">
                                    <Activity className="w-5 h-5 text-rose-500" />
                                    Clinical Observations
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label className="flex items-center gap-2 font-bold text-slate-700">
                                        <Thermometer className="w-4 h-4 text-orange-500" />
                                        Temperature (°C)
                                    </Label>
                                    <Input
                                        type="number" step="0.1" placeholder="36.5" required
                                        value={formData.temperature}
                                        onChange={(e) => setFormData({ ...formData, temperature: e.target.value })}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label className="flex items-center gap-2 font-bold text-slate-700">
                                        <Heart className="w-4 h-4 text-rose-500" />
                                        Pulse Rate (BPM)
                                    </Label>
                                    <Input
                                        type="number" placeholder="72" required
                                        value={formData.pulseRate}
                                        onChange={(e) => setFormData({ ...formData, pulseRate: e.target.value })}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label className="flex items-center gap-2 font-bold text-slate-700">
                                        <Activity className="w-4 h-4 text-blue-500" />
                                        Blood Pressure (Systolic)
                                    </Label>
                                    <Input
                                        type="number" placeholder="120" required
                                        value={formData.systolic}
                                        onChange={(e) => setFormData({ ...formData, systolic: e.target.value })}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label className="flex items-center gap-2 font-bold text-slate-700">
                                        <Activity className="w-4 h-4 text-blue-500/50" />
                                        Blood Pressure (Diastolic)
                                    </Label>
                                    <Input
                                        type="number" placeholder="80" required
                                        value={formData.diastolic}
                                        onChange={(e) => setFormData({ ...formData, diastolic: e.target.value })}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label className="flex items-center gap-2 font-bold text-slate-700">
                                        <Wind className="w-4 h-4 text-cyan-500" />
                                        SpO2 (%)
                                    </Label>
                                    <Input
                                        type="number" placeholder="98" required
                                        value={formData.spo2}
                                        onChange={(e) => setFormData({ ...formData, spo2: e.target.value })}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label className="flex items-center gap-2 font-bold text-slate-700">
                                        <Wind className="w-4 h-4 text-cyan-500" />
                                        Respiratory Rate
                                    </Label>
                                    <Input
                                        type="number" placeholder="16"
                                        value={formData.respiratoryRate}
                                        onChange={(e) => setFormData({ ...formData, respiratoryRate: e.target.value })}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label className="flex items-center gap-2 font-bold text-slate-700">
                                        <Scale className="w-4 h-4 text-slate-500" />
                                        Weight (kg)
                                    </Label>
                                    <Input
                                        type="number" step="0.1" placeholder="70.0"
                                        value={formData.weight}
                                        onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="shadow-sm border-slate-200">
                            <CardHeader className="bg-slate-50/50 border-b border-slate-100">
                                <CardTitle className="text-base font-bold">Nursing Notes</CardTitle>
                            </CardHeader>
                            <CardContent className="p-6">
                                <Textarea
                                    placeholder="Add any specific observations or patient concerns..."
                                    className="min-h-[100px]"
                                    value={formData.notes}
                                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                />
                            </CardContent>
                        </Card>

                        <div className="flex justify-end gap-3">
                            <Button type="button" variant="outline" onClick={() => navigate(-1)}>Cancel</Button>
                            <Button type="submit" disabled={mutation.isPending} className="bg-blue-600 hover:bg-blue-700 min-w-[150px]">
                                {mutation.isPending ? "Saving..." : (
                                    <>
                                        <Save className="w-4 h-4 mr-2" />
                                        Save Vitals
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}
