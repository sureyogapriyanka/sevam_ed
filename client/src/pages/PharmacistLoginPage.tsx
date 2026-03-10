import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useLanguage } from "../contexts/LanguageContext";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Alert, AlertDescription } from "../components/ui/alert";
import { AlertCircle, Pill, Search, KeyRound, Clock, Package } from "lucide-react";
import LanguageSelector from "../components/common/LanguageSelector";
import { useToast } from "../hooks/use-toast";

export default function PharmacistLoginPage() {
    const { login } = useAuth();
    const { t } = useLanguage();
    const navigate = useNavigate();
    const { toast } = useToast();
    const [formData, setFormData] = useState({
        username: "",
        password: "",
        shift: "",
        sessionTime: "",
    });
    const [error, setError] = useState("");
    const [selectedStaff, setSelectedStaff] = useState<any>(null);
    const [showProfile, setShowProfile] = useState(false);
    const [loginLoading, setLoginLoading] = useState(false);

    // Sample pharmacist data
    const sampleStaff = [
        {
            id: "PHA001",
            name: "Amit Verma",
            position: "Senior Pharmacist",
            experience: "10+ years",
            image: "https://images.unsplash.com/photo-1614850523296-62c0af475ad7?w=400&h=400&fit=crop&crop=face",
        },
        {
            id: "PHA002",
            name: "Kavita Rao",
            position: "Lead Pharmacist",
            experience: "15+ years",
            image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&h=400&fit=crop&crop=face",
        }
    ];

    const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const username = e.target.value;
        setFormData(prev => ({ ...prev, username }));

        if (username.length >= 3) {
            const staff = sampleStaff.find(s => s.id === username);
            setSelectedStaff(staff || {
                id: username,
                name: "Pharmacy Profile",
                position: "Pharmaceutical Specialist",
                experience: "Inventory Expert",
                image: "https://images.unsplash.com/photo-1576091160550-2173bdb999ef?w=400&h=400&fit=crop&crop=face",
            });
            setShowProfile(true);
        } else {
            setShowProfile(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        if (!formData.username || !formData.password || !formData.shift || !formData.sessionTime) {
            setError("All fields are required");
            return;
        }

        try {
            setLoginLoading(true);
            await login(formData.username, formData.password, {
                shift: formData.shift,
                sessionTime: formData.sessionTime,
                pharmacistName: selectedStaff?.name || "Pharmacist"
            });
            navigate("/pharmacy", { replace: true });
        } catch (err) {
            setError("Invalid credentials. Please try again.");
        } finally {
            setLoginLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f8faff] flex items-center justify-center p-4 md:p-6 relative font-sans overflow-hidden">
            {/* Soft Ambient Background Elements */}
            <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-100 rounded-full blur-[120px] opacity-50" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[30%] h-[30%] bg-indigo-50 rounded-full blur-[100px] opacity-40" />

            <div className="w-full max-w-4xl flex flex-col items-center gap-6 relative z-10">
                {/* Branding */}
                <div className="flex flex-col items-center gap-3 mb-1">
                    <div className="w-10 h-10 md:w-14 md:h-14 bg-white rounded-xl md:rounded-2xl shadow-xl flex items-center justify-center border border-slate-100 transform rotate-6 hover:rotate-0 transition-transform duration-500">
                        <img src="/sevamed logo.png" alt="SevaMed Logo" className="w-6 h-6 md:w-8 md:h-8 object-contain" />
                    </div>
                </div>

                {/* Main Card */}
                <div className="w-full bg-white rounded-[1.2rem] md:rounded-[2.5rem] shadow-[0_10px_20px_-8px_rgba(0,0,0,0.06)] md:shadow-[0_25px_50px_-10px_rgba(0,0,0,0.06)] border border-slate-100 flex flex-col overflow-hidden">
                    {/* Blue Header Section */}
                    <div className="bg-gradient-to-r from-blue-700 to-indigo-800 p-4 pb-8 md:p-6 md:pt-8 md:pb-12 relative">
                        <div className="absolute top-2 right-2 md:top-3 md:right-6">
                            <LanguageSelector />
                        </div>
                        <div className="flex flex-col items-center justify-center gap-0.5 md:gap-1.5 text-white">
                            <div className="flex items-center gap-1.5 md:gap-2">
                                <Pill className="h-3.5 w-3.5 md:h-5 md:w-5 opacity-80" />
                                <h1 className="text-lg md:text-2xl font-black uppercase tracking-tight">Pharmacy Portal</h1>
                            </div>
                            <p className="text-blue-100 font-bold text-[8px] md:text-[10px] uppercase tracking-[0.2em] md:tracking-[0.3em]">Inventory & Dispensing Access</p>
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="flex flex-col lg:flex-row p-4 pt-6 md:p-8 lg:p-10 gap-6 lg:gap-10 mt-[-20px] md:mt-[-30px] bg-white rounded-t-[1.2rem] md:rounded-[2.5rem]">
                        {/* Column 1: Form */}
                        <div className="flex-1 space-y-6 md:space-y-8">
                            {error && (
                                <Alert variant="destructive" className="rounded-2xl border-rose-100 bg-rose-50 text-rose-600 border-2">
                                    <AlertCircle className="h-3.5 w-3.5" />
                                    <AlertDescription className="font-bold text-[10px] md:text-xs">{error}</AlertDescription>
                                </Alert>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-1 md:space-y-1.5">
                                    <Label className="ml-4 md:ml-5 text-[8px] md:text-[9px] font-extrabold text-slate-400 uppercase tracking-widest">Pharmacist ID *</Label>
                                    <div className="relative">
                                        <Input
                                            id="username"
                                            name="username"
                                            value={formData.username}
                                            onChange={handleUsernameChange}
                                            placeholder="pha001"
                                            className="h-10 md:h-12 rounded-full border-2 border-slate-100 bg-slate-50/50 focus:bg-white focus:border-indigo-500 transition-all font-bold text-xs md:text-base px-7 md:px-8 shadow-sm"
                                        />
                                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 md:h-4 md:w-4 text-slate-300" />
                                    </div>
                                </div>

                                <div className="space-y-1 md:space-y-1.5">
                                    <Label className="ml-4 md:ml-5 text-[8px] md:text-[9px] font-extrabold text-slate-400 uppercase tracking-widest">Access Key *</Label>
                                    <Input
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                                        placeholder="••••"
                                        className="h-10 md:h-12 rounded-full border-2 border-slate-100 bg-slate-50/50 focus:bg-white focus:border-indigo-500 transition-all font-bold text-xs md:text-base px-7 md:px-8 shadow-sm"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                                    <div className="space-y-1.5">
                                        <Label className="ml-5 text-[9px] font-extrabold text-slate-400 uppercase tracking-widest">Shift *</Label>
                                        <select
                                            name="shift"
                                            value={formData.shift}
                                            onChange={(e) => setFormData(prev => ({ ...prev, shift: e.target.value }))}
                                            className="w-full h-10 md:h-12 rounded-full border-2 border-slate-100 bg-slate-50/50 focus:bg-white focus:border-indigo-500 transition-all font-bold text-[11px] md:text-[13px] px-5 md:px-6 appearance-none shadow-sm cursor-pointer"
                                        >
                                            <option value="">Shift</option>
                                            <option value="morning">Morning</option>
                                            <option value="afternoon">Afternoon</option>
                                            <option value="night">Night</option>
                                        </select>
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label className="ml-5 text-[9px] font-extrabold text-slate-400 uppercase tracking-widest">Duration *</Label>
                                        <select
                                            name="sessionTime"
                                            value={formData.sessionTime}
                                            onChange={(e) => setFormData(prev => ({ ...prev, sessionTime: e.target.value }))}
                                            className="w-full h-10 md:h-12 rounded-full border-2 border-slate-100 bg-slate-50/50 focus:bg-white focus:border-indigo-500 transition-all font-bold text-[11px] md:text-[13px] px-5 md:px-6 appearance-none shadow-sm cursor-pointer"
                                        >
                                            <option value="">Hours</option>
                                            <option value="8">8 Hours</option>
                                            <option value="12">12 Hours</option>
                                        </select>
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    disabled={loginLoading}
                                    className="w-full h-10 md:h-14 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-black text-sm md:text-base shadow-[0_8px_15px_-4px_rgba(79,70,229,0.3)] md:shadow-[0_15px_30px_-8px_rgba(79,70,229,0.3)] transition-all hover:translate-y-[-2px] md:hover:translate-y-[-3px] active:translate-y-0 gap-2 mt-2 md:mt-4"
                                >
                                    {loginLoading ? <div className="animate-spin rounded-full h-4 w-4 md:h-5 md:w-5 border-b-2 border-white" /> : <Package className="h-4 w-4 md:h-5 md:w-5" />}
                                    PHARMACY LOGIN
                                </Button>
                            </form>

                            {/* Demo Accounts */}
                            <div className="p-3 md:p-4 bg-blue-50/50 rounded-[1rem] md:rounded-[2rem] border border-blue-100 space-y-1.5 md:space-y-2">
                                <div className="flex items-center gap-2">
                                    <Clock className="h-3.5 w-3.5 text-blue-400" />
                                    <p className="text-[8px] md:text-[9px] font-black text-blue-400 uppercase tracking-widest text-center flex-1">Quick Login</p>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                    <button
                                        type="button"
                                        className="text-left p-2.5 bg-white rounded-xl border border-blue-100 hover:border-indigo-400 hover:bg-indigo-50 transition-all cursor-pointer"
                                        onClick={() => {
                                            setFormData(prev => ({ ...prev, username: 'PHAR001', password: 'PHAR2024', shift: prev.shift || 'morning', sessionTime: prev.sessionTime || '8' }));
                                            handleUsernameChange({ target: { value: 'PHAR001' } } as any);
                                        }}
                                    >
                                        <p className="text-[8px] md:text-[9px] font-black text-indigo-600 uppercase">PHAR001</p>
                                        <p className="text-[7px] md:text-[8px] text-slate-400 font-bold leading-tight">Anjali Sharma</p>
                                    </button>
                                    <button
                                        type="button"
                                        className="text-left p-2.5 bg-white rounded-xl border border-blue-100 hover:border-indigo-400 hover:bg-indigo-50 transition-all cursor-pointer"
                                        onClick={() => {
                                            setFormData(prev => ({ ...prev, username: 'NUR002', password: 'PAT2024', shift: prev.shift || 'morning', sessionTime: prev.sessionTime || '8' }));
                                            handleUsernameChange({ target: { value: 'NUR002' } } as any);
                                        }}
                                    >
                                        <p className="text-[8px] md:text-[9px] font-black text-indigo-600 uppercase">NUR002</p>
                                        <p className="text-[7px] md:text-[8px] text-slate-400 font-bold leading-tight">Rohan Gupta</p>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Column 2: Profile Section */}
                        <div className="flex-1 flex flex-col items-center">
                            <div className="w-full h-full min-h-[250px] md:min-h-[400px] bg-gradient-to-br from-slate-50 to-indigo-50/30 rounded-[1.2rem] md:rounded-[2.5rem] border-2 border-dashed border-slate-100 p-4 md:p-8 flex flex-col items-center justify-center text-center shadow-inner relative overflow-hidden group">
                                {showProfile && selectedStaff ? (
                                    <div className="space-y-6 md:space-y-10 animate-in fade-in zoom-in duration-700">
                                        <div className="relative">
                                            <div className="absolute inset-0 bg-indigo-600 rounded-full blur-[30px] opacity-10 group-hover:opacity-20 transition-opacity" />
                                            <div className="w-24 h-24 md:w-48 md:h-48 rounded-full overflow-hidden border-[3px] md:border-[5px] border-white shadow-lg md:shadow-xl relative z-10 transition-transform duration-700 group-hover:scale-105 mx-auto">
                                                <img src={selectedStaff.image} alt={selectedStaff.name} className="w-full h-full object-cover" />
                                            </div>
                                        </div>
                                        <div className="space-y-2 md:space-y-3">
                                            <div className="space-y-0.5 md:space-y-2">
                                                <h2 className="text-lg md:text-2xl font-black text-slate-800 tracking-tight">{selectedStaff.name}</h2>
                                                <p className="text-xs md:text-base font-black text-indigo-600 uppercase tracking-widest">{selectedStaff.position}</p>
                                                <p className="text-slate-400 font-bold uppercase text-[7px] md:text-[8px] tracking-widest">{selectedStaff.experience}</p>
                                            </div>
                                            <div className="bg-indigo-600/10 text-indigo-700 inline-block px-5 md:px-6 py-1.5 md:py-2 rounded-full font-black text-[8px] md:text-[10px] uppercase tracking-widest">
                                                ID: {selectedStaff.id}
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-3 md:space-y-4 opacity-30">
                                        <div className="w-24 h-24 md:w-48 md:h-48 rounded-full bg-amber-100 flex items-center justify-center border-[2px] md:border-[4px] border-white shadow-lg mx-auto">
                                            <Pill className="h-10 w-10 md:h-24 md:w-24 text-amber-200" />
                                        </div>
                                        <div className="space-y-0.5 md:space-y-1">
                                            <p className="text-base md:text-xl font-black text-amber-300 uppercase tracking-tighter">Pharmacy Staff</p>
                                            <p className="text-[8px] md:text-[9px] font-bold text-amber-300 uppercase tracking-widest">Enter ID</p>
                                        </div>
                                    </div>
                                )}

                                {/* Bottom Protocol Notice */}
                                <div className="absolute bottom-3 md:bottom-6 left-3 right-3 md:left-6 md:right-6 bg-white/80 backdrop-blur p-3 md:p-4 rounded-[0.8rem] md:rounded-[1.5rem] border border-blue-50 shadow-sm flex gap-2 md:gap-3 items-start text-left">
                                    <KeyRound className="h-3.5 w-3.5 md:h-4 md:w-4 text-indigo-400 shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-[7px] md:text-[8px] font-black text-indigo-600 uppercase tracking-widest mb-0.5">Protocol:</p>
                                        <p className="text-[7px] md:text-[8px] font-bold text-slate-400 leading-tight uppercase">
                                            Dispensing restricted. Log all transactions.
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
                    className="h-9 md:h-12 rounded-full px-5 md:px-8 border-2 border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-50 font-black text-[8px] md:text-xs uppercase tracking-widest transition-all mb-6 md:mb-10 mt-2 md:mt-0"
                >
                    ← BACK TO STAFF PORTAL
                </Button>
            </div>
        </div>
    );
}
