import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useLanguage } from "../contexts/LanguageContext";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Alert, AlertDescription } from "../components/ui/alert";
import LanguageSelector from "../components/common/LanguageSelector";
import { Shield, AlertCircle, Clock, Lock, X, User, KeyRound } from "lucide-react";

// Admin profiles data - now with actual usernames and passwords for backend authentication
const adminProfiles = [
    {
        id: "ADM001",
        name: "Sure Yoga Priyanka",
        rollNumber: "231FA07046",
        title: "Chief Administrator",
        image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80",
        credentials: { username: "ADM001", password: "YOGA2024" }
    },
    {
        id: "ADM002",
        name: "Bhetapudi Manasa",
        rollNumber: "231FA07036",
        title: "System Administrator",
        image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80",
        credentials: { username: "ADM002", password: "MANASA2024" }
    },
    {
        id: "ADM003",
        name: "Bhimavarapu Bhavana",
        rollNumber: "231FA07049",
        title: "Operations Administrator",
        image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80",
        credentials: { username: "ADM003", password: "BHAVANA2024" }
    }
];

export default function AdminLoginPage() {
    const { login, isLoading } = useAuth();
    const { t } = useLanguage();
    const navigate = useNavigate();
    const [selectedAdmin, setSelectedAdmin] = useState(null);
    const [showLoginForm, setShowLoginForm] = useState(false);
    const [loginLoading, setLoginLoading] = useState(false);
    const [formData, setFormData] = useState({
        registrationNumber: "",
        uniqueCode: "",
        sessionTime: "",
    });
    const [error, setError] = useState("");

    const handleAdminSelect = (admin) => {
        setSelectedAdmin(admin);
        setFormData({
            registrationNumber: admin.credentials.username,
            uniqueCode: "",
            sessionTime: ""
        });
        setShowLoginForm(true);
        setError("");
    };

    const handleCloseForm = () => {
        setShowLoginForm(false);
        setSelectedAdmin(null);
        setFormData({ registrationNumber: "", uniqueCode: "", sessionTime: "" });
        setError("");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!selectedAdmin) {
            setError("No administrator selected.");
            return;
        }

        // Removed the local security code check since we want to validate against the database
        // if (formData.uniqueCode !== selectedAdmin.credentials.code) {
        //     setError("Invalid security code for " + selectedAdmin.name);
        //     return;
        // }

        if (!formData.uniqueCode) {
            setError("Please enter the security code.");
            return;
        }

        if (!formData.sessionTime) {
            setError("Please select session duration.");
            return;
        }

        try {
            setLoginLoading(true);

            // Use the actual username and password for authentication
            await login(formData.registrationNumber, formData.uniqueCode, {
                sessionTime: formData.sessionTime,
                adminName: selectedAdmin.name
            });

            // Wait a moment to ensure token is saved before redirecting
            setTimeout(() => {
                // Verify token exists before redirecting
                const token = localStorage.getItem('token');
                if (token) {
                    // Redirect to admin dashboard after successful login
                    navigate("/admin", { replace: true });
                } else {
                    setError("Authentication failed. Token not received.");
                }
            }, 500);
        } catch (err) {
            setError("Authentication failed. Please verify your credentials.");
        } finally {
            setLoginLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans" data-testid="admin-login-page">
            {/* Soft Ambient Background Elements */}
            <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-100 rounded-full blur-[120px] opacity-40 pointer-events-none" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[30%] h-[30%] bg-indigo-50 rounded-full blur-[100px] opacity-30 pointer-events-none" />

            {/* Subtle grid background */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                style={{
                    backgroundImage: `radial-gradient(circle at 1px 1px, #1e1e1e 1px, transparent 0)`,
                    backgroundSize: "40px 40px"
                }}
            />

            <div className="w-full max-w-4xl relative z-10">
                {/* SevaMed Logo and Header */}
                <div className="text-center mb-6 w-full max-w-md mx-auto">
                    <div className="flex flex-col items-center justify-center mb-2 md:mb-4">
                        <div className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-xl md:rounded-2xl flex items-center justify-center shadow-xl border border-blue-50 transform rotate-3 hover:rotate-0 transition-all duration-500 relative z-30">
                            <img src="/sevamed logo.png" alt="SevaMed Logo" className="w-6 h-6 md:w-8 md:h-8 object-contain" />
                        </div>
                    </div>
                    <div className="bg-gradient-to-r from-blue-700 to-indigo-800 rounded-[1.2rem] md:rounded-[2.5rem] p-4 md:p-6 pb-5 md:pb-8 shadow-[0_10px_20px_-8px_rgba(0,0,0,0.1)] md:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.15)] relative z-20 border border-slate-100 flex flex-col items-center">
                        <h1 className="text-lg md:text-2xl font-black text-white tracking-widest uppercase mb-0.5 md:mb-1 drop-shadow-sm">
                            {t("sevamed_hms")}
                        </h1>
                        <p className="text-indigo-200 font-black text-[8px] md:text-[9px] uppercase tracking-[0.2em] md:tracking-[0.3em] mt-1 mb-1.5 md:mb-3 bg-indigo-900/30 px-2.5 py-1 md:px-4 md:py-1 rounded-full inline-block">Administrator</p>
                        <p className="text-blue-100 font-bold text-[9px] md:text-xs">Security Administrative Portal</p>
                    </div>
                </div>

                {!showLoginForm ? (
                    /* Admin Profile Selection */
                    <Card className="shadow-[0_10px_20px_-8px_rgba(0,0,0,0.1)] md:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] border-slate-100 bg-white/95 backdrop-blur-lg relative z-20 rounded-[1.2rem] md:rounded-[2.5rem] overflow-hidden -mt-6 md:-mt-12 mx-4 md:mx-auto pt-4 md:pt-6">
                        <CardHeader className="bg-transparent text-slate-800 pb-0 pt-3 md:pt-6 rounded-t-[1.5rem] md:rounded-t-[2.5rem]">
                            <CardTitle className="text-center text-base md:text-lg font-bold flex items-center justify-center space-x-2">
                                <Shield className="h-4 w-4 md:h-5 md:w-5 text-indigo-600" />
                                <span>Administrator Profile</span>
                            </CardTitle>
                            <div className="flex justify-center mt-4">
                                <div className="w-56">
                                    <LanguageSelector />
                                </div>
                            </div>
                        </CardHeader>

                        <CardContent className="p-4 md:p-8">
                            <p className="text-center text-slate-400 mb-4 md:mb-6 font-bold text-[8px] md:text-[9px] uppercase tracking-[0.2em] md:tracking-widest px-2">
                                Choose profile to access dashboard
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
                                {adminProfiles.map((admin) => (
                                    <div key={admin.id} className="flex flex-col items-center">
                                        <button
                                            onClick={() => handleAdminSelect(admin)}
                                            className="group w-full bg-white hover:bg-slate-50 border border-slate-200 hover:border-indigo-200 rounded-[1rem] md:rounded-[2rem] p-4 md:p-8 transition-all duration-300 transform hover:scale-[1.02] shadow-sm hover:shadow-xl backdrop-blur-sm relative z-20"
                                        >
                                            {/* Round Profile Image */}
                                            <div className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-3 md:mb-4 rounded-full overflow-hidden border-2 border-slate-100 group-hover:border-indigo-100 transition-all duration-300 shadow-sm flex items-center justify-center bg-slate-50">
                                                {admin.image ? (
                                                    <img src={admin.image} alt={admin.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <User className="h-8 w-8 text-slate-300" />
                                                )}
                                            </div>

                                            {/* Admin Info */}
                                            <div className="text-center">
                                                <h3 className="text-slate-800 font-bold text-sm md:text-base mb-0.5 tracking-tight">{admin.name}</h3>
                                                <p className="text-indigo-600 text-[7px] md:text-[8px] uppercase font-bold tracking-widest mb-0.5">{admin.title}</p>
                                                <p className="text-slate-500 text-[8px] md:text-[9px] font-semibold mt-1.5 md:mt-2 bg-slate-100 py-1 px-2 md:px-2.5 rounded-full inline-block">Roll: {admin.rollNumber}</p>
                                            </div>

                                            {/* Hover Effect */}
                                            <div className="mt-3 md:mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                <div className="flex items-center justify-center space-x-2 text-indigo-600 text-[8px] md:text-[10px] font-black tracking-widest uppercase bg-indigo-50 px-2.5 md:px-3 py-1.5 md:py-2 rounded-full shadow-sm">
                                                    <Lock className="h-3 w-3" />
                                                    <span>Authenticate</span>
                                                </div>
                                            </div>
                                        </button>
                                    </div>
                                ))}
                            </div>

                            {/* Security Notice */}
                            <div className="mt-8 md:mt-10 p-4 md:p-5 bg-blue-50/50 border border-blue-100 rounded-2xl md:rounded-3xl">
                                <p className="text-center text-slate-500 text-[9px] md:text-[10px] font-bold uppercase tracking-[0.15em] md:tracking-widest flex flex-col md:flex-row items-center justify-center gap-2">
                                    <Shield className="h-4 w-4 text-indigo-400 mb-1 md:mb-0" />
                                    <span>All administrator access attempts are logged and monitored for security compliance</span>
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    /* Login Form Popup */
                    <>
                        {/* Overlay */}
                        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" onClick={handleCloseForm}></div>

                        {/* Popup Form */}
                        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
                            <Card className="w-full max-w-md shadow-2xl border-2 border-slate-400/50 bg-white/95 backdrop-blur-md">
                                <CardHeader className="bg-gradient-to-r from-slate-600 to-gray-600 text-white rounded-t-lg relative">
                                    <button
                                        onClick={handleCloseForm}
                                        className="absolute top-4 right-4 text-white hover:text-purple-200 transition-colors"
                                    >
                                        <X className="h-6 w-6" />
                                    </button>

                                    <div className="text-center">
                                        <div className="w-14 h-14 mx-auto mb-3 rounded-full overflow-hidden border-4 border-white/30">
                                            <img
                                                src={selectedAdmin?.image}
                                                alt={selectedAdmin?.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <CardTitle className="text-xl flex items-center justify-center space-x-2">
                                            <User className="h-5 w-5" />
                                            <span>{selectedAdmin?.name}</span>
                                        </CardTitle>
                                        <p className="text-slate-200 text-sm mt-1">{selectedAdmin?.title}</p>
                                    </div>
                                </CardHeader>

                                <CardContent className="p-6">
                                    {error && (
                                        <Alert variant="destructive" className="mb-4">
                                            <AlertCircle className="h-4 w-4" />
                                            <AlertDescription>{error}</AlertDescription>
                                        </Alert>
                                    )}

                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        <div>
                                            <Label htmlFor="registrationNumber" className="text-slate-700">Registration Number</Label>
                                            <Input
                                                id="registrationNumber"
                                                name="registrationNumber"
                                                type="text"
                                                value={formData.registrationNumber}
                                                readOnly
                                                className="border-slate-300 bg-slate-50 text-slate-800"
                                            />
                                        </div>

                                        <div>
                                            <Label htmlFor="uniqueCode" className="text-slate-700">Security Code *</Label>
                                            <Input
                                                id="uniqueCode"
                                                name="uniqueCode"
                                                type="password"
                                                value={formData.uniqueCode}
                                                onChange={handleChange}
                                                placeholder="Enter your unique security code"
                                                required
                                                className="border-slate-300 focus:border-slate-500 bg-white text-slate-800"
                                                data-testid="input-code"
                                            />
                                        </div>

                                        <div>
                                            <Label htmlFor="sessionTime" className="text-slate-700">Session Duration *</Label>
                                            <select
                                                id="sessionTime"
                                                name="sessionTime"
                                                value={formData.sessionTime}
                                                onChange={handleChange}
                                                required
                                                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:border-slate-500 focus:ring-2 focus:ring-slate-200 bg-white text-slate-800"
                                                data-testid="select-session"
                                            >
                                                <option value="">Select session duration</option>
                                                <option value="2">2 Hours</option>
                                                <option value="4">4 Hours</option>
                                                <option value="8">8 Hours (Full Day)</option>
                                                <option value="12">12 Hours (Extended)</option>
                                            </select>
                                        </div>

                                        <Button
                                            type="submit"
                                            className="w-full bg-gradient-to-r from-slate-600 to-gray-600 hover:from-slate-700 hover:to-gray-700 text-white shadow-lg transition-all duration-300 transform hover:scale-105"
                                            disabled={loginLoading}
                                            data-testid="button-admin-login"
                                        >
                                            {loginLoading ? (
                                                <div className="flex items-center space-x-2">
                                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                                    <span>Authenticating...</span>
                                                </div>
                                            ) : (
                                                <div className="flex items-center justify-center space-x-2">
                                                    <KeyRound className="h-4 w-4" />
                                                    <span>Secure Login</span>
                                                </div>
                                            )}
                                        </Button>
                                    </form>
                                </CardContent>
                            </Card>
                        </div>
                    </>
                )}

                <div className="text-center mt-6 md:mt-8 mb-8 md:mb-0">
                    <Button
                        variant="ghost"
                        onClick={() => navigate("/staff-login", { replace: true })}
                        data-testid="link-staff"
                        className="text-slate-600 hover:text-slate-800 hover:bg-slate-200/50 border border-slate-400/30 px-4 py-1 md:px-6 md:py-2 text-[8px] md:text-xs rounded-full"
                    >
                        ← Back to Staff Portal
                    </Button>
                </div>
            </div>
        </div>
    );
}
