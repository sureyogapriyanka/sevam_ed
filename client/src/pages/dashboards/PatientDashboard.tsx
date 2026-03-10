import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useLanguage } from "../../contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { useNavigate, useLocation } from "react-router-dom";
import {
  appointmentService,
  fitnessDataService,
  aiInsightService,
  activityLogService,
  authService,
  userService
} from "../../services/api";
import FitnessTracker from "../../components/fitness/FitnessTracker";
import KnowledgeWidget from "../../components/knowledge/KnowledgeWidget";
import ChatInterface from "../../components/chat/ChatInterface";
import ActivityLog from "../../components/common/ActivityLog";
import MedicalRecords from "../../components/patient/MedicalRecords";
import Prescriptions from "../../components/patient/Prescriptions";
import QueueStatus from "../../components/patient/QueueStatus";
import AICompanion from "../../components/patient/AICompanion";
import InteractiveAIInsights from "../../components/patient/InteractiveAIInsights";
import AppointmentForm from "../../components/patient/AppointmentForm";
import {
  Calendar,
  Heart,
  Brain,
  Activity,
  Clock,
  AlertCircle,
  Thermometer,
  Scale,
  MessageSquare,
  FileText,
  TrendingUp,
  Stethoscope,
  Pill,
  Dna,
  Zap,
  Plus,
  User,
  BookOpen,
  Phone,
  Mail,
  MapPin,
  Cake,
  UserCheck,
  Menu,
  X,
  Users,
  Bot,
  Home,
  Settings,
  LogOut,
  Bell,
  Search,
  BarChart3,
  MessageCircle,
  Cog,
  Download,
  AlertTriangle,
  Lock
} from "lucide-react";
import {
  Appointment,
  FitnessData,
  AIInsight
} from "../../types/schema";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { toast } from "../../hooks/use-toast";

export default function PatientDashboard() {
  const { user, patient, logout } = useAuth(); // Remove setUser
  const { t } = useLanguage();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const location = useLocation();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState(3);
  const [notificationPanelOpen, setNotificationPanelOpen] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(user?.profileImage || null); // Add state for profile image
  const [isUploading, setIsUploading] = useState(false); // Add state for upload status
  const [currentSlide, setCurrentSlide] = useState(0);

  const healthFacts = [
    {
      title: "Viral Defense (COVID-19)",
      description: "SARS-CoV-2 awareness is critical. Professional clinical hygiene and vaccination remain the benchmark for community viral suppression.",
      image: "https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?auto=format&fit=crop&q=80&w=2000"
    },
    {
      title: "Bio-Tech Optimization",
      description: "Real-time metabolic monitoring allows our AI to adjust your nutritional protocols before energy deficits impact your clinical performance.",
      image: "https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&q=80&w=2000"
    },
    {
      title: "Cognitive Hydration",
      description: "Maintaining precise hydration levels of 3.2L/day optimizes neural signal transduction and dramatically improves long-term memory retrieval.",
      image: "https://images.unsplash.com/photo-1550505393-fa197233298d?auto=format&fit=crop&q=80&w=2000"
    },
    {
      title: "Vital Rhythm (Heart Health)",
      description: "Daily cardiovascular pacing protocols can reduce long-term cardiac strain by 22%, ensuring optimal bio-static stability through age 80+.",
      image: "https://images.unsplash.com/photo-1628177142898-93e36e4e3a50?auto=format&fit=crop&q=80&w=2000"
    },
    {
      title: "Regenerative Sleep",
      description: "Optimizing your REM cycle through adaptive temperature control and neural-sync protocols accelerates tissue repair by 40%.",
      image: "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&q=80&w=2000"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % healthFacts.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Handle URL parameters for tab selection
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabParam = urlParams.get('tab');

    if (tabParam && navigationItems.some(item => item.id === tabParam)) {
      setActiveTab(tabParam);
    }
  }, [location.search]);

  // Update profile image when user changes
  useEffect(() => {
    setProfileImage(user?.profileImage || null);
  }, [user]);

  // Fetch appointments
  const { data: myAppointments = [] } = useQuery<Appointment[]>({
    queryKey: ["appointments", "patient", patient?.id],
    queryFn: async () => {
      if (!patient?.id) return [];
      const { data } = await appointmentService.getByUserId(patient.id);
      return data || [];
    },
    enabled: !!patient?.id
  });

  // Fetch fitness data
  const { data: myFitnessData = [] } = useQuery<FitnessData[]>({
    queryKey: ["fitness-data", "patient", patient?.id],
    queryFn: async () => {
      if (!patient?.id) return [];
      const { data } = await fitnessDataService.getByPatientId(patient.id);
      return data || [];
    },
    enabled: !!patient?.id
  });

  // Fetch AI insights
  const { data: aiInsights = [] } = useQuery<AIInsight[]>({
    queryKey: ["ai-insights", "user", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data } = await aiInsightService.getByUserId(user.id);
      return data || [];
    },
    enabled: !!user?.id
  });

  // Fetch doctors for name resolution
  const { data: doctorsMap = [] } = useQuery({
    queryKey: ["/api/users/role/doctor"],
    queryFn: async () => {
      const { data, error } = await userService.getByRole("doctor");
      if (error) {
        // Fallback to real doctor names if API fails
        return [
          { _id: "DOC001", name: "Sure Yoga Priyanka" },
          { _id: "DOC002", name: "Bhetapudi Manasa" },
          { _id: "DOC003", name: "Bhimavarapu Bhavana" }
        ];
      }
      return data;
    }
  });

  const getDoctorName = (id: string) => {
    if (!id) return "Specialist";
    const doc = (doctorsMap as any[]).find(d => d._id === id || d.id === id);
    // Remove "Dr." prefix if already present to avoid double "Dr. Dr."
    const name = doc ? doc.name : id;
    return name.startsWith("Dr. ") ? name.substring(4) : name;
  };

  // Generate AI health suggestions
  const generateHealthSuggestionsMutation = useMutation({
    mutationFn: async () => {
      const latestFitness = myFitnessData[0];
      const { data } = await aiInsightService.generateHealthSuggestions({
        patientData: {
          age: user?.age,
          medicalHistory: patient?.medicalHistory,
          medications: patient?.medications,
          vitals: {
            heartRate: latestFitness?.heartRate,
            bloodPressure: latestFitness?.bloodPressure,
            weight: patient?.weight,
            height: patient?.height
          }
        },
        userId: user?.id
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ai-insights", "user", user?.id] });
    }
  });

  // Cancel appointment mutation
  const cancelAppointmentMutation = useMutation({
    mutationFn: async (id: string) => {
      return appointmentService.update(id, { status: "cancelled" });
    },
    onSuccess: (data) => {
      if (data.error) throw new Error(data.error);
      queryClient.invalidateQueries({ queryKey: ["appointments", "patient", patient?.id] });
      toast({
        title: "Appointment Cancelled",
        description: "Your session has been successfully cancelled.",
        className: "bg-rose-50 border-rose-200 text-rose-800 shadow-md"
      });
    },
    onError: (error: any) => {
      console.error("Cancellation error:", error);
      toast({
        title: "Cancellation Failed",
        description: "Unable to cancel the appointment at this time. Please try again.",
        variant: "destructive"
      });
    }
  });

  const handleCancelAppointment = (id: string) => {
    if (window.confirm("Are you sure you want to cancel this appointment? This action cannot be undone.")) {
      cancelAppointmentMutation.mutate(id);
    }
  };

  const upcomingAppointments = myAppointments
    .filter((apt) => new Date(apt.scheduledAt) > new Date() && apt.status !== "cancelled" && apt.status !== "completed")
    .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime())
    .slice(0, 3);

  const latestVitals: FitnessData | undefined = myFitnessData[0];

  // Navigation items for sidebar
  const navigationItems = [
    { id: "overview", label: "Dashboard", icon: Home },
    { id: "appointments", label: "Appointments", icon: Calendar },
    { id: "book-appointment", label: "Book Appointment", icon: Plus },
    { id: "health", label: "Fitness Tracker", icon: Activity },
    { id: "ai-companion", label: "AI Insights", icon: Brain },
    { id: "queue", label: "Queue Status", icon: Users },
    { id: "medical-records", label: "Medical Records", icon: FileText },
    { id: "prescriptions", label: "Prescriptions", icon: Pill },
    { id: "knowledge", label: "Articles & Knowledge", icon: BookOpen },
    { id: "activity", label: "Activity", icon: Clock },
    { id: "chat", label: "Internal Chat", icon: MessageCircle },
    { id: "profile", label: "Profile", icon: User },
    { id: "settings", label: "Settings", icon: Cog }
  ];

  // Handle profile image upload
  const handleProfileImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check if file is an image
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB');
      return;
    }

    setIsUploading(true);

    try {
      // Convert image to base64
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Image = reader.result as string;

        // Update profile image in state
        setProfileImage(base64Image);

        // Update profile image in backend
        const { data, error } = await authService.updateProfile({
          profileImage: base64Image
        });

        if (data && !error) {
          // Update local storage
          const storedUser = localStorage.getItem("user");
          if (storedUser) {
            const userData = JSON.parse(storedUser);
            userData.profileImage = base64Image;
            localStorage.setItem("user", JSON.stringify(userData));
          }

          // Reload the page to reflect changes
          window.location.reload();

          console.log("Profile image updated successfully");
        } else {
          console.error("Error updating profile image:", error);
          alert("Failed to update profile image");
          // Revert to previous image
          setProfileImage(user?.profileImage || null);
        }
      };

      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Error uploading profile image:", error);
      alert("Failed to upload profile image");
      // Revert to previous image
      setProfileImage(user?.profileImage || null);
    } finally {
      setIsUploading(false);
      // Reset file input
      event.target.value = '';
    }
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Function to generate and download appointment PDF
  const downloadAppointmentPDF = (appointment: Appointment) => {
    // Create new PDF document with better formatting
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    const margin = 20;
    const contentWidth = pageWidth - 2 * margin;

    // Add hospital header with professional styling
    doc.setFillColor(0, 102, 204);
    doc.rect(0, 0, pageWidth, 35, 'F');

    doc.setFontSize(24);
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.text("SEVA ONLINE MEDICAL CENTER", pageWidth / 2, 15, { align: "center" });

    doc.setFontSize(14);
    doc.text("Advanced Healthcare Solutions", pageWidth / 2, 25, { align: "center" });

    doc.setFontSize(12);
    doc.text("Phone: +1 (555) 123-4567  |  Email: info@sevaonline.com", pageWidth / 2, 32, { align: "center" });

    // Add horizontal line
    doc.setDrawColor(0, 102, 204);
    doc.setLineWidth(0.5);
    doc.line(margin, 40, pageWidth - margin, 40);

    // Add appointment title
    doc.setFontSize(20);
    doc.setTextColor(0, 102, 204);
    doc.setFont("helvetica", "bold");
    doc.text("APPOINTMENT CONFIRMATION", pageWidth / 2, 50, { align: "center" });

    // Add confirmation details
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "normal");
    doc.text(`Confirmation #: ${appointment.id?.substring(0, 8) || "N/A"}`, margin, 58);
    doc.text(`Date Generated: ${new Date().toLocaleDateString()}`, pageWidth - margin, 58, { align: "right" });

    // Add patient information section with table
    doc.setFontSize(16);
    doc.setTextColor(0, 102, 204);
    doc.setFont("helvetica", "bold");
    doc.text("Patient Information", margin, 70);

    // Draw patient info table
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "normal");

    const patientTableY = 75;
    const rowHeight = 7;

    // Table header
    doc.setFillColor(240, 240, 240);
    doc.rect(margin, patientTableY, contentWidth, rowHeight, 'F');
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "bold");
    doc.text("Field", margin + 2, patientTableY + 5);
    doc.text("Details", margin + contentWidth / 2 + 2, patientTableY + 5);

    // Table rows
    doc.setFont("helvetica", "normal");
    const patientData = [
      ["Full Name", user?.name || "N/A"],
      ["Age", user?.age ? `${user.age} years` : "N/A"],
      ["Phone", user?.phone || "Not provided"],
      ["Email", user?.email || "Not provided"],
      ["Address", user?.address || "Not provided"]
    ];

    patientData.forEach((row, index) => {
      const rowY = patientTableY + rowHeight * (index + 1);
      doc.rect(margin, rowY, contentWidth / 2, rowHeight);
      doc.rect(margin + contentWidth / 2, rowY, contentWidth / 2, rowHeight);
      doc.text(row[0], margin + 2, rowY + 5);
      doc.text(row[1], margin + contentWidth / 2 + 2, rowY + 5);
    });

    // Add appointment details section with table
    const appointmentTableY = patientTableY + rowHeight * (patientData.length + 1) + 10;

    doc.setFontSize(16);
    doc.setTextColor(0, 102, 204);
    doc.setFont("helvetica", "bold");
    doc.text("Appointment Details", margin, appointmentTableY - 5);

    // Draw appointment info table
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "normal");

    // Table header
    doc.setFillColor(240, 240, 240);
    doc.rect(margin, appointmentTableY, contentWidth, rowHeight, 'F');
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "bold");
    doc.text("Field", margin + 2, appointmentTableY + 5);
    doc.text("Details", margin + contentWidth / 2 + 2, appointmentTableY + 5);

    // Status mapping as per project specification
    const statusMap: Record<string, string> = {
      'scheduled': 'Pending',
      'in-progress': 'Approved',
      'completed': 'Completed',
      'cancelled': 'Cancelled'
    };

    // Priority mapping
    const priorityMap: Record<string, string> = {
      'routine': 'Routine',
      'urgent': 'Urgent',
      'critical': 'Critical'
    };

    // Table rows
    doc.setFont("helvetica", "normal");
    const appointmentData = [
      ["Appointment ID", appointment.id?.substring(0, 8) || "N/A"],
      ["Date", new Date(appointment.scheduledAt).toLocaleDateString()],
      ["Time", new Date(appointment.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })],
      ["Doctor", `Dr. ${appointment.doctorId || "Not assigned"}`],
      ["Status", statusMap[appointment.status || ""] || appointment.status?.charAt(0).toUpperCase() + (appointment.status?.slice(1) || "")],
      ["Priority", priorityMap[appointment.priority || ""] || appointment.priority?.charAt(0).toUpperCase() + (appointment.priority?.slice(1) || "")]
    ];

    appointmentData.forEach((row, index) => {
      const rowY = appointmentTableY + rowHeight * (index + 1);
      doc.rect(margin, rowY, contentWidth / 2, rowHeight);
      doc.rect(margin + contentWidth / 2, rowY, contentWidth / 2, rowHeight);
      doc.text(row[0], margin + 2, rowY + 5);
      doc.text(row[1], margin + contentWidth / 2 + 2, rowY + 5);
    });

    // Add symptoms section
    const symptomsY = appointmentTableY + rowHeight * (appointmentData.length + 1) + 10;

    doc.setFontSize(16);
    doc.setTextColor(0, 102, 204);
    doc.setFont("helvetica", "bold");
    doc.text("Symptoms", margin, symptomsY - 5);

    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "normal");

    const symptoms = appointment.symptoms || "Not provided";
    const splitSymptoms = doc.splitTextToSize(symptoms, contentWidth - 10);
    doc.setFillColor(248, 248, 248);
    doc.rect(margin, symptomsY, contentWidth, Math.max(15, splitSymptoms.length * 7 + 10), 'F');
    doc.text(splitSymptoms, margin + 5, symptomsY + 10);

    // Add notes section if available
    let notesY = symptomsY + Math.max(15, splitSymptoms.length * 7 + 10) + 10;
    if (appointment.notes) {
      doc.setFontSize(16);
      doc.setTextColor(0, 102, 204);
      doc.setFont("helvetica", "bold");
      doc.text("Additional Notes", margin, notesY - 5);

      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.setFont("helvetica", "normal");

      const splitNotes = doc.splitTextToSize(appointment.notes, contentWidth - 10);
      doc.setFillColor(248, 248, 248);
      doc.rect(margin, notesY, contentWidth, Math.max(15, splitNotes.length * 7 + 10), 'F');
      doc.text(splitNotes, margin + 5, notesY + 10);

      notesY += Math.max(15, splitNotes.length * 7 + 10) + 10;
    }

    // Add important instructions section
    const instructionsY = notesY + 5;

    doc.setFontSize(16);
    doc.setTextColor(0, 102, 204);
    doc.setFont("helvetica", "bold");
    doc.text("Important Information", margin, instructionsY);

    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "normal");

    const instructions = [
      "• Please arrive 15 minutes before your scheduled appointment time",
      "• Bring a valid photo ID and your insurance card if applicable",
      `• ${priorityMap[appointment.priority || ""] === "Critical" ? "This is a critical appointment - please prioritize accordingly" : "If you need to reschedule, please contact us at least 24 hours in advance"}`,
      "• In case of emergency, please proceed to the nearest emergency room"
    ];

    instructions.forEach((instruction, index) => {
      doc.text(instruction, margin + 5, instructionsY + 10 + (index * 7));
    });

    // Add footer
    const footerY = instructionsY + 10 + (instructions.length * 7) + 15;

    doc.setDrawColor(200, 200, 200);
    doc.line(margin, footerY, pageWidth - margin, footerY);

    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text("This appointment confirmation is automatically generated and does not require a signature.", pageWidth / 2, footerY + 10, { align: "center" });
    doc.text("Please keep this document for your records.", pageWidth / 2, footerY + 17, { align: "center" });

    // Add page number
    doc.text(`Page 1 of 1`, pageWidth - margin, pageHeight - 10, { align: "right" });

    // Save the PDF
    const fileName = `appointment_${user?.name?.replace(/\s+/g, "_") || "patient"}_${new Date(appointment.scheduledAt).toISOString().split("T")[0]}.pdf`;
    doc.save(fileName);
  };

  return (
    <div className="flex h-screen w-full bg-slate-50 text-slate-900 overflow-hidden font-sans selection:bg-blue-500/30">
      {/* Blurry overlay when sidebar is open */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Comprehensive Sidebar */}
      <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} fixed inset-y-0 left-0 z-50 w-72 bg-blue-800 border-r border-blue-700 transition-transform duration-500 cubic-bezier(0.4, 0, 0.2, 1) lg:translate-x-0 lg:static lg:inset-0 shadow-[20px_0_50px_rgba(0,0,0,0.1)]`}>
        <div className="flex items-center justify-between p-6 border-b border-blue-700 bg-blue-800/50 backdrop-blur-xl">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center">
              <img
                src="/sevamed logo.png"
                alt="SevaMed Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <span className="text-lg sm:text-xl font-bold">SevaMed HMS</span>
              <p className="text-[10px] sm:text-xs text-blue-200">Healthcare Management</p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-white hover:text-gray-200"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="px-6 py-4">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 h-4 w-4 group-focus-within:text-blue-400 transition-colors" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-blue-700/50 border border-blue-600/50 text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 transition-all duration-300"
              onChange={(e) => {
                console.log("Searching for:", e.target.value);
              }}
            />
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 overflow-y-auto overflow-x-hidden custom-scrollbar">
          <div className="space-y-1.5">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center px-4 py-3.5 text-left rounded-xl transition-all duration-300 group relative ${isActive
                    ? 'bg-blue-600 text-white shadow-[0_10px_20px_rgba(37,99,235,0.3)] scale-[1.02]'
                    : 'text-blue-100 hover:bg-white/10 hover:text-white'
                    }`}
                >
                  <Icon className={`h-5 w-5 mr-3.5 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110 group-hover:text-blue-400'}`} />
                  <span className="font-medium tracking-wide">{t(item.label.toLowerCase().replace(/\s+/g, "_")) || item.label}</span>
                  {isActive && (
                    <div className="absolute left-0 w-1.5 h-6 bg-white rounded-r-full shadow-[0_0_10px_white]" />
                  )}
                </button>
              );
            })}
          </div>
        </nav>

        <div className="p-6 border-t border-blue-700 bg-blue-800/50 backdrop-blur-xl">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="relative group cursor-pointer">
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt={user.name}
                    className="w-12 h-12 rounded-2xl object-cover border-2 border-white/10 shadow-lg group-hover:border-blue-500/50 transition-all duration-300"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:shadow-blue-500/20 transition-all duration-300">
                    {user?.name?.charAt(0).toUpperCase() || "U"}
                  </div>
                )}
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-4 border-blue-800 shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
              </div>
              <div className="ml-4 overflow-hidden">
                <p className="text-sm font-bold truncate text-white">{user?.name}</p>
                <p className="text-xs text-blue-200 font-semibold tracking-wider uppercase">Premium Patient</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-slate-400 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all h-10 w-10 p-0 hidden sm:flex items-center justify-center"
              title="Logout"
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>

          <Button
            onClick={handleLogout}
            className="w-full mb-6 py-6 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-2xl flex items-center justify-center shadow-none transition-colors group"
          >
            <LogOut className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
            Secure Logout
          </Button>

          {/* Health Status Section in Sidebar */}
          <div className="mb-6 bg-blue-700/20 rounded-2xl p-4 border border-blue-600/30 space-y-3">
            <h3 className="text-[10px] font-black text-blue-200 uppercase tracking-[0.2em]">Live Vitals</h3>
            <div className="space-y-2.5">
              <div className="flex justify-between items-center text-xs">
                <div className="flex items-center text-slate-400">
                  <Heart className="h-3 w-3 mr-2 text-rose-500" />
                  <span>Heart Rate</span>
                </div>
                <span className="font-bold text-slate-200">{latestVitals?.heartRate || 72} <span className="text-[10px] text-slate-500 font-normal">bpm</span></span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <div className="flex items-center text-slate-400">
                  <Activity className="h-3 w-3 mr-2 text-blue-500" />
                  <span>Overall Status</span>
                </div>
                <Badge variant="outline" className="text-[10px] h-5 bg-blue-500/10 text-blue-400 border-blue-500/20">Optimal</Badge>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <select
              className="flex-1 bg-blue-700/50 border border-blue-600/50 text-blue-100 text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400/50 appearance-none cursor-pointer hover:bg-blue-700 transition-colors"
              value={t("language_code") || "en"}
              onChange={(e) => { }}
            >
              <option value="en">English (US)</option>
              <option value="te">తెలుగు (Telugu)</option>
              <option value="hi">हिंदी (Hindi)</option>
            </select>
            <div className="w-10 h-10 bg-blue-700/50 border border-blue-600/50 rounded-xl flex items-center justify-center text-blue-200 hover:text-white cursor-pointer transition-colors">
              <Settings className="h-4 w-4" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden w-full">
        {/* Header - Single header with glassmorphism */}
        <header className="bg-white/80 backdrop-blur-xl z-30 border-b border-slate-200 sticky top-0">
          <div className="flex items-center justify-between p-6">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden mr-6 text-slate-500 hover:text-blue-600 transition-colors duration-200 p-2 hover:bg-blue-50 rounded-xl"
              >
                <Menu className="h-6 w-6" />
              </button>
              <div className="hidden sm:block">
                <div className="flex items-center gap-3 mb-1">
                  <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                    {user?.name?.split(' ')[0]}'s Command Center
                  </h1>
                  <Badge className="bg-blue-600/10 text-blue-600 border-none hover:bg-blue-600/20 transition-colors">v2.0 Beta</Badge>
                </div>
                <p className="text-xs font-bold text-slate-400 tracking-[0.3em] uppercase">
                  System Online ― {currentTime.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short' })}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">


              {/* Notification Panel */}
              {notificationPanelOpen && (
                <div
                  className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm z-40"
                  onClick={() => setNotificationPanelOpen(false)}
                />
              )}

              <div className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  className="relative text-blue-700 hover:text-blue-900 transition-colors duration-200"
                  onClick={() => setNotificationPanelOpen(!notificationPanelOpen)}
                >
                  <Bell className="h-5 w-5" />
                  {notifications > 0 && (
                    <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {notifications}
                    </span>
                  )}
                </Button>

                {/* Notification Dropdown */}
                {notificationPanelOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl z-50 border border-blue-100">
                    <div className="p-4 border-b border-blue-100 bg-blue-50">
                      <h3 className="font-semibold text-blue-900">Notifications</h3>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {/* Sample notifications */}
                      <div className="p-4 border-b border-blue-50 hover:bg-blue-50 cursor-pointer">
                        <div className="flex items-start">
                          <div className="flex-shrink-0">
                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                              <Calendar className="h-4 w-4 text-blue-600" />
                            </div>
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-blue-900">Appointment Reminder</p>
                            <p className="text-sm text-blue-600">Your appointment with Dr. Smith is tomorrow at 10:00 AM</p>
                            <p className="text-xs text-blue-400 mt-1">2 hours ago</p>
                          </div>
                        </div>
                      </div>
                      <div className="p-4 border-b border-blue-50 hover:bg-blue-50 cursor-pointer">
                        <div className="flex items-start">
                          <div className="flex-shrink-0">
                            <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
                              <Pill className="h-4 w-4 text-amber-600" />
                            </div>
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-blue-900">Medication Reminder</p>
                            <p className="text-sm text-blue-600">Time to take your daily medication</p>
                            <p className="text-xs text-blue-400 mt-1">5 hours ago</p>
                          </div>
                        </div>
                      </div>
                      <div className="p-4 border-b border-blue-50 hover:bg-blue-50 cursor-pointer">
                        <div className="flex items-start">
                          <div className="flex-shrink-0">
                            <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                              <FileText className="h-4 w-4 text-purple-600" />
                            </div>
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-blue-900">Lab Results Available</p>
                            <p className="text-sm text-blue-600">Your blood test results are now available</p>
                            <p className="text-xs text-blue-400 mt-1">1 day ago</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 bg-blue-50 text-center">
                      <button
                        className="text-sm font-medium text-blue-700 hover:text-blue-900"
                        onClick={() => {
                          setNotifications(0);
                          setNotificationPanelOpen(false);
                        }}
                      >
                        Mark all as read
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center">
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover border-2 border-blue-300"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white text-sm font-bold border-2 border-blue-300">
                    {user?.name?.charAt(0).toUpperCase() || "U"}
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Content Area with professional white theme */}
        <main className="flex-1 overflow-y-auto p-8 bg-slate-100/30 w-full custom-scrollbar relative">
          {/* Softer background glows */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/5 blur-[120px] -z-10" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-600/5 blur-[120px] -z-10" />

          {activeTab === "overview" && (
            <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
              {/* AI Health Assistant - Hero Section */}
              <div className="relative group overflow-visible">
                {/* Enhanced deep but soft background glows */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-indigo-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 blur-3xl -z-10" />
                <div className="relative bg-white/90 backdrop-blur-md border border-slate-200/60 p-0 rounded-[2.5rem] shadow-[0_20px_50px_rgba(30,41,59,0.05)] group-hover:shadow-[0_40px_80px_rgba(30,41,59,0.1)] transition-all duration-700 overflow-hidden min-h-[420px]">

                  <div className="flex flex-col lg:flex-row h-full min-h-[420px]">
                    {/* Left Column: Text Content */}
                    <div className="flex-1 p-10 flex flex-col justify-center relative z-10">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 bg-blue-50 rounded-2xl border border-blue-100">
                          <Brain className="h-7 w-7 text-blue-600" />
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                          {t("ai_assistant")}
                        </h3>
                      </div>

                      <div className="relative h-48">
                        {healthFacts.map((fact, index) => (
                          <div
                            key={index}
                            className={`absolute inset-0 transition-all duration-1000 transform ${index === currentSlide
                              ? "opacity-100 translate-y-0 scale-100"
                              : "opacity-0 translate-y-4 scale-95 pointer-events-none"
                              }`}
                          >
                            <h4 className="text-blue-600 font-black text-xs uppercase tracking-[0.3em] mb-4">
                              {fact.title}
                            </h4>
                            <p className="text-slate-600 text-xl font-bold leading-relaxed max-w-xl italic">
                              "{fact.description}"
                            </p>
                          </div>
                        ))}
                      </div>

                      <div className="flex items-center gap-6 mt-8">


                        <div className="flex gap-2">
                          {healthFacts.map((_, i) => (
                            <button
                              key={i}
                              onClick={() => setCurrentSlide(i)}
                              className={`h-2 rounded-full transition-all duration-700 ${i === currentSlide
                                ? "w-10 bg-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.5)]"
                                : "w-2 bg-slate-200 hover:bg-slate-300"
                                }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Right Column: Sliding Images with premium effects */}
                    <div className="w-full lg:w-[45%] relative h-[320px] lg:h-auto overflow-hidden">
                      {healthFacts.map((fact, index) => (
                        <div
                          key={index}
                          className={`absolute inset-0 transition-all duration-1000 transform ${index === currentSlide ? "opacity-100 scale-100 rotate-0" : "opacity-0 scale-110 rotate-1"
                            }`}
                        >
                          <img
                            src={fact.image}
                            alt={fact.title}
                            loading="lazy"
                            className="w-full h-full object-cover transition-transform duration-[10000ms] ease-out"
                            style={{
                              transitionDuration: index === currentSlide ? '10000ms' : '1000ms',
                              transform: index === currentSlide ? 'scale(1.1)' : 'scale(1)'
                            }}
                          />
                          {/* Premium Gradient Overlay */}
                          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/10 to-transparent lg:block hidden" />
                          <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent lg:hidden block" />
                          <div className="absolute inset-0 ring-1 ring-inset ring-black/5 rounded-[2.5rem] lg:rounded-none" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Quick Stats */}
                <div className="lg:col-span-2 space-y-8">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <Card className="bg-white border border-slate-200 hover:border-blue-400 transition-all duration-500 group/stat rounded-[2rem] overflow-hidden shadow-sm">
                      <CardContent className="p-8 relative">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/5 rounded-full blur-2xl group-hover/stat:bg-rose-500/10 transition-all" />
                        <div className="flex flex-col gap-4">
                          <div className="p-3 bg-rose-500/10 rounded-2xl w-fit border border-rose-500/20 group-hover/stat:scale-110 transition-transform duration-500">
                            <Heart className="h-6 w-6 text-rose-500" />
                          </div>
                          <div>
                            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Heart Pulse</p>
                            <p className="text-3xl font-black text-slate-900">
                              {latestVitals?.heartRate || 72} <span className="text-xs font-medium text-slate-400">BPM</span>
                            </p>
                          </div>
                          <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold">
                            <TrendingUp className="h-3 w-3" />
                            <span>Normal Range</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-white border border-slate-200 hover:border-amber-400 transition-all duration-500 group/stat rounded-[2rem] overflow-hidden shadow-sm">
                      <CardContent className="p-8 relative">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl group-hover/stat:bg-amber-500/10 transition-all" />
                        <div className="flex flex-col gap-4">
                          <div className="p-3 bg-amber-500/10 rounded-2xl w-fit border border-amber-500/20 group-hover/stat:scale-110 transition-transform duration-500">
                            <Thermometer className="h-6 w-6 text-amber-500" />
                          </div>
                          <div>
                            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Core Temp</p>
                            <p className="text-3xl font-black text-slate-900">98.6<span className="text-xs font-medium text-slate-400">°F</span></p>
                          </div>
                          <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold">
                            <UserCheck className="h-3 w-3" />
                            <span>Stable</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-white border border-slate-200 hover:border-purple-400 transition-all duration-500 group/stat rounded-[2rem] overflow-hidden shadow-sm">
                      <CardContent className="p-8 relative">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-full blur-2xl group-hover/stat:bg-purple-500/10 transition-all" />
                        <div className="flex flex-col gap-4">
                          <div className="p-3 bg-purple-500/10 rounded-2xl w-fit border border-purple-500/20 group-hover/stat:scale-110 transition-transform duration-500">
                            <Scale className="h-6 w-6 text-purple-500" />
                          </div>
                          <div>
                            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Body Weight</p>
                            <p className="text-3xl font-black text-slate-900">
                              {patient?.weight || "72"} <span className="text-xs font-medium text-slate-400">KG</span>
                            </p>
                          </div>
                          <div className="flex items-center gap-2 text-slate-400 text-xs font-bold">
                            <Clock className="h-3 w-3" />
                            <span>Last Sync Today</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Fitness Tracker */}
                  <div className="bg-white rounded-xl shadow-lg p-6 border border-blue-200">
                    <FitnessTracker />
                  </div>
                </div>

                {/* Fast Actions */}
                <div className="space-y-8">
                  <Card className="bg-white border border-slate-200 rounded-[2.5rem] p-4 shadow-sm">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-lg font-black text-slate-900 flex items-center gap-3">
                        <TrendingUp className="h-5 w-5 text-emerald-500" />
                        <span>Fast Protocol</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4">
                        {[
                          { id: "book-appointment", label: "Scheduler", icon: Calendar, color: "blue" },
                          { id: "queue", label: "Live Queue", icon: Users, color: "indigo" },
                          { id: "medical-records", label: "Archives", icon: FileText, color: "purple" },
                          { id: "prescriptions", label: "Pharmacy", icon: Pill, color: "amber" }
                        ].map((action) => (
                          <Button
                            key={action.id}
                            variant="outline"
                            className={`h-24 flex flex-col items-center justify-center gap-3 rounded-[2rem] bg-slate-50 border-slate-100 hover:bg-${action.color}-50 hover:border-${action.color}-200 transition-all duration-500 group/btn shadow-none`}
                            onClick={() => setActiveTab(action.id)}
                          >
                            <div className={`p-2.5 rounded-2xl bg-${action.color}-100 group-hover/btn:scale-110 transition-transform`}>
                              <action.icon className={`h-6 w-6 text-${action.color}-600 group-hover/btn:text-${action.color}-700`} />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover/btn:text-slate-600">{action.label}</span>
                          </Button>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          )}

          {activeTab === "ai-companion" && (
            <div className="bg-white rounded-xl shadow-lg p-6 border border-blue-200">
              <InteractiveAIInsights />
            </div>
          )}

          {activeTab === "appointments" && (
            <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                <div>
                  <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Clinical Schedule</h2>
                  <p className="text-slate-400 font-bold text-xs uppercase tracking-[0.2em]">Active & Historical Appointments</p>
                </div>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-2xl px-8 py-6 font-bold shadow-[0_10px_30px_rgba(37,99,235,0.3)] transition-all duration-300 hover:scale-105"
                  onClick={() => setActiveTab("book-appointment")}>
                  <Plus className="h-5 w-5 mr-2" />
                  New Reservation
                </Button>
              </div>

              {myAppointments.length === 0 ? (
                <div className="bg-white border border-slate-200 rounded-[3rem] p-20 text-center shadow-sm">
                  <div className="w-24 h-24 bg-slate-50 rounded-[2rem] flex items-center justify-center mx-auto mb-8 border border-slate-100">
                    <Calendar className="h-10 w-10 text-slate-400" />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 mb-4">No Active Sessions</h3>
                  <p className="text-slate-500 mb-10 max-w-md mx-auto leading-relaxed">Your medical itinerary is currently clear. Initialize a new consultation to speak with our specialists.</p>
                  <Button className="bg-blue-600 text-white hover:bg-blue-700 rounded-2xl px-10 py-6 font-bold transition-all shadow-lg"
                    onClick={() => setActiveTab("book-appointment")}>
                    Secure Next Open Slot
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6">
                  {myAppointments
                    .sort((a, b) => new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime())
                    .map((apt, index) => (
                      <div
                        key={apt.id || index}
                        className="group relative bg-white border border-slate-200 p-8 rounded-[2.5rem] hover:bg-slate-50 transition-all duration-500 hover:border-blue-400 overflow-hidden cursor-pointer shadow-sm"
                      >
                        {/* Status indicator glow */}
                        <div className={`absolute top-0 left-0 w-2 h-full ${apt.status === "completed" ? "bg-emerald-500" :
                          apt.status === "in-progress" ? "bg-blue-500" :
                            apt.status === "scheduled" ? "bg-indigo-500" :
                              apt.status === "pending" ? "bg-amber-500" : "bg-slate-700"
                          } opacity-50 shadow-[0_0_20px_rgba(37,99,235,0.3)]`} />

                        <div className="flex flex-col lg:flex-row justify-between gap-10">
                          <div className="flex-1 flex gap-8">
                            <div className="flex flex-col items-center justify-center min-w-[80px] h-[80px] bg-slate-50 rounded-3xl border border-slate-100 group-hover:border-blue-100 transition-colors shadow-none">
                              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{new Date(apt.scheduledAt).toLocaleDateString('en-IN', { month: 'short' })}</span>
                              <span className="text-3xl font-black text-slate-900">{new Date(apt.scheduledAt).toLocaleDateString('en-IN', { day: '2-digit' })}</span>
                            </div>

                            <div className="space-y-3">
                              <div className="flex items-center gap-3">
                                <h3 className="text-xl font-black text-slate-900">Dr. {getDoctorName(apt.doctorId)}</h3>
                                <Badge className={`rounded-xl px-3 py-1 text-[10px] font-black uppercase tracking-widest border-none ${apt.status === "completed" ? "bg-emerald-500/20 text-emerald-400" :
                                  apt.status === "in-progress" ? "bg-blue-500/20 text-blue-400" :
                                    apt.status === "scheduled" ? "bg-indigo-500/20 text-indigo-400" :
                                      apt.status === "pending" ? "bg-amber-500/20 text-amber-500" : "bg-slate-800 text-slate-400"
                                  }`}>
                                  {apt.status === "scheduled" ? "Pipeline" :
                                    apt.status === "in-progress" ? "Active" :
                                      apt.status === "pending" ? "Payment Required" : apt.status}
                                </Badge>
                              </div>
                              <p className="text-slate-600 font-medium leading-relaxed max-w-2xl">{apt.symptoms || "Standard Diagnostic Procedure"}</p>

                              <div className="flex flex-wrap gap-6 mt-4">
                                <div className="flex items-center text-slate-500 bg-slate-50 px-4 py-2 rounded-xl text-xs font-bold border border-slate-100 shadow-none">
                                  <Clock className="h-3.5 w-3.5 mr-2 text-blue-600" />
                                  <span>{new Date(apt.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                </div>
                                <div className="flex items-center text-slate-500 bg-slate-50 px-4 py-2 rounded-xl text-xs font-bold border border-slate-100 shadow-none">
                                  <AlertCircle className="h-3.5 w-3.5 mr-2 text-rose-500" />
                                  <span className="uppercase tracking-widest">{apt.priority}</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-row lg:flex-col justify-end items-center lg:items-end gap-4 min-w-[200px]">
                            {apt.status === "pending" ? (
                              <Button
                                className="bg-amber-500 hover:bg-amber-600 text-white rounded-2xl px-6 py-4 flex-1 lg:flex-none shadow-lg shadow-amber-500/20 animate-pulse"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigate("/billing");
                                  toast({
                                    title: "Payment Gateway",
                                    description: "Redirecting to your medical bills. Please select the latest pending invoice to complete your payment.",
                                    className: "bg-blue-50 border-blue-200 text-blue-800 shadow-md"
                                  });
                                }}
                              >
                                <Zap className="h-4 w-4 mr-2" />
                                Pay Online
                              </Button>
                            ) : (
                              <Button
                                variant="outline"
                                className="bg-white border-slate-200 text-slate-600 hover:bg-blue-50 hover:text-blue-600 rounded-2xl px-6 py-4 flex-1 lg:flex-none transition-all group/pdf"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  downloadAppointmentPDF(apt);
                                }}
                              >
                                <Download className="h-4 w-4 mr-2 group_hover/pdf:text-blue-600 transition-colors" />
                                Diagnostic PDF
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              className="text-slate-400 hover:text-slate-600 rounded-2xl px-6 py-4 flex-1 lg:flex-none font-bold text-xs uppercase tracking-widest"
                              onClick={(e) => {
                                e.stopPropagation();
                                if (apt.status === "pending") {
                                  toast({
                                    title: "Reception Visit",
                                    description: "Please visit the nearest reception to complete your appointment booking and finalize payment.",
                                    className: "bg-blue-50 border-blue-200 text-blue-800"
                                  });
                                }
                              }}
                            >
                              {apt.status === "pending" ? "Visit Reception" : "Brief Details"}
                            </Button>
                            {(apt.status === "pending" || apt.status === "scheduled") && (
                              <Button
                                variant="ghost"
                                className="text-rose-500 hover:text-rose-600 hover:bg-rose-50 rounded-2xl px-6 py-4 flex-1 lg:flex-none font-bold text-xs uppercase tracking-widest"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleCancelAppointment(apt.id || apt._id!);
                                }}
                                disabled={cancelAppointmentMutation.isPending}
                              >
                                {cancelAppointmentMutation.isPending ? "Cancelling..." : "Cancel"}
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "book-appointment" && (
            <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="mb-10">
                <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-2">New Consultation</h2>
                <p className="text-slate-400 font-bold text-xs uppercase tracking-[0.2em]">Secure your next session with our medical experts</p>
              </div>
              <div className="bg-white border border-slate-200 p-10 rounded-[3rem] shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100 rounded-full blur-3xl opacity-50" />
                <AppointmentForm onSuccess={() => {
                  setActiveTab("appointments");
                  toast({
                    title: "Medical Itinerary Updated",
                    description: "Your new appointment has been logged. Please complete payment to finalize.",
                    className: "bg-emerald-50 border-emerald-200 text-emerald-800 shadow-lg"
                  });
                }} />
              </div>
            </div>
          )}

          {activeTab === "queue" && (
            <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="mb-10">
                <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Real-Time Queue</h2>
                <p className="text-slate-400 font-bold text-xs uppercase tracking-[0.2em]">Live operational status of clinical workflow</p>
              </div>
              <div className="bg-white border border-slate-200 p-10 rounded-[3rem] shadow-sm">
                <QueueStatus />
              </div>
            </div>
          )}

          {activeTab === "medical-records" && (
            <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="mb-10">
                <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Medical Archives</h2>
                <p className="text-slate-400 font-bold text-xs uppercase tracking-[0.2em]">Verified clinical history & diagnostic data</p>
              </div>
              <div className="bg-white border border-slate-200 p-10 rounded-[3rem] shadow-sm">
                <MedicalRecords />
              </div>
            </div>
          )}

          {activeTab === "prescriptions" && (
            <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="mb-10">
                <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Pharmacy Ledger</h2>
                <p className="text-slate-400 font-bold text-xs uppercase tracking-[0.2em]">Active medications & pharmaceutical history</p>
              </div>
              <div className="bg-white border border-slate-200 p-10 rounded-[3rem] shadow-sm">
                <Prescriptions />
              </div>
            </div>
          )}

          {activeTab === "health" && (
            <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="flex justify-between items-center">
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">Biometric Analytics</h2>
                <Button variant="outline" className="bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-blue-600 rounded-2xl px-6 py-4 transition-all">
                  <Plus className="h-4 w-4 mr-2 text-blue-600" />
                  Manual Sync
                </Button>
              </div>
              <div className="bg-white border border-slate-200 p-10 rounded-[3rem] shadow-sm">
                <FitnessTracker />
              </div>
            </div>
          )}

          {activeTab === "knowledge" && (
            <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="flex justify-between items-center">
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">Medical Articles Repository</h2>
                <Button variant="outline" className="bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-blue-600 rounded-2xl px-6 py-4 transition-all">
                  <BookOpen className="h-4 w-4 mr-2 text-purple-600" />
                  Browse Repository
                </Button>
              </div>
              <div className="bg-white border border-slate-200 p-10 rounded-[3rem] shadow-sm">
                <KnowledgeWidget />
              </div>
            </div>
          )}

          {activeTab === "activity" && (
            <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="flex justify-between items-center">
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">Interaction Metrics</h2>
                <Button variant="outline" className="bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-blue-600 rounded-2xl px-6 py-4 transition-all">
                  <User className="h-4 w-4 mr-2 text-emerald-600" />
                  Export Log
                </Button>
              </div>
              <div className="bg-white border border-slate-200 p-10 rounded-[3rem] shadow-sm">
                <ActivityLog />
              </div>
            </div>
          )}

          {activeTab === "chat" && (
            <div className="max-w-7xl mx-auto h-[calc(100vh-200px)] flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="mb-10">
                <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Secure Comms</h2>
                <p className="text-slate-400 font-bold text-xs uppercase tracking-[0.2em]">Encrypted internal medical communications</p>
              </div>
              <div className="flex-1 bg-white border border-slate-200 p-10 rounded-[3rem] shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-pink-100 rounded-full blur-3xl -z-10 opacity-50" />
                <ChatInterface />
              </div>
            </div>
          )}

          {activeTab === "profile" && (
            <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="mb-10">
                <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Subject Metadata</h2>
                <p className="text-slate-400 font-bold text-xs uppercase tracking-[0.2em]">Secure identification & clinical identifiers</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Profile Picture and Basic Info */}
                <div className="lg:col-span-1">
                  <Card className="bg-white border border-slate-200 rounded-[3rem] overflow-hidden shadow-sm">
                    <CardContent className="p-10">
                      <div className="flex flex-col items-center">
                        {/* Profile Picture */}
                        <div className="relative mb-8 pt-4">
                          <div className="absolute inset-0 bg-blue-100 blur-[40px] rounded-full opacity-50" />
                          {profileImage ? (
                            <img
                              src={profileImage}
                              alt={user.name}
                              className="relative w-40 h-40 rounded-[2.5rem] object-cover shadow-xl border-4 border-white"
                            />
                          ) : (
                            <div className="relative w-40 h-40 rounded-[2.5rem] bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white text-5xl font-black shadow-xl border-4 border-white">
                              {user?.name?.charAt(0).toUpperCase() || "U"}
                            </div>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            className="absolute bottom-2 right-2 rounded-2xl w-12 h-12 p-0 bg-blue-600 border-none text-white hover:bg-blue-700 hover:scale-110 shadow-xl transition-all"
                            onClick={() => {
                              document.getElementById('profile-image-upload-settings')?.click();
                            }}
                          >
                            <User className="h-5 w-5" />
                          </Button>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleProfileImageUpload}
                            disabled={isUploading}
                            className="hidden"
                            id="profile-image-upload-settings"
                          />
                        </div>

                        <h3 className="text-2xl font-black text-center text-slate-900 mb-2">{user?.name}</h3>
                        <p className="text-blue-600 font-bold text-xs tracking-[0.1em] uppercase bg-blue-50 px-4 py-1.5 rounded-full mb-8">Patient ID: {patient?.id?.substring(0, 8) || "N/A"}</p>

                        <div className="w-full space-y-4">
                          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                            <div className="flex items-center text-slate-500">
                              <UserCheck className="h-4 w-4 mr-3 text-blue-600" />
                              <span className="text-sm font-bold">Role</span>
                            </div>
                            <span className="text-sm font-black text-slate-900">Patient</span>
                          </div>
                          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                            <div className="flex items-center text-slate-500">
                              <Cake className="h-4 w-4 mr-3 text-rose-500" />
                              <span className="text-sm font-bold">Chronology</span>
                            </div>
                            <span className="text-sm font-black text-slate-900">{user?.age || "N/A"} Years</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Detailed Profile Information */}
                <div className="lg:col-span-2">
                  <Card className="bg-white border border-slate-200 rounded-[3rem] overflow-hidden shadow-sm h-full">
                    <CardHeader className="p-10 pb-4">
                      <CardTitle className="text-xl font-black text-slate-900 flex items-center">
                        <User className="h-6 w-6 mr-3 text-blue-600" />
                        Bio-Identification
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-10 grid grid-cols-1 md:grid-cols-2 gap-10">
                      {[
                        { label: "Full Identity", value: user?.name, color: "blue" },
                        { label: "Network Address", value: user?.email, color: "indigo" },
                        { label: "Comms Link", value: user?.phone, color: "purple" },
                        { label: "Timeline", value: user?.age ? `${user.age} solar years` : "N/A", color: "rose" },
                        { label: "Biological Sex", value: user?.gender, color: "emerald" },
                        { label: "Blood Frequency", value: user?.bloodGroup, color: "rose" }
                      ].map((field, i) => (
                        <div key={i} className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{field.label}</label>
                          <p className="text-lg font-bold text-slate-900">{field.value || "Not Verified"}</p>
                          <div className={`h-1 w-12 bg-${field.color}-500/20 rounded-full`} />
                        </div>
                      ))}
                    </CardContent>
                    <div className="px-10 pb-10 mt-auto">
                      <Button
                        className="w-full bg-slate-50 border border-slate-100 text-slate-600 hover:bg-slate-100 hover:text-slate-900 rounded-[2rem] py-8 text-lg font-black transition-all"
                        onClick={() => navigate('/profile/edit')}
                      >
                        Modify Bio-Parameters
                      </Button>
                    </div>
                  </Card>
                </div>
              </div>
            </div>
          )}

          {activeTab === "settings" && (
            <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="mb-10">
                <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-2">System Configuration</h2>
                <p className="text-slate-400 font-bold text-xs uppercase tracking-[0.2em]">Operational parameters & security protocols</p>
              </div>

              <div className="space-y-8">
                <Card className="bg-white border border-slate-200 rounded-[3rem] overflow-hidden shadow-sm">
                  <CardHeader className="p-10 pb-4">
                    <CardTitle className="text-xl font-black text-slate-900 flex items-center">
                      <Lock className="h-6 w-6 mr-3 text-amber-500" />
                      Security Infrastructure
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-10 space-y-8">
                    <div className="flex items-center justify-between p-6 bg-slate-50 rounded-3xl border border-slate-100 group hover:bg-slate-100 transition-all cursor-pointer">
                      <div className="flex items-center">
                        <div className="p-3 bg-blue-50 rounded-2xl mr-4 border border-blue-100">
                          <User className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm font-black text-slate-900">Identity Protection</p>
                          <p className="text-xs text-slate-400 font-bold">Two-Factor Authentication (2FA)</p>
                        </div>
                      </div>
                      <Badge className="bg-emerald-500/20 text-emerald-400 border-none rounded-xl px-4 py-1.5 text-[10px] font-black uppercase tracking-widest">Active</Badge>
                    </div>

                    <div className="flex items-center justify-between p-6 bg-slate-50 rounded-3xl border border-slate-100 group hover:bg-slate-100 transition-all cursor-pointer">
                      <div className="flex items-center">
                        <div className="p-3 bg-purple-50 rounded-2xl mr-4 border border-purple-100">
                          <Bell className="h-6 w-6 text-purple-600" />
                        </div>
                        <div>
                          <p className="text-sm font-black text-slate-900">Signal Alerts</p>
                          <p className="text-xs text-slate-400 font-bold">Management of notification frequency</p>
                        </div>
                      </div>
                      <Button variant="ghost" className="text-slate-500 hover:text-white rounded-xl">Configure</Button>
                    </div>

                    <div className="flex items-center justify-between p-6 bg-slate-50 rounded-3xl border border-slate-100 group hover:bg-rose-50 transition-all cursor-pointer hover:border-rose-200">
                      <div className="flex items-center">
                        <div className="p-3 bg-rose-50 rounded-2xl mr-4 border border-rose-100">
                          <LogOut className="h-6 w-6 text-rose-500" />
                        </div>
                        <div>
                          <p className="text-sm font-black text-slate-900">Terminal Deactivation</p>
                          <p className="text-xs text-slate-400 font-bold">Terminate current session</p>
                        </div>
                      </div>
                      <Button variant="ghost" className="text-rose-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl" onClick={handleLogout}>Execute</Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
