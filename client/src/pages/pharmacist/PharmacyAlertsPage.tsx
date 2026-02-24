import { useQuery } from "@tanstack/react-query";
import { apiCall } from "../../utils/api";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Skeleton } from "../../components/ui/skeleton";
import {
    AlertTriangle,
    Package,
    ArrowLeft,
    BarChart3,
    TrendingDown,
    TrendingUp,
    Info,
    CheckCircle2,
    ShieldAlert,
    Clock,
    DollarSign,
    RefreshCw,
    Activity,
    ArrowRight
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { format } from "date-fns";

export default function PharmacyAlertsPage() {
    const navigate = useNavigate();

    const { data: alerts = { lowStock: [], outOfStock: [], expiringSoon: [], expired: [], totalValue: 0 }, isLoading } = useQuery<any>({
        queryKey: ["/api/medicines/alerts"],
        queryFn: () => apiCall("/medicines/alerts")
    });

    if (isLoading) {
        return (
            <div className="bg-slate-950 min-h-screen p-8 space-y-8">
                <Skeleton className="h-40 w-full rounded-[2.5rem] bg-white/5" />
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-4">
                        <Skeleton className="h-28 w-full rounded-[2rem] bg-white/5" />
                        <Skeleton className="h-28 w-full rounded-[2rem] bg-white/5" />
                        <Skeleton className="h-28 w-full rounded-[2rem] bg-white/5" />
                    </div>
                    <Skeleton className="h-[500px] w-full rounded-[3rem] bg-white/5" />
                </div>
            </div>
        );
    }

    return (
        <div className="bg-slate-950 min-h-screen text-slate-200 p-4 md:p-8 space-y-6">
            {/* ── ALERT TERMINAL HEADER ── */}
            <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-rose-600/20 via-slate-900/40 to-amber-600/20 border border-white/10 p-8 shadow-2xl backdrop-blur-3xl group">
                <div className="absolute top-0 right-0 w-96 h-96 bg-rose-500/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 group-hover:bg-rose-500/20 transition-all duration-1000"></div>

                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-2">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-rose-500/20 rounded-2xl border border-rose-400/30 animate-pulse">
                                <AlertTriangle className="h-6 w-6 text-rose-400" />
                            </div>
                            <p className="text-rose-400 font-black text-[10px] uppercase tracking-[0.3em]">System Monitoring: High Alert</p>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase">Alert Terminal</h1>
                        <div className="flex items-center gap-4 pt-2">
                            <Badge className="bg-white/5 text-rose-300 border border-white/10 py-1.5 px-4 backdrop-blur-md rounded-xl font-black text-[10px] tracking-widest uppercase">
                                DEPLETION RISK: {alerts.lowStock?.length || 0} ITEMS
                            </Badge>
                            <Badge className="bg-white/5 text-amber-300 border border-white/10 py-1.5 px-4 backdrop-blur-md rounded-xl font-black text-[10px] tracking-widest uppercase">
                                EXPIRY RISK: {alerts.expiringSoon?.length || 0} ITEMS
                            </Badge>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <Button
                            variant="outline"
                            className="bg-white/5 border-white/10 text-white hover:bg-white/10 rounded-2xl h-14 px-6 font-black transition-all hover:scale-105 active:scale-95"
                            onClick={() => window.location.reload()}
                        >
                            <RefreshCw className="h-4 w-4 mr-2" /> RE-SCAN REPOSITORY
                        </Button>
                        <Button
                            className="bg-blue-600 hover:bg-blue-700 text-white rounded-2xl h-14 px-8 font-black shadow-xl shadow-blue-900/20"
                            onClick={() => navigate('/pharmacist/purchase-orders')}
                        >
                            INITIALIZE PROCUREMENT
                        </Button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* ── STOCK DEPLETION MONITOR ── */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="flex items-center justify-between px-2">
                        <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-3">
                            <div className="p-2 bg-rose-500/20 rounded-lg border border-rose-400/30">
                                <Package className="w-5 h-5 text-rose-400" />
                            </div>
                            DEPLETION QUEUE
                        </h2>
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Inventory Health Criticality</span>
                    </div>

                    {alerts.lowStock?.length === 0 ? (
                        <div className="py-20 text-center bg-slate-900/40 backdrop-blur-3xl rounded-[3rem] border border-white/5 shadow-2xl">
                            <CheckCircle2 className="h-24 w-24 text-emerald-500/40 mx-auto mb-6" />
                            <p className="text-white font-black text-2xl tracking-tighter uppercase">Stock Levels Optimal</p>
                            <p className="text-slate-500 font-bold mt-2 uppercase tracking-[0.2em] text-[8px]">No critical stock breaches detected in active repository.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-3">
                            {alerts.lowStock?.map((item: any) => (
                                <Card key={item._id} className="bg-slate-900/40 backdrop-blur-3xl border border-white/5 rounded-[2rem] hover:bg-slate-900/60 transition-all duration-500 hover:border-rose-500/30 overflow-hidden group shadow-xl">
                                    <div className="absolute top-0 left-0 w-1 h-full bg-rose-600 opacity-50 shadow-[0_0_15px_rgba(225,29,72,0.3)]" />
                                    <CardContent className="p-5 flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="p-4 bg-rose-500/10 rounded-2xl border border-rose-500/20 group-hover:scale-110 transition-transform">
                                                <TrendingDown className="h-6 w-6 text-rose-500" />
                                            </div>
                                            <div className="space-y-1">
                                                <h3 className="text-lg font-black text-white uppercase tracking-tight">{item.name}</h3>
                                                <div className="flex items-center gap-3">
                                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Current Inventory:</p>
                                                    <Badge className="bg-rose-500/20 text-rose-400 border-none rounded-lg px-2 py-0 my-0 font-black text-[10px]">{item.currentStock}</Badge>
                                                    <div className="h-1 w-1 rounded-full bg-slate-700" />
                                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Threshold: <span className="text-slate-300">{item.minStock || item.minimumStock}</span></p>
                                                </div>
                                            </div>
                                        </div>
                                        <Button
                                            variant="outline"
                                            className="h-10 border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white rounded-xl font-black text-[10px] px-6 transition-all"
                                            onClick={() => navigate(`/pharmacist/purchase-orders?medicine=${item._id}`)}
                                        >
                                            REPLENISH
                                        </Button>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}

                    {/* ── EXPIRY RISK INTERFACE ── */}
                    <div className="mt-8 space-y-4">
                        <div className="flex items-center justify-between px-2">
                            <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-3">
                                <div className="p-2 bg-amber-500/20 rounded-lg border border-amber-400/30">
                                    <Clock className="w-5 h-5 text-amber-400" />
                                </div>
                                EXPIRY RISK LOG
                            </h2>
                        </div>

                        {alerts.expiringSoon?.length === 0 ? (
                            <div className="p-8 text-center bg-white/5 rounded-[2rem] border border-white/5 italic text-slate-500 text-[10px] uppercase tracking-widest">
                                No immediate expiry risks detected.
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-3">
                                {alerts.expiringSoon?.map((item: any) => (
                                    <Card key={item._id} className="bg-slate-900/40 backdrop-blur-3xl border border-white/5 rounded-[2rem] hover:bg-slate-900/60 transition-all duration-500 hover:border-amber-500/30 overflow-hidden group shadow-xl">
                                        <div className="absolute top-0 left-0 w-1 h-full bg-amber-500 opacity-50 shadow-[0_0_15px_rgba(245,158,11,0.3)]" />
                                        <CardContent className="p-5 flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="p-4 bg-amber-500/10 rounded-2xl border border-amber-500/20 group-hover:rotate-12 transition-transform">
                                                    <ShieldAlert className="h-6 w-6 text-amber-500" />
                                                </div>
                                                <div className="space-y-1">
                                                    <h3 className="text-lg font-black text-white uppercase tracking-tight">{item.name}</h3>
                                                    <div className="flex items-center gap-3">
                                                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Expires On:</p>
                                                        <span className="text-amber-400 font-black text-[10px] uppercase">{format(new Date(item.expiryDate), 'MMM dd, yyyy')}</span>
                                                        <div className="h-1 w-1 rounded-full bg-slate-700" />
                                                        <Badge className="bg-amber-500/20 text-amber-500 border-none rounded-lg px-2 py-0 my-0 font-black text-[10px]">CRITICAL</Badge>
                                                    </div>
                                                </div>
                                            </div>
                                            <Button
                                                variant="outline"
                                                className="h-10 border-amber-500/20 bg-amber-500/5 text-amber-500 hover:bg-amber-500/10 hover:text-amber-400 rounded-xl font-black text-[10px] px-6 transition-all"
                                                onClick={() => navigate(`/pharmacist/inventory`)}
                                            >
                                                DISCARD PROTOCOL
                                            </Button>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* ── RISK VALUATION SIDEBAR ── */}
                <div className="space-y-6">
                    <Card className="bg-slate-900/40 backdrop-blur-3xl border border-white/5 shadow-2xl rounded-[3rem] overflow-hidden group relative">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-rose-500 to-transparent opacity-30"></div>
                        <CardHeader className="p-8 pb-4">
                            <CardTitle className="text-xl font-black text-white flex items-center gap-3">
                                <DollarSign className="text-rose-400" />
                                RISK ARCHIVE
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-8 space-y-8">
                            <div className="bg-rose-500/5 p-8 rounded-[2rem] border border-rose-500/10 text-center group-hover:border-rose-500/30 transition-all relative overflow-hidden">
                                <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-rose-500/10 rounded-full blur-3xl opacity-50"></div>
                                <Activity className="h-10 w-10 text-rose-500 mx-auto mb-3" />
                                <p className="text-4xl font-black text-white tracking-tighter italic">₹{alerts.totalValue?.toLocaleString() || '0'}</p>
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mt-2">Inventory Value at Risk</p>
                            </div>

                            <div className="space-y-4 pt-4">
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Risk Distribution</p>
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                                            <span className="text-rose-400">Low Stock Severity</span>
                                            <span className="text-white">High</span>
                                        </div>
                                        <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden border border-white/5">
                                            <div className="bg-gradient-to-r from-rose-600 to-rose-400 h-full w-[85%] rounded-full"></div>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                                            <span className="text-amber-400">Expiry Exposure</span>
                                            <span className="text-white">Medium</span>
                                        </div>
                                        <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden border border-white/5">
                                            <div className="bg-gradient-to-r from-amber-600 to-amber-400 h-full w-[45%] rounded-full"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-8 border-t border-white/5">
                                <Button
                                    className="w-full h-14 bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 hover:text-white rounded-2xl font-black transition-all flex items-center justify-between px-6"
                                    onClick={() => navigate('/pharmacist/inventory')}
                                >
                                    <span className="uppercase text-[10px] tracking-widest">Full Audit Report</span>
                                    <ArrowRight className="h-4 w-4" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="p-8 bg-gradient-to-br from-blue-950/40 to-slate-900 border border-blue-500/20 shadow-2xl rounded-[3rem] space-y-4 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-all"></div>
                        <div className="flex items-center gap-3 relative z-10">
                            <Info className="h-5 w-5 text-blue-400" />
                            <h4 className="font-black text-[10px] uppercase tracking-[0.2em] text-blue-300">Procurement Command</h4>
                        </div>
                        <p className="text-[10px] text-slate-400 leading-relaxed relative z-10 font-medium">
                            Automatic reorder points have been triggered for <span className="text-white font-black underline decoration-blue-500/50">{alerts.lowStock?.length || 0} items</span>. Initialize procurement to prevent operational stall.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
