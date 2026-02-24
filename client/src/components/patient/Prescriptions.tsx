import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import {
    Pill,
    Calendar,
    Download,
    Eye,
    AlertCircle,
    Clock
} from "lucide-react";
import { appointmentService } from "../../services/api";

interface Prescription {
    id: string;
    date: string;
    doctor: string;
    medications: string[];
    instructions: string;
    status: string;
    nextVisit?: string;
}

export default function Prescriptions() {
    const { patient } = useAuth();
    const navigate = useNavigate();
    const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);

    const { data: appointments = [] } = useQuery({
        queryKey: ["appointments", "patient", patient?.id],
        queryFn: async () => {
            if (!patient?.id) return [];
            const { data } = await appointmentService.getByUserId(patient.id);
            return data || [];
        },
        enabled: !!patient?.id
    });

    // Transform appointments into prescriptions
    // In a real app, this would come from a dedicated prescriptions API
    const activePrescriptions = [
        {
            id: "1",
            date: "2023-06-15",
            doctor: "Dr. Sharma",
            medications: ["Paracetamol 500mg", "Amoxicillin 250mg"],
            instructions: "Take twice daily after meals for 7 days",
            status: "active",
            nextVisit: "2023-06-22"
        },
        {
            id: "2",
            date: "2023-05-20",
            doctor: "Dr. Patel",
            medications: ["Omeprazole 20mg", "Domperidone 10mg"],
            instructions: "Take before breakfast for 14 days",
            status: "completed"
        }
    ];

    const handleViewPrescription = (prescriptionId: string) => {
        // In a real app, this would open a detailed view of the prescription
        console.log("Viewing prescription:", prescriptionId);
    };

    const handleDownloadPrescription = (prescriptionId: string) => {
        // In a real app, this would download the prescription as PDF
        console.log("Downloading prescription:", prescriptionId);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-blue-900">My Prescriptions</h2>
            </div>

            {activePrescriptions.length === 0 ? (
                <Card className="border-blue-200 bg-white">
                    <CardContent className="p-8 text-center">
                        <Pill className="h-12 w-12 mx-auto text-blue-400 mb-4" />
                        <h3 className="text-lg font-medium text-blue-900 mb-2">No Prescriptions</h3>
                        <p className="text-blue-700 mb-4">
                            Your prescriptions will appear here after consultations with doctors.
                        </p>
                        <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => navigate('/patient?tab=book-appointment')}>Book a Consultation</Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-4">
                    {activePrescriptions.map((prescription) => (
                        <Card key={prescription.id} className="border-2 border-blue-300 hover:shadow-md transition-shadow bg-white">
                            <CardHeader className="pb-3 bg-blue-50">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <CardTitle className="flex items-center space-x-2 text-blue-900">
                                            <Pill className="h-5 w-5 text-blue-600" />
                                            <span>Prescription from {prescription.doctor}</span>
                                        </CardTitle>
                                        <p className="text-sm text-blue-700 mt-1">
                                            {new Date(prescription.date).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <Badge
                                        variant={prescription.status === "active" ? "default" : "secondary"}
                                        className={prescription.status === "active" ? "bg-green-500" : "bg-gray-500"}
                                    >
                                        {prescription.status}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-4">
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-sm font-medium text-blue-800 mb-2">Medications</p>
                                        <ul className="space-y-1">
                                            {prescription.medications.map((med, index) => (
                                                <li key={index} className="text-sm text-blue-700 flex items-start">
                                                    <span className="mr-2 text-blue-500">•</span> {med}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div>
                                        <p className="text-sm font-medium text-blue-800">Instructions</p>
                                        <p className="text-sm text-blue-700">{prescription.instructions}</p>
                                    </div>

                                    {prescription.nextVisit && (
                                        <div className="flex items-center text-sm text-blue-700">
                                            <Clock className="h-4 w-4 mr-1 text-blue-500" />
                                            <span>Next visit: {new Date(prescription.nextVisit).toLocaleDateString()}</span>
                                        </div>
                                    )}

                                    <div className="flex space-x-2 pt-2">

                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
