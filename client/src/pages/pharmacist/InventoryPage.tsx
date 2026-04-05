import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiCall } from "../../utils/api";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";
import { Skeleton } from "../../components/ui/skeleton";
import { MedicineDetailsModal } from "../../components/pharmacist/MedicineDetailsModal";
import {
    Search,
    Filter,
    Plus,
    Package,
    AlertTriangle,
    SearchCheck,
    Hospital,
    ShieldAlert,
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

    // Stats
    const stats = useMemo(() => {
        return {
            total: medicines.length,
            lowStock: medicines.filter((m: any) => m.stockStatus === 'low_stock').length,
            outOfStock: medicines.filter((m: any) => m.stockStatus === 'out_of_stock').length,
            expiringSoon: medicines.filter((m: any) => m.expiryStatus === 'expiring_soon').length
        };
    }, [medicines]);

    return (
        <div className="bg-slate-50/50 min-h-screen p-4 md:p-8 space-y-8 relative overflow-hidden">

            {/* TECHNICAL REPOSITORY TERMINAL (Header) */}
            <div className="bg-white border-2 border-slate-100 rounded-3xl p-8 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-8 relative overflow-hidden group">
                <div className="relative z-10 flex items-center gap-6">
                    <div className="h-12 w-12 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-100">
                        <Package className="h-6 w-6 text-white" />
                    </div>
                    <div className="space-y-0.5">
                        <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] leading-none mb-1">Pharmacist Center · System Active</p>
                        <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-3">
                            Medical Repository
                            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
                        </h1>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic opacity-60">Real-time clinical stock terminal</p>
                    </div>
                </div>
            </div>

            {/* ── KPI METRICS ── */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: "Total Inventory", count: stats.total, icon: Package, color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-100" },
                    { label: "Low Stock Alert", count: stats.lowStock, icon: AlertTriangle, color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-100" },
                    { label: "Out of Stock", count: stats.outOfStock, icon: ShieldAlert, color: "text-rose-600", bg: "bg-rose-50", border: "border-rose-100" },
                    { label: "Category Count", count: categories.length, icon: Filter, color: "text-indigo-600", bg: "bg-indigo-50", border: "border-indigo-100" }
                ].map((stat, i) => (
                    <Card key={i} className="bg-white border-2 border-slate-200/60 shadow-sm hover:shadow-md hover:border-blue-400/30 transition-all duration-300 group rounded-2xl overflow-hidden">
                        <CardContent className="p-6 flex items-center justify-between">
                            <div className="space-y-0.5">
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                                <p className="text-3xl font-black text-slate-900 tracking-tighter">{stat.count}</p>
                            </div>
                            <div className={`${stat.bg} ${stat.color} p-3 rounded-xl group-hover:scale-105 transition-all border ${stat.border}`}>
                                <stat.icon size={20} />
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
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <Input
                                className="pl-10 h-10 rounded-xl border-none bg-slate-50 font-bold placeholder:text-slate-300 text-slate-700 text-xs"
                                placeholder="Search by name, generic, symptoms, or barcode..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                                <SelectTrigger className="h-10 rounded-xl border-2 font-black uppercase text-[9px] tracking-widest">
                                    <SelectValue placeholder="CATEGORY" />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl font-black uppercase text-[9px]">
                                    <SelectItem value="all">ALL CATEGORIES</SelectItem>
                                    {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                                </SelectContent>
                            </Select>

                            <Select value={stockFilter} onValueChange={setStockFilter}>
                                <SelectTrigger className="h-10 rounded-xl border-2 font-black uppercase text-[9px] tracking-widest">
                                    <SelectValue placeholder="STOCK" />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl font-black uppercase text-[9px]">
                                    <SelectItem value="all">ALL STOCK</SelectItem>
                                    <SelectItem value="in_stock">IN STOCK</SelectItem>
                                    <SelectItem value="low_stock">LOW STOCK</SelectItem>
                                    <SelectItem value="out_of_stock">OUT OF STOCK</SelectItem>
                                </SelectContent>
                            </Select>

                            <Select value={expiryFilter} onValueChange={setExpiryFilter}>
                                <SelectTrigger className="h-10 rounded-xl border-2 font-black uppercase text-[9px] tracking-widest">
                                    <SelectValue placeholder="EXPIRY" />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl font-black uppercase text-[9px]">
                                    <SelectItem value="all">ALL EXPIRY</SelectItem>
                                    <SelectItem value="valid">VALID</SelectItem>
                                    <SelectItem value="expiring_soon">EXPIRING SOON</SelectItem>
                                    <SelectItem value="expired">EXPIRED</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* ── REPOSITORY DATABASE (Dense Table View) ── */}
            <div className="bg-white border-2 border-slate-200/60 shadow-xl rounded-[2.5rem] overflow-hidden">
                <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <h2 className="text-xl font-black text-slate-900 flex items-center gap-3">
                        <SearchCheck className="text-blue-600" size={24} />
                        REPOSITORY DATABASE
                        <Badge className="bg-blue-100 text-blue-600 font-black rounded-lg">{medicines.length} Products</Badge>
                    </h2>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200">
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left w-16">#</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">Medicine / Generic Name</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">Category</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">Stock Level</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Selling Price</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {isLoading ? (
                                Array(10).fill(0).map((_, i) => (
                                    <tr key={i}><td colSpan={6} className="px-6 py-4"><Skeleton className="h-8 w-full rounded-lg" /></td></tr>
                                ))
                            ) : medicines.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-24 text-center">
                                        <Package className="h-12 w-12 text-slate-200 mx-auto mb-4" />
                                        <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">No matching medicinals</h3>
                                    </td>
                                </tr>
                            ) : (
                                medicines.map((med: any, idx: number) => {
                                    const isLow = med.stockStatus === 'low_stock';
                                    const isOut = med.stockStatus === 'out_of_stock';

                                    return (
                                        <tr key={med._id} className="hover:bg-blue-50/20 transition-colors group">
                                            <td className="px-6 py-4">
                                                <span className="text-xs font-bold text-slate-300">{(idx + 1).toString().padStart(2, '0')}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="space-y-0.5">
                                                    <p className="font-black text-slate-900 group-hover:text-blue-700 transition-colors cursor-pointer" onClick={() => { setSelectedMed(med); setIsDetailOpen(true); }}>
                                                        {med.name}
                                                    </p>
                                                    <p className="text-[9px] font-bold text-slate-400 uppercase leading-none tracking-tighter truncate max-w-[200px]">{med.genericName}</p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <Badge className="bg-slate-100 text-slate-500 border-none font-black text-[8px] uppercase px-2 py-0.5 rounded-md">
                                                    {med.category}
                                                </Badge>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col gap-1 min-w-[120px]">
                                                    <div className="flex justify-between w-full text-[9px] font-black">
                                                        <span className={cn(isOut ? "text-rose-600" : isLow ? "text-amber-600" : "text-slate-600")}>
                                                            {med.currentStock} {med.unit}s
                                                        </span>
                                                        <span className="text-slate-300 uppercase">Available</span>
                                                    </div>
                                                    <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden">
                                                        <div
                                                            className={cn("h-full transition-all", isOut ? "bg-rose-600" : isLow ? "bg-orange-500" : "bg-emerald-500")}
                                                            style={{ width: `${Math.min((med.currentStock / med.maximumStock) * 100, 100)}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <p className="font-black text-slate-900 tracking-tighter">₹{med.sellingPrice}</p>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <div className="flex items-center justify-center gap-2">
                                                    <button
                                                        className="h-8 w-8 rounded-lg bg-slate-50 text-slate-400 hover:bg-blue-600 hover:text-white transition-all flex items-center justify-center border border-slate-100"
                                                        onClick={() => { setSelectedMed(med); setIsDetailOpen(true); }}
                                                    >
                                                        <SearchCheck size={14} />
                                                    </button>
                                                    <button
                                                        className="h-8 w-8 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-all flex items-center justify-center shadow-lg shadow-blue-100"
                                                        onClick={() => { setSelectedMed(med); setIsRestockOpen(true); }}
                                                    >
                                                        <Plus size={14} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <MedicineDetailsModal 
                medicine={selectedMed} 
                isOpen={isDetailOpen} 
                onClose={setIsDetailOpen} 
            />

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

                    <DialogFooter className="flex-col gap-2 sm:flex-col">
                        <Button
                            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black h-12 rounded-xl text-sm shadow-lg shadow-emerald-100 uppercase tracking-widest"
                            onClick={() => restockMutation.mutate({ quantity: restockQty })}
                            disabled={restockMutation.isPending || restockQty <= 0}
                        >
                            {restockMutation.isPending ? "UPDATING..." : "CONFIRM RESTOCK"}
                        </Button>
                        <Button variant="ghost" className="w-full font-black text-slate-400 h-9 rounded-xl uppercase tracking-widest text-[9px]" onClick={() => setIsRestockOpen(false)}>
                            CANCEL
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* ADD MEDICINE PLACEHOLDER */}
            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                <DialogContent className="max-w-2xl rounded-[3rem] p-0 overflow-hidden shadow-2xl">
                    <div className="bg-slate-900 p-10 text-white">
                        <h2 className="text-4xl font-black uppercase tracking-tight leading-none">New Medicine Entry</h2>
                        <p className="text-blue-400 font-bold uppercase tracking-widest text-xs mt-2">Standardize hospital catalog</p>
                    </div>
                    <div className="p-10 text-center space-y-6">
                        <Hospital className="h-20 w-20 text-slate-100 mx-auto" />
                        <p className="text-slate-500 font-bold leading-relaxed">Full medicine entry form with barcode generation and GST mapping is ready for input.</p>
                        <Button className="bg-slate-900 text-white rounded-xl h-12 w-full font-black uppercase tracking-widest text-xs" onClick={() => setIsAddOpen(false)}>
                            OPEN FULL FORM ENGINE
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
