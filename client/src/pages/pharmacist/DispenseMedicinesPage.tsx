import { useState, useMemo, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiCall } from "../../utils/api";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Skeleton } from "../../components/ui/skeleton";
import { Input } from "../../components/ui/input";
import { useToast } from "../../hooks/use-toast";
import {
    Pill, ArrowLeft, Search, Plus, Trash2, CheckCircle, Printer, X, ShoppingCart, User, Stethoscope, Clock, CheckCircle2, Package, Inbox, MonitorSmartphone, ChevronRight, ArrowRight, AlertTriangle, FileText, Download, ExternalLink
} from "lucide-react";
import { cn } from "../../lib/utils";
import { Dialog, DialogContent } from "../../components/ui/dialog";
import { MedicineDetailsModal } from "../../components/pharmacist/MedicineDetailsModal";

export default function DispenseMedicinesPage() {
    const { appointmentId: urlAptId } = useParams();
    const navigate = useNavigate();
    const { toast } = useToast();
    const queryClient = useQueryClient();
    
    const [searchParams] = useState(new URLSearchParams(window.location.search));
    const queryPatientId = searchParams.get('patientId');

    const [selectedAptId, setSelectedAptId] = useState<string | null>(urlAptId === 'new' ? null : urlAptId || null);
    const [manualPatientId, setManualPatientId] = useState<string | null>(queryPatientId || null);
    const [patientSearch, setPatientSearch] = useState("");
    const [allPatients, setAllPatients] = useState<any[]>([]);
    const [medicineSearch, setMedicineSearch] = useState("");
    const [cart, setCart] = useState<any[]>([]);
    const [isSuccessOpen, setIsSuccessOpen] = useState(false);
    const [selectedMedForDetail, setSelectedMedForDetail] = useState<any>(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);

    // FETCH TODAY'S FLOW for active prescriptions
    const { data: flowToday = [], isLoading: loadingFlow } = useQuery({
        queryKey: ["/api/flow/today"],
        queryFn: () => apiCall("/flow/today"),
        refetchInterval: 15000,
    });

    const activePatients = useMemo(() => {
         return flowToday.filter((a: any) => a.status === 'completed' || a.status === 'consulting' || a.status === 'checked_in');
    }, [flowToday]);

    // FETCH ALL PATIENTS FOR GLOBAL SEARCH
    useEffect(() => {
        const fetchAll = async () => {
            try {
                const data = await apiCall("/patients");
                setAllPatients(data || []);
            } catch (err) {
                console.error("Failed to load patients", err);
            }
        };
        fetchAll();
    }, []);

    const filteredPatients = useMemo(() => {
        const q = patientSearch.toLowerCase().trim();
        if (!q) return activePatients;

        // First find in active flow
        const activeMatches = activePatients.filter((a: any) => 
            a.patientName?.toLowerCase().includes(q) || 
            (a.tokenNumber && a.tokenNumber.toLowerCase().includes(q))
        );

        if (activeMatches.length > 0) return activeMatches;

        // Fallback to global search if no active matches
        return allPatients
            .filter((p: any) => (p.userId?.name || p.name)?.toLowerCase().includes(q) || p.userId?.phone?.includes(q))
            .map((p: any) => ({
                _id: null, // No active session yet
                patientId: p,
                patientName: p.userId?.name || p.name,
                tokenNumber: 'MANUAL',
                isGlobal: true
            }))
            .slice(0, 10);
    }, [activePatients, allPatients, patientSearch]);

    // SELECTED PATIENT & PRESCRIPTION
    const [manualAppointment, setManualAppointment] = useState<any>(null);
    const [loadingManualApt, setLoadingManualApt] = useState(false);

    // Fetch latest session if we have a manual patient but no appointment ID
    useEffect(() => {
        if (!selectedAptId && manualPatientId) {
            const fetchLatest = async () => {
                setLoadingManualApt(true);
                try {
                    const data = await apiCall(`/flow/latest-session/${manualPatientId}`);
                    if (data._id) {
                        setManualAppointment(data);
                        setSelectedAptId(data._id);
                    } else {
                        // Patient exists but no clinical session
                        setManualAppointment({ message: 'No doctor report detected', patientId: { _id: manualPatientId } });
                    }
                } catch (err) {
                    console.error("Failed to load session", err);
                } finally {
                    setLoadingManualApt(false);
                }
            };
            fetchLatest();
        }
    }, [manualPatientId, selectedAptId]);

    const appointment = useMemo(() => {
        if (manualAppointment && !manualAppointment.message) return manualAppointment;
        return activePatients.find((a: any) => a._id === selectedAptId);
    }, [activePatients, selectedAptId, manualAppointment]);

    const { data: prescription, isLoading: loadingRx } = useQuery({
        queryKey: [`/api/prescriptions/appointment/${selectedAptId}`],
        queryFn: () => apiCall(`/prescriptions/appointment/${selectedAptId}`),
        enabled: !!selectedAptId && (!manualAppointment || !!manualAppointment._id)
    });

    // ALL MEDICINES FOR E-COMMERCE GRID
    const { data: allMedicines = [], isLoading: loadingMeds } = useQuery({
        queryKey: ["/api/medicines"],
        queryFn: () => apiCall("/medicines"),
    });

    const filteredMedicines = useMemo(() => {
        if (!medicineSearch) return allMedicines;
        return allMedicines.filter((m: any) => 
            m.name.toLowerCase().includes(medicineSearch.toLowerCase()) || 
            m.genericName?.toLowerCase().includes(medicineSearch.toLowerCase()) ||
            m.symptoms?.some((s: string) => s.toLowerCase().includes(medicineSearch.toLowerCase()))
        );
    }, [allMedicines, medicineSearch]);

    // CART OPERATIONS
    const addToCart = (med: any) => {
        setCart(prev => {
            const existing = prev.find(i => i.medicineId === med._id);
            if (existing) {
                return prev.map(i => i.medicineId === med._id ? { ...i, quantity: i.quantity + 1 } : i);
            }
            return [...prev, {
                medicineId: med._id,
                name: med.name,
                price: med.sellingPrice,
                quantity: 1,
                unit: med.unit,
                stock: med.currentStock,
                imageUrl: med.imageUrl
            }];
        });
        toast({ title: "Cart Updated", description: `${med.name} added.`, duration: 2000 });
    };

    const updateQuantity = (id: string, newQ: number) => {
        if (newQ < 1) return;
        setCart(prev => prev.map(i => i.medicineId === id ? { ...i, quantity: newQ } : i));
    };

    const removeFromCart = (id: string) => {
        setCart(prev => prev.filter(i => i.medicineId !== id));
    };

    const handlePatientSelect = (aptOrPatient: any) => {
        if (aptOrPatient.isGlobal) {
            setManualPatientId(aptOrPatient.patientId?._id);
            setSelectedAptId(null);
            setManualAppointment(null);
        } else {
            setSelectedAptId(aptOrPatient._id);
            setManualPatientId(null);
            setManualAppointment(null);
        }
        setCart([]); // Clear cart for new user
        setPatientSearch("");
    };

    // TOTALS
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.12; 
    const total = subtotal + tax;

    const dispenseMutation = useMutation({
        mutationFn: async () => {
            if (!selectedAptId) throw new Error("No active patient session.");
            
            await apiCall('/medicines/dispense', {
                method: 'POST',
                body: JSON.stringify({
                    appointmentId: selectedAptId,
                    items: cart.map(i => ({
                        medicineId: i.medicineId,
                        medicineName: i.name,
                        quantity: i.quantity,
                        sellingPrice: i.price
                    }))
                })
            });

            await apiCall(`/flow/dispensed/${selectedAptId}`, { method: 'POST' });
        },
        onSuccess: () => {
            setIsSuccessOpen(true);
            queryClient.invalidateQueries({ queryKey: ["/api/flow/today"] });
            queryClient.invalidateQueries({ queryKey: ["/api/medicines"] });
        },
        onError: (err: any) => {
            toast({ title: "Transaction Failed", description: err.message, variant: "destructive" });
        }
    });

    const closeSession = () => {
        setIsSuccessOpen(false);
        setCart([]);
        setSelectedAptId(null);
        navigate('/pharmacist/dispense-session');
    };

    return (
        <div className="bg-slate-50 min-h-screen text-slate-900 flex flex-col h-screen overflow-hidden">
            {/* TOP NAVIGATION HEADER (Clinical) */}
            <div className="flex items-center justify-between bg-white border-b-2 border-slate-100 px-6 py-4 shadow-sm z-10 shrink-0">
                <Button variant="ghost" className="h-10 gap-3 font-black rounded-xl text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all text-[10px] uppercase tracking-widest border border-transparent hover:border-blue-100" onClick={() => navigate('/pharmacist/dashboard')}>
                    <ArrowLeft size={14} /> REPOSITORY COMMAND
                </Button>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl">
                        <MonitorSmartphone className="h-4 w-4 text-slate-400" />
                        <span className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">Clinical Dispense Terminal</span>
                    </div>
                </div>
            </div>

            {/* MAIN WORKSPACE: Split Pane */}
            <div className="flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-4 xl:grid-cols-12 max-w-[100vw]">
                
                {/* ─── LEFT: PATIENT SESSION / PRESCRIPTION PREVIEW (3 cols) ─── */}
                <div className="lg:col-span-1 xl:col-span-3 bg-white border-r border-slate-200 flex flex-col h-full shadow-[5px_0_20px_rgba(0,0,0,0.02)] z-10">
                    <div className="p-6 border-b border-slate-100 space-y-3 shrink-0 bg-slate-50/50">
                        <h2 className="text-sm font-black text-slate-900 tracking-tight flex items-center gap-2 uppercase">
                            <User className="h-4 w-4 text-blue-600" /> Patient Session
                        </h2>
                        <div className="relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                            <Input
                                placeholder="Search Token or Name..."
                                className="h-10 pl-10 rounded-xl border-2 border-slate-200 focus:border-blue-500 font-bold text-xs bg-white shadow-sm"
                                value={patientSearch}
                                onChange={(e) => setPatientSearch(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 custom-scrollbar space-y-3">
                        {!selectedAptId ? (
                            <div className="space-y-3">
                                {loadingFlow ? (
                                    <div className="space-y-4"><Skeleton className="h-16 w-full rounded-2xl" /><Skeleton className="h-16 w-full rounded-2xl" /></div>
                                ) : filteredPatients.length === 0 ? (
                                    <div className="text-center p-8">
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">No Active Flow Found</p>
                                    </div>
                                ) : (
                                    filteredPatients.map((apt: any) => (
                                        <div 
                                            key={apt._id || apt.patientId?._id}
                                            onClick={() => handlePatientSelect(apt)}
                                            className="p-3 rounded-xl border-2 border-slate-100 hover:border-blue-300 hover:bg-blue-50/50 cursor-pointer transition-all flex items-center justify-between group"
                                        >
                                            <div className="space-y-0.5">
                                                <div className="flex items-center gap-2">
                                                    <p className="font-black text-slate-900 group-hover:text-blue-700 transition-colors text-sm uppercase">{apt.patientName}</p>
                                                    {apt.isGlobal && <Badge variant="outline" className="text-[8px] bg-slate-100 uppercase border-none text-slate-500">Global</Badge>}
                                                </div>
                                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none">Token: {apt.tokenNumber || 'N/A'}</p>
                                            </div>
                                            <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-blue-600 transition-transform group-hover:translate-x-1" />
                                        </div>
                                    ))
                                )}
                            </div>
                        ) : (
                            // PRESCRIPTION BLUEPRINT VEW
                            <div className="space-y-6">
                                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                                    <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter truncate max-w-[200px]">
                                        {appointment?.patientName || appointment?.patientId?.userId?.name}
                                    </h3>
                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full text-slate-400 hover:bg-slate-100" onClick={() => { setSelectedAptId(null); setManualPatientId(null); setManualAppointment(null); }}>
                                        <X size={16} />
                                    </Button>
                                </div>
                                
                                <div className="flex gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500 flex-wrap">
                                    <Badge className="bg-slate-100 text-slate-600 border-none px-2 py-1"><Stethoscope className="h-3 w-3 mr-1 inline" /> Dr. {appointment?.doctorId?.name || 'Manual'}</Badge>
                                    <Badge className="bg-slate-100 text-slate-600 border-none px-2 py-1"><Clock className="h-3 w-3 mr-1 inline" /> {appointment?.tokenNumber || 'INTAKE'}</Badge>
                                </div>

                                {(manualAppointment?.message || (selectedAptId && !prescription && !loadingRx)) ? (
                                    <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500">
                                        <div className="p-8 text-center bg-rose-50 rounded-[2rem] border-2 border-dashed border-rose-100 space-y-4">
                                            <div className="h-20 w-20 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm">
                                                <AlertTriangle size={32} className="text-rose-500 animate-pulse" />
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-rose-900 font-black uppercase text-xs">No Doctor Report Detected</p>
                                                <p className="text-[10px] font-bold text-rose-400 uppercase tracking-widest leading-tight">Patient record exists but no active prescription was found for this session.</p>
                                            </div>
                                            <Button 
                                                variant="outline" 
                                                className="w-full rounded-xl font-black text-[9px] tracking-widest uppercase border-rose-200 text-rose-600 hover:bg-rose-600 hover:text-white transition-all h-10"
                                            >
                                                PROCEED WITH MANUAL DISPENSE
                                            </Button>
                                        </div>
                                    </div>
                                ) : loadingRx || loadingManualApt ? (
                                    <Skeleton className="w-full h-40 rounded-2xl" />
                                ) : prescription ? (
                                    <div className="space-y-4">
                                        <div className="bg-amber-50 rounded-2xl p-4 border border-amber-100 relative overflow-hidden">
                                            <div className="absolute top-0 left-0 w-1 h-full bg-amber-400" />
                                            <p className="text-[9px] font-black text-amber-600 uppercase tracking-widest mb-1">Diagnosis</p>
                                            <p className="text-slate-800 font-bold italic text-xs">{prescription.diagnosis || "Consultation complete. Proceed with dispensing."}</p>
                                        </div>

                                        {(appointment?.reportUrl || appointment?.reportDocxUrl) && (
                                            <div className="grid grid-cols-2 gap-2 mb-6">
                                                {appointment.reportUrl && (
                                                    <Button 
                                                        className="bg-blue-600 hover:bg-blue-700 text-white font-black text-[9px] uppercase tracking-widest h-10 rounded-xl gap-2 shadow-lg shadow-blue-100"
                                                        onClick={() => window.open(`${import.meta.env.VITE_API_URL}${appointment.reportUrl}`, '_blank')}
                                                    >
                                                        <FileText size={14} /> VIEW PDF
                                                    </Button>
                                                )}
                                                {appointment.reportDocxUrl && (
                                                    <Button 
                                                        variant="outline"
                                                        className="border-2 border-blue-200 text-blue-600 hover:bg-blue-50 font-black text-[9px] uppercase tracking-widest h-10 rounded-xl gap-2 shadow-sm"
                                                        onClick={() => window.open(`${import.meta.env.VITE_API_URL}${appointment.reportDocxUrl}`, '_blank')}
                                                    >
                                                        <Download size={14} /> EDIT DOCX
                                                    </Button>
                                                )}
                                            </div>
                                        )}

                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100 pb-2">Requested Medications</p>
                                        <div className="space-y-3">
                                            {prescription.medicines?.map((med: any, i: number) => {
                                                const isInCart = cart.some(c => c.name.toLowerCase() === (med.medicineId?.name || med.name).toLowerCase());
                                                return (
                                                    <div 
                                                        key={i} 
                                                        onClick={() => {
                                                            // Auto-add logic could go here
                                                        }}
                                                        className={cn("p-4 rounded-xl border-2 transition-colors cursor-pointer", isInCart ? "bg-emerald-50 border-emerald-200" : "bg-white border-slate-100 hover:border-blue-200")}
                                                    >
                                                        <div className="flex items-center justify-between">
                                                            <div className="space-y-1">
                                                                <p className={cn("font-black uppercase text-xs", isInCart ? "text-emerald-700" : "text-slate-800")}>{med.medicineId?.name || med.name}</p>
                                                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{med.dosage} · {med.duration} Days</p>
                                                            </div>
                                                            {isInCart ? <CheckCircle2 className="h-4 w-4 text-emerald-500" /> : <Plus className="h-4 w-4 text-slate-200" />}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ) : null}
                            </div>
                        )}
                    </div>
                </div>

                {/* ─── MIDDLE: E-COMMERCE MEDICINE GALLERY (6 cols) ─── */}
                <div className="lg:col-span-2 xl:col-span-6 bg-slate-50 flex flex-col h-full border-r border-slate-200">
                    <div className="p-6 shrink-0 flex items-center gap-4 bg-white border-b border-slate-100 shadow-sm z-10">
                        <div className="relative flex-1 group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                            <Input
                                placeholder="Search Database (e.g. Paracetamol, Adrenaline)..."
                                className="h-14 pl-12 rounded-[1.2rem] border-2 border-slate-200 focus:border-indigo-500 font-bold text-base bg-slate-50 focus:bg-white shadow-inner transition-all"
                                value={medicineSearch}
                                onChange={(e) => setMedicineSearch(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto custom-scrollbar bg-white">
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="bg-slate-50 border-b border-slate-200">
                                        <th className="px-6 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest text-left w-12">#</th>
                                        <th className="px-6 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest text-left">Medicine Information</th>
                                        <th className="px-6 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest text-left">Symptoms</th>
                                        <th className="px-6 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest text-left">Price</th>
                                        <th className="px-6 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest text-left">Stock</th>
                                        <th className="px-6 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest text-center">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {loadingMeds ? (
                                        Array(15).fill(0).map((_, i) => (
                                            <tr key={i}><td colSpan={5} className="px-6 py-3"><Skeleton className="h-6 w-full rounded" /></td></tr>
                                        ))
                                    ) : filteredMedicines.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="py-20 text-center">
                                                <p className="text-slate-300 font-black uppercase text-[10px] tracking-widest">No matching results in repository</p>
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredMedicines.map((med: any, idx: number) => {
                                            const inCart = cart.find(c => c.medicineId === med._id);
                                            const recommended = prescription?.medicines?.some((pm: any) => 
                                                pm.name.toLowerCase() === med.name.toLowerCase() || 
                                                pm.name.toLowerCase() === med.genericName?.toLowerCase()
                                            );
                                            
                                            return (
                                                <tr key={med._id} className={cn(
                                                    "group transition-all hover:bg-slate-50",
                                                    recommended && "bg-amber-50/30 hover:bg-amber-50/50"
                                                )}>
                                                    <td className="px-6 py-3 text-xs font-bold text-slate-300">{(idx + 1).toString().padStart(2, '0')}</td>
                                                    <td className="px-6 py-3">
                                                        <div className="space-y-0.5">
                                                            <div className="flex items-center gap-2">
                                                                <p 
                                                                    className="font-black text-slate-900 group-hover:text-indigo-600 transition-colors uppercase text-xs cursor-pointer hover:underline underline-offset-2"
                                                                    onClick={() => { setSelectedMedForDetail(med); setIsDetailOpen(true); }}
                                                                >
                                                                    {med.name}
                                                                </p>
                                                                {recommended && <Badge className="bg-amber-100 text-amber-600 border-none px-1.5 py-0 rounded text-[7px] font-black uppercase">Rx</Badge>}
                                                            </div>
                                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter truncate max-w-[200px]">{med.genericName} · {med.unit}</p>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-3">
                                                        <div className="flex flex-wrap gap-2 max-w-[120px]">
                                                            {med.symptoms?.slice(0, 1).map((s: string) => (
                                                                <span key={s} className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                                                                    {s}
                                                                </span>
                                                            ))}
                                                            {med.symptoms?.length > 1 && (
                                                                <span className="text-[10px] font-black text-blue-600/40">+{med.symptoms.length - 1}</span>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-3">
                                                        <p className="font-black text-indigo-600 text-sm">₹{med.sellingPrice}</p>
                                                    </td>
                                                    <td className="px-6 py-3">
                                                        <div className="flex items-center gap-2">
                                                            <div className={cn("h-1.5 w-1.5 rounded-full shadow-sm", med.currentStock > 20 ? "bg-emerald-500" : "bg-rose-500 animate-pulse")} />
                                                            <span className={cn("text-[10px] font-black uppercase", med.currentStock <= 20 ? "text-rose-600" : "text-slate-600")}>
                                                                {med.currentStock} REMAINING
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-3 text-center">
                                                        <Button 
                                                            variant="ghost"
                                                            size="sm"
                                                            className={cn(
                                                                "h-8 rounded-lg font-black text-[9px] uppercase tracking-widest px-3 border-2 transition-all",
                                                                inCart 
                                                                    ? "bg-emerald-50 text-emerald-600 border-emerald-200" 
                                                                    : "bg-white text-slate-900 border-slate-200 hover:bg-slate-900 hover:text-white"
                                                            )}
                                                            onClick={() => addToCart(med)}
                                                        >
                                                            {inCart ? "ADDED ✓" : "SELECT +"}
                                                        </Button>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* ─── RIGHT: CART & CHECKOUT (3 cols) ─── */}
                <div className="lg:col-span-1 xl:col-span-3 bg-white flex flex-col h-full shadow-[-5px_0_20px_rgba(0,0,0,0.02)] z-10 relative">
                    <div className="p-6 border-b border-slate-100 shrink-0 bg-gradient-to-r from-slate-50 to-white">
                        <h2 className="text-xl font-black text-slate-900 tracking-tighter flex items-center gap-3 uppercase">
                            <ShoppingCart className="h-5 w-5 text-emerald-600" /> DISPENSE CART
                            <Badge className="ml-auto bg-emerald-100 text-emerald-700 font-extrabold text-sm rounded-full">{cart.length}</Badge>
                        </h2>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                        {cart.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-4 opacity-70">
                                <Inbox className="h-12 w-12 text-slate-200" />
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] max-w-[200px] text-center">Cart empty. Add items from the gallery.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {cart.map((item) => (
                                    <div key={item.medicineId} className="flex gap-3 p-3 rounded-xl border-2 border-slate-100 bg-white group hover:border-indigo-100 transition-colors relative overflow-hidden">
                                        <div className="w-10 h-10 bg-slate-50 rounded-lg border border-slate-200 shrink-0 overflow-hidden hidden sm:flex items-center justify-center">
                                            {item.imageUrl ? <img src={item.imageUrl} className="w-full h-full object-cover" /> : <Pill className="h-4 w-4 text-slate-300" />}
                                        </div>
                                        <div className="flex-1 space-y-1">
                                            <div className="flex justify-between items-start pr-8">
                                                <h4 className="font-black text-slate-800 text-[11px] uppercase leading-tight max-w-[140px] truncate">{item.name}</h4>
                                                <p className="font-extrabold text-slate-600 text-[11px]">₹{(item.price * item.quantity).toFixed(2)}</p>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="flex items-center bg-slate-100 rounded-lg p-0.5 border border-slate-200">
                                                    <button className="w-6 h-6 flex items-center justify-center text-slate-500 hover:bg-white hover:text-rose-600 rounded-md transition-colors" onClick={() => updateQuantity(item.medicineId, item.quantity - 1)}>-</button>
                                                    <span className="text-[10px] font-black text-slate-900 w-6 text-center">{item.quantity}</span>
                                                    <button className="w-6 h-6 flex items-center justify-center text-slate-500 hover:bg-white hover:text-emerald-600 rounded-md transition-colors" onClick={() => updateQuantity(item.medicineId, item.quantity + 1)}>+</button>
                                                </div>
                                            </div>
                                        </div>
                                        <button 
                                            className="absolute top-3 right-3 p-1.5 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                                            onClick={() => removeFromCart(item.medicineId)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="p-6 border-t border-slate-100 bg-slate-50/80 shrink-0 space-y-6">
                        <div className="space-y-3 font-black uppercase text-[10px] tracking-widest text-slate-500">
                            <div className="flex justify-between">
                                <span>Subtotal</span>
                                <span className="text-slate-800">₹{subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>GST (12%)</span>
                                <span className="text-slate-800">₹{tax.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-end pt-4 border-t-2 border-slate-200">
                                <span className="text-slate-400">Net Payable</span>
                                <span className="text-4xl text-emerald-600 tracking-tighter decoration-emerald-500/30 underline decoration-4 underline-offset-4">
                                    ₹{total.toFixed(2)}
                                </span>
                            </div>
                        </div>

                        {!selectedAptId && cart.length > 0 && (
                            <div className="bg-rose-50 text-rose-600 text-[10px] font-black uppercase tracking-widest p-3 rounded-xl border border-rose-100 text-center flex items-center justify-center gap-2 animate-pulse">
                                Select Patient First
                            </div>
                        )}

                        <Button 
                            className="w-full h-12 rounded-xl bg-slate-900 hover:bg-black text-white font-black text-sm shadow-lg shadow-slate-900/10 gap-3 group transition-all active:scale-95 disabled:opacity-50 uppercase tracking-widest"
                            disabled={cart.length === 0 || !selectedAptId || dispenseMutation.isPending}
                            onClick={() => dispenseMutation.mutate()}
                        >
                            {dispenseMutation.isPending ? "PROCESSING..." : (
                                <>PAY & DISPENSE <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" /></>
                            )}
                        </Button>
                    </div>
                </div>

            </div>

            {/* SUCCESS MODAL */}
            <Dialog open={isSuccessOpen} onOpenChange={(open) => { if(!open) closeSession(); }}>
                <DialogContent className="max-w-xl bg-white border-none rounded-[3rem] p-0 overflow-hidden shadow-2xl">
                     <div className="bg-emerald-600 p-12 text-white text-center relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                        <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-white/30 backdrop-blur-md">
                            <CheckCircle className="w-12 h-12 text-white animate-pulse" />
                        </div>
                        <h2 className="text-4xl font-black tracking-tighter uppercase leading-none">Checkout<br/>Successful</h2>
                        <p className="text-emerald-100 font-bold mt-3 uppercase text-[10px] tracking-[0.3em] opacity-90">Digital receipt dispatched to patient network</p>
                    </div>

                    <div className="p-10 space-y-6">
                        <div className="flex justify-between items-center bg-slate-50 p-6 rounded-[2rem] border-2 border-slate-100">
                            <div className="space-y-1">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Collected</p>
                                <p className="text-3xl font-black text-slate-900">₹{total.toFixed(2)}</p>
                            </div>
                            <Badge className="bg-emerald-100 text-emerald-700 font-black px-4 py-2 border-none">PAID ✓</Badge>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3">
                            <Button className="flex-1 bg-slate-900 text-white hover:bg-black font-black h-12 rounded-xl gap-2 shadow-md transition-all text-xs uppercase tracking-widest">
                                <Printer size={16} /> PRINT RECEIPT
                            </Button>
                            <Button variant="outline" className="flex-1 font-black h-12 rounded-xl border-2 border-slate-200 text-slate-600 hover:bg-slate-50 text-xs uppercase tracking-widest" onClick={closeSession}>
                                CLOSE SESSION
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            <MedicineDetailsModal 
                medicine={selectedMedForDetail}
                isOpen={isDetailOpen}
                onClose={setIsDetailOpen}
            />
        </div>
    );
}
