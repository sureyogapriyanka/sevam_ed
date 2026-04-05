import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { apiCall } from "../../utils/api";
import {
    Pill,
    Calendar,
    Download,
    Eye,
    Receipt,
    Clock,
    CheckCircle2,
    FileText
} from "lucide-react";

export default function Prescriptions() {
    const { patient } = useAuth();
    const navigate = useNavigate();

    const { data: prescriptions = [], isLoading } = useQuery({
        queryKey: ["prescriptions", "patient", patient?.id],
        queryFn: async () => {
             if (!patient?.id) return [];
             return apiCall(`/prescriptions/patient/${patient.id}`);
        },
        enabled: !!patient?.id
    });

    const handleViewReceipt = (rxBase: any) => {
        // Implement detailed view / receipt download modal
        alert(`Receipt viewing functionality activated for ${rxBase._id}`);
    };

    if (isLoading) {
        return <div className="p-8 text-center text-slate-500 animate-pulse">Loading Prescriptions Pipeline...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-white p-6 rounded-2xl border border-slate-200">
                <div className="flex items-center gap-4">
                    <div className="bg-blue-100 p-3 rounded-xl">
                        <Pill className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Pharmacy & Prescriptions</h2>
                        <p className="text-slate-500 text-sm font-bold uppercase tracking-widest mt-1">Digital Medical Repository</p>
                    </div>
                </div>
            </div>

            {prescriptions.length === 0 ? (
                <Card className="border-2 border-dashed border-slate-200 bg-slate-50">
                    <CardContent className="p-12 text-center flex flex-col items-center">
                        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-sm mb-6">
                            <Pill className="h-10 w-10 text-slate-300" />
                        </div>
                        <h3 className="text-lg font-black text-slate-900 mb-2 uppercase tracking-tight">No Prescriptions Filed</h3>
                        <p className="text-slate-500 font-medium mb-6 max-w-sm">
                            Your prescriptions and digital pharmacy receipts will appear here after consultations.
                        </p>
                        <Button className="font-bold tracking-widest uppercase rounded-xl" onClick={() => navigate('/patient?tab=book-appointment')}>Consult a Doctor</Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-6">
                    {prescriptions.map((prescription: any) => {
                        // Support checking if it is dispensed to show the Receipt button
                        const isDispensed = prescription.status === "dispensed" || prescription.status === "completed";
                        
                        return (
                            <Card key={prescription._id} className="border-2 border-slate-100 hover:border-blue-200 transition-all bg-white rounded-2xl overflow-hidden shadow-sm">
                                <CardHeader className="bg-slate-50 border-b border-slate-100 p-5 flex flex-row items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-lg ${isDispensed ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-100 text-blue-600'}`}>
                                            {isDispensed ? <CheckCircle2 className="h-5 w-5" /> : <Pill className="h-5 w-5" />}
                                        </div>
                                        <div>
                                            <CardTitle className="text-lg font-black text-slate-900 leading-tight">Rx. {prescription.doctorName || 'General Practitioner'}</CardTitle>
                                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1 flex items-center gap-1">
                                                <Calendar className="h-3 w-3" /> {new Date(prescription.issuedAt || prescription.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                    <Badge
                                        className={`font-black uppercase tracking-widest text-[10px] px-3 py-1 rounded-full ${
                                            isDispensed ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100" :
                                            prescription.status === "cancelled" ? "bg-rose-100 text-rose-700 hover:bg-rose-100" :
                                            "bg-blue-100 text-blue-700 hover:bg-blue-100"
                                        }`}
                                    >
                                        {prescription.status}
                                    </Badge>
                                </CardHeader>
                                
                                <CardContent className="p-6">
                                    {prescription.diagnosis && (
                                        <div className="mb-6 bg-amber-50 rounded-xl p-4 border border-amber-100 relative overflow-hidden">
                                            <div className="absolute top-0 left-0 w-1 h-full bg-amber-400"></div>
                                            <p className="text-[10px] font-black text-amber-700 uppercase tracking-widest mb-1">Clinical Diagnosis</p>
                                            <p className="text-slate-800 font-bold">{prescription.diagnosis}</p>
                                        </div>
                                    )}

                                    <div className="space-y-4">
                                        <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100 pb-2">Prescribed Medications</p>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            {prescription.medicines?.map((med: any, index: number) => (
                                                <div key={index} className="flex flex-col bg-slate-50 p-3 rounded-lg border border-slate-100">
                                                    <span className="font-bold text-slate-900 text-sm">{med.name}</span>
                                                    <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest mt-1">
                                                        {med.dosage} • {med.frequency} • {med.duration}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {prescription.notes && (
                                        <div className="mt-6">
                                            <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Physician Notes</p>
                                            <p className="text-sm text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-100 italic">{prescription.notes}</p>
                                        </div>
                                    )}
                                </CardContent>

                                <CardFooter className="bg-slate-50 border-t border-slate-100 p-4 flex gap-3 flex-wrap">
                                    {isDispensed && (
                                        <Button 
                                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl gap-2 shadow-md shadow-emerald-500/20"
                                            onClick={() => handleViewReceipt(prescription)}
                                        >
                                            <Receipt className="h-4 w-4" /> Download e-Receipt
                                        </Button>
                                    )}
                                    <Button variant="outline" className="font-bold rounded-xl gap-2 border-slate-200 hover:bg-slate-100 text-slate-700">
                                        <Download className="h-4 w-4" /> Save PDF Copy
                                    </Button>
                                    {prescription.appointmentId?.reportUrl && (
                                        <Button 
                                            className="bg-blue-600 hover:bg-blue-700 text-white font-black rounded-xl gap-2 shadow-lg shadow-blue-200 transition-all active:scale-95"
                                            onClick={() => window.open(`${import.meta.env.VITE_API_URL}${prescription.appointmentId.reportUrl}`, '_blank')}
                                        >
                                            <FileText className="h-4 w-4" /> DOWNLOAD OFFICIAL MEDICAL REPORT
                                        </Button>
                                    )}
                                </CardFooter>
                            </Card>
                        )
                    })}
                </div>
            )}
        </div>
    );
}
