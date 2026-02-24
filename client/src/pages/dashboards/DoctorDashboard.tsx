import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import Layout from "../../components/common/Layout";
import { Card, CardContent } from "../../components/ui/card";
import { useLanguage } from "../../contexts/LanguageContext";

export default function DoctorDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useLanguage();

  useEffect(() => {
    // Redirect to the doctor overview page after a short delay to ensure proper rendering
    const timer = setTimeout(() => {
      navigate("/doctor/overview");
    }, 100);

    return () => clearTimeout(timer);
  }, [navigate, user]);

  // Show a simple loading state while redirecting
  return (
    <Layout>
      <div className="flex items-center justify-center h-full">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold mb-2">Loading Dashboard</h2>
            <p className="text-gray-600 mb-4">Redirecting to your dashboard...</p>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
