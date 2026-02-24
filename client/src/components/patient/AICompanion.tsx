import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useLanguage } from "../../contexts/LanguageContext";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import {
    Brain,
    MessageSquare,
    Heart,
    Activity,
    Zap,
    Send,
    User,
    Camera
} from "lucide-react";
import { aiInsightService, fitnessDataService } from "../../services/api";

interface AIInsight {
    id: string;
    type: string;
    content: string;
    createdAt: string;
}

export default function AICompanion() {
    const { user, patient } = useAuth();
    const { t } = useLanguage();
    const [insights, setInsights] = useState<AIInsight[]>([]);
    const [inputMessage, setInputMessage] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [conversation, setConversation] = useState<{ role: string, content: string }[]>([]);

    const { data: aiInsights = [] } = useQuery({
        queryKey: ["ai-insights", "user", user?.id],
        queryFn: async () => {
            if (!user?.id) return [];
            const { data } = await aiInsightService.getByUserId(user.id);
            return data || [];
        },
        enabled: !!user?.id
    });

    const { data: fitnessData = [] } = useQuery({
        queryKey: ["fitness-data", "patient", patient?.id],
        queryFn: async () => {
            if (!patient?.id) return [];
            const { data } = await fitnessDataService.getByPatientId(patient.id);
            return data || [];
        },
        enabled: !!patient?.id
    });

    useEffect(() => {
        setInsights(aiInsights);
    }, [aiInsights]);

    // Personalize AI companion based on patient age
    const getPersonalizedGreeting = () => {
        const age = user?.age || 0;
        if (age < 18) {
            return "Hi there! I'm your health buddy. How can I help you today?";
        } else if (age < 40) {
            return "Hello! I'm here to help you maintain your health. What would you like to know?";
        } else {
            return "Good day! I'm your health companion. How can I assist you with your wellness today?";
        }
    };

    const handleSendMessage = () => {
        if (!inputMessage.trim()) return;

        // Add user message to conversation
        const newUserMessage = { role: "user", content: inputMessage };
        setConversation(prev => [...prev, newUserMessage]);
        setInputMessage("");
        setIsTyping(true);

        // Simulate AI response
        setTimeout(() => {
            const aiResponse = generateAIResponse(inputMessage);
            const newAiMessage = { role: "ai", content: aiResponse };
            setConversation(prev => [...prev, newAiMessage]);
            setIsTyping(false);
        }, 1500);
    };

    const generateAIResponse = (question: string): string => {
        const lowerQuestion = question.toLowerCase();
        const age = user?.age || 0;
        const latestFitness = fitnessData[0];

        // Personalize response based on age
        if (age < 18 && (lowerQuestion.includes("health") || lowerQuestion.includes("wellness"))) {
            return "As a young person, it's great that you're thinking about your health! Focus on eating balanced meals, getting enough sleep (8-10 hours), staying active, and avoiding risky behaviors. Your body is still growing, so proper nutrition is key!";
        }

        if (age >= 40 && (lowerQuestion.includes("heart") || lowerQuestion.includes("cardio"))) {
            return "For your age group, heart health is especially important. I recommend regular check-ups, maintaining a healthy weight, managing stress, and staying physically active. Consider activities like brisk walking, swimming, or cycling for 30 minutes most days.";
        }

        // Response based on fitness data
        if (latestFitness) {
            if (latestFitness.heartRate && latestFitness.heartRate > 100) {
                return "I noticed your recent heart rate was elevated. This could be due to activity, stress, or other factors. Make sure to stay hydrated and rest if you're feeling unwell. If this persists, consider consulting with a doctor.";
            }

            if (latestFitness.steps && latestFitness.steps < 5000) {
                return "Your step count has been a bit low recently. Try to increase your daily activity by taking short walks, using stairs, or parking farther away. Small changes can make a big difference!";
            }
        }

        // General responses
        if (lowerQuestion.includes("appointment") || lowerQuestion.includes("book")) {
            return "I can help you with that! You can book appointments through the 'Appointments' section of your dashboard. Just select the specialty you need and choose a convenient time slot.";
        }

        if (lowerQuestion.includes("medication") || lowerQuestion.includes("prescription")) {
            return "For medication questions, please check your 'Prescriptions' section where you'll find all your current and past prescriptions with detailed instructions.";
        }

        if (lowerQuestion.includes("diet") || lowerQuestion.includes("nutrition")) {
            return "A balanced diet is important for everyone! Focus on whole foods like fruits, vegetables, lean proteins, and whole grains. Limit processed foods, excess sugar, and sodium. Stay hydrated with plenty of water throughout the day.";
        }

        return "Thanks for your question! I'm here to help you understand your health better. You can ask me about appointments, medications, diet, exercise, or any health concerns you might have. How else can I assist you today?";
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold flex items-center text-blue-900">
                    <Brain className="h-6 w-6 mr-2 text-blue-600" />
                    AI Health Companion
                </h2>
                <div className="flex space-x-2">
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                        Personalized for you
                    </Badge>
                    <Badge
                        variant="secondary"
                        className="bg-purple-100 text-purple-800 cursor-pointer hover:bg-purple-200"
                        onClick={() => {
                            // In a real app, this would navigate to the interactive insights page
                            // For now, we'll just show an alert
                            alert("Switching to interactive AI insights view where you can capture your views with images!");
                        }}
                    >
                        <Camera className="h-3 w-3 mr-1 inline text-purple-600" />
                        Interactive View
                    </Badge>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* AI Chat Interface */}
                <div className="lg:col-span-2">
                    <Card className="h-full border-2 border-blue-300 bg-white">
                        <CardHeader className="bg-blue-50">
                            <CardTitle className="flex items-center space-x-2 text-blue-900">
                                <MessageSquare className="h-5 w-5 text-blue-600" />
                                <span>Chat with Your Health Assistant</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Conversation */}
                            <div className="h-64 overflow-y-auto p-4 bg-blue-25 rounded-lg space-y-4">
                                {conversation.length === 0 ? (
                                    <div className="h-full flex flex-col items-center justify-center text-center p-4">
                                        <Brain className="h-12 w-12 text-blue-400 mb-4" />
                                        <p className="text-blue-700">
                                            {getPersonalizedGreeting()}
                                        </p>
                                        <p className="text-sm text-blue-600 mt-2">
                                            Ask me about your appointments, medications, or anything else health-related!
                                        </p>
                                    </div>
                                ) : (
                                    conversation.map((msg, index) => (
                                        <div
                                            key={index}
                                            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                                        >
                                            <div
                                                className={`max-w-xs p-3 rounded-lg ${msg.role === "user"
                                                    ? "bg-blue-500 text-white"
                                                    : "bg-blue-100 text-blue-900"
                                                    }`}
                                            >
                                                {msg.role === "ai" && (
                                                    <div className="flex items-center mb-1">
                                                        <Brain className="h-4 w-4 mr-1 text-blue-600" />
                                                        <span className="text-xs font-medium">AI Assistant</span>
                                                    </div>
                                                )}
                                                <p className="text-sm">{msg.content}</p>
                                            </div>
                                        </div>
                                    ))
                                )}

                                {isTyping && (
                                    <div className="flex justify-start">
                                        <div className="bg-blue-100 p-3 rounded-lg text-blue-900">
                                            <div className="flex items-center">
                                                <Brain className="h-4 w-4 mr-1 text-blue-600" />
                                                <span className="text-xs font-medium">AI Assistant</span>
                                            </div>
                                            <div className="flex space-x-1 mt-2">
                                                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                                                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Input */}
                            <div className="flex space-x-2">
                                <input
                                    type="text"
                                    value={inputMessage}
                                    onChange={(e) => setInputMessage(e.target.value)}
                                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                                    placeholder="Ask about your health, appointments, or medications..."
                                    className="flex-1 px-4 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-blue-900"
                                />
                                <Button
                                    onClick={handleSendMessage}
                                    disabled={!inputMessage.trim()}
                                    className="flex items-center bg-blue-600 hover:bg-blue-700"
                                >
                                    <Send className="h-4 w-4" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Personalized Insights */}
                <div>
                    <Card className="h-full border-2 border-purple-300 bg-white">
                        <CardHeader className="bg-purple-50">
                            <CardTitle className="flex items-center space-x-2 text-purple-900">
                                <Zap className="h-5 w-5 text-purple-600" />
                                <span>Personalized Insights</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {insights.length === 0 ? (
                                <div className="text-center py-8">
                                    <div className="bg-gradient-to-br from-purple-100 to-blue-100 rounded-xl p-6 mb-4">
                                        <Zap className="h-12 w-12 text-purple-500 mx-auto mb-3" />
                                        <h3 className="text-lg font-semibold text-purple-900 mb-2">Your AI Health Assistant</h3>
                                        <p className="text-purple-700">
                                            Get personalized health insights based on your medical data
                                        </p>
                                    </div>
                                    <Button className="bg-purple-600 hover:bg-purple-700">
                                        Get AI Health Insights
                                    </Button>
                                </div>
                            ) : (
                                insights.slice(0, 3).map((insight) => (
                                    <div key={insight.id} className="p-3 bg-purple-50 rounded-lg border border-purple-100">
                                        <div className="flex items-start space-x-2">
                                            <div className="mt-0.5">
                                                {insight.type === "health_tip" ? (
                                                    <Heart className="h-4 w-4 text-red-500" />
                                                ) : insight.type === "workflow_optimization" ? (
                                                    <Zap className="h-4 w-4 text-yellow-500" />
                                                ) : (
                                                    <Activity className="h-4 w-4 text-green-500" />
                                                )}
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium capitalize text-purple-900">
                                                    {insight.type.replace('_', ' ')}
                                                </p>
                                                <p className="text-xs text-purple-700 mt-1">
                                                    {insight.content}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}

                            <div className="pt-4 border-t border-purple-200">
                                <h4 className="text-sm font-medium mb-2 text-purple-800">Based on your profile:</h4>
                                <div className="space-y-2">
                                    <div className="flex items-center text-xs text-purple-700">
                                        <User className="h-3 w-3 mr-2 text-purple-500" />
                                        <span>Age: {user?.age || "N/A"} years</span>
                                    </div>
                                    {patient?.medicalHistory && (
                                        <div className="flex items-center text-xs text-purple-700">
                                            <Heart className="h-3 w-3 mr-2 text-purple-500" />
                                            <span>Medical history recorded</span>
                                        </div>
                                    )}
                                    {fitnessData.length > 0 && (
                                        <div className="flex items-center text-xs text-purple-700">
                                            <Activity className="h-3 w-3 mr-2 text-purple-500" />
                                            <span>Fitness data tracked</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
