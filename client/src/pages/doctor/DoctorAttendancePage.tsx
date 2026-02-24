import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "../../lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { toast } from "../../hooks/use-toast";
import {
    UserCheck,
    Clock,
    Calendar,
    TrendingUp,
    CheckCircle,
    XCircle,
    RotateCcw,
    Filter,
    Search
} from "lucide-react";
import { Attendance } from "../../types/schema";

export default function DoctorAttendancePage() {
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const [filterStatus, setFilterStatus] = useState<string>("all");
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [currentPage, setCurrentPage] = useState<number>(1);
    const itemsPerPage = 10;

    // Fetch attendance history
    const { data: attendanceHistory = [], isLoading, isError } = useQuery<Attendance[]>({
        queryKey: ["/api/attendance/user", user?.id],
        queryFn: async () => {
            const response = await apiRequest("GET", `/api/attendance/user/${user?.id}`);
            return response.json();
        },
        enabled: !!user?.id
    });

    // Update attendance mutation
    const updateAttendanceMutation = useMutation({
        mutationFn: async (status: string) => {
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const existingAttendance = (attendanceHistory as Attendance[]).find((att: Attendance) => {
                const attDate = new Date(att.date);
                attDate.setHours(0, 0, 0, 0);
                return attDate.getTime() === today.getTime();
            });

            if (existingAttendance) {
                return apiRequest("PUT", `/api/attendance/${existingAttendance.id}`, {
                    status,
                    location: status
                });
            } else {
                return apiRequest("POST", "/api/attendance", {
                    userId: user?.id,
                    date: new Date(),
                    status: "present",
                    location: status,
                    checkIn: new Date()
                });
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/attendance/user", user?.id] });
            toast({
                title: "Success",
                description: "Attendance status updated successfully"
            });
        },
        onError: () => {
            toast({
                title: "Error",
                description: "Failed to update attendance status",
                variant: "destructive"
            });
        }
    });

    // Filter and search attendance records
    const filteredAttendance = (attendanceHistory as Attendance[]).filter((attendance: Attendance) => {
        const matchesFilter = filterStatus === "all" || attendance.status === filterStatus;
        const matchesSearch = searchTerm === "" ||
            new Date(attendance.date).toLocaleDateString().toLowerCase().includes(searchTerm.toLowerCase()) ||
            (attendance.location || "").toLowerCase().includes(searchTerm.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    // Pagination
    const totalPages = Math.ceil(filteredAttendance.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedAttendance = filteredAttendance.slice(startIndex, startIndex + itemsPerPage);

    // Reset to first page when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [filterStatus, searchTerm]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                <div className="flex flex-col items-center">
                    <XCircle className="h-12 w-12 text-red-500 mb-4" />
                    <h3 className="text-lg font-medium text-red-800 mb-2">Error Loading Data</h3>
                    <p className="text-red-600 mb-4">There was an issue loading the attendance history.</p>
                    <Button
                        variant="outline"
                        onClick={() => queryClient.invalidateQueries({ queryKey: ["/api/attendance/user", user?.id] })}
                        className="border-red-300 text-red-700 hover:bg-red-100"
                    >
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Retry
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Attendance Management</h1>
                <p className="text-gray-600">Track your work status and attendance history</p>
            </div>

            {/* Current Status Card */}
            <Card className="border-t-4 border-t-green-500 hover:shadow-xl transition-all duration-300 bg-white border-2 border-gray-200">
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <UserCheck className="h-5 w-5 text-green-600" />
                            <span>Current Work Status</span>
                        </div>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h3 className="font-medium text-gray-900 mb-3">Update Status</h3>
                            <div className="grid grid-cols-2 gap-3">
                                <Button
                                    variant="outline"
                                    className="border-green-300 text-green-700 hover:bg-green-100"
                                    onClick={() => updateAttendanceMutation.mutate("consulting")}
                                    disabled={updateAttendanceMutation.isPending}
                                >
                                    Consulting
                                </Button>
                                <Button
                                    variant="outline"
                                    className="border-green-300 text-green-700 hover:bg-green-100"
                                    onClick={() => updateAttendanceMutation.mutate("resting")}
                                    disabled={updateAttendanceMutation.isPending}
                                >
                                    Resting
                                </Button>
                                <Button
                                    variant="outline"
                                    className="border-green-300 text-green-700 hover:bg-green-100"
                                    onClick={() => updateAttendanceMutation.mutate("lunch")}
                                    disabled={updateAttendanceMutation.isPending}
                                >
                                    Lunch
                                </Button>
                                <Button
                                    variant="outline"
                                    className="border-green-300 text-green-700 hover:bg-green-100"
                                    onClick={() => updateAttendanceMutation.mutate("lab")}
                                    disabled={updateAttendanceMutation.isPending}
                                >
                                    Lab
                                </Button>
                            </div>
                        </div>

                        <div>
                            <h3 className="font-medium text-gray-900 mb-3">Today's Information</h3>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-foreground">Current Status</span>
                                    <Badge className="bg-green-500 text-white">
                                        {attendanceHistory.length > 0 ?
                                            (attendanceHistory[0].location || "Consulting") :
                                            "Consulting"}
                                    </Badge>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-foreground">Check-in Time</span>
                                    <span className="text-sm text-muted-foreground">
                                        {attendanceHistory.length > 0 ?
                                            new Date(attendanceHistory[0].checkIn || new Date()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) :
                                            "N/A"}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-foreground">Shift Progress</span>
                                    <span className="text-sm text-muted-foreground">45%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Attendance History */}
            <Card className="border-t-4 border-t-blue-500 hover:shadow-xl transition-all duration-300 bg-white border-2 border-gray-200">
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <Calendar className="h-5 w-5 text-blue-600" />
                            <span>Attendance History</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                <input
                                    type="text"
                                    placeholder="Search by date or status..."
                                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <select
                                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                            >
                                <option value="all">All Statuses</option>
                                <option value="present">Present</option>
                                <option value="absent">Absent</option>
                                <option value="late">Late</option>
                                <option value="on-break">On Break</option>
                            </select>
                        </div>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {paginatedAttendance.length === 0 ? (
                        <div className="text-center py-8">
                            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No Attendance Records Found</h3>
                            <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {paginatedAttendance.map((attendance: Attendance) => (
                                <div key={attendance.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                                    <div className="flex items-center space-x-4">
                                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                                            <Calendar className="h-5 w-5 text-blue-600" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">
                                                {new Date(attendance.date).toLocaleDateString('en-US', {
                                                    weekday: 'long',
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                Check-in: {attendance.checkIn ?
                                                    new Date(attendance.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) :
                                                    "N/A"}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-4">
                                        <div className="text-right">
                                            <p className="text-sm font-medium text-gray-900">
                                                {attendance.totalHours || "N/A"} hours
                                            </p>
                                            <p className="text-sm text-gray-600 capitalize">
                                                {attendance.location || "N/A"}
                                            </p>
                                        </div>
                                        <Badge
                                            variant={
                                                attendance.status === "present" ? "default" :
                                                    attendance.status === "absent" ? "destructive" :
                                                        "secondary"
                                            }
                                        >
                                            {attendance.status}
                                        </Badge>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-between mt-6">
                            <div className="text-sm text-gray-700">
                                Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredAttendance.length)} of {filteredAttendance.length} records
                            </div>
                            <div className="flex space-x-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                >
                                    Previous
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                    disabled={currentPage === totalPages}
                                >
                                    Next
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
