import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useLanguage } from "../contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import { Switch } from "../components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { useNavigate } from "react-router-dom";
import { Languages, Palette, Moon, Sun } from "lucide-react";

export default function SettingsPage() {
    const { user } = useAuth();
    const { language, setLanguage, t } = useLanguage();
    const navigate = useNavigate();
    const [darkMode, setDarkMode] = useState(
        document.documentElement.classList.contains("dark")
    );

    // Only allow access from patient and reception dashboards
    if (user && user.role !== "patient" && user.role !== "reception") {
        navigate("/");
        return null;
    }

    const handleThemeChange = (isDark: boolean) => {
        setDarkMode(isDark);
        if (isDark) {
            document.documentElement.classList.add("dark");
            localStorage.setItem("theme", "dark");
        } else {
            document.documentElement.classList.remove("dark");
            localStorage.setItem("theme", "light");
        }
    };

    return (
        <div className="space-y-8 fade-in">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">{t("settings")}</h1>
                    <p className="text-muted-foreground">
                        Manage your preferences and account settings
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    {/* Language Settings */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <Languages className="h-5 w-5" />
                                <span>{t("language")}</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="language-select" className="text-foreground">
                                        Select Language
                                    </Label>
                                    <Select value={language} onValueChange={setLanguage}>
                                        <SelectTrigger className="w-40">
                                            <SelectValue placeholder={t("language")} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="en">English</SelectItem>
                                            <SelectItem value="te">తెలుగు</SelectItem>
                                            <SelectItem value="hi">हिंदी</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    Change the language of the application interface
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Theme Settings */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <Palette className="h-5 w-5" />
                                <span>Theme</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        {darkMode ? (
                                            <Moon className="h-5 w-5 text-foreground" />
                                        ) : (
                                            <Sun className="h-5 w-5 text-foreground" />
                                        )}
                                        <Label htmlFor="theme-toggle" className="text-foreground">
                                            Dark Mode
                                        </Label>
                                    </div>
                                    <Switch
                                        id="theme-toggle"
                                        checked={darkMode}
                                        onCheckedChange={handleThemeChange}
                                    />
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    Switch between light and dark themes
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Account Settings */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Account Settings</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div>
                                    <Label className="text-foreground">Username</Label>
                                    <p className="font-medium">{user?.username}</p>
                                </div>
                                <div>
                                    <Label className="text-foreground">Email</Label>
                                    <p className="font-medium">{user?.email}</p>
                                </div>
                                <div>
                                    <Label className="text-foreground">Role</Label>
                                    <p className="font-medium capitalize">{user?.role}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    {/* Quick Actions */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Quick Actions</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                <Button variant="outline" className="w-full justify-start">
                                    Edit Profile
                                </Button>
                                <Button variant="outline" className="w-full justify-start">
                                    Change Password
                                </Button>
                                <Button variant="outline" className="w-full justify-start">
                                    Notification Settings
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Help */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Need Help?</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground mb-4">
                                If you need assistance with your settings, contact our support team.
                            </p>
                            <Button className="w-full">Contact Support</Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
