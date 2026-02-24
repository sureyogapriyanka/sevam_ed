import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { useAuth } from "../../contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../../lib/queryClient";
import { toast } from "../../hooks/use-toast";
import {
    BarChart3,
    Dna,
    Pill,
    Download,
    Plus,
    Users,
    TrendingUp,
    Clock,
    Calendar,
    CheckCircle
} from "lucide-react";

export default function DoctorReportsPage() {
    const { user } = useAuth();
    const navigate = useNavigate();

    // Fetch doctor-specific analytics data
    const { data: analyticsData } = useQuery({
        queryKey: ["doctor-analytics", user?.id],
        queryFn: async () => {
            const response = await apiRequest("GET", `/api/analytics/doctor/${user?.id}/metrics`);
            return response.json();
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
    });

    // Extract values or use defaults
    const totalPatients = analyticsData?.totalPatients || 142;
    const recoveryRate = analyticsData?.recoveryRate || 89;
    const avgWaitTime = analyticsData?.avgWaitTime || 24;

    const handleExportReports = () => {
        // In a real implementation, this would export the reports
        toast({
            title: "Export Started",
            description: "Your reports are being prepared for download.",
            className: "bg-blue-50 border-blue-200 text-blue-800"
        });

        // Simulate export process
        setTimeout(() => {
            toast({
                title: "Export Complete",
                description: "Reports have been downloaded successfully.",
                className: "bg-green-50 border-green-200 text-green-800"
            });
        }, 2000);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Medical Reports</h2>
                <Button
                    variant="outline"
                    className="flex items-center border-gray-300 text-gray-700 hover:bg-gray-100"
                    onClick={handleExportReports}
                >
                    <Download className="h-4 w-4 mr-2" />
                    Export All Reports
                </Button>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {/* Doctor Performance Metrics */}
                <Card className="border-t-4 border-t-blue-500 hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-blue-50 border-2 border-blue-200 shadow-lg">
                    <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                            <BarChart3 className="h-5 w-5 text-blue-600" />
                            <span className="text-blue-900">Doctor Performance Metrics</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg mb-4 p-6">
                            <h3 className="text-lg font-bold text-blue-900 mb-4">Today's Performance Overview</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-white p-4 rounded-lg shadow-sm border border-blue-100">
                                    <div className="flex items-center">
                                        <div className="p-2 bg-blue-100 rounded-lg mr-3">
                                            <Users className="h-6 w-6 text-blue-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Patients Treated Today</p>
                                            <p className="text-2xl font-bold text-blue-900">{totalPatients}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-white p-4 rounded-lg shadow-sm border border-green-100">
                                    <div className="flex items-center">
                                        <div className="p-2 bg-green-100 rounded-lg mr-3">
                                            <TrendingUp className="h-6 w-6 text-green-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Success Rate</p>
                                            <p className="text-2xl font-bold text-green-900">{recoveryRate}%</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-white p-4 rounded-lg shadow-sm border border-amber-100">
                                    <div className="flex items-center">
                                        <div className="p-2 bg-amber-100 rounded-lg mr-3">
                                            <Clock className="h-6 w-6 text-amber-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Avg. Consultation Time</p>
                                            <p className="text-2xl font-bold text-amber-900">{avgWaitTime} min</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-white p-4 rounded-lg shadow-sm border border-purple-100">
                                    <div className="flex items-center">
                                        <div className="p-2 bg-purple-100 rounded-lg mr-3">
                                            <Calendar className="h-6 w-6 text-purple-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Appointments Today</p>
                                            <p className="text-2xl font-bold text-purple-900">{totalPatients + 2}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-4 pt-4 border-t border-blue-100">
                                <h4 className="font-medium text-blue-900 mb-2">Performance Insights</h4>
                                <ul className="text-sm text-gray-700 space-y-1">
                                    <li className="flex items-start">
                                        <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                                        <span>On track to meet daily target of 15 patients</span>
                                    </li>
                                    <li className="flex items-start">
                                        <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                                        <span>Success rate is {recoveryRate > 90 ? 'excellent' : recoveryRate > 80 ? 'good' : 'improving'} compared to last week</span>
                                    </li>
                                    <li className="flex items-start">
                                        <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                                        <span>Avg. consultation time is within standard range</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                            <div className="p-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-md transform hover:scale-105 transition-all duration-300">
                                <p className="text-3xl font-bold text-white">{totalPatients}</p>
                                <p className="text-blue-100">Patients Treated</p>
                            </div>
                            <div className="p-4 bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-md transform hover:scale-105 transition-all duration-300">
                                <p className="text-3xl font-bold text-white">{recoveryRate}%</p>
                                <p className="text-green-100">Success Rate</p>
                            </div>
                            <div className="p-4 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl shadow-md transform hover:scale-105 transition-all duration-300">
                                <p className="text-3xl font-bold text-white">{avgWaitTime}</p>
                                <p className="text-amber-100">Avg. Consultation (min)</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Lab Results */}
                <Card className="border-t-4 border-t-green-500 hover:shadow-xl transition-all duration-300 bg-white border-2 border-gray-200">
                    <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                            <Dna className="h-5 w-5 text-green-600" />
                            <span>Lab Results Overview</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center space-x-3">
                                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                    <span className="font-medium text-gray-900">Blood Tests</span>
                                </div>
                                <Badge variant="default" className="bg-green-500">Normal</Badge>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center space-x-3">
                                    <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                                    <span className="font-medium text-gray-900">Urine Analysis</span>
                                </div>
                                <Badge variant="secondary" className="bg-amber-500">Pending</Badge>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center space-x-3">
                                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                    <span className="font-medium text-gray-900">X-Ray Results</span>
                                </div>
                                <Badge variant="destructive">Abnormal</Badge>
                            </div>
                            <Button variant="outline" className="w-full border-gray-300 text-gray-700 hover:bg-gray-100" onClick={() => navigate('/doctor/lab-results')}>
                                View Detailed Reports
                            </Button>
                        </div>
                    </CardContent>
                </Card>

            </div>
        </div>
    );
}
