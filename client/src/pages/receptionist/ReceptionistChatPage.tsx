import { useAuth } from "../../contexts/AuthContext";
import SevaMedConnect from "../../components/chat/SevaMedConnect";

export default function ReceptionistChatPage() {
    const { user } = useAuth();
    
    return (
        <div className="h-[calc(100vh-64px)] -m-4">
            <SevaMedConnect 
                currentUser={{ name: "Reception • " + (user?.name || "Staff"), avatar: "RC" }} 
            />
        </div>
    );
}
