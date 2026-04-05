import { useState, useEffect, useRef } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useWebSocket } from "../../hooks/useWebSocket";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { MessageSquare, User, Search, X, Send } from "lucide-react";
import { Input } from "../ui/input";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { messageService } from "../../services/messageService";

interface ChatUser {
    id: string;
    name: string;
    role: string;
    status: 'online' | 'offline' | 'busy';
}

interface ChatMessage {
    id: string;
    senderId: string;
    receiverId: string;
    content: string;
    createdAt: string;
    readStatus?: 'sent' | 'delivered' | 'read';
}

interface ChatConversation {
    id: string;
    userId: string;
    userName: string;
    userRole: string;
    unreadCount: number;
    lastMessage?: string;
    lastMessageTime?: string;
    status: 'online' | 'offline' | 'busy';
}

export default function ChatDashboard() {
    const { user } = useAuth();
    const { messages: wsMessages } = useWebSocket();
    const [selectedUser, setSelectedUser] = useState<string | null>(null);
    const [users, setUsers] = useState<ChatUser[]>([]);
    const [conversations, setConversations] = useState<ChatConversation[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [messageInput, setMessageInput] = useState("");

    // Fetch users and conversations
    useEffect(() => {
        if (user) {
            // Mock users based on user role
            const mockUsers: ChatUser[] = user.role === "patient"
                ? [
                    { id: "doctor1", name: "Dr. Smith", role: "doctor", status: "online" },
                    { id: "doctor2", name: "Dr. Johnson", role: "doctor", status: "busy" },
                    { id: "reception1", name: "Reception Desk", role: "reception", status: "online" }
                ]
                : user.role === "reception"
                    ? [
                        { id: "patient1", name: "John Doe", role: "patient", status: "online" },
                        { id: "patient2", name: "Jane Smith", role: "patient", status: "offline" },
                        { id: "doctor1", name: "Dr. Smith", role: "doctor", status: "busy" }
                    ]
                    : [];

            setUsers(mockUsers);

            // Initialize conversations
            const mockConversations: ChatConversation[] = mockUsers.map(u => ({
                id: u.id,
                userId: u.id,
                userName: u.name,
                userRole: u.role,
                unreadCount: Math.floor(Math.random() * 3),
                lastMessage: "Hello, how can I help you?",
                lastMessageTime: new Date(Date.now() - Math.floor(Math.random() * 3600000)).toISOString(),
                status: u.status
            }));

            setConversations(mockConversations);
        }
    }, [user]);

    // Fetch messages when a user is selected
    const { data: messages = [], refetch } = useQuery({
        queryKey: ["messages", user?.id, selectedUser],
        queryFn: async () => {
            if (!user?.id || !selectedUser) return [];
            const { data } = await messageService.getByUserId(selectedUser);
            return data || [];
        },
        enabled: !!user?.id && !!selectedUser,
    });

    // Filter conversations based on search term
    const filteredConversations = conversations.filter(conv =>
        conv.userName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Handle sending a message
    const handleSendMessage = async (content: string) => {
        if (!selectedUser || !content.trim()) return;

        try {
            // Send message through API
            const { data, error } = await messageService.send({
                receiverId: selectedUser,
                content: content.trim()
            });

            if (error) {
                console.error('Failed to send message:', error);
                return;
            }

            // Update conversation with new message
            setConversations(prev => prev.map(conv => {
                if (conv.userId === selectedUser) {
                    return {
                        ...conv,
                        lastMessage: content.substring(0, 50) + (content.length > 50 ? '...' : ''),
                        lastMessageTime: new Date().toISOString(),
                        unreadCount: conv.unreadCount + 1
                    };
                }
                return conv;
            }));

            // Clear input
            setMessageInput("");
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    if (!user || (user.role !== "patient" && user.role !== "reception")) {
        return null;
    }

    return (
        <div className="flex h-[600px] border rounded-lg overflow-hidden">
            {/* Conversation List */}
            <div className="w-1/3 border-r flex flex-col">
                <div className="p-4 border-b">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                        <Input
                            placeholder="Search contacts..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto">
                    {filteredConversations.map((conv) => (
                        <div
                            key={conv.id}
                            className={`flex items-center p-4 border-b cursor-pointer hover:bg-gray-50 ${selectedUser === conv.userId ? 'bg-blue-50' : ''}`}
                            onClick={() => setSelectedUser(conv.userId)}
                        >
                            <div className="relative">
                                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                    <User className="h-6 w-6 text-blue-600" />
                                </div>
                                <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${conv.status === 'online' ? 'bg-green-500' :
                                    conv.status === 'busy' ? 'bg-red-500' : 'bg-gray-400'
                                    }`}></div>
                            </div>
                            <div className="ml-3 flex-1 min-w-0">
                                <div className="flex justify-between">
                                    <p className="font-medium truncate">{conv.userName}</p>
                                    {conv.lastMessageTime && (
                                        <span className="text-xs text-gray-500">
                                            {new Date(conv.lastMessageTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    )}
                                </div>
                                <div className="flex justify-between">
                                    <p className="text-sm text-gray-600 truncate">{conv.lastMessage || "No messages yet"}</p>
                                    {conv.unreadCount > 0 && (
                                        <Badge className="h-5 w-5 rounded-full p-0 bg-blue-500 text-white text-xs">
                                            {conv.unreadCount}
                                        </Badge>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Messages Area */}
            <div className="w-2/3 flex flex-col">
                {selectedUser ? (
                    <>
                        <div className="p-4 border-b flex items-center">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setSelectedUser(null)}
                                className="mr-2 lg:hidden"
                            >
                                <X className="h-4 w-4" />
                            </Button>
                            <div className="relative">
                                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                    <User className="h-5 w-5 text-blue-600" />
                                </div>
                                <div className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-green-500 border border-white"></div>
                            </div>
                            <div className="ml-3">
                                <p className="font-medium">
                                    {users.find(u => u.id === selectedUser)?.name || "Unknown User"}
                                </p>
                                <p className="text-xs text-gray-600">Online</p>
                            </div>
                        </div>
                        <div className="flex-1 p-4 overflow-y-auto space-y-4">
                            {/* Historical messages */}
                            {messages.map((msg: ChatMessage) => (
                                <div
                                    key={msg.id}
                                    className={`flex ${msg.senderId === user.id ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-xs p-3 rounded-lg ${msg.senderId === user.id
                                            ? 'bg-blue-500 text-white'
                                            : 'bg-gray-200 text-gray-900'
                                            }`}
                                    >
                                        <p className="text-sm">{msg.content}</p>
                                        <div className="flex justify-between items-center mt-1">
                                            <span className="text-xs opacity-80">
                                                {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                            {msg.senderId === user.id && (
                                                <span className="text-xs">
                                                    {msg.readStatus === 'read' ? '✓✓' : msg.readStatus === 'delivered' ? '✓' : 'Sending...'}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {/* Real-time WebSocket messages */}
                            {wsMessages
                                .filter((msg: any) =>
                                    (msg.senderId === user.id && msg.receiverId === selectedUser) ||
                                    (msg.senderId === selectedUser && msg.receiverId === user.id)
                                )
                                .map((msg: any, index: number) => (
                                    <div
                                        key={`ws-${index}`}
                                        className={`flex ${msg.senderId === user.id ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div
                                            className={`max-w-xs p-3 rounded-lg ${msg.senderId === user.id
                                                ? 'bg-blue-500 text-white'
                                                : 'bg-gray-200 text-gray-900'
                                                }`}
                                        >
                                            <p className="text-sm">{msg.content}</p>
                                            <div className="flex justify-between items-center mt-1">
                                                <span className="text-xs opacity-80">Just now</span>
                                                {msg.senderId === user.id && (
                                                    <span className="text-xs">Sending...</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                        </div>
                        <div className="p-4 border-t">
                            <div className="flex space-x-2">
                                <Input
                                    type="text"
                                    value={messageInput}
                                    onChange={(e) => setMessageInput(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(messageInput)}
                                    placeholder="Type your message..."
                                    className="flex-1"
                                />
                                <Button
                                    onClick={() => handleSendMessage(messageInput)}
                                    disabled={!messageInput.trim()}
                                    className="bg-blue-600 hover:bg-blue-700 text-white"
                                >
                                    <Send className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center">
                        <div className="text-center">
                            <MessageSquare className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                            <p className="text-gray-600">Select a conversation to start chatting</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
