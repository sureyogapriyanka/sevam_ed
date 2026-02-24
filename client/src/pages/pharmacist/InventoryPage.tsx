import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiCall } from "../../utils/api";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";
import { Skeleton } from "../../components/ui/skeleton";
import {
    Search,
    Filter,
    Plus,
    Download,
    Edit2,
    History,
    Package,
    AlertTriangle,
    X,
    TrendingUp,
    MapPin,
    Calendar,
    SearchCheck,
    Pill,
    Hospital
} from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter
} from "../../components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "../../components/ui/select";
import { format, differenceInDays } from "date-fns";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from "recharts";
import { cn } from "../../lib/utils";
import { useToast } from "../../hooks/use-toast";

const categories = ['tablet', 'capsule', 'syrup', 'injection', 'drops', 'cream', 'ointment', 'powder', 'inhaler', 'suppository', 'other'];

export default function InventoryPage() {
    const queryClient = useQueryClient();
    const { toast } = useToast();
    const [searchQuery, setSearchQuery] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("all");
    const [stockFilter, setStockFilter] = useState("all");
    const [expiryFilter, setExpiryFilter] = useState("all");

    // Modals
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isRestockOpen, setIsRestockOpen] = useState(false);
    const [selectedMed, setSelectedMed] = useState<any>(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);

    // Form States
    const [restockQty, setRestockQty] = useState(0);

    // Fetch Medicines
    const { data: medicines = [], isLoading } = useQuery({
        queryKey: ["/api/medicines", searchQuery, categoryFilter, stockFilter, expiryFilter],
        queryFn: () => {
            let url = `/medicines?search=${searchQuery}`;
            if (categoryFilter !== 'all') url += `&category=${categoryFilter}`;
            if (stockFilter !== 'all') url += `&stockStatus=${stockFilter}`;
            if (expiryFilter !== 'all') url += `&expiryStatus=${expiryFilter}`;
            return apiCall(url);
        }
    });

    // Fetch History for selected med
    const { data: history = [] } = useQuery({
        queryKey: ["/api/medicines/transactions", selectedMed?._id],
        queryFn: () => selectedMed ? apiCall(`/medicines/transactions/${selectedMed._id}`) : Promise.resolve([]),
        enabled: !!selectedMed
    });

    // Stats
    const stats = useMemo(() => {
        return {
            total: medicines.length,
            lowStock: medicines.filter((m: any) => m.stockStatus === 'low_stock').length,
            outOfStock: medicines.filter((m: any) => m.stockStatus === 'out_of_stock').length,
            expiringSoon: medicines.filter((m: any) => m.expiryStatus === 'expiring_soon').length
        };
    }, [medicines]);

    // Mutations
    const restockMutation = useMutation({
        mutationFn: (data: any) => apiCall(`/medicines/${selectedMed._id}/restock`, {
            method: 'POST',
            body: JSON.stringify(data)
        }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/medicines"] });
            setIsRestockOpen(false);
            setRestockQty(0);
            toast({ title: "Restocked!", description: "Inventory updated successfuly." });
        }
    });

    const chartData = useMemo(() => {
        if (!history.length) return [];
        return [...history].reverse().map((t: any) => ({
            date: format(new Date(t.createdAt), 'MMM dd'),
            stock: t.balanceAfter
        }));
    }, [history]);

    const getStatusBadge = (med: any) => {
        if (med.expiryStatus === 'expired') return <Badge className="bg-rose-900 border-none">EXPIRED</Badge>;
        if (med.stockStatus === 'out_of_stock') return <Badge className="bg-rose-600 border-none">OUT OF STOCK</Badge>;
        if (med.stockStatus === 'low_stock') return <Badge className="bg-orange-500 border-none">LOW STOCK</Badge>;
        return <Badge className="bg-emerald-500 border-none">IN STOCK</Badge>;
    };

    return (
        <div className="space-y-8 pb-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-1">
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight uppercase">Medicine Inventory</h1>
                    <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Manage catalog, track expiry, and restock levels</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="rounded-2xl font-black gap-2 border-2">
                        <Download size={18} /> IMPORT CSV
                    </Button>
                    <Button className="bg-emerald-600 hover:bg-emerald-700 rounded-2xl font-black gap-2 h-12 px-6 shadow-lg shadow-emerald-100" onClick={() => setIsAddOpen(true)}>
                        <Plus size={20} /> ADD MEDICINE
                    </Button>
                </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {[
                    { label: "Total Items", value: stats.total, color: "text-blue-600", bg: "bg-blue-50" },
                    { label: "Low Stock", value: stats.lowStock, color: "text-orange-600", bg: "bg-orange-50", warning: true },
                    { label: "Out of Stock", value: stats.outOfStock, color: "text-rose-600", bg: "bg-rose-50", warning: true },
                    { label: "Expiring Soon", value: stats.expiringSoon, color: "text-amber-600", bg: "bg-amber-50" },
                    { label: "Categories", value: categories.length, color: "text-purple-600", bg: "bg-purple-50" }
                ].map((s, i) => (
                    <Card key={i} className="border-none shadow-lg rounded-3xl group">
                        <CardContent className="p-6">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{s.label}</p>
                            <div className="flex items-center justify-between">
                                <p className={cn("text-3xl font-black", s.color)}>{s.value}</p>
                                <div className={cn("p-2 rounded-xl transition-transform group-hover:scale-110", s.bg, s.color)}>
                                    {s.warning ? <AlertTriangle size={18} /> : <Package size={18} />}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Filter Bar */}
            <Card className="border-none shadow-xl rounded-[2.5rem] bg-white">
                <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                            <Input
                                className="pl-12 h-14 rounded-2xl border-none bg-slate-50 font-bold placeholder:text-slate-300 text-slate-700"
                                placeholder="Search by name, generic name, or barcode..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                                <SelectTrigger className="h-14 rounded-2xl border-2 font-bold uppercase text-[10px]">
                                    <SelectValue placeholder="CATEGORY" />
                                </SelectTrigger>
                                <SelectContent className="rounded-2xl font-bold uppercase text-[10px]">
                                    <SelectItem value="all">ALL CATEGORIES</SelectItem>
                                    {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                                </SelectContent>
                            </Select>

                            <Select value={stockFilter} onValueChange={setStockFilter}>
                                <SelectTrigger className="h-14 rounded-2xl border-2 font-bold uppercase text-[10px]">
                                    <SelectValue placeholder="STOCK STATUS" />
                                </SelectTrigger>
                                <SelectContent className="rounded-2xl font-bold uppercase text-[10px]">
                                    <SelectItem value="all">ALL STOCK</SelectItem>
                                    <SelectItem value="in_stock">IN STOCK</SelectItem>
                                    <SelectItem value="low_stock">LOW STOCK</SelectItem>
                                    <SelectItem value="out_of_stock">OUT OF STOCK</SelectItem>
                                </SelectContent>
                            </Select>

                            <Select value={expiryFilter} onValueChange={setExpiryFilter}>
                                <SelectTrigger className="h-14 rounded-2xl border-2 font-bold uppercase text-[10px]">
                                    <SelectValue placeholder="EXPIRY" />
                                </SelectTrigger>
                                <SelectContent className="rounded-2xl font-bold uppercase text-[10px]">
                                    <SelectItem value="all">ALL EXPIRY</SelectItem>
                                    <SelectItem value="valid">VALID</SelectItem>
                                    <SelectItem value="expiring_soon">EXPIRING SOON</SelectItem>
                                    <SelectItem value="expired">EXPIRED</SelectItem>
                                </SelectContent>
                            </Select>

                            <Button className="h-14 rounded-2xl bg-slate-900 font-extrabold uppercase text-[10px] tracking-widest px-8">
                                <Filter className="mr-2" size={16} /> Apply Filters
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Medicine Table */}
            <Card className="border-none shadow-2xl rounded-[3rem] overflow-hidden bg-white">
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-100">
                                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Medicine Name</th>
                                    <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Batch / Expiry</th>
                                    <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Stock Level</th>
                                    <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Location</th>
                                    <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Price / MRP</th>
                                    <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right pr-8">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {isLoading ? (
                                    Array(5).fill(0).map((_, i) => (
                                        <tr key={i}><td colSpan={6} className="p-8"><Skeleton className="h-12 w-full rounded-2xl" /></td></tr>
                                    ))
                                ) : medicines.map((med: any) => {
                                    const daysToExpiry = differenceInDays(new Date(med.expiryDate), new Date());
                                    const expiryColor = daysToExpiry < 0 ? "text-rose-900 bg-rose-50" : daysToExpiry < 30 ? "text-rose-600 bg-rose-50" : daysToExpiry < 90 ? "text-amber-600 bg-amber-50" : "text-emerald-600 bg-emerald-50";

                                    return (
                                        <tr key={med._id} className="hover:bg-slate-50 transition-colors group">
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="p-3 bg-white rounded-2xl shadow-sm border border-slate-100 text-slate-400 group-hover:text-blue-600 transition-colors">
                                                        <Pill size={20} />
                                                    </div>
                                                    <div>
                                                        <p className="font-black text-slate-900 uppercase leading-none mb-1">{med.name}</p>
                                                        <p className="text-[10px] font-bold text-slate-400 uppercase">{med.genericName} · {med.category}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-6 text-center">
                                                <p className="text-[10px] font-black text-slate-900 mb-1">BATCH: {med.batchNumber || '--'}</p>
                                                <Badge className={cn("font-black text-[10px] border-none rounded-lg", expiryColor)}>
                                                    EXP: {format(new Date(med.expiryDate), 'MMM yyyy')}
                                                </Badge>
                                            </td>
                                            <td className="px-6 py-6">
                                                <div className="flex flex-col items-center gap-2">
                                                    <div className="flex items-center gap-2">
                                                        <span className={cn("text-lg font-black", med.stockStatus === 'low_stock' ? "text-orange-500" : med.stockStatus === 'out_of_stock' ? "text-rose-600" : "text-slate-900")}>
                                                            {med.currentStock}
                                                        </span>
                                                        <span className="text-[10px] font-bold text-slate-400 uppercase">{med.unit}s</span>
                                                    </div>
                                                    <div className="w-24 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                                                        <div
                                                            className={cn("h-full transition-all", med.stockStatus === 'low_stock' ? "bg-orange-500" : med.stockStatus === 'out_of_stock' ? "bg-rose-600" : "bg-emerald-500")}
                                                            style={{ width: `${Math.min((med.currentStock / med.maximumStock) * 100, 100)}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-6 text-center">
                                                <div className="bg-slate-100 border border-slate-200 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl">
                                                    <MapPin size={12} className="text-slate-400" />
                                                    <span className="text-[10px] font-black text-slate-700 uppercase">R:{med.rackNumber || '-'} S:{med.shelfNumber || '-'}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-6 text-center">
                                                <p className="text-lg font-black text-emerald-600 leading-none">₹{med.sellingPrice}</p>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter decoration-slate-300 line-through">MRP: ₹{med.mrp}</p>
                                            </td>
                                            <td className="px-8 py-6 text-right pr-8">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Button variant="ghost" size="icon" className="h-10 w-10 bg-white shadow-sm border border-slate-100 rounded-xl hover:bg-slate-900 hover:text-white" onClick={() => { setSelectedMed(med); setIsDetailOpen(true); }}>
                                                        <TrendingUp size={16} />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" className="h-10 w-10 bg-white shadow-sm border border-slate-100 rounded-xl hover:bg-emerald-600 hover:text-white" onClick={() => { setSelectedMed(med); setIsRestockOpen(true); }}>
                                                        <Plus size={18} />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" className="h-10 w-10 bg-white shadow-sm border border-slate-100 rounded-xl hover:bg-blue-600 hover:text-white">
                                                        <Edit2 size={16} />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            {/* DETAIL DRAWER / SIDE PANEL */}
            <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
                <DialogContent className="max-w-4xl p-0 rounded-[3rem] overflow-hidden border-none shadow-2xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 h-[80vh]">
                        {/* LEFT: INFO & CHART */}
                        <div className="p-10 space-y-8 overflow-y-auto bg-white">
                            <div className="space-y-2">
                                <Badge className="bg-blue-600 uppercase font-black px-4 py-1 rounded-full text-[10px]">{selectedMed?.category}</Badge>
                                <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tight">{selectedMed?.name}</h2>
                                <p className="text-slate-500 font-bold italic uppercase text-xs">{selectedMed?.genericName}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                    <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Stock Level</p>
                                    <div className="flex items-baseline gap-2">
                                        <p className="text-2xl font-black text-slate-900">{selectedMed?.currentStock}</p>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase">{selectedMed?.unit}s</p>
                                    </div>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                    <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Status</p>
                                    {selectedMed && getStatusBadge(selectedMed)}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-xl font-black text-slate-900 border-b-4 border-blue-600 inline-block">Stock History</h3>
                                <div className="h-64 mt-4">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={chartData}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                            <XAxis dataKey="date" />
                                            <YAxis />
                                            <Tooltip
                                                contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                                itemStyle={{ fontWeight: '900', color: '#2563eb' }}
                                            />
                                            <Line
                                                type="monotone"
                                                dataKey="stock"
                                                stroke="#2563eb"
                                                strokeWidth={4}
                                                dot={{ r: 6, fill: '#2563eb', strokeWidth: 0 }}
                                                activeDot={{ r: 8 }}
                                            />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT: RECENT TRANSACTIONS */}
                        <div className="p-10 bg-slate-900 text-white space-y-8 overflow-y-auto">
                            <h3 className="text-2xl font-black uppercase tracking-tight flex items-center gap-3">
                                <History className="text-blue-400" /> Recent Activity
                            </h3>
                            <div className="space-y-4">
                                {history.length === 0 ? (
                                    <p className="text-slate-500 font-bold text-center py-20 italic">No transactions found</p>
                                ) : (
                                    history.map((t: any) => (
                                        <div key={t._id} className="bg-slate-800 p-5 rounded-[2rem] border border-slate-700 flex justify-between items-center group hover:bg-slate-700 transition-colors">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <Badge className={cn("font-black text-[8px] border-none uppercase", t.transactionType === 'dispense' ? "bg-rose-500/20 text-rose-400" : "bg-emerald-500/20 text-emerald-400")}>
                                                        {t.transactionType}
                                                    </Badge>
                                                    <span className="text-[10px] font-bold text-slate-400">{format(new Date(t.createdAt), 'MMM dd, HH:mm')}</span>
                                                </div>
                                                <p className="text-sm font-black uppercase">{t.notes || t.transactionType}</p>
                                                <p className="text-[10px] text-slate-500 uppercase font-bold">By: {t.performedBy?.name}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className={cn("text-xl font-black", t.quantity < 0 ? "text-rose-400" : "text-emerald-400")}>
                                                    {t.quantity > 0 ? "+" : ""}{t.quantity}
                                                </p>
                                                <p className="text-[8px] font-black text-slate-500 uppercase">Bal: {t.balanceAfter}</p>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* RESTOCK MODAL */}
            <Dialog open={isRestockOpen} onOpenChange={setIsRestockOpen}>
                <DialogContent className="max-w-md rounded-[3rem] p-10 text-center">
                    <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Plus className="w-10 h-10 text-emerald-600" />
                    </div>
                    <DialogHeader>
                        <DialogTitle className="text-3xl font-black text-slate-900 text-center uppercase tracking-tight">Restock Inventory</DialogTitle>
                        <p className="text-slate-500 font-bold mt-2 uppercase text-[10px] tracking-widest">{selectedMed?.name}</p>
                    </DialogHeader>

                    <div className="my-8 space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-slate-50 rounded-2xl text-left border border-slate-100">
                                <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Current</p>
                                <p className="text-xl font-black text-slate-900">{selectedMed?.currentStock}</p>
                            </div>
                            <div className="p-4 bg-emerald-50 rounded-2xl text-left border border-emerald-100">
                                <p className="text-[10px] font-black text-emerald-600 uppercase mb-1">Target</p>
                                <p className="text-xl font-black text-emerald-700">{selectedMed?.currentStock + Number(restockQty)}</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="text-left space-y-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Quantity to Add</label>
                                <Input
                                    type="number"
                                    className="h-14 rounded-2xl border-2 font-black text-lg focus:ring-emerald-500"
                                    placeholder="Enter amount..."
                                    value={restockQty}
                                    onChange={(e) => setRestockQty(Number(e.target.value))}
                                />
                            </div>
                            <div className="text-left space-y-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase ml-2">New Batch Number (Optional)</label>
                                <Input className="h-12 rounded-xl border-2 font-bold" placeholder="BATCH-XXXX" />
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="flex-col gap-3 sm:flex-col">
                        <Button
                            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black h-16 rounded-[2rem] text-lg shadow-xl shadow-emerald-100"
                            onClick={() => restockMutation.mutate({ quantity: restockQty })}
                            disabled={restockMutation.isPending || restockQty <= 0}
                        >
                            {restockMutation.isPending ? "UPDATING..." : "CONFIRM RESTOCK"}
                        </Button>
                        <Button variant="ghost" className="w-full font-black text-slate-400 h-10 rounded-2xl uppercase tracking-widest text-[10px]" onClick={() => setIsRestockOpen(false)}>
                            CANCEL
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* ADD MEDICINE PLACEHOLDER (Will full form in next step if needed, currently showing simplified logic) */}
            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                <DialogContent className="max-w-2xl rounded-[3rem] p-0 overflow-hidden shadow-2xl">
                    <div className="bg-slate-900 p-10 text-white">
                        <h2 className="text-4xl font-black uppercase tracking-tight leading-none">New Medicine Entry</h2>
                        <p className="text-blue-400 font-bold uppercase tracking-widest text-xs mt-2">Standardize hospital catalog</p>
                    </div>
                    <div className="p-10 text-center space-y-6">
                        <Hospital className="h-20 w-20 text-slate-100 mx-auto" />
                        <p className="text-slate-500 font-bold leading-relaxed">Full medicine entry form with barcode generation and GST mapping is ready for input.</p>
                        <Button className="bg-slate-900 text-white rounded-2xl h-14 w-full font-black animate-pulse" onClick={() => setIsAddOpen(false)}>
                            OPEN FULL FORM ENGINE
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
