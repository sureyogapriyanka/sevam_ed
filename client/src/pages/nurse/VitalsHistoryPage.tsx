import React, { useState, useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
    Activity,
    Calendar,
    ChevronLeft,
    Filter,
    Download,
    AlertCircle,
    Clock,
    UserCircle,
    TrendingUp,
    History,
    FileText,
    Thermometer,
    Heart,
    Wind
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

export default function VitalsHistoryPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const patientIdFromUrl = searchParams.get('patientId');

    const [selectedPatientId, setSelectedPatientId] = useState(patientIdFromUrl || "");
    const [searchQuery, setSearchQuery] = useState("");
    const [isVitalsModalOpen, setIsVitalsModalOpen] = useState(false);
    const [timeFilter, setTimeFilter] = useState("7d");

    // Fetch Patients for selector
    const { data: allPatients = [] } = useQuery<any[]>({
        queryKey: ["/api/patients"],
    });

    // Fetch Vitals History
    const { data: history = [], isLoading: loadingHistory } = useQuery<any[]>({
        queryKey: [`/api/vitals/patient/${selectedPatientId}`, { limit: 50 }],
        enabled: !!selectedPatientId,
    });

    const selectedPatient = useMemo(() => {
        return allPatients.find(p => p.id === selectedPatientId);
    }, [allPatients, selectedPatientId]);

    const chartData = useMemo(() => {
        return [...history].reverse().map(v => ({
            time: new Date(v.recordedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', day: '2-digit', month: 'short' }),
            sys: v.bloodPressure.systolic,
            dia: v.bloodPressure.diastolic,
            temp: v.temperature.value,
            pulse: v.pulse.value,
            spo2: v.spO2.value,
            resp: v.respiratoryRate?.value || 16,
            alert: v.hasAlert
        }));
    }, [history]);

    const filteredPatients = useMemo(() => {
        if (!searchQuery) return [];
        return allPatients.filter(p =>
            p.userId?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.id.toLowerCase().includes(searchQuery.toLowerCase())
        ).slice(0, 5);
    }, [allPatients, searchQuery]);

    const latestVitals = history[0];

    return (
        <div className="space-y-8 pb-10">
            {/* HEADER & SELECTOR */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
                        <ChevronLeft className="w-5 h-5" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Clinical Vitals History</h1>
                        <p className="text-slate-500 font-medium">Monitoring trends and long-term clinical data patterns.</p>
                    </div>
                </div>

                {!patientIdFromUrl && (
                    <div className="relative w-full md:w-80">
                        <Input
                            placeholder="Select patient to view history..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="h-10 pl-10 bg-white border-slate-200"
                        />
                        <Filter className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                        {filteredPatients.length > 0 && (
                            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-100 rounded-xl shadow-2xl z-50 overflow-hidden">
                                {filteredPatients.map(p => (
                                    <button
                                        key={p.id}
                                        className="w-full text-left p-3 hover:bg-blue-50 transition-colors flex items-center gap-3"
                                        onClick={() => {
                                            setSelectedPatientId(p.id);
                                            setSearchQuery("");
                                        }}
                                    >
                                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold">{p.userId?.name.charAt(0)}</div>
                                        <div className="text-xs">
                                            <p className="font-bold text-slate-900">{p.userId?.name}</p>
                                            <p className="text-slate-400"># {p.id.slice(-6).toUpperCase()}</p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {selectedPatientId ? (
                <>
                    {/* PATIENT PROFILE STICKER */}
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                        <Card className="lg:col-span-1 border-none shadow-sm bg-blue-600 text-white">
                            <CardContent className="p-6 space-y-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center text-3xl font-black backdrop-blur-md">
                                        {selectedPatient?.userId?.name.charAt(0)}
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xl font-black leading-none">{selectedPatient?.userId?.name}</p>
                                        <p className="text-sm font-medium text-blue-100 italic">#{selectedPatientId.slice(-6).toUpperCase()}</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
                                    <div>
                                        <p className="text-[10px] font-bold text-blue-200 uppercase">Age / Gender</p>
                                        <p className="text-sm font-bold">{selectedPatient?.userId?.age}y / {selectedPatient?.userId?.gender}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-blue-200 uppercase">Blood Group</p>
                                        <p className="text-sm font-bold">{selectedPatient?.userId?.bloodGroup || 'O+'}</p>
                                    </div>
                                </div>
                                <Button className="w-full bg-white text-blue-600 hover:bg-blue-50 font-bold" onClick={() => setIsVitalsModalOpen(true)}>
                                    Record New Vitals
                                </Button>
                            </CardContent>
                        </Card>

                        {/* LATEST SNAPSHOT */}
                        <Card className="lg:col-span-3 border-none shadow-sm overflow-hidden">
                            <CardHeader className="bg-slate-50/50 border-b border-slate-100 flex flex-row items-center justify-between py-3">
                                <CardTitle className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                    <Clock className="w-3.5 h-3.5" />
                                    Latest Clinical Snapshot
                                </CardTitle>
                                {latestVitals && (
                                    <Badge variant="outline" className="text-[10px] font-bold bg-white">
                                        Recorded {new Date(latestVitals.recordedAt).toLocaleString()}
                                    </Badge>
                                )}
                            </CardHeader>
                            <CardContent className="p-6">
                                {loadingHistory ? (
                                    <Skeleton className="h-24 w-full" />
                                ) : !latestVitals ? (
                                    <div className="text-center py-6 text-slate-400 italic">No recordings found for this patient.</div>
                                ) : (
                                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-bold text-slate-400 tracking-wider">BLOOD PRESSURE</p>
                                            <p className="text-xl font-black text-slate-900">{latestVitals.bloodPressure.systolic}/{latestVitals.bloodPressure.diastolic}</p>
                                            <Badge className={`bg-${latestVitals.bloodPressure.status === 'normal' ? 'emerald' : 'rose'}-50 text-${latestVitals.bloodPressure.status === 'normal' ? 'emerald' : 'rose'}-600 border-none text-[9px] h-4 font-black uppercase`}>
                                                {latestVitals.bloodPressure.status}
                                            </Badge>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-bold text-slate-400 tracking-wider">TEMPERATURE</p>
                                            <p className="text-xl font-black text-slate-900">{latestVitals.temperature.value}°C</p>
                                            <Badge className={`bg-${latestVitals.temperature.status === 'normal' ? 'emerald' : 'rose'}-50 text-${latestVitals.temperature.status === 'normal' ? 'emerald' : 'rose'}-600 border-none text-[9px] h-4 font-black uppercase`}>
                                                {latestVitals.temperature.status}
                                            </Badge>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-bold text-slate-400 tracking-wider">PULSE RATE</p>
                                            <p className="text-xl font-black text-slate-900">{latestVitals.pulse.value} bpm</p>
                                            <Badge className={`bg-${latestVitals.pulse.status === 'normal' ? 'emerald' : 'rose'}-50 text-${latestVitals.pulse.status === 'normal' ? 'emerald' : 'rose'}-600 border-none text-[9px] h-4 font-black uppercase`}>
                                                {latestVitals.pulse.status}
                                            </Badge>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-bold text-slate-400 tracking-wider">SPO2 (%)</p>
                                            <p className="text-xl font-black text-slate-900">{latestVitals.spO2.value}%</p>
                                            <Badge className={`bg-${latestVitals.spO2.status === 'normal' ? 'emerald' : 'rose'}-50 text-${latestVitals.spO2.status === 'normal' ? 'emerald' : 'rose'}-600 border-none text-[9px] h-4 font-black uppercase`}>
                                                {latestVitals.spO2.status}
                                            </Badge>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-bold text-slate-400 tracking-wider">BMI INDEX</p>
                                            <p className="text-xl font-black text-slate-900">{latestVitals.bmi || 'N/A'}</p>
                                            <Badge className="bg-blue-50 text-blue-600 border-none text-[9px] h-4 font-black uppercase">CALCULATED</Badge>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* TREND CHARTS GRID */}
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
                        {/* CHART 1: BP */}
                        <Card className="border-none shadow-sm">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-bold flex items-center gap-2">
                                    <Activity className="w-4 h-4 text-rose-500" />
                                    Blood Pressure Trend (mmHg)
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="h-[300px] p-6 pr-10">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={chartData}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                        <XAxis dataKey="time" fontSize={10} axisLine={false} tickLine={false} />
                                        <YAxis fontSize={10} axisLine={false} tickLine={false} domain={['dataMin - 10', 'dataMax + 10']} />
                                        <Tooltip
                                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                            labelStyle={{ fontWeight: 'bold', marginBottom: '4px' }}
                                        />
                                        <Legend verticalAlign="top" height={36} />
                                        <ReferenceLine y={140} stroke="#fecaca" strokeDasharray="3 3" label={{ value: 'High', position: 'right', fill: '#f87171', fontSize: 10 }} />
                                        <Line type="monotone" dataKey="sys" name="Systolic" stroke="#e11d48" strokeWidth={3} dot={{ fill: '#e11d48', strokeWidth: 2 }} activeDot={{ r: 6 }} />
                                        <Line type="monotone" dataKey="dia" name="Diastolic" stroke="#2563eb" strokeWidth={3} dot={{ fill: '#2563eb', strokeWidth: 2 }} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        {/* CHART 2: TEMP */}
                        <Card className="border-none shadow-sm">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-bold flex items-center gap-2">
                                    <Thermometer className="w-4 h-4 text-orange-500" />
                                    Core Temperature Trend (°C)
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="h-[300px] p-6 pr-10">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={chartData}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                        <XAxis dataKey="time" fontSize={10} axisLine={false} tickLine={false} />
                                        <YAxis fontSize={10} axisLine={false} tickLine={false} domain={[34, 42]} />
                                        <Tooltip contentStyle={{ borderRadius: '12px', border: 'none' }} />
                                        <ReferenceLine y={37.5} stroke="#fdba74" strokeDasharray="3 3" label={{ value: 'Fever', position: 'right', fill: '#fb923c', fontSize: 10 }} />
                                        <Line type="monotone" dataKey="temp" name="Temperature" stroke="#f59e0b" strokeWidth={3} dot={{ fill: '#f59e0b' }} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        {/* CHART 3: PULSE & OXYGEN */}
                        <Card className="border-none shadow-sm">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-bold flex items-center gap-2">
                                    <Heart className="w-4 h-4 text-purple-500" />
                                    Pulse & Oxygen Saturation
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="h-[300px] p-6 pr-10">
                                <ResponsiveContainer width="100%" height="100%">
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
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        {/* CHART 4: RESPIRATORY */}
                        <Card className="border-none shadow-sm">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-bold flex items-center gap-2">
                                    <Wind className="w-4 h-4 text-cyan-500" />
                                    Respiratory Respiratory Trend
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="h-[300px] p-6 pr-10">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={chartData}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                        <XAxis dataKey="time" fontSize={10} axisLine={false} tickLine={false} />
                                        <YAxis fontSize={10} axisLine={false} tickLine={false} />
                                        <Tooltip contentStyle={{ borderRadius: '12px', border: 'none' }} />
                                        <Line type="monotone" dataKey="resp" name="Breaths/min" stroke="#06b6d4" strokeWidth={3} dot={{ fill: '#06b6d4' }} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </div>

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

                        <Card className="border-none shadow-sm overflow-hidden">
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
                                                    <tr key={i}><td colSpan={7} className="px-6 py-4 space-x-4 flex"><Skeleton className="h-6 w-full" /></td></tr>
                                                ))
                                            ) : history.length === 0 ? (
                                                <tr><td colSpan={7} className="px-6 py-12 text-center text-slate-400 font-medium">No history found.</td></tr>
                                            ) : (
                                                history.map((record) => (
                                                    <tr key={record.id} className="hover:bg-slate-50/50 transition-colors">
                                                        <td className="px-6 py-4">
                                                            <div className="flex items-center gap-2">
                                                                {record.hasAlert && <AlertCircle className="w-3.5 h-3.5 text-rose-500" />}
                                                                <span className="font-bold text-slate-900">{new Date(record.recordedAt).toLocaleDateString()}</span>
                                                                <span className="text-slate-400 font-medium">{new Date(record.recordedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <span className={`font-black ${record.bloodPressure.status !== 'normal' ? 'text-rose-600' : 'text-slate-900'}`}>
                                                                {record.bloodPressure.systolic}/{record.bloodPressure.diastolic}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <span className={`font-black ${record.temperature.status !== 'normal' ? 'text-orange-600' : 'text-slate-900'}`}>
                                                                {record.temperature.value}°C
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <span className="font-bold text-slate-900">{record.pulse.value}</span>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <span className={`font-black ${record.spO2.status !== 'normal' ? 'text-rose-600' : 'text-slate-900'}`}>
                                                                {record.spO2.value}%
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <div className="flex items-center gap-2">
                                                                <UserCircle className="w-3.5 h-3.5 text-slate-300" />
                                                                <span className="font-medium text-slate-600 text-xs">{record.nurseName}</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 text-right">
                                                            {record.notes ? (
                                                                <Badge variant="secondary" className="bg-slate-100 text-slate-600 border-none font-bold text-[10px] lowercase truncate max-w-[150px]">
                                                                    {record.notes}
                                                                </Badge>
                                                            ) : (
                                                                <span className="text-slate-300">--</span>
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
                </>
            ) : (
                <div className="flex flex-col items-center justify-center py-32 text-center space-y-4">
                    <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center text-slate-300">
                        <UserCircle size={40} />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-slate-900">No Patient Selected</h3>
                        <p className="text-slate-400 max-w-sm">Please select a patient from the dropdown above to view their clinical history and trends.</p>
                    </div>
                </div>
            )}

            {/* SHARED MODAL */}
            <VitalsModal
                isOpen={isVitalsModalOpen}
                onClose={() => setIsVitalsModalOpen(false)}
                patientId={selectedPatientId}
            />
        </div>
    );
}
