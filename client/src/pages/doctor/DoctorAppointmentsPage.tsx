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
    Search
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
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-blue-900">Patient Appointments</h2>
                <div className="flex space-x-2">
                    <Button
                        variant="outline"
                        onClick={() => {
                            // In a real implementation, this would refresh the appointments
                            queryClient.invalidateQueries({ queryKey: ["/api/appointments/doctor", user?.id] });
                            toast({
                                title: "Refreshed",
                                description: "Appointments list has been updated",
                                className: "bg-green-50 border-green-200 text-green-800"
                            });
                        }}
                        className="border-blue-300 text-blue-700 hover:bg-blue-100 hover:shadow-md transition-all duration-200 flex items-center"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Refresh
                    </Button>
                </div>
            </div>

            {selectedAppointment && selectedAppointment.patientId ? (
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
                            title: "Success",
                            description: "Recommendations sent to patient successfully!"
                        });
                    }}
                />
            ) : (
                <Card className="shadow-lg hover:shadow-xl transition-all duration-300 bg-white border-2 border-blue-200 rounded-xl overflow-hidden">
                    <CardContent className="p-0">
                        {todaysAppointments.length === 0 ? (
                            <div className="text-center py-12">
                                <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">No Appointments Today</h3>
                                <p className="text-gray-600 mb-4">You have no appointments scheduled for today.</p>
                                <Button
                                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105"
                                    onClick={() => {
                                        // In a real implementation, this would navigate to scheduling
                                        toast({
                                            title: "Scheduling",
                                            description: "Appointment scheduling feature coming soon"
                                        });
                                    }}
                                >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Schedule Appointment
                                </Button>
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-100">
                                {(todaysAppointments as Appointment[]).map((apt: Appointment, index: number) => (
                                    <div
                                        key={apt.id || index}
                                        className="p-6 hover:bg-blue-50 transition-all duration-200 cursor-pointer transform hover:scale-[1.01] border-b border-gray-100 last:border-b-0 hover:shadow-md"
                                        onClick={() => setSelectedAppointment(apt)}
                                    >
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1">
                                                <div className="flex items-center mb-2">
                                                    <h3 className="font-bold text-lg text-blue-900 mr-3">{getPatientName(apt.patientId)}</h3>
                                                    <Badge
                                                        variant="default"
                                                        className={
                                                            apt.status === "completed" ? "bg-green-500" :
                                                                apt.status === "in-progress" ? "bg-blue-500" :
                                                                    apt.status === "scheduled" ? "bg-yellow-500" :
                                                                        apt.status === "cancelled" ? "bg-red-500" :
                                                                            "bg-gray-500"
                                                        }
                                                    >
                                                        {apt.status === "scheduled" ? "Pending" :
                                                            apt.status === "in-progress" ? "Approved" :
                                                                apt.status.charAt(0).toUpperCase() + apt.status.slice(1)}
                                                    </Badge>
                                                </div>
                                                <p className="text-gray-700 mb-3">{apt.symptoms || "General Checkup"}</p>
                                                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                                                    <div className="flex items-center">
                                                        <Calendar className="h-4 w-4 mr-1 text-blue-500" />
                                                        <span>{new Date(apt.scheduledAt).toLocaleDateString()}</span>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <Clock className="h-4 w-4 mr-1 text-blue-500" />
                                                        <span>{new Date(apt.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <AlertTriangle className="h-4 w-4 mr-1 text-blue-500" />
                                                        <span className="capitalize">{apt.priority}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex flex-col items-end">
                                                <Badge variant="outline" className="text-xs bg-blue-100 text-blue-800 mb-2 border-blue-300">
                                                    {apt.priority}
                                                </Badge>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="mt-2 border-blue-300 text-blue-700 hover:bg-blue-100 hover:shadow-sm"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        // In a real implementation, this would download appointment details
                                                        toast({
                                                            title: "Download Started",
                                                            description: "Appointment details download has started",
                                                            className: "bg-blue-50 border-blue-200 text-blue-800"
                                                        });
                                                    }}
                                                >
                                                    <Download className="h-4 w-4 mr-1" />
                                                    PDF
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
