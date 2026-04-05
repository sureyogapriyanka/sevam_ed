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
                    aiInsights.slice(0, 1).map((insight) => {
                        const currentFeedback = feedback[insight.id];
                        const comment = commentInputs[insight.id] || '';
                        const imagePreview = imagePreviews[insight.id];

                        return (
                            <Card key={insight.id} className="border-0 bg-white rounded-[2rem] shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden relative group flex flex-col md:flex-row min-h-[400px]">
                                {/* Left content side */}
                                <div className="flex-1 p-8 md:p-12 flex flex-col justify-center relative z-10 bg-white md:w-7/12">
                                    <div className="flex items-center mb-8">
                                        <div className="p-2.5 bg-blue-50 rounded-xl mr-3 text-blue-600 shadow-sm border border-blue-100">
                                            <Brain className="h-5 w-5" />
                                        </div>
                                        <h3 className="text-xl font-bold text-slate-900 tracking-tight">Your AI Health Assistant</h3>
                                    </div>

                                    <div className="mb-6 flex-grow">
                                        <h4 className="text-[11px] font-black text-blue-600 uppercase tracking-[0.2em] mb-4">
                                            {insight.type.replace('_', ' ')}
                                        </h4>
                                        <p className="text-xl md:text-2xl font-bold italic text-slate-700 leading-relaxed">
                                            "{insight.content}"
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-1.5 mt-8 mb-6">
                                        <div className="w-1.5 h-1.5 rounded-full bg-slate-200"></div>
                                        <div className="w-1.5 h-1.5 rounded-full bg-slate-200"></div>
                                        <div className="w-1.5 h-1.5 rounded-full bg-slate-200"></div>
                                        <div className="w-6 h-1.5 rounded-full bg-blue-500"></div>
                                    </div>

                                    <div className="mt-8 pt-6 border-t border-slate-50 flex flex-col gap-4">
                                        <div className="flex items-center justify-between">
                                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Model Validation & Feedback</h4>
                                            <Badge variant="outline" className="text-[10px] font-bold bg-white text-slate-500 border-slate-200 px-3 py-1 rounded-full">
                                                {new Date(insight.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </Badge>
                                        </div>

                                        <div className="flex items-center space-x-3 mt-2">
                                            <Button
                                                variant={currentFeedback?.feedback === 'positive' ? "default" : "outline"}
                                                className={`rounded-xl px-4 py-2 flex-1 transition-all duration-300 font-bold text-sm h-12 ${currentFeedback?.feedback === 'positive'
                                                    ? "bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/30 border-none scale-[1.02]"
                                                    : "border-slate-200 text-slate-600 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200"
                                                    }`}
                                                onClick={() => handleFeedback(insight.id, 'positive')}
                                            >
                                                <ThumbsUp className={`h-4 w-4 mr-2 ${currentFeedback?.feedback === 'positive' ? '' : 'text-emerald-500'}`} />
                                                Accurate
                                            </Button>
                                            <Button
                                                variant={currentFeedback?.feedback === 'negative' ? "default" : "outline"}
                                                className={`rounded-xl px-4 py-2 flex-1 transition-all duration-300 font-bold text-sm h-12 ${currentFeedback?.feedback === 'negative'
                                                    ? "bg-rose-500 hover:bg-rose-600 text-white shadow-lg shadow-rose-500/30 border-none scale-[1.02]"
                                                    : "border-slate-200 text-slate-600 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200"
                                                    }`}
                                                onClick={() => handleFeedback(insight.id, 'negative')}
                                            >
                                                <ThumbsDown className={`h-4 w-4 mr-2 ${currentFeedback?.feedback === 'negative' ? '' : 'text-rose-500'}`} />
                                                Inaccurate
                                            </Button>
                                        </div>

                                        <div className="mt-2 flex space-x-2">
                                            <Button
                                                variant="outline"
                                                className="h-10 px-3 flex items-center border-blue-200 text-blue-600 hover:bg-blue-50 rounded-xl"
                                                onClick={() => handleImageCapture(insight.id)}
                                            >
                                                <Camera className="h-4 w-4" />
                                            </Button>
                                            <input
                                                type="text"
                                                value={comment}
                                                onChange={(e) => handleCommentChange(insight.id, e.target.value)}
                                                placeholder="Add context..."
                                                className="flex-1 px-4 py-2 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm text-slate-700 bg-slate-50/50"
                                            />
                                            <Button
                                                onClick={() => submitComment(insight.id)}
                                                disabled={!comment.trim()}
                                                className="h-10 w-10 p-0 flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white rounded-xl"
                                            >
                                                <Send className="h-4 w-4" />
                                            </Button>
                                        </div>

                                        {(patientViews[insight.id]?.length > 0 || imagePreview) && (
                                            <div className="mt-2 flex flex-wrap gap-2">
                                                {imagePreview && !patientViews[insight.id]?.some(view => view.imageUrl === imagePreview) && (
                                                    <div className="relative inline-block group/img">
                                                        <img src={imagePreview} alt="Preview" className="w-12 h-12 object-cover rounded-lg border-2 border-blue-400" />
                                                        <button onClick={() => removeImagePreview(insight.id)} className="absolute -top-1 -right-1 bg-rose-500 text-white rounded-full p-0.5 opacity-0 group-hover/img:opacity-100 transition-opacity">
                                                            <X className="h-3 w-3" />
                                                        </button>
                                                    </div>
                                                )}
                                                {patientViews[insight.id]?.map((view, index) => (
                                                    <div key={index} className="relative inline-block group/img">
                                                        <img src={view.imageUrl} alt={`View ${index + 1}`} className="w-12 h-12 object-cover rounded-lg border border-slate-200" onClick={() => setImagePreviews(prev => ({...prev, [insight.id]: view.imageUrl}))} />
                                                        <button onClick={() => removePatientView(insight.id, index)} className="absolute -top-1 -right-1 bg-slate-800 text-white rounded-full p-0.5 opacity-0 group-hover/img:opacity-100 transition-opacity">
                                                            <X className="h-3 w-3" />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {currentFeedback && (currentFeedback.feedback || currentFeedback.comment || currentFeedback.imageUrl) && (
                                            <div className="mt-3 p-3 bg-slate-50 rounded-xl border border-slate-100 text-sm">
                                                {currentFeedback.feedback && (
                                                    <div className="flex items-center mb-1">
                                                        <span className="font-semibold mr-2 text-slate-500 text-xs uppercase tracking-wider">Status:</span>
                                                        <span className={currentFeedback.feedback === 'positive' ? "text-emerald-600 font-semibold" : "text-rose-600 font-semibold"}>
                                                            {currentFeedback.feedback === 'positive' ? 'Verified Accurate' : 'Flagged Inaccurate'}
                                                        </span>
                                                    </div>
                                                )}
                                                {currentFeedback.comment && (
                                                    <div className="text-slate-700 break-words line-clamp-2">
                                                        <span className="font-semibold mr-1 text-slate-500 text-xs uppercase tracking-wider">Note:</span>
                                                        {currentFeedback.comment}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Right image side */}
                                <div className="md:w-5/12 relative hidden md:block overflow-hidden bg-slate-50">
                                    <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white via-white/90 to-transparent z-10" />
                                    <img 
                                        src={
                                            insight.type === 'health_tip' ? 'https://images.unsplash.com/photo-1494597564530-871f2b93ac55?auto=format&fit=crop&w=800&q=80' : 
                                            insight.type === 'medication_reminder' ? 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80' : 
                                            'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=800&q=80'
                                        } 
                                        alt="Visualization" 
                                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 origin-right object-center" 
                                    />
                                </div>
                            </Card>
                        );
                    })
                )}
            </div>
        </div>
    );
}
