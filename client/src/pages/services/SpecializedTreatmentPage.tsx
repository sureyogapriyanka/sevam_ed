import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import LanguageSelector from "../../components/common/LanguageSelector";
import ThemeToggle from "../../components/common/ThemeToggle";
import { useLanguage } from "../../contexts/LanguageContext";
import { Heart, ArrowLeft, Stethoscope, Brain, Eye, Bone, Microscope, Zap, Users, Award, Clock, CheckCircle } from "lucide-react";

export default function SpecializedTreatmentPage() {
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
                                    <p className="text-sm text-green-600 dark:text-green-400">Specialized Treatment</p>
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
            <section className="py-20 bg-gradient-to-br from-green-600 via-green-700 to-blue-600 relative overflow-hidden">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div className="text-white">
                            <div className="flex items-center space-x-3 mb-6">
                                <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center">
                                    <Stethoscope className="h-8 w-8 text-white" />
                                </div>
                                <h1 className="text-5xl font-bold">Specialized Treatment</h1>
                            </div>
                            <p className="text-xl text-green-100 mb-8 leading-relaxed">
                                Advanced medical specialties with cutting-edge treatments and world-class specialists.
                                When standard care isn't enough, our specialized treatment programs provide hope,
                                healing, and breakthrough solutions for complex medical conditions.
                            </p>
                            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 mb-8">
                                <div className="flex items-center space-x-3 text-yellow-300">
                                    <Award className="h-6 w-6" />
                                    <span className="font-semibold text-lg">Board-Certified Specialists Available</span>
                                </div>
                            </div>
                            <div className="flex space-x-4">
                                <Button
                                    size="lg"
                                    className="bg-white text-green-600 hover:bg-green-50 shadow-lg transition-all duration-300 transform hover:scale-105"
                                    onClick={() => navigate("/register")}
                                >
                                    Schedule Consultation
                                </Button>
                                <Button
                                    variant="outline"
                                    size="lg"
                                    className="border-white text-white hover:bg-white hover:text-green-600 transition-all duration-300"
                                    onClick={() => navigate("/login")}
                                >
                                    Patient Portal
                                </Button>
                            </div>
                        </div>
                        <div className="relative">
                            <img
                                src="https://images.unsplash.com/photo-1559757175-0eb30cd8c063?auto=format&fit=crop&w=800&q=80"
                                alt="Specialized Treatment - Advanced medical procedures"
                                className="w-full h-96 object-cover rounded-2xl shadow-2xl"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent rounded-2xl"></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Why Specialized Care Matters */}
            <section className="py-16 bg-white dark:bg-gray-900">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-green-800 dark:text-green-400 mb-6">Why Specialized Treatment Saves Lives</h2>
                        <p className="text-xl text-green-600 dark:text-green-300 max-w-4xl mx-auto leading-relaxed">
                            Complex medical conditions require expertise beyond general medicine. Our specialized treatment programs
                            bring together world-renowned specialists, advanced technology, and innovative therapies to treat
                            conditions that require precise, targeted care for optimal outcomes.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <Card className="text-center hover:shadow-xl transition-all duration-300 border-green-200 dark:border-green-700">
                            <CardHeader>
                                <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Microscope className="h-8 w-8 text-white" />
                                </div>
                                <CardTitle className="text-green-800 dark:text-green-400">Precision Medicine</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-green-700 dark:text-green-300">
                                    Treatments tailored to individual genetic profiles, medical history, and specific condition
                                    characteristics for maximum effectiveness with minimal side effects.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="text-center hover:shadow-xl transition-all duration-300 border-blue-200 dark:border-blue-700">
                            <CardHeader>
                                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Zap className="h-8 w-8 text-white" />
                                </div>
                                <CardTitle className="text-blue-800 dark:text-blue-400">Advanced Technology</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-blue-700 dark:text-blue-300">
                                    State-of-the-art medical equipment including robotic surgery systems, advanced imaging,
                                    and minimally invasive procedures for better outcomes and faster recovery.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="text-center hover:shadow-xl transition-all duration-300 border-purple-200 dark:border-purple-700">
                            <CardHeader>
                                <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Users className="h-8 w-8 text-white" />
                                </div>
                                <CardTitle className="text-purple-800 dark:text-purple-400">Multidisciplinary Team</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-purple-700 dark:text-purple-300">
                                    Collaborative care teams including specialists, surgeons, nurses, and support staff
                                    working together for comprehensive, coordinated treatment plans.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Specialized Services */}
            <section className="py-16 bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-800 dark:to-green-800">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-green-800 dark:text-green-400 mb-6">Our Medical Specialties</h2>
                        <p className="text-xl text-green-600 dark:text-green-300">
                            Comprehensive specialized care across multiple medical disciplines
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                            <div className="flex items-center space-x-4 mb-4">
                                <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center">
                                    <Heart className="h-6 w-6 text-white" />
                                </div>
                                <h3 className="text-xl font-semibold text-red-800 dark:text-red-400">Cardiology</h3>
                            </div>
                            <p className="text-red-600 dark:text-red-300 mb-4">
                                Advanced heart and vascular treatments including cardiac catheterization,
                                heart surgery, and interventional cardiology procedures.
                            </p>
                            <ul className="space-y-2 text-sm text-red-700 dark:text-red-300">
                                <li className="flex items-center space-x-2">
                                    <CheckCircle className="h-4 w-4 text-green-600" />
                                    <span>Cardiac Catheterization</span>
                                </li>
                                <li className="flex items-center space-x-2">
                                    <CheckCircle className="h-4 w-4 text-green-600" />
                                    <span>Heart Surgery</span>
                                </li>
                                <li className="flex items-center space-x-2">
                                    <CheckCircle className="h-4 w-4 text-green-600" />
                                    <span>Arrhythmia Treatment</span>
                                </li>
                            </ul>
                        </div>

                        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                            <div className="flex items-center space-x-4 mb-4">
                                <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center">
                                    <Brain className="h-6 w-6 text-white" />
                                </div>
                                <h3 className="text-xl font-semibold text-purple-800 dark:text-purple-400">Neurology</h3>
                            </div>
                            <p className="text-purple-600 dark:text-purple-300 mb-4">
                                Comprehensive brain and nervous system care including stroke treatment,
                                epilepsy management, and neurosurgical procedures.
                            </p>
                            <ul className="space-y-2 text-sm text-purple-700 dark:text-purple-300">
                                <li className="flex items-center space-x-2">
                                    <CheckCircle className="h-4 w-4 text-green-600" />
                                    <span>Stroke Care</span>
                                </li>
                                <li className="flex items-center space-x-2">
                                    <CheckCircle className="h-4 w-4 text-green-600" />
                                    <span>Epilepsy Treatment</span>
                                </li>
                                <li className="flex items-center space-x-2">
                                    <CheckCircle className="h-4 w-4 text-green-600" />
                                    <span>Brain Surgery</span>
                                </li>
                            </ul>
                        </div>

                        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                            <div className="flex items-center space-x-4 mb-4">
                                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                                    <Bone className="h-6 w-6 text-white" />
                                </div>
                                <h3 className="text-xl font-semibold text-blue-800 dark:text-blue-400">Orthopedics</h3>
                            </div>
                            <p className="text-blue-600 dark:text-blue-300 mb-4">
                                Advanced bone, joint, and muscle treatments including joint replacement,
                                sports medicine, and minimally invasive spine surgery.
                            </p>
                            <ul className="space-y-2 text-sm text-blue-700 dark:text-blue-300">
                                <li className="flex items-center space-x-2">
                                    <CheckCircle className="h-4 w-4 text-green-600" />
                                    <span>Joint Replacement</span>
                                </li>
                                <li className="flex items-center space-x-2">
                                    <CheckCircle className="h-4 w-4 text-green-600" />
                                    <span>Sports Medicine</span>
                                </li>
                                <li className="flex items-center space-x-2">
                                    <CheckCircle className="h-4 w-4 text-green-600" />
                                    <span>Spine Surgery</span>
                                </li>
                            </ul>
                        </div>

                        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                            <div className="flex items-center space-x-4 mb-4">
                                <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
                                    <Microscope className="h-6 w-6 text-white" />
                                </div>
                                <h3 className="text-xl font-semibold text-green-800 dark:text-green-400">Oncology</h3>
                            </div>
                            <p className="text-green-600 dark:text-green-300 mb-4">
                                Comprehensive cancer care including chemotherapy, radiation therapy,
                                immunotherapy, and precision oncology treatments.
                            </p>
                            <ul className="space-y-2 text-sm text-green-700 dark:text-green-300">
                                <li className="flex items-center space-x-2">
                                    <CheckCircle className="h-4 w-4 text-green-600" />
                                    <span>Chemotherapy</span>
                                </li>
                                <li className="flex items-center space-x-2">
                                    <CheckCircle className="h-4 w-4 text-green-600" />
                                    <span>Radiation Therapy</span>
                                </li>
                                <li className="flex items-center space-x-2">
                                    <CheckCircle className="h-4 w-4 text-green-600" />
                                    <span>Immunotherapy</span>
                                </li>
                            </ul>
                        </div>

                        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                            <div className="flex items-center space-x-4 mb-4">
                                <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center">
                                    <Eye className="h-6 w-6 text-white" />
                                </div>
                                <h3 className="text-xl font-semibold text-orange-800 dark:text-orange-400">Ophthalmology</h3>
                            </div>
                            <p className="text-orange-600 dark:text-orange-300 mb-4">
                                Advanced eye care including cataract surgery, retinal treatments,
                                glaucoma management, and LASIK procedures.
                            </p>
                            <ul className="space-y-2 text-sm text-orange-700 dark:text-orange-300">
                                <li className="flex items-center space-x-2">
                                    <CheckCircle className="h-4 w-4 text-green-600" />
                                    <span>Cataract Surgery</span>
                                </li>
                                <li className="flex items-center space-x-2">
                                    <CheckCircle className="h-4 w-4 text-green-600" />
                                    <span>Retinal Treatment</span>
                                </li>
                                <li className="flex items-center space-x-2">
                                    <CheckCircle className="h-4 w-4 text-green-600" />
                                    <span>LASIK Surgery</span>
                                </li>
                            </ul>
                        </div>

                        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                            <div className="flex items-center space-x-4 mb-4">
                                <div className="w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center">
                                    <Stethoscope className="h-6 w-6 text-white" />
                                </div>
                                <h3 className="text-xl font-semibold text-indigo-800 dark:text-indigo-400">Gastroenterology</h3>
                            </div>
                            <p className="text-indigo-600 dark:text-indigo-300 mb-4">
                                Digestive system specialists providing endoscopy, colonoscopy,
                                liver disease treatment, and inflammatory bowel disease management.
                            </p>
                            <ul className="space-y-2 text-sm text-indigo-700 dark:text-indigo-300">
                                <li className="flex items-center space-x-2">
                                    <CheckCircle className="h-4 w-4 text-green-600" />
                                    <span>Endoscopy</span>
                                </li>
                                <li className="flex items-center space-x-2">
                                    <CheckCircle className="h-4 w-4 text-green-600" />
                                    <span>Liver Disease Treatment</span>
                                </li>
                                <li className="flex items-center space-x-2">
                                    <CheckCircle className="h-4 w-4 text-green-600" />
                                    <span>IBD Management</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Treatment Approach */}
            <section className="py-16 bg-white dark:bg-gray-900">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-green-800 dark:text-green-400 mb-6">Our Treatment Approach</h2>
                        <p className="text-xl text-green-600 dark:text-green-300">
                            Every patient receives personalized care with the latest medical advances
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        <div className="space-y-6">
                            <div className="flex items-start space-x-4">
                                <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold">
                                    1
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold text-green-800 dark:text-green-400 mb-2">Comprehensive Evaluation</h3>
                                    <p className="text-green-600 dark:text-green-300">
                                        Thorough assessment using advanced diagnostic tools and imaging to understand
                                        your condition completely before developing a treatment plan.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-4">
                                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold">
                                    2
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold text-blue-800 dark:text-blue-400 mb-2">Personalized Treatment Plan</h3>
                                    <p className="text-blue-600 dark:text-blue-300">
                                        Customized treatment approach considering your medical history, lifestyle,
                                        preferences, and specific condition requirements.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-4">
                                <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold">
                                    3
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold text-purple-800 dark:text-purple-400 mb-2">Advanced Treatment</h3>
                                    <p className="text-purple-600 dark:text-purple-300">
                                        Implementation of cutting-edge therapies and procedures by experienced
                                        specialists using the latest medical technology.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-4">
                                <div className="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold">
                                    4
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold text-orange-800 dark:text-orange-400 mb-2">Ongoing Care & Monitoring</h3>
                                    <p className="text-orange-600 dark:text-orange-300">
                                        Continuous follow-up care with regular monitoring, adjustments to treatment,
                                        and long-term health management support.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="relative">
                            <img
                                src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=800&q=80"
                                alt="Advanced medical consultation"
                                className="w-full h-96 object-cover rounded-2xl shadow-lg"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl"></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Call to Action */}
            <section className="py-16 bg-gradient-to-r from-green-600 to-blue-600 text-white">
                <div className="container mx-auto px-6 text-center">
                    <h2 className="text-4xl font-bold mb-6">Get Expert Specialized Care</h2>
                    <p className="text-xl mb-8 max-w-3xl mx-auto">
                        Don't let complex medical conditions go untreated. Our specialized treatment programs
                        offer hope, healing, and the expertise you need for the best possible outcomes.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
                        <Button
                            size="lg"
                            className="bg-white text-green-600 hover:bg-green-50 shadow-lg transition-all duration-300 transform hover:scale-105"
                            onClick={() => navigate("/register")}
                        >
                            Schedule Specialist Consultation
                        </Button>
                        <Button
                            variant="outline"
                            size="lg"
                            className="border-white text-white hover:bg-white hover:text-green-600 transition-all duration-300"
                            onClick={() => navigate("/staff-login")}
                        >
                            Healthcare Provider Portal
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    );
}
