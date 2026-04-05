import { useAuth } from "../../contexts/AuthContext";
import SevaMedConnect from "../../components/chat/SevaMedConnect";

export default function NurseChatPage() {
    const { user } = useAuth();
    
    return (
        <div className="h-[calc(100vh-64px)] -m-4">
            <SevaMedConnect 
                currentUser={{ name: "Nurse • " + (user?.name || "Staff"), avatar: "NR" }} 
            />
        </div>
    );
}
