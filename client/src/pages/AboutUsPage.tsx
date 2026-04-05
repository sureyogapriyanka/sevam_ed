import { useNavigate } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Heart, Users, Target, Award, ArrowLeft, Stethoscope, Activity, Shield } from "lucide-react";

export default function AboutUsPage() {
    const { t } = useLanguage();
    const navigate = useNavigate();

    const founders = [
        {
            name: "Bhetapudi Manasa",
            rollNumber: "231FA07036",
            role: "Co-Founder & Chief Technology Officer",
            expertise: "Healthcare Technology & System Architecture",
            description: "Manasa brings extensive experience in healthcare technology solutions and system design. Her vision for accessible healthcare through technology drives SevaMed's innovative approach to patient care management.",
            achievements: [
                "Healthcare Technology Innovation Award 2023",
                "Led development of 5+ medical management systems",
                "Expert in HIPAA-compliant healthcare solutions"
            ]
        },
        {
            name: "Sure Yoga Priyanka",
            rollNumber: "231FA07046",
            role: "Co-Founder & Chief Executive Officer",
            expertise: "Healthcare Operations & Strategic Leadership",
            description: "Priyanka's passion for transforming healthcare delivery through digital innovation has been instrumental in shaping SevaMed's mission. Her leadership ensures that our platform meets the real-world needs of healthcare providers and patients.",
            achievements: [
                "Healthcare Leadership Excellence Award 2023",
                "10+ years in healthcare management",
                "Champion of patient-centered care initiatives"
            ]
        },
        {
            name: "Bhimavarapu Bhavana",
            rollNumber: "231FA07049",
            role: "Co-Founder & Chief Medical Officer",
            expertise: "Clinical Excellence & Medical Technology",
            description: "Bhavana combines deep clinical knowledge with technological expertise to ensure SevaMed meets the highest medical standards. Her medical background guides our platform's clinical features and patient safety protocols.",
            achievements: [
                "Medical Technology Innovation Award 2023",
                "Published researcher in digital health",
                "Certified in multiple medical specializations"
            ]
        }
    ];

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
                <div className="max-w-6xl mx-auto">
                    {/* Page Header */}
                    <div className="text-center mb-16">
                        <div className="flex justify-center mb-6">
                            <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-green-600 rounded-xl flex items-center justify-center shadow-xl">
                                <Users className="text-white h-12 w-12" />
                            </div>
                        </div>
                        <h1 className="text-5xl font-bold text-blue-800 mb-6">{t("about_sevamed_hms")}</h1>
                        <p className="text-2xl text-blue-600 mb-4">{t("pioneering_future")}</p>
                        <p className="text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed">
                            Born from a vision to revolutionize healthcare delivery, SevaMed HMS represents the convergence of
                            medical expertise, technological innovation, and compassionate care. Our platform bridges the gap
                            between traditional healthcare and the digital future.
                        </p>
                    </div>

                    {/* Our Story Section */}
                    <section className="mb-20">
                        <div className="bg-gradient-to-r from-blue-600/10 to-green-600/10 rounded-2xl p-8 backdrop-blur-sm border border-blue-200/50 relative overflow-hidden">
                            {/* Hospital Equipment Background */}
                            <div
                                className="absolute inset-0 opacity-5"
                                style={{
                                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%234338ca'%3E%3Cpath d='M45 15h10v70h-10zM15 45h70v10H15z' opacity='0.1'/%3E%3Ccircle cx='50' cy='50' r='25' fill='none' stroke='%234338ca' stroke-width='2' opacity='0.1'/%3E%3C/g%3E%3C/svg%3E")`,
                                }}
                            />
                            <div className="relative z-10">
                                <div className="flex items-center mb-6">
                                    <Target className="h-8 w-8 text-blue-600 mr-3" />
                                    <h2 className="text-3xl font-bold text-blue-800">{t("our_story_mission")}</h2>
                                </div>
                                <div className="grid md:grid-cols-2 gap-8">
                                    <div>
                                        <h3 className="text-xl font-semibold text-blue-700 mb-4">{t("why_created")}</h3>
                                        <p className="text-gray-700 leading-relaxed mb-4">
                                            The inspiration for SevaMed HMS came from witnessing the challenges faced by healthcare
                                            providers in managing patient information, coordinating care, and ensuring seamless
                                            communication across medical teams. Traditional systems were fragmented, inefficient,
                                            and often failed to put patients at the center of care.
                                        </p>
                                        <p className="text-gray-700 leading-relaxed">
                                            We envisioned a unified platform that would not only streamline administrative tasks
                                            but also enhance the quality of patient care through intelligent automation,
                                            data-driven insights, and intuitive user experiences.
                                        </p>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-semibold text-green-700 mb-4">{t("our_impact_vision")}</h3>
                                        <p className="text-gray-700 leading-relaxed mb-4">
                                            Since our inception, SevaMed HMS has transformed healthcare delivery for numerous
                                            institutions, improving patient outcomes, reducing administrative burden, and
                                            enabling medical professionals to focus on what matters most - patient care.
                                        </p>
                                        <div className="bg-white/70 p-4 rounded-lg">
                                            <p className="text-blue-800 font-semibold text-lg">
                                                "{t("healthcare_excellence")}"
                                            </p>
                                            <p className="text-gray-600 text-sm mt-2">- {t("mission_statement")}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Founders Section */}
                    <section className="mb-20">
                        <div className="text-center mb-12">
                            <div className="flex justify-center mb-4">
                                <Award className="h-10 w-10 text-green-600" />
                            </div>
                            <h2 className="text-4xl font-bold text-blue-800 mb-4">{t("meet_founders")}</h2>
                            <p className="text-xl text-gray-600">{t("visionary_minds")}</p>
                        </div>

                        <div className="grid lg:grid-cols-3 gap-8">
                            {founders.map((founder, index) => (
                                <Card key={index} className="relative overflow-hidden shadow-xl border-blue-200 hover:shadow-2xl transition-all duration-300 transform hover:scale-105 group">
                                    {/* Medical Background Pattern for Each Card */}
                                    <div
                                        className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity"
                                        style={{
                                            backgroundImage: index === 0
                                                ? `url("data:image/svg+xml,%3Csvg width='50' height='50' viewBox='0 0 50 50' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%232563eb' fill-opacity='0.1'%3E%3Cpath d='M25 0C11.2 0 0 11.2 0 25s11.2 25 25 25 25-11.2 25-25S38.8 0 25 0zm0 45C13.5 45 5 36.5 5 25S13.5 5 25 5s20 8.5 20 20-8.5 20-20 20z'/%3E%3Cpath d='M30 20h-5v-5c0-1.1-.9-2-2-2h-6c-1.1 0-2 .9-2 2v5h-5c-1.1 0-2 .9-2 2v6c0 1.1.9 2 2 2h5v5c0 1.1.9 2 2 2h6c1.1 0 2-.9 2-2v-5h5c1.1 0 2-.9 2-2v-6c0-1.1-.9-2-2-2z'/%3E%3C/g%3E%3C/svg%3E")`
                                                : index === 1
                                                    ? `url("data:image/svg+xml,%3Csvg width='50' height='50' viewBox='0 0 50 50' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%2310b981' fill-opacity='0.1'%3E%3Cpath d='M25 5c-11 0-20 9-20 20s9 20 20 20 20-9 20-20S36 5 25 5zm8 22h-6v6c0 1.1-.9 2-2 2h-2c-1.1 0-2-.9-2-2v-6h-6c-1.1 0-2-.9-2-2v-2c0-1.1.9-2 2-2h6v-6c0-1.1.9-2 2-2h2c1.1 0 2 .9 2 2v6h6c1.1 0 2 .9 2 2v2c0 1.1-.9 2-2 2z'/%3E%3C/g%3E%3C/svg%3E")`
                                                    : `url("data:image/svg+xml,%3Csvg width='50' height='50' viewBox='0 0 50 50' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23dc2626' fill-opacity='0.1'%3E%3Cpath d='M25 2L30 12L42 12L33 20L36 32L25 26L14 32L17 20L8 12L20 12Z'/%3E%3C/g%3E%3C/svg%3E")`,
                                        }}
                                    />

                                    <CardHeader className="text-center relative z-10">
                                        {/* Profile Picture Placeholder with Medical Icon */}
                                        <div className="w-32 h-32 mx-auto mb-4 bg-gradient-to-br from-blue-600 to-green-600 rounded-full flex items-center justify-center shadow-xl">
                                            {index === 0 && <Stethoscope className="h-16 w-16 text-white" />}
                                            {index === 1 && <Activity className="h-16 w-16 text-white" />}
                                            {index === 2 && <Shield className="h-16 w-16 text-white" />}
                                        </div>
                                        <CardTitle className="text-xl font-bold text-blue-800 mb-1">{founder.name}</CardTitle>
                                        <p className="text-sm text-green-600 font-semibold mb-1">{founder.rollNumber}</p>
                                        <p className="text-blue-600 font-medium">{founder.role}</p>
                                        <p className="text-sm text-gray-600">{founder.expertise}</p>
                                    </CardHeader>

                                    <CardContent className="relative z-10">
                                        <p className="text-gray-700 text-sm leading-relaxed mb-4">
                                            {founder.description}
                                        </p>

                                        <div className="bg-blue-50 p-3 rounded-lg">
                                            <h4 className="text-sm font-semibold text-blue-700 mb-2">{t("key_achievements")}:</h4>
                                            <ul className="text-xs text-gray-600 space-y-1">
                                                {founder.achievements.map((achievement, i) => (
                                                    <li key={i} className="flex items-start">
                                                        <span className="text-green-500 mr-2">•</span>
                                                        {achievement}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </section>

                    {/* Company Values Section */}
                    <section className="mb-16">
                        <div className="bg-gradient-to-br from-green-600 to-blue-600 rounded-2xl p-8 text-white relative overflow-hidden">
                            {/* Medical Equipment Background */}
                            <div
                                className="absolute inset-0 opacity-10"
                                style={{
                                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M20 20h40v40H20z' stroke='%23ffffff' stroke-width='2' fill='none'/%3E%3Cpath d='M35 25h10v30h-10z'/%3E%3Cpath d='M25 35h30v10H25z'/%3E%3Ccircle cx='15' cy='15' r='3'/%3E%3Ccircle cx='65' cy='15' r='3'/%3E%3Ccircle cx='15' cy='65' r='3'/%3E%3Ccircle cx='65' cy='65' r='3'/%3E%3C/g%3E%3C/svg%3E")`,
                                }}
                            />
                            <div className="relative z-10">
                                <h2 className="text-3xl font-bold mb-8 text-center">{t("core_values")}</h2>
                                <div className="grid md:grid-cols-3 gap-6">
                                    <div className="text-center">
                                        <Heart className="h-12 w-12 mx-auto mb-4 opacity-90" />
                                        <h3 className="text-xl font-semibold mb-2">{t("compassionate_care")}</h3>
                                        <p className="text-blue-100">Every feature we build is designed with patient wellbeing at its core.</p>
                                    </div>
                                    <div className="text-center">
                                        <Shield className="h-12 w-12 mx-auto mb-4 opacity-90" />
                                        <h3 className="text-xl font-semibold mb-2">{t("trust_security")}</h3>
                                        <p className="text-blue-100">HIPAA-compliant solutions that protect sensitive medical information.</p>
                                    </div>
                                    <div className="text-center">
                                        <Target className="h-12 w-12 mx-auto mb-4 opacity-90" />
                                        <h3 className="text-xl font-semibold mb-2">{t("innovation")}</h3>
                                        <p className="text-blue-100">Continuously evolving to meet the changing needs of healthcare.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </main>

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
                                <li><a href="/about-us" className="text-gray-300 hover:text-white transition-colors">Our Story</a></li>
                                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Leadership Team</a></li>
                                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Mission & Vision</a></li>
                                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Careers</a></li>
                            </ul>
                        </div>

                        {/* Services */}
                        <div className="space-y-4">
                            <h4 className="text-lg font-semibold text-green-400">Our Services</h4>
                            <ul className="space-y-2 text-sm">
                                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Emergency Care</a></li>
                                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Specialized Treatments</a></li>
                                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Diagnostics</a></li>
                                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Telemedicine</a></li>
                            </ul>
                        </div>

                        {/* Contact Info */}
                        <div className="space-y-4">
                            <h4 className="text-lg font-semibold text-blue-400">Contact Us</h4>
                            <div className="space-y-3 text-sm">
                                <p className="text-gray-300">Emergency: +1 (555) 911-HELP</p>
                                <p className="text-gray-300">General: +1 (555) 123-4567</p>
                                <p className="text-gray-300">info@sevamed.com</p>
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
                                <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                                <a href="/cookie-policy" className="hover:text-white transition-colors">Cookie Policy</a>
                                <a href="/accessibility" className="hover:text-white transition-colors">Accessibility</a>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
