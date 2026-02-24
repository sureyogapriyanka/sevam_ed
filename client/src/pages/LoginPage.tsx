import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useLanguage } from "../contexts/LanguageContext";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Alert, AlertDescription } from "../components/ui/alert";
import LanguageSelector from "../components/common/LanguageSelector";
import { Heart, AlertCircle, Search, User, KeyRound, Clock } from "lucide-react";
import { authService } from "../services/api";

export default function LoginPage() {
  const { login, isLoading } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "patient1",
    password: "patient123",
  });
  const [error, setError] = useState("");
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [showPatientProfile, setShowPatientProfile] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(false);

  // Handle username input change to show profile
  const handleUsernameChange = async (username: string) => {
    setFormData(prev => ({ ...prev, username }));

    if (username.length >= 3) {
      setLoadingProfile(true);
      try {
        const { data, error } = await authService.getUserByUsername(username);

        if (data && !error) {
          setSelectedPatient({
            id: data._id,
            username: data.username,
            name: data.name,
            email: data.email,
            profileImage: data.profileImage || null
          });
          setShowPatientProfile(true);
        } else {
          setSelectedPatient({
            id: username,
            name: "yoga priyanka",
            email: "Loading...",
            profileImage: null
          });
          setShowPatientProfile(true);
        }
      } catch (err) {
        setSelectedPatient({
          id: username,
          name: "yoga priyanka",
          email: "yoga.priyanka.patient@example.com",
          profileImage: null
        });
        setShowPatientProfile(true);
      } finally {
        setLoadingProfile(false);
      }
    } else {
      setShowPatientProfile(false);
      setSelectedPatient(null);
    }
  };

  useEffect(() => {
    // Initial fetch for the default demo patient
    handleUsernameChange(formData.username);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      await login(formData.username, formData.password);
      navigate("/login-success", { replace: true });
    } catch (err: any) {
      console.error("Login error:", err);
      if (err.message) {
        setError(err.message);
      } else {
        setError("Authentication failed. Please verify your credentials.");
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.name === 'username') {
      handleUsernameChange(e.target.value);
    } else {
      setFormData(prev => ({
        ...prev,
        [e.target.name]: e.target.value
      }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center p-6 relative font-sans overflow-hidden" data-testid="login-page">
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
                <Heart className="h-6 w-6 opacity-80" />
                <h1 className="text-3xl font-black uppercase tracking-tight">{t("sevamed_hms")}</h1>
              </div>
              <p className="text-blue-100 font-bold text-xs uppercase tracking-[0.3em]">Patient Authentication</p>
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
                  <Label className="ml-6 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Username *</Label>
                  <div className="relative">
                    <Input
                      id="username"
                      name="username"
                      type="text"
                      value={formData.username}
                      onChange={handleChange}
                      placeholder="Enter your username"
                      className="h-16 rounded-full border-2 border-slate-100 bg-slate-50/50 focus:bg-white focus:border-indigo-500 transition-all font-bold text-lg px-10 shadow-sm"
                    />
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="ml-6 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Password *</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="h-16 rounded-full border-2 border-slate-100 bg-slate-50/50 focus:bg-white focus:border-indigo-500 transition-all font-bold text-lg px-10 shadow-sm"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-20 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xl shadow-[0_20px_40px_-10px_rgba(79,70,229,0.3)] transition-all hover:translate-y-[-4px] active:translate-y-0 gap-4 mt-8"
                >
                  {isLoading ? <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white" /> : <User className="h-6 w-6" />}
                  PATIENT LOGIN
                </Button>
              </form>

              {/* Demo Accounts */}
              <div className="p-8 bg-blue-50/50 rounded-[3rem] border border-blue-100 space-y-4">
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-blue-400" />
                  <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em]">Demo Patient Accounts</p>
                </div>
                <div className="grid grid-cols-1 gap-y-2 text-[10px] font-black uppercase">
                  <p className="text-blue-600 flex justify-between">
                    <span>Username: patient1</span>
                    <span className="text-blue-400">Password: patient123</span>
                  </p>
                </div>
              </div>

              <div className="flex justify-center px-6 text-[11px] font-bold uppercase tracking-widest text-slate-400">
                <button onClick={() => navigate("/register")} className="hover:text-indigo-600 transition-colors">Register as new patient</button>
              </div>
            </div>

            {/* Column 2: Profile Section */}
            <div className="flex-1 flex flex-col items-center">
              <div className="w-full h-full min-h-[500px] bg-gradient-to-br from-slate-50 to-indigo-50/30 rounded-[4rem] border-2 border-dashed border-slate-100 p-12 flex flex-col items-center justify-center text-center shadow-inner relative overflow-hidden group">
                {loadingProfile ? (
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
                ) : showPatientProfile && selectedPatient ? (
                  <div className="space-y-10 animate-in fade-in zoom-in duration-700">
                    <div className="relative">
                      <div className="absolute inset-0 bg-indigo-600 rounded-full blur-[40px] opacity-10 group-hover:opacity-20 transition-opacity" />
                      <div className="w-64 h-64 rounded-full overflow-hidden border-[6px] border-white shadow-2xl relative z-10 transition-transform duration-700 group-hover:scale-105 mx-auto bg-slate-100 flex items-center justify-center">
                        {selectedPatient.profileImage ? (
                          <img src={selectedPatient.profileImage} alt={selectedPatient.name} className="w-full h-full object-cover" />
                        ) : (
                          <User className="w-32 h-32 text-slate-300" />
                        )}
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <h2 className="text-4xl font-black text-slate-800 tracking-tight">{selectedPatient.name}</h2>
                        <p className="text-xl font-black text-indigo-600 uppercase tracking-widest">@{selectedPatient.username}</p>
                        <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.3em]">{selectedPatient.email}</p>
                      </div>
                      <div className="bg-indigo-600/10 text-indigo-700 inline-block px-8 py-3 rounded-full font-black text-xs uppercase tracking-widest">
                        ID: {selectedPatient.id?.substring(0, 8) || "N/A"}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6 opacity-30">
                    <div className="w-64 h-64 rounded-full bg-teal-100 flex items-center justify-center border-4 border-white shadow-xl mx-auto">
                      <User className="h-32 w-32 text-teal-200" />
                    </div>
                    <div className="space-y-2">
                      <p className="text-2xl font-black text-teal-300 uppercase tracking-tighter">Patient Profile</p>
                      <p className="text-xs font-bold text-teal-300 uppercase tracking-[0.2em]">Enter username to view</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Back Link */}
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="h-14 rounded-full px-10 border-2 border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-50 font-black text-xs uppercase tracking-widest transition-all mb-12"
        >
          ← BACK TO HOME
        </Button>
      </div>
    </div>
  );
}
