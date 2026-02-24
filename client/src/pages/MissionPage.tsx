import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import LanguageSelector from "../components/common/LanguageSelector";
import ThemeToggle from "../components/common/ThemeToggle";
import { useLanguage } from "../contexts/LanguageContext";
import { Heart, ArrowLeft, Target, Users, Globe, Shield, Stethoscope, Activity, Award, CheckCircle } from "lucide-react";

export default function MissionPage() {
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
                                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-green-600 rounded-lg flex items-center justify-center shadow-lg animate-pulse">
                                    <Heart className="text-white h-5 w-5" />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">{t("sevamed_hms")}</h1>
                                    <p className="text-sm text-blue-600 dark:text-blue-400">Our Mission</p>
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
                                    <Target className="h-8 w-8 text-white" />
                                </div>
                                <h1 className="text-5xl font-bold">Our Mission</h1>
                            </div>
                            <p className="text-xl text-blue-100 mb-8 leading-relaxed">
                                To provide compassionate, comprehensive healthcare services that save lives, restore health,
                                and improve the quality of life for every individual who walks through our doors.
                                We are committed to excellence in medical care, innovation in treatment, and dedication to our community.
                            </p>
                            <div className="flex space-x-4">
                                <Button
                                    size="lg"
                                    className="bg-white text-blue-600 hover:bg-blue-50 shadow-lg transition-all duration-300 transform hover:scale-105"
                                    onClick={() => navigate("/register")}
                                >
                                    Join Our Mission
                                </Button>
                                <Button
                                    variant="outline"
                                    size="lg"
                                    className="border-white text-white hover:bg-white hover:text-blue-600 transition-all duration-300"
                                    onClick={() => navigate("/staff-login")}
                                >
                                    Healthcare Careers
                                </Button>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="absolute inset-0 bg-blue-600 rounded-[3rem] transform translate-y-4 translate-x-4 opacity-50 blur-xl"></div>
                            <img
                                src="https://images.unsplash.com/photo-1581056771107-24ca5f033842?auto=format&fit=crop&w=1200&q=80"
                                alt="Healthcare Mission - Compassionate patient care"
                                className="w-full h-[500px] object-cover rounded-[3rem] shadow-2xl relative z-10 border-4 border-white/20"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Mission Statement */}
            <section className="py-16 bg-white dark:bg-gray-900">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-blue-800 dark:text-blue-400 mb-6">Our Mission Statement</h2>
                        <div className="max-w-6xl mx-auto bg-blue-50/50 dark:bg-gray-800/50 p-12 lg:p-16 rounded-[4rem] border border-blue-100 dark:border-gray-700 shadow-inner">
                            <blockquote className="text-2xl text-blue-600 dark:text-blue-300 italic leading-relaxed mb-8 font-medium">
                                "To heal, to comfort, to care - these are not just our services, but our sacred promise to every person
                                who entrusts us with their health. We exist to save lives, restore hope, and ensure that quality
                                healthcare is accessible to all, regardless of their circumstances."
                            </blockquote>
                            <div className="text-right flex items-center justify-end space-x-3">
                                <div className="h-[2px] w-12 bg-blue-400 rounded-full"></div>
                                <p className="text-lg text-blue-800 dark:text-blue-400 font-black uppercase tracking-widest">SevaMed Healthcare Team</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Core Mission Pillars */}
            <section className="py-16 bg-gradient-to-br from-blue-50 to-green-50 dark:from-gray-800 dark:to-blue-800">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-blue-800 dark:text-blue-400 mb-6">Our Mission Pillars</h2>
                        <p className="text-xl text-blue-600 dark:text-blue-300">
                            Four fundamental principles that guide everything we do
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <Card className="hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-slate-100 dark:border-blue-700 dark:bg-gray-800 rounded-[3rem] overflow-hidden bg-white shadow-sm p-6 group">
                            <CardHeader>
                                <div className="flex items-center space-x-4">
                                    <div className="w-16 h-16 bg-blue-50 group-hover:bg-blue-600 transition-colors rounded-[2rem] flex items-center justify-center transform rotate-3 group-hover:rotate-0 duration-300 border border-blue-100">
                                        <Heart className="h-8 w-8 text-blue-600 group-hover:text-white transition-colors" />
                                    </div>
                                    <CardTitle className="text-blue-800 dark:text-blue-400 text-2xl font-black tracking-tight">Compassionate Care</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-slate-500 font-medium mb-6 leading-relaxed">
                                    Every patient is treated with dignity, respect, and empathy. We understand that behind every medical condition
                                    is a human being with fears, hopes, and a family who loves them.
                                </p>
                                <ul className="space-y-3 text-sm font-bold text-slate-600">
                                    <li className="flex items-center space-x-3 bg-slate-50 p-3 rounded-2xl">
                                        <CheckCircle className="h-5 w-5 text-green-500 shrink-0" />
                                        <span>Patient-centered approach to all treatments</span>
                                    </li>
                                    <li className="flex items-center space-x-3 bg-slate-50 p-3 rounded-2xl">
                                        <CheckCircle className="h-5 w-5 text-green-500 shrink-0" />
                                        <span>Emotional support for patients and families</span>
                                    </li>
                                    <li className="flex items-center space-x-3 bg-slate-50 p-3 rounded-2xl">
                                        <CheckCircle className="h-5 w-5 text-green-500 shrink-0" />
                                        <span>Cultural sensitivity in all interactions</span>
                                    </li>
                                </ul>
                            </CardContent>
                        </Card>

                        <Card className="hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-slate-100 dark:border-green-700 dark:bg-gray-800 rounded-[3rem] overflow-hidden bg-white shadow-sm p-6 group">
                            <CardHeader>
                                <div className="flex items-center space-x-4">
                                    <div className="w-16 h-16 bg-green-50 group-hover:bg-green-600 transition-colors rounded-[2rem] flex items-center justify-center transform rotate-3 group-hover:rotate-0 duration-300 border border-green-100">
                                        <Award className="h-8 w-8 text-green-600 group-hover:text-white transition-colors" />
                                    </div>
                                    <CardTitle className="text-green-800 dark:text-green-400 text-2xl font-black tracking-tight">Clinical Excellence</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-slate-500 font-medium mb-6 leading-relaxed">
                                    We are committed to providing the highest standard of medical care through continuous learning,
                                    evidence-based practices, and investment in advanced medical technology.
                                </p>
                                <ul className="space-y-3 text-sm font-bold text-slate-600">
                                    <li className="flex items-center space-x-3 bg-slate-50 p-3 rounded-2xl">
                                        <CheckCircle className="h-5 w-5 text-green-500 shrink-0" />
                                        <span>Board-certified physicians and specialists</span>
                                    </li>
                                    <li className="flex items-center space-x-3 bg-slate-50 p-3 rounded-2xl">
                                        <CheckCircle className="h-5 w-5 text-green-500 shrink-0" />
                                        <span>State-of-the-art medical equipment</span>
                                    </li>
                                    <li className="flex items-center space-x-3 bg-slate-50 p-3 rounded-2xl">
                                        <CheckCircle className="h-5 w-5 text-green-500 shrink-0" />
                                        <span>Continuous medical education and training</span>
                                    </li>
                                </ul>
                            </CardContent>
                        </Card>

                        <Card className="hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-slate-100 dark:border-purple-700 dark:bg-gray-800 rounded-[3rem] overflow-hidden bg-white shadow-sm p-6 group">
                            <CardHeader>
                                <div className="flex items-center space-x-4">
                                    <div className="w-16 h-16 bg-purple-50 group-hover:bg-purple-600 transition-colors rounded-[2rem] flex items-center justify-center transform rotate-3 group-hover:rotate-0 duration-300 border border-purple-100">
                                        <Globe className="h-8 w-8 text-purple-600 group-hover:text-white transition-colors" />
                                    </div>
                                    <CardTitle className="text-purple-800 dark:text-purple-400 text-2xl font-black tracking-tight">Community Service</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-slate-500 font-medium mb-6 leading-relaxed">
                                    Healthcare is a fundamental human right. We serve our community by making quality healthcare
                                    accessible and affordable for all members of society.
                                </p>
                                <ul className="space-y-3 text-sm font-bold text-slate-600">
                                    <li className="flex items-center space-x-3 bg-slate-50 p-3 rounded-2xl">
                                        <CheckCircle className="h-5 w-5 text-green-500 shrink-0" />
                                        <span>Free health screenings and checkups</span>
                                    </li>
                                    <li className="flex items-center space-x-3 bg-slate-50 p-3 rounded-2xl">
                                        <CheckCircle className="h-5 w-5 text-green-500 shrink-0" />
                                        <span>Healthcare education and awareness programs</span>
                                    </li>
                                    <li className="flex items-center space-x-3 bg-slate-50 p-3 rounded-2xl">
                                        <CheckCircle className="h-5 w-5 text-green-500 shrink-0" />
                                        <span>Charitable care for underprivileged patients</span>
                                    </li>
                                </ul>
                            </CardContent>
                        </Card>

                        <Card className="hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-slate-100 dark:border-orange-700 dark:bg-gray-800 rounded-[3rem] overflow-hidden bg-white shadow-sm p-6 group">
                            <CardHeader>
                                <div className="flex items-center space-x-4">
                                    <div className="w-16 h-16 bg-orange-50 group-hover:bg-orange-600 transition-colors rounded-[2rem] flex items-center justify-center transform rotate-3 group-hover:rotate-0 duration-300 border border-orange-100">
                                        <Activity className="h-8 w-8 text-orange-600 group-hover:text-white transition-colors" />
                                    </div>
                                    <CardTitle className="text-orange-800 dark:text-orange-400 text-2xl font-black tracking-tight">Innovation & Progress</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-slate-500 font-medium mb-6 leading-relaxed">
                                    We embrace medical innovation and technological advancement to improve patient outcomes,
                                    reduce recovery times, and enhance the overall healthcare experience.
                                </p>
                                <ul className="space-y-3 text-sm font-bold text-slate-600">
                                    <li className="flex items-center space-x-3 bg-slate-50 p-3 rounded-2xl">
                                        <CheckCircle className="h-5 w-5 text-green-500 shrink-0" />
                                        <span>AI-powered diagnostic and treatment tools</span>
                                    </li>
                                    <li className="flex items-center space-x-3 bg-slate-50 p-3 rounded-2xl">
                                        <CheckCircle className="h-5 w-5 text-green-500 shrink-0" />
                                        <span>Minimally invasive surgical techniques</span>
                                    </li>
                                    <li className="flex items-center space-x-3 bg-slate-50 p-3 rounded-2xl">
                                        <CheckCircle className="h-5 w-5 text-green-500 shrink-0" />
                                        <span>Telemedicine and remote monitoring</span>
                                    </li>
                                </ul>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Our Impact */}
            <section className="py-16 bg-white dark:bg-gray-900">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-blue-800 dark:text-blue-400 mb-6">Living Our Mission Every Day</h2>
                        <p className="text-xl text-blue-600 dark:text-blue-300">
                            Our mission comes to life through the lives we touch and the community we serve
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                        <div className="text-center bg-white border border-slate-100 dark:bg-blue-900/20 shadow-sm hover:shadow-xl transition-all duration-300 p-8 rounded-[3rem]">
                            <div className="text-5xl font-black text-blue-600 dark:text-blue-400 mb-3 tracking-tighter">50k+</div>
                            <div className="text-slate-800 dark:text-blue-300 font-black uppercase tracking-widest text-xs">Lives Touched</div>
                            <div className="text-[10px] text-slate-400 dark:text-blue-400 mt-2 font-bold uppercase tracking-widest">Annually</div>
                        </div>
                        <div className="text-center bg-white border border-slate-100 dark:bg-green-900/20 shadow-sm hover:shadow-xl transition-all duration-300 p-8 rounded-[3rem]">
                            <div className="text-5xl font-black text-green-600 dark:text-green-400 mb-3 tracking-tighter">98%</div>
                            <div className="text-slate-800 dark:text-green-300 font-black uppercase tracking-widest text-xs">Satisfaction</div>
                            <div className="text-[10px] text-slate-400 dark:text-green-400 mt-2 font-bold uppercase tracking-widest">Excellence in care</div>
                        </div>
                        <div className="text-center bg-white border border-slate-100 dark:bg-purple-900/20 shadow-sm hover:shadow-xl transition-all duration-300 p-8 rounded-[3rem]">
                            <div className="text-5xl font-black text-purple-600 dark:text-purple-400 mb-3 tracking-tighter">24/7</div>
                            <div className="text-slate-800 dark:text-purple-300 font-black uppercase tracking-widest text-xs">Emergency</div>
                            <div className="text-[10px] text-slate-400 dark:text-purple-400 mt-2 font-bold uppercase tracking-widest">Always Here</div>
                        </div>
                        <div className="text-center bg-white border border-slate-100 dark:bg-orange-900/20 shadow-sm hover:shadow-xl transition-all duration-300 p-8 rounded-[3rem]">
                            <div className="text-5xl font-black text-orange-600 dark:text-orange-400 mb-3 tracking-tighter">200+</div>
                            <div className="text-slate-800 dark:text-orange-300 font-black uppercase tracking-widest text-xs">Professionals</div>
                            <div className="text-[10px] text-slate-400 dark:text-orange-400 mt-2 font-bold uppercase tracking-widest">Dedicated team</div>
                        </div>
                    </div>

                    <div className="max-w-4xl mx-auto">
                        <blockquote className="text-lg text-blue-700 dark:text-blue-300 italic text-center leading-relaxed">
                            "Our mission isn't just words on a wall - it's the reason we come to work every day.
                            Every life saved, every family reunited, every patient who walks out healthy is a testament
                            to our unwavering commitment to healing and hope."
                        </blockquote>
                    </div>
                </div>
            </section>

            {/* Call to Action */}
            <section className="py-16 bg-gradient-to-r from-blue-600 to-green-600 text-white">
                <div className="container mx-auto px-6 text-center">
                    <h2 className="text-4xl font-bold mb-6">Be Part of Our Mission</h2>
                    <p className="text-xl mb-8 max-w-3xl mx-auto">
                        Whether as a patient, healthcare professional, or community partner, you can be part of our mission
                        to transform healthcare and save lives in our community.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
                        <Button
                            size="lg"
                            className="bg-white text-blue-600 hover:bg-blue-50 shadow-lg transition-all duration-300 transform hover:scale-105"
                            onClick={() => navigate("/register")}
                        >
                            Become a Patient
                        </Button>
                        <Button
                            variant="outline"
                            size="lg"
                            className="border-white text-white hover:bg-white hover:text-blue-600 transition-all duration-300"
                            onClick={() => navigate("/staff-login")}
                        >
                            Join Our Team
                        </Button>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-white">
                <div className="container mx-auto px-6">
                    {/* Main Footer Content */}
                    <div className="py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {/* Company Info */}
                        <div className="space-y-4">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-green-600 rounded-lg flex items-center justify-center">
                                    <Heart className="text-white h-5 w-5" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold">{t("sevamed_hms")}</h3>
                                    <p className="text-sm text-gray-300">Healthcare Excellence</p>
                                </div>
                            </div>
                            <p className="text-gray-300 text-sm leading-relaxed">
                                Leading healthcare management system providing comprehensive medical services with cutting-edge technology and compassionate care.
                            </p>
                        </div>

                        {/* About Us */}
                        <div className="space-y-4">
                            <h4 className="text-lg font-semibold text-blue-400">About Us</h4>
                            <ul className="space-y-2 text-sm">
                                <li><a href="/mission" className="text-gray-300 hover:text-white transition-colors">Our Mission</a></li>
                                <li><a href="/vision" className="text-gray-300 hover:text-white transition-colors">Our Vision</a></li>
                                <li><a href="/facilities" className="text-gray-300 hover:text-white transition-colors">Our Facilities</a></li>
                                <li><a href="/about-us" className="text-gray-300 hover:text-white transition-colors">Leadership Team</a></li>
                            </ul>
                        </div>

                        {/* Services */}
                        <div className="space-y-4">
                            <h4 className="text-lg font-semibold text-green-400">Our Services</h4>
                            <ul className="space-y-2 text-sm">
                                <li><a href="/services/emergency-care" className="text-gray-300 hover:text-white transition-colors">Emergency Care</a></li>
                                <li><a href="/services/specialized-treatment" className="text-gray-300 hover:text-white transition-colors">Specialized Treatments</a></li>
                                <li><a href="/services/patient-management" className="text-gray-300 hover:text-white transition-colors">Patient Management</a></li>
                                <li><a href="/services/health-monitoring" className="text-gray-300 hover:text-white transition-colors">Health Monitoring</a></li>
                            </ul>
                        </div>

                        {/* Contact Info */}
                        <div className="space-y-4">
                            <h4 className="text-lg font-semibold text-blue-400">Contact Us</h4>
                            <div className="space-y-3 text-sm">
                                <div className="flex items-start space-x-3">
                                    <p className="text-gray-300">123 Healthcare Street<br />Medical District, MD 12345</p>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <p className="text-gray-300">Emergency: +1 (555) 911-HELP</p>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <p className="text-gray-300">info@sevamed.com</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Footer */}
                    <div className="border-t border-gray-700 py-6">
                        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                            <div className="text-sm text-gray-400">
                                © 2026 SevaMed Healthcare Management System. All rights reserved.
                            </div>
                            <div className="flex space-x-6 text-sm text-gray-400">
                                <a href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</a>
                                <a href="/terms-of-service" className="hover:text-white transition-colors">Terms of Service</a>
                                <a href="/accessibility" className="hover:text-white transition-colors">Accessibility</a>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
