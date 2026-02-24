import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiCall } from "../../utils/api";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";
import { Skeleton } from "../../components/ui/skeleton";
import {
    ClipboardList,
    Plus,
    Search,
    Truck,
    Clock,
    CheckCircle,
    XCircle,
    Eye,
    ArrowRight,
    Package,
    Store,
    Calendar,
    ChevronDown,
    Trash2
} from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter
} from "../../components/ui/dialog";
import { format } from "date-fns";
import { useToast } from "../../hooks/use-toast";
import { cn } from "../../lib/utils";

export default function PurchaseOrdersPage() {
    const queryClient = useQueryClient();
    const { toast } = useToast();
    const [searchQuery, setSearchQuery] = useState("");
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isReceiveOpen, setIsReceiveOpen] = useState(false);
    const [selectedPO, setSelectedPO] = useState<any>(null);

    // Form states for new PO
    const [supplierName, setSupplierName] = useState("");
    const [poItems, setPoItems] = useState<any[]>([]);
    const [itemInput, setItemInput] = useState({ name: "", quantity: 0, price: 0 });

    // Fetch POs
    const { data: purchaseOrders = [], isLoading } = useQuery({
        queryKey: ["/api/purchase-orders"],
        queryFn: () => apiCall("/purchase-orders")
    });

    const createMutation = useMutation({
        mutationFn: (data: any) => apiCall("/purchase-orders", {
            method: 'POST',
            body: JSON.stringify(data)
        }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/purchase-orders"] });
            setIsCreateOpen(false);
            resetForm();
            toast({ title: "PO Created!", description: "Purchase order is now in draft." });
        }
    });

    const receiveMutation = useMutation({
        mutationFn: (id: string) => apiCall(`/purchase-orders/${id}/receive`, {
            method: 'PUT'
        }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/purchase-orders"] });
            queryClient.invalidateQueries({ queryKey: ["/api/medicines"] });
            setIsReceiveOpen(false);
            toast({ title: "Items Received!", description: "Inventory has been updated." });
        }
    });

    const resetForm = () => {
        setSupplierName("");
        setPoItems([]);
        setItemInput({ name: "", quantity: 0, price: 0 });
    };

    const addItem = () => {
        if (!itemInput.name || itemInput.quantity <= 0) return;
        setPoItems([...poItems, { ...itemInput, total: itemInput.quantity * itemInput.price }]);
        setItemInput({ name: "", quantity: 0, price: 0 });
    };

    const removeItem = (idx: number) => {
        setPoItems(poItems.filter((_, i) => i !== idx));
    };

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'received': return "bg-emerald-100 text-emerald-700 border-emerald-200";
            case 'sent': return "bg-blue-100 text-blue-700 border-blue-200";
            case 'partial': return "bg-amber-100 text-amber-700 border-amber-200";
            case 'cancelled': return "bg-rose-100 text-rose-700 border-rose-200";
            default: return "bg-slate-100 text-slate-700 border-slate-200";
        }
    };

    return (
        <div className="space-y-8 pb-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-1">
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight uppercase">Procurement / PO</h1>
                    <p className="text-slate-500 font-bold uppercase tracking-widest text-xs flex items-center gap-2">
                        <Truck size={14} className="text-blue-600" /> Track supplier orders and arrivals
                    </p>
                </div>
                <Button className="bg-blue-600 hover:bg-blue-700 rounded-2xl font-black gap-2 h-14 px-8 shadow-xl shadow-blue-100" onClick={() => setIsCreateOpen(true)}>
                    <Plus size={24} /> CREATE PURCHASE ORDER
                </Button>
            </div>

            {/* Main Content */}
            <Card className="border-none shadow-2xl rounded-[3rem] overflow-hidden bg-white">
                <CardHeader className="p-8 pb-4 bg-slate-50 border-b border-slate-100">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <CardTitle className="text-2xl font-black text-slate-900 flex items-center gap-3">
                            <ClipboardList className="text-blue-600" size={28} /> Active Orders
                        </CardTitle>
                        <div className="relative w-full md:w-96">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <Input
                                className="pl-12 h-12 rounded-xl border-none bg-white shadow-sm font-bold"
                                placeholder="Search by PO# or Supplier..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-100">
                                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">PO Details</th>
                                    <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Supplier</th>
                                    <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Items</th>
                                    <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Total Amount</th>
                                    <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {isLoading ? (
                                    Array(5).fill(0).map((_, i) => (
                                        <tr key={i}><td colSpan={6} className="p-8"><Skeleton className="h-12 w-full rounded-2xl" /></td></tr>
                                    ))
                                ) : purchaseOrders.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="p-20 text-center">
                                            <Package className="h-16 w-16 text-slate-200 mx-auto mb-4" />
                                            <p className="text-slate-400 font-black uppercase text-xs tracking-widest">No purchase orders found</p>
                                        </td>
                                    </tr>
                                ) : purchaseOrders.map((po: any) => (
                                    <tr key={po._id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="bg-slate-900 text-white p-3 rounded-2xl">
                                                    <Truck size={20} />
                                                </div>
                                                <div>
                                                    <p className="font-black text-slate-900 uppercase leading-none mb-1">{po.poNumber}</p>
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase">{format(new Date(po.createdAt), 'dd MMM yyyy')}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-6">
                                            <div className="flex items-center gap-2">
                                                <Store size={14} className="text-slate-400" />
                                                <span className="font-black text-slate-700 uppercase">{po.supplier?.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-6 text-center">
                                            <Badge variant="outline" className="font-black text-[10px] rounded-lg border-2 border-slate-200">{po.items?.length} SKUs</Badge>
                                        </td>
                                        <td className="px-6 py-6 text-center">
                                            <p className="text-lg font-black text-slate-900">₹{po.totalAmount?.toLocaleString()}</p>
                                        </td>
                                        <td className="px-6 py-6 text-center">
                                            <Badge className={cn("font-black text-[10px] px-3 py-1 rounded-full uppercase border-2", getStatusStyle(po.status))}>
                                                {po.status}
                                            </Badge>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Button variant="ghost" size="icon" className="h-10 w-10 bg-white border shadow-sm rounded-xl">
                                                    <Eye size={18} />
                                                </Button>
                                                {po.status !== 'received' && (
                                                    <Button
                                                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-xl h-10 px-4 text-xs gap-2"
                                                        onClick={() => { setSelectedPO(po); setIsReceiveOpen(true); }}
                                                    >
                                                        RECEIVE <ArrowRight size={14} />
                                                    </Button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            {/* CREATE PO MODAL */}
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogContent className="max-w-3xl rounded-[3rem] p-0 overflow-hidden shadow-2xl border-none">
                    <div className="bg-blue-600 p-8 text-white">
                        <h2 className="text-3xl font-black uppercase tracking-tight">Draft Purchase Order</h2>
                        <p className="text-blue-100 font-bold uppercase tracking-widest text-[10px] mt-1">Select supplier and add inventory items</p>
                    </div>
                    <div className="p-10 space-y-8 max-h-[70vh] overflow-y-auto">
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Supplier Name</label>
                                    <Input className="h-12 rounded-xl border-2 font-bold" placeholder="E.g. Apollo Pharma Ltd." value={supplierName} onChange={(e) => setSupplierName(e.target.value)} />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Contact / Email</label>
                                    <Input className="h-12 rounded-xl border-2 font-bold" placeholder="contact@supplier.com" />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-lg font-black text-slate-900 border-b-2 border-slate-100 pb-2 flex items-center gap-2">
                                <Plus size={18} className="text-blue-600" /> Add Items
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                <div className="md:col-span-2 space-y-1">
                                    <Input className="h-12 rounded-xl border-none shadow-sm font-bold" placeholder="Medicine Name" value={itemInput.name} onChange={(e) => setItemInput({ ...itemInput, name: e.target.value })} />
                                </div>
                                <Input type="number" className="h-12 rounded-xl border-none shadow-sm font-bold" placeholder="Qty" value={itemInput.quantity} onChange={(e) => setItemInput({ ...itemInput, quantity: Number(e.target.value) })} />
                                <Button className="h-12 rounded-xl font-black bg-slate-900" onClick={addItem}>ADD</Button>
                            </div>

                            <div className="space-y-2">
                                {poItems.map((item, i) => (
                                    <div key={i} className="flex items-center justify-between p-4 bg-white border-2 border-slate-100 rounded-xl">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-slate-100 p-2 rounded-lg"><Package size={16} className="text-slate-400" /></div>
                                            <span className="font-black text-slate-900 uppercase text-sm">{item.name}</span>
                                        </div>
                                        <div className="flex items-center gap-6">
                                            <Badge className="bg-slate-100 text-slate-700 font-black border-none px-3">{item.quantity} units</Badge>
                                            <Button variant="ghost" size="icon" className="text-slate-300 hover:text-rose-500" onClick={() => removeItem(i)}>
                                                <Trash2 size={16} />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="p-8 bg-slate-50 flex justify-between items-center">
                        <Button variant="ghost" className="font-black text-slate-400" onClick={() => setIsCreateOpen(false)}>CANCEL</Button>
                        <Button
                            className="bg-blue-600 hover:bg-blue-700 h-14 px-10 rounded-2xl font-black text-lg gap-2 shadow-xl shadow-blue-100"
                            disabled={poItems.length === 0 || !supplierName}
                            onClick={() => createMutation.mutate({
                                supplier: { name: supplierName },
                                items: poItems
                            })}
                        >
                            {createMutation.isPending ? "CREATING..." : "GENERATE PO"}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* RECEIVE PO MODAL */}
            <Dialog open={isReceiveOpen} onOpenChange={setIsReceiveOpen}>
                <DialogContent className="max-w-md rounded-[3rem] p-10 text-center">
                    <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="w-10 h-10 text-emerald-600" />
                    </div>
                    <DialogHeader>
                        <DialogTitle className="text-3xl font-black text-slate-900 text-center uppercase tracking-tight">Receive Order</DialogTitle>
                        <p className="text-slate-500 font-bold mt-2 uppercase text-[10px] tracking-widest">{selectedPO?.poNumber} · {selectedPO?.supplier?.name}</p>
                    </DialogHeader>

                    <div className="my-8 p-6 bg-slate-50 rounded-[2rem] text-left border-2 border-dashed border-slate-200">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Items Summary</p>
                        <div className="space-y-3">
                            {selectedPO?.items?.map((item: any, i: number) => (
                                <div key={i} className="flex justify-between items-center text-sm font-black">
                                    <span className="text-slate-700 uppercase">{item.name}</span>
                                    <span className="text-emerald-600">{item.quantity} units</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <p className="text-xs font-bold text-slate-400 mb-8 leading-relaxed">
                        Received items will be automatically added to the medical catalog and stock transactions will be logged.
                    </p>

                    <DialogFooter className="flex-col gap-3 sm:flex-col">
                        <Button
                            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black h-16 rounded-[2rem] text-lg shadow-xl shadow-emerald-100"
                            onClick={() => receiveMutation.mutate(selectedPO?._id)}
                            disabled={receiveMutation.isPending}
                        >
                            {receiveMutation.isPending ? "UPDATING STOCK..." : "SUBMIT & STOCK-IN"}
                        </Button>
                        <Button variant="ghost" className="w-full font-black text-slate-400 h-10 rounded-2xl uppercase tracking-widest text-[10px]" onClick={() => setIsReceiveOpen(false)}>
                            CANCEL
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
