import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import {
    FileText,
    Download,
    Eye,
    Stethoscope,
    Calendar,
    User,
    Clipboard,
    Pill
} from "lucide-react";
import { appointmentService } from "../../services/api";
import jsPDF from "jspdf";

interface MedicalRecord {
    id: string;
    date: string;
    type: string;
    doctor: string;
    diagnosis: string;
    prescription: string;
    notes: string;
}

export default function MedicalRecords() {
    const { user, patient } = useAuth();
    const navigate = useNavigate();
    const [records, setRecords] = useState<MedicalRecord[]>([]);
    const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(null);
    const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);

    // Fetch appointments to generate medical records
    const { data: appointments } = useQuery({
        queryKey: ["appointments", "patient", patient?.id],
        queryFn: async () => {
            if (!patient?.id) return [];
            const { data } = await appointmentService.getByUserId(patient.id);
            return data || [];
        },
        enabled: !!patient?.id
    });

    useEffect(() => {
        if (appointments && appointments.length > 0) {
            const transformedRecords = appointments
                .filter((apt: any) => (apt.status === "completed" || apt.status === "dispensed"))
                .map((apt: any) => ({
                    id: apt.id,
                    date: apt.scheduledAt,
                    type: "Consultation",
                    doctor: `Dr. ${apt.doctorId || "Unknown"}`,
                    diagnosis: apt.diagnosis || "No diagnosis recorded",
                    prescription: apt.treatment || "No prescription recorded",
                    notes: apt.notes || "No additional notes"
                }))
                .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());

            setRecords(transformedRecords);
        }
    }, [appointments, user]);

    const handleViewRecord = (record: MedicalRecord) => {
        setSelectedRecord(record);
        setIsRecordModalOpen(true);
    };

    const handleDownloadRecord = (recordId: string) => {
        const record = records.find(r => r.id === recordId);
        if (record) {
            // Create new PDF document
            const doc = new jsPDF();

            // Add hospital header
            doc.setFontSize(20);
            doc.setTextColor(0, 102, 204);
            doc.text("SEVA ONLINE MEDICAL CENTER", 105, 20, { align: "center" });

            // Add subtitle
            doc.setFontSize(12);
            doc.setTextColor(100, 100, 100);
            doc.text("Medical Record", 105, 30, { align: "center" });

            // Add horizontal line
            doc.setDrawColor(0, 102, 204);
            doc.line(20, 35, 190, 35);

            // Add record details
            doc.setFontSize(16);
            doc.setTextColor(0, 0, 0);
            doc.text("MEDICAL RECORD DETAILS", 105, 45, { align: "center" });

            // Patient Information Section
            doc.setFontSize(14);
            doc.setTextColor(0, 102, 204);
            doc.text("Patient Information:", 20, 55);

            doc.setFontSize(12);
            doc.setTextColor(0, 0, 0);
            doc.text(`Name: ${user?.name || "Not provided"}`, 25, 62);
            doc.text(`Patient ID: ${patient?.id?.substring(0, 8) || "N/A"}`, 25, 69);

            // Appointment Details Section
            doc.setFontSize(14);
            doc.setTextColor(0, 102, 204);
            doc.text("Appointment Details:", 20, 80);

            doc.setFontSize(12);
            doc.setTextColor(0, 0, 0);
            doc.text(`Date: ${new Date(record.date).toLocaleDateString()}`, 25, 87);
            doc.text(`Time: ${new Date(record.date).toLocaleTimeString()}`, 25, 94);
            doc.text(`Doctor: ${record.doctor}`, 25, 101);
            doc.text(`Type: ${record.type}`, 25, 108);

            // Diagnosis Section
            doc.setFontSize(14);
            doc.setTextColor(0, 102, 204);
            doc.text("Diagnosis:", 20, 120);

            doc.setFontSize(12);
            doc.setTextColor(0, 0, 0);
            const splitDiagnosis = doc.splitTextToSize(record.diagnosis, 160);
            doc.text(splitDiagnosis, 25, 127);

            // Prescription Section
            doc.setFontSize(14);
            doc.setTextColor(0, 102, 204);
            doc.text("Prescription:", 20, 127 + (splitDiagnosis.length * 7) + 10);

            doc.setFontSize(12);
            doc.setTextColor(0, 0, 0);
            const splitPrescription = doc.splitTextToSize(record.prescription, 160);
            doc.text(splitPrescription, 25, 127 + (splitDiagnosis.length * 7) + 17);

            // Notes Section
            doc.setFontSize(14);
            doc.setTextColor(0, 102, 204);
            doc.text("Notes:", 20, 127 + (splitDiagnosis.length * 7) + (splitPrescription.length * 7) + 25);

            doc.setFontSize(12);
            doc.setTextColor(0, 0, 0);
            const splitNotes = doc.splitTextToSize(record.notes || "No additional notes", 160);
            doc.text(splitNotes, 25, 127 + (splitDiagnosis.length * 7) + (splitPrescription.length * 7) + 32);

            // Footer
            doc.setFontSize(10);
            doc.setTextColor(150, 150, 150);
            doc.text("Generated on: " + new Date().toLocaleString(), 105, 277, { align: "center" });

            // Save the PDF
            doc.save(`medical-record-${user?.name || "patient"}-${new Date(record.date).toISOString().split('T')[0]}.pdf`);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Medical Records</h2>
            </div>

            {records.length === 0 ? (
                <Card className="border-2 border-blue-200">
                    <CardContent className="p-8 text-center">
                        <FileText className="h-12 w-12 mx-auto text-blue-400 mb-4" />
                        <h3 className="text-lg font-medium text-blue-900 mb-2">No Medical Records</h3>
                        <p className="text-blue-700 mb-4">
                            Your medical records will appear here after consultations with doctors.
                        </p>
                        <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => navigate('/patient?tab=book-appointment')}>Book a Consultation</Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-4">
                    {records.map((record) => (
                        <Card key={record.id} className="border-2 border-blue-200 hover:shadow-md transition-shadow bg-white">
                            <CardHeader className="pb-3">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <CardTitle className="flex items-center space-x-2">
                                            <Stethoscope className="h-5 w-5 text-blue-600" />
                                            <span>{record.type}</span>
                                        </CardTitle>
                                        <p className="text-sm text-blue-800 mt-1">
                                            {new Date(record.date).toLocaleDateString()} • {record.doctor}
                                        </p>
                                    </div>
                                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                                        Completed
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-0">
                                <div className="space-y-3">
                                    <div>
                                        <p className="text-sm font-medium text-blue-900">Diagnosis</p>
                                        <p className="text-sm text-blue-700">{record.diagnosis}</p>
                                    </div>

                                    {record.prescription && (
                                        <div>
                                            <p className="text-sm font-medium text-blue-900">Prescription</p>
                                            <p className="text-sm text-blue-700">{record.prescription}</p>
                                        </div>
                                    )}

                                    <div className="flex space-x-2 pt-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleViewRecord(record)}
                                            className="flex items-center border-blue-300 text-blue-700 hover:bg-blue-50 w-full justify-center"
                                        >
                                            <Eye className="h-4 w-4 mr-1" />
                                            View Details
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* Medical Record Detail Modal */}
            <Dialog open={isRecordModalOpen} onOpenChange={setIsRecordModalOpen}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="text-2xl flex items-center">
                            <FileText className="h-6 w-6 mr-2 text-blue-600" />
                            Medical Record Details
                        </DialogTitle>
                    </DialogHeader>

                    {selectedRecord && (
                        <div className="space-y-6">
                            {/* Header */}
                            <div className="bg-blue-50 p-4 rounded-lg">
                                <h3 className="text-xl font-bold text-blue-900">{selectedRecord.type}</h3>
                                <div className="flex flex-wrap gap-4 mt-2 text-blue-700">
                                    <div className="flex items-center">
                                        <Calendar className="h-4 w-4 mr-1" />
                                        <span>{new Date(selectedRecord.date).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <User className="h-4 w-4 mr-1" />
                                        <span>{selectedRecord.doctor}</span>
                                    </div>
                                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                                        Completed
                                    </Badge>
                                </div>
                            </div>

                            {/* Patient Information */}
                            <div>
                                <h4 className="text-lg font-semibold text-blue-900 mb-3 flex items-center">
                                    <User className="h-5 w-5 mr-2" />
                                    Patient Information
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="bg-white p-3 rounded border border-blue-200">
                                        <p className="text-sm text-blue-600">Name</p>
                                        <p className="font-medium">{user?.name || "N/A"}</p>
                                    </div>
                                    <div className="bg-white p-3 rounded border border-blue-200">
                                        <p className="text-sm text-blue-600">Patient ID</p>
                                        <p className="font-medium">{patient?.id?.substring(0, 8) || "N/A"}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Diagnosis */}
                            <div>
                                <h4 className="text-lg font-semibold text-blue-900 mb-3 flex items-center">
                                    <Stethoscope className="h-5 w-5 mr-2" />
                                    Diagnosis
                                </h4>
                                <div className="bg-white p-4 rounded border border-blue-200">
                                    <p className="text-blue-800">{selectedRecord.diagnosis}</p>
                                </div>
                            </div>

                            {/* Prescription */}
                            {selectedRecord.prescription && (
                                <div>
                                    <h4 className="text-lg font-semibold text-blue-900 mb-3 flex items-center">
                                        <Pill className="h-5 w-5 mr-2" />
                                        Prescription
                                    </h4>
                                    <div className="bg-white p-4 rounded border border-blue-200">
                                        <p className="text-blue-800">{selectedRecord.prescription}</p>
                                    </div>
                                </div>
                            )}

                            {/* Notes */}
                            <div>
                                <h4 className="text-lg font-semibold text-blue-900 mb-3 flex items-center">
                                    <Clipboard className="h-5 w-5 mr-2" />
                                    Notes
                                </h4>
                                <div className="bg-white p-4 rounded border border-blue-200">
                                    <p className="text-blue-800">{selectedRecord.notes || "No additional notes"}</p>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex justify-end space-x-3 pt-4">
                                <Button
                                    variant="outline"
                                    onClick={() => handleDownloadRecord(selectedRecord.id)}
                                    className="border-blue-300 text-blue-700 hover:bg-blue-50"
                                >
                                    <Download className="h-4 w-4 mr-2" />
                                    Download PDF
                                </Button>
                                <Button
                                    onClick={() => setIsRecordModalOpen(false)}
                                    className="bg-blue-600 hover:bg-blue-700 text-white"
                                >
                                    Close
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
