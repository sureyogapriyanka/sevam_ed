import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import LanguageSelector from "../../components/common/LanguageSelector";
import ThemeToggle from "../../components/common/ThemeToggle";
import { useLanguage } from "../../contexts/LanguageContext";
import { Heart, ArrowLeft, Monitor, Activity, Smartphone, Watch, Wifi, Shield, TrendingUp, Bell, Zap, AlertTriangle } from "lucide-react";

export default function HealthMonitoringPage() {
    const navigate = useNavigate();
    const { t } = useLanguage();

    return (
        <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-teal-900">
            {/* Header */}
            <header className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-b border-teal-200 dark:border-gray-700 sticky top-0 z-50 shadow-sm">
                <div className="container mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <Button
                                variant="ghost"
                                onClick={() => navigate("/")}
                                className="flex items-center space-x-2 text-teal-600 hover:text-teal-800 dark:text-teal-400 dark:hover:text-teal-300"
                            >
                                <ArrowLeft className="h-5 w-5" />
                                <span>Back to Home</span>
                            </Button>
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-teal-600 to-cyan-600 rounded-lg flex items-center justify-center shadow-lg">
                                    <Heart className="text-white h-5 w-5" />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">{t("sevamed_hms")}</h1>
                                    <p className="text-sm text-teal-600 dark:text-teal-400">Health Monitoring</p>
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
            <section className="py-20 bg-gradient-to-br from-teal-600 via-teal-700 to-cyan-600 relative overflow-hidden">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div className="text-white">
                            <div className="flex items-center space-x-3 mb-6">
                                <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center">
                                    <Monitor className="h-8 w-8 text-white" />
                                </div>
                                <h1 className="text-5xl font-bold">Health Monitoring</h1>
                            </div>
                            <p className="text-xl text-teal-100 mb-8 leading-relaxed">
                                Continuous, real-time health monitoring that keeps you and your healthcare team informed
                                about your vital signs, health trends, and potential concerns. Advanced monitoring technology
                                that provides peace of mind and enables proactive healthcare management.
                            </p>
                            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 mb-8">
                                <div className="flex items-center space-x-3 text-yellow-300">
                                    <Wifi className="h-6 w-6" />
                                    <span className="font-semibold text-lg">24/7 Connected Health Monitoring</span>
                                </div>
                            </div>
                            <div className="flex space-x-4">
                                <Button
                                    size="lg"
                                    className="bg-white text-teal-600 hover:bg-teal-50 shadow-lg transition-all duration-300 transform hover:scale-105"
                                    onClick={() => navigate("/register")}
                                >
                                    Start Monitoring
                                </Button>
                                <Button
                                    variant="outline"
                                    size="lg"
                                    className="border-white text-white hover:bg-white hover:text-teal-600 transition-all duration-300"
                                    onClick={() => navigate("/login")}
                                >
                                    View Health Data
                                </Button>
                            </div>
                        </div>
                        <div className="relative">
                            <img
                                src="https://images.unsplash.com/photo-1576671081837-49000212a370?auto=format&fit=crop&w=800&q=80"
                                alt="Health Monitoring - Advanced medical monitoring equipment"
                                className="w-full h-96 object-cover rounded-2xl shadow-2xl"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent rounded-2xl"></div>
                            <div className="absolute top-4 right-4">
                                <div className="bg-teal-600 text-white px-3 py-1 rounded-full text-sm font-semibold animate-pulse">
                                    REAL-TIME MONITORING
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Why Health Monitoring Saves Lives */}
            <section className="py-16 bg-white dark:bg-gray-900">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-teal-800 dark:text-teal-400 mb-6">How Continuous Monitoring Saves Lives</h2>
                        <p className="text-xl text-teal-600 dark:text-teal-300 max-w-4xl mx-auto leading-relaxed">
                            Continuous health monitoring is a life-saving technology that detects critical changes before they become
                            emergencies. By tracking vital signs, symptoms, and health patterns in real-time, we can identify problems
                            early and intervene immediately, often preventing serious complications or saving lives.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                        <div className="text-center bg-teal-50 dark:bg-teal-900/20 p-6 rounded-xl">
                            <div className="text-3xl font-bold text-teal-600 dark:text-teal-400 mb-2">24/7</div>
                            <div className="text-teal-800 dark:text-teal-300 font-semibold">Continuous Monitoring</div>
                            <div className="text-sm text-teal-600 dark:text-teal-400 mt-1">Never miss critical changes</div>
                        </div>
                        <div className="text-center bg-cyan-50 dark:bg-cyan-900/20 p-6 rounded-xl">
                            <div className="text-3xl font-bold text-cyan-600 dark:text-cyan-400 mb-2">&lt; 60s</div>
                            <div className="text-cyan-800 dark:text-cyan-300 font-semibold">Alert Response Time</div>
                            <div className="text-sm text-cyan-600 dark:text-cyan-400 mt-1">Immediate notification</div>
                        </div>
                        <div className="text-center bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl">
                            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">95%</div>
                            <div className="text-blue-800 dark:text-blue-300 font-semibold">Early Detection Rate</div>
                            <div className="text-sm text-blue-600 dark:text-blue-400 mt-1">Catch issues before symptoms</div>
                        </div>
                        <div className="text-center bg-green-50 dark:bg-green-900/20 p-6 rounded-xl">
                            <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">50%</div>
                            <div className="text-green-800 dark:text-green-300 font-semibold">Reduction in ER Visits</div>
                            <div className="text-sm text-green-600 dark:text-green-400 mt-1">Preventive care works</div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <Card className="text-center hover:shadow-xl transition-all duration-300 border-teal-200 dark:border-teal-700">
                            <CardHeader>
                                <div className="w-16 h-16 bg-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <AlertTriangle className="h-8 w-8 text-white" />
                                </div>
                                <CardTitle className="text-teal-800 dark:text-teal-400">Early Warning System</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-teal-700 dark:text-teal-300">
                                    Advanced algorithms detect subtle changes in vital signs that precede
                                    serious medical events, providing critical early warnings.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="text-center hover:shadow-xl transition-all duration-300 border-cyan-200 dark:border-cyan-700">
                            <CardHeader>
                                <div className="w-16 h-16 bg-cyan-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Zap className="h-8 w-8 text-white" />
                                </div>
                                <CardTitle className="text-cyan-800 dark:text-cyan-400">Instant Response</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-cyan-700 dark:text-cyan-300">
                                    Immediate alerts to healthcare providers and emergency contacts
                                    when critical thresholds are exceeded or concerning patterns emerge.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="text-center hover:shadow-xl transition-all duration-300 border-blue-200 dark:border-blue-700">
                            <CardHeader>
                                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <TrendingUp className="h-8 w-8 text-white" />
                                </div>
                                <CardTitle className="text-blue-800 dark:text-blue-400">Health Trends</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-blue-700 dark:text-blue-300">
                                    Long-term health trend analysis helps identify gradual changes
                                    and chronic condition progression for proactive management.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Monitoring Technologies */}
            <section className="py-16 bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-gray-800 dark:to-teal-800">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-teal-800 dark:text-teal-400 mb-6">Advanced Monitoring Technologies</h2>
                        <p className="text-xl text-teal-600 dark:text-teal-300">
                            State-of-the-art monitoring devices and systems for comprehensive health tracking
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                            <div className="flex items-start space-x-4 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                                <div className="w-12 h-12 bg-teal-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <Watch className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold text-teal-800 dark:text-teal-400 mb-2">Wearable Devices</h3>
                                    <p className="text-teal-600 dark:text-teal-300">
                                        Advanced smartwatches and fitness trackers that monitor heart rate, blood pressure,
                                        oxygen levels, sleep patterns, and activity levels throughout the day.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-4 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                                <div className="w-12 h-12 bg-cyan-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <Smartphone className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold text-cyan-800 dark:text-cyan-400 mb-2">Mobile Health Apps</h3>
                                    <p className="text-cyan-600 dark:text-cyan-300">
                                        Intelligent mobile applications that track symptoms, medication adherence,
                                        mood, and daily health metrics with AI-powered insights and recommendations.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-4 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <Monitor className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold text-blue-800 dark:text-blue-400 mb-2">Remote Patient Monitoring</h3>
                                    <p className="text-blue-600 dark:text-blue-300">
                                        Hospital-grade monitoring equipment for home use, including ECG monitors,
                                        blood glucose meters, and blood pressure cuffs with automatic data transmission.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-start space-x-4 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                                <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <Activity className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold text-purple-800 dark:text-purple-400 mb-2">Vital Signs Monitoring</h3>
                                    <p className="text-purple-600 dark:text-purple-300">
                                        Continuous monitoring of heart rate, respiratory rate, blood pressure,
                                        temperature, and oxygen saturation with real-time analysis and alerts.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-4 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                                <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <Bell className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold text-green-800 dark:text-green-400 mb-2">Smart Alerts</h3>
                                    <p className="text-green-600 dark:text-green-300">
                                        Intelligent notification system that distinguishes between normal variations
                                        and concerning changes, reducing false alarms while ensuring critical alerts reach you.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-4 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                                <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <Shield className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold text-orange-800 dark:text-orange-400 mb-2">Secure Data Transmission</h3>
                                    <p className="text-orange-600 dark:text-orange-300">
                                        End-to-end encrypted data transmission ensures your health information
                                        remains private while enabling real-time monitoring by authorized healthcare providers.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Call to Action */}
            <section className="py-16 bg-gradient-to-r from-teal-600 to-cyan-600 text-white">
                <div className="container mx-auto px-6 text-center">
                    <h2 className="text-4xl font-bold mb-6">Start Your Health Monitoring Journey</h2>
                    <p className="text-xl mb-8 max-w-3xl mx-auto">
                        Don't wait for symptoms to tell you something's wrong. With continuous health monitoring,
                        you can stay informed about your health status and catch potential issues before they become serious.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
                        <Button
                            size="lg"
                            className="bg-white text-teal-600 hover:bg-teal-50 shadow-lg transition-all duration-300 transform hover:scale-105"
                            onClick={() => navigate("/register")}
                        >
                            Begin Health Monitoring
                        </Button>
                        <Button
                            variant="outline"
                            size="lg"
                            className="border-white text-white hover:bg-white hover:text-teal-600 transition-all duration-300"
                            onClick={() => navigate("/login")}
                        >
                            View Your Health Dashboard
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    );
}
