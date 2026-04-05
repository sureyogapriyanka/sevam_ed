import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useLanguage } from "../../contexts/LanguageContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiCall } from "../../utils/api";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Skeleton } from "../../components/ui/skeleton";
import { useToast } from "../../hooks/use-toast";
import { cn } from "../../lib/utils";
import NotificationBell from "../../components/NotificationBell";
import useNotifications from "../../hooks/useNotifications";
import {
    Users,
    Calendar,
    AlertTriangle,
    Clock,
    Activity,
    UserCheck,
    TrendingUp,
    CheckCircle,
    Bell,
    Search,
    Stethoscope,
    Heart,
    Thermometer,
    Pill,
    ArrowRight,
    LayoutDashboard,
    FileText,
    ChevronRight
} from "lucide-react";
import { formatDistanceToNow } from 'date-fns';

export default function DoctorOverviewPage() {
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const { toast } = useToast();
    const { notifications } = useNotifications();
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    // Fetch Flow Data (Filter for 'vitals_done' for doctor)
    const { data: flowData = [], isLoading: loadingFlow } = useQuery<any[]>({
        queryKey: ["/api/flow/today"],
        queryFn: () => apiCall("/flow/today"),
        refetchInterval: 15000
    });

    const fetchedPatients = flowData.filter(a => a.status === 'vitals_done' || a.status === 'consulting');

    // Mock data for demonstration if no real patients
    const readyPatients = useMemo(() => {
        if (fetchedPatients.length > 0) return fetchedPatients;
        
        // Return 10 mock patients as requested
        return Array(10).fill(null).map((_, i) => ({
            _id: `mock-${i}`,
            tokenNumber: 101 + i,
            patientId: {
                _id: `p-${i}`,
                name: ["Amit Sharma", "Priya Patel", "Vikram Singh", "Anjali Gupta", "Rajesh Kumar", "Sunita Verma", "Arjun Reddy", "Meera Nair", "Suresh Iyer", "Deepa Rani"][i],
                userId: {
                    age: 24 + (i * 3),
                    gender: i % 2 === 0 ? "Male" : "Female"
                }
            },
            vitalsId: {
                heartRate: 72 + (i % 5),
                temperature: 98.4 + (i * 0.1),
                bloodPressure: "120/80"
            },
            checkedInAt: new Date(Date.now() - (i * 12 * 60000)).toISOString(),
            status: 'vitals_done'
        }));
    }, [fetchedPatients]);

    // Stats calculations
    const stats = useMemo(() => {
        const ready = readyPatients.length;
        const consulting = readyPatients.filter(p => p.status === 'consulting').length;

        return [
            {
                title: "Assigned Patients",
                value: ready,
                icon: Clock,
                color: "text-blue-600",
                bg: "bg-blue-50",
                desc: "In Queue"
            },
            {
                title: "In Consultation",
                value: consulting,
                icon: Stethoscope,
                color: "text-purple-600",
                bg: "bg-purple-50",
                desc: "Active"
            },
            {
                title: "Checked Today",
                value: 8, // Placeholder
                icon: CheckCircle,
                color: "text-emerald-600",
                bg: "bg-emerald-50",
                desc: "Patients seen"
            },
            {
                title: "Needs Attention",
                value: readyPatients.filter(p => (p.priority === 'urgent' || p.priority === 'emergency') && p._id.startsWith('mock-') === false).length,
                icon: AlertTriangle,
                color: "text-rose-600",
                bg: "bg-rose-50",
                desc: "Priority cases"
            }
        ];
    }, [readyPatients]);

    // WebSocket refresh trigger
    useEffect(() => {
        const lastNotif = notifications[0];
        if (lastNotif && lastNotif.type === 'vitals_complete') {
            queryClient.invalidateQueries({ queryKey: ["/api/flow/today"] });
            toast({
                title: "New Patient Ready",
                description: `${lastNotif.patientName} vitals done - ready for consultation!`,
            });
        }
    }, [notifications, queryClient, toast]);

    const handleStartConsultation = async (aptId: string) => {
        if (aptId.startsWith('mock-')) {
            navigate(`/doctor/consultation/${aptId}`);
            return;
        }
        try {
            await apiCall(`/flow/start-consultation/${aptId}`, { method: 'POST' });
            navigate(`/doctor/consultation/${aptId}`);
        } catch (err) {
            toast({
                title: "Error",
                description: "Failed to start consultation",
                variant: "destructive"
            });
        }
    };

    return (
        <div className="space-y-8 pb-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white shadow-lg">
                    <LayoutDashboard size={24} />
                </div>
                <div>
                    <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Doctor's <span className="text-blue-600">Portal</span></h1>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        {currentTime.toLocaleTimeString()} · WELCOME BACK · Dr. {user?.name || 'Staff'}
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
                <Badge className="bg-white text-blue-600 shadow-sm border border-slate-200 px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all flex items-center gap-2">
                    <Activity size={14} /> ACTIVE SESSION
                </Badge>
                <div className="px-4 border-l border-slate-200">
                    <NotificationBell />
                </div>
            </div>
        </div>

            {/* Minimal Stats Row — Integrated directly into the background */}
            <div className="bg-white/40 backdrop-blur-sm border border-slate-200/60 rounded-[2.5rem] p-8 shadow-sm">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                    {stats.map((stat, i) => (
                        <div key={i} className={cn(
                            "flex items-center gap-6",
                            i !== 0 && "lg:border-l lg:border-slate-100 lg:pl-8"
                        )}>
                            <div className={`${stat.bg} ${stat.color} p-4 rounded-2xl`}>
                                <stat.icon size={24} />
                            </div>
                            <div className="space-y-0.5">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.title}</p>
                                <div className="flex items-baseline gap-2">
                                    <h3 className="text-3xl font-black text-slate-900 leading-none">{stat.value}</h3>
                                    <span className={cn("text-[9px] font-black uppercase tracking-tighter", stat.color)}>{stat.desc.split(' ')[0]}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* INTEGRATED READY QUEUE SECTION */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="flex items-center justify-between pl-2">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-blue-50 rounded-xl">
                                <Users className="text-blue-600 h-5 w-5" />
                            </div>
                            <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Today's <span className="text-blue-600 font-black italic">Waiting Room</span></h2>
                        </div>
                        <span className="bg-slate-100 text-slate-500 rounded-full px-4 py-1 text-[9px] font-black uppercase tracking-[0.2em]">{readyPatients.length} Active</span>
                    </div>

                    <div className="divide-y divide-slate-100 bg-white/50 rounded-[2.5rem] border border-slate-200/60 overflow-hidden">
                        {loadingFlow ? (
                            Array(3).fill(0).map((_, i) => <Skeleton key={i} className="h-24 w-full" />)
                        ) : readyPatients.length === 0 ? (
                            <div className="py-24 text-center">
                                <CheckCircle className="h-10 w-10 text-emerald-500 mx-auto mb-4 opacity-20" />
                                <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em]">All Clear · Monitoring Entry Point</p>
                            </div>
                        ) : (
                            readyPatients.map((apt) => (
                                <div key={apt._id} className="group hover:bg-blue-50/40 transition-all p-8 flex flex-col md:flex-row items-center gap-8">
                                    <div className="flex items-center gap-6 flex-1 min-w-0 w-full">
                                        <div className="w-14 h-14 bg-blue-100 rounded-2xl flex flex-col items-center justify-center shrink-0 border border-blue-200/50">
                                            <span className="text-[8px] font-bold text-blue-400 uppercase tracking-tighter">TOKEN</span>
                                            <span className="text-xl font-black text-blue-700 leading-none">{apt.tokenNumber}</span>
                                        </div>
                                        
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-xl font-black text-slate-900 truncate uppercase tracking-tight">
                                                {apt.patientId?.userId?.name || apt.patientId?.name || "Unknown Patient"}
                                            </h3>
                                            <div className="flex items-center gap-4 mt-1.5 font-bold text-[10px] text-slate-400 uppercase tracking-widest">
                                                <span>{apt.patientId?.userId?.age || apt.patientId?.age || '—'}Y</span>
                                                <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                                                <span>{apt.patientId?.userId?.gender || apt.patientId?.gender || '—'}</span>
                                                <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                                                <span>ID: {apt.patientId?._id?.slice(-6).toUpperCase()}</span>
                                            </div>
                                        </div>

                                        <div className="hidden lg:flex items-center gap-6 border-l border-slate-100 pl-8">
                                            <div className="space-y-1">
                                                <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em]">Heart Rate</p>
                                                <div className="flex items-center gap-1.5 text-rose-500 leading-none">
                                                    <Heart size={14} className="fill-rose-500/10" />
                                                    <span className="text-sm font-black">{apt.vitalsId?.heartRate || '--'}</span>
                                                </div>
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em]">Body Temp</p>
                                                <div className="flex items-center gap-1.5 text-amber-600 leading-none">
                                                    <Thermometer size={14} />
                                                    <span className="text-sm font-black">{apt.vitalsId?.temperature || '--'}°</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-6 w-full md:w-auto md:border-l md:border-slate-100 md:pl-8">
                                        <div className="text-left md:text-right hidden sm:block min-w-[80px]">
                                            <p className="text-[8px] font-black text-slate-300 uppercase tracking-[0.2em]">Waiting</p>
                                            <span className="text-[10px] font-black text-slate-600 uppercase">
                                                {formatDistanceToNow(new Date(apt.checkedInAt || Date.now())).replace('about ', '')}
                                            </span>
                                        </div>
                                        <Button
                                            className="grow md:grow-0 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-xl text-[9px] px-6 py-5 shadow-lg shadow-blue-500/20 uppercase tracking-widest transition-all"
                                            onClick={() => handleStartConsultation(apt._id)}
                                        >
                                            START SESSION <ArrowRight className="h-3 w-3 ml-2" />
                                        </Button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* MINIMAL SIDEBAR SECTION */}
                <div className="space-y-8">
                    <div className="bg-white/40 backdrop-blur-sm border border-slate-200/60 rounded-[2.5rem] overflow-hidden">
                        <div className="p-8 pb-4">
                            <div className="flex items-center gap-3 mb-1">
                                <TrendingUp className="h-5 w-5 text-blue-600" />
                                <h3 className="text-xl font-black uppercase italic text-slate-900 tracking-tight">Care Metrics</h3>
                            </div>
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Operational Overview</p>
                        </div>
                        
                        <div className="p-8 pt-4 space-y-8">
                            <div className="relative overflow-hidden group p-6 rounded-3xl bg-blue-600 text-white shadow-xl shadow-blue-200/50 transition-all">
                                <Activity className="absolute -right-4 -top-4 h-24 w-24 text-white/10 rotate-12 group-hover:scale-110 transition-transform" />
                                <p className="text-[10px] font-black text-blue-100 uppercase tracking-[0.2em] mb-1 relative z-10">Avg Visit Duration</p>
                                <p className="text-4xl font-black tracking-tighter relative z-10">4.2<span className="text-xl ml-1 text-blue-200">min</span></p>
                            </div>

                            <div className="space-y-3 px-1">
                                <div className="flex justify-between text-[9px] font-black text-slate-400 uppercase tracking-widest">
                                    <span>Workload</span>
                                    <span className="text-slate-900">8 / 20 Cases</span>
                                </div>
                                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                                    <div className="bg-blue-500 h-full w-[40%] rounded-full shadow-[0_0_8px_rgba(59,130,246,0.5)]"></div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em] mb-4">Quick Protocols</p>
                                <div className="grid grid-cols-1 gap-2">
                                    <Button variant="ghost" className="justify-between h-14 px-4 bg-slate-50/50 border border-slate-100 rounded-2xl font-black text-slate-600 uppercase text-[9px] tracking-widest hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 transition-all group/btn" onClick={() => navigate('/prescriptions')}>
                                        <div className="flex items-center gap-3 leading-none">
                                            <div className="p-2 bg-white rounded-lg border border-slate-100 group-hover/btn:border-blue-100 shadow-sm">
                                                <FileText size={16} className="text-blue-600" />
                                            </div>
                                            PRESCRIPTIONS
                                        </div>
                                        <ChevronRight size={14} className="text-slate-300" />
                                    </Button>
                                    <Button variant="ghost" className="justify-between h-14 px-4 bg-slate-50/50 border border-slate-100 rounded-2xl font-black text-slate-600 uppercase text-[9px] tracking-widest hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 transition-all group/btn" onClick={() => navigate('/doctor/patients')}>
                                        <div className="flex items-center gap-3 leading-none">
                                            <div className="p-2 bg-white rounded-lg border border-slate-100 group-hover/btn:border-blue-100 shadow-sm">
                                                <Users size={16} className="text-blue-600" />
                                            </div>
                                            MEDICAL HUB
                                        </div>
                                        <ChevronRight size={14} className="text-slate-300" />
                                    </Button>

                                    <Button variant="ghost" className="justify-between h-14 px-4 bg-blue-600 text-white border border-blue-700 rounded-2xl font-black uppercase text-[9px] tracking-widest hover:bg-blue-700 transition-all group/btn" onClick={() => navigate('/doctor/queue')}>
                                        <div className="flex items-center gap-3 leading-none">
                                            <div className="p-2 bg-blue-500/20 rounded-lg border border-blue-400 group-hover/btn:border-blue-300 shadow-sm">
                                                <Stethoscope size={16} className="text-white" />
                                            </div>
                                            START CONSULTATION SERVICE
                                        </div>
                                        <ChevronRight size={14} className="text-blue-200" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
