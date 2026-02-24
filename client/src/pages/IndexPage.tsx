import { useState, useEffect, useRef, RefObject } from 'react';
import { useAuth } from "../contexts/AuthContext";
import { useLanguage } from "../contexts/LanguageContext";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import LanguageSelector from "../components/common/LanguageSelector";
import ThemeToggle from "../components/common/ThemeToggle";
import { Heart, Users, Calendar, Activity, Shield, Stethoscope, Mail, Phone, MapPin, Clock, Facebook, Twitter, Linkedin, Instagram, Play, Ambulance, Brain, UserCheck, Clipboard, Zap, Monitor, MessageCircle, Send, X, Bot, Menu, Settings, Info, Contact } from "lucide-react";

const IndexPage: React.FC = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [showAIChat, setShowAIChat] = useState(false);
  const [chatMessages, setChatMessages] = useState<{ role: 'user' | 'assistant', content: string }[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showLoginWarning, setShowLoginWarning] = useState(false);
  const [showStaffWarning, setShowStaffWarning] = useState(false);
  const [staffWarningLoading, setStaffWarningLoading] = useState(false);
  const [showCookieConsent, setShowCookieConsent] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [heroImageIndex, setHeroImageIndex] = useState(0);
  const heroImages = [
    "https://images.unsplash.com/photo-1638202993928-7267aad84c31?auto=format&fit=crop&w=1200&q=80", // Indian Doctor Team
    "https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=1200&q=80", // Hospital hallway
    "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1200&q=80" // Surgery Team
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setHeroImageIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Don't redirect immediately, allow patients to use AI assistant on homepage
  const isPatient = user && user.role === 'patient';
  const shouldRedirect = user && user.role !== 'patient';

  // State for controlling AI chat visibility and interactions
  // All useEffect hooks must be called before any conditional returns
  useEffect(() => {
    if (shouldRedirect) {
      // Only redirect non-patient users
      navigate(`/${user.role}`);
    }
  }, [shouldRedirect, user, navigate]);

  // Check if cookies were already accepted
  useEffect(() => {
    const cookiesAccepted = localStorage.getItem('cookiesAccepted');
    if (cookiesAccepted) {
      setShowCookieConsent(false);
    }
  }, []);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const newMessage = { role: 'user' as const, content: inputMessage };
    setChatMessages(prev => [...prev, newMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI response (replace with actual AI integration)
    setTimeout(() => {
      const aiResponse = generateAIResponse(inputMessage);
      setChatMessages(prev => [...prev, { role: 'assistant', content: aiResponse }]);
      setIsTyping(false);
    }, 1500);
  };

  const handleAIChatToggle = () => {
    // Toggle chat for anyone
    setShowAIChat(!showAIChat);
  };

  const handleLoginWarningClose = () => {
    setShowLoginWarning(false);
  };

  const handleLoginRedirect = () => {
    setShowLoginWarning(false);
    navigate('/login');
  };

  const handleStaffLoginClick = () => {
    setShowStaffWarning(true);
  };

  const handleStaffWarningClose = () => {
    setShowStaffWarning(false);
    setStaffWarningLoading(false);
  };

  const handleStaffWarningProceed = () => {
    setStaffWarningLoading(true);
    setTimeout(() => {
      setShowStaffWarning(false);
      setStaffWarningLoading(false);
      navigate('/staff-login');
    }, 3000);
  };

  const handleAcceptCookies = () => {
    setShowCookieConsent(false);
    localStorage.setItem('cookiesAccepted', 'true');
  };

  const handleDeclineCookies = () => {
    setShowCookieConsent(false);
    localStorage.setItem('cookiesAccepted', 'false');
  };



  const generateAIResponse = (question: string): string => {
    const lowerQuestion = question.toLowerCase();

    if (lowerQuestion.includes('appointment') || lowerQuestion.includes('book')) {
      return "I can help you schedule an appointment! You can log in as a patient to book an appointment with our specialists right away.";
    }

    if (lowerQuestion.includes('emergency') || lowerQuestion.includes('urgent')) {
      return "For medical emergencies, please visit our Level 1 Emergency Department which operates 24/7. Our emergency team is ready to provide immediate life-saving treatment.";
    }

    if (lowerQuestion.includes('location') || lowerQuestion.includes('where') || lowerQuestion.includes('address') || lowerQuestion.includes('city')) {
      return "SevaMed is located in Guntur, Andhra Pradesh, India. Our main campus is easily accessible in the heart of Guntur, serving patients across the state.";
    }

    if (lowerQuestion.includes('service') || lowerQuestion.includes('department')) {
      return "We offer comprehensive services including: Cardiology, Neurology, Orthopedics, Pediatrics, Oncology, and Radiology, using state-of-the-art facilities.";
    }

    if (lowerQuestion.includes('doctor') || lowerQuestion.includes('specialist')) {
      return "Our medical team includes 150+ highly qualified doctors and specialists across various fields to ensure you get the best clinical care possible.";
    }

    if (lowerQuestion.includes('hour') || lowerQuestion.includes('time') || lowerQuestion.includes('open')) {
      return "SevaMed operates 24/7 for emergency services. Our general outpatient clinics are open Monday-Saturday 8:00 AM - 8:00 PM, and Sunday 10:00 AM - 6:00 PM.";
    }

    return "Thank you for reaching out! I'm your SevaMed AI assistant. I can help you with questions about our location, operational hours, departments, and services. How can I help you today?";
  };

  // Redirect non-patient users immediately
  if (shouldRedirect) {
    return null; // Will redirect non-patients via useEffect
  }

  return (
    <div className="min-h-screen bg-[#F8FAFF] dark:bg-slate-950 font-sans tracking-tight" data-testid="index-page">
      {/* Header */}
      <header className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-b border-indigo-100/50 dark:border-slate-800/50 sticky top-0 z-50 transition-all">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Menu button and Logo on the left side */}
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="icon"
                className="text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/50 rounded-full"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </Button>

              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 flex items-center justify-center shrink-0">
                  <img src="/sevamed logo.png" alt="SevaMed Logo" className="w-full h-full object-contain" />
                </div>
                <div>
                  <h1 className="text-xl font-black bg-gradient-to-r from-slate-900 to-indigo-900 dark:from-white dark:to-indigo-200 bg-clip-text text-transparent uppercase tracking-tighter">
                    {t("sevamed_hms")}
                  </h1>
                  <p className="text-[9px] font-bold text-indigo-500 uppercase tracking-[0.2em] hidden sm:block">
                    {t("healthcare_management")}
                  </p>
                </div>
              </div>
            </div>

            {/* Staff Login button on the right side */}
            <div className="flex items-center">
              <Button
                className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-xl shadow-indigo-600/20 rounded-full px-6 font-bold tracking-wide transition-all hover:-translate-y-0.5"
                onClick={handleStaffLoginClick}
                data-testid="staff-login-button"
              >
                <span className="hidden sm:inline">Staff Gateway</span>
                <span className="sm:hidden">Staff</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />

          {/* Sidebar */}
          <div className="fixed left-4 top-4 bottom-4 w-[280px] bg-white/95 dark:bg-slate-900/95 backdrop-blur-3xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] rounded-[2rem] z-50 transform transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] flex flex-col overflow-hidden border border-white/20 dark:border-slate-800">
            <div className="flex flex-col h-full bg-gradient-to-br from-transparent to-slate-50/50 dark:to-slate-900/50">
              {/* Sidebar Header */}
              <div className="p-6 border-b border-slate-100 dark:border-slate-800/50">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">Menu</h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSidebarOpen(false)}
                    className="p-1"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>

                {/* User Account Section */}
                <div className="mt-8 p-5 bg-gradient-to-br from-indigo-50 to-blue-50/50 dark:from-indigo-900/20 dark:to-blue-900/10 rounded-2xl border border-indigo-100/50 dark:border-indigo-500/10 shadow-sm relative overflow-hidden">
                  <div className="absolute -right-4 -top-4 w-24 h-24 bg-indigo-500/10 rounded-full blur-xl"></div>
                  <h3 className="font-bold text-indigo-900 dark:text-indigo-300 text-xs uppercase tracking-widest mb-3">Account Account</h3>
                  {user ? (
                    <div className="mt-2">
                      <p className="text-sm text-gray-700 dark:text-gray-300">{user.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{user.role}</p>
                    </div>
                  ) : (
                    <div className="mt-2">
                      <Button
                        size="lg"
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-lg shadow-indigo-600/20 transition-all font-bold tracking-wide h-12"
                        onClick={() => {
                          setSidebarOpen(false);
                          navigate('/login');
                        }}
                      >
                        Sign In to View Profile
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {/* Sidebar Content */}
              <div className="flex-1 overflow-y-auto p-6">
                <nav className="space-y-2">
                  <Button
                    variant="ghost"
                    className="w-full justify-start h-14 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/50 font-bold text-slate-700 dark:text-slate-300 transition-all group"
                    onClick={() => navigate('/settings')}
                  >
                    <div className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center mr-3 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/30 transition-colors">
                      <Settings className="h-4 w-4 text-slate-500 group-hover:text-indigo-600 transition-colors" />
                    </div>
                    {t("settings")}
                  </Button>

                  <Button
                    variant="ghost"
                    className="w-full justify-start h-14 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/50 font-bold text-slate-700 dark:text-slate-300 transition-all group"
                    onClick={() => navigate('/about-us')}
                  >
                    <div className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center mr-3 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/30 transition-colors">
                      <Info className="h-4 w-4 text-slate-500 group-hover:text-indigo-600 transition-colors" />
                    </div>
                    About Us
                  </Button>

                  <Button
                    variant="ghost"
                    className="w-full justify-start h-14 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/50 font-bold text-slate-700 dark:text-slate-300 transition-all group"
                    onClick={() => navigate('/contact')}
                  >
                    <div className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center mr-3 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/30 transition-colors">
                      <Contact className="h-4 w-4 text-slate-500 group-hover:text-indigo-600 transition-colors" />
                    </div>
                    Contact Us
                  </Button>
                </nav>

                {/* Settings Section */}
                <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Preferences</h3>
                  <div className="space-y-6">
                    <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700/50">
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">
                        Language
                      </label>
                      <LanguageSelector />
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700/50">
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">
                        Theme
                      </label>
                      <ThemeToggle />
                    </div>
                  </div>
                </div>
              </div>

              {/* Sidebar Footer */}
              <div className="p-6 border-t border-gray-200 dark:border-gray-700">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  © 2026 SevaMed HMS. All rights reserved.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modern Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-white dark:bg-slate-950">

        {/* Dynamic Background Elements */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-indigo-50 dark:bg-indigo-900/20 blur-[120px]" />
          <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-50 dark:bg-blue-900/20 blur-[100px]" />

          {/* Subtle Grid Pattern overlay */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik00MCAwaC00MHY0MGg0MFYweiIgZmlsbD0ibm9uZSIvPgo8cGF0aCBkPSJNMCAwaDQwdjQwSDBWMHoiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgwLCAwLCAwLCAwLjAzKSIvPgo8L3N2Zz4=')] opacity-50 dark:opacity-10" />
        </div>

        {/* Content Container */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 py-24 flex flex-col lg:flex-row items-center gap-16">

          {/* Left Column: Typography & CTAs */}
          <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left space-y-8">

            {/* Micro-badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-800/50">
              <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">Next-Gen Healthcare</span>
            </div>

            {/* Massive Headline */}
            <h2 className="text-5xl sm:text-6xl lg:text-7xl font-black text-slate-900 dark:text-white leading-[1.1] tracking-tighter">
              Precision <br className="hidden lg:block" />
              <span className="bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent">Medical Care</span>
            </h2>

            {/* Subheadline */}
            <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl font-medium">
              Experience seamless healthcare management. Our advanced system integrates cutting-edge technology with compassionate, patient-first care.
            </p>

            {/* Primary Actions */}
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto pt-4">
              <Button
                size="lg"
                className="w-full sm:w-auto h-14 px-8 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold tracking-wide shadow-xl shadow-indigo-600/20 transition-all hover:-translate-y-1 text-lg"
                onClick={() => navigate("/register")}
                data-testid="hero-register"
              >
                Register as Patient
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto h-14 px-8 rounded-full border-2 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 font-bold tracking-wide transition-all hover:-translate-y-1 text-lg"
                onClick={() => navigate("/login")}
                data-testid="hero-login"
              >
                Patient {t("login")}
              </Button>
            </div>
          </div>

          {/* Right Column: Premium Visual/Graphic */}
          <div className="w-full lg:w-1/2 relative hidden lg:flex items-center justify-end">
            {/* High-Quality Medical Imagery Sliding */}
            <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border border-slate-200 transition-all duration-700 hover:shadow-indigo-500/10">
              {heroImages.map((src, idx) => (
                <img
                  key={src}
                  src={src}
                  alt={`Medical Facility ${idx + 1}`}
                  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${idx === heroImageIndex ? "opacity-100" : "opacity-0"
                    }`}
                />
              ))}
              {/* Subtle Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent" />
            </div>
          </div>
        </div>
      </section>

      {/* Corporate Medical Centers of Excellence */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center mb-16 space-y-4">
            <h3 className="text-sm font-bold text-indigo-600 uppercase tracking-widest">Enterprise Infrastructure</h3>
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">Centers of Excellence</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-[250px]">

            {/* Main Center Image */}
            <div className="md:col-span-2 md:row-span-2 group relative overflow-hidden rounded-xl cursor-pointer shadow-lg" onClick={() => navigate("/departments/emergency")}>
              <img
                src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=80"
                alt="Emergency Department"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent opacity-80" />
              <div className="absolute bottom-0 left-0 p-8 w-full z-10">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="bg-red-600 p-2 rounded shrink-0">
                    <Ambulance className="text-white h-5 w-5" />
                  </div>
                  <span className="text-red-400 font-bold tracking-widest uppercase text-xs">Level 1</span>
                </div>
                <h4 className="text-3xl font-black text-white mb-2 leading-tight drop-shadow-md">Trauma & Emergency</h4>
                <p className="text-slate-100 font-medium max-w-md text-sm drop-shadow-md">Comprehensive critical care available 24/7, equipped to handle all medical emergencies with unparalleled speed and expertise.</p>
              </div>
            </div>

            <div className="md:col-span-2 group relative overflow-hidden rounded-xl cursor-pointer shadow-md" onClick={() => navigate("/departments/cardiology")}>
              <img
                src="https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=800&q=80"
                alt="Cardiology"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-90" />
              <div className="absolute bottom-0 left-0 p-6 w-full z-10">
                <h4 className="text-xl font-bold text-white mb-1 tracking-tight flex items-center gap-2 drop-shadow-md">
                  <Heart className="h-5 w-5 text-indigo-400" /> Advanced Cardiology
                </h4>
                <p className="text-slate-100 font-medium text-sm drop-shadow-md">State-of-the-art heart care and complex surgical interventions.</p>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-xl cursor-pointer shadow-md" onClick={() => navigate("/departments/neurology")}>
              <img
                src="https://images.unsplash.com/photo-1559757148-5c350d0d3c56?auto=format&fit=crop&w=800&q=80"
                alt="Neurology"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-90" />
              <div className="absolute bottom-0 left-0 p-6 w-full z-10">
                <h4 className="text-lg font-bold text-white mb-1 drop-shadow-md">Neurology</h4>
                <p className="text-slate-100 text-xs font-medium line-clamp-2 drop-shadow-md">Comprehensive brain and nervous system care.</p>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-xl cursor-pointer shadow-md" onClick={() => navigate("/departments/orthopedics")}>
              <img
                src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80"
                alt="Orthopedics"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-90" />
              <div className="absolute bottom-0 left-0 p-6 w-full z-10">
                <h4 className="text-lg font-bold text-white mb-1 drop-shadow-md">Orthopedics</h4>
                <p className="text-slate-100 text-xs font-medium line-clamp-2 drop-shadow-md">Expert musculoskeletal surgical and therapy centers.</p>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-xl cursor-pointer shadow-md" onClick={() => navigate("/departments/pediatrics")}>
              <img
                src="https://images.unsplash.com/photo-1584432810601-6c7f27d2362b?auto=format&fit=crop&w=800&q=80"
                alt="Pediatrics"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-90" />
              <div className="absolute bottom-0 left-0 p-6 w-full z-10">
                <h4 className="text-lg font-bold text-white mb-1 drop-shadow-md">Pediatrics</h4>
                <p className="text-slate-100 text-xs font-medium line-clamp-2 drop-shadow-md">Dedicated children's healthcare experts and facilities.</p>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-xl cursor-pointer shadow-md" onClick={() => navigate("/departments/oncology")}>
              <img
                src="https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?auto=format&fit=crop&w=800&q=80"
                alt="Oncology"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-90" />
              <div className="absolute bottom-0 left-0 p-6 w-full z-10">
                <h4 className="text-lg font-bold text-white mb-1 drop-shadow-md">Oncology</h4>
                <p className="text-slate-100 text-xs font-medium line-clamp-2 drop-shadow-md">Advanced cancer research and treatment center.</p>
              </div>
            </div>

            <div className="md:col-span-2 group relative overflow-hidden rounded-xl cursor-pointer shadow-md" onClick={() => navigate("/departments/radiology")}>
              <img
                src="https://images.unsplash.com/photo-1581056771107-24ca5f033842?auto=format&fit=crop&w=800&q=80"
                alt="Radiology"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-90" />
              <div className="absolute bottom-0 left-0 p-6 w-full z-10">
                <h4 className="text-xl font-bold text-white mb-1 tracking-tight flex items-center gap-2 drop-shadow-md">
                  <Monitor className="h-5 w-5 text-indigo-400" /> Radiology & Diagnostics
                </h4>
                <p className="text-slate-100 font-medium text-sm drop-shadow-md">Next-generation imaging and precision diagnostics.</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Mission, Vision, Values */}
      <section className="py-16 bg-gradient-to-br from-blue-50 to-green-50 dark:from-gray-700 dark:to-blue-700">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-blue-800 dark:text-blue-400 mb-4">Our Foundation</h3>
            <p className="text-xl text-blue-600 dark:text-blue-300">Built on excellence, compassion, and innovation</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-blue-200 dark:border-blue-700 dark:bg-gray-800 cursor-pointer" onClick={() => navigate("/mission")}>
              <CardHeader>
                <CardTitle className="text-blue-600 dark:text-blue-400">{t("mission")}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-blue-700 dark:text-blue-300">{t("comprehensive_care")}</p>
                <div className="mt-4 flex items-center justify-center text-blue-600 dark:text-blue-400 text-sm font-semibold">
                  Learn More →
                </div>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-green-200 dark:border-green-700 dark:bg-gray-800 cursor-pointer" onClick={() => navigate("/vision")}>
              <CardHeader>
                <CardTitle className="text-green-600 dark:text-green-400">{t("vision")}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-green-700 dark:text-green-300">{t("leading_healthcare")}</p>
                <div className="mt-4 flex items-center justify-center text-green-600 dark:text-green-400 text-sm font-semibold">
                  Learn More →
                </div>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-blue-200 dark:border-blue-700 dark:bg-gray-800 cursor-pointer" onClick={() => navigate("/facilities")}>
              <CardHeader>
                <CardTitle className="text-blue-600 dark:text-blue-400">Our Facilities</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-blue-700 dark:text-blue-300">State-of-the-art medical facilities and equipment</p>
                <div className="mt-4 flex items-center justify-center text-blue-600 dark:text-blue-400 text-sm font-semibold">
                  Explore Facilities →
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Enterprise Services Section */}
      <section className="py-24 bg-white border-t border-slate-100">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center mb-16 space-y-4">
            <h3 className="text-sm font-bold text-indigo-600 uppercase tracking-widest">Comprehensive Solutions</h3>
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">Core Medical Services</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

            {/* Corporate Service Item 1 */}
            <div className="group bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-xl transition-shadow duration-300 overflow-hidden cursor-pointer flex flex-col" onClick={() => navigate("/services/patient-management")}>
              <div className="h-48 overflow-hidden bg-slate-100 relative">
                <img
                  src="https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?auto=format&fit=crop&w=800&q=80"
                  alt="Patient Management"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-center space-x-2 mb-3">
                  <UserCheck className="h-5 w-5 text-indigo-600" />
                  <h4 className="text-xl font-bold text-slate-900 tracking-tight">Patient Management</h4>
                </div>
                <p className="text-slate-600 font-medium leading-relaxed text-sm flex-1">Complete digital records, secure appointment tracking, and extensive health history accessible through an encrypted portal designed for patients and staff.</p>
                <div className="mt-6 flex items-center text-indigo-600 text-sm font-bold uppercase tracking-wider group-hover:translate-x-2 transition-transform">
                  Learn More &rarr;
                </div>
              </div>
            </div>

            {/* Corporate Service Item 2 */}
            <div className="group bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-xl transition-shadow duration-300 overflow-hidden cursor-pointer flex flex-col" onClick={() => navigate("/services/emergency-care")}>
              <div className="h-48 overflow-hidden bg-slate-100 relative">
                <img
                  src="https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?auto=format&fit=crop&w=800&q=80"
                  alt="Critical Response"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-center space-x-2 mb-3">
                  <Zap className="h-5 w-5 text-indigo-600" />
                  <h4 className="text-xl font-bold text-slate-900 tracking-tight">Critical Response</h4>
                </div>
                <p className="text-slate-600 font-medium leading-relaxed text-sm flex-1">Advanced emergency routing protocols and life-saving critical care capabilities available instantly with streamlined intake processes.</p>
                <div className="mt-6 flex items-center text-indigo-600 text-sm font-bold uppercase tracking-wider group-hover:translate-x-2 transition-transform">
                  Learn More &rarr;
                </div>
              </div>
            </div>

            {/* Corporate Service Item 3 */}
            <div className="group bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-xl transition-shadow duration-300 overflow-hidden cursor-pointer flex flex-col" onClick={() => navigate("/services/ai-health-insights")}>
              <div className="h-48 overflow-hidden bg-slate-100 relative">
                <img
                  src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80"
                  alt="Clinical Diagnostics"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-center space-x-2 mb-3">
                  <Brain className="h-5 w-5 text-indigo-600" />
                  <h4 className="text-xl font-bold text-slate-900 tracking-tight">Clinical Diagnostics</h4>
                </div>
                <p className="text-slate-600 font-medium leading-relaxed text-sm flex-1">Integrated laboratory and imaging data utilizing evidence-based practices to provide clinical insights and definitive diagnostic accuracy.</p>
                <div className="mt-6 flex items-center text-indigo-600 text-sm font-bold uppercase tracking-wider group-hover:translate-x-2 transition-transform">
                  Learn More &rarr;
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Key Stats / Achievement Strip */}
      <section className="py-20 bg-indigo-600 dark:bg-slate-900 border-y border-indigo-500/50 dark:border-slate-800">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-indigo-400/30 dark:divide-slate-700/50">
            <div className="text-center px-4">
              <div className="text-4xl md:text-5xl font-black text-white mb-2 tracking-tighter">150+</div>
              <div className="text-indigo-200 dark:text-slate-400 font-medium text-sm md:text-base uppercase tracking-widest">Specialist Doctors</div>
            </div>
            <div className="text-center px-4">
              <div className="text-4xl md:text-5xl font-black text-white mb-2 tracking-tighter">500+</div>
              <div className="text-indigo-200 dark:text-slate-400 font-medium text-sm md:text-base uppercase tracking-widest">Hospital Beds</div>
            </div>
            <div className="text-center px-4">
              <div className="text-4xl md:text-5xl font-black text-white mb-2 tracking-tighter">50+</div>
              <div className="text-indigo-200 dark:text-slate-400 font-medium text-sm md:text-base uppercase tracking-widest">Medical Departments</div>
            </div>
            <div className="text-center px-4">
              <div className="text-4xl md:text-5xl font-black text-white mb-2 tracking-tighter">10K+</div>
              <div className="text-indigo-200 dark:text-slate-400 font-medium text-sm md:text-base uppercase tracking-widest">Happy Patients</div>
            </div>
          </div>
        </div>
      </section>

      {/* Modern Contact Section */}
      <section className="py-24 bg-white dark:bg-slate-950">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center mb-16 space-y-4">
            <h3 className="text-sm font-bold text-indigo-600 uppercase tracking-[0.2em]">Contact Us</h3>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">We're Here to Help</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-slate-50 dark:bg-slate-900 rounded-[2rem] p-8 text-center border border-slate-100 dark:border-slate-800">
              <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-slate-100 dark:border-slate-700">
                <MapPin className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Our Location</h4>
              <p className="text-slate-600 dark:text-slate-400 font-medium">
                123 Healthcare Avenue<br />
                Medical District, Hyderabad<br />
                Telangana 500001, India
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-900 rounded-[2rem] p-8 text-center border border-slate-100 dark:border-slate-800">
              <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-slate-100 dark:border-slate-700">
                <Phone className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Call Us</h4>
              <p className="text-slate-600 dark:text-slate-400 font-medium">
                Emergency: +91 98765 43210<br />
                General: +91 12345 67890<br />
                Helpline: 1800-SEVA-MED
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-900 rounded-[2rem] p-8 text-center border border-slate-100 dark:border-slate-800">
              <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-slate-100 dark:border-slate-700">
                <Mail className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Email Us</h4>
              <p className="text-slate-600 dark:text-slate-400 font-medium">
                General: info@sevamed.in<br />
                Support: support@sevamed.in<br />
                Careers: careers@sevamed.in
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Modern Premium Footer */}
      <footer className="bg-slate-900 text-slate-300 py-16 border-t border-slate-800/80 shadow-inner">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
                  <img src="/sevamed logo.png" alt="SevaMed Logo" className="w-7 h-7 object-contain brightness-0 invert" />
                </div>
                <div>
                  <h4 className="text-xl font-black text-white tracking-tighter uppercase">SevaMed</h4>
                  <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Healthcare Excellence</p>
                </div>
              </div>
              <p className="text-sm font-medium leading-relaxed max-w-xs">
                Precision healthcare solutions integrating advanced technology with compassionate care for tomorrow's wellness.
              </p>
              <div className="space-y-2 text-sm font-medium">
                <div className="flex items-start space-x-2 text-slate-400">
                  <MapPin className="h-4 w-4 mt-0.5 text-indigo-400 shrink-0" />
                  <span>SevaMed Main Campus<br />Guntur, Andhra Pradesh, India</span>
                </div>
              </div>
              <div className="flex space-x-4">
                {['Facebook', 'Twitter', 'Linkedin', 'Instagram'].map((social, i) => (
                  <a key={i} href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700 hover:bg-indigo-600 hover:border-indigo-500 hover:text-white transition-all shadow-md">
                    <span className="text-xs font-bold">{social[0]}</span>
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h5 className="text-white font-bold mb-6 tracking-wide drop-shadow-sm">Gateway Links</h5>
              <ul className="space-y-4 text-sm font-medium">
                {['Home', 'About Us', 'Facilities', 'Careers', 'Contact'].map((link) => (
                  <li key={link}><a href="#" className="hover:text-indigo-400 transition-colors flex items-center before:content-[''] before:w-1 before:h-1 before:bg-indigo-500 before:mr-2 before:rounded-full">{link}</a></li>
                ))}
              </ul>
            </div>

            <div>
              <h5 className="text-white font-bold mb-6 tracking-wide drop-shadow-sm">Core Services</h5>
              <ul className="space-y-4 text-sm font-medium">
                {['Patient Portals', 'Emergency Rapid Response', 'Specialized Treatment', 'Advanced Diagnostics', 'AI Wellness Analysis'].map((link) => (
                  <li key={link}><a href="#" className="hover:text-indigo-400 transition-colors flex items-center before:content-[''] before:w-1 before:h-1 before:bg-indigo-500 before:mr-2 before:rounded-full">{link}</a></li>
                ))}
              </ul>
            </div>

            <div>
              <h5 className="text-white font-bold mb-6 tracking-wide drop-shadow-sm">Operational Hours</h5>
              <ul className="space-y-4 text-sm font-medium">
                <li className="flex justify-between border-b border-slate-800 pb-2">
                  <span>Mon - Sat</span>
                  <span className="text-white drop-shadow-sm">8:00 AM - 8:00 PM</span>
                </li>
                <li className="flex justify-between border-b border-slate-800 pb-2">
                  <span>Sunday</span>
                  <span className="text-white drop-shadow-sm">10:00 AM - 6:00 PM</span>
                </li>
                <li className="flex justify-between pb-2">
                  <span className="text-red-400 font-bold">Emergency Level 1</span>
                  <span className="text-red-400 font-bold">24 / 7 / 365</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-16 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center text-xs font-medium">
            <p>&copy; 2026 SevaMed Healthcare Management System. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">Security</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Modern Cookie Consent Overlay */}
      {showCookieConsent && (
        <div className="fixed bottom-0 left-0 right-0 p-6 z-50 pointer-events-none">
          <div className="max-w-4xl mx-auto bg-slate-900/95 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 shadow-2xl shadow-indigo-500/10 pointer-events-auto flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-slate-300 font-medium text-sm leading-relaxed max-w-2xl">
              We use strictly necessary cookies to ensure optimal functionality alongside analytics to improve your experience. By continuing to use this platform, you agree to our policies.
            </p>
            <div className="flex space-x-3 w-full md:w-auto shrink-0">
              <Button
                variant="outline"
                onClick={handleDeclineCookies}
                className="flex-1 md:flex-none h-11 border-slate-700 text-slate-300 hover:bg-slate-800 rounded-xl"
              >
                Decline
              </Button>
              <Button
                onClick={handleAcceptCookies}
                className="flex-1 md:flex-none h-11 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-lg shadow-indigo-600/20"
              >
                Accept All
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modern Modals: Login Required */}
      {showLoginWarning && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl border border-slate-100 dark:border-slate-800 max-w-md w-full p-8 transform transition-all animate-in fade-in zoom-in-95">
            <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center mb-6">
              <UserCheck className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight">Authentication Required</h3>
            <p className="text-slate-500 dark:text-slate-400 font-medium mb-8 leading-relaxed">
              Access to the AI Wellness Assistant and secure communication channels requires a verified patient session.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                variant="outline"
                onClick={handleLoginWarningClose}
                className="flex-1 h-12 rounded-xl border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 font-bold"
              >
                Cancel
              </Button>
              <Button
                onClick={handleLoginRedirect}
                className="flex-1 h-12 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-lg shadow-indigo-600/20"
              >
                Go to Login
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modern Modals: Staff Gateway */}
      {showStaffWarning && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl border border-slate-100 dark:border-slate-800 max-w-md w-full p-8 transform transition-all animate-in fade-in zoom-in-95">
            <div className="w-12 h-12 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-2xl flex items-center justify-center mb-6 border border-red-100 dark:border-red-900/50">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight">Restricted Area</h3>
            <p className="text-slate-500 dark:text-slate-400 font-medium mb-8 leading-relaxed">
              You are entering the secured Staff Gateway. This portal is strictly for authorized medical and administrative personnel.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                variant="outline"
                onClick={handleStaffWarningClose}
                disabled={staffWarningLoading}
                className="flex-1 h-12 rounded-xl border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 font-bold"
              >
                Abort
              </Button>
              <Button
                onClick={handleStaffWarningProceed}
                disabled={staffWarningLoading}
                className="flex-1 h-12 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-200 dark:text-slate-900 text-white font-bold shadow-xl"
              >
                {staffWarningLoading ? "Authenticating..." : "Proceed to Gateway"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modern AI Chat Interface */}
      {showAIChat && (
        <div className="fixed bottom-24 right-6 w-full max-w-[360px] z-[90] animate-in slide-in-from-bottom-5">
          <div className="bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl border border-slate-100 dark:border-slate-800 flex flex-col h-[500px] overflow-hidden">
            <div className="bg-indigo-600 p-4 border-b border-indigo-700 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/30">
                    <Bot className="text-white h-5 w-5" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 border-2 border-indigo-600 rounded-full" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">SevaMed AI Companion</h3>
                  <p className="text-[10px] text-indigo-200 uppercase tracking-widest font-bold">Online</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowAIChat(false)}
                className="text-white hover:bg-indigo-700 rounded-full w-8 h-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 dark:bg-slate-950/50">
              {chatMessages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] px-4 py-3 text-sm font-medium ${message.role === 'user'
                      ? 'bg-indigo-600 text-white rounded-[20px] rounded-tr-sm'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-[20px] rounded-tl-sm shadow-sm'
                      }`}
                  >
                    {message.content}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-3 rounded-[20px] rounded-tl-sm">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder={"Ask me anything..."}
                  className="flex-1 px-4 py-3 bg-slate-50 dark:bg-slate-800 border-0 rounded-xl focus:ring-2 focus:ring-indigo-500 font-medium text-sm text-slate-900 dark:text-white placeholder:text-slate-400"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim()}
                  className="h-12 w-12 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/20 disabled:bg-slate-200 disabled:shadow-none p-0 flex items-center justify-center shrink-0"
                >
                  <Send className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Modern AI Chat Button */}
      <Button
        onClick={handleAIChatToggle}
        className="fixed bottom-6 right-6 w-16 h-16 rounded-[2rem] bg-indigo-600 hover:bg-slate-900 dark:bg-white dark:hover:bg-indigo-50 dark:text-slate-900 shadow-2xl shadow-indigo-600/30 dark:shadow-white/10 z-[80] flex items-center justify-center transition-all duration-300 hover:scale-110 border-4 border-white dark:border-slate-950 p-0 overflow-hidden group"
      >
        {/* Glow effect */}
        <div className="absolute inset-0 bg-indigo-400/20 blur-md group-hover:bg-indigo-400/40 transition-colors" />
        <Bot className="h-7 w-7 text-white dark:text-slate-900 relative z-10 drop-shadow-sm" />
      </Button>
    </div>
  );
}

export default IndexPage;
