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
    FileText,
    Pill,
    ArrowRight
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

    // Fetch Flow Data (Role-Filtered to 'vitals_done' for doctor)
    const { data: readyPatients = [], isLoading: loadingFlow } = useQuery<any[]>({
        queryKey: ["/api/flow/today"],
        queryFn: () => apiCall("/flow/today"),
        refetchInterval: 15000
    });

    // Stats calculations
    const stats = useMemo(() => {
        const ready = readyPatients.length;
        const consulting = readyPatients.filter(p => p.status === 'consulting').length;

        return [
            {
                title: "Ready for Consultation",
                value: ready,
                icon: Clock,
                color: "text-blue-600",
                bg: "bg-blue-50",
                desc: "Vitals recorded"
            },
            {
                title: "Currently Consulting",
                value: consulting,
                icon: Stethoscope,
                color: "text-purple-600",
                bg: "bg-purple-50",
                desc: "Active sessions"
            },
            {
                title: "Completed Today",
                value: 8, // Placeholder
                icon: CheckCircle,
                color: "text-emerald-600",
                bg: "bg-emerald-50",
                desc: "Patients seen"
            },
            {
                title: "Urgent Cases",
                value: readyPatients.filter(p => p.priority === 'urgent' || p.priority === 'emergency').length,
                icon: AlertTriangle,
                color: "text-rose-600",
                bg: "bg-rose-50",
                desc: "Priority attention"
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
            {/* WELCOME BANNER */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 p-8 text-white shadow-xl">
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <p className="text-blue-200 font-medium mb-1">
                            {currentTime.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
                        </p>
                        <h1 className="text-3xl md:text-4xl font-black tracking-tight flex items-center gap-3">
                            Consultation Mode: Dr. {user?.name || 'Staff'}
                            <NotificationBell />
                        </h1>
                        <Badge className="mt-4 bg-blue-500/20 text-blue-200 border-blue-400/30 py-1 px-4 backdrop-blur-sm">
                            <Activity className="w-3.5 h-3.5 mr-2" />
                            Live Patient Flow Active
                        </Badge>
                    </div>
                    <div className="h-20 w-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center backdrop-blur-md">
                        <Stethoscope className="h-10 w-10 text-blue-400" />
                    </div>
                </div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            </div>

            {/* STATS ROW */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <Card key={i} className="border-none shadow-lg hover:shadow-xl transition-all group rounded-[2rem]">
                        <CardContent className="p-6 flex items-center justify-between">
                            <div className="space-y-1">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.title}</p>
                                <div className="flex items-baseline gap-2">
                                    <p className="text-3xl font-black text-slate-900">{stat.value}</p>
                                    <p className="text-[10px] font-bold text-slate-400">{stat.desc}</p>
                                </div>
                            </div>
                            <div className={`${stat.bg} ${stat.color} p-4 rounded-2xl group-hover:rotate-12 transition-transform`}>
                                <stat.icon size={24} />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* READY QUEUE SECTION */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                            <Users className="w-6 h-6 text-blue-600" />
                            Ready for Consultation
                        </h2>
                        <Badge className="bg-blue-600 text-white border-none font-black px-4">
                            {readyPatients.length} WAITING
                        </Badge>
                    </div>

                    <div className="space-y-4">
                        {loadingFlow ? (
                            Array(3).fill(0).map((_, i) => <Skeleton key={i} className="h-32 w-full rounded-3xl" />)
                        ) : readyPatients.length === 0 ? (
                            <div className="py-20 text-center bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
                                <CheckCircle className="h-12 w-12 text-emerald-500 mx-auto mb-4 opacity-30" />
                                <p className="text-slate-500 font-bold">No patients ready yet</p>
                                <p className="text-slate-400 text-xs mt-1">Nurses are currently recording vitals.</p>
                            </div>
                        ) : (
                            readyPatients.map((apt) => (
                                <Card key={apt._id} className="border-none shadow-md rounded-[2.5rem] hover:shadow-lg transition-shadow overflow-hidden group">
                                    <CardContent className="p-0">
                                        <div className="flex flex-col md:flex-row">
                                            <div className="w-20 bg-slate-900 flex flex-col items-center justify-center p-4 text-white shrink-0">
                                                <span className="text-[10px] font-black opacity-60">TOKEN</span>
                                                <span className="text-2xl font-black italic">{apt.tokenNumber}</span>
                                            </div>
                                            <div className="flex-1 p-6 flex flex-col md:flex-row justify-between gap-6">
                                                <div className="space-y-3">
                                                    <div>
                                                        <h3 className="text-xl font-black text-slate-900 group-hover:text-blue-600 transition-colors uppercase">
                                                            {apt.patientId?.userId?.name || apt.patientId?.name || "Unknown Patient"}
                                                        </h3>
                                                        <p className="text-xs font-bold text-slate-500">
                                                            ID: {apt.patientId?._id?.slice(-6).toUpperCase()} · {apt.patientId?.userId?.age || apt.patientId?.age || '—'}y / {apt.patientId?.userId?.gender || apt.patientId?.gender || '—'}
                                                        </p>
                                                    </div>
                                                    <div className="flex flex-wrap gap-4">
                                                        <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
                                                            <Heart className="h-3.5 w-3.5 text-rose-500" />
                                                            <span className="text-xs font-black text-slate-700">{apt.vitalsId?.heartRate || '--'} bpm</span>
                                                        </div>
                                                        <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
                                                            <Thermometer className="h-3.5 w-3.5 text-amber-500" />
                                                            <span className="text-xs font-black text-slate-700">{apt.vitalsId?.temperature || '--'} °F</span>
                                                        </div>
                                                        <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
                                                            <Activity className="h-3.5 w-3.5 text-blue-500" />
                                                            <span className="text-xs font-black text-slate-700">{apt.vitalsId?.bloodPressure || '--'}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex flex-col justify-between items-end gap-4 min-w-[120px]">
                                                    <span className="text-[10px] font-black text-slate-400">
                                                        Wait: {formatDistanceToNow(new Date(apt.checkedInAt || Date.now()))}
                                                    </span>
                                                    <Button
                                                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-xl text-xs gap-2 group-hover:scale-105 transition-transform"
                                                        onClick={() => handleStartConsultation(apt._id)}
                                                    >
                                                        START SESSION <ArrowRight className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))
                        )}
                    </div>
                </div>

                {/* KPI Sidebar */}
                <div className="space-y-6">
                    <Card className="border-none shadow-xl rounded-[2.5rem] bg-slate-50">
                        <CardHeader className="p-8 pb-0">
                            <CardTitle className="text-xl font-black text-slate-900">Patient Insights</CardTitle>
                        </CardHeader>
                        <CardContent className="p-8 space-y-6">
                            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm text-center">
                                <TrendingUp className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                                <p className="text-2xl font-black text-slate-900">4.2m</p>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Avg Consultation</p>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase">
                                    <span>Daily Target</span>
                                    <span>8 / 20</span>
                                </div>
                                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                                    <div className="bg-blue-600 h-full w-[40%]"></div>
                                </div>
                            </div>

                            <div className="pt-6 border-t border-slate-200">
                                <p className="text-[10px] font-black text-slate-400 uppercase mb-4">Quick Links</p>
                                <div className="space-y-2">
                                    <Button variant="outline" className="w-full justify-start h-10 rounded-xl font-bold border-2" onClick={() => navigate('/prescriptions')}>
                                        <FileText className="mr-2 h-4 w-4" /> Rx History
                                    </Button>
                                    <Button variant="outline" className="w-full justify-start h-10 rounded-xl font-bold border-2" onClick={() => navigate('/doctor/patients')}>
                                        <Users className="mr-2 h-4 w-4" /> Patient Records
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
