import { useEffect, useState, useCallback, useRef } from 'react';

interface NotificationData {
    id: string;
    type: string;
    message: string;
    patientName: string;
    tokenNumber: string;
    appointmentId: string;
    timestamp: Date;
    read: boolean;
}

const useNotifications = () => {
    const [notifications, setNotifications] = useState<NotificationData[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [ws, setWs] = useState<WebSocket | null>(null);
    const reconnectTimeoutRef = useRef<NodeJS.Timeout>();

    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    const userRole = userData.role;
    const userId = userData._id;

    const connect = useCallback(() => {
        const wsUrl = import.meta.env.VITE_WS_URL || 'ws://localhost:5000/ws';
        const socket = new WebSocket(wsUrl);

        socket.onopen = () => {
            console.log('Connected to WebSocket server');
            socket.send(JSON.stringify({
                type: 'auth',
                role: userRole,
                userId: userId
            }));
        };

        socket.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);

                // Only process if this notification targets current role
                if (data.targetRole === userRole || data.targetRole === 'all') {
                    const notification: NotificationData = {
                        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                        type: data.type,
                        message: data.message,
                        patientName: data.patientName || '',
                        tokenNumber: data.tokenNumber || '',
                        appointmentId: data.appointmentId || '',
                        timestamp: new Date(),
                        read: false
                    };

                    setNotifications(prev => [notification, ...prev].slice(0, 50));
                    setUnreadCount(prev => prev + 1);

                    // Play notification sound
                    const audio = new Audio('/notification.mp3');
                    audio.play().catch(() => {
                        // Fallback: programmatic beep if sound file missing
                        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
                        const osc = ctx.createOscillator();
                        const gain = ctx.createGain();
                        osc.connect(gain);
                        gain.connect(ctx.destination);
                        osc.frequency.value = 800;
                        gain.gain.value = 0.05;
                        osc.start();
                        setTimeout(() => osc.stop(), 150);
                    });

                    // Show browser notification if permission granted
                    if (Notification.permission === 'granted') {
                        new Notification('SevaOnline HMS', {
                            body: data.message,
                            icon: '/logo.png'
                        });
                    }
                }
            } catch (err) {
                console.error('Error processing notification:', err);
            }
        };

        socket.onclose = () => {
            console.log('WebSocket disconnected. Reconnecting...');
            reconnectTimeoutRef.current = setTimeout(connect, 3000);
        };

        setWs(socket);
    }, [userRole, userId]);

    useEffect(() => {
        connect();

        // Request browser notification permission
        if (Notification.permission === 'default') {
            Notification.requestPermission();
        }

        return () => {
            if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
            if (ws) ws.close();
        };
    }, [connect]);

    const markAllRead = useCallback(() => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        setUnreadCount(0);
    }, []);

    const markRead = useCallback((id: string) => {
        setNotifications(prev => {
            const index = prev.findIndex(n => n.id === id);
            if (index !== -1 && !prev[index].read) {
                const newList = [...prev];
                newList[index] = { ...newList[index], read: true };
                setUnreadCount(count => Math.max(0, count - 1));
                return newList;
            }
            return prev;
        });
    }, []);

    return { notifications, unreadCount, markAllRead, markRead, ws };
};

export default useNotifications;
