import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "../../lib/queryClient";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter
} from "../ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "../ui/select";
import { toast } from "../../hooks/use-toast";
import {
    CreditCard,
    Download,
    CheckCircle,
    AlertCircle,
    FileText
} from "lucide-react";
import { generateReceiptPDF } from "./ReceiptTemplate";

interface Payment {
    id: string;
    patientId: string;
    patientName: string;
    amount: number;
    service: string;
    status: string;
    createdAt: Date;
    appointmentId?: string;
}

interface ReceiptData {
    id: string;
    patientId: string;
    patientName: string;
    amount: number;
    service: string;
    paymentDate: Date;
    receiptNumber: string;
    doctorName?: string;
    queueNumber?: number;
    estimatedWaitTime?: number;
    paymentMethod: string;
}

export default function PaymentModal({
    isOpen,
    onClose,
    onPaymentProcessed
}: {
    isOpen: boolean;
    onClose: () => void;
    onPaymentProcessed: () => void;
}) {
    const queryClient = useQueryClient();
    const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
    const [paymentMethod, setPaymentMethod] = useState("cash");

    // Mock pending payments data
    const pendingPayments: Payment[] = [
        {
            id: "pay_001",
            patientId: "pat_001",
            patientName: "John Smith",
            amount: 150.00,
            service: "General Consultation",
            status: "pending",
            createdAt: new Date(Date.now() - 3600000), // 1 hour ago
            appointmentId: "apt_001"
        },
        {
            id: "pay_002",
            patientId: "pat_002",
            patientName: "Sarah Johnson",
            amount: 75.50,
            service: "Follow-up Visit",
            status: "pending",
            createdAt: new Date(Date.now() - 7200000), // 2 hours ago
            appointmentId: "apt_002"
        },
        {
            id: "pay_003",
            patientId: "pat_003",
            patientName: "Michael Brown",
            amount: 200.00,
            service: "Lab Tests",
            status: "pending",
            createdAt: new Date(Date.now() - 10800000), // 3 hours ago
            appointmentId: "apt_003"
        }
    ];

    // Process payment mutation
    const processPaymentMutation = useMutation({
        mutationFn: async (paymentId: string) => {
            // In a real app, this would be an API call to process the payment
            // For now, we'll simulate the process
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve({ success: true });
                }, 1500);
            });
        },
        onSuccess: (_, paymentId) => {
            // Update the payment status
            const payment = pendingPayments.find(p => p.id === paymentId);
            if (payment) {
                setSelectedPayment(payment);
                toast({
                    title: "Success",
                    description: "Payment processed successfully"
                });
                queryClient.invalidateQueries({ queryKey: ["/api/payments/pending"] });
            }
        },
        onError: () => {
            toast({
                title: "Error",
                description: "Failed to process payment",
                variant: "destructive"
            });
        }
    });

    // Generate receipt
    const generateReceipt = (): ReceiptData => {
        if (!selectedPayment) {
            throw new Error("No payment selected");
        }

        // In a real app, this would come from the backend
        const receiptData: ReceiptData = {
            id: `receipt_${Date.now()}`,
            patientId: selectedPayment.patientId,
            patientName: selectedPayment.patientName,
            amount: selectedPayment.amount,
            service: selectedPayment.service,
            paymentDate: new Date(),
            receiptNumber: `RCT-${Date.now().toString().slice(-6)}`,
            doctorName: "Dr. Anderson",
            queueNumber: Math.floor(Math.random() * 20) + 1,
            estimatedWaitTime: Math.floor(Math.random() * 30) + 15,
            paymentMethod: paymentMethod
        };

        return receiptData;
    };

    // Download receipt as PDF
    const downloadReceipt = () => {
        if (!selectedPayment) return;

        try {
            const receipt = generateReceipt();
            generateReceiptPDF(receipt);

            toast({
                title: "Success",
                description: "Receipt downloaded successfully"
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to generate receipt",
                variant: "destructive"
            });
        }
    };

    // Complete payment process
    const completePayment = () => {
        if (!selectedPayment) return;

        try {
            // 1. Download receipt
            downloadReceipt();

            // 2. Send copy to patient appointment records (simulated)
            toast({
                title: "Success",
                description: `Receipt sent to ${selectedPayment.patientName}'s records`
            });

            // 3. Show success notification
            toast({
                title: (
                    <div className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2" />
                        <div>
                            <p className="font-medium">Payment Complete</p>
                            <p className="text-sm">
                                Please inform {selectedPayment.patientName} to approach the reception
                                and collect their receipt.
                            </p>
                            <p className="text-sm mt-1">
                                Queue #: {Math.floor(Math.random() * 20) + 1} |
                                Wait Time: {Math.floor(Math.random() * 30) + 15} mins
                            </p>
                        </div>
                    </div>
                ) as any,
                duration: 10000
            });

            // Reset and close
            setSelectedPayment(null);
            onPaymentProcessed();
            onClose();
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to complete payment process",
                variant: "destructive"
            });
        }
    };

    // Handle payment approval
    const handleApprovePayment = (payment: Payment) => {
        setSelectedPayment(payment);
        processPaymentMutation.mutate(payment.id);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center">
                        <CreditCard className="h-5 w-5 mr-2" />
                        Payment Processing
                    </DialogTitle>
                </DialogHeader>

                {!selectedPayment ? (
                    // Pending Payments List
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {pendingPayments.map((payment) => (
                                <Card key={payment.id} className="hover:shadow-md transition-shadow">
                                    <CardHeader className="pb-2">
                                        <div className="flex justify-between items-start">
                                            <CardTitle className="text-lg">{payment.patientName}</CardTitle>
                                            <Badge variant="secondary">₹{payment.amount.toFixed(2)}</Badge>
                                        </div>
                                        <p className="text-sm text-muted-foreground">{payment.service}</p>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-muted-foreground">
                                                {new Date(payment.createdAt).toLocaleTimeString()}
                                            </span>
                                            <Badge variant="outline">{payment.status}</Badge>
                                        </div>
                                        <div className="mt-4 flex space-x-2">
                                            <Button
                                                size="sm"
                                                onClick={() => handleApprovePayment(payment)}
                                                disabled={processPaymentMutation.isPending}
                                                className="flex-1"
                                            >
                                                {processPaymentMutation.isPending ? "Processing..." : "Approve Payment"}
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        {pendingPayments.length === 0 && (
                            <div className="text-center py-8">
                                <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                <p className="text-muted-foreground">No pending payments</p>
                            </div>
                        )}
                    </div>
                ) : (
                    // Receipt Preview
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <FileText className="h-5 w-5 mr-2" />
                                    Receipt Preview
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="border rounded-lg p-6 bg-white">
                                    <div className="text-center mb-6">
                                        <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                                            <img src="/sevamed logo.png" alt="SevaMed Logo" className="w-8 h-8 object-contain" />
                                        </div>
                                        <h2 className="text-2xl font-bold text-blue-600">SEVA ONLINE MEDICAL CENTER</h2>
                                        <p className="text-muted-foreground">123 Healthcare Avenue, Medical District</p>
                                        <p className="text-muted-foreground">Hyderabad, Telangana 500001, India</p>
                                        <p className="text-muted-foreground">Phone: +91 12345 67890 | Email: info@sevaonline.com</p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 mb-6">
                                        <div>
                                            <Label className="text-muted-foreground">Receipt #</Label>
                                            <p>RCPT-{Date.now().toString().slice(-6)}</p>
                                        </div>
                                        <div>
                                            <Label className="text-muted-foreground">Date</Label>
                                            <p>{new Date().toLocaleDateString()}</p>
                                        </div>
                                        <div>
                                            <Label className="text-muted-foreground">Patient</Label>
                                            <p>{selectedPayment.patientName}</p>
                                        </div>
                                        <div>
                                            <Label className="text-muted-foreground">Service</Label>
                                            <p>{selectedPayment.service}</p>
                                        </div>
                                    </div>

                                    <div className="border-t border-b py-4 my-4">
                                        <div className="flex justify-between items-center">
                                            <span className="font-medium">Total Amount</span>
                                            <span className="text-lg font-bold">₹{selectedPayment.amount.toFixed(2)}</span>
                                        </div>
                                    </div>

                                    <div className="mb-6">
                                        <Label className="text-muted-foreground">Payment Method</Label>
                                        <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select payment method" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="cash">Cash</SelectItem>
                                                <SelectItem value="card">Credit/Debit Card</SelectItem>
                                                <SelectItem value="insurance">Insurance</SelectItem>
                                                <SelectItem value="mobile">Mobile Payment</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="bg-muted rounded-lg p-4">
                                        <h3 className="font-medium mb-2">Next Steps</h3>
                                        <ul className="text-sm space-y-1">
                                            <li>• Patient will be added to the doctor's queue</li>
                                            <li>• Estimated wait time: {Math.floor(Math.random() * 30) + 15} minutes</li>
                                            <li>• Patient should collect receipt at reception desk</li>
                                        </ul>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3">
                            <Button
                                variant="outline"
                                onClick={() => setSelectedPayment(null)}
                                disabled={processPaymentMutation.isPending}
                            >
                                Back
                            </Button>
                            <Button
                                onClick={downloadReceipt}
                                variant="secondary"
                            >
                                <Download className="h-4 w-4 mr-2" />
                                Download Receipt
                            </Button>
                            <Button
                                onClick={completePayment}
                                disabled={processPaymentMutation.isPending}
                            >
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Complete Payment
                            </Button>
                        </div>
                    </div>
                )}

                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>
                        Close
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
