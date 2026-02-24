import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useLanguage } from "../contexts/LanguageContext";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Alert, AlertDescription } from "../components/ui/alert";
import LanguageSelector from "../components/common/LanguageSelector";
import { Stethoscope, AlertCircle, Clock, User, X, KeyRound, Search } from "lucide-react";
import { useToast } from "../hooks/use-toast";
import { ToastAction } from "../components/ui/toast";

export default function DoctorLoginPage() {
    const { login, isLoading } = useAuth();
    const { t } = useLanguage();
    const navigate = useNavigate();
    const { toast } = useToast();
    const [formData, setFormData] = useState({
        username: "DOC001",
        password: "CARDIO2024",
        department: "cardiology",
        sessionTime: "8",
    });
    const [error, setError] = useState("");
    const [selectedDoctor, setSelectedDoctor] = useState<any>(null);
    const [showDoctorProfile, setShowDoctorProfile] = useState(false);
    const [loginLoading, setLoginLoading] = useState(false);

    useEffect(() => {
        // Initial fetch for the default demo doctor
        handleUsernameChange({ target: { value: formData.username } } as any);
    }, []);

    // Sample doctor data
    const sampleDoctors = [
        {
            id: "DOC001",
            name: "Dr. Sure Yoga Priyanka",
            specialization: "Cardiology",
            experience: "15+ years",
            image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&crop=face",
        },
        {
            id: "DOC002",
            name: "Dr. Bhetapudi Manasa",
            specialization: "Neurology",
            experience: "12+ years",
            image: "https://images.unsplash.com/photo-1594824313347-1684dc5de8e8?w=400&h=400&fit=crop&crop=face",
        },
        {
            id: "DOC003",
            name: "Dr. Bhimavarapu Bhavana",
            specialization: "Emergency Medicine",
            experience: "10+ years",
            image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&h=400&fit=crop&crop=face",
        }
    ];

    const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const username = e.target.value;
        setFormData(prev => ({ ...prev, username }));

        if (username.length >= 3) {
            const doctor = sampleDoctors.find(d => d.id === username);
            setSelectedDoctor(doctor || {
                id: username,
                name: "Doctor Profile",
                specialization: "Medical Professional",
                experience: "Experienced Practitioner",
                image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop&crop=face",
            });
            setShowDoctorProfile(true);
        } else {
            setShowDoctorProfile(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        if (!formData.username || !formData.password || !formData.department || !formData.sessionTime) {
            setError("All fields are required");
            return;
        }

        try {
            setLoginLoading(true);
            await login(formData.username, formData.password, {
                department: formData.department,
                sessionTime: formData.sessionTime,
                doctorName: selectedDoctor?.name || "Doctor"
            });
            navigate("/doctor", { replace: true });
        } catch (err) {
            setError("Invalid credentials. Please try again.");
        } finally {
            setLoginLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center p-6 relative font-sans overflow-hidden">
            {/* Soft Ambient Background Elements */}
            <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-100 rounded-full blur-[120px] opacity-50" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[30%] h-[30%] bg-indigo-50 rounded-full blur-[100px] opacity-40" />

            <div className="w-full max-w-6xl flex flex-col items-center gap-8 relative z-10">
                {/* Branding */}
                <div className="flex flex-col items-center gap-4 mb-2">
                    <div className="w-16 h-16 bg-white rounded-3xl shadow-2xl flex items-center justify-center border border-slate-100 transform -rotate-3 hover:rotate-0 transition-transform duration-500">
                        <img src="/sevamed logo.png" alt="SevaMed Logo" className="w-10 h-10 object-contain" />
                    </div>
                </div>

                {/* Main Card */}
                <div className="w-full bg-white rounded-[4rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.15)] border border-slate-200 flex flex-col overflow-hidden">
                    {/* Blue Header Section */}
                    <div className="bg-gradient-to-r from-blue-700 to-indigo-800 p-8 pt-12 pb-16 relative">
                        <div className="absolute top-4 right-8">
                            <LanguageSelector />
                        </div>
                        <div className="flex flex-col items-center justify-center gap-2 text-white">
                            <div className="flex items-center gap-3">
                                <User className="h-6 w-6 opacity-80" />
                                <h1 className="text-3xl font-black uppercase tracking-tight">Doctor Authentication</h1>
                            </div>
                            <p className="text-blue-100/80 font-bold text-xs uppercase tracking-[0.3em]">Professional Gateway</p>
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="flex flex-col lg:flex-row p-12 lg:p-16 gap-16 mt-[-40px] bg-white rounded-t-[4rem]">
                        {/* Column 1: Form */}
                        <div className="flex-1 space-y-8">
                            {error && (
                                <Alert variant="destructive" className="rounded-3xl border-rose-100 bg-rose-50 text-rose-600 border-2">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertDescription className="font-bold">{error}</AlertDescription>
                                </Alert>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <Label className="ml-6 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Doctor ID *</Label>
                                    <div className="relative">
                                        <Input
                                            id="username"
                                            name="username"
                                            value={formData.username}
                                            onChange={handleUsernameChange}
                                            placeholder="syp"
                                            className="h-16 rounded-full border-2 border-slate-100 bg-slate-50/50 focus:bg-white focus:border-indigo-500 transition-all font-bold text-lg px-10 shadow-sm"
                                        />
                                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label className="ml-6 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Password *</Label>
                                    <Input
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                                        placeholder="•••"
                                        className="h-16 rounded-full border-2 border-slate-100 bg-slate-50/50 focus:bg-white focus:border-indigo-500 transition-all font-bold text-lg px-10 shadow-sm"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label className="ml-6 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Department *</Label>
                                        <select
                                            name="department"
                                            value={formData.department}
                                            onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                                            className="w-full h-16 rounded-full border-2 border-slate-100 bg-slate-50/50 focus:bg-white focus:border-indigo-500 transition-all font-bold text-sm px-8 appearance-none shadow-sm cursor-pointer"
                                        >
                                            <option value="">Select Department</option>
                                            <option value="cardiology">Cardiology</option>
                                            <option value="neurology">Neurology</option>
                                            <option value="orthopedics">Orthopedics</option>
                                            <option value="pediatrics">Pediatrics</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="ml-6 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Shift Duration *</Label>
                                        <select
                                            name="sessionTime"
                                            value={formData.sessionTime}
                                            onChange={(e) => setFormData(prev => ({ ...prev, sessionTime: e.target.value }))}
                                            className="w-full h-16 rounded-full border-2 border-slate-100 bg-slate-50/50 focus:bg-white focus:border-indigo-500 transition-all font-bold text-sm px-8 appearance-none shadow-sm cursor-pointer"
                                        >
                                            <option value="">Select Shift</option>
                                            <option value="8">8 Hours</option>
                                            <option value="12">12 Hours</option>
                                        </select>
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    disabled={loginLoading}
                                    className="w-full h-20 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xl shadow-[0_20px_40px_-10px_rgba(79,70,229,0.3)] transition-all hover:translate-y-[-4px] active:translate-y-0 gap-4 mt-8"
                                >
                                    {loginLoading ? <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white" /> : <Stethoscope className="h-6 w-6" />}
                                    DOCTOR LOGIN
                                </Button>
                            </form>

                            {/* Demo Accounts */}
                            <div className="p-8 bg-blue-50/50 rounded-[3rem] border border-blue-100 space-y-4">
                                <div className="flex items-center gap-3">
                                    <Stethoscope className="h-5 w-5 text-blue-500" />
                                    <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em]">Demo Doctor Account</p>
                                </div>
                                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                                    <p className="text-blue-700">USERNAME: <span className="text-blue-400">DOC001</span></p>
                                    <p className="text-blue-700">PASSWORD: <span className="text-blue-400">CARDIO2024</span></p>
                                </div>
                            </div>
                        </div>

                        {/* Column 2: Profile Section */}
                        <div className="flex-1 flex flex-col items-center">
                            <div className="w-full h-full min-h-[500px] bg-gradient-to-br from-slate-50 to-indigo-50/30 rounded-[4rem] border-2 border-dashed border-slate-100 p-12 flex flex-col items-center justify-center text-center shadow-inner relative overflow-hidden group">
                                {showDoctorProfile && selectedDoctor ? (
                                    <div className="space-y-10 animate-in fade-in zoom-in duration-700">
                                        <div className="relative">
                                            <div className="absolute inset-0 bg-indigo-600 rounded-full blur-[40px] opacity-10 group-hover:opacity-20 transition-opacity" />
                                            <div className="w-64 h-64 rounded-full overflow-hidden border-[6px] border-white shadow-2xl relative z-10 transition-transform duration-700 group-hover:scale-105">
                                                <img src={selectedDoctor.image} alt={selectedDoctor.name} className="w-full h-full object-cover" />
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            <div className="space-y-1">
                                                <h2 className="text-4xl font-black text-slate-800 tracking-tight">{selectedDoctor.name}</h2>
                                                <p className="text-xl font-black text-indigo-600 uppercase tracking-widest">{selectedDoctor.specialization}</p>
                                                <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.3em]">{selectedDoctor.experience}</p>
                                            </div>
                                            <div className="bg-indigo-600/10 text-indigo-700 inline-block px-8 py-3 rounded-full font-black text-xs uppercase tracking-widest">
                                                Username: {selectedDoctor.id}
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-6 opacity-30">
                                        <div className="w-64 h-64 rounded-full bg-slate-100 flex items-center justify-center border-4 border-white shadow-xl mx-auto">
                                            <User className="h-32 w-32 text-slate-200" />
                                        </div>
                                        <div className="space-y-2">
                                            <p className="text-2xl font-black text-slate-300 uppercase tracking-tighter">Doctor Profile</p>
                                            <p className="text-xs font-bold text-slate-300 uppercase tracking-[0.2em]">Enter ID to reveal identity</p>
                                        </div>
                                    </div>
                                )}

                                {/* Bottom Medical Protocol Notice */}
                                <div className="absolute bottom-10 left-10 right-10 bg-white/80 backdrop-blur p-6 rounded-[2.5rem] border border-blue-50 shadow-sm flex gap-4 items-start text-left">
                                    <Clock className="h-5 w-5 text-indigo-400 shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-1">Medical Protocol:</p>
                                        <p className="text-[10px] font-bold text-slate-400 leading-relaxed uppercase">
                                            Please ensure you comply with patient privacy regulations and hospital policies during your session.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Back Link */}
                <Button
                    variant="ghost"
                    onClick={() => navigate("/staff-login")}
                    className="h-14 rounded-full px-10 border-2 border-slate-100 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 font-black text-xs uppercase tracking-widest transition-all"
                >
                    ← BACK TO STAFF PORTAL
                </Button>
            </div>
        </div>
    );
}
