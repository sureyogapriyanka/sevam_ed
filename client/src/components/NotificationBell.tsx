import React, { useState, useRef, useEffect } from 'react';
import { Bell, CheckCircle2, FlaskConical, Stethoscope, CreditCard, Clock } from 'lucide-react';
import useNotifications from '../hooks/useNotifications';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { cn } from '../lib/utils';
import { formatDistanceToNow } from 'date-fns';

const NotificationBell: React.FC = () => {
    const { notifications, unreadCount, markRead, markAllRead } = useNotifications();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const getIcon = (type: string) => {
        switch (type) {
            case 'patient_checkin': return <Hospital className="h-4 w-4 text-blue-500" />;
            case 'vitals_complete': return <Activity className="h-4 w-4 text-green-500" />;
            case 'consultation_started': return <Stethoscope className="h-4 w-4 text-purple-500" />;
            case 'consultation_complete': return <FileText className="h-4 w-4 text-orange-500" />;
            case 'payment_complete': return <CreditCard className="h-4 w-4 text-emerald-500" />;
            default: return <Bell className="h-4 w-4 text-slate-400" />;
        }
    };

    const handleNotificationClick = (n: any) => {
        markRead(n.id);
        setIsOpen(false);

        switch (n.type) {
            case 'patient_checkin': navigate('/nurse/dashboard'); break;
            case 'vitals_complete': navigate('/doctor/dashboard'); break;
            case 'consultation_complete': navigate('/receptionist/dashboard'); break;
            case 'payment_complete': navigate('/pharmacist/dashboard'); break;
            default: break;
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <Button
                variant="ghost"
                size="icon"
                className="relative"
                onClick={() => setIsOpen(!isOpen)}
            >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                    <Badge className="absolute -top-1 -right-1 px-1.5 py-0.5 text-[10px] bg-red-600 animate-pulse">
                        {unreadCount}
                    </Badge>
                )}
            </Button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-lg shadow-xl z-50 overflow-hidden">
                    <div className="p-3 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                        <span className="font-bold text-sm text-slate-800">Notifications</span>
                        <Button variant="link" size="sm" className="h-auto p-0 text-blue-600 font-semibold text-xs" onClick={markAllRead}>
                            Mark all as read
                        </Button>
                    </div>

                    <div className="max-h-[400px] overflow-y-auto">
                        {notifications.length === 0 ? (
                            <div className="p-8 text-center text-slate-400">
                                <Bell className="h-8 w-8 mx-auto mb-2 opacity-20" />
                                <p className="text-sm">No new notifications</p>
                            </div>
                        ) : (
                            notifications.map((n) => (
                                <div
                                    key={n.id}
                                    className={cn(
                                        "p-3 border-b border-slate-50 hover:bg-slate-50 cursor-pointer transition-colors flex gap-3",
                                        !n.read && "bg-blue-50/30 font-medium"
                                    )}
                                    onClick={() => handleNotificationClick(n)}
                                >
                                    <div className="mt-1">{getIcon(n.type)}</div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start">
                                            <p className="text-xs text-slate-900 leading-tight mb-1">{n.message}</p>
                                            {!n.read && <div className="h-2 w-2 bg-blue-600 rounded-full mt-1 shrink-0" />}
                                        </div>
                                        <div className="flex items-center gap-2 text-[10px] text-slate-500 font-normal">
                                            {n.tokenNumber && <span className="bg-slate-200 px-1 rounded font-bold text-slate-700">{n.tokenNumber}</span>}
                                            <span>{formatDistanceToNow(n.timestamp)} ago</span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    <div className="p-2 border-t border-slate-100 text-center bg-slate-50">
                        <Button variant="ghost" size="sm" className="w-full text-xs text-slate-600" onClick={() => navigate('/notifications')}>
                            View all notifications
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};

// Mock icons for imports not available
const Hospital = Bell;
const Activity = Stethoscope;
const FileText = Stethoscope;

export default NotificationBell;
