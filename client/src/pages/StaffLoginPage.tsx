import { useState, useEffect } from "react";
import { useLanguage } from "../contexts/LanguageContext";
import { useNavigate } from "react-router-dom";
import LanguageSelector from "../components/common/LanguageSelector";
import {
    Clock, Shield, Stethoscope, Camera,
    ArrowRight, BriefcaseMedical, Landmark,
    Pill, Activity, FileText
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Label } from "../components/ui/label";

const ROLES = [
    {
        id: "admin",
        label: "System Administrator",
        sub: "IT & Infrastructure Oversight",
        icon: Shield,
        path: "/admin-login",
        color: "text-blue-800",
        bg: "bg-blue-100",
    },
    {
        id: "doctor",
        label: "Medical Practitioner",
        sub: "Clinical Systems & Patient Care",
        icon: Stethoscope,
        path: "/doctor-login",
        color: "text-blue-700",
        bg: "bg-blue-50",
    },
    {
        id: "nurse",
        label: "Nursing Staff",
        sub: "Ward Management & Vitals",
        icon: BriefcaseMedical,
        path: "/nurse-login",
        color: "text-blue-600",
        bg: "bg-white border border-blue-100",
    },
    {
        id: "receptionist",
        label: "Front Desk & Administration",
        sub: "Patient Registration & Scheduling",
        icon: Landmark,
        path: "/reception-login",
        color: "text-blue-800",
        bg: "bg-blue-50",
    },
    {
        id: "pharmacist",
        label: "Pharmacy Operations",
        sub: "Dispensary & Inventory Management",
        icon: Pill,
        path: "/pharmacist-login",
        color: "text-blue-700",
        bg: "bg-white border border-blue-100",
    },
];

export default function StaffLoginPage() {
    const { t } = useLanguage();
    const navigate = useNavigate();
    const [currentTime, setCurrentTime] = useState(new Date());
    const [selectedRole, setSelectedRole] = useState<string>("");

    const [sessionId] = useState(() => `AUTH-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`);

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="min-h-screen bg-white flex flex-col lg:flex-row font-sans text-blue-950">
            {/* Left Side: Branding and Information Panel */}
            <div className="hidden lg:flex lg:w-5/12 bg-blue-600 text-white flex-col justify-between p-12 relative overflow-hidden">
                {/* Background Large Logo */}
                <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none mix-blend-overlay">
                    <img src="/sevamed logo.png" alt="" className="w-[150%] max-w-none h-auto object-contain" />
                </div>

                {/* Background Medical Tools Scatter */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-10">
                    <Stethoscope className="absolute top-[10%] left-[10%] w-32 h-32 -rotate-12" />
                    <Pill className="absolute top-[40%] right-[10%] w-24 h-24 rotate-45" />
                    <Activity className="absolute bottom-[20%] left-[20%] w-40 h-40 rotate-[15deg]" />
                    <BriefcaseMedical className="absolute bottom-[10%] right-[20%] w-28 h-28 -rotate-6" />
                    <Shield className="absolute top-[20%] right-[30%] w-20 h-20 rotate-[30deg]" />
                </div>

                <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-16">
                        <div className="bg-white p-2.5 rounded-xl shadow-lg border-2 border-blue-100">
                            <img src="/sevamed logo.png" alt="SevaMed Logo" className="w-8 h-8 md:w-10 md:h-10 object-contain" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black tracking-tight uppercase text-white">SevaMed</h2>
                            <p className="text-blue-100 text-[10px] font-bold tracking-[0.3em] uppercase">Healthcare Systems</p>
                        </div>
                    </div>

                    <h1 className="text-4xl lg:text-5xl font-light mb-6 leading-tight tracking-tight">
                        Integrated Clinical <br />
                        <span className="font-bold text-white">Management Portal</span>
                    </h1>

                    <p className="text-blue-100 mb-12 max-w-md leading-relaxed text-sm">
                        Secure access gateway for credentialed healthcare professionals. Ensure you are operating within a secure network environment before authenticating.
                    </p>

                    <div className="space-y-8">
                        <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-md">
                            <Activity className="w-6 h-6 text-blue-200 shrink-0 mt-0.5" />
                            <div>
                                <h3 className="font-semibold text-white text-sm">System Status</h3>
                                <p className="text-xs text-blue-100 mt-1.5 leading-relaxed">All clinical modules are operating normally. Real-time patient data synchronization is optimally active.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-md">
                            <Shield className="w-6 h-6 text-blue-200 shrink-0 mt-0.5" />
                            <div>
                                <h3 className="font-semibold text-white text-sm">Security Protocol</h3>
                                <p className="text-xs text-blue-100 mt-1.5 leading-relaxed">Military-grade end-to-end encryption enforced. <br /><span className="font-mono text-[10px] text-blue-300 mt-1 block">Session ID: {sessionId}</span></p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-md">
                            <FileText className="w-6 h-6 text-blue-200 shrink-0 mt-0.5" />
                            <div>
                                <h3 className="font-semibold text-white text-sm">Compliance Notice</h3>
                                <p className="text-xs text-blue-100 mt-1.5 leading-relaxed">Accessing patient records is governed by strict privacy laws (HIPAA/GDPR equivalent). Unauthorized access is strictly prohibited.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="relative z-10 flex items-center gap-4 text-[10px] text-blue-200 font-semibold tracking-wider uppercase mt-12">
                    <span>© {new Date().getFullYear()} SevaMed Health</span>
                    <span className="text-blue-400">•</span>
                    <a href="#" className="hover:text-white transition-colors">Privacy</a>
                    <span className="text-blue-400">•</span>
                    <a href="#" className="hover:text-white transition-colors">Terms</a>
                    <span className="text-blue-400">•</span>
                    <a href="#" className="hover:text-white transition-colors">Support</a>
                </div>
            </div>

            {/* Right Side: Login Form */}
            <div className="flex-1 flex flex-col justify-center items-center p-6 sm:p-12 lg:p-24 relative bg-blue-50/30">
                {/* Mobile Background Elements */}
                <div className="lg:hidden absolute top-0 right-0 w-[300px] h-[300px] bg-blue-100 rounded-full blur-[100px] opacity-60 -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                <div className="lg:hidden absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
                    <img src="/sevamed logo.png" alt="" className="w-full max-w-[400px] h-auto object-contain" />
                </div>

                {/* Top Right Language & Time */}
                <div className="absolute top-4 right-4 lg:top-8 lg:right-8 flex items-center gap-4 lg:gap-6 z-20">
                    <div className="hidden sm:flex items-center gap-2 text-xs font-bold text-blue-600 bg-white px-4 py-2 rounded-full shadow-sm border border-blue-100 tracking-wider">
                        <Clock className="w-3.5 h-3.5" />
                        {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </div>
                    <LanguageSelector />
                </div>

                <div className="w-full max-w-[420px] relative z-10">
                    {/* Mobile Header (Hidden on Desktop) */}
                    <div className="lg:hidden flex flex-col items-center mb-10 text-center">
                        <div className="bg-white p-3 rounded-2xl shadow-xl shadow-blue-500/10 border border-blue-100 mb-5 relative">
                            <div className="absolute inset-0 bg-blue-500 blur-xl opacity-10 rounded-full"></div>
                            <img src="/sevamed logo.png" alt="SevaMed Logo" className="w-10 h-10 object-contain relative z-10" />
                        </div>
                        <h1 className="text-2xl font-black text-blue-950 mb-1 tracking-tight">{t("sevamed_hms")}</h1>
                        <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em]">Access Gateway</p>
                    </div>

                    <div className="mb-8 lg:mb-12 text-center lg:text-left">
                        <h2 className="text-2xl lg:text-3xl font-bold text-blue-950 mb-2 tracking-tight">Staff Authentication</h2>
                        <p className="text-blue-600/80 text-sm font-medium">Please verify your identity to access the facility dashboard.</p>
                    </div>

                    <div className="space-y-5">

                        <div className="space-y-2 relative z-50">
                            <Label className="text-xs font-bold text-blue-900 uppercase tracking-wider ml-1">Role Designation <span className="text-red-500">*</span></Label>
                            <Select onValueChange={(val) => {
                                setSelectedRole(val);
                                const role = ROLES.find(r => r.id === val);
                                if (role) {
                                    navigate(role.path);
                                }
                            }} value={selectedRole}>
                                <SelectTrigger className="w-full h-14 bg-white border-blue-100 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all font-semibold text-blue-950 rounded-xl px-4 shadow-sm hover:border-blue-300">
                                    <SelectValue placeholder="Select your functional role..." />
                                </SelectTrigger>
                                <SelectContent className="bg-white border-blue-100 shadow-2xl rounded-xl p-1 z-50">
                                    {ROLES.map((role) => (
                                        <SelectItem
                                            key={role.id}
                                            value={role.id}
                                            className="focus:bg-blue-50 focus:text-blue-900 cursor-pointer rounded-lg mb-1 last:mb-0 p-2 lg:p-3 transition-colors"
                                        >
                                            <div className="flex items-center gap-3 md:gap-4">
                                                <div className={`p-2 rounded-lg ${role.bg}`}>
                                                    <role.icon className={`h-4 w-4 md:h-5 md:w-5 ${role.color}`} />
                                                </div>
                                                <div className="flex flex-col text-left">
                                                    <span className="font-bold text-blue-950 text-sm">{role.label}</span>
                                                    <span className="text-[10px] text-blue-600 font-semibold">{role.sub}</span>
                                                </div>
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="mt-8 lg:mt-12 text-center text-[11px] text-blue-400 border-t border-blue-100/50 pt-6">
                        <p className="flex items-center justify-center gap-2 font-bold uppercase tracking-wider">
                            <Shield className="w-3.5 h-3.5 text-blue-500" />
                            Secure Connection Verified
                            <span className="text-blue-200 mx-1">•</span>
                            <Camera className="w-3.5 h-3.5 text-blue-400" />
                            Session Monitored
                        </p>
                    </div>

                    {/* Back Button */}
                    <div className="mt-8 text-center pb-8 lg:pb-0">
                        <button
                            onClick={() => navigate("/")}
                            className="text-xs font-bold text-blue-400 hover:text-blue-700 transition-colors uppercase tracking-wider flex items-center justify-center gap-2 mx-auto"
                        >
                            <ArrowRight className="w-3.5 h-3.5 rotate-180" />
                            Return to Patient Portal
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
