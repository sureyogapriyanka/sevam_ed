import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { activityLogService } from "../../services/api";
import {
    Calendar,
    Clock,
    User,
    Heart,
    FileText,
    MessageSquare,
    Calendar as CalendarIcon,
    Stethoscope,
    Pill
} from "lucide-react";

interface Activity {
    id: string;
    userId: string;
    action: string;
    details?: string;
    timestamp: string;
}

export default function ActivityLog() {
    const queryClient = useQueryClient();
    const [timeRange, setTimeRange] = useState<"today" | "week" | "month">("today");

    const { data: activities = [], isLoading } = useQuery<Activity[]>({
        queryKey: ["activity-logs", timeRange],
        queryFn: async () => {
            const { data } = await activityLogService.getAll({ range: timeRange });
            return data || [];
        }
    });

    const clearLogsMutation = useMutation({
        mutationFn: async () => {
            const { data } = await activityLogService.clear();
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["activity-logs"] });
        }
    });

    const getActionIcon = (action: string) => {
        switch (action) {
            case "login":
                return <User className="h-4 w-4" />;
            case "logout":
                return <User className="h-4 w-4" />;
            case "dashboard_visit":
                return <Heart className="h-4 w-4" />;
            case "view_appointment":
                return <CalendarIcon className="h-4 w-4" />;
            case "book_appointment":
                return <Calendar className="h-4 w-4" />;
            case "chat_message":
                return <MessageSquare className="h-4 w-4" />;
            case "view_medical_record":
                return <FileText className="h-4 w-4" />;
            case "update_profile":
                return <User className="h-4 w-4" />;
            case "view_prescription":
                return <Pill className="h-4 w-4" />;
            default:
                return <Stethoscope className="h-4 w-4" />;
        }
    };

    const getActionColor = (action: string) => {
        switch (action) {
            case "login":
                return "bg-blue-100 text-blue-800";
            case "logout":
                return "bg-red-100 text-red-800";
            case "dashboard_visit":
                return "bg-green-100 text-green-800";
            case "view_appointment":
            case "book_appointment":
                return "bg-purple-100 text-purple-800";
            case "chat_message":
                return "bg-yellow-100 text-yellow-800";
            case "view_medical_record":
            case "view_prescription":
                return "bg-red-100 text-red-800";
            case "update_profile":
                return "bg-indigo-100 text-indigo-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    const filteredActivities = activities.filter(activity => {
        const activityDate = new Date(activity.timestamp);
        const now = new Date();

        switch (timeRange) {
            case "today":
                return activityDate.toDateString() === now.toDateString();
            case "week":
                const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                return activityDate >= weekAgo;
            case "month":
                const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                return activityDate >= monthAgo;
            default:
                return true;
        }
    });

    return (
        <Card className="h-full flex flex-col border-2 border-blue-300 bg-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-blue-50">
                <CardTitle className="text-sm font-medium text-blue-900">Activity Log</CardTitle>
                <div className="flex space-x-2">
                    <Button
                        variant={timeRange === "today" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setTimeRange("today")}
                        className={`h-8 text-xs ${timeRange === "today" ? "bg-blue-600 hover:bg-blue-700" : "border-blue-300 text-blue-700 hover:bg-blue-100"}`}
                    >
                        Today
                    </Button>
                    <Button
                        variant={timeRange === "week" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setTimeRange("week")}
                        className={`h-8 text-xs ${timeRange === "week" ? "bg-blue-600 hover:bg-blue-700" : "border-blue-300 text-blue-700 hover:bg-blue-100"}`}
                    >
                        Week
                    </Button>
                    <Button
                        variant={timeRange === "month" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setTimeRange("month")}
                        className={`h-8 text-xs ${timeRange === "month" ? "bg-blue-600 hover:bg-blue-700" : "border-blue-300 text-blue-700 hover:bg-blue-100"}`}
                    >
                        Month
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="flex-1 p-0">
                {isLoading ? (
                    <div className="p-4 text-center">
                        <div className="animate-pulse space-y-3">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="h-12 bg-blue-100 rounded"></div>
                            ))}
                        </div>
                    </div>
                ) : filteredActivities.length === 0 ? (
                    <div className="p-6 text-center">
                        <Clock className="h-8 w-8 mx-auto text-blue-400 mb-2" />
                        <p className="text-sm text-blue-700">No activities recorded</p>
                    </div>
                ) : (
                    <ScrollArea className="h-[300px] p-4">
                        <div className="space-y-3">
                            {filteredActivities.map((activity) => (
                                <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-blue-50 border border-blue-100">
                                    <div className={`p-2 rounded-full ${getActionColor(activity.action)}`}>
                                        {getActionIcon(activity.action)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-blue-900 truncate">{activity.action.replace('_', ' ')}</p>
                                        {activity.details && (
                                            <p className="text-xs text-blue-700 truncate">{activity.details}</p>
                                        )}
                                        <p className="text-xs text-blue-600 mt-1">
                                            {new Date(activity.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                )}
            </CardContent>
        </Card>
    );
}
