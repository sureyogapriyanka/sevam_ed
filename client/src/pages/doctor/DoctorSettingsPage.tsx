import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useLanguage } from "../../contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { toast } from "../../hooks/use-toast";
import { authService } from "../../services/api";
import {
    User,
    UserCheck,
    Stethoscope,
    Cog,
    Bell,
    MessageCircle,
    Zap,
    Lock,
    LogOut,
    Edit,
    Key
} from "lucide-react";

export default function DoctorSettingsPage() {
    const { user, logout } = useAuth();
    const { language, setLanguage } = useLanguage();
    const navigate = useNavigate();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [profileImage, setProfileImage] = useState<string | null>(user?.profileImage || null);
    const [isUploading, setIsUploading] = useState(false);
    const [emailNotifications, setEmailNotifications] = useState(true);
    const [smsNotifications, setSmsNotifications] = useState(true);
    const [pushNotifications, setPushNotifications] = useState(true);
    const [selectedLanguage, setSelectedLanguage] = useState<"en" | "te" | "hi">(language || "en");

    // Update profile image when user changes
    useEffect(() => {
        setProfileImage(user?.profileImage || null);
    }, [user]);

    // Handle profile image upload
    const handleProfileImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // Check if file is an image
        if (!file.type.startsWith('image/')) {
            alert('Please select an image file');
            return;
        }

        // Check file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert('Image size should be less than 5MB');
            return;
        }

        setIsUploading(true);

        try {
            // Convert image to base64
            const reader = new FileReader();
            reader.onloadend = async () => {
                const base64Image = reader.result as string;

                // Update profile image in state
                setProfileImage(base64Image);

                // Update profile image in backend
                const { data, error } = await authService.updateProfile({
                    profileImage: base64Image
                });

                if (data && !error) {
                    // Update local storage
                    const storedUser = localStorage.getItem("user");
                    if (storedUser) {
                        const userData = JSON.parse(storedUser);
                        userData.profileImage = base64Image;
                        localStorage.setItem("user", JSON.stringify(userData));
                    }

                    // Reload the page to reflect changes
                    window.location.reload();

                    console.log("Profile image updated successfully");
                } else {
                    console.error("Error updating profile image:", error);
                    alert("Failed to update profile image");
                    // Revert to previous image
                    setProfileImage(user?.profileImage || null);
                }
            };

            reader.readAsDataURL(file);
        } catch (error) {
            console.error("Error uploading profile image:", error);
            alert("Failed to upload profile image");
            // Revert to previous image
            setProfileImage(user?.profileImage || null);
        } finally {
            setIsUploading(false);
            // Reset file input
            event.target.value = '';
        }
    };

    // Handle logout
    const handleLogout = async () => {
        try {
            await logout();
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    // Handle edit profile
    const handleEditProfile = () => {
        navigate("/profile/edit");
    };

    // Handle change password
    const handleChangePassword = () => {
        navigate("/profile/change-password");
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">System Settings</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Profile Picture and Basic Info */}
                <div className="lg:col-span-1">
                    <Card className="border-t-4 border-t-blue-500 hover:shadow-xl transition-all duration-300 bg-white border-2 border-gray-200">
                        <CardContent className="p-6">
                            <div className="flex flex-col items-center">
                                {/* Profile Picture */}
                                <div className="relative mb-4">
                                    {profileImage ? (
                                        <img
                                            src={profileImage}
                                            alt={user.name}
                                            className="w-32 h-32 rounded-full object-cover shadow-lg border-4 border-white"
                                        />
                                    ) : (
                                        <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white text-4xl font-bold shadow-lg border-4 border-white">
                                            {user?.name?.charAt(0).toUpperCase() || "D"}
                                        </div>
                                    )}
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="absolute bottom-2 right-2 rounded-full w-8 h-8 p-0 bg-white border-2 border-blue-500 text-blue-600 hover:bg-blue-100 hover:shadow-lg transform hover:scale-110 transition-all duration-200"
                                        onClick={() => {
                                            // Trigger the file input when clicking the button
                                            fileInputRef.current?.click();
                                        }}
                                    >
                                        <User className="h-4 w-4" />
                                    </Button>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleProfileImageUpload}
                                        disabled={isUploading}
                                        className="hidden"
                                        ref={fileInputRef}
                                    />
                                </div>

                                <h3 className="text-xl font-bold text-center text-gray-900">{user?.name}</h3>
                                <p className="text-gray-600 text-center">Doctor</p>

                                <div className="mt-4 w-full space-y-2">
                                    <div className="flex items-center text-sm text-gray-700">
                                        <UserCheck className="h-4 w-4 mr-2 text-blue-600" />
                                        <span>Doctor</span>
                                    </div>
                                    <div className="flex items-center text-sm text-gray-700">
                                        <Stethoscope className="h-4 w-4 mr-2 text-blue-600" />
                                        <span>{user?.specialization || "General Physician"}</span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Detailed Settings */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="border-t-4 border-t-indigo-500 hover:shadow-xl transition-all duration-300 bg-white border-2 border-gray-200">
                        <CardHeader>
                            <CardTitle className="flex items-center text-gray-900">
                                <Cog className="h-5 w-5 mr-2 text-indigo-600" />
                                System Configuration
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <h3 className="text-lg font-medium text-gray-900 mb-4">Notification Preferences</h3>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <Bell className="h-5 w-5 text-gray-500 mr-3" />
                                            <span>Email Notifications</span>
                                        </div>
                                        <Button
                                            variant={emailNotifications ? "default" : "outline"}
                                            size="sm"
                                            onClick={() => setEmailNotifications(!emailNotifications)}
                                            className={emailNotifications ? "bg-green-600 hover:bg-green-700" : "border-green-500 text-green-600 hover:bg-green-50 hover:border-green-600 transition-colors duration-200"}
                                        >
                                            {emailNotifications ? "Enabled" : "Disabled"}
                                        </Button>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <MessageCircle className="h-5 w-5 text-gray-500 mr-3" />
                                            <span>SMS Notifications</span>
                                        </div>
                                        <Button
                                            variant={smsNotifications ? "default" : "outline"}
                                            size="sm"
                                            onClick={() => setSmsNotifications(!smsNotifications)}
                                            className={smsNotifications ? "bg-green-600 hover:bg-green-700" : "border-green-500 text-green-600 hover:bg-green-50 hover:border-green-600 transition-colors duration-200"}
                                        >
                                            {smsNotifications ? "Enabled" : "Disabled"}
                                        </Button>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <Zap className="h-5 w-5 text-gray-500 mr-3" />
                                            <span>Push Notifications</span>
                                        </div>
                                        <Button
                                            variant={pushNotifications ? "default" : "outline"}
                                            size="sm"
                                            onClick={() => setPushNotifications(!pushNotifications)}
                                            className={pushNotifications ? "bg-green-600 hover:bg-green-700" : "border-green-500 text-green-600 hover:bg-green-50 hover:border-green-600 transition-colors duration-200"}
                                        >
                                            {pushNotifications ? "Enabled" : "Disabled"}
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-medium text-gray-900 mb-4">Language Preferences</h3>
                                <div className="grid grid-cols-2 gap-3">
                                    <Button
                                        variant={selectedLanguage === "en" ? "default" : "outline"}
                                        onClick={() => {
                                            setSelectedLanguage("en");
                                            setLanguage("en");
                                        }}
                                        className={selectedLanguage === "en" ? "bg-blue-600 hover:bg-blue-700" : ""}
                                    >
                                        English
                                    </Button>
                                    <Button
                                        variant={selectedLanguage === "te" ? "default" : "outline"}
                                        onClick={() => {
                                            setSelectedLanguage("te");
                                            setLanguage("te");
                                        }}
                                        className={selectedLanguage === "te" ? "bg-blue-600 hover:bg-blue-700" : ""}
                                    >
                                        తెలుగు
                                    </Button>
                                    <Button
                                        variant={selectedLanguage === "hi" ? "default" : "outline"}
                                        onClick={() => {
                                            setSelectedLanguage("hi");
                                            setLanguage("hi");
                                        }}
                                        className={selectedLanguage === "hi" ? "bg-blue-600 hover:bg-blue-700" : ""}
                                    >
                                        हिन्दी
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="border-gray-300 text-gray-700 hover:bg-gray-100"
                                        onClick={() => {
                                            toast({
                                                title: "More Languages",
                                                description: "Additional language support coming soon"
                                            });
                                        }}
                                    >
                                        More...
                                    </Button>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-medium text-gray-900 mb-4">Account Actions</h3>
                                <div className="space-y-3">
                                    <Button
                                        variant="outline"
                                        className="w-full justify-start border-gray-300 text-gray-700 hover:bg-gray-100"
                                        onClick={handleEditProfile}
                                    >
                                        <Edit className="h-4 w-4 mr-2" />
                                        Edit Profile
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="w-full justify-start border-gray-300 text-gray-700 hover:bg-gray-100"
                                        onClick={handleChangePassword}
                                    >
                                        <Key className="h-4 w-4 mr-2" />
                                        Change Password
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="w-full justify-start border-red-300 text-red-700 hover:bg-red-100"
                                        onClick={handleLogout}
                                    >
                                        <LogOut className="h-4 w-4 mr-2" />
                                        Sign Out
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* System Information */}
                    <Card className="border-t-4 border-t-amber-500 hover:shadow-xl transition-all duration-300 bg-white border-2 border-gray-200">
                        <CardHeader>
                            <CardTitle className="flex items-center text-gray-900">
                                <User className="h-5 w-5 mr-2 text-amber-600" />
                                System Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-3 bg-amber-50 rounded-lg">
                                    <p className="text-sm text-amber-700">Last Login</p>
                                    <p className="font-medium text-amber-900">Today, 09:15 AM</p>
                                </div>
                                <div className="p-3 bg-amber-50 rounded-lg">
                                    <p className="text-sm text-amber-700">IP Address</p>
                                    <p className="font-medium text-amber-900">192.168.1.105</p>
                                </div>
                                <div className="p-3 bg-amber-50 rounded-lg">
                                    <p className="text-sm text-amber-700">Browser</p>
                                    <p className="font-medium text-amber-900">Chrome 98.0</p>
                                </div>
                                <div className="p-3 bg-amber-50 rounded-lg">
                                    <p className="text-sm text-amber-700">Version</p>
                                    <p className="font-medium text-amber-900">v2.1.4</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
