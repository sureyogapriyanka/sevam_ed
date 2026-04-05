import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import LanguageSelector from "../../components/common/LanguageSelector";
import ThemeToggle from "../../components/common/ThemeToggle";
import { useLanguage } from "../../contexts/LanguageContext";
import { Heart, ArrowLeft, Calendar, Clock, Users, CheckCircle, Smartphone, Bell, MapPin, Star } from "lucide-react";

export default function AppointmentSchedulingPage() {
    const navigate = useNavigate();
    const { t } = useLanguage();

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900">
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
                                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                                    <Heart className="text-white h-5 w-5" />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{t("sevamed_hms")}</h1>
                                    <p className="text-sm text-blue-600 dark:text-blue-400">Appointment Scheduling</p>
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
            <section className="py-20 bg-gradient-to-br from-blue-600 via-blue-700 to-purple-600 relative overflow-hidden">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div className="text-white">
                            <div className="flex items-center space-x-3 mb-6">
                                <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center">
                                    <Calendar className="h-8 w-8 text-white" />
                                </div>
                                <h1 className="text-5xl font-bold">Appointment Scheduling</h1>
                            </div>
                            <p className="text-xl text-blue-100 mb-8 leading-relaxed">
                                Seamless healthcare appointment management that puts your time and health first.
                                Book appointments, manage your schedule, and never miss important medical care
                                with our intelligent scheduling system designed for your convenience.
                            </p>
                            <div className="flex space-x-4">
                                <Button
                                    size="lg"
                                    className="bg-white text-blue-600 hover:bg-blue-50 shadow-lg transition-all duration-300 transform hover:scale-105"
                                    onClick={() => navigate("/register")}
                                >
                                    Book Appointment
                                </Button>
                                <Button
                                    variant="outline"
                                    size="lg"
                                    className="border-white text-white hover:bg-white hover:text-blue-600 transition-all duration-300"
                                    onClick={() => navigate("/login")}
                                >
                                    Manage Appointments
                                </Button>
                            </div>
                        </div>
                        <div className="relative">
                            <img
                                src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=800&q=80"
                                alt="Appointment Scheduling - Doctor and patient consultation"
                                className="w-full h-96 object-cover rounded-2xl shadow-2xl"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent rounded-2xl"></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Why Efficient Scheduling Matters */}
            <section className="py-16 bg-white dark:bg-gray-900">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-blue-800 dark:text-blue-400 mb-6">Why Smart Scheduling Saves Lives</h2>
                        <p className="text-xl text-blue-600 dark:text-blue-300 max-w-4xl mx-auto leading-relaxed">
                            Efficient appointment scheduling isn't just about convenience – it's about ensuring timely access to healthcare.
                            Early detection, preventive care, and consistent follow-ups through proper scheduling can be the difference
                            between minor treatment and major health complications.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <Card className="text-center hover:shadow-xl transition-all duration-300 border-blue-200 dark:border-blue-700">
                            <CardHeader>
                                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Clock className="h-8 w-8 text-white" />
                                </div>
                                <CardTitle className="text-blue-800 dark:text-blue-400">Timely Care Access</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-blue-700 dark:text-blue-300">
                                    Efficient scheduling ensures you get medical attention when you need it most,
                                    preventing minor issues from becoming serious health problems.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="text-center hover:shadow-xl transition-all duration-300 border-purple-200 dark:border-purple-700">
                            <CardHeader>
                                <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <CheckCircle className="h-8 w-8 text-white" />
                                </div>
                                <CardTitle className="text-purple-800 dark:text-purple-400">Preventive Care</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-purple-700 dark:text-purple-300">
                                    Regular check-ups and screenings scheduled automatically help detect
                                    health issues early when they're most treatable.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="text-center hover:shadow-xl transition-all duration-300 border-green-200 dark:border-green-700">
                            <CardHeader>
                                <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Users className="h-8 w-8 text-white" />
                                </div>
                                <CardTitle className="text-green-800 dark:text-green-400">Care Coordination</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-green-700 dark:text-green-300">
                                    Seamless coordination between different specialists and departments
                                    ensures comprehensive, continuous care without gaps.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Scheduling Features */}
            <section className="py-16 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-blue-800">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-blue-800 dark:text-blue-400 mb-6">Smart Scheduling Features</h2>
                        <p className="text-xl text-blue-600 dark:text-blue-300">
                            Advanced appointment management designed for your healthcare needs
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                            <div className="flex items-start space-x-4 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <Smartphone className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold text-blue-800 dark:text-blue-400 mb-2">24/7 Online Booking</h3>
                                    <p className="text-blue-600 dark:text-blue-300">
                                        Book appointments anytime, anywhere through our mobile app or website.
                                        Real-time availability and instant confirmation for your convenience.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-4 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                                <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <Bell className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold text-purple-800 dark:text-purple-400 mb-2">Smart Reminders</h3>
                                    <p className="text-purple-600 dark:text-purple-300">
                                        Automated appointment reminders via SMS, email, or app notifications.
                                        Never miss important medical appointments or follow-ups again.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-4 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                                <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <Users className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold text-green-800 dark:text-green-400 mb-2">Multi-Provider Coordination</h3>
                                    <p className="text-green-600 dark:text-green-300">
                                        Schedule with multiple doctors and specialists in one system.
                                        Coordinated care scheduling for complex medical needs.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-start space-x-4 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                                <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <Calendar className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold text-orange-800 dark:text-orange-400 mb-2">Recurring Appointments</h3>
                                    <p className="text-orange-600 dark:text-orange-300">
                                        Set up recurring appointments for ongoing treatments, therapy sessions,
                                        or regular check-ups. Automated scheduling for continuous care.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-4 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                                <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <MapPin className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold text-red-800 dark:text-red-400 mb-2">Location Flexibility</h3>
                                    <p className="text-red-600 dark:text-red-300">
                                        Choose from multiple clinic locations, telemedicine options, or home visits.
                                        Healthcare that adapts to your lifestyle and needs.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-4 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                                <div className="w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <Star className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold text-indigo-800 dark:text-indigo-400 mb-2">Priority Scheduling</h3>
                                    <p className="text-indigo-600 dark:text-indigo-300">
                                        Urgent care and emergency appointment slots. Immediate scheduling
                                        for time-sensitive medical conditions and referrals.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Call to Action */}
            <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                <div className="container mx-auto px-6 text-center">
                    <h2 className="text-4xl font-bold mb-6">Take Control of Your Healthcare Schedule</h2>
                    <p className="text-xl mb-8 max-w-3xl mx-auto">
                        Don't let scheduling barriers prevent you from getting the healthcare you need.
                        Our smart appointment system makes it easy to access care when and where you need it.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
                        <Button
                            size="lg"
                            className="bg-white text-blue-600 hover:bg-blue-50 shadow-lg transition-all duration-300 transform hover:scale-105"
                            onClick={() => navigate("/register")}
                        >
                            Start Scheduling Today
                        </Button>
                        <Button
                            variant="outline"
                            size="lg"
                            className="border-white text-white hover:bg-white hover:text-blue-600 transition-all duration-300"
                            onClick={() => navigate("/login")}
                        >
                            Access Patient Portal
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    );
}
