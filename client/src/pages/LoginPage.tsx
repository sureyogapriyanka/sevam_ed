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
      navigate("/patient", { replace: true });
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
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center p-4 md:p-6 relative font-sans overflow-hidden" data-testid="login-page">
      {/* Soft Ambient Background Elements */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-100 rounded-full blur-[120px] opacity-50" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[30%] h-[30%] bg-indigo-50 rounded-full blur-[100px] opacity-40" />

      <div className="w-full max-w-4xl flex flex-col items-center gap-6 relative z-10">
        {/* Branding */}
        <div className="flex flex-col items-center gap-3 mb-1">
          <div className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-xl md:rounded-2xl shadow-xl flex items-center justify-center border border-slate-100 transform -rotate-3 hover:rotate-0 transition-transform duration-500">
            <img src="/sevamed logo.png" alt="SevaMed Logo" className="w-6 h-6 md:w-8 md:h-8 object-contain" />
          </div>
        </div>

        {/* Main Card */}
        <div className="w-full bg-white rounded-[1.2rem] md:rounded-[2.5rem] shadow-[0_10px_20px_-8px_rgba(0,0,0,0.1)] md:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.15)] border border-slate-200 flex flex-col overflow-hidden">
          {/* Blue Header Section */}
          <div className="bg-gradient-to-r from-blue-700 to-indigo-800 p-4 pb-8 md:p-6 md:pt-8 md:pb-10 relative">
            <div className="absolute top-3 right-3 md:right-6">
              <LanguageSelector />
            </div>
            <div className="flex flex-col items-center justify-center gap-1.5 text-white">
              <div className="flex items-center gap-2">
                <Heart className="h-4 w-4 md:h-5 md:w-5 opacity-80" />
                <h1 className="text-xl md:text-2xl font-black uppercase tracking-tight">{t("sevamed_hms")}</h1>
              </div>
              <p className="text-blue-100 font-bold text-[9px] md:text-[10px] uppercase tracking-[0.2em] md:tracking-[0.3em]">Patient Authentication</p>
            </div>
          </div>

          {/* Content Section */}
          <div className="flex flex-col lg:flex-row p-3 pt-6 md:p-8 lg:p-10 gap-5 lg:gap-10 mt-[-20px] md:mt-[-30px] bg-white rounded-t-[1.2rem] md:rounded-[2.5rem]">
            {/* Column 1: Form */}
            <div className="flex-1 space-y-4 md:space-y-6">
              {error && (
                <Alert variant="destructive" className="rounded-3xl border-rose-100 bg-rose-50 text-rose-600 border-2">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="font-bold">{error}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-1 md:space-y-1.5">
                  <Label className="ml-4 md:ml-5 text-[8px] md:text-[9px] font-extrabold text-slate-400 uppercase tracking-widest">Username *</Label>
                  <div className="relative">
                    <Input
                      id="username"
                      name="username"
                      type="text"
                      value={formData.username}
                      onChange={handleChange}
                      placeholder="Enter username"
                      className="h-10 md:h-12 rounded-full border-2 border-slate-100 bg-slate-50/50 focus:bg-white focus:border-indigo-500 transition-all font-bold text-xs md:text-sm px-7 md:px-8 shadow-sm"
                    />
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3 w-3 md:h-4 md:w-4 text-slate-300" />
                  </div>
                </div>

                <div className="space-y-1 md:space-y-1.5">
                  <Label className="ml-4 md:ml-5 text-[8px] md:text-[9px] font-extrabold text-slate-400 uppercase tracking-widest">Password *</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="h-10 md:h-12 rounded-full border-2 border-slate-100 bg-slate-50/50 focus:bg-white focus:border-indigo-500 transition-all font-bold text-xs md:text-sm px-7 md:px-8 shadow-sm"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-11 md:h-14 rounded-full bg-blue-700 hover:bg-blue-800 text-white font-black text-sm md:text-base shadow-[0_8px_16px_-4px_rgba(59,130,246,0.3)] md:shadow-[0_15px_30px_-8px_rgba(59,130,246,0.3)] transition-all hover:translate-y-[-2px] active:translate-y-0 gap-3 mt-3 md:mt-4"
                >
                  {isLoading ? <div className="animate-spin rounded-full h-4 w-4 md:h-5 md:w-5 border-b-2 border-white" /> : <KeyRound className="h-4 w-4 md:h-5 md:w-5" />}
                  PATIENT LOGIN
                </Button>
              </form>

              {/* Demo Accounts */}
              <div className="p-3 md:p-5 bg-blue-50/50 rounded-[1rem] md:rounded-[2rem] border border-blue-100 space-y-2 md:space-y-3">
                <div className="flex items-center gap-2">
                  <Clock className="h-3 w-3 md:h-4 md:w-4 text-blue-400" />
                  <p className="text-[8px] md:text-[9px] font-black text-blue-400 uppercase tracking-widest">Demo Accounts</p>
                </div>
                <div className="flex flex-col sm:flex-row justify-between gap-1.5 border-t border-blue-100 pt-2 md:pt-3">
                  <div className="flex flex-col">
                    <span className="text-[7px] md:text-[8px] font-bold text-slate-400 uppercase tracking-wider">User: patient1</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[7px] md:text-[8px] font-bold text-slate-400 uppercase tracking-wider">Pass: patient123</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-center px-4 text-[9px] font-bold uppercase tracking-widest text-slate-400">
                <button onClick={() => navigate("/register")} className="hover:text-indigo-600 transition-colors">Register new patient</button>
              </div>
            </div>

            {/* Column 2: Profile Section */}
            <div className="flex-1 flex flex-col items-center">
              <div className="w-full h-full min-h-[200px] md:min-h-[350px] bg-gradient-to-br from-slate-50 to-blue-50/30 rounded-[1.2rem] md:rounded-[2.5rem] border-2 border-dashed border-slate-200 p-4 md:p-8 flex flex-col items-center justify-center text-center shadow-inner relative overflow-hidden group">
                {loadingProfile ? (
                  <div className="animate-spin rounded-full h-10 w-10 md:h-12 md:w-12 border-b-2 border-indigo-600" />
                ) : showPatientProfile && selectedPatient ? (
                  <div className="space-y-4 md:space-y-6 animate-in fade-in zoom-in duration-700">
                    <div className="relative">
                      <div className="absolute inset-0 bg-indigo-600 rounded-full blur-[30px] opacity-10 group-hover:opacity-20 transition-opacity" />
                      <div className="w-20 h-20 md:w-40 md:h-40 rounded-full overflow-hidden border-[3px] md:border-[4px] border-white shadow-lg md:shadow-xl relative z-10 transition-transform duration-700 group-hover:scale-105 mx-auto bg-slate-100 flex items-center justify-center">
                        {selectedPatient.profileImage ? (
                          <img src={selectedPatient.profileImage} alt={selectedPatient.name} className="w-full h-full object-cover" />
                        ) : (
                          <User className="w-12 h-12 md:w-20 md:h-20 text-slate-300" />
                        )}
                      </div>
                    </div>
                    <div className="space-y-2 md:space-y-3">
                      <div className="space-y-0.5">
                        <h2 className="text-lg md:text-2xl font-black text-slate-800 tracking-tight">{selectedPatient.name}</h2>
                        <p className="text-xs md:text-base font-black text-indigo-600 uppercase tracking-widest">@{selectedPatient.username}</p>
                        <p className="text-slate-400 font-bold uppercase text-[7px] md:text-[8px] tracking-[0.2em] truncate max-w-[150px] md:max-w-none mx-auto">{selectedPatient.email}</p>
                      </div>
                      <div className="bg-indigo-600/10 text-indigo-700 inline-block px-4 md:px-6 py-1.5 md:py-2 rounded-full font-black text-[8px] md:text-[10px] uppercase tracking-widest">
                        ID: {selectedPatient.id?.substring(0, 8) || "N/A"}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3 md:space-y-4 opacity-30">
                    <div className="w-16 h-16 md:w-32 md:h-32 rounded-full bg-teal-100 flex items-center justify-center border-2 border-white shadow-md mx-auto">
                      <User className="h-8 w-8 md:h-16 md:w-16 text-teal-200" />
                    </div>
                    <div className="space-y-0.5 md:space-y-1">
                      <p className="text-sm md:text-lg font-black text-teal-300 uppercase tracking-tighter">Profile Preview</p>
                      <p className="text-[7px] md:text-[8px] font-bold text-teal-300 uppercase tracking-widest">Enter user to view</p>
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
          className="h-8 md:h-11 rounded-full px-6 border-2 border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-50 font-black text-[8px] md:text-[11px] uppercase tracking-widest transition-all mb-4 md:mb-6 mt-3 md:mt-0"
        >
          ← BACK TO HOME
        </Button>
      </div>
    </div>
  );
}
