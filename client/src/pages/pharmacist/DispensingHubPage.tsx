import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiCall } from "../../utils/api";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Skeleton } from "../../components/ui/skeleton";
import { useToast } from "../../hooks/use-toast";
import {
    Pill, Package, AlertTriangle, Clock,
    Search, ArrowRight, Plus, RefreshCw, ChevronRight,
    Activity, Users, CheckCircle, Stethoscope, History,
    UserMinus, MonitorSmartphone, LayoutDashboard
} from "lucide-react";
import { formatDistanceToNow, isAfter, subMinutes } from 'date-fns';

export default function DispensingHubPage() {
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const { toast } = useToast();
    const [currentTime, setCurrentTime] = useState(new Date());
    const [searchTerm, setSearchTerm] = useState("");
    const [dispensingId, setDispensingId] = useState<string | null>(null);

    // Search State (Unified)
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [isSearching, setIsSearching] = useState(false);

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    // Global Patient Search (triggers when user types in main search bar)
    useEffect(() => {
        if (!searchTerm || searchTerm.length < 3) {
            setSearchResults([]);
            return;
        }
        const delayDebounceFn = setTimeout(async () => {
            setIsSearching(true);
            try {
                const results = await apiCall(`/patients?search=${searchTerm}`);
                setSearchResults(results);
            } catch (err) {
                console.error("Search failed", err);
            } finally {
                setIsSearching(false);
            }
        }, 500);
        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm]);

    // DATA QUERIES
    const { data: prescriptions = [], isLoading: loadingRx } = useQuery<any[]>({
        queryKey: ["/api/flow/today"],
        queryFn: () => apiCall("/flow/today"),
        refetchInterval: 15000,
    });

    // Categorization
    const queue = useMemo(() => prescriptions.filter(p => p.status === 'completed'), [prescriptions]);
    const historyDispensed = useMemo(() => prescriptions.filter(p => p.status === 'dispensed').slice(0, 10), [prescriptions]);
    const dropOffs = useMemo(() => {
        const hourAgo = subMinutes(new Date(), 60);
        return prescriptions.filter(p =>
            (p.status === 'consulted' || p.status === 'billing') &&
            isAfter(hourAgo, new Date(p.updatedAt))
        );
    }, [prescriptions]);

    const filteredQueue = useMemo(() => {
        if (!searchTerm) return queue;
        const q = searchTerm.toLowerCase();
        return queue.filter((p: any) =>
            (p.patientName || '').toLowerCase().includes(q) ||
            (p.tokenNumber || '').toLowerCase().includes(q)
        );
    }, [queue, searchTerm]);

    const handleStartSession = (patientId: string) => {
        navigate(`/pharmacist/dispense/new?patientId=${patientId}`);
    };

    return (
        <div className="pb-10 min-h-screen bg-[#F8FAFC] text-slate-900 space-y-8 p-4 md:p-8">

            {/* TERMINAL HEADER */}
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 border-l-4 border-blue-600 pl-6 py-2">
                <div className="space-y-1">
                    <div className="flex items-center gap-2 text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] mb-1">
                        <MonitorSmartphone size={12} /> Clinical Terminal Active
                    </div>
                    <h2 className="text-2xl font-black text-slate-900 uppercase flex items-center gap-3">
                        Dispensing Operations Hub
                    </h2>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        {currentTime.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })} · {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                </div>
                <div className="flex gap-3 w-full lg:w-auto">
                    <div className="relative group flex-1 lg:flex-none">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                        <Input
                            placeholder="Filter Sessions or Search Patients..."
                            className="h-10 w-full lg:w-96 pl-10 rounded-xl border-2 border-slate-200 bg-white focus:border-blue-500 font-bold text-xs"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* LEFT (8 cols): ACTIVE Fulfillment QUEUE */}
                <div className="lg:col-span-8 space-y-4">
                    <div className="flex items-center justify-between px-1">
                        <div className="space-y-1">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                {searchTerm ? 'Global Search Stream' : 'Live Dispensing Queue'} ({filteredQueue.length})
                            </p>
                            <p className="text-[9px] font-bold text-blue-600 uppercase tracking-tighter">
                                {searchTerm ? 'Displaying local and clinical matches' : 'Awaiting Clinician Response'}
                            </p>
                        </div>
                    </div>

                    <div className="space-y-3">
                        {loadingRx ? (
                            Array(3).fill(0).map((_, i) => <Skeleton key={i} className="h-24 w-full rounded-2xl" />)
                        ) : filteredQueue.length === 0 && searchResults.length === 0 ? (
                            <div className="py-32 text-center bg-white rounded-[2.5rem] border-2 border-dashed border-slate-200 shadow-inner group hover:border-blue-400 hover:bg-blue-50/10 transition-all cursor-pointer">
                                <div className="h-20 w-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-sm">
                                    <Search className="h-10 w-10 text-blue-600" />
                                </div>
                                <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-2">No Active Records</h3>
                                <p className="text-slate-400 font-bold uppercase tracking-widest text-[9px] max-w-[200px] mx-auto leading-relaxed">Use the clinical search bar above to locate a patient or wait for automated intake.</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {/* ACTIVE SESSIONS */}
                                {filteredQueue.map((apt: any) => (
                                    <div key={apt._id} className="bg-white p-6 rounded-2xl shadow-sm border-2 border-slate-50 group hover:border-blue-400 hover:shadow-lg transition-all flex flex-col md:flex-row items-center gap-6 overflow-hidden relative">
                                        <div className="absolute top-0 left-0 h-full w-1.5 bg-blue-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                        <div className="flex items-center gap-6 flex-1 w-full min-w-0">
                                            <div className="h-16 w-16 rounded-xl bg-slate-50 border border-slate-100 overflow-hidden flex items-center justify-center shrink-0">
                                                {apt.patientId?.userId?.profileImage ? (
                                                    <img src={apt.patientId.userId.profileImage} alt={apt.patientName} className="h-full w-full object-cover" />
                                                ) : (
                                                    <div className="h-full w-full bg-blue-50 flex flex-col items-center justify-center pb-1">
                                                        <span className="text-[8px] font-black text-blue-400 uppercase leading-none mb-1">TKN</span>
                                                        <span className="text-xl font-black text-blue-700">{apt.tokenNumber || '—'}</span>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="space-y-1 flex-1 min-w-0">
                                                <div className="flex items-center gap-3">
                                                    <h3 className="font-black text-slate-900 uppercase text-lg truncate tracking-tight">{apt.patientName}</h3>
                                                    <Badge className={`${apt.priority === 'emergency' ? 'bg-rose-50 text-rose-600' : 'bg-blue-50 text-blue-600'} border-none text-[8px] font-black uppercase h-5`}>
                                                        {apt.priority}
                                                    </Badge>
                                                </div>
                                                <div className="flex flex-wrap items-center gap-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                                    <span className="flex items-center gap-1.5 p-1 px-3 rounded-lg bg-slate-50 border border-slate-100"><Stethoscope size={12} className="text-blue-500" /> DR. {apt.doctorId?.name}</span>
                                                    <span className="flex items-center gap-1.5 p-1 px-3 rounded-lg bg-slate-50 border border-slate-100"><Clock size={12} className="text-indigo-500" /> {formatDistanceToNow(new Date(apt.completedAt || apt.updatedAt))}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 w-full md:w-auto shrink-0 border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6">
                                            <Button
                                                className="h-12 flex-1 md:flex-none px-10 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-xl text-[11px] tracking-[0.2em] uppercase gap-3 shadow-lg shadow-blue-100 transition-all active:scale-95"
                                                onClick={() => navigate(`/pharmacist/dispense/${apt._id}`)}
                                            >
                                                <ChevronRight size={20} />
                                                Start Session
                                            </Button>
                                        </div>
                                    </div>
                                ))}

                                {/* GLOBAL PATIENT SEARCH (INLINE) */}
                                {searchTerm.length >= 3 && searchResults.length > 0 && (
                                    <div className="pt-8 space-y-4">
                                        <div className="flex items-center gap-3 px-1">
                                            <div className="h-[2px] flex-1 bg-slate-100"></div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Global Clinical Records</p>
                                            <div className="h-[2px] flex-1 bg-slate-100"></div>
                                        </div>
                                        {searchResults.map((res: any) => (
                                            <div key={res._id} className="bg-white p-6 rounded-2xl shadow-sm border-2 border-slate-50 group hover:border-indigo-400 hover:shadow-lg transition-all flex flex-col md:flex-row items-center gap-6 overflow-hidden relative">
                                                <div className="absolute top-0 left-0 h-full w-1.5 bg-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                                <div className="flex items-center gap-6 flex-1 w-full min-w-0">
                                                    <div className="h-16 w-16 rounded-xl bg-slate-50 border border-slate-100 overflow-hidden flex items-center justify-center shrink-0">
                                                        {res.userId?.profileImage ? (
                                                            <img src={res.userId.profileImage} alt={res.userId.name} className="h-full w-full object-cover" />
                                                        ) : (
                                                            <div className="h-full w-full bg-indigo-50 flex items-center justify-center">
                                                                <Users className="text-indigo-400 size-6" />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="space-y-1 flex-1 min-w-0">
                                                        <h3 className="font-black text-slate-900 uppercase text-lg truncate tracking-tight">{res.userId?.name}</h3>
                                                        <div className="flex items-center gap-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                                            <span>PH: {res.userId?.phone}</span>
                                                            <span className="h-1 w-1 rounded-full bg-slate-300"></span>
                                                            <span>ABHA: {res.abhaId || 'UNLINKED'}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <Button
                                                    className="h-12 w-full md:w-auto px-10 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-xl text-[11px] tracking-[0.2em] uppercase gap-3 shadow-lg shadow-indigo-100 transition-all active:scale-95"
                                                    onClick={() => handleStartSession(res._id)}
                                                >
                                                    <Plus size={20} />
                                                    Create Session
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* RIGHT (4 cols): INSIGHTS SIDEBAR */}
                <div className="lg:col-span-4 space-y-6">
                    {/* RECENT HISTORY */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                            <div className="flex items-center gap-2">
                                <History size={16} className="text-emerald-500" />
                                <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Fulfillment History</h3>
                            </div>
                            <Activity size={14} className="text-slate-300" />
                        </div>
                        <div className="p-4 space-y-2">
                            {historyDispensed.length === 0 ? (
                                <p className="text-[9px] font-bold text-slate-300 uppercase py-6 text-center">No recent sessions</p>
                            ) : (
                                historyDispensed.map((apt: any) => (
                                    <div key={apt._id} className="flex items-center justify-between p-3 rounded-xl bg-white border border-slate-100 group transition-all hover:bg-slate-50">
                                        <div className="flex-1 min-w-0">
                                            <p className="text-[10px] font-black text-slate-900 uppercase truncate">{apt.patientName}</p>
                                            <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-1">TOKEN: {apt.tokenNumber}</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-[8px] font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md uppercase tracking-tight">DISPENSED</span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* ABANDONED / DRAFT SESSIONS */}
                    <div className="bg-amber-50 rounded-2xl border border-amber-200 shadow-sm overflow-hidden">
                        <div className="p-5 border-b border-amber-200 flex items-center justify-between bg-amber-100/30">
                            <div className="flex items-center gap-2">
                                <UserMinus size={16} className="text-amber-600" />
                                <h3 className="text-[10px] font-black text-amber-900 uppercase tracking-widest">Draft / Incomplete</h3>
                            </div>
                            <div className="h-2 w-2 rounded-full bg-amber-500"></div>
                        </div>
                        <div className="p-4 space-y-3">
                            {dropOffs.length === 0 ? (
                                <p className="text-[9px] font-bold text-amber-300 uppercase py-6 text-center">Zero pending drafts</p>
                            ) : (
                                dropOffs.map((apt: any) => (
                                    <div key={apt._id} className="p-4 rounded-xl bg-white border border-amber-200/50 space-y-3 shadow-sm group">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="text-[11px] font-black text-amber-900 uppercase leading-none">{apt.patientName}</p>
                                                <p className="text-[8px] font-bold text-amber-600 uppercase mt-1">Stale: {formatDistanceToNow(new Date(apt.updatedAt))} ago</p>
                                            </div>
                                            <Badge className="bg-amber-100 text-amber-800 border-none text-[8px] font-black h-5 uppercase">DRAFT</Badge>
                                        </div>
                                        <Button variant="outline" className="w-full h-8 rounded-xl border-2 border-amber-100 text-amber-700 hover:bg-amber-600 hover:text-white hover:border-amber-600 text-[8px] font-black uppercase transition-all" onClick={() => navigate(`/pharmacist/dispense/${apt._id}`)}>
                                            RESUME DISPENSING <ArrowRight size={12} className="ml-2" />
                                        </Button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* NEW SESSION CTA (Relocated) */}
                    <div className="bg-blue-600 rounded-[2rem] p-8 text-white shadow-2xl shadow-blue-200 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 transition-transform duration-500 group-hover:scale-150"></div>
                        <div className="relative z-10 space-y-4">
                            <div className="h-12 w-12 bg-white/20 rounded-2xl flex items-center justify-center">
                                <Plus size={24} className="text-white" />
                            </div>
                            <div>
                                <h3 className="text-xl font-black uppercase tracking-tight">Manual Intake</h3>
                                <p className="text-[10px] font-bold text-blue-100 uppercase tracking-widest mt-1 opacity-80 underline underline-offset-4">Initiate New Clinical Session</p>
                            </div>
                            <Button
                                onClick={() => {
                                    const searchInput = document.querySelector('input') as HTMLInputElement;
                                    if (searchInput) searchInput.focus();
                                }}
                                className="w-full h-12 bg-white text-blue-600 hover:bg-blue-50 font-black rounded-xl text-[10px] tracking-widest shadow-lg"
                            >
                                START NEW SESSION
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
