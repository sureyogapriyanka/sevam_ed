import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiCall } from "../../utils/api";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { 
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
    PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend 
} from 'recharts';
import { 
    BarChart3, PieChart as PieChartIcon, TrendingUp, 
    Package, AlertTriangle, IndianRupee, Download, 
    Filter, RefreshCw, Calendar, ArrowUpRight, 
    ArrowDownRight, Activity, ShieldAlert, Database 
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "../../lib/utils";

const COLORS = ['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];
const STOCK_COLORS = {
    'in_stock': '#10b981',
    'low_stock': '#f59e0b',
    'out_of_stock': '#ef4444',
    'expired': '#7f1d1d'
};

export default function PharmacyReportsPage() {
    const [timeRange, setTimeRange] = useState("30d");

    // DATA QUERIES
    const { data: inventoryData, isLoading: invLoading, refetch: refetchInv } = useQuery<any>({
        queryKey: ["/api/medicines/reports/inventory"],
        queryFn: () => apiCall("/medicines/reports/inventory"),
    });

    const { data: salesData, isLoading: salesLoading, refetch: refetchSales } = useQuery<any>({
        queryKey: ["/api/medicines/reports/sales"],
        queryFn: () => apiCall("/medicines/reports/sales"),
    });

    const { data: pharmacistStats } = useQuery<any>({
        queryKey: ["/api/flow/pharmacist-stats"],
        queryFn: () => apiCall("/flow/pharmacist-stats"),
    });

    const refreshAll = () => {
        refetchInv();
        refetchSales();
    };

    // PROCESS PIE DATA
    const pieData = inventoryData?.categories.map((c: any) => ({
        name: c._id || "Other",
        value: c.count
    })).slice(0, 6) || [];

    const stockStatusData = [
        { name: 'Healthy', value: inventoryData?.categories.reduce((acc: number, c: any) => acc + c.inStock, 0) || 0, color: STOCK_COLORS.in_stock },
        { name: 'Low Stock', value: inventoryData?.categories.reduce((acc: number, c: any) => acc + c.lowStock, 0) || 0, color: STOCK_COLORS.low_stock },
        { name: 'Out of Stock', value: inventoryData?.categories.reduce((acc: number, c: any) => acc + c.outOfStock, 0) || 0, color: STOCK_COLORS.out_of_stock },
        { name: 'Expired', value: inventoryData?.categories.reduce((acc: number, c: any) => acc + c.expired, 0) || 0, color: STOCK_COLORS.expired },
    ];

    return (
        <div className="pb-20 min-h-screen bg-slate-50/50 text-slate-900 p-4 md:p-8 space-y-8">
            
            {/* PREMIUM HEADER */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="space-y-1">
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-blue-600 opacity-80">
                        <Activity size={12} /> SevaMed Analytics Engine
                    </div>
                    <h1 className="text-4xl font-black uppercase tracking-tight text-slate-900">
                        Pharmacy Intelligence <span className="text-blue-600">Reports</span>
                    </h1>
                    <p className="text-sm font-medium text-slate-500">
                        Comprehensive insights into inventory health, dispensing trends, and financial velocity.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Button 
                        onClick={refreshAll}
                        variant="outline" 
                        className="h-12 px-6 rounded-2xl border-2 border-slate-200 font-black text-xs uppercase tracking-widest hover:bg-white hover:border-blue-600 transition-all"
                    >
                        <RefreshCw size={16} className={cn("mr-2", (invLoading || salesLoading) && "animate-spin")} />
                        Refresh
                    </Button>
                    <Button 
                        className="h-12 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-100 flex items-center gap-2"
                    >
                        <Download size={16} />
                        Export PDF
                    </Button>
                </div>
            </div>

            {/* KPI METRICS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { 
                        title: "Inventory Value", 
                        value: `₹${(inventoryData?.summary?.totalInventoryValue || 0).toLocaleString()}`, 
                        icon: Database, 
                        desc: "Total asset value", 
                        trend: "+12%", 
                        trendUp: true 
                    },
                    { 
                        title: "Units Dispensed", 
                        value: pharmacistStats?.totalUnitsToday || 0, 
                        icon: Package, 
                        desc: "dispensed today", 
                        trend: "+8%", 
                        trendUp: true 
                    },
                    { 
                        title: "Critical Alerts", 
                        value: inventoryData?.summary?.totalAlerts || 0, 
                        icon: ShieldAlert, 
                        desc: "needs attention", 
                        trend: "-2", 
                        trendUp: false 
                    },
                    { 
                        title: "Daily Revenue", 
                        value: `₹${(pharmacistStats?.dispensedCasesToday * 250 || 0).toLocaleString()}`, // Simulated calc
                        icon: IndianRupee, 
                        desc: "Est. today's sales", 
                        trend: "+15%", 
                        trendUp: true 
                    },
                ].map((kpi, i) => (
                    <Card key={i} className="bg-white border-none shadow-xl shadow-slate-200/50 rounded-[2.5rem] overflow-hidden group hover:scale-[1.02] transition-all duration-500">
                        <CardContent className="p-8">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-4 rounded-2xl bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                    <kpi.icon size={24} />
                                </div>
                                <Badge className={cn(
                                    "rounded-lg font-black text-[10px]",
                                    kpi.trendUp ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
                                )}>
                                    {kpi.trendUp ? <ArrowUpRight size={10} className="mr-1" /> : <ArrowDownRight size={10} className="mr-1" />}
                                    {kpi.trend}
                                </Badge>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{kpi.title}</p>
                                <p className="text-3xl font-black text-slate-900 tracking-tighter">{kpi.value}</p>
                                <p className="text-[10px] font-bold text-slate-400 italic">{kpi.desc}</p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* CHARTS GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* 1. SALES VELOCITY TREND */}
                <Card className="lg:col-span-8 border-none shadow-2xl shadow-slate-200/50 rounded-[3rem] bg-white overflow-hidden">
                    <CardHeader className="p-10 border-b border-slate-50 flex flex-row items-center justify-between">
                        <div className="space-y-1">
                            <CardTitle className="text-2xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-4">
                                <TrendingUp className="text-blue-600" /> Dispensing Velocity
                            </CardTitle>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">Monitoring units dispensed daily</p>
                        </div>
                        <div className="flex bg-slate-100 p-1 rounded-xl">
                            {["7d", "30d", "90d"].map(r => (
                                <button 
                                    key={r}
                                    onClick={() => setTimeRange(r)}
                                    className={cn(
                                        "px-4 py-2 rounded-lg text-[10px] font-black uppercase transition-all",
                                        timeRange === r ? "bg-white text-blue-600 shadow-sm" : "text-slate-400 hover:text-slate-600"
                                    )}
                                >
                                    {r}
                                </button>
                            ))}
                        </div>
                    </CardHeader>
                    <CardContent className="p-10">
                        <div className="h-96 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={salesData?.salesTrend}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis 
                                        dataKey="_id" 
                                        axisLine={false} 
                                        tickLine={false} 
                                        tick={{ fontSize: 10, fontWeight: '900', fill: '#94a3b8' }} 
                                        tickFormatter={(val) => format(new Date(val), 'MMM dd')}
                                    />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: '900', fill: '#94a3b8' }} />
                                    <Tooltip 
                                        contentStyle={{ borderRadius: '15px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', fontSize: '11px' }}
                                        labelStyle={{ fontWeight: 'black', color: '#1e293b' }}
                                    />
                                    <Line 
                                        type="monotone" 
                                        dataKey="unitsDispensed" 
                                        stroke="#2563eb" 
                                        strokeWidth={4} 
                                        dot={{ r: 4, fill: '#2563eb', strokeWidth: 2, stroke: '#fff' }} 
                                        activeDot={{ r: 8, fill: '#2563eb' }}
                                        animationDuration={2000}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* 2. INVENTORY HEALTH CIRCLE */}
                <Card className="lg:col-span-4 border-none shadow-2xl shadow-slate-200/50 rounded-[3rem] bg-white overflow-hidden">
                    <CardHeader className="p-10 border-b border-slate-50">
                        <CardTitle className="text-xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-4">
                            <ShieldAlert className="text-rose-600" /> Stock Integrity
                        </CardTitle>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic mt-2">Current inventory status distribution</p>
                    </CardHeader>
                    <CardContent className="p-10">
                        <div className="h-72 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie 
                                        data={stockStatusData} 
                                        innerRadius={70} 
                                        outerRadius={100} 
                                        paddingAngle={8} 
                                        dataKey="value"
                                    >
                                        {stockStatusData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip contentStyle={{ borderRadius: '15px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '10px' }} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="grid grid-cols-2 gap-3 w-full mt-6">
                             {stockStatusData.map((h, i) => (
                                 <div key={i} className="flex flex-col p-3 rounded-2xl bg-slate-50 border border-slate-100">
                                     <div className="flex items-center gap-2 mb-1">
                                         <div className="h-2 w-2 rounded-full" style={{ backgroundColor: h.color }}></div>
                                         <span className="text-[10px] font-black uppercase text-slate-400 tracking-tight">{h.name}</span>
                                     </div>
                                     <span className="text-lg font-black text-slate-900">{h.value} Items</span>
                                 </div>
                             ))}
                        </div>
                    </CardContent>
                </Card>

                {/* 3. CATEGORY DISTRIBUTION */}
                <Card className="lg:col-span-6 border-none shadow-2xl shadow-slate-200/50 rounded-[3rem] bg-white overflow-hidden">
                    <CardHeader className="p-10 border-b border-slate-50">
                        <CardTitle className="text-xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-4">
                            <BarChart3 className="text-emerald-600" /> SKU Map by Category
                        </CardTitle>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic mt-2">Active medicinal categories</p>
                    </CardHeader>
                    <CardContent className="p-10">
                        <div className="h-64 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart layout="vertical" data={pieData}>
                                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                                    <XAxis type="number" hide />
                                    <YAxis 
                                        dataKey="name" 
                                        type="category" 
                                        axisLine={false} 
                                        tickLine={false} 
                                        tick={{ fontSize: 10, fontWeight: '900', fill: '#94a3b8' }} 
                                        width={80}
                                    />
                                    <Tooltip contentStyle={{ borderRadius: '15px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '11px' }} />
                                    <Bar dataKey="value" fill="#10b981" radius={[0, 6, 6, 0]} barSize={20} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* 4. TOP DISPENSED MEDICINES */}
                <Card className="lg:col-span-6 border-none shadow-2xl shadow-slate-200/50 rounded-[3rem] bg-blue-600 text-white overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32"></div>
                    <CardHeader className="p-10 border-b border-white/10 relative z-10">
                        <CardTitle className="text-xl font-black uppercase tracking-tight flex items-center gap-4">
                            <TrendingUp className="text-blue-200" /> Best Sellers
                        </CardTitle>
                        <p className="text-[10px] font-bold text-blue-100 uppercase tracking-widest italic mt-2">Most dispensed items (Last 30 Days)</p>
                    </CardHeader>
                    <CardContent className="p-10 relative z-10">
                        <div className="space-y-4">
                            {salesData?.topMedicines.map((m: any, i: number) => (
                                <div key={i} className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 flex items-center justify-center bg-white/10 rounded-xl font-black text-blue-200">
                                            #{i+1}
                                        </div>
                                        <div>
                                            <p className="text-sm font-black uppercase tracking-tight">{m._id}</p>
                                            <p className="text-[10px] text-blue-200 uppercase font-bold tracking-widest">High Demand</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-lg font-black">{m.totalQuantity}</p>
                                        <p className="text-[10px] text-blue-200 uppercase font-bold tracking-widest">Units</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* DETAILED STOCK TABLE */}
            <Card className="border-none shadow-2xl shadow-slate-200/50 rounded-[3rem] bg-white overflow-hidden">
                <CardHeader className="p-10 bg-slate-50/50 border-b border-slate-100">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div className="space-y-1">
                            <CardTitle className="text-2xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-4">
                                <AlertTriangle className="text-rose-600" /> Inventory Health Ledger
                            </CardTitle>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">Items requiring replenishment or inspection</p>
                        </div>
                        <div className="flex items-center gap-2">
                             <Button variant="outline" className="rounded-xl border-slate-200 font-bold text-xs uppercase text-slate-600">
                                <Filter size={14} className="mr-2" /> Filter
                             </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-slate-50">
                                    <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Medicine</th>
                                    <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Category</th>
                                    <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Stock Level</th>
                                    <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Status</th>
                                    <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Inventory Value</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {inventoryData?.categories.map((cat: any, i: number) => (
                                    <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-10 py-6">
                                            <p className="font-black text-slate-900 uppercase tracking-tight">{cat._id}</p>
                                            <p className="text-[10px] text-slate-400 font-bold">{cat.count} SKUs active</p>
                                        </td>
                                        <td className="px-10 py-6">
                                            <Badge variant="secondary" className="px-3 py-1 rounded-lg bg-slate-100 text-slate-600 font-black text-[9px] uppercase tracking-widest border-none">
                                                {cat._id}
                                            </Badge>
                                        </td>
                                        <td className="px-10 py-6">
                                            <div className="flex items-center gap-3">
                                                <div className="flex-1 h-2 w-24 bg-slate-100 rounded-full overflow-hidden">
                                                    <div 
                                                        className={cn(
                                                            "h-full rounded-full transition-all duration-1000",
                                                            cat.lowStock > 0 ? "bg-rose-500" : "bg-emerald-500"
                                                        )}
                                                        style={{ width: `${Math.min(100, (cat.totalStock / (cat.count * 100)) * 100)}%` }}
                                                    ></div>
                                                </div>
                                                <span className="font-black text-slate-900 text-sm">{cat.totalStock}</span>
                                            </div>
                                        </td>
                                        <td className="px-10 py-6">
                                            {cat.lowStock > 0 || cat.outOfStock > 0 || cat.expired > 0 ? (
                                                <div className="flex flex-wrap gap-2">
                                                    {cat.lowStock > 0 && <Badge className="bg-amber-50 text-amber-600 border-none rounded-lg text-[9px] font-black uppercase tracking-widest">{cat.lowStock} Low</Badge>}
                                                    {cat.outOfStock > 0 && <Badge className="bg-rose-50 text-rose-600 border-none rounded-lg text-[9px] font-black uppercase tracking-widest">{cat.outOfStock} Out</Badge>}
                                                    {cat.expired > 0 && <Badge className="bg-slate-900 text-white border-none rounded-lg text-[9px] font-black uppercase tracking-widest">{cat.expired} Exp</Badge>}
                                                </div>
                                            ) : (
                                                <Badge className="bg-emerald-50 text-emerald-600 border-none rounded-lg text-[9px] font-black uppercase tracking-widest">Optimized</Badge>
                                            )}
                                        </td>
                                        <td className="px-10 py-6 font-black text-slate-900">
                                            ₹{cat.inventoryValue.toLocaleString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
