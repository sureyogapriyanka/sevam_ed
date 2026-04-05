import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../../contexts/AuthContext";
import { useLanguage } from "../../contexts/LanguageContext";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { apiCall } from "../../utils/api";
import {
    Users,
    Activity,
    Calendar,
    Clock,
    CheckCircle,
    AlertCircle,
    ArrowRight,
    Bell,
    TrendingUp,
    Bed,
    AlertTriangle,
    Pill,
    Stethoscope
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Skeleton } from "../../components/ui/skeleton";
import { useToast } from "../../hooks/use-toast";
import { cn } from "../../lib/utils";
import useNotifications from "../../hooks/useNotifications";
import NotificationBell from "../../components/NotificationBell";
import VitalsModal from "../../components/nurse/VitalsModal";
import { formatDistanceToNow } from 'date-fns';

export default function NurseDashboard() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { toast } = useToast();
    const { notifications } = useNotifications();
    const [currentTime, setCurrentTime] = useState(new Date());

    // Modal State
    const [isVitalsOpen, setIsVitalsOpen] = useState(false);
    const [selectedApt, setSelectedApt] = useState<any>(null);

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    // Fetch Flow Data (Filter for 'checked_in')
    const { data: flowData = [], isLoading: loadingFlow } = useQuery<any[]>({
        queryKey: ["/api/flow/today"],
        queryFn: () => apiCall("/flow/today"),
        refetchInterval: 15000
    });

    const awaitingVitals = flowData.filter(a => a.status === 'checked_in');

    // Stats calculations
    const stats = useMemo(() => {
        const waiting = awaitingVitals.length;
        // Mock data for other stats until full API available
        return [
            {
                title: "Waiting for Vitals",
                value: waiting,
                icon: Clock,
                color: "text-blue-600",
                bg: "bg-blue-50",
                desc: "Needs triage"
            },
            {
                title: "Vitals Done Today",
                value: 14,
                icon: CheckCircle,
                color: "text-emerald-600",
                bg: "bg-emerald-50",
                desc: "Shift progress"
            },
            {
                title: "In Consultation",
                value: 2,
                icon: Stethoscope,
                color: "text-purple-600",
                bg: "bg-purple-50",
                desc: "Currently with Dr"
            },
            {
                title: "Critical Alerts",
                value: 0,
                icon: AlertTriangle,
                color: "text-rose-600",
                bg: "bg-rose-50",
                desc: "Immediate attention"
            }
        ];
    }, [awaitingVitals]);

    // WebSocket refresh trigger
    useEffect(() => {
        const lastNotif = notifications[0];
        if (lastNotif && lastNotif.type === 'patient_checkin') {
            queryClient.invalidateQueries({ queryKey: ["/api/flow/today"] });
            toast({
                title: "New Patient Check-in",
                description: `${lastNotif.patientName} (Token: ${lastNotif.tokenNumber}) is waiting for vitals.`,
            });
        }
    }, [notifications, queryClient, toast]);

    const handleRecordVitals = (apt: any) => {
        setSelectedApt(apt);
        setIsVitalsOpen(true);
    };

    return (
        <div className="space-y-8 pb-10">
            {/* WELCOME BANNER */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 p-8 text-white shadow-xl">
                <div className="relative z-10">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                            <p className="text-blue-100 font-medium mb-1 flex items-center gap-2">
                                {currentTime.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                            </p>
                            <h1 className="text-3xl md:text-4xl font-bold tracking-tight flex items-center gap-3">
                                Good Duty, Nurse {user?.name || 'Staff'}
                                <NotificationBell />
                            </h1>
                            <div className="mt-4 flex flex-wrap gap-3">
                                <Badge className="bg-white/20 hover:bg-white/30 text-white border-none py-1.5 px-4 backdrop-blur-md">
                                    <Clock className="w-3.5 h-3.5 mr-2" />
                                    Active Duty · OPD Triage
                                </Badge>
                            </div>
                        </div>
                        <div className="hidden lg:block">
                            <div className="h-24 w-24 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-md border border-white/20">
                                <Activity className="w-12 h-12 text-white/80 animate-pulse" />
                            </div>
                        </div>
                    </div>
                </div>
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>
            </div>

            {/* STATS ROW */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {loadingFlow ? (
                    Array(4).fill(0).map((_, i) => (
                        <Card key={i} className="border-none shadow-sm pb-10">
                            <CardContent className="p-6">
                                <Skeleton className="h-4 w-24 mb-4" />
                                <Skeleton className="h-8 w-16" />
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    stats.map((stat, i) => (
                        <Card key={i} className="border-none shadow-sm hover:shadow-md transition-all group overflow-hidden">
                            <CardContent className="p-6 flex items-center justify-between">
                                <div className="space-y-1">
                                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{stat.title}</p>
                                    <div className="flex items-baseline gap-2">
                                        <p className="text-3xl font-black text-slate-900 tracking-tight">{stat.value}</p>
                                        <p className="text-[10px] font-bold text-slate-400">{stat.desc}</p>
                                    </div>
                                </div>
                                <div className={`${stat.bg} ${stat.color} p-4 rounded-2xl group-hover:scale-110 transition-transform duration-300`}>
                                    <stat.icon size={28} />
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* AWAITING VITALS SECTION */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                            <Users className="w-6 h-6 text-blue-600" />
                            Patients Awaiting Vitals
                        </h2>
                        <Badge className="bg-blue-100 text-blue-700 border-none font-black">
                            {awaitingVitals.length} IN QUEUE
                        </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {loadingFlow ? (
                            Array(4).fill(0).map((_, i) => <Skeleton key={i} className="h-40 w-full rounded-2xl" />)
                        ) : awaitingVitals.length === 0 ? (
                            <div className="col-span-2 py-12 text-center bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                                <CheckCircle className="h-10 w-10 text-emerald-500 mx-auto mb-3" />
                                <p className="text-slate-500 font-black">Zero Patients Waiting</p>
                                <p className="text-slate-400 text-xs mt-1">Check-in area is currently clear.</p>
                            </div>
                        ) : (
                            awaitingVitals.map((apt) => (
                                <Card
                                    key={apt._id}
                                    className={cn(
                                        "border-none shadow-lg rounded-[2rem] overflow-hidden transition-all hover:scale-[1.02]",
                                        apt.priority === 'emergency' ? "ring-4 ring-rose-500 ring-offset-2 animate-pulse" : ""
                                    )}
                                >
                                    <CardContent className="p-6 relative">
                                        <div className="absolute top-6 right-6 text-2xl font-black text-slate-100 italic">
                                            {apt.tokenNumber}
                                        </div>
                                        <div className="flex flex-col h-full justify-between gap-4">
                                            <div>
                                                <div className="flex items-center gap-2 mb-2">
                                                    {apt.priority === 'emergency' && <Badge className="bg-rose-600 text-white border-none font-black text-[9px]">EMERGENCY</Badge>}
                                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">
                                                        Checked in {formatDistanceToNow(new Date(apt.checkedInAt || Date.now()))} ago
                                                    </span>
                                                </div>
                                                <h3 className="text-xl font-black text-slate-900">{apt.patientId?.name}</h3>
                                                <p className="text-xs font-bold text-slate-500">
                                                    Age: {apt.patientId?.age} · {apt.patientId?.gender} · Blood: {apt.patientId?.bloodGroup || 'O+'}
                                                </p>
                                            </div>

                                            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-tight mb-1">Assigned Doctor</p>
                                                <p className="text-xs font-black text-blue-900 flex items-center gap-1">
                                                    <Stethoscope className="h-3 w-3" />
                                                    Dr. {apt.doctorId?.name}
                                                </p>
                                            </div>

                                            <Button
                                                className="w-full h-11 bg-blue-600 hover:bg-blue-700 font-black rounded-xl text-xs gap-2"
                                                onClick={() => handleRecordVitals(apt)}
                                            >
                                                RECORD VITALS <Activity className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))
                        )}
                    </div>
                </div>

                {/* CLINICAL KPIs & ALERTS */}
                <div className="lg:col-span-1 space-y-6">
                    <Card className="border-2 border-slate-100 shadow-xl rounded-[2.5rem]">
                        <CardHeader className="p-8 pb-0">
                            <CardTitle className="text-xl font-black text-slate-900">Shift Dashboard</CardTitle>
                        </CardHeader>
                        <CardContent className="p-8 space-y-6">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-2xl border border-blue-100">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-blue-200/50 p-2 rounded-xl text-blue-700">
                                            <TrendingUp className="h-5 w-5" />
                                        </div>
                                        <span className="text-sm font-bold text-blue-900">Wait Optimization</span>
                                    </div>
                                    <span className="font-black text-blue-600">82%</span>
                                </div>

                                <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-emerald-200/50 p-2 rounded-xl text-emerald-700">
                                            <CheckCircle className="h-5 w-5" />
                                        </div>
                                        <span className="text-sm font-bold text-emerald-900">Efficiency Rate</span>
                                    </div>
                                    <span className="font-black text-emerald-600">High</span>
                                </div>
                            </div>

                            <div className="pt-6 border-t">
                                <p className="text-slate-400 font-black text-[10px] uppercase tracking-widest mb-4">Latest Vital Trends</p>
                                <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 text-center">
                                    <Activity className="h-10 w-10 text-slate-200 mx-auto mb-2" />
                                    <p className="text-xs text-slate-400 font-bold italic">Dynamic trend visualization pending full data flow.</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Vitals Modal */}
            {selectedApt && (
                <VitalsModal
                    isOpen={isVitalsOpen}
                    onClose={() => setIsVitalsOpen(false)}
                    appointment={selectedApt}
                />
            )}
        </div>
    );
}
