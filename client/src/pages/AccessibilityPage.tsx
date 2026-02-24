import { useNavigate } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Heart, Accessibility, Volume2, Eye, MousePointer, Keyboard, ArrowLeft, CheckCircle } from "lucide-react";

export default function AccessibilityPage() {
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
                                <Accessibility className="text-white h-10 w-10" />
                            </div>
                        </div>
                        <h1 className="text-4xl font-bold text-blue-800 mb-4">{t("accessibility_statement")}</h1>
                        <p className="text-xl text-blue-600">{t("making_healthcare_accessible")}</p>
                        <p className="text-sm text-gray-600 mt-2">{t("commitment_inclusive_design")}</p>
                    </div>

                    {/* Accessibility Information */}
                    <div className="space-y-8">
                        {/* Our Commitment */}
                        <Card className="shadow-lg border-2 border-blue-500/30 bg-gradient-to-br from-gray-800 to-gray-900 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2 text-blue-800">
                                    <CheckCircle className="h-5 w-5" />
                                    <span>{t("accessibility_commitment")}</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-700 mb-4">
                                    SevaMed Healthcare Management System is committed to ensuring digital accessibility for people with disabilities.
                                    We continually improve the user experience for everyone and apply the relevant accessibility standards.
                                </p>
                                <p className="text-gray-700 mb-4">
                                    We believe that healthcare should be accessible to all individuals, regardless of their abilities or disabilities.
                                    Our platform is designed to be usable by people with a wide range of disabilities, including visual, auditory,
                                    motor, and cognitive impairments.
                                </p>
                                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                                    <p className="text-blue-800 font-semibold">
                                        We aim to conform to the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA standards.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Accessibility Features */}
                        <Card className="shadow-lg border-2 border-green-500/30 bg-gradient-to-br from-gray-800 to-gray-900 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2 text-green-800">
                                    <Accessibility className="h-5 w-5" />
                                    <span>{t("accessibility_features")}</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="border-l-4 border-blue-500 pl-4">
                                        <div className="flex items-center space-x-2 mb-2">
                                            <Eye className="h-5 w-5 text-blue-600" />
                                            <h4 className="font-semibold text-blue-700">{t("visual_accessibility")}</h4>
                                        </div>
                                        <ul className="list-disc pl-6 space-y-1 text-gray-600">
                                            <li>High contrast color schemes</li>
                                            <li>Scalable text and adjustable font sizes</li>
                                            <li>Alternative text for images and icons</li>
                                            <li>Screen reader compatibility</li>
                                            <li>Focus indicators for keyboard navigation</li>
                                            <li>Color-blind friendly design</li>
                                        </ul>
                                    </div>

                                    <div className="border-l-4 border-green-500 pl-4">
                                        <div className="flex items-center space-x-2 mb-2">
                                            <Volume2 className="h-5 w-5 text-green-600" />
                                            <h4 className="font-semibold text-green-700">{t("audio_accessibility")}</h4>
                                        </div>
                                        <ul className="list-disc pl-6 space-y-1 text-gray-600">
                                            <li>Captions for video content</li>
                                            <li>Text alternatives for audio information</li>
                                            <li>Visual alerts and notifications</li>
                                            <li>Adjustable audio controls</li>
                                            <li>Sign language interpretation options</li>
                                        </ul>
                                    </div>

                                    <div className="border-l-4 border-purple-500 pl-4">
                                        <div className="flex items-center space-x-2 mb-2">
                                            <Keyboard className="h-5 w-5 text-purple-600" />
                                            <h4 className="font-semibold text-purple-700">{t("motor_accessibility")}</h4>
                                        </div>
                                        <ul className="list-disc pl-6 space-y-1 text-gray-600">
                                            <li>Full keyboard navigation support</li>
                                            <li>Adjustable click targets and button sizes</li>
                                            <li>Voice control compatibility</li>
                                            <li>Extended timeout options</li>
                                            <li>Switch device support</li>
                                        </ul>
                                    </div>

                                    <div className="border-l-4 border-orange-500 pl-4">
                                        <div className="flex items-center space-x-2 mb-2">
                                            <MousePointer className="h-5 w-5 text-orange-600" />
                                            <h4 className="font-semibold text-orange-700">{t("cognitive_accessibility")}</h4>
                                        </div>
                                        <ul className="list-disc pl-6 space-y-1 text-gray-600">
                                            <li>Clear and simple language</li>
                                            <li>Consistent navigation patterns</li>
                                            <li>Error prevention and clear error messages</li>
                                            <li>Progress indicators for multi-step processes</li>
                                            <li>Customizable interface complexity</li>
                                        </ul>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Technical Standards */}
                        <Card className="shadow-lg border-2 border-blue-500/30 bg-gradient-to-br from-gray-800 to-gray-900 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle className="text-blue-800">{t("technical_standards_compliance")}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div>
                                        <h4 className="font-semibold text-blue-700 mb-2">{t("standards_we_follow")}</h4>
                                        <ul className="list-disc pl-6 space-y-1 text-gray-700">
                                            <li><strong>WCAG 2.1 Level AA:</strong> Web Content Accessibility Guidelines</li>
                                            <li><strong>Section 508:</strong> Federal accessibility requirements</li>
                                            <li><strong>ADA:</strong> Americans with Disabilities Act compliance</li>
                                            <li><strong>ARIA:</strong> Accessible Rich Internet Applications standards</li>
                                        </ul>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-blue-700 mb-2">{t("testing_methods")}</h4>
                                        <ul className="list-disc pl-6 space-y-1 text-gray-700">
                                            <li>Automated accessibility testing with industry-standard tools</li>
                                            <li>Manual testing with screen readers and assistive technologies</li>
                                            <li>User testing with individuals who have disabilities</li>
                                            <li>Regular accessibility audits and improvements</li>
                                        </ul>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Contact and Feedback */}
                        <Card className="shadow-lg border-2 border-green-500/30 bg-gradient-to-br from-gray-800 to-gray-900 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle className="text-green-800">{t("accessibility_support_feedback")}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-700 mb-4">
                                    We welcome your feedback on the accessibility of SevaMed HMS. Please let us know if you encounter
                                    accessibility barriers or have suggestions for improvement:
                                </p>
                                <div className="bg-green-50 p-4 rounded-lg space-y-2">
                                    <p><strong>{t("accessibility_coordinator")}</strong></p>
                                    <p>Email: accessibility@sevamed.com</p>
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
