import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useLanguage } from "../../contexts/LanguageContext";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { toast } from "../../hooks/use-toast";
import AppointmentNotes from "../../components/doctor/AppointmentNotes";
import {
    Calendar,
    Download,
    Plus,
    User,
    Phone,
    Mail,
    AlertTriangle,
    Clock,
    TrendingUp,
    Search,
    ChevronRight,
} from "lucide-react";
import { Appointment, User as UserType } from "../../types/schema";

export default function DoctorAppointmentsPage() {
    const { user } = useAuth();
    const { t } = useLanguage();
    const queryClient = useQueryClient();
    const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
    const [showRecommendationsSent, setShowRecommendationsSent] = useState(false);

    // Mock appointment data from waitlist
    const mockAppointments: Appointment[] = [
        {
            id: "apt1",
            doctorId: user?.id || "doctor1",
            patientId: "patient1",
            scheduledAt: new Date(Date.now() + 3600000), // 1 hour from now
            symptoms: "Severe chest pain and shortness of breath",
            priority: "urgent",
            status: "scheduled",
            notes: "Patient reports chest pain for past 2 hours"
        },
        {
            id: "apt2",
            doctorId: user?.id || "doctor1",
            patientId: "patient2",
            scheduledAt: new Date(Date.now() + 7200000), // 2 hours from now
            symptoms: "Persistent headache and dizziness",
            priority: "normal",
            status: "scheduled",
            notes: "Follow-up appointment for migraine treatment"
        },
        {
            id: "apt3",
            doctorId: user?.id || "doctor1",
            patientId: "patient3",
            scheduledAt: new Date(Date.now() + 10800000), // 3 hours from now
            symptoms: "Joint pain and stiffness",
            priority: "normal",
            status: "scheduled",
            notes: "Arthritis checkup"
        },
        {
            id: "apt4",
            doctorId: user?.id || "doctor1",
            patientId: "patient4",
            scheduledAt: new Date(Date.now() + 14400000), // 4 hours from now
            symptoms: "High fever and difficulty breathing",
            priority: "critical",
            status: "scheduled",
            notes: "Asthma attack"
        },
        {
            id: "apt5",
            doctorId: user?.id || "doctor1",
            patientId: "patient5",
            scheduledAt: new Date(Date.now() + 18000000), // 5 hours from now
            symptoms: "Abdominal pain and nausea",
            priority: "urgent",
            status: "scheduled",
            notes: "Suspected gastritis"
        }
    ];

    const { data: todaysAppointments = [] } = useQuery<Appointment[]>({
        queryKey: ["/api/appointments/doctor", user?.id],
        queryFn: async () => {
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 500));
            // Return mock data
            return mockAppointments;
        }
    });

    // Mock patient data
    const mockPatients: UserType[] = [
        {
            id: "patient1",
            name: "Rajesh Kumar",
            email: "rajesh.kumar@example.com",
            role: "patient",
            username: "rajeshk",
            age: 52,
            gender: "male"
        },
        {
            id: "patient2",
            name: "Priya Sharma",
            email: "priya.sharma@example.com",
            role: "patient",
            username: "priyas",
            age: 34,
            gender: "female"
        },
        {
            id: "patient3",
            name: "Amit Patel",
            email: "amit.patel@example.com",
            role: "patient",
            username: "amitp",
            age: 67,
            gender: "male"
        },
        {
            id: "patient4",
            name: "Sunita Verma",
            email: "sunita.verma@example.com",
            role: "patient",
            username: "sunitav",
            age: 28,
            gender: "female"
        },
        {
            id: "patient5",
            name: "Vikram Singh",
            email: "vikram.singh@example.com",
            role: "patient",
            username: "vikrams",
            age: 41,
            gender: "male"
        }
    ];

    // Fetch patient data for appointments
    const { data: patientsData = [] } = useQuery<UserType[]>({
        queryKey: ["/api/users"],
        queryFn: async () => {
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 300));
            // Return mock data
            return mockPatients;
        },
        enabled: todaysAppointments.length > 0
    });

    // Get patient name by ID
    const getPatientName = (patientId?: string) => {
        if (!patientId) return "Unknown Patient";
        const patient = patientsData.find(p => p.id === patientId);
        return patient ? patient.name : "Unknown Patient";
    };

    return (
        <div className="h-[calc(100vh-100px)] flex flex-col gap-6">
            <div className="flex justify-between items-center shrink-0">
                <div>
                    <h2 className="text-3xl font-black text-blue-900 tracking-tight">Clinical Schedule</h2>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">Confirmed & Pending Appointments</p>
                </div>
                <div className="flex gap-3">
                    <Button
                        variant="outline"
                        onClick={() => {
                            queryClient.invalidateQueries({ queryKey: ["/api/appointments/doctor", user?.id] });
                            toast({
                                title: "List Updated",
                                description: "Schedule has been synchronized with the server.",
                                className: "bg-blue-50 border-blue-200 text-blue-800"
                            });
                        }}
                        className="border-slate-200 text-slate-600 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all font-bold px-6"
                    >
                        <Search className="h-4 w-4 mr-2" />
                        Sync Data
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-12 gap-8 flex-1 min-h-0">
                {/* ══ LEFT: APPOINTMENT LIST (Col 5) ════════════════════════════════════ */}
                <div className="col-span-12 lg:col-span-5 flex flex-col gap-4 overflow-y-auto pr-2 custom-scrollbar">
                    {todaysAppointments.length === 0 ? (
                        <div className="bg-white border-2 border-dashed border-slate-100 rounded-[2.5rem] p-12 text-center">
                            <Calendar className="h-12 w-12 mx-auto text-slate-300 mb-4" />
                            <h3 className="text-xl font-black text-slate-900 mb-2">No Active Slots</h3>
                            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest leading-relaxed">Your itinerary for today is clear</p>
                        </div>
                    ) : (
                        (todaysAppointments as Appointment[]).map((apt: Appointment, index: number) => {
                            const isActive = selectedAppointment?.id === apt.id;
                            return (
                                <div
                                    key={apt.id || index}
                                    onClick={() => setSelectedAppointment(apt)}
                                    className={`group relative p-6 rounded-[2rem] border-2 transition-all duration-300 cursor-pointer overflow-hidden ${isActive
                                        ? "bg-blue-600 border-blue-600 shadow-xl shadow-blue-500/20 translate-x-1"
                                        : "bg-white border-slate-100 hover:border-blue-200 hover:bg-blue-50/50"
                                        }`}
                                >
                                    <div className="flex justify-between items-start gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className={`font-black tracking-tight ${isActive ? "text-white" : "text-slate-900 text-lg"}`}>
                                                    {getPatientName(apt.patientId)}
                                                </h3>
                                                <Badge
                                                    className={`rounded-xl px-2.5 py-1 text-[9px] font-black uppercase tracking-widest border-none ${isActive ? "bg-white/20 text-white" :
                                                        apt.status === "completed" ? "bg-emerald-500/10 text-emerald-600" :
                                                            apt.status === "in-progress" ? "bg-blue-500/10 text-blue-600" :
                                                                apt.status === "scheduled" ? "bg-indigo-500/10 text-indigo-600" :
                                                                    "bg-slate-100 text-slate-400"
                                                        }`}
                                                >
                                                    {apt.status === "scheduled" ? "Pending" : apt.status}
                                                </Badge>
                                            </div>
                                            
                                            <p className={`text-xs font-medium leading-relaxed line-clamp-1 mb-4 ${isActive ? "text-blue-100/80" : "text-slate-500"}`}>
                                                {apt.symptoms || "Standard Consultation"}
                                            </p>

                                            <div className="flex items-center gap-6">
                                                <div className={`flex items-center text-[10px] font-black uppercase tracking-widest ${isActive ? "text-white/70" : "text-slate-400"}`}>
                                                    <Clock className={`h-3 w-3 mr-1.5 ${isActive ? "text-white" : "text-blue-500"}`} />
                                                    {new Date(apt.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </div>
                                                <div className={`flex items-center text-[10px] font-black uppercase tracking-widest ${isActive ? "text-white/70" : "text-slate-400"}`}>
                                                    <TrendingUp className={`h-3 w-3 mr-1.5 ${isActive ? "text-white" : "text-rose-500"}`} />
                                                    {apt.priority}
                                                </div>
                                            </div>
                                        </div>
                                        
                                        {isActive && (
                                            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                                                <ChevronRight className="h-4 w-4 text-white" />
                                            </div>
                                        )}
                                    </div>

                                    {/* Left Status Bar */}
                                    <div className={`absolute top-0 left-0 w-1.5 h-full transition-colors ${isActive ? "bg-white/40" :
                                        apt.priority === "critical" ? "bg-rose-500" :
                                            apt.priority === "urgent" ? "bg-amber-500" : "bg-blue-400"
                                        }`} />
                                </div>
                            );
                        })
                    )}
                </div>

                {/* ══ RIGHT: DETAILS / NOTES (Col 7) ═══════════════════════════════════ */}
                <div className="col-span-12 lg:col-span-7 flex flex-col min-h-0">
                    <div className="bg-white border-2 border-slate-100 rounded-[2.5rem] flex-1 overflow-y-auto custom-scrollbar shadow-2xl shadow-blue-900/5">
                        {selectedAppointment ? (
                            <div className="p-8">
                                <AppointmentNotes
                                    appointment={{
                                        id: selectedAppointment.id,
                                        patientId: selectedAppointment.patientId!,
                                        patientName: getPatientName(selectedAppointment.patientId),
                                        scheduledAt: selectedAppointment.scheduledAt || new Date(),
                                        symptoms: selectedAppointment.symptoms || "Not specified",
                                        priority: selectedAppointment.priority || "normal",
                                        medicalHistory: {
                                            conditions: [],
                                            allergies: [],
                                            medications: [],
                                            surgeries: "",
                                            familyHistory: ""
                                        },
                                        additionalNotes: selectedAppointment.notes || "",
                                        status: selectedAppointment.status || "scheduled"
                                    }}
                                    onRecommendationsSent={() => {
                                        setShowRecommendationsSent(true);
                                        toast({
                                            title: "Recommendations Issued",
                                            description: "Patient has been notified of your clinical recommendations.",
                                            className: "bg-emerald-50 border-emerald-200 text-emerald-800"
                                        });
                                    }}
                                    readOnly={selectedAppointment.status === "completed"}
                                />
                            </div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-center p-12 space-y-6">
                                <div className="w-24 h-24 bg-blue-50 rounded-[2rem] flex items-center justify-center border border-blue-100/50">
                                    <User className="h-10 w-10 text-blue-300" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black text-slate-900 mb-2">No Selection</h3>
                                    <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em] max-w-[280px] mx-auto leading-loose">
                                        Select an active appointment from the list to view medical history and record clinical notes
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
