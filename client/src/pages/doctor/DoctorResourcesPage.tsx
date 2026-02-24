import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { useNavigate } from "react-router-dom";
import {
    Heart,
    BookOpen,
    Phone,
    Mail,
    MapPin,
    BarChart3,
    Thermometer,
    Scale,
    Pill,
    Dna,
    Download
} from "lucide-react";

export default function DoctorResourcesPage() {
    const navigate = useNavigate();

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Patient Resources</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Health Tips Card */}
                <Card className="border-t-4 border-t-green-500 hover:shadow-xl transition-all duration-300 bg-white border-2 border-gray-200">
                    <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                            <Heart className="h-5 w-5 text-green-600" />
                            <span>Health Tips</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="p-3 bg-green-50 rounded-lg border border-green-100">
                                <h4 className="font-medium text-green-900">Stay Hydrated</h4>
                                <p className="text-sm text-green-700">Drink at least 8 glasses of water daily for optimal health.</p>
                            </div>
                            <div className="p-3 bg-green-50 rounded-lg border border-green-100">
                                <h4 className="font-medium text-green-900">Regular Exercise</h4>
                                <p className="text-sm text-green-700">Aim for 30 minutes of moderate exercise 5 times a week.</p>
                            </div>
                            <Button
                                variant="outline"
                                className="w-full border-green-300 text-green-700 hover:bg-green-100"
                                onClick={() => navigate("/doctor/health-tips")}
                            >
                                View All Tips
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Patient Education Card */}
                <Card className="border-t-4 border-t-blue-500 hover:shadow-xl transition-all duration-300 bg-white border-2 border-gray-200">
                    <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                            <BookOpen className="h-5 w-5 text-blue-600" />
                            <span>Patient Education</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                                <h4 className="font-medium text-blue-900">Understanding Blood Pressure</h4>
                                <p className="text-sm text-blue-700">Learn about normal ranges and management techniques.</p>
                            </div>
                            <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                                <h4 className="font-medium text-blue-900">Diabetes Management</h4>
                                <p className="text-sm text-blue-700">Essential guidelines for controlling blood sugar levels.</p>
                            </div>
                            <Button
                                variant="outline"
                                className="w-full border-blue-300 text-blue-700 hover:bg-blue-100"
                                onClick={() => navigate("/doctor/health-tips")}
                            >
                                Browse Resources
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Contact Information Card */}
                <Card className="border-t-4 border-t-purple-500 hover:shadow-xl transition-all duration-300 bg-white border-2 border-gray-200">
                    <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                            <Phone className="h-5 w-5 text-purple-600" />
                            <span>Contact Information</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-start space-x-3">
                                <Phone className="h-4 w-4 text-purple-600 mt-1" />
                                <div>
                                    <p className="text-sm font-medium text-gray-900">Emergency Line</p>
                                    <p className="text-sm text-gray-600">+1 (555) 123-4567</p>
                                </div>
                            </div>
                            <div className="flex items-start space-x-3">
                                <Mail className="h-4 w-4 text-purple-600 mt-1" />
                                <div>
                                    <p className="text-sm font-medium text-gray-900">Email Support</p>
                                    <p className="text-sm text-gray-600">support@sevamed.com</p>
                                </div>
                            </div>
                            <div className="flex items-start space-x-3">
                                <MapPin className="h-4 w-4 text-purple-600 mt-1" />
                                <div>
                                    <p className="text-sm font-medium text-gray-900">Address</p>
                                    <p className="text-sm text-gray-600">123 Healthcare Ave, Medical City, MC 12345</p>
                                </div>
                            </div>
                            <Button variant="outline" className="w-full border-purple-300 text-purple-700 hover:bg-purple-100">
                                <Download className="h-4 w-4 mr-2" />
                                Download Brochure
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Patient Statistics Card */}
                <Card className="border-t-4 border-t-amber-500 hover:shadow-xl transition-all duration-300 bg-white border-2 border-gray-200 md:col-span-2 lg:col-span-3">
                    <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                            <BarChart3 className="h-5 w-5 text-amber-600" />
                            <span>Patient Health Statistics</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="p-4 bg-amber-50 rounded-lg border border-amber-100 text-center">
                                <Thermometer className="h-8 w-8 text-amber-600 mx-auto mb-2" />
                                <p className="text-2xl font-bold text-amber-900">98.6°F</p>
                                <p className="text-sm text-amber-700">Avg. Temp</p>
                            </div>
                            <div className="p-4 bg-amber-50 rounded-lg border border-amber-100 text-center">
                                <Scale className="h-8 w-8 text-amber-600 mx-auto mb-2" />
                                <p className="text-2xl font-bold text-amber-900">165 lbs</p>
                                <p className="text-sm text-amber-700">Avg. Weight</p>
                            </div>
                            <div className="p-4 bg-amber-50 rounded-lg border border-amber-100 text-center">
                                <Heart className="h-8 w-8 text-amber-600 mx-auto mb-2" />
                                <p className="text-2xl font-bold text-amber-900">72 bpm</p>
                                <p className="text-sm text-amber-700">Avg. Heart Rate</p>
                            </div>
                            <div className="p-4 bg-amber-50 rounded-lg border border-amber-100 text-center">
                                <Pill className="h-8 w-8 text-amber-600 mx-auto mb-2" />
                                <p className="text-2xl font-bold text-amber-900">3.2</p>
                                <p className="text-sm text-amber-700">Medications</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
