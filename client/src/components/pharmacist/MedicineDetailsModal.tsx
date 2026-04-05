/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiCall } from "../../utils/api";
import { format } from "date-fns";
import { cn } from "../../lib/utils";
import { Dialog, DialogContent } from "../ui/dialog";
import { Badge } from "../ui/badge";
import { TrendingUp } from "lucide-react";
import { ResponsiveContainer, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Line } from "recharts";

interface MedicineDetailsModalProps {
    medicine: any;
    isOpen: boolean;
    onClose: (open: boolean) => void;
}

export function MedicineDetailsModal({ medicine, isOpen, onClose }: MedicineDetailsModalProps) {
    // Fetch History for selected med
    const { data: history = [] } = useQuery({
        queryKey: ["/api/medicines/transactions", medicine?._id],
        queryFn: () => medicine ? apiCall(`/medicines/transactions/${medicine._id}`) : Promise.resolve([]),
        enabled: !!medicine && isOpen
    });

    const chartData = useMemo(() => {
        if (!medicine) return [];
        const target = medicine?.maximumStock || 100;
        const today = new Date();
        const jan1 = new Date(today.getFullYear(), 0, 1);

        // If no real history, generate a progressive "restocking" trend from Jan 1st
        if (!history.length) {
            const points = [];
            const intervals = 6;
            for (let i = 0; i <= intervals; i++) {
                const date = new Date(jan1.getTime() + (today.getTime() - jan1.getTime()) * (i / intervals));
                points.push({
                    date: format(date, 'MMM dd'),
                    stock: Math.round((medicine.currentStock / intervals) * i),
                    expected: target
                });
            }
            return points;
        }
        
        // If history exists but is short, prepend a starting point from Jan 1st
        const realPoints = [...history].reverse().map((t: any) => ({
            date: format(new Date(t.createdAt), 'MMM dd'),
            stock: t.balanceAfter,
            expected: target
        }));

        if (realPoints.length > 0) {
            const lastHistoryDate = new Date(history[history.length - 1].createdAt);
            if (lastHistoryDate > jan1) {
                return [
                    { date: format(jan1, 'MMM dd'), stock: 0, expected: target },
                    ...realPoints
                ];
            }
        }

        return realPoints;
    }, [history, medicine]);

    if (!medicine) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-6xl p-0 overflow-hidden border-none shadow-2xl bg-white rounded-[3rem]">
                <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[600px]">
                    {/* LEFT: INFO & VISUALS */}
                    <div className="p-10 space-y-8 bg-white">
                        <div className="space-y-6">
                            <div className="h-64 bg-slate-50 rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-inner group relative">
                                {medicine.imageUrl ? (
                                    <img src={medicine.imageUrl} alt={medicine.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
                                        <TrendingUp className="h-16 w-16 text-blue-100" />
                                    </div>
                                )}
                                <div className="absolute top-6 left-6">
                                    <Badge className="bg-blue-600 font-black text-[10px] px-4 py-1.5 rounded-full border-none shadow-lg">
                                        {medicine.category || "UNCLASSIFIED"}
                                    </Badge>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <h2 className="text-5xl font-black text-slate-900 tracking-tighter uppercase leading-none">
                                    {medicine.name}
                                </h2>
                                <p className="text-xs font-black text-blue-600 uppercase tracking-[0.2em]">{medicine.genericName}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Stock Level</p>
                                <p className="text-3xl font-black text-slate-900">{medicine.currentStock} <span className="text-xs text-slate-400 uppercase font-bold tracking-tighter">{medicine.unit || 'units'}</span></p>
                            </div>
                            <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Status</p>
                                <Badge className={cn(
                                    "font-black text-[10px] px-4 py-1 rounded-full border-none uppercase shadow-sm",
                                    medicine.stockStatus === 'in_stock' ? "bg-emerald-100 text-emerald-600" : "bg-rose-100 text-rose-600"
                                )}>
                                    {medicine.stockStatus?.replace('_', ' ')}
                                </Badge>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-xs font-black text-blue-600 uppercase tracking-widest border-b border-blue-100 pb-2 flex items-center gap-2">
                                Clinical Overview
                            </h3>
                            <div className="grid grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <p className="text-[9px] font-black text-blue-900 opacity-60 uppercase tracking-widest">Symptoms Treated</p>
                                    <div className="flex flex-wrap gap-2">
                                        {medicine.symptoms?.map((s: string) => (
                                            <Badge key={s} variant="outline" className="text-[9px] font-black uppercase text-blue-600 border-blue-100 bg-blue-50/50">
                                                {s}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-[9px] font-black text-blue-900 opacity-60 uppercase tracking-widest">Potential Side Effects</p>
                                    <div className="flex flex-wrap gap-2">
                                        {medicine.sideEffects?.map((s: string) => (
                                            <Badge key={s} variant="outline" className="text-[8px] font-bold uppercase text-rose-500 border-rose-100 bg-rose-50/30">
                                                {s}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT: STOCK HISTORY SECTION */}
                    <div className="p-10 bg-slate-50 text-slate-900 space-y-8 overflow-y-auto relative border-l border-slate-100">
                        <div className="relative z-10 space-y-8">
                            <h3 className="text-2xl font-black uppercase tracking-tight flex items-center gap-3">
                                <TrendingUp className="text-blue-600" /> Stock History
                            </h3>
                            <div className="h-64 w-full bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={chartData}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                        <XAxis dataKey="date" stroke="#94a3b8" fontSize={10} fontWeight={900} />
                                        <YAxis stroke="#94a3b8" fontSize={10} fontWeight={900} domain={[0, (dataMax: number) => Math.max(dataMax * 1.2, 100)]} />
                                        <Tooltip
                                            contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                            itemStyle={{ fontWeight: '900', color: '#2563eb' }}
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="expected"
                                            stroke="#ef4444"
                                            strokeWidth={2}
                                            strokeDasharray="5 5"
                                            dot={{ r: 2, fill: '#ef4444', strokeWidth: 0 }}
                                            name="Target"
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="stock"
                                            stroke="#10b981"
                                            strokeWidth={4}
                                            dot={{ r: 4, fill: '#10b981', strokeWidth: 0 }}
                                            activeDot={{ r: 6, fill: '#fff', stroke: '#10b981', strokeWidth: 2 }}
                                            name="Actual"
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="space-y-4">
                                {history.length === 0 ? (
                                    <p className="text-slate-400 font-bold text-center py-20 italic">No transactions found</p>
                                ) : (
                                    history.map((t: any) => (
                                        <div key={t._id} className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm flex justify-between items-center group hover:bg-white hover:border-blue-200 transition-all">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <Badge className={cn("font-black text-[8px] border-none uppercase", t.transactionType === 'dispense' ? "bg-rose-50 text-rose-600" : "bg-emerald-50 text-emerald-600")}>
                                                        {t.transactionType}
                                                    </Badge>
                                                    <span className="text-[10px] font-bold text-slate-400">{format(new Date(t.createdAt), 'MMM dd, HH:mm')}</span>
                                                </div>
                                                <p className="text-sm font-black uppercase text-slate-900">{t.notes || t.transactionType}</p>
                                                <p className="text-[10px] text-slate-300 uppercase font-bold tracking-widest italic">By: {t.performedBy?.name}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className={cn("text-xl font-black", t.quantity < 0 ? "text-rose-600" : "text-emerald-600")}>
                                                    {t.quantity > 0 ? "+" : ""}{t.quantity}
                                                </p>
                                                <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest">Bal: {t.balanceAfter}</p>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
