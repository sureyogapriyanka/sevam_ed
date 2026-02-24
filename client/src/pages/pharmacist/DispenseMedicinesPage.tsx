import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiCall } from "../../utils/api";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Skeleton } from "../../components/ui/skeleton";
import { Input } from "../../components/ui/input";
import { useToast } from "../../hooks/use-toast";
import {
    Pill,
    ArrowLeft,
    Search,
    QrCode,
    Plus,
    Trash2,
    CheckCircle,
    Printer,
    AlertTriangle,
    Hospital,
    User,
    Calendar,
    Stethoscope,
    ClipboardList,
    Package
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "../../lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../../components/ui/dialog";

export default function DispenseMedicinesPage() {
    const { appointmentId } = useParams();
    const navigate = useNavigate();
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const [barcodeInput, setBarcodeInput] = useState("");
    const [dispenseItems, setDispenseItems] = useState<any[]>([]);
    const [isSuccessOpen, setIsSuccessOpen] = useState(false);
    const [unavailableMeds, setUnavailableMeds] = useState<string[]>([]);

    // Fetch Appointment & Patient
    const { data: appointment, isLoading: loadingApt } = useQuery({
        queryKey: [`/api/flow/${appointmentId}`],
        queryFn: () => apiCall(`/flow/${appointmentId}`)
    });

    // Fetch Prescription
    const { data: prescription, isLoading: loadingRx } = useQuery({
        queryKey: [`/api/prescriptions/appointment/${appointmentId}`],
        queryFn: () => apiCall(`/prescriptions/appointment/${appointmentId}`)
    });

    // Auto-match prescription items to inventory on load
    useEffect(() => {
        if (prescription?.medicines && dispenseItems.length === 0) {
            const initialItems = prescription.medicines.map((med: any) => ({
                prescriptionName: med.name,
                dosage: med.dosage,
                frequency: med.frequency,
                duration: med.duration,
                instructions: med.instructions,
                medicineId: null,
                medicineName: med.name,
                quantity: 0,
                sellingPrice: 0,
                stock: 0,
                unit: 'strip',
                matched: false
            }));
            setDispenseItems(initialItems);

            // Trigger search for each
            initialItems.forEach((item: any, index: number) => {
                searchMedicine(item.prescriptionName, index);
            });
        }
    }, [prescription]);

    const searchMedicine = async (query: string, index: number) => {
        try {
            const results = await apiCall(`/medicines/search?q=${encodeURIComponent(query)}`);
            if (results && results.length > 0) {
                const matched = results[0]; // Take best match
                updateDispenseItem(index, {
                    medicineId: matched._id,
                    medicineName: matched.name,
                    sellingPrice: matched.sellingPrice,
                    stock: matched.currentStock,
                    unit: matched.unit,
                    quantity: estimateQuantity(dispenseItems[index]?.duration || '1 week'),
                    matched: true
                });
            }
        } catch (err) {
            console.error("Search error", err);
        }
    };

    const estimateQuantity = (duration: string) => {
        // Simple logic: "5 days" -> 5, "1 week" -> 7
        const num = parseInt(duration);
        if (isNaN(num)) return 10;
        if (duration.includes('week')) return num * 7;
        if (duration.includes('month')) return num * 30;
        return num;
    };

    const updateDispenseItem = (index: number, updates: any) => {
        setDispenseItems(prev => {
            const copy = [...prev];
            copy[index] = { ...copy[index], ...updates };
            return copy;
        });
    };

    const handleBarcodeSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!barcodeInput) return;
        try {
            const med = await apiCall(`/medicines/barcode/${barcodeInput}`);
            // Add as new item or match existing
            const existingIndex = dispenseItems.findIndex(i => i.medicineName.toLowerCase() === med.name.toLowerCase());
            if (existingIndex !== -1) {
                updateDispenseItem(existingIndex, {
                    medicineId: med._id,
                    medicineName: med.name,
                    sellingPrice: med.sellingPrice,
                    stock: med.currentStock,
                    unit: med.unit,
                    matched: true
                });
                toast({ title: "Matched!", description: `${med.name} found in inventory.` });
            } else {
                setDispenseItems([...dispenseItems, {
                    prescriptionName: "Direct Scan",
                    medicineId: med._id,
                    medicineName: med.name,
                    quantity: 1,
                    sellingPrice: med.sellingPrice,
                    stock: med.currentStock,
                    unit: med.unit,
                    matched: true
                }]);
            }
            setBarcodeInput("");
        } catch (err) {
            toast({ title: "Not Found", description: "Medicine with this barcode not in inventory.", variant: "destructive" });
        }
    };

    const dispenseMutation = useMutation({
        mutationFn: async () => {
            const items = dispenseItems.filter(i => i.matched && !unavailableMeds.includes(i.prescriptionName));

            // 1. Dispense API (deducts stock & adds to bill)
            await apiCall('/medicines/dispense', {
                method: 'POST',
                body: JSON.stringify({
                    appointmentId,
                    items: items.map(i => ({
                        medicineId: i.medicineId,
                        medicineName: i.medicineName,
                        quantity: i.quantity,
                        sellingPrice: i.sellingPrice
                    }))
                })
            });

            // 2. Update Appointment Status
            await apiCall(`/flow/dispensed/${appointmentId}`, { method: 'POST' });
        },
        onSuccess: () => {
            setIsSuccessOpen(true);
            queryClient.invalidateQueries({ queryKey: ["/api/flow/today"] });
        },
        onError: (err: any) => {
            toast({ title: "Dispensing Failed", description: err.message, variant: "destructive" });
        }
    });

    const subtotal = dispenseItems.reduce((sum, item) => sum + (item.quantity * item.sellingPrice), 0);
    const tax = subtotal * 0.12; // 12% GST assumed
    const total = subtotal + tax;

    if (loadingApt || loadingRx) return <div className="p-12"><Skeleton className="h-96 w-full rounded-[3rem]" /></div>;

    return (
        <div className="bg-slate-950 min-h-screen text-slate-200 p-4 md:p-8 space-y-4">
            {/* ── TOP NAV DECK ── */}
            <div className="flex items-center justify-between bg-slate-900/40 backdrop-blur-3xl border border-white/5 p-4 rounded-[2rem] shadow-2xl">
                <Button variant="ghost" className="gap-2 font-black rounded-xl text-slate-500 hover:text-blue-400 hover:bg-white/5 transition-all" onClick={() => navigate(-1)}>
                    <ArrowLeft size={18} /> RETURN TO TERMINAL
                </Button>
                <div className="flex items-center gap-3">
                    <Badge className="bg-white/5 text-blue-300 border border-blue-500/30 font-black px-4 py-2 rounded-xl text-[10px] tracking-widest backdrop-blur-md">
                        SESSION_ID: {appointment?._id.slice(-6).toUpperCase()}
                    </Badge>
                    <Badge className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-black px-4 py-2 rounded-xl text-[10px] tracking-widest backdrop-blur-md">
                        NEURAL AUTHORIZATION: VERIFIED ✓
                    </Badge>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
                {/* LEFT: AUDIT DATA (Prescription Details) */}
                <div className="lg:col-span-3 space-y-4">
                    <Card className="bg-slate-900/40 backdrop-blur-3xl border border-white/5 shadow-2xl rounded-[2.5rem] overflow-hidden group">
                        <CardHeader className="bg-white/5 border-b border-white/5 p-6">
                            <div className="flex justify-between items-start">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-blue-500/20 rounded-xl text-blue-400 border border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.2)]">
                                            <Hospital size={20} />
                                        </div>
                                        <CardTitle className="text-2xl font-black text-white tracking-tight uppercase">Medical Blueprint</CardTitle>
                                    </div>
                                    <div className="flex items-center gap-2 pl-12">
                                        <ClipboardList size={12} className="text-slate-500" />
                                        <p className="text-slate-500 font-black uppercase tracking-[0.2em] text-[8px]">
                                            Rx_{prescription?.prescriptionNumber || "UNIDENTIFIED"} · STAMP: {prescription?.issuedAt ? format(new Date(prescription.issuedAt), 'dd.MM.yy // HH:mm') : 'N/A'}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-xl font-black text-white uppercase tracking-tight">{prescription?.patientName}</p>
                                    <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest opacity-80">
                                        Authority: Dr. {prescription?.doctorName}
                                    </p>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6 space-y-6">
                            {/* Diagnosis Deck */}
                            <div className="bg-white/5 p-4 rounded-2xl border border-white/5 relative overflow-hidden group/diag">
                                <div className="absolute top-0 left-0 w-1 h-full bg-blue-500 opacity-50 group-hover/diag:opacity-100 transition-opacity"></div>
                                <p className="text-[8px] font-black text-slate-500 uppercase tracking-[0.3em] mb-1 pl-2">Clinical Diagnosis</p>
                                <p className="text-base font-black text-slate-300 italic pl-2">"{prescription?.diagnosis || "No anomalies reported."}"</p>
                            </div>

                            {/* Medicines Array */}
                            <div className="space-y-3">
                                <h3 className="text-sm font-black text-white flex items-center gap-2 tracking-widest uppercase">
                                    <Pill className="text-rose-500 h-4 w-4" /> REQUISITION LOG
                                </h3>

                                {dispenseItems.map((item, index) => (
                                    <Card key={index} className={cn(
                                        "border-white/5 rounded-2xl transition-all duration-300 overflow-hidden",
                                        unavailableMeds.includes(item.prescriptionName)
                                            ? "bg-slate-900/20 opacity-40 grayscale"
                                            : item.matched ? "bg-white/[0.03] border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.05)]" : "bg-amber-500/[0.02] border-amber-500/20 shadow-[0_0_20px_rgba(245,158,11,0.05)]"
                                    )}>
                                        <CardContent className="p-4 space-y-3">
                                            <div className="flex justify-between items-start">
                                                <div className="space-y-1">
                                                    <h4 className="text-base font-black text-white uppercase tracking-tight">{item.prescriptionName}</h4>
                                                    <div className="flex flex-wrap gap-1.5 mt-1">
                                                        <Badge className="font-black text-[8px] rounded-lg bg-blue-500/10 text-blue-400 border border-blue-400/20 uppercase tracking-widest">{item.dosage}</Badge>
                                                        <Badge className="font-black text-[8px] rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-400/20 uppercase tracking-widest">{item.frequency}</Badge>
                                                        <Badge className="font-black text-[8px] rounded-lg bg-purple-500/10 text-purple-400 border border-purple-400/20 uppercase tracking-widest">{item.duration}</Badge>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <label className="flex items-center gap-2 text-[8px] font-black text-slate-500 uppercase tracking-widest cursor-pointer hover:text-slate-300 transition-colors">
                                                        <input
                                                            type="checkbox"
                                                            checked={unavailableMeds.includes(item.prescriptionName)}
                                                            onChange={(e) => {
                                                                if (e.target.checked) setUnavailableMeds([...unavailableMeds, item.prescriptionName]);
                                                                else setUnavailableMeds(unavailableMeds.filter(m => m !== item.prescriptionName));
                                                            }}
                                                            className="w-3.5 h-3.5 rounded border-white/10 bg-white/5 text-blue-600 focus:ring-blue-500"
                                                        />
                                                        N/A
                                                    </label>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-600 hover:text-rose-500 hover:bg-rose-500/10" onClick={() => setDispenseItems(dispenseItems.filter((_, i) => i !== index))}>
                                                        <Trash2 size={14} />
                                                    </Button>
                                                </div>
                                            </div>

                                            {/* Matching Protocol */}
                                            {!unavailableMeds.includes(item.prescriptionName) && (
                                                <div className="bg-black/20 rounded-xl p-3 border border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-3 group/map">
                                                    {item.matched ? (
                                                        <>
                                                            <div className="space-y-0.5">
                                                                <p className="text-[8px] font-black text-slate-500 uppercase tracking-[0.2em]">Repository Match</p>
                                                                <p className="font-black text-emerald-400 text-sm">{item.medicineName}</p>
                                                                <div className="flex gap-4 text-[9px] font-black uppercase tracking-widest">
                                                                    <span className={cn(item.stock < item.quantity ? "text-rose-500" : "text-emerald-500/60")}>In Stock: {item.stock}</span>
                                                                    <span className="text-slate-500">Unit Val: ₹{item.sellingPrice}</span>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center gap-3">
                                                                <div className="space-y-0.5">
                                                                    <p className="text-[8px] font-black text-slate-500 uppercase text-right tracking-widest">Quantity</p>
                                                                    <Input
                                                                        type="number"
                                                                        className="w-20 rounded-lg bg-white/5 border-white/10 text-white font-black text-center h-9 text-xs focus:ring-blue-500/50"
                                                                        value={item.quantity}
                                                                        onChange={(e) => updateDispenseItem(index, { quantity: Number(e.target.value) })}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </>
                                                    ) : (
                                                        <div className="w-full">
                                                            <p className="text-[8px] font-black text-amber-500/60 uppercase tracking-widest mb-2">Neural Link Missing for: {item.prescriptionName}</p>
                                                            <Button
                                                                variant="outline"
                                                                className="w-full rounded-xl border-dashed border-amber-500/30 text-amber-500/80 hover:bg-amber-500/10 hover:border-amber-500/50 font-black text-[10px] h-10 gap-2 transition-all"
                                                                onClick={() => searchMedicine(item.prescriptionName, index)}
                                                            >
                                                                <Search size={12} /> INITIALIZE SCAN
                                                            </Button>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* RIGHT: REAL-TIME SUMMARY & ACTIONS */}
                <div className="lg:col-span-2 space-y-4">
                    {/* OPTICAL INPUT TERMINAL (Barcode) */}
                    <Card className="bg-slate-900/60 backdrop-blur-3xl border border-white/5 shadow-2xl rounded-[2.5rem] overflow-hidden group relative">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-20"></div>
                        <CardContent className="p-6 space-y-4">
                            <div className="flex items-center gap-3 mb-1">
                                <div className="p-2 bg-blue-500/20 rounded-lg border border-blue-500/30">
                                    <QrCode className="text-blue-400 h-4 w-4" />
                                </div>
                                <h3 className="text-base font-black text-white uppercase tracking-widest">Optical Scanner</h3>
                            </div>
                            <form onSubmit={handleBarcodeSearch} className="flex gap-2">
                                <Input
                                    className="bg-white/5 border-white/10 text-white rounded-xl h-11 font-bold text-sm focus:ring-blue-500/50 placeholder:text-slate-600"
                                    placeholder="Input Barcode ID..."
                                    value={barcodeInput}
                                    onChange={(e) => setBarcodeInput(e.target.value)}
                                />
                                <Button type="submit" className="bg-blue-600 hover:bg-blue-700 h-11 rounded-xl px-4 shadow-lg shadow-blue-500/20">
                                    <Plus className="h-5 w-5" />
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    {/* FULFILLMENT SUMMARY DECK */}
                    <Card className="bg-slate-900/40 backdrop-blur-3xl border border-white/5 shadow-2xl rounded-[2.5rem] sticky top-6">
                        <CardHeader className="p-6 pb-2">
                            <CardTitle className="text-lg font-black text-white uppercase tracking-tighter flex items-center gap-3">
                                <div className="p-1.5 bg-emerald-500/20 rounded-lg border border-emerald-500/30">
                                    <CheckCircle className="text-emerald-400 h-4 w-4" />
                                </div>
                                Fulfillment Summary
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 space-y-6">
                            <div className="space-y-2 max-h-[35vh] overflow-y-auto pr-2 custom-scrollbar">
                                {dispenseItems.filter(i => i.matched && !unavailableMeds.includes(i.prescriptionName)).map((item, i) => (
                                    <div key={i} className="flex justify-between items-center group/item border-b border-white/[0.03] pb-2 transition-all hover:bg-white/[0.02] p-1 rounded-lg">
                                        <div className="space-y-0.5">
                                            <p className="text-[10px] font-black text-slate-200 uppercase truncate max-w-[140px] tracking-tight">{item.medicineName}</p>
                                            <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">{item.quantity} units @ ₹{item.sellingPrice}</p>
                                        </div>
                                        <p className="text-sm font-black text-white tracking-tighter">₹{(item.quantity * item.sellingPrice).toFixed(2)}</p>
                                    </div>
                                ))}
                                {dispenseItems.filter(i => i.matched && !unavailableMeds.includes(i.prescriptionName)).length === 0 && (
                                    <div className="text-center py-6 space-y-2">
                                        <Package className="h-10 w-10 text-slate-800 mx-auto" />
                                        <p className="text-[8px] text-slate-600 font-black uppercase tracking-[0.3em]">No items identified yet</p>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-2.5 pt-4 border-t border-white/5 font-black uppercase tracking-widest text-[10px]">
                                <div className="flex justify-between text-slate-500">
                                    <span>Base Value</span>
                                    <span>₹{subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-slate-500">
                                    <span>Neural GST (12%)</span>
                                    <span>₹{tax.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-2xl font-black text-white pt-2 tracking-tighter">
                                    <span>FINAL</span>
                                    <span className="text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)]">₹{total.toFixed(2)}</span>
                                </div>
                            </div>

                            {unavailableMeds.length > 0 && (
                                <div className="p-3 bg-amber-500/10 rounded-xl border border-amber-500/20 flex gap-3 animate-pulse">
                                    <AlertTriangle className="text-amber-400 shrink-0 h-4 w-4" />
                                    <div className="space-y-0.5">
                                        <p className="text-[8px] font-black text-amber-500 uppercase tracking-[0.2em]">Warning: Void in Stock</p>
                                        <p className="text-[8px] font-bold text-amber-500/70 leading-normal lowercase italic">
                                            {unavailableMeds.join(', ')} marked as depleted.
                                        </p>
                                    </div>
                                </div>
                            )}

                            <Button
                                className="w-full bg-emerald-600 hover:bg-emerald-700 h-16 rounded-2xl font-black text-lg gap-3 shadow-xl transition-all hover:scale-[1.02] active:scale-95 disabled:grayscale"
                                disabled={dispenseItems.filter(i => i.matched && !unavailableMeds.includes(i.prescriptionName)).length === 0 || dispenseMutation.isPending}
                                onClick={() => dispenseMutation.mutate()}
                            >
                                {dispenseMutation.isPending ? (
                                    <span className="flex items-center gap-3 animate-pulse">Processing...</span>
                                ) : (
                                    <>
                                        EXECUTE DISPENSE
                                        <CheckCircle className="h-6 w-6" />
                                    </>
                                )}
                            </Button>
                            <p className="text-[8px] font-black text-slate-600 text-center uppercase tracking-[0.3em] font-mono italic">
                                :: stock_dec :: patient_bill_res :: pulse_act ::
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Success Modal OVERLAY */}
            <Dialog open={isSuccessOpen} onOpenChange={setIsSuccessOpen}>
                <DialogContent className="max-w-md bg-slate-900/90 backdrop-blur-3xl border border-white/10 rounded-[3rem] p-10 text-center shadow-[0_0_100px_rgba(16,185,129,0.1)]">
                    <div className="w-24 h-24 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-500/30 shadow-[0_0_40px_rgba(16,185,129,0.2)]">
                        <CheckCircle className="w-12 h-12 text-emerald-400 animate-bounce" />
                    </div>
                    <DialogHeader>
                        <DialogTitle className="text-4xl font-black text-white text-center tracking-tighter">SUCCESSFUL!</DialogTitle>
                        <p className="text-slate-400 font-bold mt-2 uppercase text-[10px] tracking-widest">Medical items transmitted to patient.</p>
                    </DialogHeader>

                    <div className="my-6 p-6 bg-white/5 rounded-[2.5rem] text-left border border-white/10 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl"></div>
                        <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-4">Neural Handshake Data</p>
                        <div className="space-y-2">
                            {dispenseItems.filter(i => i.matched && !unavailableMeds.includes(i.prescriptionName)).map((item, i) => (
                                <div key={i} className="flex justify-between items-center">
                                    <span className="font-black text-slate-200 text-xs">// {item.medicineName}</span>
                                    <span className="font-black text-emerald-400 text-xs">{item.quantity} {item.unit}</span>
                                </div>
                            ))}
                        </div>
                        <p className="mt-6 text-[8px] font-black text-blue-400 uppercase text-center tracking-widest animate-pulse">Neural bill sync: complete</p>
                    </div>

                    <DialogFooter className="flex-col gap-3 sm:flex-col">
                        <Button className="w-full bg-white text-slate-900 hover:bg-slate-200 font-black h-14 rounded-2xl gap-2 tracking-tight transition-all">
                            <Printer size={18} /> INITIALIZE HARDCOPY PRINT
                        </Button>
                        <Button
                            variant="outline"
                            className="w-full font-black h-12 rounded-2xl border-white/10 text-slate-400 hover:text-white hover:bg-white/5 uppercase tracking-widest text-[10px]"
                            onClick={() => navigate('/pharmacist/dashboard')}
                        >
                            CLOSE // RETURN TO TERMINAL
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
