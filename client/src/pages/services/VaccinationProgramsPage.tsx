import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import LanguageSelector from "../../components/common/LanguageSelector";
import ThemeToggle from "../../components/common/ThemeToggle";
import { useLanguage } from "../../contexts/LanguageContext";
import { useNavigate } from "react-router-dom";
import {
    Heart, ArrowLeft, Shield, Syringe, Users, Baby, UserCheck,
    Calendar, Clock, Phone, MapPin, CheckCircle, AlertTriangle,
    Hospital, Globe, Award, FileText, Activity
} from "lucide-react";

export default function VaccinationProgramsPage() {
    const navigate = useNavigate();
    const { t } = useLanguage();

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-green-900">
            {/* Header */}
            <header className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-b border-green-200 dark:border-gray-700 sticky top-0 z-50 shadow-sm">
                <div className="container mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <Button
                                variant="ghost"
                                onClick={() => navigate("/")}
                                className="flex items-center space-x-2 text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"
                            >
                                <ArrowLeft className="h-5 w-5" />
                                <span>Back to Home</span>
                            </Button>
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-blue-600 rounded-lg flex items-center justify-center shadow-lg">
                                    <Heart className="text-white h-5 w-5" />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">{t("sevamed_hms")}</h1>
                                    <p className="text-sm text-green-600 dark:text-green-400">Vaccination Programs</p>
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
            <section className="relative bg-gradient-to-br from-green-600 via-green-700 to-blue-600 py-20 overflow-hidden">
                <div className="absolute inset-0">
                    <img
                        src="https://images.unsplash.com/photo-1632053002739-e7ea5dc71084?auto=format&fit=crop&w=1600&q=80"
                        alt="Vaccination Programs - Doctor administering vaccine"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-green-600/70" />
                </div>

                <div className="container mx-auto px-6 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div className="text-white">
                            <div className="flex items-center space-x-3 mb-6">
                                <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm animate-pulse">
                                    <Syringe className="h-8 w-8 text-white" />
                                </div>
                                <h1 className="text-5xl font-bold">Vaccination Programs</h1>
                            </div>
                            <p className="text-xl text-green-100 mb-8 leading-relaxed">
                                Protecting communities through comprehensive immunization services. Our vaccination programs
                                safeguard individuals and families from preventable diseases, supporting public health
                                initiatives with the highest standards of care and safety.
                            </p>
                            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 mb-8">
                                <div className="flex items-center space-x-3 text-yellow-300">
                                    <Shield className="h-6 w-6" />
                                    <span className="font-semibold text-lg">WHO & CDC Approved Vaccines • 98.5% Efficacy Rate</span>
                                </div>
                            </div>
                            <div className="flex space-x-4">
                                <Button
                                    size="lg"
                                    className="bg-white text-green-600 hover:bg-green-50 shadow-lg transition-all duration-300 transform hover:scale-105"
                                    onClick={() => navigate("/register")}
                                >
                                    <Calendar className="h-5 w-5 mr-2" />
                                    Schedule Vaccination
                                </Button>
                                <Button
                                    variant="outline"
                                    size="lg"
                                    className="border-white text-white hover:bg-white hover:text-green-600 transition-all duration-300"
                                    onClick={() => navigate("/login")}
                                >
                                    <FileText className="h-5 w-5 mr-2" />
                                    Vaccination Record
                                </Button>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 shadow-2xl">
                                <h3 className="text-2xl font-bold text-white mb-4">Prevention Statistics</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="text-center">
                                        <div className="text-3xl font-bold text-yellow-300">2.5M+</div>
                                        <div className="text-green-100">Lives Saved Annually</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-3xl font-bold text-yellow-300">95%</div>
                                        <div className="text-green-100">Disease Reduction</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-3xl font-bold text-yellow-300">50K+</div>
                                        <div className="text-green-100">Vaccines Administered</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-3xl font-bold text-yellow-300">24/7</div>
                                        <div className="text-green-100">Emergency Vaccines</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Vaccination Benefits */}
            <section className="py-16 bg-white dark:bg-gray-900">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-green-800 dark:text-green-400 mb-6">Why Vaccination Matters for Community Health</h2>
                        <p className="text-xl text-green-600 dark:text-green-300 max-w-4xl mx-auto leading-relaxed">
                            Vaccines are one of the most successful public health achievements, preventing millions of deaths
                            worldwide. Our comprehensive vaccination programs protect individuals and create community immunity,
                            safeguarding vulnerable populations and preventing disease outbreaks.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                        <div className="text-center bg-green-50 dark:bg-green-900/20 p-6 rounded-xl">
                            <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">95%</div>
                            <div className="text-green-800 dark:text-green-300 font-semibold">Disease Prevention</div>
                            <div className="text-sm text-green-600 dark:text-green-400 mt-1">Preventable disease reduction</div>
                        </div>
                        <div className="text-center bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl">
                            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">85%</div>
                            <div className="text-blue-800 dark:text-blue-300 font-semibold">Herd Immunity</div>
                            <div className="text-sm text-blue-600 dark:text-blue-400 mt-1">Community protection rate</div>
                        </div>
                        <div className="text-center bg-purple-50 dark:bg-purple-900/20 p-6 rounded-xl">
                            <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">99%</div>
                            <div className="text-purple-800 dark:text-purple-300 font-semibold">Safety Profile</div>
                            <div className="text-sm text-purple-600 dark:text-purple-400 mt-1">Vaccine safety record</div>
                        </div>
                        <div className="text-center bg-orange-50 dark:bg-orange-900/20 p-6 rounded-xl">
                            <div className="text-3xl font-bold text-orange-600 dark:text-orange-400 mb-2">2-3M</div>
                            <div className="text-orange-800 dark:text-orange-300 font-semibold">Lives Saved</div>
                            <div className="text-sm text-orange-600 dark:text-orange-400 mt-1">Deaths prevented annually</div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <Card className="text-center hover:shadow-xl transition-all duration-300 border-green-200 dark:border-green-700">
                            <CardHeader>
                                <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Shield className="h-8 w-8 text-white" />
                                </div>
                                <CardTitle className="text-green-800 dark:text-green-400">Individual Protection</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-green-700 dark:text-green-300">
                                    Vaccines provide direct protection by building immunity against specific diseases,
                                    reducing the risk of infection, severe illness, and complications.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="text-center hover:shadow-xl transition-all duration-300 border-blue-200 dark:border-blue-700">
                            <CardHeader>
                                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Users className="h-8 w-8 text-white" />
                                </div>
                                <CardTitle className="text-blue-800 dark:text-blue-400">Community Immunity</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-blue-700 dark:text-blue-300">
                                    High vaccination rates create herd immunity, protecting vulnerable populations
                                    who cannot be vaccinated due to medical conditions.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="text-center hover:shadow-xl transition-all duration-300 border-purple-200 dark:border-purple-700">
                            <CardHeader>
                                <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Globe className="h-8 w-8 text-white" />
                                </div>
                                <CardTitle className="text-purple-800 dark:text-purple-400">Disease Eradication</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-purple-700 dark:text-purple-300">
                                    Vaccination programs have successfully eradicated diseases like smallpox and
                                    brought others like polio to the brink of elimination.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Vaccination Programs */}
            <section className="py-16 bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-800 dark:to-green-800">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-green-800 dark:text-green-400 mb-6">Comprehensive Vaccination Programs</h2>
                        <p className="text-xl text-green-600 dark:text-green-300">
                            From infancy through adulthood, we provide complete immunization services for all life stages
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                        <Card className="hover:shadow-lg transition-all duration-300 border-green-200 dark:border-green-700">
                            <CardHeader className="bg-green-50 dark:bg-green-900/30">
                                <div className="flex items-center space-x-3">
                                    <Baby className="h-6 w-6 text-green-600 dark:text-green-400" />
                                    <CardTitle className="text-green-800 dark:text-green-400">Pediatric Immunization Program</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent className="p-6">
                                <p className="text-green-700 dark:text-green-300 mb-4">
                                    Complete childhood vaccination schedule following CDC and WHO guidelines, protecting
                                    children from birth through adolescence.
                                </p>
                                <div className="space-y-2">
                                    <div className="flex items-center space-x-2">
                                        <CheckCircle className="h-4 w-4 text-green-600" />
                                        <span className="text-sm text-green-700 dark:text-green-300">Birth - 2 years: 14 routine vaccines</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <CheckCircle className="h-4 w-4 text-green-600" />
                                        <span className="text-sm text-green-700 dark:text-green-300">School entry requirements</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <CheckCircle className="h-4 w-4 text-green-600" />
                                        <span className="text-sm text-green-700 dark:text-green-300">Adolescent boosters (11-18 years)</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="hover:shadow-lg transition-all duration-300 border-blue-200 dark:border-blue-700">
                            <CardHeader className="bg-blue-50 dark:bg-blue-900/30">
                                <div className="flex items-center space-x-3">
                                    <UserCheck className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                                    <CardTitle className="text-blue-800 dark:text-blue-400">Adult Vaccination Services</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent className="p-6">
                                <p className="text-blue-700 dark:text-blue-300 mb-4">
                                    Adult immunizations including routine boosters, travel vaccines, and occupational
                                    health requirements for healthcare workers.
                                </p>
                                <div className="space-y-2">
                                    <div className="flex items-center space-x-2">
                                        <CheckCircle className="h-4 w-4 text-blue-600" />
                                        <span className="text-sm text-blue-700 dark:text-blue-300">Annual flu vaccination</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <CheckCircle className="h-4 w-4 text-blue-600" />
                                        <span className="text-sm text-blue-700 dark:text-blue-300">COVID-19 vaccines & boosters</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <CheckCircle className="h-4 w-4 text-blue-600" />
                                        <span className="text-sm text-blue-700 dark:text-blue-300">Travel medicine consultations</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section className="py-16 bg-white dark:bg-gray-900">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-green-800 dark:text-green-400 mb-6">Schedule Your Vaccination</h2>
                        <p className="text-xl text-green-600 dark:text-green-300">
                            Book your appointment today and take the first step towards protecting your health
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <Card className="text-center hover:shadow-lg transition-all duration-300 border-green-200 dark:border-green-700">
                            <CardContent className="p-6">
                                <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Phone className="h-8 w-8 text-white" />
                                </div>
                                <h4 className="font-bold text-green-800 dark:text-green-400 mb-2">Call to Schedule</h4>
                                <p className="text-green-600 dark:text-green-300 mb-2">+91 40 2345 6789</p>
                                <p className="text-sm text-green-500 dark:text-green-400">Mon-Sat: 8 AM - 8 PM</p>
                            </CardContent>
                        </Card>

                        <Card className="text-center hover:shadow-lg transition-all duration-300 border-blue-200 dark:border-blue-700">
                            <CardContent className="p-6">
                                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Calendar className="h-8 w-8 text-white" />
                                </div>
                                <h4 className="font-bold text-blue-800 dark:text-blue-400 mb-2">Online Booking</h4>
                                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                                    Book Appointment
                                </Button>
                                <p className="text-sm text-blue-500 dark:text-blue-400 mt-2">Available 24/7</p>
                            </CardContent>
                        </Card>

                        <Card className="text-center hover:shadow-lg transition-all duration-300 border-purple-200 dark:border-purple-700">
                            <CardContent className="p-6">
                                <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <MapPin className="h-8 w-8 text-white" />
                                </div>
                                <h4 className="font-bold text-purple-800 dark:text-purple-400 mb-2">Visit Our Clinic</h4>
                                <p className="text-purple-600 dark:text-purple-300 text-sm">Vaccination Center, Block A</p>
                                <p className="text-sm text-purple-500 dark:text-purple-400">Walk-ins Welcome</p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-black text-white py-12">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div>
                            <div className="flex items-center space-x-3 mb-4">
                                <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-blue-600 rounded-lg flex items-center justify-center">
                                    <Heart className="text-white h-5 w-5" />
                                </div>
                                <span className="text-xl font-bold">{t("sevamed_hms")}</span>
                            </div>
                            <p className="text-gray-400 mb-4">Protecting communities through comprehensive vaccination programs.</p>
                        </div>
                        <div>
                            <h4 className="font-bold mb-4">Services</h4>
                            <ul className="space-y-2 text-gray-400">
                                <li>Pediatric Vaccines</li>
                                <li>Adult Immunization</li>
                                <li>Travel Medicine</li>
                                <li>Occupational Health</li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold mb-4">Contact</h4>
                            <ul className="space-y-2 text-gray-400">
                                <li>+91 40 2345 6789</li>
                                <li>vaccines@sevamed.com</li>
                                <li>Hyderabad, Telangana</li>
                                <li>Mon-Sat: 8 AM - 8 PM</li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold mb-4">Emergency</h4>
                            <p className="text-yellow-400 font-bold">+91 40 911 HELP</p>
                            <p className="text-gray-400">24/7 Emergency Services</p>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
