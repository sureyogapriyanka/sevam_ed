import { Heart } from "lucide-react";
import { Card, CardContent } from "../ui/card";

interface AuthSuccessMessageProps {
    title: string;
    message: string;
    redirectMessage: string;
    role?: string;
}

export default function AuthSuccessMessage({
    title,
    message,
    redirectMessage,
    role = "patient"
}: AuthSuccessMessageProps) {
    // Determine role-specific styling
    const getRoleStyles = () => {
        switch (role) {
            case "doctor":
                return "from-blue-500 to-indigo-600";
            case "reception":
                return "from-green-500 to-emerald-600";
            case "admin":
                return "from-purple-500 to-violet-600";
            default:
                return "from-blue-500 to-emerald-600";
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-100 to-blue-900 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-gradient-to-r from-slate-600/10 to-gray-600/10 backdrop-blur-3xl"></div>
            <div className="absolute inset-0 opacity-5">
                <div className="w-full h-full" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    backgroundSize: '60px 60px'
                }}></div>
            </div>

            <Card className="w-full max-w-md relative z-10 shadow-2xl border-2 border-blue-400/30 bg-white/95 backdrop-blur-sm">
                <CardContent className="pt-8 text-center">
                    <div className={`w-20 h-20 bg-gradient-to-br ${getRoleStyles()} rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg animate-pulse`}>
                        <Heart className="h-10 w-10 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-slate-800 mb-4">{title}</h2>
                    <p className="text-lg text-slate-600 mb-2">🎉 {message}</p>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                        <p className="text-sm text-blue-700">
                            <strong>Next Steps:</strong> {redirectMessage}
                        </p>
                    </div>

                    <div className="flex justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                    <p className="text-slate-500 mt-4 text-sm">Please wait...</p>
                </CardContent>
            </Card>
        </div>
    );
}
