import { useState } from "react";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import EnhancedChatInterface from "../../components/chat/EnhancedChatInterface";
import { MessageCircle, Users, Search, MoreVertical, Bot, Lightbulb, Star, Reply, AlertTriangle, Phone, Video } from "lucide-react";

export default function DoctorChatPage() {
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [selectedContact, setSelectedContact] = useState(null);

    const openChat = (contact: any) => {
        setSelectedContact(contact);
        setIsChatOpen(true);
    };

    const closeChat = () => {
        setIsChatOpen(false);
        setSelectedContact(null);
    };

    return (
        <div className="space-y-6 h-full flex flex-col">
            {/* Header */}
            <div className="flex justify-between items-center bg-white shadow-sm rounded-lg p-4">
                <div className="flex items-center space-x-4">
                    <div className="relative">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                            <MessageCircle className="h-6 w-6 text-white" />
                        </div>
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Internal Chat</h2>
                        <p className="text-sm text-gray-600">Secure communication platform</p>
                    </div>
                </div>
                <div className="flex items-center space-x-3">
                    <Button variant="outline" size="sm" className="border-gray-300 text-gray-700 hover:bg-gray-100">
                        <Search className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" className="border-gray-300 text-gray-700 hover:bg-gray-100">
                        <Users className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" className="border-gray-300 text-gray-700 hover:bg-gray-100">
                        <MoreVertical className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
                {/* Contact List */}
                <Card className="lg:col-span-1 border-t-4 border-t-blue-500 hover:shadow-xl transition-all duration-300 bg-white border-2 border-gray-200 rounded-xl">
                    <CardHeader className="border-b border-gray-200">
                        <CardTitle className="flex items-center space-x-2">
                            <Users className="h-5 w-5 text-blue-600" />
                            <span>Contacts</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="divide-y">
                            {/* Online Contacts */}
                            <div className="p-4">
                                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">Online</h3>
                                <div className="space-y-2">
                                    <div
                                        className="flex items-center p-3 rounded-lg hover:bg-gray-100 cursor-pointer bg-green-50 border border-green-100"
                                        onClick={() => openChat({ id: "doctor1", name: "Dr. Anjali Patel", role: "doctor", department: "Cardiology" })}
                                    >
                                        <div className="relative">
                                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                                                <span className="text-white font-semibold text-sm">AP</span>
                                            </div>
                                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                                        </div>
                                        <div className="ml-3 flex-1">
                                            <div className="font-medium text-gray-900">Dr. Anjali Patel</div>
                                            <div className="text-sm text-gray-600">Cardiology</div>
                                        </div>
                                        <Badge variant="destructive" className="h-5">3</Badge>
                                    </div>
                                    <div
                                        className="flex items-center p-3 rounded-lg hover:bg-gray-100 cursor-pointer"
                                        onClick={() => openChat({ id: "patient1", name: "Rajesh Kumar", role: "patient" })}
                                    >
                                        <div className="relative">
                                            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                                                <span className="text-white font-semibold text-sm">RK</span>
                                            </div>
                                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                                        </div>
                                        <div className="ml-3 flex-1">
                                            <div className="font-medium text-gray-900">Rajesh Kumar</div>
                                            <div className="text-sm text-gray-600">Patient</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Offline Contacts */}
                            <div className="p-4">
                                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">Offline</h3>
                                <div className="space-y-2">
                                    <div
                                        className="flex items-center p-3 rounded-lg hover:bg-gray-100 cursor-pointer"
                                        onClick={() => openChat({ id: "doctor2", name: "Dr. Michael Chen", role: "doctor", department: "Pediatrics" })}
                                    >
                                        <div className="relative">
                                            <div className="w-10 h-10 bg-gradient-to-br from-gray-500 to-gray-600 rounded-full flex items-center justify-center">
                                                <span className="text-white font-semibold text-sm">MC</span>
                                            </div>
                                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-gray-500 rounded-full border-2 border-white"></div>
                                        </div>
                                        <div className="ml-3 flex-1">
                                            <div className="font-medium text-gray-900">Dr. Michael Chen</div>
                                            <div className="text-sm text-gray-600">Pediatrics</div>
                                        </div>
                                    </div>
                                    <div
                                        className="flex items-center p-3 rounded-lg hover:bg-gray-100 cursor-pointer"
                                        onClick={() => openChat({ id: "patient2", name: "Priya Sharma", role: "patient" })}
                                    >
                                        <div className="relative">
                                            <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full flex items-center justify-center">
                                                <span className="text-white font-semibold text-sm">PS</span>
                                            </div>
                                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-gray-500 rounded-full border-2 border-white"></div>
                                        </div>
                                        <div className="ml-3 flex-1">
                                            <div className="font-medium text-gray-900">Priya Sharma</div>
                                            <div className="text-sm text-gray-600">Patient</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Admin Contacts */}
                            <div className="p-4">
                                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">Administrators</h3>
                                <div className="space-y-2">
                                    <div
                                        className="flex items-center p-3 rounded-lg hover:bg-gray-100 cursor-pointer"
                                        onClick={() => openChat({ id: "admin1", name: "System Administrator", role: "admin" })}
                                    >
                                        <div className="relative">
                                            <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center">
                                                <Users className="h-5 w-5 text-white" />
                                            </div>
                                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                                        </div>
                                        <div className="ml-3 flex-1">
                                            <div className="font-medium text-gray-900">System Administrator</div>
                                            <div className="text-sm text-gray-600">Admin</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Chat Interface */}
                <Card className="lg:col-span-2 border-t-4 border-t-blue-500 hover:shadow-xl transition-all duration-300 bg-white border-2 border-gray-200 rounded-xl overflow-hidden flex flex-col">
                    <CardHeader className="border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                        <CardTitle className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <MessageCircle className="h-5 w-5 text-blue-600" />
                                <span>Professional Communication</span>
                            </div>
                            <div className="flex space-x-2">
                                <Button variant="outline" size="sm" className="border-gray-300 text-gray-700 hover:bg-gray-100">
                                    <Phone className="h-4 w-4" />
                                </Button>
                                <Button variant="outline" size="sm" className="border-gray-300 text-gray-700 hover:bg-gray-100">
                                    <Video className="h-4 w-4" />
                                </Button>
                            </div>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 p-0 flex flex-col">
                        <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-blue-50/30 to-indigo-50/30">
                            <div className="text-center p-8 max-w-md">
                                <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-indigo-200 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <MessageCircle className="h-12 w-12 text-blue-600" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Welcome to SevaMed Chat</h3>
                                <p className="text-gray-600 mb-6">
                                    Select a contact from the list to start a secure conversation.
                                    All communications are encrypted and comply with healthcare privacy regulations.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                    <Button
                                        onClick={() => openChat({ id: "doctor1", name: "Dr. Anjali Patel", role: "doctor", department: "Cardiology" })}
                                        className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
                                    >
                                        <MessageCircle className="h-4 w-4 mr-2" />
                                        Start Chat
                                    </Button>
                                    <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-100">
                                        <AlertTriangle className="h-4 w-4 mr-2" />
                                        Emergency Contact
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Info Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="border-l-4 border-l-green-500 bg-green-50">
                    <CardContent className="p-4">
                        <div className="flex items-center">
                            <Bot className="h-5 w-5 text-green-600 mr-2" />
                            <h3 className="font-medium text-green-800">AI-Powered Suggestions</h3>
                        </div>
                        <p className="text-sm text-green-700 mt-1">Get intelligent message suggestions based on medical context</p>
                    </CardContent>
                </Card>
                <Card className="border-l-4 border-l-blue-500 bg-blue-50">
                    <CardContent className="p-4">
                        <div className="flex items-center">
                            <MessageCircle className="h-5 w-5 text-blue-600 mr-2" />
                            <h3 className="font-medium text-blue-800">Real-time Updates</h3>
                        </div>
                        <p className="text-sm text-blue-700 mt-1">Messages delivered instantly with read receipts</p>
                    </CardContent>
                </Card>
                <Card className="border-l-4 border-l-purple-500 bg-purple-50">
                    <CardContent className="p-4">
                        <div className="flex items-center">
                            <Star className="h-5 w-5 text-purple-600 mr-2" />
                            <h3 className="font-medium text-purple-800">WhatsApp-like Experience</h3>
                        </div>
                        <p className="text-sm text-purple-700 mt-1">Familiar interface with professional medical features</p>
                    </CardContent>
                </Card>
            </div>

            {/* Chat Interface Modal */}
            <EnhancedChatInterface isOpen={isChatOpen} onClose={closeChat} />
        </div>
    );
}
