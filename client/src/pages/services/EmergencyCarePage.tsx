import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import LanguageSelector from "../../components/common/LanguageSelector";
import ThemeToggle from "../../components/common/ThemeToggle";
import { useLanguage } from "../../contexts/LanguageContext";
import { Heart, ArrowLeft, Ambulance, Clock, Zap, Shield, Phone, MapPin, Activity, AlertTriangle, Users, Stethoscope } from "lucide-react";

export default function EmergencyCarePage() {
    const navigate = useNavigate();
    const { t } = useLanguage();

    return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-red-900">
            {/* Header */}
            <header className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-b border-red-200 dark:border-gray-700 sticky top-0 z-50 shadow-sm">
                <div className="container mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <Button
                                variant="ghost"
                                onClick={() => navigate("/")}
                                className="flex items-center space-x-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                            >
                                <ArrowLeft className="h-5 w-5" />
                                <span>Back to Home</span>
                            </Button>
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-orange-600 rounded-lg flex items-center justify-center shadow-lg">
                                    <Heart className="text-white h-5 w-5" />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">{t("sevamed_hms")}</h1>
                                    <p className="text-sm text-red-600 dark:text-red-400">Emergency Care</p>
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
            <section className="py-20 bg-gradient-to-br from-red-600 via-red-700 to-orange-600 relative overflow-hidden">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div className="text-white">
                            <div className="flex items-center space-x-3 mb-6">
                                <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center animate-pulse">
                                    <Ambulance className="h-8 w-8 text-white" />
                                </div>
                                <h1 className="text-5xl font-bold">Emergency Care</h1>
                            </div>
                            <p className="text-xl text-red-100 mb-8 leading-relaxed">
                                When every second counts, our 24/7 emergency care team is ready to save lives.
                                Equipped with state-of-the-art technology and staffed by experienced emergency medicine specialists,
                                we provide rapid, life-saving care when you need it most.
                            </p>
                            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 mb-8">
                                <div className="flex items-center space-x-3 text-yellow-300">
                                    <AlertTriangle className="h-6 w-6" />
                                    <span className="font-semibold text-lg">Emergency Hotline: +1 (555) 911-HELP</span>
                                </div>
                            </div>
                            <div className="flex space-x-4">
                                <Button
                                    size="lg"
                                    className="bg-white text-red-600 hover:bg-red-50 shadow-lg transition-all duration-300 transform hover:scale-105"
                                    onClick={() => navigate("/register")}
                                >
                                    Get Medical ID
                                </Button>
                                <Button
                                    variant="outline"
                                    size="lg"
                                    className="border-white text-white hover:bg-white hover:text-red-600 transition-all duration-300"
                                    onClick={() => navigate("/login")}
                                >
                                    Patient Portal
                                </Button>
                            </div>
                        </div>
                        <div className="relative">
                            <img
                                src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=800&q=80"
                                alt="Emergency Care - Medical team in action"
                                className="w-full h-96 object-cover rounded-2xl shadow-2xl"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent rounded-2xl"></div>
                            <div className="absolute top-4 right-4">
                                <div className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold animate-pulse">
                                    24/7 AVAILABLE
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Critical Response Times */}
            <section className="py-16 bg-white dark:bg-gray-900">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-red-800 dark:text-red-400 mb-6">Why Every Second Matters in Emergency Care</h2>
                        <p className="text-xl text-red-600 dark:text-red-300 max-w-4xl mx-auto leading-relaxed">
                            In emergency medicine, the difference between life and death is often measured in minutes. Our rapid response
                            protocols and advanced emergency systems are designed to provide immediate, life-saving interventions when
                            every moment is critical.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                        <div className="text-center bg-red-50 dark:bg-red-900/20 p-6 rounded-xl">
                            <div className="text-3xl font-bold text-red-600 dark:text-red-400 mb-2">&lt; 2 min</div>
                            <div className="text-red-800 dark:text-red-300 font-semibold">Triage Assessment</div>
                            <div className="text-sm text-red-600 dark:text-red-400 mt-1">Initial patient evaluation</div>
                        </div>
                        <div className="text-center bg-orange-50 dark:bg-orange-900/20 p-6 rounded-xl">
                            <div className="text-3xl font-bold text-orange-600 dark:text-orange-400 mb-2">&lt; 5 min</div>
                            <div className="text-orange-800 dark:text-orange-300 font-semibold">Critical Care Response</div>
                            <div className="text-sm text-orange-600 dark:text-orange-400 mt-1">Life-saving interventions</div>
                        </div>
                        <div className="text-center bg-yellow-50 dark:bg-yellow-900/20 p-6 rounded-xl">
                            <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400 mb-2">&lt; 10 min</div>
                            <div className="text-yellow-800 dark:text-yellow-300 font-semibold">Specialist Consultation</div>
                            <div className="text-sm text-yellow-600 dark:text-yellow-400 mt-1">Expert medical review</div>
                        </div>
                        <div className="text-center bg-green-50 dark:bg-green-900/20 p-6 rounded-xl">
                            <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">&lt; 15 min</div>
                            <div className="text-green-800 dark:text-green-300 font-semibold">Treatment Initiation</div>
                            <div className="text-sm text-green-600 dark:text-green-400 mt-1">Comprehensive care begins</div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <Card className="text-center hover:shadow-xl transition-all duration-300 border-red-200 dark:border-red-700">
                            <CardHeader>
                                <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Zap className="h-8 w-8 text-white" />
                                </div>
                                <CardTitle className="text-red-800 dark:text-red-400">Rapid Response</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-red-700 dark:text-red-300">
                                    Our emergency team is trained to respond within minutes, providing immediate stabilization
                                    and life-saving interventions for critical patients.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="text-center hover:shadow-xl transition-all duration-300 border-orange-200 dark:border-orange-700">
                            <CardHeader>
                                <div className="w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Activity className="h-8 w-8 text-white" />
                                </div>
                                <CardTitle className="text-orange-800 dark:text-orange-400">Advanced Life Support</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-orange-700 dark:text-orange-300">
                                    State-of-the-art equipment including defibrillators, ventilators, and cardiac monitors
                                    provide advanced life support capabilities.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="text-center hover:shadow-xl transition-all duration-300 border-yellow-200 dark:border-yellow-700">
                            <CardHeader>
                                <div className="w-16 h-16 bg-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Users className="h-8 w-8 text-white" />
                                </div>
                                <CardTitle className="text-yellow-800 dark:text-yellow-400">Expert Medical Team</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-yellow-700 dark:text-yellow-300">
                                    Board-certified emergency physicians, trauma surgeons, and specialized nurses
                                    available 24/7 for immediate expert care.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Emergency Services */}
            <section className="py-16 bg-gradient-to-br from-red-50 to-orange-50 dark:from-gray-800 dark:to-red-800">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-red-800 dark:text-red-400 mb-6">Comprehensive Emergency Services</h2>
                        <p className="text-xl text-red-600 dark:text-red-300">
                            Our emergency department is equipped to handle any medical emergency with precision and compassion
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                            <div className="flex items-start space-x-4 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                                <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <Heart className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold text-red-800 dark:text-red-400 mb-2">Cardiac Emergency Care</h3>
                                    <p className="text-red-600 dark:text-red-300">
                                        Immediate treatment for heart attacks, cardiac arrest, and other cardiovascular emergencies
                                        with advanced cardiac life support and intervention capabilities.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-4 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                                <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <AlertTriangle className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold text-orange-800 dark:text-orange-400 mb-2">Trauma Care</h3>
                                    <p className="text-orange-600 dark:text-orange-300">
                                        Level 1 trauma center capabilities for severe injuries from accidents, falls, and violent incidents
                                        with immediate surgical intervention available.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-4 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <Activity className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold text-blue-800 dark:text-blue-400 mb-2">Stroke Treatment</h3>
                                    <p className="text-blue-600 dark:text-blue-300">
                                        Rapid stroke assessment and treatment protocols including thrombolytic therapy
                                        and emergency neurology consultation to minimize brain damage.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-start space-x-4 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                                <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <Stethoscope className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold text-purple-800 dark:text-purple-400 mb-2">Pediatric Emergency</h3>
                                    <p className="text-purple-600 dark:text-purple-300">
                                        Specialized pediatric emergency care with child-friendly equipment and pediatric emergency
                                        specialists trained in treating infants, children, and adolescents.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-4 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                                <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <Shield className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold text-green-800 dark:text-green-400 mb-2">Poisoning & Overdose</h3>
                                    <p className="text-green-600 dark:text-green-300">
                                        Immediate treatment for poisoning, drug overdoses, and toxic exposures with direct access
                                        to poison control specialists and antidote protocols.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-4 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                                <div className="w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <Clock className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold text-indigo-800 dark:text-indigo-400 mb-2">Mental Health Crisis</h3>
                                    <p className="text-indigo-600 dark:text-indigo-300">
                                        Compassionate emergency psychiatric care for mental health crises, suicidal ideation,
                                        and acute psychological emergencies with immediate intervention.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Emergency Contact Information */}
            <section className="py-16 bg-red-600 text-white">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold mb-6">Emergency Contact Information</h2>
                        <p className="text-xl text-red-100 mb-8">
                            In a medical emergency, every second counts. Keep our emergency contact information readily available.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
                            <CardHeader className="text-center">
                                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Phone className="h-8 w-8 text-white" />
                                </div>
                                <CardTitle className="text-white">Emergency Hotline</CardTitle>
                            </CardHeader>
                            <CardContent className="text-center">
                                <div className="text-2xl font-bold mb-2">+1 (555) 911-HELP</div>
                                <p className="text-red-100">Available 24/7 for immediate emergency response</p>
                            </CardContent>
                        </Card>

                        <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
                            <CardHeader className="text-center">
                                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <MapPin className="h-8 w-8 text-white" />
                                </div>
                                <CardTitle className="text-white">Emergency Department</CardTitle>
                            </CardHeader>
                            <CardContent className="text-center">
                                <div className="text-lg font-semibold mb-2">SevaMed Hospital</div>
                                <p className="text-red-100">123 Healthcare Street<br />Medical District, MD 12345</p>
                            </CardContent>
                        </Card>

                        <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
                            <CardHeader className="text-center">
                                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Ambulance className="h-8 w-8 text-white" />
                                </div>
                                <CardTitle className="text-white">Ambulance Services</CardTitle>
                            </CardHeader>
                            <CardContent className="text-center">
                                <div className="text-lg font-semibold mb-2">Advanced Life Support</div>
                                <p className="text-red-100">Paramedic-staffed ambulances with emergency medical equipment</p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Call to Action */}
            <section className="py-16 bg-gradient-to-r from-red-600 to-orange-600 text-white">
                <div className="container mx-auto px-6 text-center">
                    <h2 className="text-4xl font-bold mb-6">Be Prepared for Medical Emergencies</h2>
                    <p className="text-xl mb-8 max-w-3xl mx-auto">
                        While we hope you never need emergency care, being prepared can save precious time.
                        Register with SevaMed HMS to have your medical information readily available to our emergency team.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
                        <Button
                            size="lg"
                            className="bg-white text-red-600 hover:bg-red-50 shadow-lg transition-all duration-300 transform hover:scale-105"
                            onClick={() => navigate("/register")}
                        >
                            Create Emergency Medical Profile
                        </Button>
                        <Button
                            variant="outline"
                            size="lg"
                            className="border-white text-white hover:bg-white hover:text-red-600 transition-all duration-300"
                            onClick={() => navigate("/staff-login")}
                        >
                            Healthcare Provider Access
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    );
}
