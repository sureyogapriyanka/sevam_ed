import React, { useMemo } from "react";
import {
    Calendar,
    Clock,
    Building2,
    UserCircle,
    CheckCircle2,
    Clock4,
    CalendarRange,
    TrendingUp,
    Timer,
    AlertCircle,
    ChevronLeft,
    ChevronRight,
    Search
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";

// TODO: Connect to backend shift management API when available

export default function ShiftSchedulePage() {
    // Hardcoded static shift data for current week
    const shifts = [
        { day: "Monday", date: "Feb 23", type: "Morning", ward: "ICU Ward", timing: "6:00 AM - 2:00 PM", status: "Completed", color: "emerald" },
        { day: "Tuesday", date: "Feb 24", type: "Afternoon", ward: "General Ward", timing: "2:00 PM - 10:00 PM", status: "Completed", color: "emerald" },
        { day: "Wednesday", date: "Feb 25", type: "OFF", ward: "-", timing: "-", status: "Day Off", color: "slate" },
        { day: "Thursday", date: "Feb 26", type: "Morning", ward: "ICU Ward", timing: "6:00 AM - 2:00 PM", status: "Today", color: "blue" },
        { day: "Friday", date: "Feb 27", type: "Night", ward: "ER Department", timing: "10:00 PM - 6:00 AM", status: "Upcoming", color: "slate" },
        { day: "Saturday", date: "Feb 28", type: "Morning", ward: "Pediatric Ward", timing: "6:00 AM - 2:00 PM", status: "Upcoming", color: "slate" },
        { day: "Sunday", date: "Mar 01", type: "OFF", ward: "-", timing: "-", status: "Day Off", color: "slate" },
    ];

    const todayShift = shifts.find(s => s.status === "Today");

    return (
        <div className="space-y-8 pb-10">
            {/* HEADER */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                        <CalendarRange className="w-8 h-8 text-blue-600" />
                        My Shift Schedule
                    </h1>
                    <p className="text-slate-500 font-medium">Monitoring your weekly roster and facility assignments.</p>
                </div>

                <div className="flex items-center gap-2 bg-white p-1 rounded-xl border border-slate-100 shadow-sm">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400">
                        <ChevronLeft size={16} />
                    </Button>
                    <span className="text-xs font-black text-slate-700 px-2">FEB 23 - MAR 01, 2026</span>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400">
                        <ChevronRight size={16} />
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* TODAY'S FOCUS CARD */}
                <Card className="lg:col-span-1 border-none shadow-sm bg-blue-600 text-white overflow-hidden relative">
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                        <Clock size={120} />
                    </div>
                    <CardHeader>
                        <CardTitle className="text-xs font-black uppercase tracking-widest text-blue-200 flex items-center gap-2">
                            <Clock4 className="w-4 h-4" />
                            Active Shift Assignment
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6 relative z-10">
                        <div className="space-y-1">
                            <p className="text-4xl font-black tracking-tighter">{todayShift?.type}</p>
                            <p className="text-blue-100 font-bold uppercase text-[10px] tracking-widest">Ongoing: {todayShift?.timing}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
                            <div className="space-y-3">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-blue-200 uppercase tracking-wider">Facility Block</p>
                                    <p className="text-sm font-bold flex items-center gap-2">
                                        <Building2 size={14} className="text-blue-200" />
                                        {todayShift?.ward}
                                    </p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-blue-200 uppercase tracking-wider">Floor Level</p>
                                    <p className="text-sm font-bold">2nd Floor (North Wing)</p>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-blue-200 uppercase tracking-wider">Supervisor</p>
                                    <p className="text-sm font-bold flex items-center gap-2">
                                        <UserCircle size={14} className="text-blue-200" />
                                        Dr. Sharma
                                    </p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-blue-200 uppercase tracking-wider">Patients Assigned</p>
                                    <p className="text-sm font-bold">12 Active Cases</p>
                                </div>
                            </div>
                        </div>

                        <Button className="w-full bg-white text-blue-600 hover:bg-blue-50 font-black shadow-lg">
                            PUNCH OUT
                        </Button>
                    </CardContent>
                </Card>

                {/* SHIFT STATS */}
                <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="border-none shadow-sm flex flex-col justify-center p-6 space-y-2">
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2">
                            <CheckCircle2 size={20} />
                        </div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Shifts Completed</p>
                        <p className="text-3xl font-black text-slate-900 tracking-tight">2 <span className="text-sm font-medium text-slate-400">/ 5 this week</span></p>
                    </Card>
                    <Card className="border-none shadow-sm flex flex-col justify-center p-6 space-y-2">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-2">
                            <Timer size={20} />
                        </div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Hours</p>
                        <p className="text-3xl font-black text-slate-900 tracking-tight">16.0 <span className="text-sm font-medium text-slate-400">hrs</span></p>
                    </Card>
                    <Card className="border-none shadow-sm flex flex-col justify-center p-6 space-y-2">
                        <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center mb-2">
                            <TrendingUp size={20} />
                        </div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Overtime Hours</p>
                        <p className="text-3xl font-black text-slate-900 tracking-tight">2.5 <span className="text-sm font-medium text-slate-400">hrs</span></p>
                    </Card>
                </div>
            </div>

            {/* WEEKLY TABLE */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-black text-slate-900 flex items-center gap-2 tracking-tight">
                        <Calendar className="w-5 h-5 text-blue-600" />
                        Weekly Schedule Details
                    </h2>
                </div>

                <Card className="border-none shadow-sm overflow-hidden">
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead>
                                    <tr className="bg-slate-50 text-slate-500 uppercase text-[10px] font-black tracking-widest border-b border-slate-100">
                                        <th className="px-6 py-4">Day / Date</th>
                                        <th className="px-6 py-4">Shift Type</th>
                                        <th className="px-6 py-4">Assigned Ward</th>
                                        <th className="px-6 py-4">Timing Window</th>
                                        <th className="px-6 py-4 text-right">Duty Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {shifts.map((shift, idx) => (
                                        <tr
                                            key={idx}
                                            className={`transition-colors ${shift.status === "Today"
                                                    ? "bg-blue-50/50 border-l-4 border-l-blue-600"
                                                    : "hover:bg-slate-50/50"
                                                }`}
                                        >
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className={`font-black ${shift.status === "Today" ? "text-blue-700" : "text-slate-900"}`}>{shift.day}</span>
                                                    <span className="text-xs font-bold text-slate-400">{shift.date}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <Badge variant="outline" className={`font-black text-[10px] tracking-wider uppercase bg-white border-${shift.color}-200 text-${shift.color}-600`}>
                                                    {shift.type}
                                                </Badge>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`font-bold ${shift.type === "OFF" ? "italic text-slate-300" : "text-slate-600"}`}>
                                                    {shift.ward}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`font-medium ${shift.type === "OFF" ? "text-slate-300" : "text-slate-500"}`}>
                                                    {shift.timing}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <Badge className={`
                                                    font-black text-[9px] uppercase border-none
                                                    ${shift.status === "Completed" ? "bg-emerald-100 text-emerald-700" : ""}
                                                    ${shift.status === "Today" ? "bg-blue-600 text-white shadow-sm" : ""}
                                                    ${shift.status === "Upcoming" ? "bg-slate-100 text-slate-500" : ""}
                                                    ${shift.status === "Day Off" ? "bg-slate-50 text-slate-300 italic" : ""}
                                                `}>
                                                    {shift.status}
                                                </Badge>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* ADVISORY BOX */}
            <div className="bg-slate-50 border border-slate-100 p-6 rounded-2xl flex items-start gap-4">
                <AlertCircle className="w-6 h-6 text-slate-400 mt-1" />
                <div className="space-y-1">
                    <p className="text-sm font-black text-slate-700 uppercase tracking-tight">Shift Policy Reminder</p>
                    <p className="text-sm text-slate-500 font-medium">Please ensure you punch in at least 10 minutes before your shift starts. Any schedule changes must be approved by Dr. Sharma at least 24 hours in advance.</p>
                </div>
            </div>
        </div>
    );
}
