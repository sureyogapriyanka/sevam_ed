import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { toast } from "../../hooks/use-toast";
import {
    Search,
    Filter,
    Download,
    Heart,
    Droplets,
    Activity,
    Apple,
    Moon,
    Sun,
    Coffee,
    Eye,
    BookOpen,
    FileText,
    Save,
    Check
} from "lucide-react";

// Mock health tips data
const mockHealthTips = [
    {
        id: "tip-001",
        title: "Stay Hydrated",
        category: "Nutrition",
        content: "Drink at least 8 glasses of water daily for optimal health. Proper hydration helps maintain body temperature, joint lubrication, and organ protection.",
        icon: Droplets,
        priority: "high"
    },
    {
        id: "tip-002",
        title: "Regular Exercise",
        category: "Fitness",
        content: "Aim for 30 minutes of moderate exercise 5 times a week. Activities like walking, swimming, or cycling can significantly improve cardiovascular health.",
        icon: Activity,
        priority: "high"
    },
    {
        id: "tip-003",
        title: "Balanced Diet",
        category: "Nutrition",
        content: "Include a variety of fruits, vegetables, whole grains, and lean proteins in your meals. Limit processed foods and added sugars for better health outcomes.",
        icon: Apple,
        priority: "high"
    },
    {
        id: "tip-004",
        title: "Adequate Sleep",
        category: "Wellness",
        content: "Get 7-9 hours of quality sleep each night. Good sleep hygiene improves immune function, mood, and cognitive performance.",
        icon: Moon,
        priority: "medium"
    },
    {
        id: "tip-005",
        title: "Manage Stress",
        category: "Mental Health",
        content: "Practice relaxation techniques such as deep breathing, meditation, or yoga. Chronic stress can negatively impact both physical and mental health.",
        icon: Heart,
        priority: "medium"
    },
    {
        id: "tip-006",
        title: "Limit Caffeine",
        category: "Lifestyle",
        content: "Reduce caffeine intake, especially in the afternoon and evening. This can help improve sleep quality and reduce anxiety levels.",
        icon: Coffee,
        priority: "low"
    },
    {
        id: "tip-007",
        title: "Regular Checkups",
        category: "Prevention",
        content: "Schedule regular health screenings and checkups with your healthcare provider. Early detection of health issues can lead to better outcomes.",
        icon: Eye,
        priority: "high"
    },
    {
        id: "tip-008",
        title: "Quit Smoking",
        category: "Lifestyle",
        content: "If you smoke, seek help to quit. Smoking cessation significantly reduces the risk of heart disease, stroke, and various cancers.",
        icon: Activity,
        priority: "high"
    }
];

// Mock patient education resources
const mockPatientResources = [
    {
        id: "res-001",
        title: "Understanding Blood Pressure",
        category: "Cardiovascular Health",
        description: "Learn about normal ranges and management techniques for blood pressure.",
        reads: 1240,
        icon: Activity
    },
    {
        id: "res-002",
        title: "Diabetes Management",
        category: "Endocrine Health",
        description: "Essential guidelines for controlling blood sugar levels and preventing complications.",
        reads: 980,
        icon: Droplets
    },
    {
        id: "res-003",
        title: "Heart-Healthy Diet",
        category: "Nutrition",
        description: "Dietary recommendations to support cardiovascular health and reduce heart disease risk.",
        reads: 870,
        icon: Heart
    },
    {
        id: "res-004",
        title: "Exercise for Seniors",
        category: "Fitness",
        description: "Safe and effective exercise routines tailored for older adults.",
        reads: 750,
        icon: Activity
    },
    {
        id: "res-005",
        title: "Mental Wellness",
        category: "Mental Health",
        description: "Strategies for maintaining good mental health and managing stress.",
        reads: 1100,
        icon: Sun
    },
    {
        id: "res-006",
        title: "Medication Adherence",
        category: "Treatment",
        description: "Tips for taking medications correctly and avoiding common mistakes.",
        reads: 650,
        icon: FileText
    }
];

export default function HealthTipsPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [filterCategory, setFilterCategory] = useState("all");
    const [selectedTip, setSelectedTip] = useState<typeof mockHealthTips[0] | null>(null);
    const [savedTips, setSavedTips] = useState<Record<string, boolean>>({});
    const [downloadedResources, setDownloadedResources] = useState<Record<string, boolean>>({});

    // Refs for toast timeouts
    const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Handler for saving a health tip
    const handleSaveTip = (tipId: string) => {
        setSavedTips(prev => ({
            ...prev,
            [tipId]: !prev[tipId]
        }));

        // Clear any existing timeout
        if (toastTimeoutRef.current) {
            clearTimeout(toastTimeoutRef.current);
        }

        // Show toast notification
        toast({
            title: "Tip Saved",
            description: "Health tip has been saved to your collection",
            className: "bg-green-50 border-green-200 text-green-800"
        });

        // Auto-hide toast after 3 seconds
        toastTimeoutRef.current = setTimeout(() => {
            // Toast will auto-dismiss
        }, 3000);
    };

    // Handler for downloading a health tip
    const handleDownloadTip = (tip: typeof mockHealthTips[0]) => {
        // In a real implementation, this would generate and download a PDF
        // For now, we'll just show a success message

        // Clear any existing timeout
        if (toastTimeoutRef.current) {
            clearTimeout(toastTimeoutRef.current);
        }

        toast({
            title: "Download Started",
            description: `Downloading "${tip.title}" as PDF...`,
            className: "bg-blue-50 border-blue-200 text-blue-800"
        });

        // Auto-hide toast after 3 seconds
        toastTimeoutRef.current = setTimeout(() => {
            // Toast will auto-dismiss
        }, 3000);
    };

    // Handler for downloading a patient resource
    const handleDownloadResource = (resourceId: string) => {
        setDownloadedResources(prev => ({
            ...prev,
            [resourceId]: true
        }));

        // Clear any existing timeout
        if (toastTimeoutRef.current) {
            clearTimeout(toastTimeoutRef.current);
        }

        toast({
            title: "Resource Downloaded",
            description: "Patient education resource has been downloaded",
            className: "bg-green-50 border-green-200 text-green-800"
        });

        // Auto-hide toast after 3 seconds
        toastTimeoutRef.current = setTimeout(() => {
            // Toast will auto-dismiss
        }, 3000);
    };

    // Get unique categories for filter dropdown
    const categories = Array.from(new Set(mockHealthTips.map(tip => tip.category)));

    // Filter health tips based on search term and category
    const filteredTips = mockHealthTips.filter(tip => {
        const matchesSearch = tip.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            tip.content.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = filterCategory === "all" || tip.category === filterCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-gray-900">Health Tips & Patient Education</h2>
                <p className="text-gray-600">Resources to help patients maintain and improve their health</p>
            </div>

            {/* Search and Filter Section */}
            <Card className="border-2 border-blue-200 bg-gradient-to-br from-white to-blue-50 shadow-md">
                <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <Input
                                placeholder="Search health tips or resources..."
                                className="pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-2">
                            <select
                                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                value={filterCategory}
                                onChange={(e) => setFilterCategory(e.target.value)}
                            >
                                <option value="all">All Categories</option>
                                {categories.map(category => (
                                    <option key={category} value={category}>{category}</option>
                                ))}
                            </select>
                            <Button
                                variant="outline"
                                className="border-gray-300 text-gray-700 hover:bg-gray-100"
                                onClick={() => {
                                    setSearchTerm("");
                                    setFilterCategory("all");
                                }}
                            >
                                <Filter className="h-4 w-4 mr-2" />
                                Clear
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Health Tips Section */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold text-gray-900 flex items-center">
                            <Heart className="h-5 w-5 text-red-500 mr-2" />
                            Health Tips
                        </h3>
                    </div>

                    {filteredTips.length === 0 ? (
                        <Card className="border-2 border-blue-200 bg-gradient-to-br from-white to-blue-50 shadow-md">
                            <CardContent className="py-12 text-center">
                                <Heart className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">No Health Tips Found</h3>
                                <p className="text-gray-600 mb-4">No health tips match your current search criteria</p>
                                <Button
                                    onClick={() => {
                                        setSearchTerm("");
                                        setFilterCategory("all");
                                    }}
                                    className="bg-blue-600 hover:bg-blue-700 text-white"
                                >
                                    <Filter className="h-4 w-4 mr-2" />
                                    Clear Filters
                                </Button>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="space-y-4">
                            {filteredTips.map((tip) => {
                                const IconComponent = tip.icon;
                                return (
                                    <Card
                                        key={tip.id}
                                        className="border-2 border-blue-200 bg-white shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer"
                                        onClick={() => setSelectedTip(tip)}
                                    >
                                        <CardContent className="p-0">
                                            {/* Desktop view */}
                                            <div className="hidden md:block p-6">
                                                <div className="flex items-start">
                                                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                                                        <IconComponent className="h-6 w-6 text-blue-600" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex items-center justify-between">
                                                            <h4 className="text-lg font-bold text-gray-900">{tip.title}</h4>
                                                            <Badge variant={tip.priority === "high" ? "destructive" : tip.priority === "medium" ? "secondary" : "default"}>
                                                                {tip.priority}
                                                            </Badge>
                                                        </div>
                                                        <p className="text-sm text-gray-500 mt-1">{tip.category}</p>
                                                        <p className="text-gray-700 mt-2">{tip.content}</p>
                                                        <div className="flex justify-end mt-4 space-x-2">
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleSaveTip(tip.id);
                                                                }}
                                                                className="border-blue-300 text-blue-700 hover:bg-blue-100"
                                                            >
                                                                {savedTips[tip.id] ? (
                                                                    <>
                                                                        <Check className="h-4 w-4 mr-1" />
                                                                        Saved
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <Save className="h-4 w-4 mr-1" />
                                                                        Save Tip
                                                                    </>
                                                                )}
                                                            </Button>
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleDownloadTip(tip);
                                                                }}
                                                                className="border-green-300 text-green-700 hover:bg-green-100"
                                                            >
                                                                <Download className="h-4 w-4 mr-1" />
                                                                Download
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Mobile view */}
                                            <div className="md:hidden p-4">
                                                <div className="flex items-start">
                                                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                                                        <IconComponent className="h-5 w-5 text-blue-600" />
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center justify-between">
                                                            <h4 className="font-bold text-gray-900">{tip.title}</h4>
                                                            <Badge variant={tip.priority === "high" ? "destructive" : tip.priority === "medium" ? "secondary" : "default"} className="text-xs">
                                                                {tip.priority}
                                                            </Badge>
                                                        </div>
                                                        <p className="text-xs text-gray-500 mt-1">{tip.category}</p>
                                                        <p className="text-sm text-gray-700 mt-2 line-clamp-2">{tip.content}</p>
                                                        <div className="flex justify-end mt-3 space-x-2">
                                                            <Button
                                                                variant="outline"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleSaveTip(tip.id);
                                                                }}
                                                                className="border-blue-300 text-blue-700 hover:bg-blue-100 text-xs h-7 px-2"
                                                            >
                                                                {savedTips[tip.id] ? (
                                                                    <>
                                                                        <Check className="h-3 w-3 mr-1" />
                                                                        Saved
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <Save className="h-3 w-3 mr-1" />
                                                                        Save
                                                                    </>
                                                                )}
                                                            </Button>
                                                            <Button
                                                                variant="outline"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleDownloadTip(tip);
                                                                }}
                                                                className="border-green-300 text-green-700 hover:bg-green-100 text-xs h-7 px-2"
                                                            >
                                                                <Download className="h-3 w-3 mr-1" />
                                                                DL
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Patient Education Section */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold text-gray-900 flex items-center">
                            <BookOpen className="h-5 w-5 text-green-500 mr-2" />
                            Patient Education
                        </h3>
                    </div>

                    <div className="space-y-4">
                        {mockPatientResources.map((resource) => {
                            const IconComponent = resource.icon;
                            return (
                                <Card
                                    key={resource.id}
                                    className="border-2 border-green-200 bg-white shadow-md hover:shadow-xl transition-all duration-300"
                                >
                                    <CardContent className="p-0">
                                        {/* Desktop view */}
                                        <div className="hidden md:block p-6">
                                            <div className="flex items-start">
                                                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mr-4">
                                                    <IconComponent className="h-6 w-6 text-green-600" />
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center justify-between">
                                                        <h4 className="text-lg font-bold text-gray-900">{resource.title}</h4>
                                                        <span className="text-sm text-gray-500">{resource.reads} reads</span>
                                                    </div>
                                                    <p className="text-sm text-gray-500 mt-1">{resource.category}</p>
                                                    <p className="text-gray-700 mt-2">{resource.description}</p>
                                                    <div className="flex space-x-2 mt-4">
                                                        <Button className="bg-green-600 hover:bg-green-700 text-white flex-1">
                                                            <FileText className="h-4 w-4 mr-2" />
                                                            View Resource
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleDownloadResource(resource.id);
                                                            }}
                                                            className="border-green-300 text-green-700 hover:bg-green-100"
                                                        >
                                                            {downloadedResources[resource.id] ? (
                                                                <Check className="h-4 w-4 text-green-600" />
                                                            ) : (
                                                                <Download className="h-4 w-4" />
                                                            )}
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Mobile view */}
                                        <div className="md:hidden p-4">
                                            <div className="flex items-start">
                                                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                                                    <IconComponent className="h-5 w-5 text-green-600" />
                                                </div>
                                                <div>
                                                    <div className="flex items-center justify-between">
                                                        <h4 className="font-bold text-gray-900">{resource.title}</h4>
                                                        <span className="text-xs text-gray-500">{resource.reads} reads</span>
                                                    </div>
                                                    <p className="text-xs text-gray-500 mt-1">{resource.category}</p>
                                                    <p className="text-sm text-gray-700 mt-2 line-clamp-2">{resource.description}</p>
                                                    <div className="flex space-x-2 mt-3">
                                                        <Button size="sm" className="flex-1 bg-green-600 hover:bg-green-700 text-white text-xs h-8">
                                                            <FileText className="h-3 w-3 mr-1" />
                                                            View
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleDownloadResource(resource.id);
                                                            }}
                                                            className="border-green-300 text-green-700 hover:bg-green-100 text-xs h-8"
                                                        >
                                                            {downloadedResources[resource.id] ? (
                                                                <Check className="h-3 w-3 text-green-600" />
                                                            ) : (
                                                                <Download className="h-3 w-3" />
                                                            )}
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Contact Information Section */}
            <Card className="border-2 border-purple-200 bg-gradient-to-br from-white to-purple-50 shadow-md">
                <CardHeader>
                    <CardTitle className="flex items-center text-purple-900">
                        <Phone className="h-5 w-5 mr-2" />
                        Contact Information
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="flex items-start">
                            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-100 flex items-center justify-center mr-3">
                                <Phone className="h-5 w-5 text-red-600" />
                            </div>
                            <div>
                                <h4 className="font-medium text-gray-900">Emergency Line</h4>
                                <p className="text-gray-700 mt-1">+1 (555) 123-4567</p>
                            </div>
                        </div>
                        <div className="flex items-start">
                            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                                <Mail className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                                <h4 className="font-medium text-gray-900">Email Support</h4>
                                <p className="text-gray-700 mt-1">support@sevamed.com</p>
                            </div>
                        </div>
                        <div className="flex items-start">
                            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                                <MapPin className="h-5 w-5 text-green-600" />
                            </div>
                            <div>
                                <h4 className="font-medium text-gray-900">Address</h4>
                                <p className="text-gray-700 mt-1">123 Healthcare Ave, Medical City, MC 12345</p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Detailed Tip Modal */}
            {selectedTip && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-bold text-gray-900">Health Tip Details</h3>
                                <Button
                                    variant="outline"
                                    onClick={() => setSelectedTip(null)}
                                    className="border-gray-300 text-gray-700 hover:bg-gray-100"
                                >
                                    Close
                                </Button>
                            </div>

                            <Card className="border-2 border-blue-200 bg-gradient-to-br from-white to-blue-50">
                                <CardContent className="p-6">
                                    <div className="flex items-center mb-4">
                                        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                                            {selectedTip.icon && <selectedTip.icon className="h-6 w-6 text-blue-600" />}
                                        </div>
                                        <div>
                                            <h4 className="text-xl font-bold text-gray-900">{selectedTip.title}</h4>
                                            <p className="text-gray-600">{selectedTip.category}</p>
                                        </div>
                                    </div>

                                    <div className="mt-4">
                                        <p className="text-gray-700 text-lg">{selectedTip.content}</p>
                                    </div>

                                    <div className="mt-6 pt-6 border-t border-blue-100">
                                        <h5 className="font-medium text-gray-900 mb-2">Additional Recommendations:</h5>
                                        <ul className="list-disc list-inside text-gray-700 space-y-1">
                                            <li>Consult with your healthcare provider before making significant lifestyle changes</li>
                                            <li>Track your progress to stay motivated</li>
                                            <li>Share this information with family members for mutual support</li>
                                        </ul>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// Badge component since it's used but not imported
const Badge = ({ children, variant, className = "" }: { children: React.ReactNode; variant: string; className?: string }) => {
    const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";

    const variantClasses = {
        default: "bg-gray-100 text-gray-800",
        secondary: "bg-yellow-100 text-yellow-800",
        destructive: "bg-red-100 text-red-800"
    };

    const classes = `${baseClasses} ${variantClasses[variant as keyof typeof variantClasses] || variantClasses.default} ${className}`;

    return <span className={classes}>{children}</span>;
};

// Import icons used in the contact section
import { Phone, Mail, MapPin } from "lucide-react";
