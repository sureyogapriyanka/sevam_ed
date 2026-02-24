import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useLanguage } from "../../contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { Badge } from "../ui/badge";
import { Send, Users, User, Stethoscope, CreditCard } from "lucide-react";
import { useWebSocket } from "../../hooks/useWebSocket";

interface RecipientGroup {
    id: string;
    name: string;
    icon: React.ReactNode;
    count: number;
}

export default function AdminMessaging() {
    const { user } = useAuth();
    const { t } = useLanguage();
    const { sendMessage } = useWebSocket();
    const [message, setMessage] = useState("");

    const [selectedRecipients, setSelectedRecipients] = useState<string[]>([]);

    const recipientGroups: RecipientGroup[] = [
        { id: "doctors", name: "Doctors", icon: <Stethoscope className="h-4 w-4" />, count: 15 },
        { id: "reception", name: "Reception Staff", icon: <CreditCard className="h-4 w-4" />, count: 8 },
        { id: "patients", name: "Patients", icon: <User className="h-4 w-4" />, count: 120 },
    ];

    const toggleRecipient = (id: string) => {
        setSelectedRecipients(prev =>
            prev.includes(id)
                ? prev.filter(recipientId => recipientId !== id)
                : [...prev, id]
        );
    };

    const handleSendMessage = () => {
        if (!message.trim() || selectedRecipients.length === 0) return;

        // Send message to selected recipient groups
        sendMessage({
            type: 'admin_broadcast',
            senderId: user?.id,
            senderName: user?.name,
            content: message,
            recipients: selectedRecipients,
            timestamp: new Date().toISOString()
        });

        // Clear form
        setMessage("");
        setSelectedRecipients([]);
    };

    return (
        <Card className="border-2 border-blue-500/50 bg-gradient-to-br from-blue-900/30 to-indigo-900/30 backdrop-blur-sm shadow-xl">
            <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                    <Send className="h-5 w-5 text-blue-400" />
                    <span className="text-white">Send System Message</span>
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div>
                    <Label htmlFor="message-content" className="text-blue-100 mb-2 block font-medium">
                        Message Content
                    </Label>
                    <Textarea
                        id="message-content"
                        placeholder="Type your message here..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="min-h-[120px] bg-gray-800/50 border-gray-700 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <Label className="text-blue-100 mb-2 block font-medium">
                        Send To
                    </Label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {recipientGroups.map((group) => (
                            <div
                                key={group.id}
                                className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 ${selectedRecipients.includes(group.id)
                                    ? "border-blue-500 bg-blue-900/20 shadow-md"
                                    : "border-gray-700 bg-gray-800/30 hover:bg-gray-700/50 hover:border-gray-600"
                                    }`}
                                onClick={() => toggleRecipient(group.id)}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        {group.icon}
                                        <span className="font-medium text-white">{group.name}</span>
                                    </div>
                                    <Checkbox
                                        checked={selectedRecipients.includes(group.id)}
                                        onCheckedChange={() => toggleRecipient(group.id)}
                                        className="border-gray-600 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                                    />
                                </div>
                                <Badge variant="secondary" className="mt-2 bg-blue-800/50 text-blue-200 border-blue-700/50">
                                    {group.count} users
                                </Badge>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex justify-end space-x-3">
                    <Button
                        variant="outline"
                        onClick={() => {
                            setMessage("");
                            setSelectedRecipients([]);
                        }}
                        className="border-gray-600 text-gray-300 hover:bg-gray-700/50 hover:text-white"
                    >
                        Clear
                    </Button>
                    <Button
                        onClick={handleSendMessage}
                        disabled={!message.trim() || selectedRecipients.length === 0}
                        className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg transition-all duration-300 hover:shadow-xl"
                    >
                        <Send className="h-4 w-4 mr-2" />
                        Send Message
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
