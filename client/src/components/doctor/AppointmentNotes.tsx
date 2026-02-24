import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useLanguage } from "../../contexts/LanguageContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { appointmentService } from "../../services/api";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import {
    FileText,
    Download,
    Save,
    Bot,
    AlertCircle,
    CheckCircle
} from "lucide-react";
import { toast } from "../../hooks/use-toast";

interface Appointment {
    id: string;
    patientId: string;
    patientName: string;
    scheduledAt: Date;
    symptoms: string;
    priority: string;
    medicalHistory: {
        conditions: string[];
        allergies: string[];
        medications: string[];
        surgeries: string;
        familyHistory: string;
    };
    additionalNotes: string;
    doctorNotes?: string;
    doctorRecommendations?: string;
    status: string;
}

interface RecommendationTemplate {
    patientName: string;
    doctorName: string;
    date: Date;
    diagnosis: string;
    recommendations: string;
    medications: string[];
    followUp: string;
}

export default function AppointmentNotes({
    appointment,
    onRecommendationsSent
}: {
    appointment: Appointment;
    onRecommendationsSent: () => void;
}) {
    const { user } = useAuth();
    const { t } = useLanguage();
    const queryClient = useQueryClient();

    const [doctorNotes, setDoctorNotes] = useState(appointment.doctorNotes || "");
    const [doctorRecommendations, setDoctorRecommendations] = useState(appointment.doctorRecommendations || "");
    const [diagnosis, setDiagnosis] = useState("");
    const [medications, setMedications] = useState<string[]>([]);
    const [followUp, setFollowUp] = useState("");

    // Update appointment mutation
    const updateAppointmentMutation = useMutation({
        mutationFn: async (data: Partial<Appointment>) => {
            return appointmentService.update(appointment.id, data);
        },
        onSuccess: (response) => {
            if (response.error) {
                toast({
                    title: "Error",
                    description: response.error,
                    variant: "destructive"
                });
            } else {
                toast({
                    title: "Success",
                    description: "Notes saved successfully!"
                });
                queryClient.invalidateQueries({ queryKey: ["/api/appointments/doctor", user?.id] });
            }
        },
        onError: () => {
            toast({
                title: "Error",
                description: "Failed to save notes",
                variant: "destructive"
            });
        }
    });

    // Handle save notes
    const handleSaveNotes = () => {
        updateAppointmentMutation.mutate({
            doctorNotes,
            doctorRecommendations
        });
    };

    // Generate recommendation template
    const generateRecommendationTemplate = (): RecommendationTemplate => {
        return {
            patientName: appointment.patientName,
            doctorName: user?.name || "Dr. Smith",
            date: new Date(),
            diagnosis,
            recommendations: doctorRecommendations,
            medications,
            followUp
        };
    };

    // Download recommendation template as PDF
    const downloadRecommendationTemplate = () => {
        const template = generateRecommendationTemplate();

        // Create content for the recommendation
        const content = `
SEVA ONLINE MEDICAL CENTER
DOCTOR'S RECOMMENDATIONS

Patient: ${template.patientName}
Doctor: ${template.doctorName}
Date: ${template.date.toLocaleDateString()}

DIAGNOSIS:
${template.diagnosis || "Not specified"}

RECOMMENDATIONS:
${template.recommendations || "No recommendations provided"}

MEDICATIONS PRESCRIBED:
${template.medications.length > 0 ? template.medications.join("\n") : "None"}

FOLLOW-UP INSTRUCTIONS:
${template.followUp || "No follow-up instructions provided"}

This document is for patient reference only. Please follow up with your doctor for any questions.
    `.trim();

        // Create and download file
        const blob = new Blob([content], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `recommendations_${template.patientName.replace(/\s+/g, "_")}_${template.date.toISOString().split("T")[0]}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        toast({
            title: "Success",
            description: "Recommendations downloaded successfully"
        });

        // Notify that recommendations were sent
        onRecommendationsSent();
    };

    // AI assistance for generating questions
    const getAIAssistance = () => {
        // In a real implementation, this would call an AI service
        // For demonstration, we'll provide sample questions based on symptoms
        const sampleQuestions = [
            "Have you experienced any changes in appetite or weight recently?",
            "Are you currently taking any medications not listed in the form?",
            "Have you had similar symptoms before?",
            "Do you have any concerns about the symptoms described?",
            "Are there any activities that make the symptoms better or worse?"
        ];

        toast({
            title: "AI Assistant Suggestions",
            description: (
                <div className="space-y-3">
                    <div className="flex items-center bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <Bot className="h-5 w-5 text-blue-600 mr-2" />
                        <span className="font-medium text-blue-900">Intelligent Recommendations</span>
                    </div>
                    <p className="font-medium text-gray-700">Consider asking these questions:</p>
                    <ul className="list-disc pl-5 space-y-2">
                        {sampleQuestions.map((question, index) => (
                            <li key={index} className="text-gray-700 pl-2">{question}</li>
                        ))}
                    </ul>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-3">
                        <div className="flex items-start">
                            <AlertCircle className="h-4 w-4 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
                            <p className="text-sm text-blue-700">
                                These AI-generated suggestions are meant to supplement your professional judgment
                            </p>
                        </div>
                    </div>
                </div>
            ),
            className: "bg-white border border-blue-200 shadow-lg rounded-xl"
        });
    };

    return (
        <div className="space-y-6">
            <Card className="border-2 border-blue-500/30 bg-gradient-to-br from-white to-blue-50 backdrop-blur-sm shadow-lg rounded-xl">
                <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-xl">
                    <CardTitle className="flex items-center">
                        <FileText className="h-5 w-5 mr-2" />
                        <span>Appointment Details</span>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <Label className="text-muted-foreground">Patient</Label>
                            <p className="font-medium">{appointment.patientName}</p>
                        </div>
                        <div>
                            <Label className="text-muted-foreground">Appointment Date</Label>
                            <p className="font-medium">{new Date(appointment.scheduledAt).toLocaleDateString()}</p>
                        </div>
                        <div>
                            <Label className="text-muted-foreground">Symptoms</Label>
                            <p className="font-medium">{appointment.symptoms}</p>
                        </div>
                        <div>
                            <Label className="text-muted-foreground">Priority</Label>
                            <p className="font-medium capitalize">{appointment.priority}</p>
                        </div>
                    </div>

                    <div className="border rounded-lg p-4 bg-muted/50">
                        <h4 className="font-medium mb-2">Medical History</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                            <div>
                                <Label className="text-muted-foreground">Conditions</Label>
                                <p>{appointment.medicalHistory.conditions.join(", ") || "None"}</p>
                            </div>
                            <div>
                                <Label className="text-muted-foreground">Allergies</Label>
                                <p>{appointment.medicalHistory.allergies.join(", ") || "None"}</p>
                            </div>
                            <div>
                                <Label className="text-muted-foreground">Medications</Label>
                                <p>{appointment.medicalHistory.medications.join(", ") || "None"}</p>
                            </div>
                            <div>
                                <Label className="text-muted-foreground">Surgeries</Label>
                                <p>{appointment.medicalHistory.surgeries || "None"}</p>
                            </div>
                        </div>
                        <div className="mt-2">
                            <Label className="text-muted-foreground">Family History</Label>
                            <p>{appointment.medicalHistory.familyHistory || "Not provided"}</p>
                        </div>
                        {appointment.additionalNotes && (
                            <div className="mt-2">
                                <Label className="text-muted-foreground">Additional Notes</Label>
                                <p>{appointment.additionalNotes}</p>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Doctor Notes */}
                <Card className="border-2 border-blue-500/30 bg-gradient-to-br from-white to-blue-50 backdrop-blur-sm shadow-lg rounded-xl">
                    <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-t-xl">
                        <CardTitle className="flex items-center justify-between">
                            <span className="flex items-center">
                                <FileText className="h-5 w-5 mr-2" />
                                Doctor Notes
                            </span>
                            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-xl p-6 mb-6 shadow-sm">
                                <div className="flex flex-col items-center text-center mb-4">
                                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-full p-3 mb-3">
                                        <Bot className="h-6 w-6 text-white" />
                                    </div>
                                    <h3 className="text-lg font-bold text-blue-900 mb-2">AI Assistant</h3>
                                    <p className="text-blue-700 text-sm max-w-md">
                                        Get intelligent suggestions to improve patient care and streamline your consultation process
                                    </p>
                                </div>
                                <div className="flex justify-center mt-4">
                                    <Button
                                        onClick={getAIAssistance}
                                        className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center px-6 py-3"
                                    >
                                        <Bot className="h-5 w-5 mr-2" />
                                        Get AI Suggestions
                                    </Button>
                                </div>
                            </div>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="diagnosis">Diagnosis</Label>
                                <Textarea
                                    id="diagnosis"
                                    value={diagnosis}
                                    onChange={(e) => setDiagnosis(e.target.value)}
                                    placeholder="Enter your diagnosis..."
                                    className="min-h-[100px]"
                                />
                            </div>

                            <div>
                                <Label htmlFor="doctor-notes">Observations & Notes</Label>
                                <Textarea
                                    id="doctor-notes"
                                    value={doctorNotes}
                                    onChange={(e) => setDoctorNotes(e.target.value)}
                                    placeholder="Enter your observations and notes..."
                                    className="min-h-[150px]"
                                />
                            </div>

                            <Button
                                onClick={handleSaveNotes}
                                disabled={updateAppointmentMutation.isPending}
                            >
                                <Save className="h-4 w-4 mr-2" />
                                {updateAppointmentMutation.isPending ? "Saving..." : "Save Notes"}
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Doctor Recommendations */}
                <Card className="border-2 border-purple-500/30 bg-gradient-to-br from-white to-purple-50 backdrop-blur-sm shadow-lg rounded-xl">
                    <CardHeader className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-t-xl">
                        <CardTitle className="flex items-center">
                            <CheckCircle className="h-5 w-5 mr-2" />
                            <span>Doctor Recommendations</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="recommendations">Treatment Recommendations</Label>
                                <Textarea
                                    id="recommendations"
                                    value={doctorRecommendations}
                                    onChange={(e) => setDoctorRecommendations(e.target.value)}
                                    placeholder="Enter your treatment recommendations..."
                                    className="min-h-[100px]"
                                />
                            </div>

                            <div>
                                <Label htmlFor="medications">Prescribed Medications</Label>
                                <Input
                                    id="medications"
                                    placeholder="Enter medications (comma separated)"
                                    onChange={(e) => setMedications(e.target.value.split(",").map(m => m.trim()))}
                                />
                                {medications.length > 0 && (
                                    <div className="mt-2 flex flex-wrap gap-2">
                                        {medications.map((med, index) => (
                                            <span key={index} className="bg-primary/10 text-primary text-xs px-2 py-1 rounded">
                                                {med}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="space-y-6">
                                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6 shadow-sm">
                                    <div className="flex flex-col items-center text-center mb-4">
                                        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-full p-3 mb-3">
                                            <FileText className="h-6 w-6 text-white" />
                                        </div>
                                        <h3 className="text-lg font-bold text-green-900 mb-2">Treatment Recommendations</h3>
                                        <p className="text-green-700 text-sm max-w-md">
                                            {doctorRecommendations || "No recommendations provided yet"}
                                        </p>
                                    </div>
                                    <div className="mt-4">
                                        <h4 className="font-medium text-green-800 mb-2">Prescribed Medications</h4>
                                        {medications.length > 0 ? (
                                            <div className="flex flex-wrap gap-2 mb-4">
                                                {medications.map((med, index) => (
                                                    <span key={index} className="bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full border border-green-200">
                                                        {med}
                                                    </span>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-green-600 text-sm mb-4">No medications prescribed</p>
                                        )}
                                        <h4 className="font-medium text-green-800 mb-2">Follow-up Instructions</h4>
                                        <p className="text-green-700 text-sm mb-4">
                                            {followUp || "No follow-up instructions provided"}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex justify-center">
                                    <Button
                                        onClick={downloadRecommendationTemplate}
                                        disabled={!doctorRecommendations}
                                        className="bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center px-6 py-3"
                                    >
                                        <Download className="h-5 w-5 mr-2" />
                                        Download & Send PDF
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
