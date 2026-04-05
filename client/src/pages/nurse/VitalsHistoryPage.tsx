import React, { useState, useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
    Activity,
    ChevronLeft,
    Download,
    AlertCircle,
    Clock,
    UserCircle,
    TrendingUp,
    History,
    Thermometer,
    Heart,
    Wind,
    Search,
    Eye,
    Users,
    ArrowLeft
} from "lucide-react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
    ReferenceLine
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Skeleton } from "../../components/ui/skeleton";
import { VitalsModal } from "./RecordVitalsPage";

// ─── Patient Detail View ──────────────────────────────────────────────────────

function PatientVitalsDetail({ patient, onBack }: { patient: any; onBack: () => void }) {
    const [isVitalsModalOpen, setIsVitalsModalOpen] = useState(false);
    const [timeFilter, setTimeFilter] = useState("7d");

    const { data: history = [], isLoading: loadingHistory } = useQuery<any[]>({
        queryKey: [`/api/vitals/patient/${patient.id}`, { limit: 50 }],
        enabled: !!patient.id,
    });

    const chartData = useMemo(() => {
        return [...history].reverse().map(v => ({
            time: new Date(v.recordedAt).toLocaleString([], { month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit' }),
            sys: v.bloodPressure?.systolic,
            dia: v.bloodPressure?.diastolic,
            temp: v.temperature?.value,
            pulse: v.pulse?.value,
            spo2: v.spO2?.value,
            resp: v.respiratoryRate?.value || 16,
            alert: v.hasAlert
        }));
    }, [history]);

    const latestVitals = history[0];

    return (
        <div className="space-y-8 pb-10">
            {/* BACK HEADER */}
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon"
                    className="rounded-2xl border-2 border-slate-100 hover:border-blue-100 hover:bg-blue-50"
                    onClick={onBack}
                >
                    <ArrowLeft className="w-5 h-5 text-slate-600" />
                </Button>
                <div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                        {patient.userId?.name || patient.name}
                    </h1>
                    <p className="text-slate-400 text-sm font-bold">
                        Patient ID: #{patient.id?.slice(-8).toUpperCase() || patient._id?.slice(-8).toUpperCase()}
                        · {patient.userId?.age || patient.age}y · {patient.userId?.gender || patient.gender}
                        · Blood Group: {patient.userId?.bloodGroup || patient.bloodGroup || 'O+'}
                    </p>
                </div>
                <div className="ml-auto">
                    <Button
                        className="bg-blue-600 hover:bg-blue-700 font-black rounded-2xl px-6 shadow-lg shadow-blue-100"
                        onClick={() => setIsVitalsModalOpen(true)}
                    >
                        <Activity className="w-4 h-4 mr-2" />
                        Record New Vitals
                    </Button>
                </div>
            </div>

            {/* LATEST SNAPSHOT */}
            <Card className="border-2 border-slate-50 shadow-xl rounded-[2.5rem] overflow-hidden">
                <div className="bg-slate-50/50 px-8 py-5 border-b border-slate-100 flex items-center justify-between">
                    <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <Clock className="w-4 h-4" /> Latest Clinical Snapshot
                    </h2>
                    {latestVitals && (
                        <Badge variant="outline" className="text-[10px] font-bold bg-white">
                            Recorded {new Date(latestVitals.recordedAt).toLocaleString()}
                        </Badge>
                    )}
                </div>
                <CardContent className="p-8">
                    {loadingHistory ? (
                        <Skeleton className="h-24 w-full" />
                    ) : !latestVitals ? (
                        <div className="text-center py-10 text-slate-400 font-bold italic">
                            No vitals recorded yet for this patient.
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
                            {[
                                { label: "Blood Pressure", value: `${latestVitals.bloodPressure?.systolic}/${latestVitals.bloodPressure?.diastolic} mmHg`, status: latestVitals.bloodPressure?.status, color: "rose" },
                                { label: "Temperature", value: `${latestVitals.temperature?.value}°C`, status: latestVitals.temperature?.status, color: "orange" },
                                { label: "Pulse Rate", value: `${latestVitals.pulse?.value} bpm`, status: latestVitals.pulse?.status, color: "purple" },
                                { label: "SpO2", value: `${latestVitals.spO2?.value}%`, status: latestVitals.spO2?.status, color: "teal" },
                                { label: "BMI", value: latestVitals.bmi || 'N/A', status: "calculated", color: "blue" },
                            ].map(({ label, value, status, color }) => (
                                <div key={label} className="space-y-2">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
                                    <p className="text-xl font-black text-slate-900">{value}</p>
                                    <Badge className={`bg-${status === 'normal' || status === 'calculated' ? 'emerald' : 'rose'}-50 text-${status === 'normal' || status === 'calculated' ? 'emerald' : 'rose'}-600 border-none text-[9px] h-4 font-black uppercase`}>
                                        {status}
                                    </Badge>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* TREND CHARTS */}
            {history.length > 0 && (
                <>
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-black text-slate-900 flex items-center gap-2 tracking-tight">
                            <TrendingUp className="w-5 h-5 text-blue-600" />
                            Clinical Trend Visualization
                        </h2>
                        <Tabs value={timeFilter} onValueChange={setTimeFilter} className="bg-slate-100 p-1 rounded-xl">
                            <TabsList className="bg-transparent border-none">
                                <TabsTrigger value="24h" className="text-xs font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg">Last 24h</TabsTrigger>
                                <TabsTrigger value="7d" className="text-xs font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg">Last 7 Days</TabsTrigger>
                                <TabsTrigger value="30d" className="text-xs font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg">Last 30 Days</TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {[
                            {
                                title: "Blood Pressure (mmHg)", Icon: Activity, iconColor: "text-rose-500",
                                children: (
                                    <LineChart data={chartData}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                        <XAxis dataKey="time" fontSize={10} axisLine={false} tickLine={false} />
                                        <YAxis fontSize={10} axisLine={false} tickLine={false} domain={['dataMin - 10', 'dataMax + 10']} />
                                        <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                                        <Legend verticalAlign="top" height={36} />
                                        <ReferenceLine y={140} stroke="#fecaca" strokeDasharray="3 3" label={{ value: 'High', position: 'right', fill: '#f87171', fontSize: 10 }} />
                                        <Line type="monotone" dataKey="sys" name="Systolic" stroke="#e11d48" strokeWidth={3} dot={{ fill: '#e11d48', strokeWidth: 2 }} activeDot={{ r: 6 }} />
                                        <Line type="monotone" dataKey="dia" name="Diastolic" stroke="#2563eb" strokeWidth={3} dot={{ fill: '#2563eb', strokeWidth: 2 }} />
                                    </LineChart>
                                )
                            },
                            {
                                title: "Core Temperature (°C)", Icon: Thermometer, iconColor: "text-orange-500",
                                children: (
                                    <LineChart data={chartData}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                        <XAxis dataKey="time" fontSize={10} axisLine={false} tickLine={false} />
                                        <YAxis fontSize={10} axisLine={false} tickLine={false} domain={[34, 42]} />
                                        <Tooltip contentStyle={{ borderRadius: '12px', border: 'none' }} />
                                        <ReferenceLine y={37.5} stroke="#fdba74" strokeDasharray="3 3" label={{ value: 'Fever', position: 'right', fill: '#fb923c', fontSize: 10 }} />
                                        <Line type="monotone" dataKey="temp" name="Temperature" stroke="#f59e0b" strokeWidth={3} dot={{ fill: '#f59e0b' }} />
                                    </LineChart>
                                )
                            },
                            {
                                title: "Pulse & Oxygen Saturation", Icon: Heart, iconColor: "text-purple-500",
                                children: (
                                    <LineChart data={chartData}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                        <XAxis dataKey="time" fontSize={10} axisLine={false} tickLine={false} />
                                        <YAxis yAxisId="left" orientation="left" stroke="#8b5cf6" fontSize={10} axisLine={false} tickLine={false} />
                                        <YAxis yAxisId="right" orientation="right" stroke="#10b981" fontSize={10} axisLine={false} tickLine={false} domain={[80, 100]} />
                                        <Tooltip contentStyle={{ borderRadius: '12px', border: 'none' }} />
                                        <Legend verticalAlign="top" height={36} />
                                        <Line yAxisId="left" type="monotone" dataKey="pulse" name="Pulse (bpm)" stroke="#8b5cf6" strokeWidth={3} dot={{ fill: '#8b5cf6' }} />
                                        <Line yAxisId="right" type="monotone" dataKey="spo2" name="SpO2 (%)" stroke="#10b981" strokeWidth={3} dot={{ fill: '#10b981' }} />
                                    </LineChart>
                                )
                            },
                            {
                                title: "Respiratory Rate (breaths/min)", Icon: Wind, iconColor: "text-cyan-500",
                                children: (
                                    <LineChart data={chartData}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                        <XAxis dataKey="time" fontSize={10} axisLine={false} tickLine={false} />
                                        <YAxis fontSize={10} axisLine={false} tickLine={false} />
                                        <Tooltip contentStyle={{ borderRadius: '12px', border: 'none' }} />
                                        <Line type="monotone" dataKey="resp" name="Breaths/min" stroke="#06b6d4" strokeWidth={3} dot={{ fill: '#06b6d4' }} />
                                    </LineChart>
                                )
                            },
                        ].map(({ title, Icon, iconColor, children }) => (
                            <Card key={title} className="border-none shadow-sm">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-bold flex items-center gap-2">
                                        <Icon className={`w-4 h-4 ${iconColor}`} />
                                        {title}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="h-[240px] p-4 pr-10">
                                    <ResponsiveContainer width="100%" height="100%">
                                        {children}
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </>
            )}

            {/* HISTORY TABLE */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-black text-slate-900 flex items-center gap-2 tracking-tight">
                        <History className="w-5 h-5 text-slate-700" />
                        Detailed Clinical Log
                    </h2>
                    <Button variant="outline" size="sm" className="gap-2 font-bold px-4">
                        <Download className="w-4 h-4" />
                        Export CSV
                    </Button>
                </div>

                <Card className="border-2 border-slate-50 shadow-xl rounded-[2.5rem] overflow-hidden">
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead>
                                    <tr className="bg-slate-50 text-slate-500 uppercase text-[10px] font-black tracking-widest border-b border-slate-100">
                                        <th className="px-6 py-4">Date / Time</th>
                                        <th className="px-6 py-4">BP</th>
                                        <th className="px-6 py-4">Temp</th>
                                        <th className="px-6 py-4">Pulse</th>
                                        <th className="px-6 py-4">SpO2</th>
                                        <th className="px-6 py-4">Recorded By</th>
                                        <th className="px-6 py-4 text-right">Observation</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {loadingHistory ? (
                                        Array(5).fill(0).map((_, i) => (
                                            <tr key={i}><td colSpan={7} className="px-6 py-4"><Skeleton className="h-6 w-full" /></td></tr>
                                        ))
                                    ) : history.length === 0 ? (
                                        <tr><td colSpan={7} className="px-6 py-12 text-center text-slate-400 font-bold italic">No vitals recorded yet.</td></tr>
                                    ) : (
                                        history.map((record: any) => (
                                            <tr key={record.id || record._id} className="hover:bg-slate-50/50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        {record.hasAlert && <AlertCircle className="w-3.5 h-3.5 text-rose-500" />}
                                                        <span className="font-bold text-slate-900">{new Date(record.recordedAt).toLocaleDateString()}</span>
                                                        <span className="text-slate-400 font-medium">{new Date(record.recordedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`font-black ${record.bloodPressure?.status !== 'normal' ? 'text-rose-600' : 'text-slate-900'}`}>
                                                        {record.bloodPressure?.systolic}/{record.bloodPressure?.diastolic}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`font-black ${record.temperature?.status !== 'normal' ? 'text-orange-600' : 'text-slate-900'}`}>
                                                        {record.temperature?.value}°C
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="font-bold text-slate-900">{record.pulse?.value} bpm</span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`font-black ${record.spO2?.status !== 'normal' ? 'text-rose-600' : 'text-slate-900'}`}>
                                                        {record.spO2?.value}%
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <UserCircle className="w-3.5 h-3.5 text-slate-300" />
                                                        <span className="font-medium text-slate-600 text-xs">{record.nurseName || '—'}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    {record.notes ? (
                                                        <Badge variant="secondary" className="bg-slate-100 text-slate-600 border-none font-bold text-[10px] lowercase truncate max-w-[150px]">
                                                            {record.notes}
                                                        </Badge>
                                                    ) : (
                                                        <span className="text-slate-300">—</span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <VitalsModal
                isOpen={isVitalsModalOpen}
                onClose={() => setIsVitalsModalOpen(false)}
                patientId={patient.id}
            />
        </div>
    );
}

// ─── Patient List View ────────────────────────────────────────────────────────

export default function VitalsHistoryPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const patientIdFromUrl = searchParams.get('patientId');

    const [selectedPatient, setSelectedPatient] = useState<any>(null);
    const [searchQuery, setSearchQuery] = useState("");

    const { data: allPatients = [], isLoading } = useQuery<any[]>({
        queryKey: ["/api/patients"],
    });

    // If a patientId is in the URL, auto-select that patient
    React.useEffect(() => {
        if (patientIdFromUrl && allPatients.length > 0) {
            const found = allPatients.find((p: any) => p.id === patientIdFromUrl || p._id === patientIdFromUrl);
            if (found) setSelectedPatient(found);
        }
    }, [patientIdFromUrl, allPatients]);

    const filteredPatients = useMemo(() => {
        if (!searchQuery) return allPatients;
        return allPatients.filter((p: any) =>
            (p.userId?.name || p.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
            (p.id || p._id || "").toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [allPatients, searchQuery]);

    // If a patient is selected, show detail view
    if (selectedPatient) {
        return (
            <PatientVitalsDetail
                patient={selectedPatient}
                onBack={() => setSelectedPatient(null)}
            />
        );
    }

    // Otherwise, show the patient list
    return (
        <div className="space-y-8 pb-10">
            {/* HEADER */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon"
                        className="rounded-2xl border-2 border-slate-100 hover:border-slate-200"
                        onClick={() => navigate(-1)}
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Clinical Vitals History</h1>
                        <p className="text-slate-500 font-medium">Select a patient to view their recorded vitals and clinical trends.</p>
                    </div>
                </div>
                <div className="relative w-full md:w-80">
                    <Input
                        placeholder="Search patient by name or ID..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="h-11 pl-10 bg-white border-2 border-slate-100 rounded-2xl font-bold"
                    />
                    <Search className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
                </div>
            </div>

            {/* PATIENT LIST */}
            <Card className="border-2 border-slate-50 shadow-xl rounded-[2.5rem] overflow-hidden">
                <div className="bg-slate-50/50 px-8 py-5 border-b border-slate-100 flex items-center justify-between">
                    <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        All Registered Patients
                    </h2>
                    <Badge className="bg-blue-100 text-blue-700 border-none font-black">
                        {filteredPatients.length} patients
                    </Badge>
                </div>
                <CardContent className="p-0">
                    {isLoading ? (
                        <div className="p-8 space-y-4">
                            {Array(6).fill(0).map((_, i) => <Skeleton key={i} className="h-16 w-full rounded-2xl" />)}
                        </div>
                    ) : filteredPatients.length === 0 ? (
                        <div className="text-center py-16 text-slate-400">
                            <UserCircle className="h-12 w-12 mx-auto mb-3 opacity-20" />
                            <p className="font-bold">No patients found.</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-slate-50">
                            {filteredPatients.map((patient: any) => {
                                const name = patient.userId?.name || patient.name || "Unknown";
                                const patId = (patient.id || patient._id || "").slice(-8).toUpperCase();
                                const age = patient.userId?.age || patient.age;
                                const gender = patient.userId?.gender || patient.gender;
                                const blood = patient.userId?.bloodGroup || patient.bloodGroup || 'O+';

                                return (
                                    <div
                                        key={patient.id || patient._id}
                                        className="flex items-center justify-between px-8 py-5 hover:bg-blue-50/30 transition-colors group"
                                    >
                                        <div className="flex items-center gap-5">
                                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-lg font-black shadow-md shadow-blue-100 group-hover:scale-105 transition-transform">
                                                {name.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="text-base font-black text-slate-900">{name}</p>
                                                <p className="text-xs font-bold text-slate-400">
                                                    ID: #{patId}
                                                    {age && ` · ${age}y`}
                                                    {gender && ` · ${gender}`}
                                                    {blood && ` · ${blood}`}
                                                </p>
                                            </div>
                                        </div>
                                        <Button
                                            className="bg-slate-900 hover:bg-blue-600 text-white font-black rounded-2xl px-6 h-10 gap-2 transition-all group-hover:scale-[1.02] shadow-sm"
                                            onClick={() => setSelectedPatient(patient)}
                                        >
                                            <Eye className="w-4 h-4" />
                                            View History
                                        </Button>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
