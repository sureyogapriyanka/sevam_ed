import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "../../lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Badge } from "../../components/ui/badge";
import { toast } from "../../hooks/use-toast";
import {
    Users,
    UserPlus,
    Clock,
    CheckCircle2,
    Play,
    Monitor,
    Calendar,
    Search,
    AlertCircle,
    ArrowRight
} from "lucide-react";

export default function QueueManagementPage() {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [selectedPatientId, setSelectedPatientId] = useState("");
    const [selectedDoctorId, setSelectedDoctorId] = useState("");
    const [priority, setPriority] = useState("normal");

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    // WebSocket Integration
    useEffect(() => {
        const wsUrl = import.meta.env.VITE_WS_URL || "ws://localhost:5000";
        const ws = new WebSocket(wsUrl);

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.type === 'queue_update') {
                queryClient.invalidateQueries({ queryKey: ["/api/queue"] });
                queryClient.invalidateQueries({ queryKey: ["/api/queue/stats"] });
            }
        };

        return () => ws.close();
    }, []);

    // Data Fetching
    const { data: queue = [] } = useQuery<any[]>({
        queryKey: ["/api/queue"]
    });

    const { data: doctors = [] } = useQuery<any[]>({
        queryKey: ["/api/users/role/doctor"]
    });

    const { data: patients = [] } = useQuery<any[]>({
        queryKey: ["/api/users/role/patient"],
    });

    const waitingQueue = queue.filter(q => q.status === "waiting");
    const completedToday = queue.filter(q => q.status === "completed" && new Date(q.updatedAt).toDateString() === new Date().toDateString());
    const currentlySeeing = queue.find(q => q.status === "in-progress");

    // Mutations
    const addToQueueMutation = useMutation({
        mutationFn: async () => {
            return apiRequest("POST", "/api/queue", {
                patientId: selectedPatientId,
                doctorId: selectedDoctorId,
                priority
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/queue"] });
            toast({ title: "Added to Queue", description: "Patient has been assigned a token." });
            setSelectedPatientId("");
        }
    });

    const callNextMutation = useMutation({
        mutationFn: async (id: string) => {
            return apiRequest("PATCH", `/api/queue/${id}`, { status: "in-progress" });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/queue"] });
            toast({ title: "Patient Called", description: "Move patient to doctor's chamber." });
        }
    });

    const completePatientMutation = useMutation({
        mutationFn: async (id: string) => {
            return apiRequest("PATCH", `/api/queue/${id}`, { status: "completed" });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/queue"] });
            toast({ title: "Patient Completed", description: "Queue record updated." });
        }
    });

    const openDisplayBoard = () => {
        window.open('/queue-display', '_blank');
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2">
                <div className="flex items-center gap-4">
                    <div className="bg-blue-600 p-3 rounded-2xl shadow-lg shadow-blue-200">
                        <Users className="h-6 w-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Hospital OPD Queue</h1>
                        <div className="flex items-center gap-2 mt-1">
                            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                            <p className="text-slate-500 font-bold text-xs uppercase tracking-widest">
                                {currentTime.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} • {currentTime.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                            </p>
                        </div>
                    </div>
                </div>
                <Button 
                    onClick={openDisplayBoard} 
                    className="bg-slate-900 hover:bg-slate-800 text-white font-black rounded-2xl h-12 px-6 shadow-xl shadow-slate-200 gap-2 transition-all hover:scale-[1.02]"
                >
                    <Monitor className="h-4 w-4" /> OPEN PUBLIC DISPLAY
                </Button>
            </div>

            {/* Premium Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white border border-slate-100 p-6 rounded-[2rem] shadow-sm">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Total in Queue</p>
                    <div className="flex items-baseline gap-2">
                        <h3 className="text-3xl font-black text-slate-900 tracking-tighter">{waitingQueue.length}</h3>
                        <Badge className="bg-blue-50 text-blue-600 border-none font-black text-[9px] px-2 py-0">PATIENTS</Badge>
                    </div>
                </div>

                <div className="bg-white border border-slate-100 p-6 rounded-[2rem] shadow-sm">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Currently Seeing</p>
                    <h3 className="text-lg font-black text-emerald-600 truncate">
                        {currentlySeeing?.patientName || "Chamber Empty"}
                    </h3>
                </div>

                <div className="bg-white border border-slate-100 p-6 rounded-[2rem] shadow-sm">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Avg Wait Time</p>
                    <h3 className="text-3xl font-black text-amber-600 tracking-tighter italic">12 <span className="text-xs">mins</span></h3>
                </div>

                <div className="bg-blue-600 p-6 rounded-[2rem] shadow-xl shadow-blue-100">
                    <p className="text-[10px] font-black text-blue-100 uppercase tracking-[0.2em] mb-1">Completed Today</p>
                    <div className="flex items-baseline gap-2">
                        <h3 className="text-3xl font-black text-white tracking-tighter">{completedToday.length}</h3>
                        <CheckCircle2 className="h-4 w-4 text-blue-200" />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Token Issuance Panel */}
                <Card className="lg:col-span-1 border-2 border-slate-50 shadow-xl rounded-[2.5rem] overflow-hidden bg-white">
                    <div className="bg-slate-50/50 p-6 border-b border-slate-100">
                        <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                            <UserPlus className="h-5 w-5 text-blue-600" />
                            Token Issuance
                        </h2>
                    </div>
                    <CardContent className="p-8 space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Select Patient</label>
                            <Select onValueChange={setSelectedPatientId} value={selectedPatientId}>
                                <SelectTrigger className="h-12 border-2 bg-slate-50 rounded-2xl font-bold">
                                    <SelectValue placeholder="Search patient..." />
                                </SelectTrigger>
                                <SelectContent className="rounded-2xl">
                                    {patients.map((p: any) => (
                                        <SelectItem key={p._id} value={p._id} className="font-medium">
                                            {p.name || p.username}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Assigned Doctor</label>
                            <Select onValueChange={setSelectedDoctorId} value={selectedDoctorId}>
                                <SelectTrigger className="h-12 border-2 bg-slate-50 rounded-2xl font-bold">
                                    <SelectValue placeholder="Choose doctor..." />
                                </SelectTrigger>
                                <SelectContent className="rounded-2xl">
                                    {doctors.map((d: any) => (
                                        <SelectItem key={d.id} value={d.id} className="font-medium italic">Dr. {d.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Clinical Priority</label>
                            <div className="grid grid-cols-3 gap-2">
                                {(['normal', 'urgent', 'emergency'] as const).map(p => (
                                    <button
                                        key={p}
                                        onClick={() => setPriority(p)}
                                        className={`py-3 px-1 rounded-2xl text-[9px] font-black uppercase tracking-tighter border-2 transition-all ${priority === p
                                            ? (p === 'emergency' ? 'bg-rose-600 border-rose-600 text-white shadow-lg shadow-rose-100 scale-105' : p === 'urgent' ? 'bg-amber-500 border-amber-500 text-white shadow-lg shadow-amber-100 scale-105' : 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-100 scale-105')
                                            : 'bg-white border-slate-100 text-slate-400 hover:border-slate-300'
                                            }`}
                                    >
                                        {p}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <Button
                            className="w-full h-14 bg-slate-900 hover:bg-slate-800 text-white font-black rounded-2xl shadow-xl shadow-slate-200 mt-4 transition-all hover:scale-[1.02]"
                            disabled={!selectedPatientId || !selectedDoctorId || addToQueueMutation.isPending}
                            onClick={() => addToQueueMutation.mutate()}
                        >
                            {addToQueueMutation.isPending ? "GENERATING..." : "ISSUE CLINICAL TOKEN"}
                        </Button>
                    </CardContent>
                </Card>

                {/* Queue Lists Column */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Active Waiting List */}
                    <Card className="border-none shadow-xl rounded-[2.5rem] bg-white overflow-hidden">
                        <div className="bg-amber-500/5 p-6 border-b border-amber-100 flex items-center justify-between">
                            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                                <Clock className="h-5 w-5 text-amber-500" />
                                Active Waiting Queue
                            </h2>
                            <Badge className="bg-amber-500 text-white font-black px-3 py-1 rounded-xl text-[10px]">{waitingQueue.length}</Badge>
                        </div>
                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {waitingQueue.map((item: any, idx: number) => (
                                    <div
                                        key={item.id}
                                        className={`p-6 rounded-[2rem] border-2 transition-all relative group h-full flex flex-col justify-between ${item.priority === 'emergency'
                                            ? 'border-rose-200 bg-rose-50/50'
                                            : item.priority === 'urgent'
                                                ? 'border-amber-200 bg-amber-50/50'
                                                : 'border-slate-50 bg-slate-50/30 hover:border-blue-100'
                                            }`}
                                    >
                                        <div>
                                            <div className="flex justify-between items-start">
                                                <span className={`text-3xl font-black italic tracking-tighter ${item.priority === 'emergency' ? 'text-rose-600' : 'text-slate-900'}`}>
                                                    {item.tokenNumber || `T-${String(idx + 1).padStart(3, '0')}`}
                                                </span>
                                                <Badge className={`text-[8px] font-black uppercase tracking-widest ${
                                                    item.priority === 'emergency' ? 'bg-rose-600' : 
                                                    item.priority === 'urgent' ? 'bg-amber-500' : 'bg-blue-600'
                                                }`}>
                                                    {item.priority}
                                                </Badge>
                                            </div>
                                            <div className="mt-4">
                                                <p className="font-black text-base text-slate-800 leading-tight">{item.patientName}</p>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">DR. {item.doctorName || "General"}</p>
                                            </div>
                                        </div>
                                        
                                        <div className="mt-6 flex items-center justify-between pt-4 border-t border-slate-100/50">
                                            <div className="flex items-center gap-1.5">
                                                <div className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                                                <p className="text-[9px] font-black text-slate-400 uppercase">Wait: 15m</p>
                                            </div>
                                            <Button
                                                size="sm"
                                                className="bg-emerald-500 hover:bg-emerald-600 text-white h-9 rounded-xl font-black text-[9px] uppercase px-4 shadow-lg shadow-emerald-50 transition-all hover:scale-105"
                                                onClick={() => callNextMutation.mutate(item.id)}
                                            >
                                                CALL NEXT
                                            </Button>
                                        </div>
                                        {item.priority === 'emergency' && (
                                            <div className="absolute top-2 right-2 animate-bounce">
                                                <AlertCircle className="h-4 w-4 text-rose-600 fill-rose-50" />
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                            {waitingQueue.length === 0 && (
                                <div className="text-center py-20">
                                    <div className="bg-slate-50 w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-4 border border-slate-100">
                                        <Clock className="h-8 w-8 text-slate-200" />
                                    </div>
                                    <p className="text-slate-400 font-bold italic text-sm tracking-tight">Zero patients in active queue</p>
                                </div>
                            )}
                        </div>
                    </Card>

                    {/* Processed Counter */}
                    <Card className="border-none shadow-xl rounded-[2.5rem] bg-white overflow-hidden h-fit">
                        <div className="bg-emerald-500/5 p-6 border-b border-emerald-100 flex items-center justify-between">
                            <h2 className="text-lg font-black text-slate-700 flex items-center gap-2">
                                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                                Processed List
                            </h2>
                            <Badge className="bg-emerald-500 text-white font-black px-2 py-0.5 rounded-lg text-[9px]">{completedToday.length}</Badge>
                        </div>
                        <div className="p-6 max-h-[300px] overflow-y-auto">
                            <div className="space-y-3">
                                {completedToday.map((item: any) => (
                                    <div key={item.id} className="group flex items-center justify-between p-4 bg-slate-50/50 rounded-2xl border border-slate-100 transition-all hover:border-emerald-100 hover:bg-emerald-50/10">
                                        <div className="flex items-center gap-4">
                                            <span className="bg-white text-slate-600 font-black px-3 py-1 rounded-xl text-[10px] border border-slate-100 group-hover:border-emerald-200 group-hover:text-emerald-700 transition-colors">
                                                {item.tokenNumber}
                                            </span>
                                            <div>
                                                <p className="text-sm font-black text-slate-800 leading-tight">{item.patientName}</p>
                                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">DR. {item.doctorName}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[9px] text-emerald-600 font-black bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-100">DISPENSED</p>
                                        </div>
                                    </div>
                                ))}
                                {completedToday.length === 0 && (
                                    <p className="text-center py-6 text-slate-300 font-bold italic text-[10px]">No finalized records today</p>
                                )}
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
