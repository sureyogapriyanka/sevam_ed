import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiCall } from "../../utils/api";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Skeleton } from "../../components/ui/skeleton";
import { useToast } from "../../hooks/use-toast";
import NotificationBell from "../../components/NotificationBell";
import useNotifications from "../../hooks/useNotifications";
import {
    Pill, Package, AlertTriangle, Calendar, CheckCircle2, Clock,
    Search, ClipboardList, BarChart3, ArrowRight, Plus, TrendingUp,
    ShoppingCart, Archive, Zap, User, RefreshCw, Eye, ChevronRight,
    Activity, Star, Bell, Users, CheckCircle
} from "lucide-react";
import { formatDistanceToNow, format } from 'date-fns';

export default function PharmacistDashboard() {
    const { user, logout } = useAuth();
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const { toast } = useToast();
    const { notifications } = useNotifications();
    const [currentTime, setCurrentTime] = useState(new Date());
    const [searchTerm, setSearchTerm] = useState("");
    const [dispensingId, setDispensingId] = useState<string | null>(null);

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    // Prescriptions to dispense — flow today filtered for pharmacist (completed status)
    const { data: prescriptions = [], isLoading: loadingRx, refetch: refetchRx } = useQuery<any[]>({
        queryKey: ["/api/flow/today"],
        queryFn: () => apiCall("/flow/today"),
        refetchInterval: 15000,
    });

    // All medicines for inventory count
    const { data: allMedicines = [] } = useQuery<any[]>({
        queryKey: ["/api/medicines"],
        queryFn: () => apiCall("/medicines"),
    });

    // Alerts
    const { data: alerts = { lowStock: [], outOfStock: [], expiringSoon: [], expired: [], totalAlerts: 0 } } = useQuery<any>({
        queryKey: ["/api/medicines/alerts"],
        queryFn: () => apiCall("/medicines/alerts"),
    });

    // WebSocket auto-refresh
    useEffect(() => {
        const lastNotif = notifications[0];
        if (lastNotif?.type === 'payment_complete') {
            queryClient.invalidateQueries({ queryKey: ["/api/flow/today"] });
            toast({
                title: "🔔 New Prescription Ready!",
                description: `${lastNotif.patientName} (Token: ${lastNotif.tokenNumber}) payment confirmed.`,
            });
        }
    }, [notifications, queryClient, toast]);

    // Dispense action
    const dispenseMutation = useMutation({
        mutationFn: async (aptId: string) => {
            setDispensingId(aptId);
            return apiCall(`/flow/dispensed/${aptId}`, { method: 'POST' });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/flow/today"] });
            toast({ title: "✅ Dispensed", description: "Medicines dispensed and record updated." });
            setDispensingId(null);
        },
        onError: () => {
            setDispensingId(null);
            toast({ title: "Error", description: "Could not mark as dispensed.", variant: "destructive" });
        }
    });

    // Filtered prescriptions by search
    const filteredRx = useMemo(() => {
        if (!searchTerm) return prescriptions;
        const q = searchTerm.toLowerCase();
        return prescriptions.filter((p: any) =>
            (p.patientName || p.patientId?.name || '').toLowerCase().includes(q) ||
            (p.tokenNumber || '').toLowerCase().includes(q) ||
            (p.doctorId?.name || '').toLowerCase().includes(q)
        );
    }, [prescriptions, searchTerm]);

    const totalAlerts = (alerts.lowStock?.length || 0) + (alerts.outOfStock?.length || 0) + (alerts.expiringSoon?.length || 0);

    const quickStats = [
        {
            title: "Ready for Dispensing",
            value: prescriptions.filter((p: any) => p.status === 'completed').length,
            icon: Clock,
            color: "text-blue-600",
            bg: "bg-blue-50",
            desc: "Awaiting pharmacist"
        },
        {
            title: "Total Inventory",
            value: allMedicines.length,
            icon: Pill,
            color: "text-purple-600",
            bg: "bg-purple-50",
            desc: "Active stock items"
        },
        {
            title: "Dispensed Today",
            value: 12, // Placeholder logic or fetch from backend
            icon: CheckCircle,
            color: "text-emerald-600",
            bg: "bg-emerald-50",
            desc: "Completed cases"
        },
        {
            title: "Stock Alerts",
            value: totalAlerts,
            icon: AlertTriangle,
            color: "text-rose-600",
            bg: "bg-rose-50",
            desc: "Low/Expired"
        }
    ];

    const getPriorityColor = (priority: string) => {
        if (priority === 'critical' || priority === 'emergency') return 'bg-red-600';
        if (priority === 'urgent') return 'bg-amber-500';
        return 'bg-emerald-600';
    };

    return (
        <div className="bg-slate-50 min-h-screen text-slate-900 p-4 md:p-8 space-y-6">
            {/* ── STATION COMMAND CENTER (Header) ── */}
            <div className="relative overflow-hidden rounded-[2.5rem] bg-white border border-slate-200 p-8 shadow-sm group">
                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 group-hover:bg-blue-200 transition-all duration-1000 opacity-50"></div>

                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-2">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-blue-50 rounded-2xl border border-blue-100 animate-pulse">
                                <Activity className="h-6 w-6 text-blue-600" />
                            </div>
                            <p className="text-blue-600 font-black text-[10px] uppercase tracking-[0.3em]">Operational Status: Active</p>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter flex items-center gap-4">
                            PHARMACY COMMAND
                            <NotificationBell />
                        </h1>
                        <div className="flex items-center gap-4 pt-2">
                            <Badge className="bg-slate-50 text-blue-600 border border-slate-200 py-1.5 px-4 rounded-xl font-black text-[10px] tracking-widest uppercase">
                                Staff: {user?.name || 'Authorized Personnel'}
                            </Badge>
                            <div className="flex items-center gap-2 text-slate-400 font-bold text-[10px] uppercase tracking-widest">
                                <Clock className="h-3.5 w-3.5 text-blue-600" /> {format(currentTime, 'hh:mm:ss a')}
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <Button
                            variant="outline"
                            className="bg-white border-slate-200 text-slate-900 hover:bg-slate-50 rounded-2xl h-14 px-6 font-black transition-all hover:scale-105 active:scale-95"
                            onClick={() => { refetchRx(); toast({ title: "Syncing Neural Data..." }); }}
                        >
                            <RefreshCw className="h-4 w-4 mr-2 text-blue-600" /> DATA SYNC
                        </Button>
                        <Button
                            variant="destructive"
                            className="bg-rose-600 hover:bg-rose-700 text-white rounded-2xl h-14 px-8 font-black shadow-xl shadow-rose-900/20"
                            onClick={() => { logout(); navigate('/'); }}
                        >
                            TERMINATE SESSION
                        </Button>
                    </div>
                </div>
            </div>

            {/* ── REAL-TIME STATS ── */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {quickStats.map((stat, i) => (
                    <Card key={i} className="bg-white border border-slate-200 shadow-sm hover:border-blue-400 transition-all duration-500 group rounded-[2rem] overflow-hidden relative">
                        <div className={`absolute top-0 right-0 w-24 h-24 ${stat.color.replace('text', 'bg').replace('-600', '-500')}/5 rounded-full blur-3xl group-hover:blur-2xl transition-all`}></div>
                        <CardContent className="p-6 flex items-center justify-between relative z-10">
                            <div className="space-y-1">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{stat.title}</p>
                                <div className="flex items-baseline gap-2">
                                    <p className="text-4xl font-black text-slate-900 tracking-tighter">{stat.value}</p>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase">{stat.desc}</p>
                                </div>
                            </div>
                            <div className={`${stat.bg} ${stat.color} p-4 rounded-2xl group-hover:scale-110 group-hover:rotate-6 transition-all border border-slate-100`}>
                                <stat.icon size={24} />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* ── DISPENSING INTERFACE ── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* QUEUE MONITOR */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="flex items-center justify-between px-2">
                        <div className="space-y-1">
                            <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                                <div className="p-2 bg-indigo-50 rounded-lg border border-indigo-100">
                                    <Users className="w-5 h-5 text-indigo-600" />
                                </div>
                                DISPENSING QUEUE
                            </h2>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-12">Authorized medication fulfillment</p>
                        </div>
                        <Badge className="bg-indigo-50 text-indigo-600 border border-indigo-100 font-black px-6 py-2 rounded-xl text-xs">
                            {prescriptions.length} ACTIVE REQUESTS
                        </Badge>
                    </div>

                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                        <Input
                            placeholder="Identify Patient / Token..."
                            className="h-14 pl-12 rounded-2xl border-slate-200 bg-white text-slate-900 font-bold text-sm focus:ring-2 focus:ring-blue-500/20 transition-all shadow-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    {loadingRx ? (
                        <div className="grid grid-cols-1 gap-4">
                            {[1, 2, 3].map(i => <Skeleton key={i} className="h-28 w-full rounded-[2rem] bg-white/5" />)}
                        </div>
                    ) : filteredRx.length === 0 ? (
                        <div className="py-20 text-center bg-white rounded-[3rem] border border-slate-200 shadow-sm">
                            <div className="relative inline-block">
                                <CheckCircle2 className="h-24 w-24 text-emerald-500/10 animate-ping absolute inset-0" />
                                <CheckCircle2 className="h-24 w-24 text-emerald-500 relative opacity-20" />
                            </div>
                            <p className="text-slate-900 font-black text-3xl tracking-tighter mt-6">FULFILLMENT COMPLETE</p>
                            <p className="text-slate-400 font-bold mt-2 uppercase tracking-[0.2em] text-xs">
                                {searchTerm ? 'No matches in local database.' : 'All prescriptions have been successfully processed.'}
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-4">
                            {filteredRx.map((apt: any) => {
                                const patientName = apt.patientName || apt.patientId?.userId?.name || apt.patientId?.name || 'Neural Ghost';
                                const doctorName = apt.doctorId?.name || 'Medicant';
                                const isDispensing = dispensingId === apt._id;
                                const isDispensed = apt.status === 'dispensed';

                                return (
                                    <div key={apt._id} className="group relative bg-white border border-slate-200 rounded-[2.5rem] hover:bg-slate-50 transition-all duration-500 hover:border-blue-400 overflow-hidden cursor-pointer shadow-sm">
                                        <div className={`absolute top-0 left-0 w-2 h-full ${isDispensed ? 'bg-slate-300' : 'bg-blue-600'} opacity-50 shadow-[0_0_20px_rgba(37,99,235,0.3)]`} />

                                        <div className="flex flex-col lg:flex-row items-center p-6 gap-8 text-slate-900">
                                            <div className="flex flex-col items-center justify-center min-w-[80px] h-[80px] bg-slate-50 rounded-3xl border border-slate-100 group-hover:border-blue-100 transition-colors">
                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">TOKEN</span>
                                                <span className="text-3xl font-black italic text-slate-900">{apt.tokenNumber || '—'}</span>
                                            </div>

                                            <div className="flex-1 space-y-2">
                                                <div className="flex items-center gap-3">
                                                    <h3 className="text-xl font-black text-slate-900 group-hover:text-blue-600 transition-colors uppercase tracking-tight">
                                                        {patientName}
                                                    </h3>
                                                    <Badge className={`rounded-xl px-3 py-1 text-[10px] font-black uppercase tracking-widest border-none ${isDispensed ? 'bg-slate-100 text-slate-500' : 'bg-blue-50 text-blue-600'}`}>
                                                        {apt.status?.toUpperCase()}
                                                    </Badge>
                                                </div>
                                                <div className="flex flex-wrap gap-4 items-center">
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                                        Authority: <span className="text-slate-700">Dr. {doctorName}</span>
                                                    </p>
                                                    <div className="h-1 w-1 rounded-full bg-slate-700" />
                                                    <div className="flex items-center gap-1.5 text-emerald-600 text-[10px] font-black uppercase">
                                                        <Activity className="h-3 w-3" /> {apt.doctorId?.specialization || 'Clinical Specialist'}
                                                    </div>
                                                    {apt.completedAt && (
                                                        <>
                                                            <div className="h-1 w-1 rounded-full bg-slate-200" />
                                                            <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                                                                <Clock className="h-3 w-3 text-blue-600" /> {formatDistanceToNow(new Date(apt.completedAt))} ago
                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex flex-row lg:flex-col items-center lg:items-end gap-3 w-full lg:w-auto">
                                                <span className={`text-[10px] font-black px-4 py-1.5 rounded-xl uppercase ${getPriorityColor(apt.priority)} text-white shadow-lg`}>
                                                    {apt.priority}
                                                </span>
                                                <div className="flex gap-2 w-full lg:w-auto">
                                                    <Button
                                                        variant="outline"
                                                        className="flex-1 h-12 bg-white border-slate-200 text-slate-600 hover:bg-slate-50 rounded-2xl px-6 font-black transition-all"
                                                        onClick={() => navigate(`/pharmacist/dispense/${apt._id}`)}
                                                    >
                                                        VIEW Rx
                                                    </Button>
                                                    {!isDispensed && (
                                                        <Button
                                                            className="flex-1 h-12 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl px-6 shadow-xl shadow-blue-500/20 gap-2 transition-all hover:scale-105"
                                                            disabled={isDispensing}
                                                            onClick={() => dispenseMutation.mutate(apt._id)}
                                                        >
                                                            {isDispensing ? <RefreshCw className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                                                            FULFILL
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* KPI INTELLIGENCE */}
                <div className="space-y-6">
                    <Card className="bg-white border border-slate-200 shadow-sm rounded-[3rem] overflow-hidden group">
                        <CardHeader className="p-8 pb-4">
                            <CardTitle className="text-xl font-black text-slate-900 flex items-center gap-3">
                                <BarChart3 className="text-blue-600" />
                                COMMAND BYTES
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-8 space-y-8">
                            <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 text-center group-hover:border-blue-200 transition-all relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-600 to-transparent opacity-30"></div>
                                <TrendingUp className="h-10 w-10 text-blue-600 mx-auto mb-3" />
                                <p className="text-4xl font-black text-slate-900 tracking-tighter italic">1.8<span className="text-blue-600">m</span></p>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-2">AVG Fulfillment Delay</p>
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between items-end">
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Inventory Health</p>
                                        <p className="text-lg font-black text-slate-900">{allMedicines.length - totalAlerts} / {allMedicines.length}</p>
                                    </div>
                                    <Badge className="bg-blue-50 text-blue-600 border border-blue-100 rounded-lg text-[10px] font-black uppercase">Optimal</Badge>
                                </div>
                                <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden border border-white/5">
                                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 h-full w-[85%] rounded-full shadow-[0_0_10px_rgba(37,99,235,0.5)]"></div>
                                </div>
                            </div>

                            <div className="pt-8 border-t border-slate-100 space-y-3">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Neural Gateways</p>
                                <Button
                                    variant="outline"
                                    className="w-full justify-between h-14 bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-2xl font-black transition-all group/btn"
                                    onClick={() => navigate('/pharmacist/inventory')}
                                >
                                    <span className="flex items-center"><Package className="mr-3 h-4 w-4 text-blue-600" /> REPOSITORY MGT</span>
                                    <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                                </Button>
                                <Button
                                    variant="outline"
                                    className="w-full justify-between h-14 bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-2xl font-black transition-all group/btn"
                                    onClick={() => navigate('/pharmacist/purchase-orders')}
                                >
                                    <span className="flex items-center"><ShoppingCart className="mr-3 h-4 w-4 text-purple-600" /> DIRECT ACQUISITION</span>
                                    <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                                </Button>
                                <Button
                                    variant="outline"
                                    className="w-full justify-between h-14 bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-2xl font-black transition-all group/btn"
                                    onClick={() => navigate('/pharmacist/reports')}
                                >
                                    <span className="flex items-center"><BarChart3 className="mr-3 h-4 w-4 text-amber-500" /> SYSTEM ARCHIVES</span>
                                    <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* ALERT TERMINAL */}
                    <div className="p-8 bg-white border border-slate-200 shadow-sm rounded-[3rem] space-y-6 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-rose-50 rounded-full blur-3xl group-hover:bg-rose-100 transition-all opacity-50"></div>
                        <div className="flex items-center justify-between relative z-10">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-rose-50 rounded-lg border border-rose-100 animate-pulse">
                                    <AlertTriangle className="h-5 w-5 text-rose-600" />
                                </div>
                                <h4 className="font-black text-xs uppercase tracking-[0.3em] text-rose-600">Critical Breach</h4>
                            </div>
                            <Badge className="bg-rose-600 text-white border-none font-black px-3 py-1 text-[8px] tracking-tighter">SECURE</Badge>
                        </div>
                        <div className="space-y-4 relative z-10">
                            {alerts.lowStock?.length > 0 ? alerts.lowStock.slice(0, 2).map((item: any) => (
                                <div key={item._id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex justify-between items-center group-hover:bg-rose-50 transition-all">
                                    <div className="space-y-1">
                                        <span className="font-black text-slate-900 text-xs uppercase tracking-tight">{item.name}</span>
                                        <p className="text-[10px] font-bold text-slate-400 italic">Depletion imminent</p>
                                    </div>
                                    <span className="text-rose-600 font-black text-sm tracking-tighter">{item.currentStock} REMAINING</span>
                                </div>
                            )) : (
                                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 text-center italic text-slate-400 text-xs">
                                    No critical stock breaches detected.
                                </div>
                            )}
                        </div>
                        <Button
                            variant="link"
                            className="p-0 text-rose-600 font-black text-[10px] uppercase h-auto group-hover:text-rose-700 transition-colors relative z-10 pl-2"
                            onClick={() => navigate('/pharmacist/alerts')}
                        >
                            ACCESS ALERT TERMINAL →
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
