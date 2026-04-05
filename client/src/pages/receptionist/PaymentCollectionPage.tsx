import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "../../lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Badge } from "../../components/ui/badge";
import { toast } from "../../hooks/use-toast";
import { QRCodeSVG } from "qrcode.react";
import {
    CreditCard,
    Banknote,
    Smartphone,
    ShieldCheck,
    Printer,
    CheckCircle2,
    ArrowLeft,
    XCircle,
    Copy,
    Receipt
} from "lucide-react";

type PaymentMode = 'upi' | 'cash' | 'card' | 'insurance';

export default function PaymentCollectionPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const billId = searchParams.get('billId');
    const aptId = searchParams.get('aptId');
    const [mode, setMode] = useState<PaymentMode>('upi');
    const [upiRef, setUpiRef] = useState('');
    const [cashReceived, setCashReceived] = useState('');
    const [isPaid, setIsPaid] = useState(false);
    const [resolvedBillId, setResolvedBillId] = useState<string | null>(billId);
    const [creatingBill, setCreatingBill] = useState(false);

    const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') || '' : '';

    // Auto-create bill from appointment if aptId is given but no billId
    useEffect(() => {
        if (resolvedBillId || !aptId) return;
        const create = async () => {
            setCreatingBill(true);
            try {
                // Fetch appointment
                const aptRes = await fetch(`${API_URL}/appointments/${aptId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (!aptRes.ok) throw new Error('Could not load appointment');
                const appt = await aptRes.json();

                const patientName = appt.patientId?.name || 'Patient';
                const patientId = appt.patientId?._id || appt.patientId;

                // Create bill
                const billRes = await fetch(`${API_URL}/billing`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                    body: JSON.stringify({
                        patientId,
                        patientName,
                        appointmentId: aptId,
                        items: [
                            { description: 'OPD Consultation Fee', quantity: 1, unitPrice: appt.opdFee || 300 }
                        ],
                        taxPercent: 0,
                        notes: `Auto-generated bill for appointment ${aptId}`
                    })
                });
                if (!billRes.ok) throw new Error('Could not create bill');
                const bill = await billRes.json();
                setResolvedBillId(bill._id);
                toast({ title: 'Bill Generated', description: `Bill #${bill.billNumber} created for ${patientName}` });
            } catch (e: any) {
                toast({ title: 'Error', description: e.message, variant: 'destructive' });
            } finally {
                setCreatingBill(false);
            }
        };
        create();
    }, [aptId, resolvedBillId]);

    // Fetch Bill Details
    const { data: bill, isLoading } = useQuery<any>({
        queryKey: [`/api/billing/${resolvedBillId}`],
        enabled: !!resolvedBillId
    });

    const formatINR = (amount: number) =>
        new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);

    const upiMutation = useMutation({
        mutationFn: async () => {
            return apiRequest("PUT", `/api/billing/${resolvedBillId}/pay`, {
                paymentMethod: 'upi',
                amountPaid: bill.grandTotal,
                upiTransactionId: upiRef
            });
        },
        onSuccess: () => {
            setIsPaid(true);
            toast({ title: "Payment Successful", description: "UPI transaction confirmed." });
        }
    });

    const cashMutation = useMutation({
        mutationFn: async () => {
            return apiRequest("PUT", `/api/billing/${resolvedBillId}/pay`, {
                paymentMethod: 'cash',
                amountPaid: bill.grandTotal,
            });
        },
        onSuccess: () => {
            setIsPaid(true);
            toast({ title: "Payment Successful", description: "Cash collection recorded." });
        }
    });

    const handlePrint = () => {
        window.print();
    };

    if (!billId && !aptId) return (
        <div className="flex flex-col items-center justify-center h-[60vh]">
            <XCircle className="h-12 w-12 text-red-400 mb-4" />
            <h2 className="text-xl font-bold">No Bill Selected</h2>
            <Button variant="link" onClick={() => navigate('/receptionist/dashboard')}>Return to Dashboard</Button>
        </div>
    );

    if (creatingBill) return (
        <div className="p-8 text-center font-bold text-blue-600 animate-pulse">
            ⏳ Generating bill from appointment...
        </div>
    );

    if (isLoading || !bill) return <div className="p-8 text-center font-bold">Loading bill details...</div>;

    // UPI String for QR: upi://pay?pa=hospital@upi&pn=SevaMed&am=500&cu=INR&tn=BillID
    const upiString = `upi://pay?pa=sevaonline@paytm&pn=SevaOnline%20Healthcare&am=${bill?.grandTotal}&cu=INR&tn=BILL-${bill?.billNumber}`;

    if (isPaid) {
        return (
            <div className="max-w-md mx-auto py-12 px-4 animate-in zoom-in-95">
                <Card className="border-t-8 border-t-emerald-500 shadow-2xl rounded-3xl overflow-hidden">
                    <CardContent className="p-8 text-center">
                        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle2 className="h-10 w-10 text-emerald-600" />
                        </div>
                        <h2 className="text-3xl font-black text-gray-900 mb-2">Payment Collected</h2>
                        <p className="text-gray-500 font-medium mb-8">Transaction successfully processed for {bill.patientName}</p>

                        <div className="bg-slate-50 rounded-2xl p-6 mb-8 border border-dashed border-gray-200">
                            <div className="flex justify-between mb-2">
                                <span className="text-gray-400 font-bold uppercase text-[10px]">Amount Received</span>
                                <span className="font-black text-emerald-600">{formatINR(bill.grandTotal)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400 font-bold uppercase text-[10px]">Payment Mode</span>
                                <span className="font-black text-gray-900 uppercase">{mode}</span>
                            </div>
                        </div>

                        <div className="flex flex-col space-y-3">
                            <Button className="h-12 bg-gray-900 hover:bg-black font-black" onClick={handlePrint}>
                                <Printer className="mr-2 h-4 w-4" /> PRINT THERMAL RECEIPT
                            </Button>
                            <Button variant="outline" className="h-12 font-black border-2" onClick={() => navigate('/receptionist/dashboard')}>
                                RETURN TO DASHBOARD
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Hidden Print Receipt Template */}
                <div className="hidden print:block p-8 font-mono text-sm uppercase">
                    <div className="text-center mb-4">
                        <h3 className="font-bold text-lg">SEVAONLINE HEALTHCARE</h3>
                        <p>India's Premium Clinic Chain</p>
                        <p>GSTIN: 27AAAAA0000A1Z5</p>
                        <hr className="my-2 border-black border-dashed" />
                    </div>
                    <div className="mb-4">
                        <p>Date: {new Date().toLocaleString()}</p>
                        <p>Receipt: RCP-{Date.now().toString().slice(-6)}</p>
                        <p>Patient: {bill.patientName}</p>
                    </div>
                    <hr className="my-2 border-black border-dashed" />
                    <div className="flex justify-between font-bold">
                        <span>Description</span>
                        <span>Total</span>
                    </div>
                    {bill.items.map((item: any) => (
                        <div className="flex justify-between" key={item.description}>
                            <span>{item.description} (x{item.quantity})</span>
                            <span>{item.total}</span>
                        </div>
                    ))}
                    <hr className="my-2 border-black border-dashed" />
                    <div className="text-right font-bold text-lg">
                        <p>Grand Total: {formatINR(bill.grandTotal)}</p>
                    </div>
                    <div className="text-center mt-8">
                        <p>Thank You For Choosing SevaOnline</p>
                        <p>Powered by Advanced HMS</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto py-8 px-4">
            <div className="flex items-center justify-between mb-8">
                <Button variant="ghost" className="font-bold text-gray-500" onClick={() => navigate(-1)}>
                    <ArrowLeft className="mr-2 h-4 w-4" /> BACK
                </Button>
                <Badge className="bg-amber-100 text-amber-700 border-none font-bold">AWAITING PAYMENT</Badge>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Bill Summary */}
                <Card className="lg:col-span-1 border-2 border-gray-100 shadow-lg rounded-3xl h-fit">
                    <CardHeader className="bg-slate-50 border-b border-gray-100 rounded-t-3xl">
                        <CardTitle className="text-lg font-black flex items-center gap-2">
                            <Receipt className="h-5 w-5 text-gray-900" />
                            Bill Details
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 space-y-4">
                        <div className="pb-4 border-b">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Patient</p>
                            <p className="text-xl font-black text-gray-900">{bill.patientName}</p>
                            <p className="text-sm font-medium text-gray-500">Bill ID: {bill.billNumber}</p>
                        </div>
                        <div className="space-y-2">
                            {bill.items.map((item: any) => (
                                <div className="flex justify-between text-sm" key={item.description}>
                                    <span className="text-gray-600 font-medium">{item.description} <span className="text-gray-400 font-bold">x{item.quantity}</span></span>
                                    <span className="font-bold text-gray-900">{formatINR(item.total)}</span>
                                </div>
                            ))}
                        </div>
                        <div className="pt-4 border-t space-y-1">
                            <div className="flex justify-between text-xs text-gray-500 font-bold">
                                <span>Subtotal</span>
                                <span>{formatINR(bill.subtotal)}</span>
                            </div>
                            <div className="flex justify-between text-xs text-gray-500 font-bold">
                                <span>Taxes (GST)</span>
                                <span>{formatINR(bill.taxAmount)}</span>
                            </div>
                            <div className="flex justify-between pt-2">
                                <span className="text-lg font-black text-gray-900">Total Payable</span>
                                <span className="text-2xl font-black text-blue-600">{formatINR(bill.grandTotal)}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Payment Selection */}
                <Card className="lg:col-span-2 border-2 border-gray-100 shadow-xl rounded-3xl">
                    <CardContent className="p-0">
                        <div className="flex border-b">
                            <button
                                className={`flex-1 py-6 flex flex-col items-center gap-2 border-b-4 transition-all ${mode === 'upi' ? 'border-b-blue-600 bg-blue-50/30' : 'border-b-transparent hover:bg-gray-50'}`}
                                onClick={() => setMode('upi')}
                            >
                                <Smartphone className={`h-6 w-6 ${mode === 'upi' ? 'text-blue-600' : 'text-gray-400'}`} />
                                <span className={`text-[10px] font-black uppercase tracking-widest ${mode === 'upi' ? 'text-blue-900' : 'text-gray-400'}`}>UPI QR</span>
                            </button>
                            <button
                                className={`flex-1 py-6 flex flex-col items-center gap-2 border-b-4 transition-all ${mode === 'cash' ? 'border-b-emerald-600 bg-emerald-50/30' : 'border-b-transparent hover:bg-gray-50'}`}
                                onClick={() => setMode('cash')}
                            >
                                <Banknote className={`h-6 w-6 ${mode === 'cash' ? 'text-emerald-600' : 'text-gray-400'}`} />
                                <span className={`text-[10px] font-black uppercase tracking-widest ${mode === 'cash' ? 'text-emerald-900' : 'text-gray-400'}`}>Cash</span>
                            </button>
                            <button
                                className={`flex-1 py-6 flex flex-col items-center gap-2 border-b-4 transition-all ${mode === 'card' ? 'border-b-amber-600 bg-amber-50/30' : 'border-b-transparent hover:bg-gray-50'}`}
                                onClick={() => setMode('card')}
                            >
                                <CreditCard className={`h-6 w-6 ${mode === 'card' ? 'text-amber-600' : 'text-gray-400'}`} />
                                <span className={`text-[10px] font-black uppercase tracking-widest ${mode === 'card' ? 'text-amber-900' : 'text-gray-400'}`}>Debit/Credit</span>
                            </button>
                            <button
                                className={`flex-1 py-6 flex flex-col items-center gap-2 border-b-4 transition-all ${mode === 'insurance' ? 'border-b-purple-600 bg-purple-50/30' : 'border-b-transparent hover:bg-gray-50'}`}
                                onClick={() => setMode('insurance')}
                            >
                                <ShieldCheck className={`h-6 w-6 ${mode === 'insurance' ? 'text-purple-600' : 'text-gray-400'}`} />
                                <span className={`text-[10px] font-black uppercase tracking-widest ${mode === 'insurance' ? 'text-purple-900' : 'text-gray-400'}`}>Insurance</span>
                            </button>
                        </div>

                        <div className="p-8">
                            {mode === 'upi' && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center animate-in fade-in slide-in-from-bottom-4">
                                    <div className="flex flex-col items-center text-center">
                                        <div className="p-6 bg-white border-4 border-slate-100 rounded-3xl shadow-inner mb-4">
                                            <QRCodeSVG value={upiString} size={200} />
                                        </div>
                                        <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
                                            <Smartphone className="h-3 w-3" /> Scan with PhonePe / GPay / BHIM
                                        </div>
                                    </div>
                                    <div className="space-y-6">
                                        <div>
                                            <h3 className="text-xl font-black text-gray-900">Step 1: Scan & Pay</h3>
                                            <p className="text-gray-500 text-sm font-medium">Point your hospital's billing smartphone at this QR code to confirm payment.</p>
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-sm font-black text-gray-700">Step 2: Enter Transaction ID / Ref No.</Label>
                                            <div className="relative">
                                                <Input
                                                    placeholder="Enter 12-digit Ref No."
                                                    className="h-12 border-2 pr-24 font-black tracking-wider"
                                                    value={upiRef}
                                                    onChange={(e) => setUpiRef(e.target.value)}
                                                />
                                                <Button size="sm" variant="ghost" className="absolute right-1 top-1 h-10 text-blue-600 font-bold">
                                                    <Copy className="h-4 w-4 mr-1" /> PASTE
                                                </Button>
                                            </div>
                                        </div>
                                        <Button
                                            className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl shadow-lg shadow-blue-100"
                                            onClick={() => upiMutation.mutate()}
                                            disabled={!upiRef || upiMutation.isPending}
                                        >
                                            {upiMutation.isPending ? 'VERIFYING...' : 'CONFIRM UPI PAYMENT'}
                                        </Button>
                                    </div>
                                </div>
                            )}

                            {mode === 'cash' && (
                                <div className="max-w-md mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 text-center">
                                    <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-2">
                                        <Banknote className="h-8 w-8 text-emerald-600" />
                                    </div>
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <Label className="text-sm font-black text-gray-700">Cash Received From Patient</Label>
                                            <div className="relative">
                                                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-gray-400">₹</span>
                                                <Input
                                                    type="number"
                                                    className="h-16 pl-10 text-3xl font-black border-2 focus-visible:ring-emerald-600"
                                                    placeholder="0.00"
                                                    value={cashReceived}
                                                    onChange={(e) => setCashReceived(e.target.value)}
                                                />
                                            </div>
                                        </div>

                                        {parseFloat(cashReceived) >= bill.grandTotal && (
                                            <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex justify-between items-center">
                                                <span className="text-emerald-700 font-bold uppercase text-xs">Return Change</span>
                                                <span className="text-2xl font-black text-emerald-600">{formatINR(parseFloat(cashReceived) - bill.grandTotal)}</span>
                                            </div>
                                        )}

                                        <Button
                                            className="w-full h-14 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-2xl shadow-lg shadow-emerald-100"
                                            onClick={() => cashMutation.mutate()}
                                            disabled={!cashReceived || parseFloat(cashReceived) < bill.grandTotal}
                                        >
                                            MARK AS PAID (CASH)
                                        </Button>
                                    </div>
                                </div>
                            )}

                            {mode === 'card' && (
                                <div className="text-center py-12 animate-in pulse">
                                    <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-amber-100 text-amber-600 font-black italic text-2xl">
                                        P
                                    </div>
                                    <h3 className="text-xl font-black text-gray-900">Use Card Terminal</h3>
                                    <p className="text-gray-500 font-medium max-w-sm mx-auto mt-2">
                                        Please swipe/dip card on the external POS machine. Once successful, mark this transaction as complete.
                                    </p>
                                    <Button className="mt-8 px-12 h-12 bg-gray-900 hover:bg-black font-black" onClick={() => setIsPaid(true)}>
                                        TERMINAL PAYMENT COLLECTED
                                    </Button>
                                </div>
                            )}

                            {mode === 'insurance' && (
                                <div className="text-center py-12 animate-in fade-in">
                                    <ShieldCheck className="h-16 w-16 text-purple-600 mx-auto mb-4" />
                                    <h3 className="text-xl font-black text-gray-900">Insurance / PMJAY Processing</h3>
                                    <p className="text-gray-500 font-medium max-w-sm mx-auto mt-2">
                                        Scan Ayushman Bharat Card or enter TPA ID to process cashless claim.
                                    </p>
                                    <div className="mt-8 flex gap-4 max-w-md mx-auto">
                                        <Input placeholder="Enter Policy/Ayushman ID" className="h-12 border-2" />
                                        <Button className="bg-purple-600 h-12 font-black">PROCESS CLAIM</Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
