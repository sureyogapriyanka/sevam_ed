import { useState, useRef } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useLanguage } from "../../contexts/LanguageContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import {
    Brain,
    Camera,
    Heart,
    Activity,
    Zap,
    Send,
    User,
    ThumbsUp,
    ThumbsDown,
    X
} from "lucide-react";
import { aiInsightService, fitnessDataService } from "../../services/api";

interface AIInsight {
    id: string;
    type: string;
    content: string;
    createdAt: string;
}

interface PatientFeedback {
    insightId: string;
    feedback: 'positive' | 'negative' | null;
    comment?: string;
    imageUrl?: string;
}

interface PatientView {
    insightId: string;
    imageUrl: string;
    timestamp: Date;
    feedback?: 'positive' | 'negative';
    comment?: string;
}

export default function InteractiveAIInsights() {
    const { user, patient } = useAuth();
    const { t } = useLanguage();
    const queryClient = useQueryClient();
    const [insights, setInsights] = useState<AIInsight[]>([]);
    const [feedback, setFeedback] = useState<Record<string, PatientFeedback>>({});
    const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
    const [imagePreviews, setImagePreviews] = useState<Record<string, string>>({});
    const [patientViews, setPatientViews] = useState<Record<string, PatientView[]>>({});
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [activeImageCapture, setActiveImageCapture] = useState<string | null>(null);

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

    // Generate AI health suggestions
    const generateHealthSuggestionsMutation = useMutation({
        mutationFn: async () => {
            const latestFitness = fitnessData[0];
            const { data } = await aiInsightService.generateHealthSuggestions({
                patientData: {
                    age: user?.age,
                    medicalHistory: patient?.medicalHistory,
                    medications: patient?.medications,
                    vitals: {
                        heartRate: latestFitness?.heartRate,
                        bloodPressure: latestFitness?.bloodPressure,
                        weight: patient?.weight,
                        height: patient?.height
                    }
                },
                userId: user?.id
            });
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["ai-insights", "user", user?.id] });
        }
    });

    // Mutation to submit feedback
    const submitFeedbackMutation = useMutation({
        mutationFn: async (feedbackData: PatientFeedback) => {
            // In a real implementation, this would call an API endpoint
            // For now, we'll just simulate the submission
            return new Promise((resolve) => setTimeout(resolve, 500));
        },
        onSuccess: (_, variables) => {
            // Update local state with the submitted feedback
            setFeedback(prev => ({
                ...prev,
                [variables.insightId]: variables
            }));

            // Clear comment input and image preview for this insight
            setCommentInputs(prev => {
                const newInputs = { ...prev };
                delete newInputs[variables.insightId];
                return newInputs;
            });

            setImagePreviews(prev => {
                const newPreviews = { ...prev };
                delete newPreviews[variables.insightId];
                return newPreviews;
            });

            // Invalidate and refetch
            queryClient.invalidateQueries({ queryKey: ["ai-insights", "user", user?.id] });
        }
    });

    const handleFeedback = (insightId: string, feedbackType: 'positive' | 'negative') => {
        const currentFeedback = feedback[insightId];
        const newFeedback = {
            insightId,
            feedback: currentFeedback?.feedback === feedbackType ? null : feedbackType,
            comment: commentInputs[insightId] || undefined,
            imageUrl: imagePreviews[insightId] || undefined
        };

        setFeedback(prev => ({
            ...prev,
            [insightId]: newFeedback
        }));

        // Submit feedback
        submitFeedbackMutation.mutate(newFeedback);
    };

    const handleCommentChange = (insightId: string, comment: string) => {
        setCommentInputs(prev => ({
            ...prev,
            [insightId]: comment
        }));
    };

    const handleImageCapture = (insightId: string) => {
        setActiveImageCapture(insightId);
        fileInputRef.current?.click();
    };

    const handleImageSelected = (insightId: string, event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // Check if file is an image
        if (!file.type.startsWith('image/')) {
            alert('Please select an image file');
            return;
        }

        // Check file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert('Image size should be less than 5MB');
            return;
        }

        // Convert image to base64 for preview
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64Image = reader.result as string;
            setImagePreviews(prev => ({
                ...prev,
                [insightId]: base64Image
            }));

            // Add to patient views
            addPatientView(insightId, base64Image);

            // Auto-submit feedback with image when captured
            const currentFeedback = feedback[insightId] || {
                insightId,
                feedback: null
            };

            const newFeedback = {
                ...currentFeedback,
                imageUrl: base64Image
            };

            setFeedback(prev => ({
                ...prev,
                [insightId]: newFeedback
            }));

            // Submit feedback
            submitFeedbackMutation.mutate(newFeedback);
        };
        reader.readAsDataURL(file);

        // Reset file input
        event.target.value = '';
        setActiveImageCapture(null);
    };

    const removeImagePreview = (insightId: string) => {
        setImagePreviews(prev => {
            const newPreviews = { ...prev };
            delete newPreviews[insightId];
            return newPreviews;
        });
    };

    const submitComment = (insightId: string) => {
        const comment = commentInputs[insightId];
        if (!comment?.trim()) return;

        const currentFeedback = feedback[insightId] || {
            insightId,
            feedback: null
        };

        const newFeedback = {
            ...currentFeedback,
            comment,
            imageUrl: imagePreviews[insightId] || undefined
        };

        setFeedback(prev => ({
            ...prev,
            [insightId]: newFeedback
        }));

        // Submit feedback
        submitFeedbackMutation.mutate(newFeedback);
    };

    // Function to add a patient view
    const addPatientView = (insightId: string, imageUrl: string) => {
        const newView: PatientView = {
            insightId,
            imageUrl,
            timestamp: new Date()
        };

        setPatientViews(prev => ({
            ...prev,
            [insightId]: [...(prev[insightId] || []), newView]
        }));
    };

    // Function to remove a patient view
    const removePatientView = (insightId: string, index: number) => {
        setPatientViews(prev => {
            const updatedViews = [...(prev[insightId] || [])];
            updatedViews.splice(index, 1);
            return {
                ...prev,
                [insightId]: updatedViews
            };
        });
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight flex items-center mb-2">
                        <div className="p-3 bg-blue-100/50 rounded-2xl mr-4 border border-blue-200 text-blue-600">
                            <Brain className="h-6 w-6" />
                        </div>
                        Cognitive Health Insights
                    </h2>
                    <p className="text-slate-400 font-bold text-xs uppercase tracking-[0.2em] ml-16">
                        AI-generated predictive bio-analytics
                    </p>
                </div>
                <Badge className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-none px-4 py-2 font-black uppercase tracking-widest shadow-lg shadow-blue-500/20">
                    Neural Engine Active
                </Badge>
            </div>

            {/* Hidden file input for image capture */}
            <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={(e) => activeImageCapture && handleImageSelected(activeImageCapture, e)}
            />

            <div className="grid grid-cols-1 gap-8">
                {aiInsights.length === 0 ? (
                    <Card className="h-full border border-slate-200 bg-white/50 backdrop-blur-xl rounded-[3rem] overflow-hidden shadow-sm relative group">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-100 rounded-full blur-3xl -z-10 opacity-50 group-hover:bg-blue-200 transition-colors duration-700" />
                        <CardContent className="flex flex-col items-center justify-center py-20 text-center relative z-10">
                            <div className="w-24 h-24 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-[2rem] flex items-center justify-center mb-8 shadow-inner border border-white">
                                <Brain className="h-10 w-10 text-blue-500 animate-pulse" />
                            </div>
                            <h3 className="text-2xl font-black text-slate-900 mb-3">No Cognitive Models Active</h3>
                            <p className="text-slate-500 font-medium mb-10 max-w-md text-lg">
                                Synthesize your biomedical data to generate predictive health pathways.
                            </p>
                            <Button
                                className="bg-slate-900 hover:bg-blue-600 text-white rounded-2xl px-10 py-6 text-lg font-bold transition-all shadow-xl hover:shadow-blue-500/30 hover:scale-105 duration-300"
                                onClick={() => generateHealthSuggestionsMutation.mutate()}
                                disabled={generateHealthSuggestionsMutation.isPending}
                            >
                                {generateHealthSuggestionsMutation.isPending ? (
                                    <>
                                        <Zap className="h-5 w-5 mr-3 animate-pulse text-amber-400" />
                                        Synthesizing Neural Model...
                                    </>
                                ) : (
                                    <>
                                        <Zap className="h-5 w-5 mr-3 text-amber-400" />
                                        Initialize AI Analysis
                                    </>
                                )}
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    aiInsights.map((insight) => {
                        const currentFeedback = feedback[insight.id];
                        const comment = commentInputs[insight.id] || '';
                        const imagePreview = imagePreviews[insight.id];

                        return (
                            <Card key={insight.id} className="border border-slate-200 bg-white rounded-[2.5rem] shadow-sm hover:shadow-xl hover:border-blue-300 transition-all duration-500 overflow-hidden relative group">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-50 to-transparent rounded-bl-[100%] opacity-50 z-0" />
                                <CardHeader className="bg-transparent border-b border-slate-100 p-8 pb-6 relative z-10">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-4">
                                            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 group-hover:scale-110 transition-transform duration-500">
                                                {insight.type === "health_tip" ? (
                                                    <Heart className="h-6 w-6 text-rose-500" />
                                                ) : insight.type === "medication_reminder" ? (
                                                    <Zap className="h-6 w-6 text-amber-500" />
                                                ) : (
                                                    <Activity className="h-6 w-6 text-emerald-500" />
                                                )}
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Observation Type</p>
                                                <CardTitle className="text-2xl font-black text-slate-900 capitalize tracking-tight flex items-center">
                                                    {insight.type.replace('_', ' ')}
                                                </CardTitle>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Generated</p>
                                            <Badge variant="outline" className="text-sm font-bold bg-white text-slate-600 border-slate-200 px-4 py-1.5 rounded-full">
                                                {new Date(insight.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </Badge>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-8 relative z-10 space-y-6">
                                    <p className="text-lg text-slate-700 leading-relaxed font-medium">
                                        "{insight.content}"
                                    </p>

                                    {/* Feedback section */}
                                    <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row gap-8">
                                        <div className="flex-1 space-y-4">
                                            <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Model Validation</h4>

                                            {/* Feedback buttons */}
                                            <div className="flex items-center space-x-3">
                                                <Button
                                                    variant={currentFeedback?.feedback === 'positive' ? "default" : "outline"}
                                                    className={`rounded-xl px-6 py-5 flex-1 transition-all duration-300 font-bold ${currentFeedback?.feedback === 'positive'
                                                        ? "bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/30 border-none scale-105"
                                                        : "border-slate-200 text-slate-600 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200"
                                                        }`}
                                                    onClick={() => handleFeedback(insight.id, 'positive')}
                                                >
                                                    <ThumbsUp className={`h-5 w-5 mr-3 ${currentFeedback?.feedback === 'positive' ? '' : 'text-emerald-500'}`} />
                                                    Accurate
                                                </Button>
                                                <Button
                                                    variant={currentFeedback?.feedback === 'negative' ? "default" : "outline"}
                                                    className={`rounded-xl px-6 py-5 flex-1 transition-all duration-300 font-bold ${currentFeedback?.feedback === 'negative'
                                                        ? "bg-rose-500 hover:bg-rose-600 text-white shadow-lg shadow-rose-500/30 border-none scale-105"
                                                        : "border-slate-200 text-slate-600 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200"
                                                        }`}
                                                    onClick={() => handleFeedback(insight.id, 'negative')}
                                                >
                                                    <ThumbsDown className={`h-5 w-5 mr-3 ${currentFeedback?.feedback === 'negative' ? '' : 'text-rose-500'}`} />
                                                    Inaccurate
                                                </Button>
                                            </div>

                                            {/* Image capture and preview */}
                                            <div className="mb-3">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="flex items-center border-blue-300 text-blue-700 hover:bg-blue-100"
                                                    onClick={() => handleImageCapture(insight.id)}
                                                >
                                                    <Camera className="h-4 w-4 mr-1" />
                                                    Capture View
                                                </Button>

                                                {/* Display patient views */}
                                                {patientViews[insight.id] && patientViews[insight.id].length > 0 && (
                                                    <div className="mt-2">
                                                        <h4 className="text-xs font-medium text-blue-700 mb-1">Your Views:</h4>
                                                        <div className="flex flex-wrap gap-2">
                                                            {patientViews[insight.id].map((view, index) => (
                                                                <div key={index} className="relative">
                                                                    <img
                                                                        src={view.imageUrl}
                                                                        alt={`Patient view ${index + 1}`}
                                                                        className="w-16 h-16 object-cover rounded border cursor-pointer hover:opacity-80 border-blue-300"
                                                                        onClick={() => {
                                                                            // Set as current preview when clicked
                                                                            setImagePreviews(prev => ({
                                                                                ...prev,
                                                                                [insight.id]: view.imageUrl
                                                                            }));
                                                                        }}
                                                                    />
                                                                    <button
                                                                        onClick={() => removePatientView(insight.id, index)}
                                                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                                                    >
                                                                        <X className="h-3 w-3" />
                                                                    </button>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                {imagePreview && !patientViews[insight.id]?.some(view => view.imageUrl === imagePreview) && (
                                                    <div className="mt-2 relative inline-block">
                                                        <img
                                                            src={imagePreview}
                                                            alt="Captured view"
                                                            className="w-24 h-24 object-cover rounded border border-blue-300"
                                                        />
                                                        <button
                                                            onClick={() => removeImagePreview(insight.id)}
                                                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                                        >
                                                            <X className="h-3 w-3" />
                                                        </button>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Comment input */}
                                            <div className="flex space-x-2">
                                                <input
                                                    type="text"
                                                    value={comment}
                                                    onChange={(e) => handleCommentChange(insight.id, e.target.value)}
                                                    placeholder="Add a comment about this insight..."
                                                    className="flex-1 px-3 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-blue-900"
                                                />
                                                <Button
                                                    onClick={() => submitComment(insight.id)}
                                                    disabled={!comment.trim()}
                                                    size="sm"
                                                    className="flex items-center bg-blue-600 hover:bg-blue-700 text-white"
                                                >
                                                    <Send className="h-4 w-4" />
                                                </Button>
                                            </div>

                                            {/* Display submitted feedback */}
                                            {currentFeedback && (
                                                <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                                                    {currentFeedback.feedback && (
                                                        <div className="flex items-center text-sm mb-1">
                                                            <span className="font-medium mr-2 text-blue-800">Feedback:</span>
                                                            <Badge
                                                                variant="secondary"
                                                                className={currentFeedback.feedback === 'positive'
                                                                    ? "bg-green-100 text-green-800"
                                                                    : "bg-red-100 text-red-800"}
                                                            >
                                                                {currentFeedback.feedback === 'positive' ? 'Helpful' : 'Not Helpful'}
                                                            </Badge>
                                                        </div>
                                                    )}
                                                    {currentFeedback.comment && (
                                                        <div className="text-sm text-blue-900">
                                                            <span className="font-medium mr-2">Comment:</span>
                                                            <span>{currentFeedback.comment}</span>
                                                        </div>
                                                    )}
                                                    {currentFeedback.imageUrl && (
                                                        <div className="mt-2">
                                                            <span className="font-medium text-sm mr-2 text-blue-800">View:</span>
                                                            <img
                                                                src={currentFeedback.imageUrl}
                                                                alt="Patient view"
                                                                className="w-16 h-16 object-cover rounded border inline-block border-blue-300"
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })
                )}
            </div>
        </div>
    );
}
