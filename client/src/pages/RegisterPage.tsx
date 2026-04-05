import { useState, useRef, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useLanguage } from "../contexts/LanguageContext";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Alert, AlertDescription } from "../components/ui/alert";
import LanguageSelector from "../components/common/LanguageSelector";
import AuthSuccessMessage from "../components/common/AuthSuccessMessage";
import { Heart, AlertCircle, Upload, User } from "lucide-react";
import { authService } from "../services/api";

export default function RegisterPage() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    name: "",
    email: "",
    phone: "",
    role: "patient", // Fixed to patient
    age: "",
    gender: "",
    address: "",
    bloodGroup: ""
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // Prepare form data including profile image if available
      const submitData = {
        ...formData,
        age: formData.age ? parseInt(formData.age) : null,
        profileImage: previewImage || null // Include the profile image data
      };

      const { error } = await authService.register(submitData);
      if (error) throw new Error(error);
      setSuccess(true);
      // Redirect to success page
      navigate("/register-success", { replace: true });
    } catch (err: any) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check if file is an image
      if (!file.type.match('image.*')) {
        setError("Please upload a valid image file (JPEG, PNG, GIF)");
        return;
      }

      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size should be less than 5MB");
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  if (success) {
    // This will now redirect to the success page
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center p-4 md:p-6 relative font-sans overflow-hidden" data-testid="register-page">
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
              <p className="text-blue-100 font-bold text-[9px] md:text-[10px] uppercase tracking-[0.2em] md:tracking-[0.3em]">Patient Registration</p>
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
                  <Label className="ml-4 md:ml-5 text-[8px] md:text-[9px] font-extrabold text-slate-400 uppercase tracking-widest">Full Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    required
                    className="h-10 md:h-12 rounded-full border-2 border-slate-100 bg-slate-50/50 focus:bg-white focus:border-indigo-500 transition-all font-bold text-xs md:text-sm px-7 md:px-8 shadow-sm"
                    data-testid="input-name"
                  />
                </div>

                <div className="space-y-1 md:space-y-1.5">
                  <Label className="ml-4 md:ml-5 text-[8px] md:text-[9px] font-extrabold text-slate-400 uppercase tracking-widest">Username *</Label>
                  <Input
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="johndoe"
                    required
                    className="h-10 md:h-12 rounded-full border-2 border-slate-100 bg-slate-50/50 focus:bg-white focus:border-indigo-500 transition-all font-bold text-xs md:text-sm px-7 md:px-8 shadow-sm"
                    data-testid="input-username"
                  />
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
                    required
                    className="h-10 md:h-12 rounded-full border-2 border-slate-100 bg-slate-50/50 focus:bg-white focus:border-indigo-500 transition-all font-bold text-xs md:text-sm px-7 md:px-8 shadow-sm"
                    data-testid="input-password"
                  />
                </div>

                <div className="space-y-1 md:space-y-1.5">
                  <Label className="ml-4 md:ml-5 text-[8px] md:text-[9px] font-extrabold text-slate-400 uppercase tracking-widest">Email Address</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    className="h-10 md:h-12 rounded-full border-2 border-slate-100 bg-slate-50/50 focus:bg-white focus:border-indigo-500 transition-all font-bold text-xs md:text-sm px-7 md:px-8 shadow-sm"
                    data-testid="input-email"
                  />
                </div>

                <div className="space-y-1 md:space-y-1.5">
                  <Label className="ml-4 md:ml-5 text-[8px] md:text-[9px] font-extrabold text-slate-400 uppercase tracking-widest">Phone Number</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91 00000 00000"
                    className="h-10 md:h-12 rounded-full border-2 border-slate-100 bg-slate-50/50 focus:bg-white focus:border-indigo-500 transition-all font-bold text-xs md:text-sm px-7 md:px-8 shadow-sm"
                    data-testid="input-phone"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1 md:space-y-1.5">
                    <Label className="ml-4 md:ml-5 text-[8px] md:text-[9px] font-extrabold text-slate-400 uppercase tracking-widest">Age</Label>
                    <Input
                      id="age"
                      name="age"
                      type="number"
                      value={formData.age}
                      onChange={handleChange}
                      placeholder="25"
                      className="h-10 md:h-12 rounded-full border-2 border-slate-100 bg-slate-50/50 focus:bg-white focus:border-indigo-500 transition-all font-bold text-xs md:text-sm px-7 md:px-8 shadow-sm"
                      data-testid="input-age"
                    />
                  </div>

                  <div className="space-y-1 md:space-y-1.5">
                    <Label className="ml-4 md:ml-5 text-[8px] md:text-[9px] font-extrabold text-slate-400 uppercase tracking-widest">Gender</Label>
                    <Select name="gender" value={formData.gender} onValueChange={(value) => handleSelectChange("gender", value)}>
                      <SelectTrigger className="h-10 md:h-12 rounded-full border-2 border-slate-100 bg-slate-50/50 focus:bg-white focus:border-indigo-500 transition-all font-bold text-[10px] md:text-xs px-7 md:px-8 shadow-sm uppercase tracking-widest">
                        <SelectValue placeholder="Gender" />
                      </SelectTrigger>
                      <SelectContent className="bg-white rounded-2xl border-2 border-slate-100">
                        <SelectItem value="Male" className="font-bold text-[10px] md:text-xs uppercase tracking-widest">Male</SelectItem>
                        <SelectItem value="Female" className="font-bold text-[10px] md:text-xs uppercase tracking-widest">Female</SelectItem>
                        <SelectItem value="Other" className="font-bold text-[10px] md:text-xs uppercase tracking-widest">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-1 md:space-y-1.5">
                  <Label className="ml-4 md:ml-5 text-[8px] md:text-[9px] font-extrabold text-slate-400 uppercase tracking-widest">Blood Group</Label>
                  <Select name="bloodGroup" value={formData.bloodGroup} onValueChange={(value) => handleSelectChange("bloodGroup", value)}>
                    <SelectTrigger className="h-10 md:h-12 rounded-full border-2 border-slate-100 bg-slate-50/50 focus:bg-white focus:border-indigo-500 transition-all font-bold text-[10px] md:text-xs px-7 md:px-8 shadow-sm uppercase tracking-widest">
                      <SelectValue placeholder="Blood Group" />
                    </SelectTrigger>
                    <SelectContent className="bg-white rounded-2xl border-2 border-slate-100 h-48">
                      {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(bg => (
                        <SelectItem key={bg} value={bg} className="font-bold text-[10px] md:text-xs uppercase tracking-widest">{bg}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1 md:space-y-1.5">
                  <Label className="ml-4 md:ml-5 text-[8px] md:text-[9px] font-extrabold text-slate-400 uppercase tracking-widest">Address</Label>
                  <Input
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="123 Health St, Medical City"
                    className="h-10 md:h-12 rounded-full border-2 border-slate-100 bg-slate-50/50 focus:bg-white focus:border-indigo-500 transition-all font-bold text-xs md:text-sm px-7 md:px-8 shadow-sm"
                    data-testid="input-address"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="ml-4 md:ml-5 text-[8px] md:text-[9px] font-extrabold text-slate-400 uppercase tracking-widest">Profile Photo</Label>
                  <div className="flex items-center space-x-3 ml-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={triggerFileInput}
                      className="flex items-center space-x-2 h-10 md:h-12 rounded-full border-2 border-slate-100 bg-slate-50/50 hover:bg-slate-100 text-slate-400 font-black px-6"
                    >
                      <Upload className="h-4 w-4" />
                      <span className="text-[10px] uppercase tracking-widest">UPLOAD</span>
                    </Button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageUpload}
                      accept="image/*"
                      className="hidden"
                    />
                    {previewImage && (
                      <div className="w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden border-2 border-indigo-400 shadow-md">
                        <img
                          src={previewImage}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                  </div>
                  <p className="text-[8px] text-slate-300 font-bold uppercase mt-1 ml-5">Max size 5MB (JPG/PNG)</p>
                </div>

                <Button
                  type="submit"
                  className="w-full h-11 md:h-14 rounded-full bg-blue-700 hover:bg-blue-800 text-white font-black text-sm md:text-base shadow-[0_8px_16px_-4px_rgba(59,130,246,0.3)] md:shadow-[0_15px_30px_-8px_rgba(59,130,246,0.3)] transition-all hover:translate-y-[-2px] active:translate-y-0 gap-3 mt-3 md:mt-4 uppercase tracking-widest"
                  disabled={isLoading}
                  data-testid="button-register"
                >
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-4 w-4 md:h-5 md:w-5 border-b-2 border-white" />
                  ) : (
                    "REGISTER ACCOUNT"
                  )}
                </Button>
              </form>
            </div>


            {/* Column 2: Profile Preview */}
            <div className="flex-1 flex flex-col items-center">
              <div className="w-full h-full min-h-[200px] md:min-h-[350px] bg-gradient-to-br from-slate-50 to-blue-50/30 rounded-[1.2rem] md:rounded-[2.5rem] border-2 border-dashed border-slate-200 p-4 md:p-8 flex flex-col items-center justify-center text-center shadow-inner relative overflow-hidden group">
                <div className="space-y-4 md:space-y-6">
                  <div className="relative">
                    <div className="absolute inset-0 bg-indigo-600 rounded-full blur-[30px] opacity-10 group-hover:opacity-20 transition-opacity" />
                    <div className="w-20 h-20 md:w-40 md:h-40 rounded-full overflow-hidden border-[3px] md:border-[4px] border-white shadow-lg md:shadow-xl relative z-10 transition-transform duration-700 group-hover:scale-105 mx-auto bg-slate-100 flex items-center justify-center">
                      {previewImage ? (
                        <img src={previewImage} alt="Profile Preview" className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-12 h-12 md:w-20 md:h-20 text-slate-300" />
                      )}
                    </div>
                  </div>
                  <div className="space-y-2 md:space-y-3">
                    <div className="space-y-0.5">
                      <h2 className="text-lg md:text-2xl font-black text-slate-800 tracking-tight">{formData.name || "YOUR NAME"}</h2>
                      <p className="text-xs md:text-base font-black text-indigo-600 uppercase tracking-widest">@{formData.username || "username"}</p>
                      <p className="text-slate-400 font-bold uppercase text-[7px] md:text-[8px] tracking-[0.2em] truncate max-w-[150px] md:max-w-none mx-auto">{formData.email || "Email Identity"}</p>
                    </div>
                    <div className="bg-indigo-600/10 text-indigo-700 inline-block px-4 md:px-6 py-1.5 md:py-2 rounded-full font-black text-[8px] md:text-[10px] uppercase tracking-widest">
                      Patient ID: NEW
                    </div>
                  </div>
                </div>

                {/* Registration Notice */}
                <div className="mt-6 p-4 bg-blue-50/50 border border-blue-100 rounded-[1rem] w-full max-w-sm absolute bottom-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <p className="text-[10px] text-blue-400 font-bold uppercase tracking-widest leading-relaxed">
                    <strong>Note:</strong> Photo identity is used for biometric verification during clinical access.
                  </p>
                </div>
              </div>

              <div className="mt-8 text-center">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                  Already registered?{" "}
                  <button
                    className="text-blue-600 hover:text-blue-800 font-black transition-colors"
                    onClick={() => navigate("/login")}
                    data-testid="link-login"
                  >
                    PATIENT LOGIN
                  </button>
                </p>
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
