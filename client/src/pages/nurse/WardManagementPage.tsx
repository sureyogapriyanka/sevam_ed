import React, { useState, useMemo } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
    Hospital, Bed, UserPlus, LogOut, Search, AlertCircle,
    CheckCircle2, Building2, Users, Activity, UserCircle,
    MoreVertical, Wrench, ArrowLeftRight, ClipboardList,
    PlusCircle, Settings, X, Clock, Stethoscope, History,
    ChevronRight, AlertTriangle, RefreshCw, Edit, Trash2, Plus, Filter
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Skeleton } from "../../components/ui/skeleton";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import {
    Dialog, DialogContent, DialogHeader, DialogTitle,
    DialogDescription, DialogFooter
} from "../../components/ui/dialog";
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem,
    DropdownMenuSeparator, DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { toast } from "../../hooks/use-toast";
import { apiRequest, queryClient } from "../../lib/queryClient";
import { useAuth } from "../../contexts/AuthContext";
import { cn } from "../../lib/utils";
import { formatDistanceToNow, format } from "date-fns";

// ─── Types ────────────────────────────────────────────────────────────────────
type ModalType = 'assign' | 'discharge' | 'maintenance' | 'transfer' | 'add-ward' | 'discharge-log' | 'add-beds' | 'edit-ward' | null;

// ─── Bed Status Badge ─────────────────────────────────────────────────────────
const statusConfig: Record<string, { label: string; bg: string; text: string; border: string; icon: any }> = {
    occupied: { label: "Occupied", bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200", icon: Users },
    available: { label: "Available", bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", icon: CheckCircle2 },
    maintenance: { label: "Maintenance", bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200", icon: Wrench },
};

export default function WardManagementPage() {
    const { user } = useAuth();
    const [selectedWardId, setSelectedWardId] = useState<string | null>(null);
    const [modal, setModal] = useState<ModalType>(null);
    const [selectedBed, setSelectedBed] = useState<any>(null);
    const [patientSearch, setPatientSearch] = useState("");
    const [bedFilter, setBedFilter] = useState<'all' | 'available' | 'occupied' | 'maintenance'>("all");
    const [activeTab, setActiveTab] = useState<'beds' | 'log'>('beds');
    const isAdmin = user?.role === 'admin';

    // Form states
    const [dischargeForm, setDischargeForm] = useState({ reason: 'recovered', notes: '' });
    const [transferForm, setTransferForm] = useState({ targetWardId: '', targetBedNumber: '' });
    const [wardForm, setWardForm] = useState({ wardName: '', wardCode: '', floor: '1', totalBeds: '10', wardType: 'general', nurseInCharge: '' });
    const [addBedsForm, setAddBedsForm] = useState({ count: '5' });
    const [maintenanceReason, setMaintenanceReason] = useState('Cleaning/Sanitization');
    const [assignNotes, setAssignNotes] = useState({ admissionNotes: '', diagnosis: '' });

    // ─── Data Fetching ────────────────────────────────────────────────────────
    const { data: wards = [], isLoading: loadingWards } = useQuery<any[]>({
        queryKey: ["/api/wards"],
        refetchInterval: 20000
    });
    const { data: patients = [] } = useQuery<any[]>({ queryKey: ["/api/patients"] });

    // ─── Derived State ────────────────────────────────────────────────────────
    const activeWard = useMemo(() => {
        if (selectedWardId) return wards.find(w => w._id === selectedWardId || w.id === selectedWardId);
        return wards[0];
    }, [wards, selectedWardId]);

    const globalStats = useMemo(() => {
        let total = 0, available = 0, occupied = 0, maintenance = 0;
        wards.forEach(w => {
            (w.beds || []).forEach((b: any) => {
                total++;
                if (b.status === 'available') available++;
                else if (b.status === 'occupied') occupied++;
                else if (b.status === 'maintenance') maintenance++;
            });
        });
        return { total, available, occupied, maintenance, occupancyRate: total ? Math.round((occupied / total) * 100) : 0 };
    }, [wards]);

    const filteredBeds = useMemo(() => {
        if (!activeWard?.beds) return [];
        if (bedFilter === 'all') return activeWard.beds;
        return activeWard.beds.filter((b: any) => b.status === bedFilter);
    }, [activeWard, bedFilter]);

    const filteredPatients = useMemo(() => {
        if (!patientSearch) return [];
        return patients.filter((p: any) =>
            p.userId?.name?.toLowerCase().includes(patientSearch.toLowerCase()) ||
            (p.id || p._id || "").toLowerCase().includes(patientSearch.toLowerCase())
        ).slice(0, 6);
    }, [patients, patientSearch]);

    const { data: dischargeLog = [], isLoading: loadingLog } = useQuery<any[]>({
        queryKey: [`/api/wards/${activeWard?._id || activeWard?.id}/discharge-log`],
        enabled: !!activeWard && activeTab === 'log',
    });

    // ─── Mutations ────────────────────────────────────────────────────────────
    const assignMutation = useMutation({
        mutationFn: async ({ patient }: any) => apiRequest("PUT",
            `/api/wards/${activeWard._id || activeWard.id}/bed/${selectedBed.bedNumber}/assign`,
            {
                patientId: patient.id || patient._id,
                patientName: patient.userId?.name || patient.name,
                assignedNurse: user?.id,
                assignedNurseName: user?.name,
                admissionNotes: assignNotes.admissionNotes,
                diagnosisOnAdmission: assignNotes.diagnosis
            }
        ),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/wards"] });
            toast({ title: "✅ Patient Admitted", description: `${selectedBed.bedNumber} is now occupied.` });
            setModal(null);
            setPatientSearch(""); setAssignNotes({ admissionNotes: '', diagnosis: '' });
        },
        onError: () => toast({ title: "Assignment Failed", variant: "destructive" })
    });

    const dischargeMutation = useMutation({
        mutationFn: async () => apiRequest("PUT",
            `/api/wards/${activeWard._id || activeWard.id}/bed/${selectedBed.bedNumber}/discharge`,
            { dischargeNotes: dischargeForm.notes, dischargeReason: dischargeForm.reason }
        ),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/wards"] });
            toast({ title: "✅ Patient Discharged", description: `Bed ${selectedBed.bedNumber} is now free.` });
            setModal(null); setDischargeForm({ reason: 'recovered', notes: '' });
        }
    });

    const maintenanceMutation = useMutation({
        mutationFn: async () => apiRequest("PUT",
            `/api/wards/${activeWard._id || activeWard.id}/bed/${selectedBed.bedNumber}/maintenance`,
            { reason: maintenanceReason }
        ),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/wards"] });
            toast({ title: "✅ Bed Status Updated" });
            setModal(null);
        }
    });

    const transferMutation = useMutation({
        mutationFn: async () => apiRequest("PUT",
            `/api/wards/${activeWard._id || activeWard.id}/bed/${selectedBed.bedNumber}/transfer`,
            { targetWardId: transferForm.targetWardId, targetBedNumber: transferForm.targetBedNumber }
        ),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/wards"] });
            toast({ title: "✅ Patient Transferred Successfully" });
            setModal(null); setTransferForm({ targetWardId: '', targetBedNumber: '' });
        }
    });

    const createWardMutation = useMutation({
        mutationFn: async () => apiRequest("POST", `/api/wards`, {
            ...wardForm, totalBeds: parseInt(wardForm.totalBeds), floor: parseInt(wardForm.floor)
        }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/wards"] });
            toast({ title: "✅ Ward Created" });
            setModal(null); setWardForm({ wardName: '', wardCode: '', floor: '1', totalBeds: '10', wardType: 'general', nurseInCharge: '' });
        }
    });

    const addBedsMutation = useMutation({
        mutationFn: async () => apiRequest("POST", `/api/wards/${activeWard._id || activeWard.id}/beds/add`, { count: parseInt(addBedsForm.count) }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/wards"] });
            toast({ title: `✅ ${addBedsForm.count} beds added` });
            setModal(null);
        }
    });

    // ─── Helpers ─────────────────────────────────────────────────────────────
    const openModal = (type: ModalType, bed?: any) => {
        setSelectedBed(bed || null);
        setModal(type);
    };

    const targetWardBeds = useMemo(() => {
        if (!transferForm.targetWardId) return [];
        const w = wards.find((w: any) => (w._id || w.id) === transferForm.targetWardId);
        return (w?.beds || []).filter((b: any) => b.status === 'available');
    }, [wards, transferForm.targetWardId]);

    // ─── Render ───────────────────────────────────────────────────────────────
    return (
        <div className="space-y-8 pb-16">

            {/* ── HEADER ── */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                        <div className="p-3 bg-blue-600 rounded-2xl shadow-lg shadow-blue-200">
                            <Hospital className="w-7 h-7 text-white" />
                        </div>
                        Ward Management
                    </h1>
                    <p className="text-slate-500 font-medium mt-1">Comprehensive bed, patient, and ward administration.</p>
                </div>
                <div className="flex items-center gap-3">
                    {isAdmin && (
                        <Button
                            className="bg-blue-600 hover:bg-blue-700 font-black rounded-2xl px-6 shadow-lg shadow-blue-100 gap-2"
                            onClick={() => openModal('add-ward')}
                        >
                            <Plus className="w-4 h-4" />
                            New Ward
                        </Button>
                    )}
                    <Button variant="outline" size="icon" className="rounded-xl border-2"
                        onClick={() => queryClient.invalidateQueries({ queryKey: ["/api/wards"] })}>
                        <RefreshCw className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            {/* ── GLOBAL STATS ── */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {[
                    { label: "Total Beds", val: globalStats.total, bg: "bg-slate-900", text: "text-white" },
                    { label: "Available", val: globalStats.available, bg: "bg-emerald-500", text: "text-white" },
                    { label: "Occupied", val: globalStats.occupied, bg: "bg-blue-600", text: "text-white" },
                    { label: "Maintenance", val: globalStats.maintenance, bg: "bg-amber-500", text: "text-white" },
                    { label: "Occupancy Rate", val: `${globalStats.occupancyRate}%`, bg: globalStats.occupancyRate > 85 ? "bg-rose-600" : "bg-indigo-600", text: "text-white" },
                ].map(({ label, val, bg, text }) => (
                    <Card key={label} className={`${bg} border-none shadow-xl rounded-[2rem] overflow-hidden`}>
                        <CardContent className={`p-5 ${text}`}>
                            <p className="text-[10px] font-black uppercase tracking-widest opacity-70 mb-1">{label}</p>
                            <p className="text-3xl font-black tracking-tight">{val}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* ── WARD TABS ── */}
            {loadingWards ? (
                <div className="flex gap-3">{Array(4).fill(0).map((_, i) => <Skeleton key={i} className="h-10 w-28 rounded-full" />)}</div>
            ) : (
                <div className="flex flex-wrap gap-2">
                    {wards.map((ward: any) => {
                        const wId = ward._id || ward.id;
                        const isActive = (activeWard?._id || activeWard?.id) === wId;
                        const bedCount = (ward.beds || []).length;
                        const freeCount = (ward.beds || []).filter((b: any) => b.status === 'available').length;
                        const isFull = freeCount === 0;
                        return (
                            <button key={wId}
                                onClick={() => setSelectedWardId(wId)}
                                className={cn(
                                    "flex items-center gap-3 px-5 py-2.5 rounded-2xl font-black text-sm border-2 transition-all",
                                    isActive
                                        ? "bg-slate-900 text-white border-slate-900 shadow-xl"
                                        : "bg-white text-slate-600 border-slate-100 hover:border-slate-300 hover:bg-slate-50"
                                )}
                            >
                                <Building2 className="w-4 h-4" />
                                {ward.wardName}
                                <span className={cn(
                                    "text-[10px] font-black px-2 py-0.5 rounded-full",
                                    isActive ? "bg-white/20 text-white" : isFull ? "bg-rose-100 text-rose-600" : "bg-emerald-100 text-emerald-700"
                                )}>
                                    {freeCount}/{bedCount}
                                </span>
                            </button>
                        );
                    })}
                </div>
            )}

            {/* ── ACTIVE WARD ── */}
            {activeWard ? (
                <div className="space-y-6">
                    {/* Ward Banner */}
                    <div className={cn(
                        "rounded-[2rem] p-6 border-2 flex flex-col md:flex-row md:items-center justify-between gap-6",
                        activeWard.availableBeds === 0 ? "bg-rose-50 border-rose-100" : "bg-white border-slate-100 shadow-lg"
                    )}>
                        <div className="flex items-center gap-5">
                            <div className={cn(
                                "w-14 h-14 rounded-2xl flex items-center justify-center shadow-md",
                                activeWard.availableBeds === 0 ? "bg-rose-100 text-rose-600" : "bg-blue-100 text-blue-600"
                            )}>
                                <Building2 size={28} />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black text-slate-900">{activeWard.wardName}</h2>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                                    {activeWard.wardCode} · Floor {activeWard.floor || '1'}
                                    {activeWard.wardType && ` · ${activeWard.wardType?.toUpperCase()}`}
                                    {activeWard.nurseInCharge && ` · IC: ${activeWard.nurseInCharge}`}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-6">
                            <div className="text-center">
                                <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Status</p>
                                <Badge className={activeWard.availableBeds === 0 ? "bg-rose-100 text-rose-700 border-none font-black" : "bg-emerald-100 text-emerald-700 border-none font-black"}>
                                    {activeWard.availableBeds === 0 ? '🔴 WARD FULL' : '🟢 OPEN'}
                                </Badge>
                            </div>
                            <div className="text-center border-l pl-6 border-slate-200">
                                <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Occupancy</p>
                                <p className="text-xl font-black text-slate-900">
                                    {activeWard.beds ? Math.round(((activeWard.beds.filter((b: any) => b.status === 'occupied').length) / activeWard.beds.length) * 100) : 0}%
                                </p>
                            </div>
                            <div className="flex gap-2 border-l pl-6 border-slate-200">
                                {isAdmin && (
                                    <>
                                        <Button variant="outline" size="sm" className="rounded-xl font-bold gap-1 text-xs"
                                            onClick={() => openModal('add-beds')}>
                                            <Plus className="w-3 h-3" /> Add Beds
                                        </Button>
                                    </>
                                )}
                                <Button variant="outline" size="sm" className="rounded-xl font-bold gap-1 text-xs text-indigo-600 border-indigo-100 hover:bg-indigo-50"
                                    onClick={() => { setActiveTab('log'); }}>
                                    <History className="w-3 h-3" /> Discharge Log
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Tabs: Beds / Log */}
                    <div className="flex gap-2 bg-slate-100 p-1.5 rounded-2xl w-fit">
                        {(['beds', 'log'] as const).map(tab => (
                            <button key={tab} onClick={() => setActiveTab(tab)}
                                className={cn(
                                    "px-6 py-2 rounded-xl text-sm font-black uppercase tracking-widest transition-all",
                                    activeTab === tab ? "bg-white text-slate-900 shadow-md" : "text-slate-400 hover:text-slate-600"
                                )}>
                                {tab === 'beds' ? 'Bed Grid' : 'Discharge Log'}
                            </button>
                        ))}
                    </div>

                    {activeTab === 'beds' && (
                        <>
                            {/* Bed Filter Row */}
                            <div className="flex items-center gap-3">
                                <Filter className="w-4 h-4 text-slate-400" />
                                {(['all', 'available', 'occupied', 'maintenance'] as const).map(f => (
                                    <button key={f} onClick={() => setBedFilter(f)}
                                        className={cn(
                                            "px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider transition-all border-2",
                                            bedFilter === f
                                                ? "bg-slate-900 text-white border-slate-900"
                                                : "bg-white text-slate-500 border-slate-100 hover:border-slate-300"
                                        )}>
                                        {f} {f !== 'all' && `(${(activeWard.beds || []).filter((b: any) => b.status === f).length})`}
                                    </button>
                                ))}
                            </div>

                            {/* Bed Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                                {filteredBeds.map((bed: any) => {
                                    const cfg = statusConfig[bed.status] || statusConfig.available;
                                    const Icon = cfg.icon;
                                    return (
                                        <Card key={bed.bedNumber}
                                            className={cn(
                                                "group border-2 overflow-hidden transition-all duration-300 hover:shadow-xl rounded-[2rem]",
                                                cfg.border,
                                                bed.status === 'maintenance' ? 'opacity-80' : ''
                                            )}>
                                            <CardContent className="p-5 space-y-4">
                                                {/* Bed Header */}
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <div className={cn("p-2.5 rounded-xl", cfg.bg)}>
                                                            <Bed className={cn("w-5 h-5", cfg.text)} />
                                                        </div>
                                                        <div>
                                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Bed</p>
                                                            <p className="text-lg font-black text-slate-900">{bed.bedNumber}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <Badge className={cn("text-[9px] font-black border-none", cfg.bg, cfg.text)}>
                                                            {cfg.label.toUpperCase()}
                                                        </Badge>
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-400 rounded-lg">
                                                                    <MoreVertical size={14} />
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end" className="w-44 font-bold text-xs p-1 rounded-2xl shadow-2xl border-2 border-slate-50">
                                                                {bed.status === 'available' && (
                                                                    <DropdownMenuItem className="rounded-xl text-blue-600 hover:bg-blue-50"
                                                                        onClick={() => openModal('assign', bed)}>
                                                                        <UserPlus className="w-3.5 h-3.5 mr-2" /> Assign Patient
                                                                    </DropdownMenuItem>
                                                                )}
                                                                {bed.status === 'occupied' && (
                                                                    <>
                                                                        <DropdownMenuItem className="rounded-xl text-rose-600 hover:bg-rose-50"
                                                                            onClick={() => openModal('discharge', bed)}>
                                                                            <LogOut className="w-3.5 h-3.5 mr-2" /> Discharge Patient
                                                                        </DropdownMenuItem>
                                                                        <DropdownMenuItem className="rounded-xl text-indigo-600 hover:bg-indigo-50"
                                                                            onClick={() => openModal('transfer', bed)}>
                                                                            <ArrowLeftRight className="w-3.5 h-3.5 mr-2" /> Transfer Patient
                                                                        </DropdownMenuItem>
                                                                    </>
                                                                )}
                                                                <DropdownMenuSeparator />
                                                                <DropdownMenuItem
                                                                    disabled={bed.status === 'occupied'}
                                                                    className="rounded-xl text-amber-600 hover:bg-amber-50"
                                                                    onClick={() => openModal('maintenance', bed)}>
                                                                    <Wrench className="w-3.5 h-3.5 mr-2" />
                                                                    {bed.status === 'maintenance' ? 'Clear Maintenance' : 'Set Maintenance'}
                                                                </DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </div>
                                                </div>

                                                {/* Bed Body */}
                                                <div className="min-h-[80px]">
                                                    {bed.status === 'occupied' ? (
                                                        <div className="space-y-2">
                                                            <p className="text-base font-black text-slate-900">{bed.patientName}</p>
                                                            {bed.diagnosisOnAdmission && (
                                                                <p className="text-[11px] text-slate-500 font-bold flex items-center gap-1">
                                                                    <Stethoscope className="w-3 h-3" />{bed.diagnosisOnAdmission}
                                                                </p>
                                                            )}
                                                            <p className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                                                                <Clock className="w-3 h-3" />
                                                                {bed.admittedAt ? `${formatDistanceToNow(new Date(bed.admittedAt))} ago` : 'Just admitted'}
                                                            </p>
                                                            {bed.admissionNotes && (
                                                                <p className="text-[10px] text-slate-400 italic truncate">{bed.admissionNotes}</p>
                                                            )}
                                                        </div>
                                                    ) : bed.status === 'maintenance' ? (
                                                        <div className="space-y-1">
                                                            <p className="text-sm font-black text-amber-700">Under Maintenance</p>
                                                            <p className="text-[11px] text-amber-600">{bed.maintenanceReason || 'Cleaning/Sanitization'}</p>
                                                        </div>
                                                    ) : (
                                                        <div className="flex flex-col items-center justify-center h-full py-3 space-y-1 opacity-60 group-hover:opacity-100 transition-opacity">
                                                            <CheckCircle2 className="text-emerald-500 w-8 h-8" />
                                                            <p className="text-[11px] font-black text-emerald-600 uppercase tracking-widest">Available</p>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Footer */}
                                                {bed.status === 'occupied' ? (
                                                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                                                        <div className="flex items-center gap-2">
                                                            <UserCircle className="w-3.5 h-3.5 text-slate-300" />
                                                            <span className="text-[10px] font-bold text-slate-400">{bed.assignedNurseName || 'Unassigned'}</span>
                                                        </div>
                                                        <Button size="sm" variant="ghost" className="h-6 text-[10px] font-black text-rose-500 hover:bg-rose-50 px-2 rounded-lg"
                                                            onClick={() => openModal('discharge', bed)}>
                                                            Discharge
                                                        </Button>
                                                    </div>
                                                ) : bed.status === 'available' ? (
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="w-full h-9 text-xs font-black border-2 border-emerald-100 text-emerald-600 hover:bg-emerald-600 hover:text-white hover:border-emerald-600 rounded-xl transition-all"
                                                        onClick={() => openModal('assign', bed)}
                                                    >
                                                        <UserPlus size={13} className="mr-1.5" />
                                                        ADMIT PATIENT
                                                    </Button>
                                                ) : null}
                                            </CardContent>
                                        </Card>
                                    );
                                })}
                            </div>
                        </>
                    )}

                    {activeTab === 'log' && (
                        <Card className="border-2 border-slate-50 shadow-xl rounded-[2.5rem] overflow-hidden">
                            <div className="bg-slate-50/50 px-8 py-5 border-b border-slate-100 flex items-center justify-between">
                                <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                    <History className="w-4 h-4" /> Discharge History — {activeWard.wardName}
                                </h2>
                                <Badge className="bg-slate-100 text-slate-600 font-black border-none">
                                    {dischargeLog.length} records
                                </Badge>
                            </div>
                            <CardContent className="p-0">
                                {loadingLog ? (
                                    <div className="p-8 space-y-3">{Array(5).fill(0).map((_, i) => <Skeleton key={i} className="h-14 w-full rounded-xl" />)}</div>
                                ) : dischargeLog.length === 0 ? (
                                    <div className="text-center py-16 text-slate-400">
                                        <ClipboardList className="h-12 w-12 mx-auto mb-3 opacity-20" />
                                        <p className="font-bold">No discharge records yet.</p>
                                    </div>
                                ) : (
                                    <div className="divide-y divide-slate-50">
                                        {dischargeLog.map((record: any, i: number) => (
                                            <div key={i} className="px-8 py-4 flex items-center justify-between hover:bg-slate-50/50">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-600 font-black text-lg">
                                                        {(record.patientName || 'P').charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className="font-black text-slate-900">{record.patientName}</p>
                                                        <p className="text-[10px] font-bold text-slate-400">
                                                            Bed {record.bedNumber} · Admitted {record.admittedAt ? format(new Date(record.admittedAt), 'dd MMM yyyy') : '—'}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <Badge className={cn(
                                                        "text-[9px] font-black border-none mb-1",
                                                        record.dischargeReason === 'recovered' ? "bg-emerald-100 text-emerald-700" :
                                                            record.dischargeReason === 'transferred' ? "bg-blue-100 text-blue-700" :
                                                                "bg-slate-100 text-slate-600"
                                                    )}>
                                                        {record.dischargeReason?.toUpperCase() || 'DISCHARGED'}
                                                    </Badge>
                                                    <p className="text-[10px] font-bold text-slate-400">
                                                        {record.dischargedAt ? format(new Date(record.dischargedAt), 'dd MMM yyyy HH:mm') : '—'}
                                                    </p>
                                                    {record.dischargeNotes && (
                                                        <p className="text-[10px] text-slate-400 italic truncate max-w-[200px]">{record.dischargeNotes}</p>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )}
                </div>
            ) : loadingWards ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {Array(8).fill(0).map((_, i) => <Skeleton key={i} className="h-52 rounded-[2rem]" />)}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-24 text-center gap-4">
                    <div className="w-20 h-20 bg-slate-100 rounded-3xl flex items-center justify-center">
                        <Hospital className="w-10 h-10 text-slate-300" />
                    </div>
                    <p className="text-slate-500 font-bold">No wards found. Create one to get started.</p>
                    {isAdmin && (
                        <Button className="bg-blue-600 font-black rounded-2xl" onClick={() => openModal('add-ward')}>
                            <Plus className="w-4 h-4 mr-2" /> Create First Ward
                        </Button>
                    )}
                </div>
            )}

            {/* ════════════════════════════════════════════ MODALS ════════════════════════════════════════════ */}

            {/* ASSIGN PATIENT */}
            <Dialog open={modal === 'assign'} onOpenChange={o => !o && setModal(null)}>
                <DialogContent className="max-w-lg rounded-[2.5rem] border-2 border-slate-50 p-0 overflow-hidden">
                    <DialogHeader className="bg-blue-600 p-8 text-white">
                        <DialogTitle className="text-2xl font-black flex items-center gap-3">
                            <UserPlus className="w-6 h-6" />
                            Admit to Bed {selectedBed?.bedNumber}
                        </DialogTitle>
                        <DialogDescription className="text-blue-100 font-medium">
                            Search for a patient and provide admission details.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="p-8 space-y-6">
                        <div className="space-y-2 relative">
                            <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Search Patient</Label>
                            <div className="relative">
                                <Search className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
                                <Input
                                    placeholder="Name or Patient ID..."
                                    value={patientSearch}
                                    onChange={e => setPatientSearch(e.target.value)}
                                    className="pl-10 h-12 bg-slate-50 border-2 rounded-2xl font-bold"
                                />
                            </div>
                            {filteredPatients.length > 0 && (
                                <div className="absolute z-50 left-0 right-0 mt-1 bg-white border-2 border-slate-100 rounded-2xl shadow-2xl overflow-hidden">
                                    {filteredPatients.map((p: any) => (
                                        <button key={p.id || p._id}
                                            className="w-full text-left p-4 hover:bg-blue-50 transition-colors flex items-center gap-3"
                                            onClick={() => { assignMutation.mutate({ patient: p }); }}>
                                            <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-black">
                                                {(p.userId?.name || p.name || 'P').charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-black text-slate-900">{p.userId?.name || p.name}</p>
                                                <p className="text-[10px] font-bold text-slate-400">
                                                    #{(p.id || p._id || '').slice(-6).toUpperCase()} · {p.userId?.age || p.age}y · {p.userId?.gender || p.gender}
                                                </p>
                                            </div>
                                            <Badge variant="outline" className="ml-auto text-[10px] font-bold">Admit</Badge>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Diagnosis on Admission</Label>
                            <Input
                                placeholder="e.g. Acute Appendicitis..."
                                value={assignNotes.diagnosis}
                                onChange={e => setAssignNotes(p => ({ ...p, diagnosis: e.target.value }))}
                                className="h-12 bg-slate-50 border-2 rounded-2xl font-bold"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Clinical Notes</Label>
                            <Textarea
                                placeholder="Any specific observations or instructions..."
                                value={assignNotes.admissionNotes}
                                onChange={e => setAssignNotes(p => ({ ...p, admissionNotes: e.target.value }))}
                                className="bg-slate-50 border-2 rounded-2xl font-medium resize-none"
                                rows={3}
                            />
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* DISCHARGE */}
            <Dialog open={modal === 'discharge'} onOpenChange={o => !o && setModal(null)}>
                <DialogContent className="max-w-md rounded-[2.5rem] border-2 border-slate-50 p-0 overflow-hidden">
                    <DialogHeader className="bg-rose-600 p-8 text-white">
                        <DialogTitle className="text-2xl font-black flex items-center gap-3">
                            <LogOut className="w-6 h-6" />
                            Discharge Patient
                        </DialogTitle>
                        <DialogDescription className="text-rose-100 font-medium">
                            {selectedBed?.patientName} · {selectedBed?.bedNumber}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="p-8 space-y-6">
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Discharge Reason</Label>
                            <Select value={dischargeForm.reason} onValueChange={v => setDischargeForm(p => ({ ...p, reason: v }))}>
                                <SelectTrigger className="h-12 border-2 bg-slate-50 rounded-2xl font-bold">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="rounded-2xl">
                                    {['recovered', 'transferred', 'absconded', 'referred', 'deceased', 'other'].map(r => (
                                        <SelectItem key={r} value={r} className="font-bold capitalize">{r.charAt(0).toUpperCase() + r.slice(1)}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Discharge Notes</Label>
                            <Textarea
                                placeholder="Summary on patient's discharge condition..."
                                value={dischargeForm.notes}
                                onChange={e => setDischargeForm(p => ({ ...p, notes: e.target.value }))}
                                className="bg-slate-50 border-2 rounded-2xl font-medium resize-none"
                                rows={3}
                            />
                        </div>
                        <DialogFooter className="gap-3">
                            <Button variant="outline" onClick={() => setModal(null)} className="font-bold rounded-2xl">Cancel</Button>
                            <Button className="bg-rose-600 hover:bg-rose-700 font-black rounded-2xl shadow-lg shadow-rose-100"
                                onClick={() => dischargeMutation.mutate()} disabled={dischargeMutation.isPending}>
                                {dischargeMutation.isPending ? "Processing..." : "Confirm Discharge"}
                            </Button>
                        </DialogFooter>
                    </div>
                </DialogContent>
            </Dialog>

            {/* TRANSFER */}
            <Dialog open={modal === 'transfer'} onOpenChange={o => !o && setModal(null)}>
                <DialogContent className="max-w-md rounded-[2.5rem] border-2 border-slate-50 p-0 overflow-hidden">
                    <DialogHeader className="bg-indigo-600 p-8 text-white">
                        <DialogTitle className="text-2xl font-black flex items-center gap-3">
                            <ArrowLeftRight className="w-6 h-6" />
                            Transfer Patient
                        </DialogTitle>
                        <DialogDescription className="text-indigo-100 font-medium">
                            Move {selectedBed?.patientName} to another ward/bed.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="p-8 space-y-6">
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Target Ward</Label>
                            <Select value={transferForm.targetWardId} onValueChange={v => setTransferForm(p => ({ ...p, targetWardId: v, targetBedNumber: '' }))}>
                                <SelectTrigger className="h-12 border-2 bg-slate-50 rounded-2xl font-bold">
                                    <SelectValue placeholder="Select ward..." />
                                </SelectTrigger>
                                <SelectContent className="rounded-2xl">
                                    {wards.filter((w: any) => (w._id || w.id) !== (activeWard?._id || activeWard?.id)).map((w: any) => (
                                        <SelectItem key={w._id || w.id} value={w._id || w.id} className="font-bold">{w.wardName}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        {transferForm.targetWardId && (
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Target Bed</Label>
                                <Select value={transferForm.targetBedNumber} onValueChange={v => setTransferForm(p => ({ ...p, targetBedNumber: v }))}>
                                    <SelectTrigger className="h-12 border-2 bg-slate-50 rounded-2xl font-bold">
                                        <SelectValue placeholder="Select available bed..." />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-2xl">
                                        {targetWardBeds.map((b: any) => (
                                            <SelectItem key={b.bedNumber} value={b.bedNumber} className="font-bold">{b.bedNumber} — Available</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        )}
                        <DialogFooter className="gap-3">
                            <Button variant="outline" onClick={() => setModal(null)} className="font-bold rounded-2xl">Cancel</Button>
                            <Button className="bg-indigo-600 hover:bg-indigo-700 font-black rounded-2xl"
                                onClick={() => transferMutation.mutate()}
                                disabled={!transferForm.targetWardId || !transferForm.targetBedNumber || transferMutation.isPending}>
                                {transferMutation.isPending ? "Transferring..." : "Confirm Transfer"}
                            </Button>
                        </DialogFooter>
                    </div>
                </DialogContent>
            </Dialog>

            {/* MAINTENANCE */}
            <Dialog open={modal === 'maintenance'} onOpenChange={o => !o && setModal(null)}>
                <DialogContent className="max-w-sm rounded-[2.5rem] border-2 border-slate-50 p-0 overflow-hidden">
                    <DialogHeader className="bg-amber-500 p-8 text-white">
                        <DialogTitle className="text-2xl font-black flex items-center gap-3">
                            <Wrench className="w-6 h-6" />
                            {selectedBed?.status === 'maintenance' ? 'Clear Maintenance' : 'Set Maintenance'}
                        </DialogTitle>
                        <DialogDescription className="text-amber-100 font-medium">Bed {selectedBed?.bedNumber}</DialogDescription>
                    </DialogHeader>
                    <div className="p-8 space-y-6">
                        {selectedBed?.status !== 'maintenance' && (
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Reason</Label>
                                <Select value={maintenanceReason} onValueChange={setMaintenanceReason}>
                                    <SelectTrigger className="h-12 border-2 bg-slate-50 rounded-2xl font-bold">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-2xl">
                                        {['Cleaning/Sanitization', 'Equipment Repair', 'Mattress Replacement', 'Deep Cleaning', 'Inspection', 'Other'].map(r => (
                                            <SelectItem key={r} value={r} className="font-bold">{r}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        )}
                        <DialogFooter className="gap-3">
                            <Button variant="outline" onClick={() => setModal(null)} className="font-bold rounded-2xl">Cancel</Button>
                            <Button className="bg-amber-500 hover:bg-amber-600 font-black rounded-2xl"
                                onClick={() => maintenanceMutation.mutate()} disabled={maintenanceMutation.isPending}>
                                {maintenanceMutation.isPending ? "Updating..." : selectedBed?.status === 'maintenance' ? "Mark Available" : "Set Maintenance"}
                            </Button>
                        </DialogFooter>
                    </div>
                </DialogContent>
            </Dialog>

            {/* CREATE WARD */}
            <Dialog open={modal === 'add-ward'} onOpenChange={o => !o && setModal(null)}>
                <DialogContent className="max-w-lg rounded-[2.5rem] border-2 border-slate-50 p-0 overflow-hidden">
                    <DialogHeader className="bg-slate-900 p-8 text-white">
                        <DialogTitle className="text-2xl font-black flex items-center gap-3">
                            <Building2 className="w-6 h-6" />
                            Create New Ward
                        </DialogTitle>
                        <DialogDescription className="text-slate-400 font-medium">Add a new ward to the hospital system.</DialogDescription>
                    </DialogHeader>
                    <div className="p-8 space-y-5">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Ward Name</Label>
                                <Input value={wardForm.wardName} onChange={e => setWardForm(p => ({ ...p, wardName: e.target.value }))}
                                    placeholder="e.g. General Medicine" className="h-12 bg-slate-50 border-2 rounded-2xl font-bold" />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Ward Code</Label>
                                <Input value={wardForm.wardCode} onChange={e => setWardForm(p => ({ ...p, wardCode: e.target.value.toUpperCase() }))}
                                    placeholder="e.g. GM" className="h-12 bg-slate-50 border-2 rounded-2xl font-black uppercase" />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Floor</Label>
                                <Input type="number" value={wardForm.floor} onChange={e => setWardForm(p => ({ ...p, floor: e.target.value }))}
                                    className="h-12 bg-slate-50 border-2 rounded-2xl font-bold" />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Beds</Label>
                                <Input type="number" value={wardForm.totalBeds} onChange={e => setWardForm(p => ({ ...p, totalBeds: e.target.value }))}
                                    className="h-12 bg-slate-50 border-2 rounded-2xl font-bold" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Ward Type</Label>
                            <Select value={wardForm.wardType} onValueChange={v => setWardForm(p => ({ ...p, wardType: v }))}>
                                <SelectTrigger className="h-12 border-2 bg-slate-50 rounded-2xl font-bold">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="rounded-2xl">
                                    {['general', 'icu', 'pediatric', 'maternity', 'surgical', 'orthopedic', 'cardiology', 'neurology', 'oncology', 'isolation'].map(t => (
                                        <SelectItem key={t} value={t} className="font-bold capitalize">{t.charAt(0).toUpperCase() + t.slice(1)}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nurse In Charge</Label>
                            <Input value={wardForm.nurseInCharge} onChange={e => setWardForm(p => ({ ...p, nurseInCharge: e.target.value }))}
                                placeholder="Nurse's name" className="h-12 bg-slate-50 border-2 rounded-2xl font-bold" />
                        </div>
                        <DialogFooter className="gap-3">
                            <Button variant="outline" onClick={() => setModal(null)} className="font-bold rounded-2xl">Cancel</Button>
                            <Button className="bg-slate-900 hover:bg-slate-800 font-black rounded-2xl shadow-xl shadow-slate-200"
                                onClick={() => createWardMutation.mutate()}
                                disabled={!wardForm.wardName || !wardForm.wardCode || createWardMutation.isPending}>
                                {createWardMutation.isPending ? "Creating..." : "Create Ward"}
                            </Button>
                        </DialogFooter>
                    </div>
                </DialogContent>
            </Dialog>

            {/* ADD BEDS */}
            <Dialog open={modal === 'add-beds'} onOpenChange={o => !o && setModal(null)}>
                <DialogContent className="max-w-sm rounded-[2.5rem] border-2 border-slate-50 p-0 overflow-hidden">
                    <DialogHeader className="bg-emerald-600 p-8 text-white">
                        <DialogTitle className="text-2xl font-black flex items-center gap-3">
                            <Plus className="w-6 h-6" />
                            Add Beds to {activeWard?.wardName}
                        </DialogTitle>
                    </DialogHeader>
                    <div className="p-8 space-y-6">
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Number of Beds to Add</Label>
                            <Input type="number" value={addBedsForm.count} min="1" max="50"
                                onChange={e => setAddBedsForm({ count: e.target.value })}
                                className="h-12 bg-slate-50 border-2 rounded-2xl font-black text-2xl text-center" />
                        </div>
                        <DialogFooter className="gap-3">
                            <Button variant="outline" onClick={() => setModal(null)} className="font-bold rounded-2xl">Cancel</Button>
                            <Button className="bg-emerald-600 hover:bg-emerald-700 font-black rounded-2xl"
                                onClick={() => addBedsMutation.mutate()} disabled={addBedsMutation.isPending}>
                                {addBedsMutation.isPending ? "Adding..." : `Add ${addBedsForm.count} Beds`}
                            </Button>
                        </DialogFooter>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
