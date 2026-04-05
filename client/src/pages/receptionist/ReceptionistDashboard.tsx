import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiCall } from "../../utils/api";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";
import { Skeleton } from "../../components/ui/skeleton";
import { cn } from "../../lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../../components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { useToast } from "../../hooks/use-toast";
import NotificationBell from "../../components/NotificationBell";
import AppointmentFlowStatus from "../../components/AppointmentFlowStatus";
import useNotifications from "../../hooks/useNotifications";
import { QRCodeSVG } from "qrcode.react";
import {
    Users,
    UserPlus,
    CreditCard,
    Calendar,
    Clock,
    Search,
    TrendingUp,
    AlertCircle,
    ArrowUpRight,
    Wallet,
    Stethoscope,
    Filter,
    CheckCircle2,
    Camera,
    User,
    Lock,
    X
} from "lucide-react";

export default function ReceptionistDashboard() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { toast } = useToast();
    const { notifications } = useNotifications();
    const [currentTime, setCurrentTime] = useState(new Date());
    const [filter, setFilter] = useState('all');

    // Profile editing state
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [profileData, setProfileData] = useState({ name: '', email: '', password: '', newPassword: '' });
    const [profileImage, setProfileImage] = useState<string | null>(null);
    const [profileSaving, setProfileSaving] = useState(false);

    // Check-in Modal State
    const [isCheckInOpen, setIsCheckInOpen] = useState(false);
    const [isRegisterOpen, setIsRegisterOpen] = useState(false);
    const [registerData, setRegisterData] = useState({ name: '', age: '', gender: 'Male', phone: '', doctorId: '' });
    const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
    const [opdFee, setOpdFee] = useState(300);
    const [tendered, setTendered] = useState("");

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    // Fetch Operational Flow for Today
    const { data: flowData = [], isLoading: loadingFlow } = useQuery<any[]>({
        queryKey: ["/api/flow/today"],
        queryFn: () => apiCall("/flow/today"),
        refetchInterval: 10000 // Polling fallback
    });

    // Stats calculation from flow data
    const stats = {
        checkedIn: flowData.filter(a => a.status === 'checked_in').length,
        consulting: flowData.filter(a => a.status === 'consulting').length,
        readyForBilling: flowData.filter(a => a.status === 'consulted').length,
        todayRevenue: flowData.reduce((acc, curr) => acc + (curr.opdFeePaid ? (curr.opdFee || 0) : 0), 0)
    };

    // WebSocket refresh trigger
    useEffect(() => {
        const lastNotif = notifications[0];
        if (lastNotif && (lastNotif.type === 'consultation_complete' || lastNotif.type === 'vitals_complete')) {
            queryClient.invalidateQueries({ queryKey: ["/api/flow/today"] });
            toast({
                title: "Flow Update",
                description: `${lastNotif.patientName}: ${lastNotif.message}`,
            });
        }
    }, [notifications, queryClient, toast]);

    const handleProfileSave = async () => {
        setProfileSaving(true);
        try {
            const token = localStorage.getItem('token') || '';
            const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
            const body: any = {};
            if (profileData.name) body.name = profileData.name;
            if (profileData.email) body.email = profileData.email;
            if (profileData.newPassword) body.password = profileData.newPassword;
            if (profileImage) body.profileImage = profileImage;
            await fetch(`${API_URL}/users/profile`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify(body)
            });
            toast({ title: 'Profile Updated', description: 'Your profile has been saved.' });
            setIsProfileOpen(false);
        } catch { toast({ title: 'Error', description: 'Failed to save profile.', variant: 'destructive' }); }
        finally { setProfileSaving(false); }
    };

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => setProfileImage(reader.result as string);
        reader.readAsDataURL(file);
    };

    // Mutations
    const checkInMutation = useMutation({
        mutationFn: ({ id, data }: { id: string, data: any }) =>
            apiCall(`/flow/checkin/${id}`, { method: 'POST', body: JSON.stringify(data) }),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["/api/flow/today"] });
            setIsCheckInOpen(false);
            toast({
                title: "Check-In Success",
                description: `Patient checked in! Token: ${data.tokenNumber}`,
                variant: "default",
            });
        }
    });

    const formatINR = (amount: number) =>
        new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);

    const filteredFlow = flowData.filter(a => {
        if (filter === 'all') return true;
        if (filter === 'waiting') return a.status === 'booked';
        if (filter === 'vitals') return a.status === 'checked_in';
        if (filter === 'doctor') return a.status === 'consulting' || a.status === 'vitals_done';
        if (filter === 'billing') return a.status === 'consulted' || a.status === 'billing';
        if (filter === 'completed') return a.status === 'completed';
        return true;
    });

    const registerPatientMutation = useMutation({
        mutationFn: (data: any) => apiCall('/flow/emergency-register', { method: 'POST', body: JSON.stringify(data) }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/flow/today"] });
            setIsRegisterOpen(false);
            setRegisterData({ name: '', age: '', gender: 'Male', phone: '', doctorId: '' });
            toast({ title: "Patient Registered", description: "Emergency patient added to queue." });
        },
        onError: () => toast({ title: "Registration Failed", variant: "destructive" })
    });

    const upiString = selectedAppointment ? `upi://pay?pa=${import.meta.env.VITE_TILL_UPI_ID || 'seva@upi'}&pn=SevaOnline&am=${opdFee}&cu=INR&tn=OPD-${selectedAppointment.tokenNumber || selectedAppointment._id.slice(-6)}` : "";

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Top Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                        Reception Console
                        <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    </h1>
                    <p className="text-slate-500 font-bold text-sm mt-1">Monitoring patient lifecycle and OPD flow.</p>
                </div>
                
                <div className="flex items-center gap-4">
                    <Button 
                        onClick={() => setIsRegisterOpen(true)}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl px-6 h-12 shadow-xl shadow-blue-100 gap-2 text-xs transition-all hover:scale-[1.02]"
                    >
                        <UserPlus className="h-4 w-4" /> REGISTER NEW PATIENT
                    </Button>

                    <div className="h-12 w-[1px] bg-slate-200 hidden md:block mx-1" />

                    <div className="flex items-center gap-3 bg-white p-1.5 rounded-[1.25rem] shadow-sm border border-slate-100 pr-4">
                        <div className="bg-blue-50 p-2.5 rounded-xl text-blue-600">
                            <Clock className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] leading-none mb-1">Live Status</p>
                            <p className="text-xs font-black text-slate-900 leading-none">
                                {currentTime.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} • {currentTime.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                            </p>
                        </div>
                        <div className="pl-2 border-l border-slate-100">
                            <NotificationBell />
                        </div>
                    </div>

                    <button
                        onClick={() => setIsProfileOpen(true)}
                        className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-lg hover:bg-blue-700 transition-all hover:scale-105 font-black shrink-0"
                    >
                        {profileImage
                            ? <img src={profileImage} alt="profile" className="w-full h-full rounded-2xl object-cover" />
                            : <User className="h-5 w-5" />}
                    </button>
                </div>
            </div>

            {/* Premium Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="relative group overflow-hidden bg-white border border-slate-100 p-8 rounded-[2.5rem] shadow-sm transition-all hover:shadow-xl hover:border-blue-100">
                    <div className="absolute -right-6 -top-6 w-32 h-32 bg-blue-50 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="relative z-10 flex flex-col justify-between h-full">
                        <div className="flex justify-between items-start mb-6">
                            <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl">
                                <Users size={24} />
                            </div>
                            <Badge className="bg-blue-100 text-blue-700 border-none px-3 font-black text-[9px] uppercase tracking-tighter">WAITING</Badge>
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Waiting for Vitals</p>
                            <div className="flex items-baseline gap-2">
                                <h3 className="text-4xl font-black text-slate-900 tracking-tighter">{stats.checkedIn}</h3>
                                <span className="text-[10px] font-bold text-slate-400">Patients</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="relative group overflow-hidden bg-white border border-slate-100 p-8 rounded-[2.5rem] shadow-sm transition-all hover:shadow-xl hover:border-emerald-100">
                    <div className="absolute -right-6 -top-6 w-32 h-32 bg-emerald-50 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="relative z-10 flex flex-col justify-between h-full">
                        <div className="flex justify-between items-start mb-6">
                            <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl">
                                <Stethoscope size={24} />
                            </div>
                            <Badge className="bg-emerald-100 text-emerald-700 border-none px-3 font-black text-[9px] uppercase tracking-tighter">IN SESSION</Badge>
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">With Doctors</p>
                            <div className="flex items-baseline gap-2">
                                <h3 className="text-4xl font-black text-slate-900 tracking-tighter">{stats.consulting}</h3>
                                <span className="text-[10px] font-bold text-slate-400">Active</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="relative group overflow-hidden bg-white border border-slate-100 p-8 rounded-[2.5rem] shadow-sm transition-all hover:shadow-xl hover:border-rose-100">
                    <div className="absolute -right-6 -top-6 w-32 h-32 bg-rose-50 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="relative z-10 flex flex-col justify-between h-full">
                        <div className="flex justify-between items-start mb-6">
                            <div className="p-4 bg-rose-50 text-rose-600 rounded-2xl">
                                <Wallet size={24} />
                            </div>
                            <Badge className="bg-rose-100 text-rose-700 border-none px-3 font-black text-[9px] uppercase tracking-tighter">BILLING</Badge>
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Pending Invoices</p>
                            <div className="flex items-baseline gap-2">
                                <h3 className="text-4xl font-black text-slate-900 tracking-tighter">{stats.readyForBilling}</h3>
                                <span className="text-[10px] font-bold text-slate-400">Action Req.</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="relative group overflow-hidden bg-white border border-slate-100 p-8 rounded-[2.5rem] shadow-sm transition-all hover:shadow-xl hover:border-blue-100">
                    <div className="absolute -right-6 -top-6 w-32 h-32 bg-blue-50 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="relative z-10 flex flex-col justify-between h-full">
                        <div className="flex justify-between items-start mb-6">
                            <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl">
                                <TrendingUp size={24} />
                            </div>
                            <Badge className="bg-blue-100 text-blue-700 border-none px-3 font-black text-[9px] uppercase tracking-tighter">REVENUE</Badge>
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Today's Collections</p>
                            <h3 className="text-3xl font-black text-slate-900 tracking-tighter italic">{formatINR(stats.todayRevenue)}</h3>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Flow Table */}
            <Card className="border-2 border-slate-100 shadow-xl rounded-[2.5rem] overflow-hidden">
                <CardHeader className="bg-slate-50/80 border-b border-slate-100 px-8 py-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <CardTitle className="text-xl font-black text-slate-900 flex items-center gap-2">
                            <TrendingUp className="h-5 w-5 text-blue-600" />
                            Live Patient Flow Pipeline
                        </CardTitle>
                        <div className="flex bg-slate-200/50 p-1 rounded-xl gap-1">
                            {['all', 'waiting', 'vitals', 'doctor', 'billing', 'completed'].map((tab) => (
                                <Button
                                    key={tab}
                                    variant={filter === tab ? "default" : "ghost"}
                                    size="sm"
                                    className={cn(
                                        "capitalize text-[10px] font-black h-8 px-3 rounded-lg",
                                        filter === tab && "bg-white text-blue-600 shadow-sm hover:bg-white"
                                    )}
                                    onClick={() => setFilter(tab)}
                                >
                                    {tab}
                                </Button>
                            ))}
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b">
                                <tr>
                                    <th className="px-8 py-4">Token</th>
                                    <th className="px-4 py-4">Patient</th>
                                    <th className="px-4 py-4">Assigned Doctor</th>
                                    <th className="px-4 py-4 min-w-[300px]">Flow Status</th>
                                    <th className="px-4 py-4">OPD FEE</th>
                                    <th className="px-8 py-4 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredFlow.map((apt: any) => (
                                    <tr key={apt._id} className="hover:bg-blue-50/20 transition-colors">
                                        <td className="px-8 py-5">
                                            <span className="bg-slate-100 text-slate-900 border border-slate-200 px-3 py-1 rounded-xl font-black text-[10px] tracking-tight">
                                                {apt.tokenNumber || '---'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-5 font-bold text-slate-700">
                                            {apt.patientName || apt.patientId?.name || 'Unknown'}
                                        </td>
                                        <td className="px-4 py-5 font-bold text-slate-500">Dr. {apt.doctorId?.name}</td>
                                        <td className="px-4 py-5">
                                            <AppointmentFlowStatus currentStatus={apt.status} />
                                        </td>
                                        <td className="px-4 py-5">
                                            <div className="flex flex-col gap-1">
                                                <Badge className={apt.opdFeePaid ? "bg-emerald-100 text-emerald-700 border-none font-black" : "bg-rose-100 text-rose-700 border-none font-black"}>
                                                    {apt.opdFeePaid ? `₹${apt.opdFee || 300} PAID` : 'PENDING'}
                                                </Badge>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5 text-right">
                                            {apt.status === 'booked' && (
                                                <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 font-bold h-9 rounded-xl px-4 text-[10px] shadow-lg shadow-emerald-100 transition-all hover:scale-105" onClick={() => { setSelectedAppointment(apt); setIsCheckInOpen(true); }}>
                                                    CHECK-IN
                                                </Button>
                                            )}
                                            {(apt.status === 'consulted' || apt.status === 'billing') && (
                                                <Button size="sm" className="bg-blue-600 hover:bg-blue-700 font-bold h-9 rounded-xl px-4 text-[10px] shadow-lg shadow-blue-100 transition-all hover:scale-105" onClick={() => navigate(`/receptionist/payments?aptId=${apt._id}`)}>
                                                    GENERATE BILL
                                                </Button>
                                            )}
                                            {apt.status === 'completed' && (
                                                <Badge className="bg-slate-100 text-slate-400 border-none font-black px-3 py-1.5 rounded-lg text-[9px]">COMPLETED ✓</Badge>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                {filteredFlow.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="px-8 py-10 text-center text-slate-400 font-bold italic">
                                            No patients found for this status.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            {/* Check-In Modal */}
            <Dialog open={isCheckInOpen} onOpenChange={setIsCheckInOpen}>
                <DialogContent className="max-w-md rounded-[2rem]">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-black">Patient Check-In</DialogTitle>
                    </DialogHeader>
                    {selectedAppointment && (
                        <div className="space-y-6 py-4">
                            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Patient Details</p>
                                <p className="text-lg font-black text-slate-900">{selectedAppointment.patientId?.name}</p>
                                <p className="text-xs text-slate-500 font-medium">Dr. {selectedAppointment.doctorId?.name} · {selectedAppointment.priority} Priority</p>
                            </div>

                            <Tabs defaultValue="cash" className="w-full">
                                <TabsList className="grid grid-cols-3 w-full h-12 bg-slate-100 p-1 rounded-xl">
                                    <TabsTrigger value="cash" className="font-bold text-xs rounded-lg">CASH</TabsTrigger>
                                    <TabsTrigger value="upi" className="font-bold text-xs rounded-lg">UPI QR</TabsTrigger>
                                    <TabsTrigger value="card" className="font-bold text-xs rounded-lg">CARD</TabsTrigger>
                                </TabsList>

                                <div className="mt-6 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <label className="text-xs font-black text-slate-500 uppercase">Consultation Fee</label>
                                        <div className="flex items-center gap-2">
                                            <span className="text-lg font-black text-slate-900">₹</span>
                                            <Input
                                                type="number"
                                                className="w-24 text-right font-black text-lg h-10 border-none bg-slate-50"
                                                value={opdFee}
                                                onChange={(e) => setOpdFee(Number(e.target.value))}
                                            />
                                        </div>
                                    </div>

                                    <TabsContent value="cash" className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <label className="text-xs font-black text-slate-500 uppercase">Amount Received</label>
                                            <Input
                                                type="number"
                                                className="w-32 text-right font-black h-10 border-2 rounded-xl"
                                                placeholder="Received..."
                                                value={tendered}
                                                onChange={(e) => setTendered(e.target.value)}
                                            />
                                        </div>
                                        {Number(tendered) > opdFee && (
                                            <div className="bg-emerald-50 p-4 rounded-2xl flex justify-between items-center text-emerald-700">
                                                <span className="text-xs font-bold uppercase">Change to Return</span>
                                                <span className="text-xl font-black">₹{Number(tendered) - opdFee}</span>
                                            </div>
                                        )}
                                    </TabsContent>

                                    <TabsContent value="upi" className="flex flex-col items-center gap-4">
                                        <div className="p-4 bg-white border-2 border-slate-100 rounded-3xl shadow-sm">
                                            <QRCodeSVG value={upiString} size={150} />
                                        </div>
                                        <p className="text-[10px] text-slate-400 font-bold text-center">Scan to pay ₹{opdFee} to Hospital Till</p>
                                    </TabsContent>

                                    <TabsContent value="card">
                                        <div className="p-8 text-center bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                                            <CreditCard className="mx-auto h-8 w-8 text-slate-300 mb-2" />
                                            <p className="text-xs font-bold text-slate-400">Swipe card on terminal</p>
                                        </div>
                                    </TabsContent>
                                </div>
                            </Tabs>
                        </div>
                    )}
                    <DialogFooter>
                        <Button
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12 font-black rounded-2xl text-base shadow-lg shadow-blue-200"
                            onClick={() => checkInMutation.mutate({
                                id: selectedAppointment._id,
                                data: { opdFee, paymentMethod: 'cash' } // Simplified for now
                            })}
                            disabled={checkInMutation.isPending}
                        >
                            {checkInMutation.isPending ? "PROCESSING..." : "CONFIRM CHECK-IN & COLLECT FEE"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Emergency Registration Modal */}
            <Dialog open={isRegisterOpen} onOpenChange={setIsRegisterOpen}>
                <DialogContent className="max-w-md rounded-[2.5rem]">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-black flex items-center gap-2">
                            <UserPlus className="h-6 w-6 text-blue-600" />
                            Emergency Registration
                        </DialogTitle>
                    </DialogHeader>
                    
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1">Patient Name</label>
                            <Input 
                                placeholder="Full Name" 
                                className="h-12 rounded-2xl border-2 bg-slate-50 font-bold"
                                value={registerData.name}
                                onChange={e => setRegisterData({...registerData, name: e.target.value})}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1">Age</label>
                                <Input 
                                    type="number" 
                                    placeholder="Age" 
                                    className="h-12 rounded-2xl border-2 bg-slate-50 font-bold"
                                    value={registerData.age}
                                    onChange={e => setRegisterData({...registerData, age: e.target.value})}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1">Gender</label>
                                <select 
                                    className="w-full h-12 rounded-2xl border-2 bg-slate-50 font-bold px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={registerData.gender}
                                    onChange={e => setRegisterData({...registerData, gender: e.target.value})}
                                >
                                    <option>Male</option>
                                    <option>Female</option>
                                    <option>Other</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1">Phone Number</label>
                            <Input 
                                placeholder="Phone" 
                                className="h-12 rounded-2xl border-2 bg-slate-50 font-bold"
                                value={registerData.phone}
                                onChange={e => setRegisterData({...registerData, phone: e.target.value})}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1">Assign Doctor</label>
                            <select 
                                className="w-full h-12 rounded-2xl border-2 bg-slate-50 font-bold px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={registerData.doctorId}
                                onChange={e => setRegisterData({...registerData, doctorId: e.target.value})}
                            >
                                <option value="">Select Doctor...</option>
                                {flowData.map(a => a.doctorId).filter((v, i, a) => a.findIndex(t => t?._id === v?._id) === i).map(doc => (
                                    <option key={doc?._id} value={doc?._id}>Dr. {doc?._name || doc?.name}</option>
                                ))}
                                <option value="mock-1">Dr. Sure Yoga Priyanka</option>
                            </select>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button 
                            className="w-full h-14 bg-slate-900 hover:bg-slate-800 text-white font-black rounded-2xl text-base shadow-xl shadow-slate-200"
                            onClick={() => registerPatientMutation.mutate(registerData)}
                            disabled={registerPatientMutation.isPending || !registerData.name}
                        >
                            {registerPatientMutation.isPending ? "REGISTERING..." : "REGISTER & ADD TO QUEUE"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Profile Edit Modal */}
            <Dialog open={isProfileOpen} onOpenChange={setIsProfileOpen}>
                <DialogContent className="max-w-md rounded-[2rem]">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-black">Edit Profile</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-5 py-4">
                        {/* Photo Upload */}
                        <div className="flex flex-col items-center gap-3">
                            <label htmlFor="rec-photo" className="relative cursor-pointer group">
                                <div className="w-24 h-24 rounded-full bg-blue-50 border-4 border-blue-100 flex items-center justify-center overflow-hidden">
                                    {profileImage
                                        ? <img src={profileImage} alt="profile" className="w-full h-full object-cover" />
                                        : <User className="h-10 w-10 text-blue-300" />}
                                </div>
                                <div className="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full p-1.5 group-hover:bg-blue-700 transition-colors">
                                    <Camera className="h-4 w-4" />
                                </div>
                            </label>
                            <input id="rec-photo" type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
                            <p className="text-[10px] font-bold text-slate-400 uppercase">Click to change photo</p>
                        </div>
                        <div className="space-y-3">
                            <div>
                                <label className="text-xs font-black text-slate-500 uppercase mb-1 block">Full Name</label>
                                <Input placeholder="Your name" value={profileData.name}
                                    onChange={e => setProfileData(p => ({ ...p, name: e.target.value }))}
                                    className="rounded-xl border-slate-200" />
                            </div>
                            <div>
                                <label className="text-xs font-black text-slate-500 uppercase mb-1 block">Email</label>
                                <Input type="email" placeholder="your@email.com" value={profileData.email}
                                    onChange={e => setProfileData(p => ({ ...p, email: e.target.value }))}
                                    className="rounded-xl border-slate-200" />
                            </div>
                            <div>
                                <label className="text-xs font-black text-slate-500 uppercase mb-1 block flex items-center gap-1"><Lock className="h-3 w-3" /> New Password</label>
                                <Input type="password" placeholder="Leave blank to keep current" value={profileData.newPassword}
                                    onChange={e => setProfileData(p => ({ ...p, newPassword: e.target.value }))}
                                    className="rounded-xl border-slate-200" />
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setIsProfileOpen(false)} className="rounded-2xl">Cancel</Button>
                        <Button onClick={handleProfileSave} disabled={profileSaving}
                            className="bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black px-8">
                            {profileSaving ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
