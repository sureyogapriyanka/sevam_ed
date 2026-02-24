import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    Users,
    Search,
    ArrowLeft,
    MoreVertical,
    Filter,
    Activity,
    Calendar,
    Edit3,
    X,
    Save
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { useToast } from "../../hooks/use-toast";

export default function NursePatientsPage() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { toast } = useToast();

    const [searchTerm, setSearchTerm] = useState("");
    const [editingPatient, setEditingPatient] = useState<any>(null);
    const [editForm, setEditForm] = useState({
        bloodType: "",
        height: "",
        weight: "",
        allergies: "",
        medicalHistory: "",
        medications: ""
    });

    // Fetch Patients
    const { data: rawPatients = [], isLoading } = useQuery<any[]>({
        queryKey: ["/api/patients"],
        queryFn: async () => {
            const token = localStorage.getItem("token") || "";
            const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
            const res = await fetch(`${API_URL}/patients`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (!res.ok) throw new Error("Failed to fetch patients");
            const data = await res.json();
            return Array.isArray(data) ? data : (data.patients || []);
        }
    });

    // Update Patient Mutation
    const updatePatientMutation = useMutation({
        mutationFn: async (updatedData: any) => {
            const token = localStorage.getItem("token") || "";
            const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
            const res = await fetch(`${API_URL}/patients/${updatedData.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(updatedData.data)
            });
            if (!res.ok) throw new Error("Failed to update patient");
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/patients"] });
            toast({ title: "Success", description: "Patient profile updated successfully" });
            setEditingPatient(null);
        },
        onError: () => {
            toast({ variant: "destructive", title: "Error", description: "Could not update patient profile" });
        }
    });

    // Handle Search Filter
    const patients = rawPatients.filter((p) => {
        if (!searchTerm) return true;
        const s = searchTerm.toLowerCase();
        return (
            p.userId?.name?.toLowerCase().includes(s) ||
            p._id?.toLowerCase().includes(s) ||
            p.userId?.username?.toLowerCase().includes(s) ||
            p.userId?.phone?.includes(s)
        );
    });

    const handleEditClick = (patient: any) => {
        setEditingPatient(patient);
        setEditForm({
            bloodType: patient.bloodType || "",
            height: patient.height || "",
            weight: patient.weight || "",
            allergies: Array.isArray(patient.allergies) ? patient.allergies.join(", ") : (patient.allergies || ""),
            medicalHistory: Array.isArray(patient.medicalHistory) ? patient.medicalHistory.join(", ") : (patient.medicalHistory || ""),
            medications: Array.isArray(patient.medications) ? patient.medications.join(", ") : (patient.medications || "")
        });
    };

    const handleSaveEdit = () => {
        if (!editingPatient) return;
        updatePatientMutation.mutate({
            id: editingPatient._id,
            data: {
                bloodType: editForm.bloodType,
                height: Number(editForm.height),
                weight: Number(editForm.weight),
                allergies: editForm.allergies.split(",").map(s => s.trim()).filter(Boolean),
                medicalHistory: editForm.medicalHistory.split(",").map(s => s.trim()).filter(Boolean),
                medications: editForm.medications.split(",").map(s => s.trim()).filter(Boolean),
            }
        });
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => navigate('/nurse/dashboard')}>
                        <ArrowLeft className="w-5 h-5 text-slate-600" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Patient Directory</h1>
                        <p className="text-slate-500 text-sm">Managing all patients in your assigned ward.</p>
                    </div>
                </div>
            </div>

            <Card className="border-slate-200/60 shadow-sm">
                <CardHeader className="border-b border-slate-50 bg-slate-50/30">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <Input
                                placeholder="Search by name, ID, or phone..."
                                className="pl-10 bg-white border-slate-200"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm" className="gap-2 text-slate-600 font-bold border-slate-200">
                                <Filter className="w-4 h-4" />
                                Filter
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    {isLoading ? (
                        <div className="p-20 flex justify-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        </div>
                    ) : patients.length === 0 ? (
                        <div className="p-20 text-center">
                            <Users className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                            <p className="text-slate-500 font-semibold text-lg">No patients found matching your query.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead>
                                    <tr className="bg-slate-50/50 text-slate-500 uppercase text-[10px] font-bold tracking-wider divide-x divide-slate-100 border-b border-slate-100">
                                        <th className="px-6 py-4">Patient Profile</th>
                                        <th className="px-6 py-4">Bio Details</th>
                                        <th className="px-6 py-4">Status & Next of Kin</th>
                                        <th className="px-6 py-4">Last Checkup</th>
                                        <th className="px-6 py-4 text-right">Clinical Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {patients.map((patient: any) => (
                                        <tr key={patient._id} className="hover:bg-blue-50/30 transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-base shadow-sm group-hover:bg-blue-600 group-hover:text-white transition-all">
                                                        {patient.userId?.name?.charAt(0) || 'P'}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-slate-900 text-sm">{patient.userId?.name || 'Unknown'}</p>
                                                        <p className="text-[11px] text-slate-500 font-mono">ID: {patient._id?.slice(-8).toUpperCase()}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col gap-1">
                                                    <Badge variant="outline" className="w-fit text-[11px] font-medium bg-white">
                                                        {patient.userId?.age}Y · {patient.userId?.gender}
                                                    </Badge>
                                                    <span className="text-[10px] text-slate-400 font-bold ml-1">{patient.bloodType || patient.userId?.bloodGroup || 'O+'}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col gap-1">
                                                    <Badge className="bg-emerald-50 text-emerald-700 border-none hover:bg-emerald-50 pointer-events-none text-[11px] w-fit">
                                                        Active
                                                    </Badge>
                                                    {patient.emergencyContact?.name && (
                                                        <span className="text-[10px] text-slate-500">Contact: {patient.emergencyContact.name}</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2 text-slate-600">
                                                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                                                    <span className="text-[12px]">{patient.lastVisit ? new Date(patient.lastVisit).toLocaleDateString() : 'Today'}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Button variant="ghost" size="sm" className="h-8 px-3 text-emerald-600 hover:bg-emerald-50 font-bold" onClick={() => handleEditClick(patient)}>
                                                        <Edit3 className="w-4 h-4 mr-2" />
                                                        Profile
                                                    </Button>
                                                    <Button variant="ghost" size="sm" className="h-8 px-3 text-blue-600 hover:bg-blue-50 font-bold" onClick={() => navigate(`/nurse/vitals/${patient._id}`)}>
                                                        <Activity className="w-4 h-4 mr-2" />
                                                        Take Vitals
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Edit Patient Profile Modal */}
            {editingPatient && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <Card className="w-full max-w-2xl shadow-xl overflow-hidden border-0">
                        <CardHeader className="bg-blue-600 text-white flex flex-row items-center justify-between p-4">
                            <CardTitle className="text-lg font-bold flex items-center gap-2">
                                <Users className="w-5 h-5 text-blue-200" />
                                Update Patient Profile: {editingPatient.userId?.name}
                            </CardTitle>
                            <Button variant="ghost" size="icon" className="text-white hover:bg-blue-700 rounded-full" onClick={() => setEditingPatient(null)}>
                                <X className="w-5 h-5" />
                            </Button>
                        </CardHeader>
                        <CardContent className="p-6 bg-white space-y-4 max-h-[70vh] overflow-y-auto">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Blood Type</label>
                                    <Input value={editForm.bloodType} onChange={(e) => setEditForm({ ...editForm, bloodType: e.target.value })} placeholder="e.g. O+" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Height (cm)</label>
                                        <Input type="number" value={editForm.height} onChange={(e) => setEditForm({ ...editForm, height: e.target.value })} placeholder="170" />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Weight (kg)</label>
                                        <Input type="number" value={editForm.weight} onChange={(e) => setEditForm({ ...editForm, weight: e.target.value })} placeholder="70" />
                                    </div>
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Allergies (comma separated)</label>
                                <Input value={editForm.allergies} onChange={(e) => setEditForm({ ...editForm, allergies: e.target.value })} placeholder="Peanuts, Penicillin..." />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Current Medications (comma separated)</label>
                                <Input value={editForm.medications} onChange={(e) => setEditForm({ ...editForm, medications: e.target.value })} placeholder="Aspirin 50mg..." />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">Medical History (comma separated)</label>
                                <Input value={editForm.medicalHistory} onChange={(e) => setEditForm({ ...editForm, medicalHistory: e.target.value })} placeholder="Asthma, Diabetes..." />
                            </div>
                        </CardContent>
                        <div className="bg-slate-50 p-4 border-t border-slate-100 flex justify-end gap-3 flex-shrink-0">
                            <Button variant="outline" className="font-bold border-slate-200" onClick={() => setEditingPatient(null)}>Cancel</Button>
                            <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md shadow-blue-500/20 px-8" onClick={handleSaveEdit} disabled={updatePatientMutation.isPending}>
                                {updatePatientMutation.isPending ? "Saving..." : <><Save className="w-4 h-4 mr-2" /> Save Profile</>}
                            </Button>
                        </div>
                    </Card>
                </div>
            )}
        </div>
    );
}
