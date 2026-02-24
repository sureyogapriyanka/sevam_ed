import React, { useState, useMemo } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
    Hospital,
    Bed,
    UserPlus,
    LogOut,
    Search,
    AlertCircle,
    CheckCircle2,
    Building2,
    Users,
    Activity,
    UserCircle,
    Info,
    MoreVertical
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Skeleton } from "../../components/ui/skeleton";
import { Label } from "../../components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from "../../components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import { toast } from "../../hooks/use-toast";
import { apiRequest, queryClient } from "../../lib/queryClient";
import { useAuth } from "../../contexts/AuthContext";

export default function WardManagementPage() {
    const { user } = useAuth();
    const [selectedWardId, setSelectedWardId] = useState<string | null>(null);
    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
    const [isDischargeModalOpen, setIsDischargeModalOpen] = useState(false);
    const [selectedBed, setSelectedBed] = useState<any>(null);
    const [patientSearch, setPatientSearch] = useState("");

    // Fetch All Wards
    const { data: wards = [], isLoading: loadingWards } = useQuery<any[]>({
        queryKey: ["/api/wards"],
    });

    // Fetch Patients for assignment
    const { data: patients = [] } = useQuery<any[]>({
        queryKey: ["/api/patients"],
    });

    const activeWard = useMemo(() => {
        if (selectedWardId) return wards.find(w => w.id === selectedWardId);
        return wards[0];
    }, [wards, selectedWardId]);

    const filteredPatients = useMemo(() => {
        if (!patientSearch) return [];
        return patients.filter(p =>
            p.userId?.name.toLowerCase().includes(patientSearch.toLowerCase()) ||
            p.id.toLowerCase().includes(patientSearch.toLowerCase())
        ).slice(0, 5);
    }, [patients, patientSearch]);

    // MUTATIONS
    const assignMutation = useMutation({
        mutationFn: async (data: any) => apiRequest("PUT", `/api/wards/${activeWard.id}/bed/${selectedBed.bedNumber}/assign`, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/wards"] });
            toast({ title: "Patient Assigned", description: `Assigned to Bed ${selectedBed.bedNumber}` });
            setIsAssignModalOpen(false);
            setPatientSearch("");
        }
    });

    const dischargeMutation = useMutation({
        mutationFn: async () => apiRequest("PUT", `/api/wards/${activeWard.id}/bed/${selectedBed.bedNumber}/discharge`, {}),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/wards"] });
            toast({ title: "Bed Cleared", description: `Discharged patient from ${selectedBed.bedNumber}` });
            setIsDischargeModalOpen(false);
        }
    });

    const bedStats = useMemo(() => {
        let total = 0, available = 0, occupied = 0;
        wards.forEach(w => {
            total += w.totalBeds;
            available += w.availableBeds;
            occupied += (w.totalBeds - w.availableBeds);
        });
        return { total, available, occupied };
    }, [wards]);

    return (
        <div className="space-y-8 pb-10">
            {/* HEADER */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                        <Hospital className="w-8 h-8 text-blue-600" />
                        Ward & Bed Management
                    </h1>
                    <p className="text-slate-500 font-medium">Real-time room occupancy and patient placement tracking.</p>
                </div>

                <div className="grid grid-cols-3 gap-4">
                    <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm text-center">
                        <p className="text-[9px] font-black text-slate-400 uppercase">Total Beds</p>
                        <p className="text-lg font-black text-slate-900">{bedStats.total}</p>
                    </div>
                    <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-100 text-center">
                        <p className="text-[9px] font-black text-emerald-600 uppercase">Available</p>
                        <p className="text-lg font-black text-emerald-700">{bedStats.available}</p>
                    </div>
                    <div className="bg-blue-50 p-3 rounded-xl border border-blue-100 text-center">
                        <p className="text-[9px] font-black text-blue-600 uppercase">Occupied</p>
                        <p className="text-lg font-black text-blue-700">{bedStats.occupied}</p>
                    </div>
                </div>
            </div>

            {/* WARD NAVIGATION */}
            <div className="flex flex-wrap gap-2">
                {wards.map((ward) => (
                    <Button
                        key={ward.id}
                        variant={activeWard?.id === ward.id ? "default" : "outline"}
                        className={`font-bold h-10 px-6 rounded-xl transition-all ${activeWard?.id === ward.id ? 'bg-blue-600 shadow-lg shadow-blue-200' : 'bg-white hover:bg-slate-50'}`}
                        onClick={() => setSelectedWardId(ward.id)}
                    >
                        {ward.wardName}
                        <Badge variant="outline" className={`ml-3 border-none text-[10px] ${activeWard?.id === ward.id ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'}`}>
                            {ward.availableBeds} Free
                        </Badge>
                    </Button>
                ))}
            </div>

            {activeWard ? (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {/* WARD INFO STRIP */}
                    <div className={`p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 border ${activeWard.availableBeds < 3 ? 'bg-rose-50 border-rose-100' : 'bg-white border-slate-100'}`}>
                        <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${activeWard.availableBeds < 3 ? 'bg-rose-100 text-rose-600' : 'bg-blue-100 text-blue-600'}`}>
                                <Building2 size={24} />
                            </div>
                            <div>
                                <h2 className="text-xl font-black text-slate-900 leading-none mb-1">{activeWard.wardName}</h2>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{activeWard.wardCode} · FLOOR {activeWard.floor || '1'}</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="text-right">
                                <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Status</p>
                                <Badge className={activeWard.availableBeds === 0 ? 'bg-rose-100 text-rose-600 border-none' : 'bg-emerald-100 text-emerald-600 border-none'}>
                                    {activeWard.availableBeds === 0 ? 'WARD FULL' : 'ADMISSIONS OPEN'}
                                </Badge>
                            </div>
                            <div className="text-right border-l border-slate-200 pl-4">
                                <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Occupancy</p>
                                <p className="text-sm font-black text-slate-900">{Math.round(((activeWard.totalBeds - activeWard.availableBeds) / activeWard.totalBeds) * 100)}% Used</p>
                            </div>
                        </div>
                    </div>

                    {/* BED GRID */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                        {activeWard.beds.map((bed: any) => (
                            <Card
                                key={bed.bedNumber}
                                className={`group overflow-hidden border-2 transition-all duration-300 hover:shadow-xl ${bed.status === 'occupied'
                                    ? 'border-blue-50 bg-white hover:border-blue-200'
                                    : bed.status === 'maintenance'
                                        ? 'border-slate-50 bg-slate-50 opacity-70'
                                        : 'border-emerald-50 bg-emerald-50/20 hover:border-emerald-200'
                                    }`}
                            >
                                <CardContent className="p-5 flex flex-col h-full space-y-4">
                                    <div className="flex justify-between items-start">
                                        <div className={`p-2 rounded-lg ${bed.status === 'occupied' ? 'bg-blue-100 text-blue-600' : 'bg-emerald-100 text-emerald-600'}`}>
                                            <Bed size={20} />
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Badge variant="outline" className={`text-[9px] font-black tracking-widest ${bed.status === 'occupied' ? 'bg-blue-600 text-white border-none' : 'bg-white border-emerald-200 text-emerald-600'
                                                }`}>
                                                {bed.bedNumber}
                                            </Badge>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-6 w-6 text-slate-400">
                                                        <MoreVertical size={14} />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-40 font-bold text-xs p-1">
                                                    <DropdownMenuItem className="text-rose-600" onClick={() => { setSelectedBed(bed); setIsDischargeModalOpen(true); }} disabled={bed.status === 'available'}>
                                                        <LogOut className="w-3.5 h-3.5 mr-2" /> Discharge
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem>
                                                        <Info className="w-3.5 h-3.5 mr-2" /> Maintenance
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </div>

                                    <div className="flex-1 space-y-1">
                                        {bed.status === 'occupied' ? (
                                            <>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Patient</p>
                                                <p className="text-sm font-black text-slate-900 group-hover:text-blue-600 transition-colors uppercase">{bed.patientName}</p>
                                                <p className="text-[10px] font-medium text-slate-500">Admitted: {new Date(bed.admittedAt).toLocaleDateString()}</p>
                                            </>
                                        ) : (
                                            <div className="flex flex-col items-center justify-center py-4 space-y-2 opacity-50 group-hover:opacity-100 transition-opacity">
                                                <CheckCircle2 className="text-emerald-500 w-8 h-8" />
                                                <p className="text-[11px] font-black text-emerald-600 tracking-widest uppercase">Available</p>
                                            </div>
                                        )}
                                    </div>

                                    <div className="pt-3 border-t border-slate-50 flex items-center justify-between">
                                        {bed.status === 'occupied' ? (
                                            <div className="flex items-center gap-2">
                                                <UserCircle className="w-3.5 h-3.5 text-slate-300" />
                                                <span className="text-[10px] font-bold text-slate-400">{bed.assignedNurseName || 'Unassigned'}</span>
                                            </div>
                                        ) : (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="w-full h-8 text-xs font-black border-emerald-200 text-emerald-600 hover:bg-emerald-600 hover:text-white hover:border-emerald-600 group-hover:shadow-lg transition-all"
                                                onClick={() => { setSelectedBed(bed); setIsAssignModalOpen(true); }}
                                            >
                                                <UserPlus size={14} className="mr-2" />
                                                ASSIGN PATIENT
                                            </Button>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                    <Skeleton className="h-64 w-full rounded-2xl" />
                </div>
            )}

            {/* ASSIGN PATIENT MODAL */}
            <Dialog open={isAssignModalOpen} onOpenChange={setIsAssignModalOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-black text-slate-900">Assign Patient to Bed {selectedBed?.bedNumber}</DialogTitle>
                        <DialogDescription>Select a registered patient to assign to this bed slot.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-6 py-4">
                        <div className="relative">
                            <Label className="font-bold text-slate-600 text-xs mb-2 block uppercase tracking-wider">Search Patient</Label>
                            <Input
                                placeholder="Type name or ID..."
                                value={patientSearch}
                                onChange={(e) => setPatientSearch(e.target.value)}
                                className="h-11 pl-10 bg-slate-50 border-slate-200"
                            />
                            <Search className="absolute left-3 top-9 w-4 h-4 text-slate-400" />

                            {filteredPatients.length > 0 && (
                                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-100 rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
                                    {filteredPatients.map(p => (
                                        <button
                                            key={p.id}
                                            className="w-full text-left p-4 hover:bg-blue-50 transition-colors flex items-center justify-between group"
                                            onClick={() => {
                                                assignMutation.mutate({
                                                    patientId: p.id,
                                                    patientName: p.userId?.name,
                                                    assignedNurse: user?.id,
                                                    assignedNurseName: user?.name
                                                });
                                            }}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold group-hover:bg-blue-600 group-hover:text-white transition-all">
                                                    {p.userId?.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-900">{p.userId?.name}</p>
                                                    <p className="text-[10px] font-bold text-slate-400">ID: {p.id.slice(-6).toUpperCase()} · {p.userId?.age}y · {p.userId?.gender}</p>
                                                </div>
                                            </div>
                                            <Badge variant="outline" className="text-[10px] font-bold">Select</Badge>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* DISCHARGE CONFIRMATION MODAL */}
            <Dialog open={isDischargeModalOpen} onOpenChange={setIsDischargeModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <AlertCircle className="w-12 h-12 text-rose-600 mb-4" />
                        <DialogTitle className="text-xl font-black text-slate-900">Confirm Patient Discharge</DialogTitle>
                        <DialogDescription className="text-base text-slate-500 py-2">
                            Are you sure you want to discharge <span className="font-bold text-slate-900">{selectedBed?.patientName}</span> from <span className="font-bold text-slate-900">Bed {selectedBed?.bedNumber}</span>?
                            <br /><br />
                            This will clear the patient information and mark the bed as available.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-3 mt-4">
                        <Button variant="outline" className="font-bold" onClick={() => setIsDischargeModalOpen(false)}>CANCEL</Button>
                        <Button className="bg-rose-600 hover:bg-rose-700 font-bold" onClick={() => dischargeMutation.mutate()} disabled={dischargeMutation.isPending}>
                            {dischargeMutation.isPending ? "PROCESSING..." : "CONFIRM DISCHARGE"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
