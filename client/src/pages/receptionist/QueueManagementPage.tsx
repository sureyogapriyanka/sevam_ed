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
        <div className="space-y-6">
            <div className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-3">
                    <div className="bg-emerald-600 p-2.5 rounded-xl">
                        <Users className="h-6 w-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black text-gray-900">Hospital OPD Queue</h1>
                        <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest">
                            <Calendar className="h-3 w-3" />
                            {currentTime.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                            <span className="mx-1">|</span>
                            {currentTime.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                        </div>
                    </div>
                </div>
                <Button onClick={openDisplayBoard} className="bg-gray-900 hover:bg-black text-white font-black rounded-xl">
                    <Monitor className="mr-2 h-4 w-4" /> OPEN DISPLAY BOARD
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="border-l-4 border-l-blue-500 shadow-sm">
                    <CardContent className="p-4">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total in Queue</p>
                        <h3 className="text-2xl font-black text-gray-900">{waitingQueue.length}</h3>
                    </CardContent>
                </Card>
                <Card className="border-l-4 border-l-emerald-500 shadow-sm">
                    <CardContent className="p-4">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Currently Seeing</p>
                        <h3 className="text-sm font-black text-emerald-600 truncate">{currentlySeeing?.patientName || "Chamber Empty"}</h3>
                    </CardContent>
                </Card>
                <Card className="border-l-4 border-l-amber-500 shadow-sm">
                    <CardContent className="p-4">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Avg Wait Time</p>
                        <h3 className="text-2xl font-black text-amber-600">12 mins</h3>
                    </CardContent>
                </Card>
                <Card className="border-l-4 border-l-purple-500 shadow-sm">
                    <CardContent className="p-4">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Completed Today</p>
                        <h3 className="text-2xl font-black text-purple-600">{completedToday.length}</h3>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Add to Queue Panel */}
                <Card className="lg:col-span-1 border-2 border-slate-100 shadow-md h-fit rounded-2xl">
                    <CardHeader className="bg-slate-50 border-b p-4">
                        <CardTitle className="text-lg font-black flex items-center gap-2">
                            <UserPlus className="h-5 w-5 text-blue-600" />
                            Token Issuance
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 space-y-4">
                        <div className="space-y-2">
                            <Label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Select Patient</Label>
                            <Select onValueChange={setSelectedPatientId} value={selectedPatientId}>
                                <SelectTrigger className="h-12 border-2 bg-white">
                                    <SelectValue placeholder="Search patient..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {patients.map((p: any) => (
                                        <SelectItem key={p._id} value={p._id}>
                                            {p.name || p.username}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Assigned Doctor</Label>
                            <Select onValueChange={setSelectedDoctorId} value={selectedDoctorId}>
                                <SelectTrigger className="h-12 border-2 bg-white">
                                    <SelectValue placeholder="Choose doctor..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {doctors.map((d: any) => (
                                        <SelectItem key={d.id} value={d.id}>Dr. {d.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Clinical Priority</Label>
                            <div className="grid grid-cols-3 gap-2">
                                {(['normal', 'urgent', 'emergency'] as const).map(p => (
                                    <button
                                        key={p}
                                        onClick={() => setPriority(p)}
                                        className={`py-2 px-1 rounded-lg text-[10px] font-black uppercase tracking-widest border-2 transition-all ${priority === p
                                            ? (p === 'emergency' ? 'bg-red-600 border-red-600 text-white' : p === 'urgent' ? 'bg-amber-500 border-amber-500 text-white' : 'bg-slate-900 border-slate-900 text-white')
                                            : (p === 'emergency' ? 'border-red-100 text-red-500 hover:bg-red-50' : p === 'urgent' ? 'border-amber-100 text-amber-600 hover:bg-amber-50' : 'border-slate-100 text-slate-500 hover:bg-slate-50')
                                            }`}
                                    >
                                        {p === 'emergency' && '🚨 '} {p}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <Button
                            className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-xl shadow-lg shadow-blue-100 mt-4"
                            disabled={!selectedPatientId || !selectedDoctorId || addToQueueMutation.isPending}
                            onClick={() => addToQueueMutation.mutate()}
                        >
                            {addToQueueMutation.isPending ? "GENERATING TOKEN..." : "ISSUE TOKEN & ADD TO QUEUE"}
                        </Button>
                    </CardContent>
                </Card>

                {/* Main Queue Column */}
                <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Waiting Counter */}
                    <Card className="border-t-4 border-t-amber-500 shadow-md rounded-2xl">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-lg font-black flex items-center gap-2">
                                <Clock className="h-5 w-5 text-amber-500" />
                                Waiting Queue
                            </CardTitle>
                            <Badge className="bg-amber-100 text-amber-700 font-bold">{waitingQueue.length}</Badge>
                        </CardHeader>
                        <CardContent className="p-4 space-y-3">
                            {waitingQueue.map((item: any, idx: number) => (
                                <div
                                    key={item.id}
                                    className={`p-4 rounded-2xl border-2 transition-all relative overflow-hidden group ${item.priority === 'emergency'
                                        ? 'border-red-400 bg-red-50 animate-pulse'
                                        : item.priority === 'urgent'
                                            ? 'border-amber-400 bg-amber-50'
                                            : 'border-slate-100 bg-white hover:border-blue-200'
                                        }`}
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex items-center gap-3">
                                            <span className={`text-2xl font-black ${item.priority === 'emergency' ? 'text-red-700' : 'text-slate-900'}`}>
                                                {item.tokenNumber || `T-${String(idx + 1).padStart(3, '0')}`}
                                            </span>
                                            <div>
                                                <p className="font-black text-sm text-gray-900">{item.patientName}</p>
                                                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">DR. {item.doctorName || "General"}</p>
                                            </div>
                                        </div>
                                        <Badge className={`text-[9px] font-black uppercase ${item.priority === 'emergency' ? 'bg-red-600' : item.priority === 'urgent' ? 'bg-amber-500' : 'bg-slate-400'
                                            }`}>
                                            {item.priority}
                                        </Badge>
                                    </div>
                                    <div className="flex justify-between items-center mt-4">
                                        <p className="text-[10px] font-bold text-gray-400">WAITING: 15 MINS</p>
                                        <Button
                                            size="sm"
                                            className="bg-emerald-600 hover:bg-emerald-700 h-8 font-black text-[10px] uppercase shadow-md"
                                            onClick={() => callNextMutation.mutate(item.id)}
                                        >
                                            <Play className="mr-1 h-3 w-3 fill-current" /> Call Next
                                        </Button>
                                    </div>
                                    {item.priority === 'emergency' && (
                                        <div className="absolute top-0 right-0 p-1">
                                            <AlertCircle className="h-4 w-4 text-red-600" />
                                        </div>
                                    )}
                                </div>
                            ))}
                            {waitingQueue.length === 0 && (
                                <div className="text-center py-12 text-gray-300 font-bold italic">No patients waiting.</div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Completed Column */}
                    <Card className="border-t-4 border-t-emerald-600 shadow-md rounded-2xl h-fit">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-lg font-black flex items-center gap-2">
                                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                                Processed
                            </CardTitle>
                            <Badge className="bg-emerald-100 text-emerald-700 font-bold">{completedToday.length}</Badge>
                        </CardHeader>
                        <CardContent className="p-4 space-y-2">
                            {completedToday.map((item: any) => (
                                <div key={item.id} className="flex items-center justify-between p-3 bg-slate-50/50 rounded-xl border border-slate-100">
                                    <div className="flex items-center gap-3">
                                        <span className="bg-slate-200 text-slate-600 font-black px-2 py-0.5 rounded text-[10px]">{item.tokenNumber}</span>
                                        <div>
                                            <p className="text-xs font-bold text-gray-800 leading-none mb-1">{item.patientName}</p>
                                            <p className="text-[9px] text-gray-400 font-medium">DR. {item.doctorName}</p>
                                        </div>
                                    </div>
                                    <p className="text-[9px] text-emerald-600 font-black">10M TAKEN</p>
                                </div>
                            ))}
                            {completedToday.length === 0 && (
                                <div className="text-center py-8 text-gray-300 font-medium italic text-xs">Queue record empty.</div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
