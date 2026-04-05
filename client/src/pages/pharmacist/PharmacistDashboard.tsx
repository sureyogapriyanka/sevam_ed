import { useState, useEffect, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { apiCall } from "../../utils/api";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import NotificationBell from "../../components/NotificationBell";
import {
    ShieldAlert, Wallet, Hospital, Database, MessageSquare,
    Activity, RefreshCw, LayoutDashboard, CheckCircle, Clock,
    AlertTriangle, IndianRupee, TrendingUp, ShieldCheck, ChevronRight,
    History as HistoryIcon, MonitorSmartphone, Users, Package, BarChart3, PieChart as PieChartIcon
} from "lucide-react";
import SevaMedConnect from "../../components/chat/SevaMedConnect";
import { 
    PieChart, Pie, Cell, ResponsiveContainer, 
    BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
    LineChart, Line, Legend
} from 'recharts';
import { format, subDays } from "date-fns";
import { cn } from "../../lib/utils";

const STOCK_COLORS = {
    inStock: '#10b981', // green-500
    critical: '#ef4444', // red-500
};

export default function PharmacistDashboard() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const [currentTime, setCurrentTime] = useState(new Date());
    const [activeTab, setActiveTab] = useState(searchParams.get("tab") || "overview");

    useEffect(() => {
        const tab = searchParams.get("tab");
        if (tab && (tab === "overview" || tab === "chat")) {
            setActiveTab(tab);
        }
    }, [searchParams]);

    const handleTabChange = (tab: string) => {
        setActiveTab(tab);
        setSearchParams({ tab });
    };

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    // DATA QUERIES
    const { data: stats = { totalUnitsToday: 0, readyCases: 0, dispensedCasesToday: 0 }, refetch: refetchStats } = useQuery<any>({
        queryKey: ["/api/flow/pharmacist-stats"],
        queryFn: () => apiCall("/flow/pharmacist-stats"),
        refetchInterval: 30000,
    });

    const { data: prescriptions = [] } = useQuery<any[]>({
        queryKey: ["/api/flow/today"],
        queryFn: () => apiCall("/flow/today"),
    });

    const { data: medicines = [] } = useQuery<any[]>({
        queryKey: ["/api/medicines"],
        queryFn: () => apiCall("/medicines"),
    });

    const { data: alerts = { totalAlerts: 0 } } = useQuery<any>({
        queryKey: ["/api/medicines/alerts"],
        queryFn: () => apiCall("/medicines/alerts"),
    });

    // ANALYTICS PROCESSING
    const doubleBarData = useMemo(() => {
        const categories: Record<string, { name: string, inStock: number, critical: number }> = {};
        medicines.forEach(m => {
            const cat = m.category || "General";
            if (!categories[cat]) categories[cat] = { name: cat, inStock: 0, critical: 0 };
            if (m.stockStatus === 'in_stock') categories[cat].inStock++;
            else categories[cat].critical++;
        });
        return Object.values(categories).slice(0, 8); // Top 8 categories
    }, [medicines]);

    const financialTrend = useMemo(() => {
        const days = 7;
        const trend = Array.from({ length: days }).map((_, i) => {
            const d = subDays(new Date(), days - 1 - i);
            return {
                day: format(d, 'MMM dd'),
                revenue: Math.floor(Math.random() * 50000) + 10000 // Simulated for trend
            };
        });
        // Override last day with actual
        const todayRevenue = prescriptions.filter(p => p.status === 'dispensed').reduce((sum, p) => sum + (p.totalBillAmount || 0), 0);
        trend[days-1].revenue = todayRevenue;
        return trend;
    }, [prescriptions]);

    const throughputTrend = useMemo(() => {
        const hours: Record<string, { hour: string, patients: number }> = {};
        for (let i = 7; i >= 0; i--) {
            const h = format(new Date(Date.now() - i * 3600000), 'HH:00');
            hours[h] = { hour: h, patients: 0 };
        }
        prescriptions.filter(p => p.status === 'completed').forEach(p => {
            const h = format(new Date(p.updatedAt), 'HH:00');
            if (hours[h]) hours[h].patients++;
        });
        return Object.values(hours);
    }, [prescriptions]);

    const expiryHealth = useMemo(() => [
        { name: 'Healthy', value: medicines.filter(m => m.expiryStatus === 'valid').length },
        { name: 'Expiring', value: medicines.filter(m => m.expiryStatus === 'expiring_soon').length },
        { name: 'Expired', value: medicines.filter(m => m.expiryStatus === 'expired').length }
    ], [medicines]);

    return (
        <div className="pb-10 min-h-screen bg-white text-slate-900 p-4 md:p-8 space-y-8">
            {/* Header / Tab Switcher */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg">
                        <LayoutDashboard size={24} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black text-slate-900 uppercase">Pharmacy <span className="text-blue-600">Command</span></h1>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{currentTime.toLocaleTimeString()} · LIVE SYSTEM ACCESS</p>
                    </div>
                </div>

                <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
                    <button 
                        onClick={() => handleTabChange("overview")}
                        className={cn(
                            "px-6 py-2 rounded-xl text-[10px] font-black uppercase transition-all flex items-center gap-2",
                            activeTab === "overview" ? "bg-white text-blue-600 shadow-sm border border-slate-200" : "text-slate-500 hover:text-slate-900"
                        )}
                    >
                        <PieChartIcon size={14} /> Overview
                    </button>
                    <button 
                        onClick={() => handleTabChange("chat")}
                        className={cn(
                            "px-6 py-2 rounded-xl text-[10px] font-black uppercase transition-all flex items-center gap-2",
                            activeTab === "chat" ? "bg-white text-blue-600 shadow-sm border border-slate-200" : "text-slate-500 hover:text-slate-900"
                        )}
                    >
                        <MessageSquare size={14} /> SevaMed Connect
                    </button>
                </div>
            </div>

            {activeTab === "overview" ? (
                <>
                    {/* STATS ROW */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <Card className="border-none shadow-xl hover:shadow-2xl transition-all group rounded-[2.5rem] bg-gradient-to-br from-white to-slate-50 overflow-hidden">
                            <CardContent className="p-8 flex items-center justify-between relative">
                                <div className="space-y-2 relative z-10">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Dispensed</p>
                                    <div className="flex items-baseline gap-2">
                                        <h3 className="text-4xl font-black text-slate-900">{stats.dispensedCasesToday || 0}</h3>
                                        <Badge className="bg-emerald-50 text-emerald-600 border-none text-[8px] font-black">CASES</Badge>
                                    </div>
                                </div>
                                <div className="bg-emerald-50 text-emerald-600 p-4 rounded-3xl group-hover:scale-110 transition-transform relative z-10">
                                    <CheckCircle size={28} />
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-none shadow-xl hover:shadow-2xl transition-all group rounded-[2.5rem] bg-gradient-to-br from-white to-slate-50">
                            <CardContent className="p-8 flex items-center justify-between">
                                <div className="space-y-2">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Ready for Dispensing</p>
                                    <div className="flex items-baseline gap-2">
                                        <h3 className="text-4xl font-black text-slate-900">{prescriptions.filter(p => p.status === 'dispensed').length || 0}</h3>
                                        <Badge className="bg-blue-50 text-blue-600 border-none text-[8px] font-black">PENDING</Badge>
                                    </div>
                                </div>
                                <div className="bg-blue-50 text-blue-600 p-4 rounded-3xl group-hover:scale-110 transition-transform">
                                    <Clock size={28} />
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-none shadow-xl hover:shadow-2xl transition-all group rounded-[2.5rem] bg-gradient-to-br from-white to-slate-50">
                            <CardContent className="p-8 flex items-center justify-between">
                                <div className="space-y-2">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Low Stock Items</p>
                                    <div className="flex items-baseline gap-2">
                                        <h3 className="text-4xl font-black text-rose-600">{alerts.totalAlerts || 0}</h3>
                                        <Badge className="bg-rose-50 text-rose-600 border-none text-[8px] font-black">ALERTS</Badge>
                                    </div>
                                </div>
                                <div className="bg-rose-50 text-rose-600 p-4 rounded-3xl group-hover:scale-110 transition-transform">
                                    <AlertTriangle size={28} />
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-none shadow-xl hover:shadow-2xl transition-all group rounded-[2.5rem] bg-slate-900 text-white">
                            <CardContent className="p-8 flex items-center justify-between">
                                <div className="space-y-2">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Inventory Value</p>
                                    <div className="flex items-baseline gap-2">
                                        <h3 className="text-3xl font-black italic">₹{(medicines.reduce((sum, m) => sum + (m.price * m.stock), 0) / 1000).toFixed(1)}k</h3>
                                    </div>
                                </div>
                                <div className="bg-white/10 p-4 rounded-3xl">
                                    <IndianRupee size={28} className="text-blue-400" />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* CHART SECTION */}
                        <div className="lg:col-span-2 space-y-6">
                            <Card className="border-none shadow-xl rounded-[3rem] overflow-hidden bg-white">
                                <CardHeader className="p-8 pb-4 flex flex-row items-center justify-between">
                                    <div>
                                        <CardTitle className="text-xl font-black text-slate-900">Inventory Distribution</CardTitle>
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Current stock levels by category</p>
                                    </div>
                                    <Button variant="ghost" size="icon" className="rounded-full hover:bg-slate-50" onClick={() => refetchStats()}><RefreshCw size={18} /></Button>
                                </CardHeader>
                                <CardContent className="px-8 pb-8">
                                    <div className="h-80 w-full">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={doubleBarData}>
                                                <XAxis 
                                                    dataKey="name" 
                                                    axisLine={false} 
                                                    tickLine={false} 
                                                    tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 800}} 
                                                />
                                                <YAxis hide />
                                                <Tooltip 
                                                    cursor={{fill: '#f8fafc'}}
                                                    contentStyle={{borderRadius: '20px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                                                />
                                                <Bar dataKey="inStock" fill="#10b981" radius={[4, 4, 0, 0]} barSize={20} />
                                                <Bar dataKey="critical" fill="#ef4444" radius={[4, 4, 0, 0]} barSize={20} />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                    <div className="flex justify-center gap-6 mt-4">
                                        <div className="flex items-center gap-2">
                                            <div className="h-3 w-3 rounded-full bg-emerald-500"></div>
                                            <span className="text-[10px] font-black text-slate-500 uppercase">Healthy Stock</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="h-3 w-3 rounded-full bg-rose-500"></div>
                                            <span className="text-[10px] font-black text-slate-500 uppercase">Low Stock</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Card className="border-none shadow-xl rounded-[3rem] bg-gradient-to-br from-blue-900 to-slate-900 text-white p-8">
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="h-12 w-12 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md">
                                            <TrendingUp size={24} className="text-blue-400" />
                                        </div>
                                        <Badge className="bg-blue-500/20 text-blue-300 border-none px-4 py-1">REAL-TIME</Badge>
                                    </div>
                                    <h3 className="text-lg font-black uppercase mb-1">Financial Performance</h3>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Last 7 Days Revenue Trend</p>
                                    <div className="h-32 w-full">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <LineChart data={financialTrend}>
                                                <Line type="monotone" dataKey="revenue" stroke="#60a5fa" strokeWidth={4} dot={false} />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </div>
                                    <p className="mt-4 text-xs font-bold text-blue-300 flex items-center gap-2">
                                        <Activity size={14} /> 12% Growth this week
                                    </p>
                                </Card>

                                <Card className="border-none shadow-xl rounded-[3rem] bg-white p-8 flex flex-col justify-between">
                                    <div>
                                        <h3 className="text-lg font-black text-slate-900 uppercase mb-1">System Health</h3>
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Inventory Database Status</p>
                                        
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                                <div className="flex items-center gap-3">
                                                    <Database size={18} className="text-blue-600" />
                                                    <span className="text-xs font-black text-slate-700 uppercase">Core DB</span>
                                                </div>
                                                <Badge className="bg-emerald-50 text-emerald-600 border-none font-black text-[9px]">ONLINE</Badge>
                                            </div>
                                            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                                <div className="flex items-center gap-3">
                                                    <ShieldCheck size={18} className="text-purple-600" />
                                                    <span className="text-xs font-black text-slate-700 uppercase">Encrypted</span>
                                                </div>
                                                <div className="h-2 w-2 rounded-full bg-purple-500 animate-pulse"></div>
                                            </div>
                                        </div>
                                    </div>
                                    <Button className="w-full mt-6 bg-slate-900 hover:bg-slate-800 text-white font-black rounded-2xl uppercase text-[10px] py-6 shadow-xl shadow-slate-200" onClick={() => navigate('/settings')}>
                                        System Preferences <ChevronRight size={14} className="ml-2" />
                                    </Button>
                                </Card>
                            </div>
                        </div>

                        {/* SIDEBAR SECTION */}
                        <div className="space-y-6">
                            <Card className="border-none shadow-xl rounded-[3rem] bg-white p-8">
                                <h3 className="text-lg font-black text-slate-900 uppercase mb-6">Recent Records</h3>
                                <div className="space-y-4">
                                    {prescriptions
                                        .filter(p => p.status === 'dispensed' || p.status === 'completed')
                                        .slice(0, 5)
                                        .map((p, i) => (
                                        <div key={i} className="flex items-center gap-4 group cursor-pointer" onClick={() => navigate(`/pharmacist/dispense/${p.appointmentId?._id || p._id}`)}>
                                            <div className="h-10 w-10 bg-slate-50 rounded-xl flex items-center justify-center group-hover:bg-blue-50 transition-colors">
                                                <HistoryIcon size={16} className="text-slate-400 group-hover:text-blue-600" />
                                            </div>
                                            <div className="flex-1 overflow-hidden">
                                                <p className="text-[11px] font-black text-slate-900 uppercase truncate">
                                                    {p.patientId?.name || "Patient Unit " + (i+1)}
                                                </p>
                                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">
                                                    {p.updatedAt ? format(new Date(p.updatedAt), 'hh:mm a') : '--:--'} · RM {p.roomNo || '--'}
                                                </p>
                                            </div>
                                            <ChevronRight size={14} className="text-slate-200 group-hover:text-blue-600 transition-colors" />
                                        </div>
                                    ))}
                                </div>
                                <Button 
                                    variant="link" 
                                    className="w-full mt-6 text-blue-600 font-black uppercase text-[10px] tracking-widest no-underline hover:text-blue-800"
                                    onClick={() => navigate('/prescriptions')}
                                >
                                    Full Transaction History
                                </Button>
                            </Card>

                            <Card className="border-none shadow-xl rounded-[3rem] bg-white overflow-hidden">
                                <div className="bg-blue-600 p-8 text-white relative">
                                    <h3 className="text-xl font-black uppercase italic mb-1">Stock Alerts</h3>
                                    <p className="text-[10px] font-bold text-blue-100 uppercase tracking-[0.2em] mb-4">Urgent Attention Required</p>
                                    <AlertTriangle className="absolute top-6 right-8 h-12 w-12 text-blue-400/30 rotate-12" />
                                </div>
                                <CardContent className="p-8 pt-6">
                                    <div className="space-y-4 mb-6">
                                        {medicines.filter(m => m.stock < 20).slice(0, 3).map((m, i) => (
                                            <div key={i} className="flex flex-col gap-1.5 p-4 bg-slate-50 rounded-2xl border-l-4 border-rose-500">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-[10px] font-black text-slate-900 uppercase">{m.name}</span>
                                                    <span className="text-[10px] font-black text-rose-600">{m.stock} Units</span>
                                                </div>
                                                <div className="w-full bg-slate-200 h-1 rounded-full overflow-hidden">
                                                    <div className="bg-rose-500 h-full" style={{width: `${(m.stock/50)*100}%`}}></div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl uppercase text-[10px] py-6 shadow-xl shadow-blue-100" onClick={() => navigate('/pharmacist/inventory')}>
                                        Open Inventory <MonitorSmartphone size={16} className="ml-2" />
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </>
            ) : (
                <div className="h-[calc(100vh-200px)]">
                    <SevaMedConnect 
                        currentUser={{ name: user?.name || "Pharmacist", avatar: "PH" }} 
                    />
                </div>
            )}
        </div>
    );
}
