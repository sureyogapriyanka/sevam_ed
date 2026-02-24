import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Heart, FileText, Scale, AlertTriangle, ArrowLeft, CheckCircle, Users } from "lucide-react";

export default function TermsOfServicePage() {
    const { t } = useLanguage();
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 relative overflow-hidden">
            {/* Hospital Background Pattern */}
            <div
                className="absolute inset-0 opacity-5"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23059669' fill-opacity='0.1'%3E%3Cpath d='M30 30c0-11.046-8.954-20-20-20s-20 8.954-20 20 8.954 20 20 20 20-8.954 20-20zm-20-15a15 15 0 100 30 15 15 0 000-30z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }}
            />

            {/* Medical Cross Pattern Overlay */}
            <div
                className="absolute inset-0 opacity-3"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%232563eb' fill-opacity='0.05'%3E%3Cpath d='M18 0h4v18h18v4H22v18h-4V22H0v-4h18V0z'/%3E%3C/g%3E%3C/svg%3E")`,
                }}
            />

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
            <main className="container mx-auto px-6 py-12 relative z-10">
                <div className="max-w-4xl mx-auto">
                    {/* Page Header */}
                    <div className="text-center mb-12">
                        <div className="flex justify-center mb-6">
                            <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-green-600 rounded-lg flex items-center justify-center shadow-lg">
                                <Scale className="text-white h-10 w-10" />
                            </div>
                        </div>
                        <h1 className="text-4xl font-bold text-blue-800 mb-4">{t("terms_of_service")}</h1>
                        <p className="text-xl text-blue-600">{t("terms_service_description")}</p>
                        <p className="text-sm text-gray-600 mt-2">{t("last_updated")}: January 2024</p>
                    </div>

                    {/* Terms Sections */}
                    <div className="space-y-8">
                        {/* Agreement to Terms */}
                        <Card className="shadow-lg border-2 border-blue-500/30 bg-gradient-to-br from-gray-800 to-gray-900 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2 text-blue-800">
                                    <CheckCircle className="h-5 w-5" />
                                    <span>{t("agreement_to_terms")}</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-700 mb-4">
                                    By accessing and using SevaMed Healthcare Management System, you accept and agree to be bound by the terms and provision of this agreement.
                                    If you do not agree to abide by the above, please do not use this service.
                                </p>
                                <p className="text-gray-700">
                                    These terms apply to all users of the platform, including patients, healthcare providers, administrative staff, and any other authorized personnel.
                                </p>
                            </CardContent>
                        </Card>

                        {/* Service Description */}
                        <Card className="shadow-lg border-2 border-green-500/30 bg-gradient-to-br from-gray-800 to-gray-900 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2 text-green-800">
                                    <FileText className="h-5 w-5" />
                                    <span>{t("service_description")}</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-700 mb-4">
                                    SevaMed HMS provides a comprehensive healthcare management platform that includes:
                                </p>
                                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                                    <li><strong>Patient Management:</strong> Electronic health records, appointment scheduling, and patient communication</li>
                                    <li><strong>Staff Management:</strong> Role-based access, attendance tracking, and performance monitoring</li>
                                    <li><strong>Clinical Tools:</strong> Diagnostic support, treatment planning, and medical documentation</li>
                                    <li><strong>Administrative Functions:</strong> Billing, reporting, and compliance management</li>
                                    <li><strong>Communication Platform:</strong> Secure messaging between patients and healthcare providers</li>
                                </ul>
                            </CardContent>
                        </Card>

                        {/* User Responsibilities */}
                        <Card className="shadow-lg border-2 border-blue-500/30 bg-gradient-to-br from-gray-800 to-gray-900 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2 text-blue-800">
                                    <Users className="h-5 w-5" />
                                    <span>{t("user_responsibilities")}</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <h4 className="font-semibold text-blue-700 mb-2">{t("account_security")}</h4>
                                    <ul className="list-disc pl-6 space-y-1 text-gray-700">
                                        <li>Maintain the confidentiality of your login credentials</li>
                                        <li>Report any unauthorized access to your account immediately</li>
                                        <li>Use strong passwords and update them regularly</li>
                                        <li>Log out from shared or public computers</li>
                                    </ul>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-blue-700 mb-2">{t("appropriate_use")}</h4>
                                    <ul className="list-disc pl-6 space-y-1 text-gray-700">
                                        <li>Use the platform only for legitimate healthcare purposes</li>
                                        <li>Provide accurate and complete information</li>
                                        <li>Respect patient privacy and confidentiality</li>
                                        <li>Comply with all applicable healthcare regulations</li>
                                    </ul>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Healthcare Compliance */}
                        <Card className="shadow-lg border-2 border-red-500/30 bg-gradient-to-br from-gray-800 to-gray-900 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2 text-red-800">
                                    <AlertTriangle className="h-5 w-5" />
                                    <span>{t("healthcare_compliance")}</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div>
                                        <h4 className="font-semibold text-red-700 mb-2">HIPAA Compliance</h4>
                                        <p className="text-gray-700 mb-2">
                                            All users must comply with the Health Insurance Portability and Accountability Act (HIPAA) regulations:
                                        </p>
                                        <ul className="list-disc pl-6 space-y-1 text-gray-600">
                                            <li>Protect patient health information (PHI) at all times</li>
                                            <li>Access only the minimum necessary information required for your role</li>
                                            <li>Report any suspected privacy breaches immediately</li>
                                            <li>Complete required HIPAA training and maintain certification</li>
                                        </ul>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-red-700 mb-2">Medical Liability</h4>
                                        <p className="text-gray-700">
                                            Healthcare providers using this platform remain fully responsible for all medical decisions,
                                            diagnoses, and treatments. SevaMed HMS is a tool to assist in healthcare delivery but does not
                                            replace professional medical judgment.
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Prohibited Activities */}
                        <Card className="shadow-lg border-2 border-yellow-500/30 bg-gradient-to-br from-gray-800 to-gray-900 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle className="text-yellow-800">{t("prohibited_activities")}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-700 mb-4">The following activities are strictly prohibited:</p>
                                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                                    <li>Unauthorized access to patient records or system functions</li>
                                    <li>Sharing login credentials with unauthorized individuals</li>
                                    <li>Using the platform for fraudulent or illegal activities</li>
                                    <li>Attempting to bypass security measures or access controls</li>
                                    <li>Introducing malware, viruses, or other harmful code</li>
                                    <li>Interfering with the normal operation of the platform</li>
                                    <li>Violating patient privacy or confidentiality</li>
                                </ul>
                            </CardContent>
                        </Card>

                        {/* Data and Privacy */}
                        <Card className="shadow-lg border-2 border-green-500/30 bg-gradient-to-br from-gray-800 to-gray-900 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle className="text-green-800">{t("data_privacy")}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-700 mb-4">
                                    We are committed to protecting your privacy and the confidentiality of all health information:
                                </p>
                                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                                    <li>All data is encrypted in transit and at rest</li>
                                    <li>Access controls ensure only authorized personnel can view sensitive information</li>
                                    <li>Regular security audits and compliance assessments are conducted</li>
                                    <li>Data backup and disaster recovery procedures are maintained</li>
                                    <li>User activity is logged and monitored for security purposes</li>
                                </ul>
                                <p className="text-gray-700 mt-4">
                                    For detailed information about data handling, please refer to our Privacy Policy.
                                </p>
                            </CardContent>
                        </Card>

                        {/* Limitation of Liability */}
                        <Card className="shadow-lg border-2 border-blue-500/30 bg-gradient-to-br from-gray-800 to-gray-900 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle className="text-blue-800">{t("limitation_liability")}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-700 mb-4">
                                    While we strive to provide reliable and accurate services, SevaMed HMS:
                                </p>
                                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                                    <li>Does not guarantee uninterrupted or error-free operation</li>
                                    <li>Is not liable for medical decisions made using platform information</li>
                                    <li>Cannot be held responsible for technical failures beyond our control</li>
                                    <li>Limits liability to the maximum extent permitted by law</li>
                                </ul>
                                <p className="text-gray-700 mt-4">
                                    Users acknowledge that healthcare delivery involves inherent risks and that
                                    technology platforms are tools to assist, not replace, professional medical judgment.
                                </p>
                            </CardContent>
                        </Card>

                        {/* Termination */}
                        <Card className="shadow-lg border-2 border-red-500/30 bg-gradient-to-br from-gray-800 to-gray-900 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle className="text-red-800">{t("termination")}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-700 mb-4">
                                    We reserve the right to terminate or suspend access to our service:
                                </p>
                                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                                    <li>For violation of these terms of service</li>
                                    <li>For suspected fraudulent or illegal activity</li>
                                    <li>For failure to comply with healthcare regulations</li>
                                    <li>At our discretion with or without notice</li>
                                </ul>
                                <p className="text-gray-700 mt-4">
                                    Upon termination, users must cease all use of the platform and return any
                                    confidential information in their possession.
                                </p>
                            </CardContent>
                        </Card>

                        {/* Contact Information */}
                        <Card className="shadow-lg border-2 border-green-500/30 bg-gradient-to-br from-gray-800 to-gray-900 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle className="text-green-800">{t("contact_us")}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-700 mb-4">
                                    If you have questions about these Terms of Service, please contact us:
                                </p>
                                <div className="bg-green-50 p-4 rounded-lg space-y-2">
                                    <p><strong>Legal Department</strong></p>
                                    <p>Email: legal@sevamed.com</p>
                                    <p>Phone: +1 (555) 123-4567</p>
                                    <p>Address: 123 Healthcare Street, Medical District, MD 12345</p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Updates Notice */}
                        <Card className="shadow-lg border-blue-200 bg-blue-50">
                            <CardContent className="pt-6">
                                <p className="text-center text-blue-800">
                                    <strong>{t("terms_updates")}:</strong> We may update these Terms of Service periodically.
                                    Continued use of the platform after changes indicates acceptance of the new terms.
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
