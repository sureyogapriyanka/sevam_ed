import { useState, useEffect, useRef, useCallback } from "react";
import { useAuth } from "../contexts/AuthContext";

interface WebSocketMessage {
  type: string;
  [key: string]: any;
}

interface WebSocketChatMessage {
  id?: string;
  senderId: string;
  receiverId: string;
  content: string;
  createdAt?: string;
  messageType?: string;
  readStatus?: 'sent' | 'delivered' | 'read';
}

interface AdminBroadcastMessage {
  type: 'admin_broadcast';
  senderId: string;
  senderName: string;
  content: string;
  recipients: string[];
  timestamp: string;
}

export function useWebSocket() {
  const { user } = useAuth();
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<WebSocketChatMessage[]>([]);
  const [notifications, setNotifications] = useState<AdminBroadcastMessage[]>([]);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  const connect = useCallback(() => {
    if (!user || wsRef.current?.readyState === WebSocket.OPEN) return;

    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws`;

    try {
      wsRef.current = new WebSocket(wsUrl);

      wsRef.current.onopen = () => {
        setIsConnected(true);
        // Authenticate with the WebSocket server
        wsRef.current?.send(JSON.stringify({
          type: 'auth',
          userId: user.id,
          role: user.role
        }));
      };

      wsRef.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'new_message') {
            // Add timestamp and ID if not present
            const messageWithMetadata = {
              ...data.message,
              id: data.message.id || Date.now().toString(),
              createdAt: data.message.createdAt || new Date().toISOString(),
              readStatus: data.message.readStatus || 'delivered'
            } as WebSocketChatMessage;

            setMessages(prev => [...prev, messageWithMetadata]);
          } else if (data.type === 'message_delivered') {
            // Update message status to delivered
            setMessages(prev => prev.map(msg =>
              msg.id === data.messageId ? { ...msg, readStatus: 'delivered' } : msg
            ));
          } else if (data.type === 'message_read') {
            // Update message status to read
            setMessages(prev => prev.map(msg =>
              msg.id === data.messageId ? { ...msg, readStatus: 'read' } : msg
            ));
          } else if (data.type === 'admin_broadcast') {
            // Handle admin broadcast messages
            const broadcastMessage = data as AdminBroadcastMessage;
            // Check if the current user is in the recipient list
            if (broadcastMessage.recipients.includes(user.role) ||
              broadcastMessage.recipients.includes('all') ||
              (user.role === 'patient' && broadcastMessage.recipients.includes('patients')) ||
              (user.role === 'doctor' && broadcastMessage.recipients.includes('doctors')) ||
              (user.role === 'reception' && broadcastMessage.recipients.includes('reception'))) {
              setNotifications(prev => [...prev, broadcastMessage]);
            }
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      wsRef.current.onclose = () => {
        setIsConnected(false);
        // Attempt to reconnect after 3 seconds
        reconnectTimeoutRef.current = setTimeout(() => {
          connect();
        }, 3000);
      };

      wsRef.current.onerror = (error) => {
        console.error('WebSocket error:', error);
        setIsConnected(false);
      };
    } catch (error) {
      console.error('Failed to create WebSocket connection:', error);
    }
  }, [user]);

  const sendMessage = useCallback((message: WebSocketMessage) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      // Add metadata to chat messages
      if (message.type === 'chat_message') {
        const chatMessage: any = {
          ...message,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
          readStatus: 'sent'
        };
        wsRef.current.send(JSON.stringify(chatMessage));
        // Add to local messages immediately for optimistic UI
        setMessages(prev => [...prev, chatMessage as WebSocketChatMessage]);
      } else {
        wsRef.current.send(JSON.stringify(message));
      }
    }
  }, []);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    setIsConnected(false);
  }, []);

  useEffect(() => {
    if (user) {
      connect();
    } else {
      disconnect();
    }

    return () => {
      disconnect();
    };
  }, [user, connect, disconnect]);

  return {
    isConnected,
    messages,
    notifications,
    sendMessage,
    connect,
    disconnect
  };
}
