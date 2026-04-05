import { useAuth } from "../../contexts/AuthContext";
import { useWebSocket } from "../../hooks/useWebSocket";
import { Button } from "../ui/button";
import { MessageSquare } from "lucide-react";

// Simple component to test chat functionality
export default function ChatTestButton() {
    const { user } = useAuth();
    const { isConnected, sendMessage } = useWebSocket();

    // Function to send a test message to Dr. Smith
    const sendTestMessage = () => {
        if (!isConnected) {
            console.log("Not connected to chat service");
            return;
        }

        // Send a test message to Dr. Smith (doctor1)
        sendMessage({
            type: 'chat_message',
            senderId: user?.id,
            receiverId: "doctor1", // Dr. Smith's ID
            content: "This is a test message from the chat system!",
            messageType: 'direct'
        });

        console.log("Test message sent to Dr. Smith");
    };

    // Only show button for patient and reception users
    if (!user || (user.role !== "patient" && user.role !== "reception")) {
        return null;
    }

    return (
        <div className="p-4 bg-blue-50 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Chat Test</h3>
            <p className="text-sm text-gray-600 mb-3">
                Click the button below to send a test message to Dr. Smith
            </p>
            <Button
                onClick={sendTestMessage}
                className="flex items-center"
            >
                <MessageSquare className="h-4 w-4 mr-2" />
                Send Test Message
            </Button>
        </div>
    );
}
