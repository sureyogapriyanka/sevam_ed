import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiCall } from "../../utils/api";
import { format } from "date-fns";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Input } from "../../components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../../components/ui/table";
import { Search, FileText, CheckCircle, Eye, IndianRupee } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "../../components/ui/dialog";
import { cn } from "../../lib/utils";
import { useToast } from "../../hooks/use-toast";

export default function ProcessedOrdersPage() {
    const { toast } = useToast();
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedOrder, setSelectedOrder] = useState<any>(null);
    const [isViewOpen, setIsViewOpen] = useState(false);

    // Fetch today's flow data to get dispensed items
    const { data: flowData = [], isLoading } = useQuery({
        queryKey: ["/api/flow/today"],
        queryFn: () => apiCall("/flow/today"),
        refetchInterval: 30000,
    });

    const dispensedOrders = flowData.filter((item: any) => item.status === "dispensed");

    const filteredOrders = dispensedOrders.filter((order: any) => {
        const query = searchQuery.toLowerCase();
        return (
            order.patientName?.toLowerCase().includes(query) ||
            order.tokenNumber?.toLowerCase().includes(query) ||
            order.doctorName?.toLowerCase().includes(query)
        );
    });

    const handleViewReceipt = (order: any) => {
        setSelectedOrder(order);
        setIsViewOpen(true);
    };

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900 border-l-4 border-blue-600 pl-3">
                        Processed Orders Terminal
                    </h2>
                    <p className="text-muted-foreground mt-1">
                        Review and print daily patient dispense receipts.
                    </p>
                </div>
            </div>

            <Card className="shadow-md border-t-4 border-t-primary">
                <CardHeader className="pb-3 border-b border-gray-100 bg-gray-50/50">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <CardTitle className="text-lg font-semibold flex items-center gap-2">
                            <FileText className="h-5 w-5 text-primary" />
                            Daily Dispensed Receipts
                        </CardTitle>
                        <div className="flex items-center gap-2 w-full md:w-auto">
                            <div className="relative w-full md:w-64">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search by token, patient, doctor..."
                                    className="pl-9 bg-white"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader className="bg-gray-50">
                                <TableRow>
                                    <TableHead className="w-[100px] whitespace-nowrap">Token #</TableHead>
                                    <TableHead>Patient Details</TableHead>
                                    <TableHead>Consulting Doctor</TableHead>
                                    <TableHead>Dispensed At</TableHead>
                                    <TableHead className="text-right">Total Bill</TableHead>
                                    <TableHead className="text-center">Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                                            Loading receipts...
                                        </TableCell>
                                    </TableRow>
                                ) : filteredOrders.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center py-12">
                                            <div className="flex flex-col items-center gap-3">
                                                <FileText className="h-12 w-12 text-gray-300" />
                                                <p className="text-muted-foreground">No dispensed receipts found for today.</p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredOrders.map((order: any) => (
                                        <TableRow key={order.id} className="hover:bg-blue-50/50 transition-colors">
                                            <TableCell className="font-medium whitespace-nowrap">
                                                {order.tokenNumber}
                                            </TableCell>
                                            <TableCell>
                                                <div className="font-semibold">{order.patientName}</div>
                                                <div className="text-xs text-muted-foreground">Age: {order.patientAge} • {order.patientGender}</div>
                                            </TableCell>
                                            <TableCell>{order.doctorName || "N/A"}</TableCell>
                                            <TableCell>
                                                <div className="text-sm">
                                                    {format(new Date(order.updatedAt), "hh:mm a")}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right font-semibold text-emerald-600">
                                                ₹{order.totalBillAmount?.toLocaleString() || "0"}
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <Badge
                                                    variant="outline"
                                                    className="bg-emerald-50 text-emerald-700 border-emerald-200"
                                                >
                                                    <CheckCircle className="mr-1 h-3 w-3" />
                                                    Dispensed
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-blue-600 hover:bg-blue-50 hover:text-blue-700 font-medium"
                                                    onClick={() => handleViewReceipt(order)}
                                                >
                                                    <Eye className="mr-2 h-4 w-4" />
                                                    View Receipt
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            {/* Receipt Modal */}
            <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
                <DialogContent className="max-w-2xl bg-white/95 backdrop-blur-none border border-gray-200">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-xl font-bold border-b pb-4">
                            <FileText className="h-6 w-6 text-blue-600" />
                            Dispense Receipt
                        </DialogTitle>
                    </DialogHeader>

                    {selectedOrder && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg border border-gray-100">
                                <div>
                                    <p className="text-sm text-gray-500 font-medium">Patient Details</p>
                                    <p className="font-bold text-lg">{selectedOrder.patientName}</p>
                                    <p className="text-sm">Token: {selectedOrder.tokenNumber}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 font-medium">Consulting Doctor</p>
                                    <p className="font-semibold">{selectedOrder.doctorName || "N/A"}</p>
                                    <p className="text-sm">Date: {format(new Date(selectedOrder.updatedAt), "PPpp")}</p>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Dispensed Items</h3>
                                <div className="border rounded-md">
                                    <Table>
                                        <TableHeader className="bg-gray-50">
                                            <TableRow>
                                                <TableHead>Medicine</TableHead>
                                                <TableHead className="text-center">Quantity</TableHead>
                                                <TableHead className="text-right">Price</TableHead>
                                                <TableHead className="text-right">Total</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {selectedOrder.medicines?.map((med: any, idx: number) => (
                                                <TableRow key={`med-${idx}`} className={!med.isAvailable ? "bg-red-50 text-red-500 opacity-60 line-through" : ""}>
                                                    <TableCell className="font-medium">{med.name}</TableCell>
                                                    <TableCell className="text-center">{med.quantity}</TableCell>
                                                    <TableCell className="text-right text-gray-500">
                                                        ₹{med.prescribedPrice || med.price || 0}
                                                    </TableCell>
                                                    <TableCell className="text-right font-medium">
                                                        ₹{(med.prescribedPrice || med.price || 0) * (med.quantity || 0)}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            </div>

                            <div className="flex justify-between items-center bg-blue-50 p-4 rounded-lg border border-blue-100 mt-6">
                                <span className="text-blue-900 font-medium text-lg">Total Amount Paid</span>
                                <span className="text-2xl font-bold flex items-center text-blue-700">
                                    <IndianRupee className="h-5 w-5 mr-1" />
                                    {selectedOrder.totalBillAmount?.toLocaleString() || "0"}
                                </span>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
