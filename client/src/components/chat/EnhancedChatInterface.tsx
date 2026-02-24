import { useState, useEffect, useRef } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { ScrollArea } from "../ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import {
    Send,
    Phone,
    Video,
    FileText,
    AlertTriangle,
    CheckCircle,
    X,
    Users,
    Stethoscope,
    User,
    Clock,
    Reply,
    Paperclip,
    Mic
} from "lucide-react";
import { toast } from "../../hooks/use-toast";

// Mock data for contacts
const mockContacts = [
    { id: "doctor1", name: "Dr. Anjali Patel", role: "doctor", department: "Cardiology", status: "online", unread: 3, icon: <Stethoscope className="h-4 w-4" /> },
    { id: "doctor2", name: "Dr. Michael Chen", role: "doctor", department: "Pediatrics", status: "away", unread: 0, icon: <Stethoscope className="h-4 w-4" /> },
    { id: "patient1", name: "Rajesh Kumar", role: "patient", status: "online", unread: 1, icon: <User className="h-4 w-4" /> },
    { id: "patient2", name: "Priya Sharma", role: "patient", status: "offline", unread: 0, icon: <User className="h-4 w-4" /> },
    { id: "admin1", name: "System Administrator", role: "admin", status: "online", unread: 0, icon: <Users className="h-4 w-4" /> },
];

// Mock data for messages
const mockMessages = [
    { id: "1", senderId: "doctor1", senderName: "Dr. Anjali Patel", content: "Good morning! I've reviewed the patient reports.", timestamp: "09:30 AM", isOwn: false, isUrgent: false },
    { id: "2", senderId: "current-user", senderName: "You", content: "Thanks for the update. I'll follow up with the patient.", timestamp: "09:32 AM", isOwn: true, isUrgent: false },
    { id: "3", senderId: "doctor1", senderName: "Dr. Anjali Patel", content: "URGENT: The lab results show critical values. Please attend immediately.", timestamp: "09:35 AM", isOwn: false, isUrgent: true },
    { id: "4", senderId: "current-user", senderName: "You", content: "On my way to check the patient now.", timestamp: "09:36 AM", isOwn: true, isUrgent: false },
];

export default function EnhancedChatInterface({ isOpen = true, onClose }: { isOpen?: boolean; onClose?: () => void }) {
    const { user } = useAuth();
    const [message, setMessage] = useState("");
    const [selectedContact, setSelectedContact] = useState(mockContacts[0]);
    const [isUrgent, setIsUrgent] = useState(false);
    const scrollAreaRef = useRef<HTMLDivElement>(null);

    // Filter contacts based on user role
    const filteredContacts = mockContacts.filter(contact => {
        // Patients can only see doctors and admins
        if (user?.role === "patient") {
            return contact.role === "doctor" || contact.role === "admin";
        }
        // Doctors can see patients and admins
        if (user?.role === "doctor") {
            return contact.role === "patient" || contact.role === "admin" || contact.role === "doctor";
        }
        // Admins can see everyone
        return true;
    });

    const handleSendMessage = () => {
        if (message.trim()) {
            // In a real app, this would send the message to the backend
            if (isUrgent) {
                toast({
                    title: "Urgent Message Sent",
                    description: "Your urgent message has been sent to all doctors",
                    variant: "destructive"
                });
            }
            setMessage("");
            setIsUrgent(false);
        }
    };

    const handleSendUrgentMessage = () => {
        setIsUrgent(true);
        handleSendMessage();
    };

    // Scroll to bottom when messages change
    useEffect(() => {
        if (scrollAreaRef.current) {
            const scrollViewport = scrollAreaRef.current.querySelector(
                "[data-radix-scroll-area-viewport]"
            );
            if (scrollViewport) {
                scrollViewport.scrollTop = scrollViewport.scrollHeight;
            }
        }
    }, [mockMessages]);

    // Only show chat for patient, doctor, and admin users
    if (!user || (user.role !== "patient" && user.role !== "doctor" && user.role !== "admin")) {
        return null;
    }

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end justify-end p-4 sm:items-center sm:justify-end">
            <div className="w-full max-w-md h-[80vh] bg-background border rounded-lg shadow-2xl flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-t-lg">
                    <div className="flex items-center">
                        <div className="relative">
                            <Avatar className="h-10 w-10 border-2 border-white">
                                <AvatarImage src={`https://api.dicebear.com/6.x/initials/svg?seed=${selectedContact.name}`} />
                                <AvatarFallback className="bg-blue-500 text-white">{selectedContact.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white ${selectedContact.status === "online" ? "bg-green-500" :
                                    selectedContact.status === "away" ? "bg-yellow-500" : "bg-gray-500"
                                }`} />
                        </div>
                        <div className="ml-3">
                            <div className="font-semibold">{selectedContact.name}</div>
                            <div className="text-xs text-blue-100 capitalize flex items-center">
                                {selectedContact.icon}
                                <span className="ml-1">{selectedContact.role} {selectedContact.department && `• ${selectedContact.department}`}</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex space-x-2">
                        <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                            <Phone className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                            <Video className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-white hover:bg-white/20" onClick={onClose}>
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                {/* Contacts List (Mobile) */}
                <div className="hidden sm:block border-b p-2 bg-gray-50">
                    <div className="flex space-x-2 overflow-x-auto">
                        {filteredContacts.map((contact) => (
                            <Button
                                key={contact.id}
                                variant={selectedContact.id === contact.id ? "default" : "ghost"}
                                size="sm"
                                className={`flex-shrink-0 ${selectedContact.id === contact.id ? "bg-blue-600 text-white" : "hover:bg-gray-200"}`}
                                onClick={() => setSelectedContact(contact)}
                            >
                                <div className="relative">
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src={`https://api.dicebear.com/6.x/initials/svg?seed=${contact.name}`} />
                                        <AvatarFallback className={selectedContact.id === contact.id ? "bg-blue-500 text-white" : "bg-gray-200"}>{contact.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div className={`absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 border-white ${contact.status === "online" ? "bg-green-500" :
                                            contact.status === "away" ? "bg-yellow-500" : "bg-gray-500"
                                        }`} />
                                </div>
                                <span className="ml-2 hidden md:inline">{contact.name}</span>
                                {contact.unread > 0 && (
                                    <Badge className="ml-2 h-4 w-4 rounded-full p-0 bg-red-500 text-white text-xs">
                                        {contact.unread}
                                    </Badge>
                                )}
                            </Button>
                        ))}
                    </div>
                </div>

                {/* Messages */}
                <ScrollArea ref={scrollAreaRef} className="flex-1 p-4 bg-gradient-to-b from-blue-50/50 to-white">
                    <div className="space-y-4">
                        {mockMessages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`flex ${msg.isOwn ? "justify-end" : "justify-start"}`}
                            >
                                <div
                                    className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl shadow-sm ${msg.isOwn
                                            ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-br-none"
                                            : msg.isUrgent
                                                ? "bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-bl-none"
                                                : "bg-gray-100 text-gray-900 rounded-bl-none"
                                        }`}
                                >
                                    {!msg.isOwn && (
                                        <div className="text-xs font-semibold mb-1 flex items-center">
                                            {msg.senderName}
                                            {msg.isUrgent && (
                                                <AlertTriangle className="h-3 w-3 ml-1" />
                                            )}
                                        </div>
                                    )}
                                    <div className="text-sm">{msg.content}</div>
                                    <div
                                        className={`text-xs mt-1 flex items-center ${msg.isOwn ? "text-blue-100" : msg.isUrgent ? "text-red-100" : "text-gray-500"
                                            }`}
                                    >
                                        <Clock className="h-3 w-3 mr-1" />
                                        {msg.timestamp}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </ScrollArea>

                {/* Message Input */}
                <div className="border-t p-4 bg-gray-50">
                    <div className="flex items-center space-x-2 mb-3">
                        <Button
                            variant={isUrgent ? "destructive" : "outline"}
                            size="sm"
                            onClick={() => setIsUrgent(!isUrgent)}
                            className="text-xs"
                        >
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            {isUrgent ? "Urgent Mode" : "Mark Urgent"}
                        </Button>
                        {isUrgent && user.role === "doctor" && (
                            <Button
                                variant="destructive"
                                size="sm"
                                onClick={handleSendUrgentMessage}
                                className="text-xs"
                            >
                                <Send className="h-3 w-3 mr-1" />
                                Send to All Doctors
                            </Button>
                        )}
                    </div>
                    <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="icon" className="text-gray-500 hover:text-gray-700">
                            <Paperclip className="h-4 w-4" />
                        </Button>
                        <Input
                            placeholder={isUrgent ? "Type an urgent message..." : "Type a message..."}
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                            className="flex-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        />
                        <Button variant="ghost" size="icon" className="text-gray-500 hover:text-gray-700">
                            <Mic className="h-4 w-4" />
                        </Button>
                        <Button
                            size="icon"
                            onClick={handleSendMessage}
                            disabled={!message.trim()}
                            className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white"
                        >
                            <Send className="h-4 w-4" />
                        </Button>
                    </div>
                    {isUrgent && (
                        <div className="mt-2 text-xs text-red-600 flex items-center">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            This message will be marked as urgent and highlighted in red
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
