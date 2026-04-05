import { useState, useMemo } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { apiRequest } from "../../lib/queryClient";
import { cn } from "../../lib/utils";
import { Card, CardContent } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { toast } from "../../hooks/use-toast";
import {
    Users,
    AlertTriangle,
    Clock,
    RefreshCw,
    CheckCircle,
    XCircle,
    User,
    Stethoscope,
    Heart,
    Activity,
    Hash
} from "lucide-react";

export default function DoctorQueuePage() {
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const [filterPriority, setFilterPriority] = useState("all");

    // Fetch live queue data from /flow/today
    // The backend automatically filters by doctorId and status (vitals_done | consulting) for doctor role
    const { data: appointments = [], isLoading, isError } = useQuery<any[]>({
        queryKey: ["/api/flow/today"],
        queryFn: async () => {
            const token = localStorage.getItem("token") || "";
            const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
            const res = await fetch(`${API_URL}/flow/today`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (!res.ok) throw new Error("Failed to fetch queue");
            const data = await res.json();
            return Array.isArray(data) ? data : [];
        },
        refetchInterval: 20000,
        staleTime: 10000
    });
    
    // Mock data for demonstration if no real patients
    const readyAppointments = useMemo(() => {
        if (appointments.length > 0) return appointments;
        
        // Return 10 mock patients for Dr. Priyanka
        return Array(10).fill(null).map((_, i) => ({
            _id: `mock-${i}`,
            tokenNumber: 101 + i,
            patientId: {
                _id: `p-${i}`,
                name: ["Amit Sharma", "Priya Patel", "Vikram Singh", "Anjali Gupta", "Rajesh Kumar", "Sunita Verma", "Arjun Reddy", "Meera Nair", "Suresh Iyer", "Deepa Rani"][i],
                userId: {
                    age: 24 + (i * 3),
                    gender: i % 2 === 0 ? "Male" : "Female",
                    bloodGroup: ["A+", "B+", "O+", "AB+", "A-", "B-", "O-", "A+", "B+", "O+"][i]
                }
            },
            vitalsId: {
                heartRate: 72 + (i % 5),
                temperature: 98.4 + (i * 0.1),
                bloodPressure: "120/80"
            },
            chiefComplaint: ["Fever & Cold", "Joint Pain", "Routine Checkup", "High BP", "Headache", "Stomach Ache", "Viral Infection", "Allergy", "Asthma Follow-up", "Diabetes Review"][i],
            medicalHistory: i % 3 === 0 ? ["Hypertension"] : ["None"],
            priority: i % 4 === 0 ? "urgent" : "normal",
            checkedInAt: new Date(Date.now() - (i * 12 * 60000)).toISOString(),
            status: 'vitals_done'
        }));
    }, [appointments]);

    // Map appointment documents to display shape
    const queue = readyAppointments.map((apt: any, index: number) => {
        const patientName = apt.patientId?.userId?.name || apt.patientId?.name || "Unknown Patient";
        const patientAge = apt.patientId?.userId?.age || apt.patientId?.age || "—";
        const patientGender = apt.patientId?.userId?.gender || apt.patientId?.gender || "—";
        const patientBlood = apt.patientId?.userId?.bloodGroup || apt.patientId?.bloodType || "—";

        return {
            id: apt._id,
            position: index + 1,
            name: patientName,
            age: patientAge,
            gender: patientGender,
            bloodType: patientBlood,
            symptoms: apt.chiefComplaint || apt.reason || "General Consultation",
            medicalHistory: Array.isArray(apt.medicalHistory)
                ? apt.medicalHistory.join(", ")
                : (apt.medicalHistory || "None recorded"),
            priority: apt.priority || "normal",
            status: apt.status,
            estimatedWaitTime: Math.max(5, (index + 1) * 10),
            lastVisit: apt.scheduledAt,
            tokenNumber: apt.tokenNumber || `T-${String(index + 1).padStart(3, "0")}`
        };
    });

    // Filter queue based on priority
    const filteredQueue = queue.filter((entry: any) =>
        filterPriority === "all" || entry.priority === filterPriority
    );

    const navigate = useNavigate();

    // Mutation for starting consultation (calling a patient)
    const callNextMutation = useMutation({
        mutationFn: async (appointmentId: string) => {
            // Mock handling for demonstration
            if (appointmentId.startsWith('mock-')) {
                return new Promise((resolve) => setTimeout(() => resolve({ success: true, id: appointmentId }), 500));
            }

            const token = localStorage.getItem("token") || "";
            const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
            const res = await fetch(`${API_URL}/flow/start-consultation/${appointmentId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });
            if (!res.ok) throw new Error("Failed to start consultation");
            return res.json();
        },
        onSuccess: (data: any, variables: string) => {
            toast({ title: "Patient called", description: "Consultation started", className: "bg-green-50 border-green-200 text-green-800" });
            queryClient.invalidateQueries({ queryKey: ["/api/flow/today"] });
            // Navigate to the consultation page for the called patient
            navigate(`/doctor/consultation/${variables}`);
        },
        onError: () => {
            toast({ title: "Error", description: "Failed to call patient", variant: "destructive" });
        }
    });

    // Mutation for ending consultation / removing from queue
    const endConsultationMutation = useMutation({
        mutationFn: async (appointmentId: string) => {
            const token = localStorage.getItem("token") || "";
            const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
            const res = await fetch(`${API_URL}/flow/end-consultation/${appointmentId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({})
            });
            if (!res.ok) throw new Error("Failed to end consultation");
            return res.json();
        },
        onSuccess: () => {
            toast({ title: "Done", description: "Consultation completed", className: "bg-green-50 border-green-200 text-green-800" });
            queryClient.invalidateQueries({ queryKey: ["/api/flow/today"] });
        },
        onError: () => {
            toast({ title: "Error", description: "Failed to end consultation", variant: "destructive" });
        }
    });

    const handleRefresh = () => {
        queryClient.invalidateQueries({ queryKey: ["/api/flow/today"] });
        toast({ title: "Refreshed", description: "Queue updated", className: "bg-blue-50 border-blue-200 text-blue-800" });
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                <Activity className="h-12 w-12 text-red-500 mb-4 mx-auto" />
                <h3 className="text-lg font-medium text-red-800 mb-2">Error Loading Queue</h3>
                <p className="text-red-600 mb-4">Could not connect to the server. Please try again.</p>
                <Button onClick={handleRefresh} className="bg-red-600 hover:bg-red-700 text-white">
                    <RefreshCw className="h-4 w-4 mr-2" /> Try Again
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-10 pb-10">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div>
                    <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Waiting <span className="text-blue-600">Room</span></h1>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Live Clinical Flow & Queue Management</p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    <Button
                        onClick={() => filteredQueue[0] && callNextMutation.mutate(filteredQueue[0].id)}
                        disabled={callNextMutation.isPending || filteredQueue.length === 0}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-black rounded-xl text-[10px] px-6 py-5 shadow-lg shadow-blue-500/20 uppercase tracking-widest transition-all"
                    >
                        <Users className="h-4 w-4 mr-2" />
                        {callNextMutation.isPending ? "Calling..." : "Call Next Patient"}
                    </Button>
                    <Button onClick={handleRefresh} variant="ghost" className="text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl text-[10px] font-black uppercase tracking-widest">
                        <RefreshCw className="h-4 w-4 mr-2" /> Refresh
                    </Button>
                </div>
            </div>

            {/* Minimal Stats Row — Integrated directly into the background */}
            <div className="bg-white/40 backdrop-blur-sm border border-slate-200/60 rounded-[2.5rem] p-8 shadow-sm">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                    {[
                        { title: "Total in Queue", value: filteredQueue.length, icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
                        { title: "Urgent Cases", value: filteredQueue.filter((q: any) => q.priority === "urgent").length, icon: AlertTriangle, color: "text-amber-600", bg: "bg-amber-50" },
                        { title: "Critical Cases", value: filteredQueue.filter((q: any) => q.priority === "critical").length, icon: Heart, color: "text-rose-600", bg: "bg-rose-50" },
                        {
                            title: "Avg. Wait Time",
                            value: filteredQueue.length > 0
                                ? Math.round(filteredQueue.reduce((sum: number, q: any) => sum + (q.estimatedWaitTime || 0), 0) / filteredQueue.length)
                                : 0,
                            icon: Clock, color: "text-emerald-600", bg: "bg-emerald-50", unit: "min"
                        }
                    ].map((stat, i) => (
                        <div key={i} className={cn(
                            "flex items-center gap-6",
                            i !== 0 && "lg:border-l lg:border-slate-100 lg:pl-8"
                        )}>
                            <div className={`${stat.bg} ${stat.color} p-4 rounded-2xl`}>
                                <stat.icon size={22} />
                            </div>
                            <div className="space-y-0.5">
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{stat.title}</p>
                                <div className="flex items-baseline gap-1.5">
                                    <h3 className="text-2xl font-black text-slate-900 leading-none">{stat.value}</h3>
                                    {(stat as any).unit && <span className="text-[9px] font-black text-slate-400 uppercase">{(stat as any).unit}</span>}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Minimal Filter Section */}
            <div className="flex items-center gap-4 pl-4">
                <div className="flex items-center gap-3 bg-white/50 border border-slate-200 p-1.5 rounded-2xl shadow-sm">
                    <select
                        className="bg-transparent text-[10px] font-black uppercase tracking-widest text-slate-600 px-4 py-2 outline-none cursor-pointer"
                        value={filterPriority}
                        onChange={(e) => setFilterPriority(e.target.value)}
                    >
                        <option value="all">All Priorities</option>
                        <option value="normal">Normal</option>
                        <option value="urgent">Urgent</option>
                        <option value="critical">Critical</option>
                    </select>
                    {filterPriority !== "all" && (
                        <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-slate-100 rounded-lg text-slate-400" onClick={() => setFilterPriority("all")}>
                            <XCircle size={14} />
                        </Button>
                    )}
                </div>
                <div className="h-4 w-px bg-slate-200"></div>
                <span className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em]">{filteredQueue.length} Matches Found</span>
            </div>

            {/* INTEGRATED QUEUE LIST */}
            <div className="space-y-4">
                {filteredQueue.length === 0 ? (
                    <div className="bg-white/50 border border-slate-200/60 rounded-[2.5rem] py-32 text-center shadow-sm">
                        <Users className="h-10 w-10 mx-auto text-slate-200 mb-4" />
                        <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em]">Queue is Empty</h3>
                        <p className="text-[10px] text-slate-300 font-bold uppercase tracking-widest mt-2">No patients are ready for consultation at this moment.</p>
                        <Button onClick={handleRefresh} variant="ghost" className="mt-8 text-blue-600 hover:bg-blue-50 font-black text-[10px] uppercase tracking-widest">
                            <RefreshCw className="h-3 w-3 mr-2" /> Refresh Queue
                        </Button>
                    </div>
                ) : (
                    <div className="divide-y divide-slate-100 bg-white/50 rounded-[2.5rem] border border-slate-200/60 overflow-hidden shadow-sm">
                        {filteredQueue.map((entry: any) => (
                            <div key={entry.id} className="group hover:bg-blue-50/40 transition-all p-8 flex flex-col md:flex-row items-center gap-8">
                                <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col items-center justify-center shrink-0">
                                    <span className="text-[7px] font-bold text-slate-300 uppercase tracking-tighter">POS</span>
                                    <span className="text-xl font-black text-slate-400 leading-none">{entry.position}</span>
                                </div>
                                
                                <div className="flex-1 min-w-0 w-full">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-3">
                                            <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">{entry.name}</h3>
                                            <div className={cn(
                                                "px-2 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-widest border",
                                                entry.priority === "critical" ? "bg-rose-50 text-rose-500 border-rose-100" :
                                                entry.priority === "urgent" ? "bg-amber-50 text-amber-600 border-amber-100" :
                                                "bg-emerald-50 text-emerald-500 border-emerald-100"
                                            )}>
                                                {entry.priority}
                                            </div>
                                        </div>
                                        <div className="text-[10px] font-black text-blue-600 italic tracking-tighter bg-blue-50 px-3 py-1 rounded-lg border border-blue-100">
                                            TOKEN: {entry.tokenNumber}
                                        </div>
                                    </div>
                                    
                                    <div className="flex flex-wrap items-center gap-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                                        <div className="flex items-center gap-2">
                                            <User size={14} className="text-slate-300" />
                                            <span>{entry.age}y / {entry.gender}</span>
                                        </div>
                                        <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                                        <div className="flex items-center gap-2">
                                            <Heart size={14} className="text-slate-300" />
                                            <span>{entry.bloodType}</span>
                                        </div>
                                        <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                                        <div className="flex items-center gap-2 text-slate-600">
                                            <Activity size={14} className="text-blue-400" />
                                            <span>{entry.symptoms}</span>
                                        </div>
                                    </div>

                                    {entry.medicalHistory && entry.medicalHistory !== "None recorded" && (
                                        <div className="mt-3 text-[9px] font-medium text-slate-400 flex items-center gap-2 italic">
                                            <span className="font-black text-slate-300 not-italic uppercase tracking-widest">History:</span>
                                            {entry.medicalHistory}
                                        </div>
                                    )}
                                </div>

                                <div className="flex flex-row md:flex-col lg:flex-row items-center gap-4 w-full md:w-auto md:border-l md:border-slate-100 md:pl-8">
                                    <div className="text-left md:text-right hidden sm:block min-w-[70px]">
                                        <p className="text-[8px] font-black text-slate-300 uppercase tracking-[0.2em]">Est. Wait</p>
                                        <span className="text-[10px] font-black text-slate-600 uppercase">~{entry.estimatedWaitTime} min</span>
                                    </div>
                                    <div className="flex gap-2 grow md:grow-0">
                                        <Button
                                            onClick={() => callNextMutation.mutate(entry.id)}
                                            disabled={callNextMutation.isPending}
                                            className="grow md:grow-0 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-xl text-[9px] px-6 py-5 shadow-lg shadow-blue-500/20 uppercase tracking-widest transition-all"
                                        >
                                            {entry.status === "consulting" ? "IN PROGRESS" : "CALL NEXT"}
                                        </Button>
                                        <Button
                                            onClick={() => endConsultationMutation.mutate(entry.id)}
                                            disabled={endConsultationMutation.isPending}
                                            variant="ghost"
                                            className="text-[9px] font-black uppercase text-rose-400 hover:text-rose-600 hover:bg-rose-50 px-4 rounded-xl"
                                        >
                                            DONE
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
