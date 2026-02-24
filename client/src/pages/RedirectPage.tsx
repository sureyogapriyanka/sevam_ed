import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthSuccessMessage from "../components/common/AuthSuccessMessage";
import { useAuth } from "../contexts/AuthContext";
import { BASE_PATH } from "../lib/utils";

interface RedirectPageProps {
    title: string;
    message: string;
    redirectMessage: string;
    redirectTo: string;
    role?: string;
    delay?: number;
}

export default function RedirectPage({
    title,
    message,
    redirectMessage,
    redirectTo,
    role = "patient",
    delay = 2000
}: RedirectPageProps) {
    const navigate = useNavigate();
    const { user } = useAuth();

    useEffect(() => {
        const timer = setTimeout(() => {
            // If redirecting to root and we have user data, go directly to the user's dashboard
            if (redirectTo === "/" && user) {
                navigate(`/${user.role}`, { replace: true });
            } else if (redirectTo === "/" && !user) {
                // If redirecting to root but no user data, go to home page
                navigate("/", { replace: true });
            } else {
                // For other redirects, go to the specified location
                navigate(redirectTo, { replace: true });
            }
        }, delay);

        return () => clearTimeout(timer);
    }, [navigate, redirectTo, delay, user]);

    return (
        <AuthSuccessMessage
            title={title}
            message={message}
            redirectMessage={redirectMessage}
            role={role}
        />
    );
}
