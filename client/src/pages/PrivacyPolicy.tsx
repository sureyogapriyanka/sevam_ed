import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Heart, Shield, Lock, Eye, FileText, ArrowLeft } from "lucide-react";

export default function PrivacyPolicy() {
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
                                <Shield className="text-white h-10 w-10" />
                            </div>
                        </div>
                        <h1 className="text-4xl font-bold text-blue-800 mb-4">{t("privacy_policy")}</h1>
                        <p className="text-xl text-blue-600">{t("data_protection_priorities")}</p>
                        <p className="text-sm text-gray-600 mt-2">{t("last_updated")}: January 2024</p>
                    </div>

                    {/* Privacy Sections */}
                    <div className="space-y-8">
                        {/* Information We Collect */}
                        <Card className="shadow-lg border-2 border-blue-500/30 bg-gradient-to-br from-gray-800 to-gray-900 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2 text-blue-800">
                                    <Eye className="h-5 w-5" />
                                    <span>{t("information_we_collect")}</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <h4 className="font-semibold text-blue-700 mb-2">{t("personal_information")}</h4>
                                    <ul className="list-disc pl-6 space-y-1 text-gray-700">
                                        <li>Name, email address, phone number, and contact details</li>
                                        <li>Medical history, treatment records, and health information</li>
                                        <li>Insurance information and billing details</li>
                                        <li>Emergency contact information</li>
                                    </ul>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-blue-700 mb-2">{t("technical_information")}</h4>
                                    <ul className="list-disc pl-6 space-y-1 text-gray-700">
                                        <li>IP address, browser type, and device information</li>
                                        <li>Usage data and interaction patterns</li>
                                        <li>Login credentials and session information</li>
                                        <li>Cookies and similar tracking technologies</li>
                                    </ul>
                                </div>
                            </CardContent>
                        </Card>

                        {/* How We Use Information */}
                        <Card className="shadow-lg border-2 border-green-500/30 bg-gradient-to-br from-gray-800 to-gray-900 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2 text-green-800">
                                    <FileText className="h-5 w-5" />
                                    <span>{t("how_we_use_info")}</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                                    <li><strong>Healthcare Services:</strong> Provide medical care, treatment, and healthcare management</li>
                                    <li><strong>Communication:</strong> Send appointment reminders, health updates, and emergency notifications</li>
                                    <li><strong>System Operations:</strong> Maintain and improve our healthcare management system</li>
                                    <li><strong>Legal Compliance:</strong> Meet regulatory requirements and healthcare standards</li>
                                    <li><strong>Research:</strong> Conduct anonymized medical research to improve healthcare outcomes</li>
                                    <li><strong>Security:</strong> Protect against fraud, unauthorized access, and security threats</li>
                                </ul>
                            </CardContent>
                        </Card>

                        {/* Data Protection */}
                        <Card className="shadow-lg border-2 border-blue-500/30 bg-gradient-to-br from-gray-800 to-gray-900 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2 text-blue-800">
                                    <Lock className="h-5 w-5" />
                                    <span>{t("data_protection_security")}</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <h4 className="font-semibold text-blue-700 mb-2">{t("hipaa_compliance")}</h4>
                                    <p className="text-gray-700">
                                        We are fully compliant with the Health Insurance Portability and Accountability Act (HIPAA)
                                        and maintain strict standards for protecting your health information.
                                    </p>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-blue-700 mb-2">{t("security_measures")}</h4>
                                    <ul className="list-disc pl-6 space-y-1 text-gray-700">
                                        <li>End-to-end encryption for all data transmission</li>
                                        <li>Secure servers with regular security audits</li>
                                        <li>Multi-factor authentication for staff access</li>
                                        <li>Regular data backups and disaster recovery plans</li>
                                        <li>Employee training on data privacy and security</li>
                                    </ul>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Information Sharing */}
                        <Card className="shadow-lg border-2 border-green-500/30 bg-gradient-to-br from-gray-800 to-gray-900 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle className="text-green-800">{t("information_sharing")}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-700 mb-4">
                                    We may share your information only in the following circumstances:
                                </p>
                                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                                    <li><strong>Healthcare Providers:</strong> With doctors, specialists, and healthcare professionals involved in your care</li>
                                    <li><strong>Insurance Companies:</strong> For billing and insurance claim processing</li>
                                    <li><strong>Legal Requirements:</strong> When required by law, court order, or regulatory authorities</li>
                                    <li><strong>Emergency Situations:</strong> To protect your health and safety in emergency situations</li>
                                    <li><strong>Business Associates:</strong> With trusted partners who assist in healthcare operations (under strict confidentiality agreements)</li>
                                </ul>
                            </CardContent>
                        </Card>

                        {/* Your Rights */}
                        <Card className="shadow-lg border-2 border-blue-500/30 bg-gradient-to-br from-gray-800 to-gray-900 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle className="text-blue-800">{t("your_privacy_rights")}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-700 mb-4">You have the right to:</p>
                                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                                    <li><strong>Access:</strong> Request copies of your personal and health information</li>
                                    <li><strong>Correct:</strong> Request correction of inaccurate or incomplete information</li>
                                    <li><strong>Delete:</strong> Request deletion of your personal information (subject to legal requirements)</li>
                                    <li><strong>Restrict:</strong> Request restrictions on how we use or share your information</li>
                                    <li><strong>Portable:</strong> Receive your information in a portable format</li>
                                    <li><strong>Opt-out:</strong> Opt out of certain communications and data processing</li>
                                </ul>
                            </CardContent>
                        </Card>

                        {/* Contact Information */}
                        <Card className="shadow-lg border-2 border-green-500/30 bg-gradient-to-br from-gray-800 to-gray-900 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle className="text-green-800">{t("contact_us")}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-700 mb-4">
                                    If you have questions about this Privacy Policy or wish to exercise your privacy rights, please contact us:
                                </p>
                                <div className="bg-green-50 p-4 rounded-lg space-y-2">
                                    <p><strong>{t("privacy_officer")}</strong></p>
                                    <p>Email: privacy@sevamed.com</p>
                                    <p>Phone: +1 (555) 123-4567</p>
                                    <p>Address: 123 Healthcare Street, Medical District, MD 12345</p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Updates */}
                        <Card className="shadow-lg border-2 border-yellow-500/30 bg-gradient-to-br from-gray-800 to-gray-900 backdrop-blur-sm">
                            <CardContent className="pt-6">
                                <p className="text-center text-yellow-800">
                                    <strong>{t("policy_updates")}:</strong> We may update this Privacy Policy periodically.
                                    We will notify you of any material changes via email or through our platform.
                                </p>
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
