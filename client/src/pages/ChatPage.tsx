import { useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import ChatInterface from "../components/chat/ChatInterface"; // Changed import

export default function ChatPage() {
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        // Redirect if user is not authorized to view chat
        if (!user || (user.role !== "patient" && user.role !== "reception" && user.role !== "doctor")) {
            navigate("/");
        }
    }, [user, navigate]);

    if (!user || (user.role !== "patient" && user.role !== "reception" && user.role !== "doctor")) {
        return null;
    }

    return (
        <div className="w-full h-screen">
            <ChatInterface /> {/* Use ChatInterface instead of ChatDashboard */}
        </div>
    );
}