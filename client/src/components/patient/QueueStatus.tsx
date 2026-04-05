import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import {
    Users,
    Clock,
    RefreshCw,
    CheckCircle,
    AlertCircle
} from "lucide-react";

interface QueueEntry {
    id: string;
    position: number;
    estimatedWaitTime: number;
    status: string;
    priority: string;
    doctor: string;
    department: string;
}

export default function QueueStatus() {
    const { patient } = useAuth();
    const [queueEntries, setQueueEntries] = useState<QueueEntry[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    // Mock data for queue entries
    // In a real app, this would come from an API
    useEffect(() => {
        // Simulate loading
        setIsLoading(true);
        setTimeout(() => {
            setQueueEntries([
                {
                    id: "1",
                    position: 3,
                    estimatedWaitTime: 45,
                    status: "waiting",
                    priority: "normal",
                    doctor: "Dr. Sharma",
                    department: "General Medicine"
                },
                {
                    id: "2",
                    position: 1,
                    estimatedWaitTime: 15,
                    status: "in-consultation",
                    priority: "urgent",
                    doctor: "Dr. Patel",
                    department: "Cardiology"
                }
            ]);
            setIsLoading(false);
        }, 1000);
    }, []);

    const handleRefresh = () => {
        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
        }, 500);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-blue-900">My Queue Status</h2>
                <Button
                    variant="outline"
                    onClick={handleRefresh}
                    disabled={isLoading}
                    className="flex items-center border-blue-300 text-blue-700 hover:bg-blue-100"
                >
                    <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''} text-blue-600`} />
                    <span className="text-blue-700">Refresh</span>
                </Button>
            </div>

            {queueEntries.length === 0 ? (
                <Card className="border-blue-200 bg-white">
                    <CardContent className="p-8 text-center">
                        <Users className="h-12 w-12 mx-auto text-blue-400 mb-4" />
                        <h3 className="text-lg font-medium text-blue-900 mb-2">No Active Appointments</h3>
                        <p className="text-blue-700 mb-4">
                            You don't have any appointments in the queue right now.
                        </p>
                        <Button className="bg-blue-600 hover:bg-blue-700">Book an Appointment</Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-4">
                    {queueEntries.map((entry) => (
                        <Card key={entry.id} className="border-2 border-blue-300 hover:shadow-md transition-shadow bg-white">
                            <CardHeader className="pb-3 bg-blue-50">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <CardTitle className="flex items-center space-x-2 text-blue-900">
                                            <Users className="h-5 w-5 text-blue-600" />
                                            <span>{entry.department}</span>
                                        </CardTitle>
                                        <p className="text-sm text-blue-700 mt-1">
                                            With {entry.doctor}
                                        </p>
                                    </div>
                                    <Badge
                                        variant={entry.priority === "urgent" ? "destructive" : "secondary"}
                                        className={entry.priority === "urgent" ? "bg-red-500" : "bg-blue-100 text-blue-800"}
                                    >
                                        {entry.priority}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-4">
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center text-sm">
                                            <span className="font-medium text-blue-800">Position:</span>
                                            <span className="ml-2 text-blue-600">#{entry.position}</span>
                                        </div>
                                        <div className="flex items-center text-sm">
                                            <Clock className="h-4 w-4 mr-1 text-blue-500" />
                                            <span className="text-blue-600">
                                                {entry.estimatedWaitTime} min wait
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            {entry.status === "in-consultation" ? (
                                                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                                            ) : (
                                                <AlertCircle className="h-4 w-4 text-amber-500 mr-2" />
                                            )}
                                            <span className="text-sm font-medium capitalize text-blue-800">
                                                {entry.status.replace('-', ' ')}
                                            </span>
                                        </div>
                                        <Button variant="outline" size="sm" className="border-blue-300 text-blue-700 hover:bg-blue-100">
                                            View Details
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
