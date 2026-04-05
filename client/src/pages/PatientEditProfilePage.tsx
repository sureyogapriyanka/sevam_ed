import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { toast } from "../hooks/use-toast";
import { authService } from "../services/api";
import { User, Mail, Phone, MapPin, Cake, Save, Camera } from "lucide-react";

export default function PatientEditProfilePage() {
    const { user, updateUser } = useAuth();
    const navigate = useNavigate();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [profileImage, setProfileImage] = useState<string | null>(user?.profileImage || null);
    const [isUploading, setIsUploading] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.name || "",
        email: user?.email || "",
        phone: user?.phone || "",
        address: user?.address || "",
        age: user?.age?.toString() || ""
    });

    // Update form data when user changes
    useEffect(() => {
        setFormData({
            name: user?.name || "",
            email: user?.email || "",
            phone: user?.phone || "",
            address: user?.address || "",
            age: user?.age?.toString() || ""
        });
        setProfileImage(user?.profileImage || null);
    }, [user]);

    // Handle profile image upload
    const handleProfileImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // Check if file is an image
        if (!file.type.startsWith('image/')) {
            toast({
                title: "Error",
                description: "Please select an image file",
                variant: "destructive"
            });
            return;
        }

        // Check file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            toast({
                title: "Error",
                description: "Image size should be less than 5MB",
                variant: "destructive"
            });
            return;
        }

        setIsUploading(true);

        try {
            // Convert image to base64
            const reader = new FileReader();
            reader.onloadend = async () => {
                const base64Image = reader.result as string;
                setProfileImage(base64Image);
            };

            reader.readAsDataURL(file);
        } catch (error) {
            console.error("Error uploading profile image:", error);
            toast({
                title: "Error",
                description: "Failed to upload profile image",
                variant: "destructive"
            });
        } finally {
            setIsUploading(false);
            // Reset file input
            event.target.value = '';
        }
    };

    // Handle form input changes
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            // Prepare data for update
            const updateData: any = {
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                address: formData.address
            };

            // Add age if provided
            if (formData.age) {
                updateData.age = parseInt(formData.age);
            }

            // Add profile image if changed
            if (profileImage !== user?.profileImage) {
                updateData.profileImage = profileImage;
            }

            // Update profile
            const { data, error } = await authService.updateProfile(updateData);

            if (data && !error) {
                // Update auth context
                updateUser({
                    ...user,
                    ...updateData
                });

                // Update local storage
                const storedUser = localStorage.getItem("user");
                if (storedUser) {
                    const userData = JSON.parse(storedUser);
                    const updatedUser = {
                        ...userData,
                        ...updateData
                    };
                    localStorage.setItem("user", JSON.stringify(updatedUser));
                }

                toast({
                    title: "Success",
                    description: "Profile updated successfully"
                });

                // Navigate back to profile
                navigate("/patient?tab=profile");
            } else {
                throw new Error(error || "Failed to update profile");
            }
        } catch (error) {
            console.error("Error updating profile:", error);
            toast({
                title: "Error",
                description: "Failed to update profile",
                variant: "destructive"
            });
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-blue-900">Edit Profile</h2>
                <Button variant="outline" onClick={() => navigate("/patient?tab=profile")} className="border-blue-300 text-blue-700 hover:bg-blue-50">
                    Back to Profile
                </Button>
            </div>

            <Card className="border-t-4 border-t-blue-500 hover:shadow-xl transition-all duration-300 bg-white border-2 border-blue-200">
                <CardHeader>
                    <CardTitle className="flex items-center text-blue-900">
                        <User className="h-5 w-5 mr-2 text-blue-600" />
                        Personal Information
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Profile Picture */}
                        <div className="flex flex-col items-center mb-6">
                            <div className="relative">
                                {profileImage ? (
                                    <img
                                        src={profileImage}
                                        alt={user?.name}
                                        className="w-32 h-32 rounded-full object-cover shadow-lg border-4 border-white"
                                    />
                                ) : (
                                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white text-4xl font-bold shadow-lg border-4 border-white">
                                        {user?.name?.charAt(0).toUpperCase() || "P"}
                                    </div>
                                )}
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    className="absolute bottom-2 right-2 rounded-full w-8 h-8 p-0 bg-white border-2 border-blue-500 text-blue-600 hover:bg-blue-100 hover:shadow-lg transform hover:scale-110 transition-all duration-200"
                                    onClick={() => {
                                        // Trigger the file input when clicking the button
                                        fileInputRef.current?.click();
                                    }}
                                    disabled={isUploading}
                                >
                                    <Camera className="h-4 w-4" />
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
                            <p className="text-sm text-blue-600 mt-2">Click the camera icon to change profile picture</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="name" className="text-blue-700">Full Name</Label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400 h-4 w-4" />
                                    <Input
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className="pl-10 border-blue-300 focus:ring-blue-500"
                                        placeholder="Enter your full name"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-blue-700">Email Address</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400 h-4 w-4" />
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className="pl-10 border-blue-300 focus:ring-blue-500"
                                        placeholder="Enter your email address"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="phone" className="text-blue-700">Phone Number</Label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400 h-4 w-4" />
                                    <Input
                                        id="phone"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        className="pl-10 border-blue-300 focus:ring-blue-500"
                                        placeholder="Enter your phone number"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="age" className="text-blue-700">Age</Label>
                                <div className="relative">
                                    <Cake className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400 h-4 w-4" />
                                    <Input
                                        id="age"
                                        name="age"
                                        type="number"
                                        value={formData.age}
                                        onChange={handleInputChange}
                                        className="pl-10 border-blue-300 focus:ring-blue-500"
                                        placeholder="Enter your age"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="address" className="text-blue-700">Address</Label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400 h-4 w-4" />
                                    <Input
                                        id="address"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleInputChange}
                                        className="pl-10 border-blue-300 focus:ring-blue-500"
                                        placeholder="Enter your address"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end space-x-3">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => navigate("/patient?tab=profile")}
                                className="border-blue-300 text-blue-700 hover:bg-blue-50"
                            >
                                Cancel
                            </Button>
                            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                                <Save className="h-4 w-4 mr-2" />
                                Save Changes
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
