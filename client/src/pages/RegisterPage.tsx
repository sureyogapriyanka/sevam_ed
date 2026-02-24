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
    <div className="min-h-screen bg-gradient-to-b from-blue-900 via-blue-100 to-blue-900 flex items-center justify-center p-4 relative overflow-hidden" data-testid="register-page">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-600/10 to-gray-600/10 backdrop-blur-3xl"></div>
      <div className="absolute inset-0 opacity-5">
        <div className="w-full h-full" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px'
        }}></div>
      </div>

      <div className="w-full max-w-4xl relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-slate-600 via-gray-500 to-slate-600 rounded-full flex items-center justify-center shadow-2xl border-4 border-white/20">
              <img src="/sevamed logo.png" alt="SevaMed Logo" className="w-12 h-12 object-contain" />
            </div>
          </div>
          <div className="bg-gradient-to-r from-blue-700 to-blue-800 backdrop-blur-md rounded-xl p-6 shadow-2xl border-2 border-blue-900/50 relative z-20" style={{ boxShadow: '0 20px 40px rgba(0,0,0,0.25)' }}>
            <h1 className="text-5xl font-bold text-white mb-3">
              {t("sevamed_hms")}
            </h1>
            <p className="text-white text-2xl font-bold mb-2">🏥 PATIENT REGISTRATION</p>
            <p className="text-blue-100 text-lg font-semibold">Create Your Healthcare Account</p>
          </div>
        </div>

        <Card className="shadow-2xl border-2 border-blue-400/30 bg-white/95 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-blue-700 to-blue-800 text-white rounded-t-lg">
            <CardTitle className="text-center text-xl flex items-center justify-center space-x-2">
              <User className="h-6 w-6" />
              <span>Patient Registration</span>
            </CardTitle>
            <div className="flex justify-center mt-4">
              <div className="w-48">
                <LanguageSelector />
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-6">
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Two-column layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Registration Form */}
              <div>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <Label htmlFor="name" className="text-slate-900 font-semibold">Full Name *</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter your full name"
                        required
                        className="border-slate-300 focus:border-slate-500 bg-white text-slate-900 placeholder-slate-400 h-14 text-lg"
                        data-testid="input-name"
                      />
                    </div>

                    <div>
                      <Label htmlFor="username" className="text-slate-900 font-semibold">Username *</Label>
                      <Input
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        placeholder="Choose a username"
                        required
                        className="border-slate-300 focus:border-slate-500 bg-white text-slate-900 placeholder-slate-400 h-14 text-lg"
                        data-testid="input-username"
                      />
                    </div>

                    <div>
                      <Label htmlFor="password" className="text-slate-900 font-semibold">Password *</Label>
                      <Input
                        id="password"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Create a password"
                        required
                        className="border-slate-300 focus:border-slate-500 bg-white text-slate-900 placeholder-slate-400 h-14 text-lg"
                        data-testid="input-password"
                      />
                    </div>

                    <div>
                      <Label htmlFor="email" className="text-slate-900 font-semibold">Email Address</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter your email"
                        className="border-slate-300 focus:border-slate-500 bg-white text-slate-900 placeholder-slate-400 h-14 text-lg"
                        data-testid="input-email"
                      />
                    </div>

                    <div>
                      <Label htmlFor="phone" className="text-slate-900 font-semibold">Phone Number</Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="Enter your phone number"
                        className="border-slate-300 focus:border-slate-500 bg-white text-slate-900 placeholder-slate-400 h-14 text-lg"
                        data-testid="input-phone"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="age" className="text-slate-900 font-semibold">Age</Label>
                        <Input
                          id="age"
                          name="age"
                          type="number"
                          value={formData.age}
                          onChange={handleChange}
                          placeholder="Enter your age"
                          className="border-slate-300 focus:border-slate-500 bg-white text-slate-900 placeholder-slate-400 h-14 text-lg"
                          data-testid="input-age"
                        />
                      </div>

                      <div>
                        <Label htmlFor="gender" className="text-slate-900 font-semibold">Gender</Label>
                        <Select name="gender" value={formData.gender} onValueChange={(value) => handleSelectChange("gender", value)}>
                          <SelectTrigger className="h-14 text-lg bg-white">
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                          <SelectContent className="bg-white">
                            <SelectItem value="Male">Male</SelectItem>
                            <SelectItem value="Female">Female</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="bloodGroup" className="text-slate-900 font-semibold">Blood Group</Label>
                      <Select name="bloodGroup" value={formData.bloodGroup} onValueChange={(value) => handleSelectChange("bloodGroup", value)}>
                        <SelectTrigger className="h-14 text-lg bg-white">
                          <SelectValue placeholder="Select blood group" />
                        </SelectTrigger>
                        <SelectContent className="bg-white">
                          <SelectItem value="A+">A+</SelectItem>
                          <SelectItem value="A-">A-</SelectItem>
                          <SelectItem value="B+">B+</SelectItem>
                          <SelectItem value="B-">B-</SelectItem>
                          <SelectItem value="AB+">AB+</SelectItem>
                          <SelectItem value="AB-">AB-</SelectItem>
                          <SelectItem value="O+">O+</SelectItem>
                          <SelectItem value="O-">O-</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="address" className="text-slate-900 font-semibold">Address</Label>
                      <Input
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        placeholder="Enter your address"
                        className="border-slate-300 focus:border-slate-500 bg-white text-slate-900 placeholder-slate-400 h-14 text-lg"
                        data-testid="input-address"
                      />
                    </div>

                    <div>
                      <Label className="text-slate-900 font-semibold">Profile Photo</Label>
                      <div className="flex items-center space-x-4">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={triggerFileInput}
                          className="flex items-center space-x-2 h-14 text-lg border-slate-300 text-slate-700 hover:bg-slate-100"
                        >
                          <Upload className="h-5 w-5" />
                          <span>Upload Photo</span>
                        </Button>
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleImageUpload}
                          accept="image/*"
                          className="hidden"
                        />
                        {previewImage && (
                          <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-blue-400">
                            <img
                              src={previewImage}
                              alt="Preview"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-1">Upload a clear photo of yourself (JPG, PNG, max 5MB)</p>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg transition-all duration-300 transform hover:scale-105 h-14 text-lg"
                    disabled={isLoading}
                    data-testid="button-register"
                  >
                    {isLoading ? (
                      <div className="flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>Registering...</span>
                      </div>
                    ) : (
                      "Create Account"
                    )}
                  </Button>
                </form>
              </div>

              {/* Profile Preview */}
              <div className="flex flex-col items-center justify-center">
                <div className="w-full max-w-sm">
                  <div className="bg-gradient-to-br from-white/90 to-blue-50/80 rounded-2xl p-6 shadow-xl border border-blue-200/50 backdrop-blur-sm">
                    <div className="flex flex-col items-center">
                      <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-blue-400 shadow-lg mb-6">
                        {previewImage ? (
                          <img
                            src={previewImage}
                            alt="Profile Preview"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                            <User className="h-16 w-16 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div className="text-center">
                        <h3 className="text-2xl font-bold text-blue-900 mb-2">
                          {formData.name || "Your Name"}
                        </h3>
                        <p className="text-lg text-blue-700 font-semibold mb-1">
                          {formData.username ? `@${formData.username}` : "Username"}
                        </p>
                        <p className="text-md text-blue-600">
                          {formData.email || "Email Address"}
                        </p>
                        <div className="mt-4 px-4 py-2 bg-blue-100 rounded-full">
                          <p className="text-blue-800 font-medium">Patient ID: NEW</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Registration Notice */}
                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg w-full max-w-sm">
                  <p className="text-xs text-blue-700">
                    <strong>Registration Note:</strong> Your profile photo will be used for identification during login. Please ensure it's a clear, recent photo of your face.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-slate-600">
                Already have an account?{" "}
                <Button
                  variant="link"
                  className="p-0 h-auto text-blue-600 hover:text-blue-800"
                  onClick={() => navigate("/login")}
                  data-testid="link-login"
                >
                  Patient Login
                </Button>
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-6">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            data-testid="link-home"
            className="text-blue-800 hover:text-blue-900 hover:bg-blue-100 border border-blue-300 px-8 py-3"
          >
            ← Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
}
