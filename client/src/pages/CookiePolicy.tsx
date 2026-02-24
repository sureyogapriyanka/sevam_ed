import { useNavigate } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Heart, Cookie, Settings, ArrowLeft, AlertCircle } from "lucide-react";

export default function CookiePolicy() {
    const { t } = useLanguage();
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
            {/* Header */}
            <header className="bg-white/95 backdrop-blur-sm border-b border-blue-200 sticky top-0 z-50 shadow-sm">
                <div className="container mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-green-600 rounded-lg flex items-center justify-center shadow-lg animate-pulse">
                                <Heart className="text-white h-5 w-5" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">{t("sevamed_hms")}</h1>
                                <p className="text-sm text-blue-600">Healthcare Management</p>
                            </div>
                        </div>
                        <Button
                            variant="outline"
                            onClick={() => navigate("/")}
                            className="flex items-center space-x-2"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            <span>{t("back_to_home")}</span>
                        </Button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-6 py-12">
                <div className="max-w-4xl mx-auto">
                    {/* Page Header */}
                    <div className="text-center mb-12">
                        <div className="flex justify-center mb-6">
                            <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-green-600 rounded-lg flex items-center justify-center shadow-lg">
                                <Cookie className="text-white h-10 w-10" />
                            </div>
                        </div>
                        <h1 className="text-4xl font-bold text-blue-800 mb-4">{t("cookie_policy")}</h1>
                        <p className="text-xl text-blue-600">{t("understanding_cookies")}</p>
                        <p className="text-sm text-gray-600 mt-2">{t("last_updated")}: January 2024</p>
                    </div>

                    {/* Cookie Information */}
                    <div className="space-y-8">
                        {/* What Are Cookies */}
                        <Card className="shadow-lg border-2 border-blue-500/30 bg-gradient-to-br from-gray-800 to-gray-900 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2 text-blue-800">
                                    <Cookie className="h-5 w-5" />
                                    <span>{t("what_are_cookies")}</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-700 mb-4">
                                    Cookies are small text files that are stored on your device (computer, tablet, or mobile) when you visit our website.
                                    They help us provide you with a better experience by remembering your preferences and improving our services.
                                </p>
                                <p className="text-gray-700">
                                    We use cookies in compliance with healthcare privacy regulations including HIPAA to ensure your medical
                                    information remains secure while providing you with personalized healthcare services.
                                </p>
                            </CardContent>
                        </Card>

                        {/* Types of Cookies */}
                        <Card className="shadow-lg border-2 border-green-500/30 bg-gradient-to-br from-gray-800 to-gray-900 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2 text-green-800">
                                    <Settings className="h-5 w-5" />
                                    <span>{t("types_of_cookies")}</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="border-l-4 border-blue-500 pl-4">
                                    <h4 className="font-semibold text-blue-700 mb-2">{t("essential_cookies")}</h4>
                                    <p className="text-gray-700 mb-2">
                                        These cookies are necessary for the website to function properly. They enable core features such as:
                                    </p>
                                    <ul className="list-disc pl-6 space-y-1 text-gray-600">
                                        <li>User authentication and login sessions</li>
                                        <li>Security features and fraud prevention</li>
                                        <li>Shopping cart functionality for medical supplies</li>
                                        <li>Remembering your language preferences</li>
                                    </ul>
                                </div>

                                <div className="border-l-4 border-green-500 pl-4">
                                    <h4 className="font-semibold text-green-700 mb-2">{t("functional_cookies")}</h4>
                                    <p className="text-gray-700 mb-2">
                                        These cookies enhance your experience by remembering your choices:
                                    </p>
                                    <ul className="list-disc pl-6 space-y-1 text-gray-600">
                                        <li>Your dashboard preferences and layout</li>
                                        <li>Accessibility settings and adjustments</li>
                                        <li>Time zone and location preferences</li>
                                        <li>Previous appointment booking preferences</li>
                                    </ul>
                                </div>

                                <div className="border-l-4 border-yellow-500 pl-4">
                                    <h4 className="font-semibold text-yellow-700 mb-2">{t("analytics_cookies")}</h4>
                                    <p className="text-gray-700 mb-2">
                                        These cookies help us understand how you use our platform:
                                    </p>
                                    <ul className="list-disc pl-6 space-y-1 text-gray-600">
                                        <li>Pages visited and time spent on each page</li>
                                        <li>How you navigate through our healthcare portal</li>
                                        <li>Error messages and technical issues encountered</li>
                                        <li>Popular features and services used</li>
                                    </ul>
                                    <p className="text-sm text-yellow-600 mt-2">
                                        <strong>Note:</strong> All analytics data is anonymized and cannot be used to identify individual patients.
                                    </p>
                                </div>

                                <div className="border-l-4 border-purple-500 pl-4">
                                    <h4 className="font-semibold text-purple-700 mb-2">{t("performance_cookies")}</h4>
                                    <p className="text-gray-700 mb-2">
                                        These cookies help us optimize our platform's performance:
                                    </p>
                                    <ul className="list-disc pl-6 space-y-1 text-gray-600">
                                        <li>Loading times and server response optimization</li>
                                        <li>Content delivery network (CDN) performance</li>
                                        <li>Database query optimization for faster results</li>
                                        <li>System stability and uptime monitoring</li>
                                    </ul>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Managing Cookies */}
                        <Card className="shadow-lg border-2 border-blue-500/30 bg-gradient-to-br from-gray-800 to-gray-900 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2 text-blue-800">
                                    <Settings className="h-5 w-5" />
                                    <span>{t("managing_cookies")}</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <h4 className="font-semibold text-blue-700 mb-2">{t("browser_settings")}</h4>
                                    <p className="text-gray-700 mb-2">
                                        You can control cookies through your browser settings:
                                    </p>
                                    <ul className="list-disc pl-6 space-y-1 text-gray-600">
                                        <li><strong>Chrome:</strong> Settings → Privacy and Security → Cookies and other site data</li>
                                        <li><strong>Firefox:</strong> Settings → Privacy & Security → Cookies and Site Data</li>
                                        <li><strong>Safari:</strong> Preferences → Privacy → Manage Website Data</li>
                                        <li><strong>Edge:</strong> Settings → Cookies and site permissions → Cookies and site data</li>
                                    </ul>
                                </div>
                                <div className="bg-yellow-100 p-4 rounded-lg border border-yellow-200">
                                    <div className="flex items-start space-x-2">
                                        <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                                        <div>
                                            <h4 className="font-semibold text-yellow-800 mb-1">{t("important_notice")}</h4>
                                            <p className="text-yellow-700 text-sm">
                                                Disabling certain cookies may affect the functionality of our healthcare platform
                                                and your ability to access important medical features.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Contact Information */}
                        <Card className="shadow-lg border-2 border-green-500/30 bg-gradient-to-br from-gray-800 to-gray-900 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle className="text-green-800">{t("contact_us")}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-700 mb-4">
                                    If you have questions about our use of cookies or this Cookie Policy, please contact us:
                                </p>
                                <div className="bg-green-50 p-4 rounded-lg space-y-2">
                                    <p><strong>{t("data_protection_officer")}</strong></p>
                                    <p>Email: cookies@sevamed.com</p>
                                    <p>Phone: +1 (555) 123-4567</p>
                                    <p>Address: 123 Healthcare Street, Medical District, MD 12345</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-8">
                <div className="container mx-auto px-6 text-center">
                    <p className="text-gray-400">© 2026 SevaMed Healthcare Management System. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}
