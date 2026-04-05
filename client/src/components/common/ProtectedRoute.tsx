import { useAuth } from "../../contexts/AuthContext";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/", { replace: true });
    } else if (user && allowedRoles && !allowedRoles.includes(user.role)) {
      // Special case for profile edit route - allow both patients and doctors
      if (location.pathname === '/profile/edit' && (user.role === 'patient' || user.role === 'doctor')) {
        // Allow access for both patient and doctor roles
        return;
      }

      // Redirect to appropriate dashboard based on role
      switch (user.role) {
        case "admin":
          navigate("/admin", { replace: true });
          break;
        case "doctor":
          navigate("/doctor", { replace: true });
          break;
        case "reception":
          navigate("/reception", { replace: true });
          break;
        case "patient":
          navigate("/patient", { replace: true });
          break;
        case "nurse":
          navigate("/nurse/dashboard", { replace: true });
          break;
        case "receptionist":
          navigate("/receptionist/dashboard", { replace: true });
          break;
        case "pharmacist":
          navigate("/pharmacist/dashboard", { replace: true });
          break;
        default:
          navigate("/login", { replace: true });
      }
    }
  }, [user, isLoading, allowedRoles, navigate, location]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return null;
  }

  return <>{children}</>;
}
