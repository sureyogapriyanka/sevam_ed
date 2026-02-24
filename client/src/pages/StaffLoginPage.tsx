import { useState, useEffect } from "react";
import { useLanguage } from "../contexts/LanguageContext";
import { useNavigate } from "react-router-dom";
import LanguageSelector from "../components/common/LanguageSelector";
import { Eye, Clock, Shield, Stethoscope, Camera, Lock, AlertTriangle, ArrowRight, UserCircle, BriefcaseMedical, Landmark, Pill, Users } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Button } from "../components/ui/button";

// ─── Role Definitions ─────────────────────────────────────────────────────────

const ROLES = [
    {
        id: "admin",
        label: "Administrator",
        sub: "Maximum Security Access",
        icon: Shield,
        path: "/admin-login",
        color: "text-indigo-800",
        bg: "bg-indigo-50",
    },
    {
        id: "doctor",
        label: "Medical Doctor",
        sub: "Clinical Systems Access",
        icon: Stethoscope,
        path: "/doctor-login",
        color: "text-indigo-600",
        bg: "bg-indigo-50",
    },
    {
        id: "nurse",
        label: "Nurse",
        sub: "Patient Care Access",
        icon: BriefcaseMedical,
        path: "/nurse-login",
        color: "text-blue-600",
        bg: "bg-blue-50",
    },
    {
        id: "receptionist",
        label: "Receptionist",
        sub: "Front Desk & Scheduling",
        icon: Landmark,
        path: "/reception-login",
        color: "text-indigo-400",
        bg: "bg-indigo-50/50",
    },
    {
        id: "pharmacist",
        label: "Pharmacist",
        sub: "Pharmacy & Dispensary",
        icon: Pill,
        path: "/pharmacist-login",
        color: "text-blue-400",
        bg: "bg-blue-50/50",
    },
];

export default function StaffLoginPage() {
    const { t } = useLanguage();
    const navigate = useNavigate();
    const [currentTime, setCurrentTime] = useState(new Date());
    const [selectedRole, setSelectedRole] = useState<string>("");
    const [sessionId] = useState(() => `SES-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const handleEnterPortal = () => {
        const role = ROLES.find(r => r.id === selectedRole);
        if (role) {
            navigate(role.path);
        }
    };

    const currentRoleData = ROLES.find(r => r.id === selectedRole);
    const IconComponent = currentRoleData?.icon || UserCircle;

    return (
        <div className="min-h-screen bg-[#f8faff] flex flex-col items-center p-4 pb-32 relative overflow-hidden font-sans">
            {/* Soft Ambient Background Elements */}
            <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-100 rounded-full blur-[120px] opacity-40 pointer-events-none" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[30%] h-[30%] bg-indigo-50 rounded-full blur-[100px] opacity-30 pointer-events-none" />

            {/* Subtle grid background */}
            <div className="absolute inset-0 opacity-10 pointer-events-none"
                style={{
                    backgroundImage: `radial-gradient(circle at 1px 1px, rgba(0,0,0,0.1) 1px, transparent 0)`,
                    backgroundSize: "40px 40px"
                }}
            />

            {/* Top security banner */}
            <div className="absolute top-0 left-0 right-0 bg-white border-b border-slate-100 py-2.5 z-20">
                <div className="flex items-center justify-center gap-3 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">
                    <Eye className="h-3.5 w-3.5 text-slate-300" />
                    <span>Secure Access Portal — All Activities Monitored & Logged</span>
                    <Camera className="h-3.5 w-3.5 text-slate-300" />
                </div>
            </div>

            {/* Header / Branding Section */}
            <div className="w-full max-w-lg mt-24 mb-10 text-center relative z-10 space-y-6">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-2xl border border-blue-50 transform rotate-3 hover:rotate-0 transition-all duration-500">
                        <img src="/sevamed logo.png" alt="SevaMed Logo" className="w-10 h-10 object-contain" />
                    </div>
                </div>
                <div className="space-y-1">
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">{t("sevamed_hms")}</h1>
                    <p className="text-blue-500 font-black text-[10px] uppercase tracking-[0.4em]">Integrated Staff Gateway</p>
                </div>
            </div>

            {/* Main Portal Selection Hub */}
            <div className="w-full max-w-lg relative z-10 px-4">
                <div className="bg-white rounded-[3rem] shadow-[0_50px_100px_-20px_rgba(79,70,229,0.1)] border border-blue-50 overflow-hidden flex flex-col">
                    {/* Blue-Indigo Header */}
                    <div className="p-10 pb-6 text-center space-y-2 border-b border-blue-50 bg-gradient-to-r from-blue-700 to-indigo-800">
                        <h2 className="text-xl font-black text-white uppercase tracking-tight">Staff Authentication Hub</h2>
                        <p className="text-blue-100 font-bold text-[10px] uppercase tracking-widest">Select your professional portal to begin</p>
                    </div>

                    <div className="p-10 space-y-8">
                        {/* Dynamic Preview/Icon Area */}
                        <div className="flex justify-center">
                            <div className={`w-32 h-32 rounded-[2.5rem] flex items-center justify-center transition-all duration-700 ${currentRoleData ? `${currentRoleData.bg} ${currentRoleData.color} scale-110 shadow-lg` : 'bg-slate-50 text-slate-200'}`}>
                                <IconComponent className="h-16 w-16" />
                            </div>
                        </div>

                        {/* Role Selector */}
                        <div className="space-y-2 relative">
                            <div className="flex justify-between items-center px-4 mb-2">
                                <label className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Choose Role</label>
                                <LanguageSelector />
                            </div>
                            <Select onValueChange={setSelectedRole} value={selectedRole}>
                                <SelectTrigger className="w-full h-20 rounded-[2rem] border-2 border-slate-100 bg-slate-50 focus:border-indigo-500 focus:bg-white transition-all text-xl font-black uppercase text-slate-700 px-8 flex items-center shadow-sm z-10">
                                    <SelectValue placeholder="Select Staff Identity" />
                                </SelectTrigger>
                                <SelectContent className="rounded-[2.5rem] border-blue-50 p-3 shadow-[0_20px_50px_rgba(79,70,229,0.2)] bg-white/95 backdrop-blur-xl z-[100] min-w-[300px]">
                                    {ROLES.map((role) => (
                                        <SelectItem
                                            key={role.id}
                                            value={role.id}
                                            className="h-16 rounded-[1.5rem] font-black uppercase text-xs tracking-widest text-slate-600 focus:bg-indigo-600 focus:text-white mb-2 cursor-pointer transition-all px-6"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className={`p-2 rounded-xl ${role.bg}`}>
                                                    <role.icon className={`h-4 w-4 ${role.color}`} />
                                                </div>
                                                <span>{role.label}</span>
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Action Button */}
                        <Button
                            onClick={handleEnterPortal}
                            disabled={!selectedRole}
                            className={`w-full h-20 rounded-full font-black text-xl uppercase tracking-widest transition-all duration-500 shadow-xl flex items-center justify-center gap-4 ${selectedRole ? 'bg-indigo-600 hover:bg-indigo-700 text-white translate-y-[-4px] shadow-indigo-100' : 'bg-slate-100 text-slate-300 shadow-none'}`}
                        >
                            Enter Gateway
                            <ArrowRight className={`h-6 w-6 transition-transform duration-500 ${selectedRole ? 'translate-x-2' : ''}`} />
                        </Button>
                    </div>

                    {/* Footer Info */}
                    <div className="px-10 py-6 bg-slate-50/50 border-t border-blue-50 flex items-center justify-between text-[10px] font-black text-indigo-300 uppercase tracking-widest">
                        <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full animate-pulse ${selectedRole ? 'bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)]' : 'bg-slate-200'}`} />
                            <span>{selectedRole ? 'Secure Handshake Ready' : 'Awaiting Selection'}</span>
                        </div>
                        <div className="font-mono text-[9px] text-slate-400">{currentTime.toLocaleTimeString()}</div>
                    </div>
                </div>
            </div>

            {/* Professional Security Notice */}
            <div className="w-full max-w-lg mt-10 px-4">
                <div className="bg-white/50 backdrop-blur border border-blue-100/50 rounded-3xl p-6 flex gap-5 items-start">
                    <AlertTriangle className="h-5 w-5 text-indigo-400 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                        <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">System Protocol:</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase leading-relaxed">
                            Authorized personnel only. All access attempts are cataloged for security auditing. IP: 127.0.0.1
                        </p>
                    </div>
                </div>
            </div>

            {/* Bottom Nav Link */}
            <div className="mt-12 mb-20">
                <button
                    onClick={() => navigate("/")}
                    className="h-12 px-10 border border-slate-200 text-slate-400 hover:text-slate-600 hover:border-slate-300 rounded-full font-black text-[10px] uppercase tracking-[0.2em] transition-all"
                >
                    ← Back to Foundation
                </button>
            </div>

            {/* Bottom Security Footer */}
            <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-blue-50 py-4 px-6 z-50 shadow-[0_-10px_40px_rgba(79,70,229,0.02)]">
                <div className="flex items-center justify-center gap-10 opacity-30 text-indigo-600">
                    <Shield className="h-4 w-4" />
                    <Lock className="h-4 w-4" />
                    <Clock className="h-4 w-4" />
                    <Camera className="h-4 w-4" />
                </div>
            </div>
        </div>
    );
}
