import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import LanguageSelector from "../../components/common/LanguageSelector";
import ThemeToggle from "../../components/common/ThemeToggle";
import { useLanguage } from "../../contexts/LanguageContext";
import { Heart, ArrowLeft, UserCheck, FileText, Calendar, Clock, Shield, Users, CheckCircle, Star } from "lucide-react";

export default function PatientManagementPage() {
    const navigate = useNavigate();
    const { t } = useLanguage();

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900">
            {/* Header */}
            <header className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-b border-blue-200 dark:border-gray-700 sticky top-0 z-50 shadow-sm">
                <div className="container mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <Button
                                variant="ghost"
                                onClick={() => navigate("/")}
                                className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                            >
                                <ArrowLeft className="h-5 w-5" />
                                <span>Back to Home</span>
                            </Button>
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-green-600 rounded-lg flex items-center justify-center shadow-lg">
                                    <Heart className="text-white h-5 w-5" />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">{t("sevamed_hms")}</h1>
                                    <p className="text-sm text-blue-600 dark:text-blue-400">Patient Management</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center space-x-4">
                            <div className="w-48">
                                <LanguageSelector />
                            </div>
                            <ThemeToggle />
                        </div>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="py-20 bg-gradient-to-br from-blue-600 via-blue-700 to-green-600 relative overflow-hidden">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div className="text-white">
                            <div className="flex items-center space-x-3 mb-6">
                                <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center">
                                    <UserCheck className="h-8 w-8 text-white" />
                                </div>
                                <h1 className="text-5xl font-bold">Patient Management</h1>
                            </div>
                            <p className="text-xl text-blue-100 mb-8 leading-relaxed">
                                Comprehensive patient care management system designed to ensure every individual receives personalized,
                                coordinated healthcare throughout their medical journey. Because every life matters.
                            </p>
                            <div className="flex space-x-4">
                                <Button
                                    size="lg"
                                    className="bg-white text-blue-600 hover:bg-blue-50 shadow-lg transition-all duration-300 transform hover:scale-105"
                                    onClick={() => navigate("/register")}
                                >
                                    Get Started
                                </Button>
                                <Button
                                    variant="outline"
                                    size="lg"
                                    className="border-white text-white hover:bg-white hover:text-blue-600 transition-all duration-300"
                                    onClick={() => navigate("/login")}
                                >
                                    Patient Login
                                </Button>
                            </div>
                        </div>
                        <div className="relative">
                            <img
                                src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=800&q=80"
                                alt="Patient Management - Doctor consulting with patient"
                                className="w-full h-96 object-cover rounded-2xl shadow-2xl"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent rounded-2xl"></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Why Patient Management Matters */}
            <section className="py-16 bg-white dark:bg-gray-900">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-blue-800 dark:text-blue-400 mb-6">Why Patient Management Saves Lives</h2>
                        <p className="text-xl text-blue-600 dark:text-blue-300 max-w-4xl mx-auto leading-relaxed">
                            Effective patient management is the cornerstone of quality healthcare. It ensures continuity of care,
                            reduces medical errors, and provides healthcare providers with comprehensive information to make informed decisions
                            that can be the difference between life and death.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <Card className="text-center hover:shadow-xl transition-all duration-300 border-blue-200 dark:border-blue-700">
                            <CardHeader>
                                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Shield className="h-8 w-8 text-white" />
                                </div>
                                <CardTitle className="text-blue-800 dark:text-blue-400">Prevents Medical Errors</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-blue-700 dark:text-blue-300">
                                    Comprehensive medical records prevent dangerous drug interactions, allergic reactions, and treatment conflicts
                                    that could be life-threatening.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="text-center hover:shadow-xl transition-all duration-300 border-green-200 dark:border-green-700">
                            <CardHeader>
                                <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Clock className="h-8 w-8 text-white" />
                                </div>
                                <CardTitle className="text-green-800 dark:text-green-400">Faster Emergency Response</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-green-700 dark:text-green-300">
                                    Instant access to patient history, medications, and conditions enables rapid, informed decision-making
                                    during critical emergencies.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="text-center hover:shadow-xl transition-all duration-300 border-purple-200 dark:border-purple-700">
                            <CardHeader>
                                <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Heart className="h-8 w-8 text-white" />
                                </div>
                                <CardTitle className="text-purple-800 dark:text-purple-400">Continuous Care</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-purple-700 dark:text-purple-300">
                                    Seamless coordination between different healthcare providers ensures no critical information is lost
                                    during care transitions.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Key Features */}
            <section className="py-16 bg-gradient-to-br from-blue-50 to-green-50 dark:from-gray-800 dark:to-blue-800">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-blue-800 dark:text-blue-400 mb-6">Comprehensive Patient Management Features</h2>
                        <p className="text-xl text-blue-600 dark:text-blue-300">
                            Every feature designed with one goal: saving and improving lives through better healthcare coordination
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                            <div className="flex items-start space-x-4 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <FileText className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold text-blue-800 dark:text-blue-400 mb-2">Complete Medical Records</h3>
                                    <p className="text-blue-600 dark:text-blue-300">
                                        Comprehensive digital health records including medical history, diagnoses, treatments, medications,
                                        and test results - all accessible instantly to authorized healthcare providers.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-4 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                                <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <Calendar className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold text-green-800 dark:text-green-400 mb-2">Appointment Management</h3>
                                    <p className="text-green-600 dark:text-green-300">
                                        Integrated scheduling system that tracks appointments, sends reminders, and ensures patients
                                        never miss critical follow-ups or preventive care visits.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-4 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                                <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <Users className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold text-purple-800 dark:text-purple-400 mb-2">Care Team Coordination</h3>
                                    <p className="text-purple-600 dark:text-purple-300">
                                        Facilitates communication between doctors, nurses, specialists, and other healthcare providers
                                        to ensure coordinated, comprehensive care.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-start space-x-4 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                                <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <Heart className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold text-red-800 dark:text-red-400 mb-2">Real-time Health Monitoring</h3>
                                    <p className="text-red-600 dark:text-red-300">
                                        Continuous tracking of vital signs, symptoms, and health indicators with automated alerts
                                        for concerning changes that require immediate attention.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-4 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                                <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <CheckCircle className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold text-orange-800 dark:text-orange-400 mb-2">Treatment Compliance</h3>
                                    <p className="text-orange-600 dark:text-orange-300">
                                        Medication reminders, treatment plan tracking, and compliance monitoring to ensure patients
                                        follow prescribed treatments for optimal health outcomes.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-4 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                                <div className="w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <Star className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold text-indigo-800 dark:text-indigo-400 mb-2">Quality Metrics</h3>
                                    <p className="text-indigo-600 dark:text-indigo-300">
                                        Patient satisfaction tracking, outcome measurements, and continuous quality improvement
                                        to ensure the highest standards of care delivery.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Call to Action */}
            <section className="py-16 bg-gradient-to-r from-blue-600 to-green-600 text-white">
                <div className="container mx-auto px-6 text-center">
                    <h2 className="text-4xl font-bold mb-6">Experience Comprehensive Patient Care</h2>
                    <p className="text-xl mb-8 max-w-3xl mx-auto">
                        Join thousands of patients who trust SevaMed HMS for their healthcare management.
                        Because your health deserves the highest level of care and coordination.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
                        <Button
                            size="lg"
                            className="bg-white text-blue-600 hover:bg-blue-50 shadow-lg transition-all duration-300 transform hover:scale-105"
                            onClick={() => navigate("/register")}
                        >
                            Register as Patient
                        </Button>
                        <Button
                            variant="outline"
                            size="lg"
                            className="border-white text-white hover:bg-white hover:text-blue-600 transition-all duration-300"
                            onClick={() => navigate("/staff-login")}
                        >
                            Healthcare Provider Login
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    );
}
