import { useState, useEffect } from "react";
import { useWebSocket } from "../../hooks/useWebSocket";
import { useAuth } from "../../contexts/AuthContext";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Bell, X, AlertCircle } from "lucide-react";

export default function NotificationPanel() {
    const { notifications } = useWebSocket();
    const { user } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        setUnreadCount(notifications.length);
    }, [notifications]);

    const clearNotifications = () => {
        // In a real app, this would mark notifications as read on the server
        setUnreadCount(0);
    };

    if (!user) return null;

    return (
        <div className="relative">
            <Button
                variant="ghost"
                size="sm"
                className="relative"
                onClick={() => setIsOpen(!isOpen)}
            >
                <Bell className="h-4 w-4" />
                {unreadCount > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs">
                        {unreadCount}
                    </Badge>
                )}
            </Button>

            {isOpen && (
                <Card className="absolute right-0 mt-2 w-80 z-50 shadow-lg border-2 border-blue-500/30 bg-gradient-to-br from-gray-800 to-gray-900 backdrop-blur-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 border-b">
                        <CardTitle className="text-lg font-medium">Notifications</CardTitle>
                        <div className="flex space-x-2">
                            {unreadCount > 0 && (
                                <Button variant="ghost" size="sm" onClick={clearNotifications}>
                                    Mark all as read
                                </Button>
                            )}
                            <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0 max-h-96 overflow-y-auto">
                        {notifications.length === 0 ? (
                            <div className="p-6 text-center">
                                <Bell className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                                <p className="text-muted-foreground">No notifications</p>
                            </div>
                        ) : (
                            <div className="divide-y">
                                {notifications.map((notification, index) => (
                                    <div key={index} className="p-4 hover:bg-muted/50">
                                        <div className="flex justify-between">
                                            <div className="flex items-start space-x-3">
                                                <AlertCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                                                <div>
                                                    <p className="text-sm font-medium text-foreground">
                                                        {notification.senderName}
                                                    </p>
                                                    <p className="text-sm text-muted-foreground">
                                                        {notification.content}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground mt-1">
                                                        {new Date(notification.timestamp).toLocaleString()}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
