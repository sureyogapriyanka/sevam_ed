import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import LanguageSelector from "../../components/common/LanguageSelector";
import ThemeToggle from "../../components/common/ThemeToggle";
import { useLanguage } from "../../contexts/LanguageContext";
import { Heart, ArrowLeft, Brain, Zap, Shield, Bot, TrendingUp, Bell, Activity, Smartphone, ChartBar, Target } from "lucide-react";

export default function AIHealthInsightsPage() {
    const navigate = useNavigate();
    const { t } = useLanguage();

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
            {/* Header */}
            <header className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-b border-purple-200 dark:border-gray-700 sticky top-0 z-50 shadow-sm">
                <div className="container mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <Button
                                variant="ghost"
                                onClick={() => navigate("/")}
                                className="flex items-center space-x-2 text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300"
                            >
                                <ArrowLeft className="h-5 w-5" />
                                <span>Back to Home</span>
                            </Button>
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg">
                                    <Heart className="text-white h-5 w-5" />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">{t("sevamed_hms")}</h1>
                                    <p className="text-sm text-purple-600 dark:text-purple-400">AI Health Insights</p>
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
            <section className="py-20 bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-600 relative overflow-hidden">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div className="text-white">
                            <div className="flex items-center space-x-3 mb-6">
                                <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center">
                                    <Brain className="h-8 w-8 text-white" />
                                </div>
                                <h1 className="text-5xl font-bold">AI Health Insights</h1>
                            </div>
                            <p className="text-xl text-purple-100 mb-8 leading-relaxed">
                                Revolutionary artificial intelligence technology that transforms your health data into
                                actionable insights, personalized recommendations, and predictive care guidance.
                                Experience the future of personalized healthcare with AI that learns, adapts, and cares.
                            </p>
                            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 mb-8">
                                <div className="flex items-center space-x-3 text-yellow-300">
                                    <Bot className="h-6 w-6" />
                                    <span className="font-semibold text-lg">Powered by Advanced Machine Learning</span>
                                </div>
                            </div>
                            <div className="flex space-x-4">
                                <Button
                                    size="lg"
                                    className="bg-white text-purple-600 hover:bg-purple-50 shadow-lg transition-all duration-300 transform hover:scale-105"
                                    onClick={() => navigate("/register")}
                                >
                                    Get AI Health Analysis
                                </Button>
                                <Button
                                    variant="outline"
                                    size="lg"
                                    className="border-white text-white hover:bg-white hover:text-purple-600 transition-all duration-300"
                                    onClick={() => navigate("/login")}
                                >
                                    View Health Insights
                                </Button>
                            </div>
                        </div>
                        <div className="relative">
                            <img
                                src="https://images.unsplash.com/photo-1559757148-5c350d0d3c56?auto=format&fit=crop&w=800&q=80"
                                alt="AI Health Technology - Advanced medical AI interface"
                                className="w-full h-96 object-cover rounded-2xl shadow-2xl"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent rounded-2xl"></div>
                            <div className="absolute top-4 right-4">
                                <div className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-semibold animate-pulse">
                                    AI POWERED
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Why AI Health Insights Save Lives */}
            <section className="py-16 bg-white dark:bg-gray-900">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-purple-800 dark:text-purple-400 mb-6">How AI Health Insights Save Lives</h2>
                        <p className="text-xl text-purple-600 dark:text-purple-300 max-w-4xl mx-auto leading-relaxed">
                            Artificial Intelligence in healthcare isn't just about convenience – it's about saving lives through
                            early detection, predictive analytics, and personalized care. Our AI systems can identify patterns
                            and risks that human analysis might miss, providing critical insights for preventive care.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <Card className="text-center hover:shadow-xl transition-all duration-300 border-purple-200 dark:border-purple-700">
                            <CardHeader>
                                <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <TrendingUp className="h-8 w-8 text-white" />
                                </div>
                                <CardTitle className="text-purple-800 dark:text-purple-400">Predictive Analytics</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-purple-700 dark:text-purple-300">
                                    AI analyzes your health patterns to predict potential issues before symptoms appear,
                                    enabling preventive interventions that can save lives.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="text-center hover:shadow-xl transition-all duration-300 border-indigo-200 dark:border-indigo-700">
                            <CardHeader>
                                <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Target className="h-8 w-8 text-white" />
                                </div>
                                <CardTitle className="text-indigo-800 dark:text-indigo-400">Early Detection</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-indigo-700 dark:text-indigo-300">
                                    Advanced algorithms detect subtle changes in health metrics that indicate
                                    early stages of diseases when they're most treatable.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="text-center hover:shadow-xl transition-all duration-300 border-blue-200 dark:border-blue-700">
                            <CardHeader>
                                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Shield className="h-8 w-8 text-white" />
                                </div>
                                <CardTitle className="text-blue-800 dark:text-blue-400">Personalized Care</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-blue-700 dark:text-blue-300">
                                    AI creates personalized health recommendations based on your unique medical history,
                                    genetics, and lifestyle factors for optimal outcomes.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* AI Features */}
            <section className="py-16 bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-gray-800 dark:to-purple-800">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-purple-800 dark:text-purple-400 mb-6">Intelligent Health Features</h2>
                        <p className="text-xl text-purple-600 dark:text-purple-300">
                            Advanced AI capabilities that revolutionize your healthcare experience
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                            <div className="flex items-start space-x-4 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                                <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <ChartBar className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold text-purple-800 dark:text-purple-400 mb-2">Health Pattern Analysis</h3>
                                    <p className="text-purple-600 dark:text-purple-300">
                                        AI continuously analyzes your health data to identify patterns, trends, and anomalies
                                        that might indicate developing health conditions or improvement opportunities.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-4 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                                <div className="w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <Bell className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold text-indigo-800 dark:text-indigo-400 mb-2">Intelligent Alerts</h3>
                                    <p className="text-indigo-600 dark:text-indigo-300">
                                        Smart notification system that alerts you and your healthcare providers
                                        to concerning changes or important health milestones requiring attention.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-4 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <Smartphone className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold text-blue-800 dark:text-blue-400 mb-2">Personal Health Assistant</h3>
                                    <p className="text-blue-600 dark:text-blue-300">
                                        AI-powered virtual assistant that answers health questions, provides medication reminders,
                                        and offers personalized wellness advice 24/7.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-start space-x-4 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                                <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <Activity className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold text-green-800 dark:text-green-400 mb-2">Vital Signs Monitoring</h3>
                                    <p className="text-green-600 dark:text-green-300">
                                        Continuous analysis of vital signs from wearable devices and medical equipment
                                        with real-time health status assessment and risk evaluation.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-4 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                                <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <Target className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold text-orange-800 dark:text-orange-400 mb-2">Treatment Optimization</h3>
                                    <p className="text-orange-600 dark:text-orange-300">
                                        AI analyzes treatment effectiveness and suggests optimizations to improve
                                        outcomes, reduce side effects, and accelerate recovery.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-4 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                                <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <Zap className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold text-red-800 dark:text-red-400 mb-2">Risk Assessment</h3>
                                    <p className="text-red-600 dark:text-red-300">
                                        Advanced risk scoring algorithms that assess your likelihood of developing
                                        specific conditions, enabling proactive preventive measures.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Call to Action */}
            <section className="py-16 bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
                <div className="container mx-auto px-6 text-center">
                    <h2 className="text-4xl font-bold mb-6">Experience the Future of Healthcare</h2>
                    <p className="text-xl mb-8 max-w-3xl mx-auto">
                        Don't wait for symptoms to appear. Let AI health insights guide your journey to better health
                        with predictive care, personalized recommendations, and intelligent monitoring.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
                        <Button
                            size="lg"
                            className="bg-white text-purple-600 hover:bg-purple-50 shadow-lg transition-all duration-300 transform hover:scale-105"
                            onClick={() => navigate("/register")}
                        >
                            Start AI Health Journey
                        </Button>
                        <Button
                            variant="outline"
                            size="lg"
                            className="border-white text-white hover:bg-white hover:text-purple-600 transition-all duration-300"
                            onClick={() => navigate("/login")}
                        >
                            Access Your Health Insights
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    );
}
