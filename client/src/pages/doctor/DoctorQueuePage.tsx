import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { apiRequest } from "../../lib/queryClient";
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

    // Map appointment documents to display shape
    const queue = appointments.map((apt: any, index: number) => {
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

    // Mutation for starting consultation (calling a patient)
    const callNextMutation = useMutation({
        mutationFn: async (appointmentId: string) => {
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
        onSuccess: () => {
            toast({ title: "Patient called", description: "Consultation started", className: "bg-green-50 border-green-200 text-green-800" });
            queryClient.invalidateQueries({ queryKey: ["/api/flow/today"] });
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
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-blue-900">Patient Queue Management</h2>
                    <p className="text-gray-600">Manage and monitor your patient queue</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                    <Button
                        onClick={() => filteredQueue[0] && callNextMutation.mutate(filteredQueue[0].id)}
                        disabled={callNextMutation.isPending || filteredQueue.length === 0}
                        className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center"
                    >
                        <Users className="h-4 w-4 mr-2" />
                        {callNextMutation.isPending ? "Calling..." : "Call Next Patient"}
                    </Button>
                    <Button onClick={handleRefresh} variant="outline" className="border-blue-300 text-blue-700 hover:bg-blue-100 hover:shadow-md transition-all duration-200 flex items-center">
                        <RefreshCw className="h-4 w-4 mr-2" /> Refresh
                    </Button>
                </div>
            </div>

            {/* Queue Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="border-2 border-blue-200 bg-gradient-to-br from-white to-blue-50 shadow-md">
                    <CardContent className="p-4">
                        <div className="flex items-center">
                            <Users className="h-8 w-8 text-blue-600" />
                            <div className="ml-3">
                                <p className="text-sm text-gray-600">Total in Queue</p>
                                <p className="text-2xl font-bold text-blue-900">{filteredQueue.length}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-2 border-amber-200 bg-gradient-to-br from-white to-amber-50 shadow-md">
                    <CardContent className="p-4">
                        <div className="flex items-center">
                            <AlertTriangle className="h-8 w-8 text-amber-600" />
                            <div className="ml-3">
                                <p className="text-sm text-gray-600">Urgent Cases</p>
                                <p className="text-2xl font-bold text-amber-900">
                                    {filteredQueue.filter((q: any) => q.priority === "urgent").length}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-2 border-red-200 bg-gradient-to-br from-white to-red-50 shadow-md">
                    <CardContent className="p-4">
                        <div className="flex items-center">
                            <Heart className="h-8 w-8 text-red-600" />
                            <div className="ml-3">
                                <p className="text-sm text-gray-600">Critical Cases</p>
                                <p className="text-2xl font-bold text-red-900">
                                    {filteredQueue.filter((q: any) => q.priority === "critical").length}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-2 border-green-200 bg-gradient-to-br from-white to-green-50 shadow-md">
                    <CardContent className="p-4">
                        <div className="flex items-center">
                            <Clock className="h-8 w-8 text-green-600" />
                            <div className="ml-3">
                                <p className="text-sm text-gray-600">Avg. Wait Time</p>
                                <p className="text-2xl font-bold text-green-900">
                                    {filteredQueue.length > 0
                                        ? Math.round(filteredQueue.reduce((sum: number, q: any) => sum + (q.estimatedWaitTime || 0), 0) / filteredQueue.length)
                                        : 0} min
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filter Section */}
            <Card className="border-2 border-blue-200 bg-gradient-to-br from-white to-blue-50 shadow-md">
                <CardContent className="p-4">
                    <div className="flex gap-4">
                        <select
                            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            value={filterPriority}
                            onChange={(e) => setFilterPriority(e.target.value)}
                        >
                            <option value="all">All Priorities</option>
                            <option value="normal">Normal</option>
                            <option value="urgent">Urgent</option>
                            <option value="critical">Critical</option>
                        </select>
                        <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-100" onClick={() => setFilterPriority("all")}>
                            <RefreshCw className="h-4 w-4 mr-2" /> Clear
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Queue List */}
            {filteredQueue.length === 0 ? (
                <Card className="border-2 border-blue-200 bg-gradient-to-br from-white to-blue-50 shadow-md">
                    <CardContent className="py-12 text-center">
                        <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Queue is Empty</h3>
                        <p className="text-gray-600 mb-4">No patients are ready for consultation yet. Patients appear here after the nurse records their vitals.</p>
                        <Button onClick={handleRefresh} className="bg-blue-600 hover:bg-blue-700 text-white">
                            <RefreshCw className="h-4 w-4 mr-2" /> Refresh Queue
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-4">
                    {filteredQueue.map((entry: any) => (
                        <Card key={entry.id} className="border-2 border-blue-200 bg-white shadow-md hover:shadow-xl transition-all duration-300">
                            <div className="hidden md:block p-6">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mr-4 font-bold text-blue-800">
                                        {entry.position}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h3 className="text-lg font-bold text-gray-900 truncate">{entry.name}</h3>
                                                <p className="text-sm text-gray-600">{entry.symptoms}</p>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <Badge className="text-xs font-mono bg-slate-100 text-slate-600 border border-slate-200">
                                                    <Hash className="h-3 w-3 mr-1" />{entry.tokenNumber}
                                                </Badge>
                                                <Badge
                                                    variant="outline"
                                                    className={`${entry.priority === "critical"
                                                        ? "bg-red-100 text-red-800 border-red-300"
                                                        : entry.priority === "urgent"
                                                            ? "bg-amber-100 text-amber-800 border-amber-300"
                                                            : "bg-green-100 text-green-800 border-green-300"
                                                        }`}
                                                >
                                                    {entry.priority}
                                                </Badge>
                                                {entry.status === "consulting" && (
                                                    <Badge className="bg-blue-100 text-blue-800 border border-blue-300">
                                                        In Consultation
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>
                                        <div className="mt-3 flex flex-wrap gap-4 text-sm text-gray-600">
                                            <div className="flex items-center">
                                                <User className="h-4 w-4 mr-1 text-blue-500" />
                                                <span>{entry.age} years, {entry.gender}</span>
                                            </div>
                                            <div className="flex items-center">
                                                <Heart className="h-4 w-4 mr-1 text-blue-500" />
                                                <span>{entry.bloodType}</span>
                                            </div>
                                            <div className="flex items-center">
                                                <Clock className="h-4 w-4 mr-1 text-blue-500" />
                                                <span>~{entry.estimatedWaitTime} min</span>
                                            </div>
                                            {entry.lastVisit && (
                                                <div className="flex items-center">
                                                    <Stethoscope className="h-4 w-4 mr-1 text-blue-500" />
                                                    <span>Appt: {new Date(entry.lastVisit).toLocaleDateString()}</span>
                                                </div>
                                            )}
                                        </div>
                                        {entry.medicalHistory && entry.medicalHistory !== "None recorded" && (
                                            <div className="mt-2">
                                                <p className="text-sm text-gray-700">
                                                    <span className="font-medium">Medical History:</span> {entry.medicalHistory}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex flex-col gap-2 ml-4">
                                        <Button
                                            onClick={() => callNextMutation.mutate(entry.id)}
                                            disabled={callNextMutation.isPending}
                                            className="bg-green-600 hover:bg-green-700 text-white"
                                        >
                                            <CheckCircle className="h-4 w-4 mr-1" />
                                            {entry.status === "consulting" ? "In Progress" : "Call"}
                                        </Button>
                                        <Button
                                            onClick={() => endConsultationMutation.mutate(entry.id)}
                                            disabled={endConsultationMutation.isPending}
                                            variant="outline"
                                            className="border-red-300 text-red-700 hover:bg-red-100"
                                        >
                                            <XCircle className="h-4 w-4 mr-1" />
                                            Done
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            {/* Mobile view */}
                            <div className="md:hidden p-4">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3 font-bold text-blue-800 text-sm">
                                            {entry.position}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900">{entry.name}</h3>
                                            <p className="text-xs text-gray-600">{entry.symptoms}</p>
                                        </div>
                                    </div>
                                    <Badge variant="outline" className={`text-xs ${entry.priority === "critical" ? "bg-red-100 text-red-800 border-red-300" : entry.priority === "urgent" ? "bg-amber-100 text-amber-800 border-amber-300" : "bg-green-100 text-green-800 border-green-300"}`}>
                                        {entry.priority}
                                    </Badge>
                                </div>
                                <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 mb-3">
                                    <div className="flex items-center"><User className="h-3 w-3 mr-1 text-blue-500" /><span>{entry.age}y, {entry.gender}</span></div>
                                    <div className="flex items-center"><Heart className="h-3 w-3 mr-1 text-blue-500" /><span>{entry.bloodType}</span></div>
                                    <div className="flex items-center"><Clock className="h-3 w-3 mr-1 text-blue-500" /><span>~{entry.estimatedWaitTime} min</span></div>
                                    <div className="flex items-center"><Hash className="h-3 w-3 mr-1 text-blue-500" /><span>{entry.tokenNumber}</span></div>
                                </div>
                                <div className="flex gap-2">
                                    <Button size="sm" onClick={() => callNextMutation.mutate(entry.id)} disabled={callNextMutation.isPending} className="flex-1 bg-green-600 hover:bg-green-700 text-white text-xs h-8">
                                        <CheckCircle className="h-3 w-3 mr-1" /> Call
                                    </Button>
                                    <Button size="sm" onClick={() => endConsultationMutation.mutate(entry.id)} variant="outline" className="flex-1 border-red-300 text-red-700 hover:bg-red-100 text-xs h-8">
                                        <XCircle className="h-3 w-3 mr-1" /> Done
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
