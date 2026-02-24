import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "./components/ui/toaster";
import { TooltipProvider } from "./components/ui/tooltip";
import { AuthProvider } from "./contexts/AuthContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import { ThemeProvider } from "./contexts/ThemeContext";

import ProtectedRoute from "./components/common/ProtectedRoute";
import Layout from "./components/common/Layout";
import ScrollToTop from "./components/common/ScrollToTop";

// ✅ Pages
import IndexPage from "./pages/IndexPage";
import LoginPage from "./pages/LoginPage";
import StaffLoginPage from "./pages/StaffLoginPage";
import RoleStaffLoginPage from "./pages/staff/StaffLoginPage";
import NurseDashboard from "./pages/nurse/NurseDashboard";
import ReceptionistDashboard from "./pages/receptionist/ReceptionistDashboard";
import PharmacistDashboard from "./pages/pharmacist/PharmacistDashboard";
import AdminStaffPage from "./pages/admin/AdminStaffPage";
import CreateBillPage from "./pages/billing/CreateBillPage";
import BillDetailPage from "./pages/billing/BillDetailPage";
import BillsListPage from "./pages/billing/BillsListPage";
import CreatePrescriptionPage from "./pages/prescriptions/CreatePrescriptionPage";
import PrescriptionDetailPage from "./pages/prescriptions/PrescriptionDetailPage";
import NursePatientsPage from "./pages/nurse/NursePatientsPage";
import NurseVitalsPage from "./pages/nurse/NurseVitalsPage";
import RecordVitalsPage from "./pages/nurse/RecordVitalsPage";
import VitalsHistoryPage from "./pages/nurse/VitalsHistoryPage";
import WardManagementPage from "./pages/nurse/WardManagementPage";
import ShiftSchedulePage from "./pages/nurse/ShiftSchedulePage";
import RegisterPatientPage from "./pages/receptionist/RegisterPatientPage";
import PaymentCollectionPage from "./pages/receptionist/PaymentCollectionPage";
import QueueManagementPage from "./pages/receptionist/QueueManagementPage";
import QueueDisplayBoard from "./pages/QueueDisplayBoard";
import PrescriptionsListPage from "./pages/prescriptions/PrescriptionsListPage";
import PatientPrescriptionsPage from "./pages/patient/PatientPrescriptionsPage";

import InventoryPage from "./pages/pharmacist/InventoryPage";
import DispenseMedicinesPage from "./pages/pharmacist/DispenseMedicinesPage";
import PurchaseOrdersPage from "./pages/pharmacist/PurchaseOrdersPage";
import PharmacyAlertsPage from "./pages/pharmacist/PharmacyAlertsPage";

import AdminLoginPage from "./pages/AdminLoginPage";
import DoctorLoginPage from "./pages/DoctorLoginPage";
import ReceptionLoginPage from "./pages/ReceptionLoginPage";
import NurseLoginPage from "./pages/NurseLoginPage";
import PharmacistLoginPage from "./pages/PharmacistLoginPage";
import RegisterPage from "./pages/RegisterPage";
import RedirectPage from "./pages/RedirectPage";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import CookiePolicy from "./pages/CookiePolicy";
import AccessibilityPage from "./pages/AccessibilityPage";
import AboutUsPage from "./pages/AboutUsPage";
import TermsOfServicePage from "./pages/TermsOfServicePage";
import AdminDashboard from "./pages/dashboards/AdminDashboard";
import DoctorDashboard from "./pages/dashboards/DoctorDashboard";
import ReceptionDashboard from "./pages/dashboards/ReceptionDashboard";
import PatientDashboard from "./pages/dashboards/PatientDashboard";
import NotFound from "./pages/not-found";
import ChatPage from "./pages/ChatPage";
import BMICalculatorPage from "./pages/BMICalculatorPage";
import BMICalculatorTestPage from "./pages/BMICalculatorTestPage";

import PatientManagementPage from "./pages/services/PatientManagementPage";
import EmergencyCarePage from "./pages/services/EmergencyCarePage";
import SpecializedTreatmentPage from "./pages/services/SpecializedTreatmentPage";
import AppointmentSchedulingPage from "./pages/services/AppointmentSchedulingPage";
import AIHealthInsightsPage from "./pages/services/AIHealthInsightsPage";
import HealthMonitoringPage from "./pages/services/HealthMonitoringPage";
import VaccinationProgramsPage from "./pages/services/VaccinationProgramsPage";

import MissionPage from "./pages/MissionPage";
import VisionPage from "./pages/VisionPage";
import FacilitiesPage from "./pages/FacilitiesPage";
import EmergencyDepartmentPage from "./pages/facilities/EmergencyDepartmentPage";
import PatientRoomsPage from "./pages/facilities/PatientRoomsPage";
import OperatingTheatersPage from "./pages/facilities/OperatingTheatersPage";
import EmergencyPage from "./pages/departments/EmergencyPage";
import CardiologyPage from "./pages/departments/CardiologyPage";
import NeurologyPage from "./pages/departments/NeurologyPage";
import OrthopedicsPage from "./pages/departments/OrthopedicsPage";
import PediatricsPage from "./pages/departments/PediatricsPage";
import OncologyPage from "./pages/departments/OncologyPage";
import RadiologyPage from "./pages/departments/RadiologyPage";
import GynecologyPage from "./pages/departments/GynecologyPage";
import SettingsPage from "./pages/SettingsPage";

import DoctorOverviewPage from "./pages/doctor/DoctorOverviewPage";
import ConsultationPage from "./pages/doctor/ConsultationPage";
import DoctorAppointmentsPage from "./pages/doctor/DoctorAppointmentsPage";
import DoctorQueuePage from "./pages/doctor/DoctorQueuePage";
import DoctorPatientRecordsPage from "./pages/doctor/DoctorPatientRecordsPage";
import DoctorPatientDetailsPage from "./pages/doctor/DoctorPatientDetailsPage";
import DoctorResourcesPage from "./pages/doctor/DoctorResourcesPage";
import DoctorActivityLogPage from "./pages/doctor/DoctorActivityLogPage";
import DoctorChatPage from "./pages/doctor/DoctorChatPage";
import DoctorReportsPage from "./pages/doctor/DoctorReportsPage";
import DoctorLabResultsPage from "./pages/doctor/DoctorLabResultsPage";
import DoctorSettingsPage from "./pages/doctor/DoctorSettingsPage";
import DoctorAttendancePage from "./pages/doctor/DoctorAttendancePage";
import EditProfilePage from "./pages/doctor/EditProfilePage";
import PatientEditProfilePage from "./pages/PatientEditProfilePage";
import ChangePasswordPage from "./pages/doctor/ChangePasswordPage";
import HealthTipsPage from "./pages/doctor/HealthTipsPage";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ThemeProvider>
          <AuthProvider>
            <LanguageProvider>
              <Toaster />
              <Router>
                <ScrollToTop />
                <Routes>
                  <Route path="/" element={<IndexPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/staff-login" element={<StaffLoginPage />} />
                  <Route path="/admin-login" element={<AdminLoginPage />} />
                  <Route path="/doctor-login" element={<DoctorLoginPage />} />
                  <Route path="/reception-login" element={<ReceptionLoginPage />} />
                  <Route path="/nurse-login" element={<NurseLoginPage />} />
                  <Route path="/pharmacist-login" element={<PharmacistLoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />

                  <Route
                    path="/login-success"
                    element={
                      <RedirectPage
                        title="Login Successful!"
                        message="Welcome back to SevaMed HMS"
                        redirectMessage="You'll be redirected to your dashboard in a moment."
                        redirectTo="/"
                        delay={2000}
                      />
                    }
                  />

                  <Route
                    path="/register-success"
                    element={
                      <RedirectPage
                        title="Registration Successful!"
                        message="Welcome to SevaMed HMS"
                        redirectMessage="You'll be redirected to the login page in a moment."
                        redirectTo="/login"
                        delay={3000}
                      />
                    }
                  />

                  {/* Info Pages */}
                  <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                  <Route path="/cookie-policy" element={<CookiePolicy />} />
                  <Route path="/accessibility" element={<AccessibilityPage />} />
                  <Route path="/about-us" element={<AboutUsPage />} />
                  <Route path="/terms-of-service" element={<TermsOfServicePage />} />

                  {/* Services */}
                  <Route path="/services/patient-management" element={<PatientManagementPage />} />
                  <Route path="/services/emergency-care" element={<EmergencyCarePage />} />
                  <Route path="/services/specialized-treatment" element={<SpecializedTreatmentPage />} />
                  <Route path="/services/appointment-scheduling" element={<AppointmentSchedulingPage />} />
                  <Route path="/services/ai-health-insights" element={<AIHealthInsightsPage />} />
                  <Route path="/services/health-monitoring" element={<HealthMonitoringPage />} />
                  <Route path="/services/vaccination-programs" element={<VaccinationProgramsPage />} />

                  {/* Mission, Vision, Facilities */}
                  <Route path="/mission" element={<MissionPage />} />
                  <Route path="/vision" element={<VisionPage />} />
                  <Route path="/facilities" element={<FacilitiesPage />} />
                  <Route path="/facilities/emergency-department" element={<EmergencyDepartmentPage />} />
                  <Route path="/facilities/patient-rooms" element={<PatientRoomsPage />} />
                  <Route path="/facilities/operating-theaters" element={<OperatingTheatersPage />} />

                  {/* Departments */}
                  <Route path="/departments/emergency" element={<EmergencyPage />} />
                  <Route path="/departments/cardiology" element={<CardiologyPage />} />
                  <Route path="/departments/neurology" element={<NeurologyPage />} />
                  <Route path="/departments/orthopedics" element={<OrthopedicsPage />} />
                  <Route path="/departments/pediatrics" element={<PediatricsPage />} />
                  <Route path="/departments/oncology" element={<OncologyPage />} />
                  <Route path="/departments/radiology" element={<RadiologyPage />} />
                  <Route path="/departments/gynecology" element={<GynecologyPage />} />

                  {/* Protected */}
                  <Route
                    path="/chat"
                    element={
                      <ProtectedRoute allowedRoles={["patient", "reception", "doctor"]}>
                        <ChatPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/settings"
                    element={
                      <ProtectedRoute allowedRoles={["patient", "reception"]}>
                        <Layout>
                          <SettingsPage />
                        </Layout>
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/admin"
                    element={
                      <ProtectedRoute allowedRoles={["admin"]}>
                        <AdminDashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/reception"
                    element={
                      <ProtectedRoute allowedRoles={["reception"]}>
                        <ReceptionDashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/patient"
                    element={
                      <ProtectedRoute allowedRoles={["patient"]}>
                        <PatientDashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/doctor"
                    element={
                      <ProtectedRoute allowedRoles={["doctor"]}>
                        <DoctorDashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/doctor/overview"
                    element={
                      <ProtectedRoute allowedRoles={["doctor"]}>
                        <Layout>
                          <DoctorOverviewPage />
                        </Layout>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/doctor/consultation/:appointmentId"
                    element={
                      <ProtectedRoute allowedRoles={["doctor"]}>
                        <Layout>
                          <ConsultationPage />
                        </Layout>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/doctor/appointments"
                    element={
                      <ProtectedRoute allowedRoles={["doctor"]}>
                        <Layout>
                          <DoctorAppointmentsPage />
                        </Layout>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/doctor/queue"
                    element={
                      <ProtectedRoute allowedRoles={["doctor"]}>
                        <Layout>
                          <DoctorQueuePage />
                        </Layout>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/doctor/patients"
                    element={
                      <ProtectedRoute allowedRoles={["doctor"]}>
                        <Layout>
                          <DoctorPatientRecordsPage />
                        </Layout>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/doctor/patients/:patientId"
                    element={
                      <ProtectedRoute allowedRoles={["doctor"]}>
                        <Layout>
                          <DoctorPatientDetailsPage />
                        </Layout>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/doctor/resources"
                    element={
                      <ProtectedRoute allowedRoles={["doctor"]}>
                        <Layout>
                          <DoctorResourcesPage />
                        </Layout>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/doctor/activity"
                    element={
                      <ProtectedRoute allowedRoles={["doctor"]}>
                        <Layout>
                          <DoctorActivityLogPage />
                        </Layout>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/doctor/chat"
                    element={
                      <ProtectedRoute allowedRoles={["doctor"]}>
                        <Layout>
                          <DoctorChatPage />
                        </Layout>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/doctor/reports"
                    element={
                      <ProtectedRoute allowedRoles={["doctor"]}>
                        <Layout>
                          <DoctorReportsPage />
                        </Layout>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/doctor/settings"
                    element={
                      <ProtectedRoute allowedRoles={["doctor"]}>
                        <Layout>
                          <DoctorSettingsPage />
                        </Layout>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/doctor/lab-results"
                    element={
                      <ProtectedRoute allowedRoles={["doctor"]}>
                        <Layout>
                          <DoctorLabResultsPage />
                        </Layout>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/doctor/health-tips"
                    element={
                      <ProtectedRoute allowedRoles={["doctor"]}>
                        <Layout>
                          <HealthTipsPage />
                        </Layout>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/doctor/attendance"
                    element={
                      <ProtectedRoute allowedRoles={["doctor"]}>
                        <Layout>
                          <DoctorAttendancePage />
                        </Layout>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/profile/edit"
                    element={
                      <ProtectedRoute allowedRoles={["doctor"]}>
                        <Layout>
                          <EditProfilePage />
                        </Layout>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/profile/change-password"
                    element={
                      <ProtectedRoute allowedRoles={["doctor"]}>
                        <Layout>
                          <ChangePasswordPage />
                        </Layout>
                      </ProtectedRoute>
                    }
                  />

                  {/* Patient Profile Edit Route */}
                  <Route
                    path="/profile/edit"
                    element={
                      <ProtectedRoute allowedRoles={["patient", "doctor"]}>
                        <Layout>
                          <PatientEditProfilePage />
                        </Layout>
                      </ProtectedRoute>
                    }
                  />

                  {/* BMI */}
                  <Route path="/bmi-test" element={<BMICalculatorTestPage />} />
                  <Route path="/bmi-calculator" element={<BMICalculatorPage />} />


                  {/* ── Staff Dashboard Routes (protected) ── */}
                  <Route
                    path="/nurse"
                    element={
                      <ProtectedRoute allowedRoles={["nurse"]}>
                        <Layout>
                          <NurseDashboard />
                        </Layout>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/nurse/dashboard"
                    element={
                      <ProtectedRoute allowedRoles={["nurse"]}>
                        <Layout>
                          <NurseDashboard />
                        </Layout>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/nurse/patients"
                    element={
                      <ProtectedRoute allowedRoles={["nurse"]}>
                        <Layout>
                          <NursePatientsPage />
                        </Layout>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/nurse/vitals"
                    element={
                      <ProtectedRoute allowedRoles={["nurse"]}>
                        <Layout>
                          <NursePatientsPage />
                        </Layout>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/nurse/vitals/:patientId"
                    element={
                      <ProtectedRoute allowedRoles={["nurse"]}>
                        <Layout>
                          <NurseVitalsPage />
                        </Layout>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/nurse/vitals/record"
                    element={
                      <ProtectedRoute allowedRoles={["nurse"]}>
                        <Layout>
                          <RecordVitalsPage />
                        </Layout>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/nurse/vitals/history"
                    element={
                      <ProtectedRoute allowedRoles={["nurse"]}>
                        <Layout>
                          <VitalsHistoryPage />
                        </Layout>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/nurse/wards"
                    element={
                      <ProtectedRoute allowedRoles={["nurse"]}>
                        <Layout>
                          <WardManagementPage />
                        </Layout>
                      </ProtectedRoute>
                    }
                  />
                  {/* ✅ Receptionist Portal (Specialized) */}
                  <Route
                    path="/receptionist/dashboard"
                    element={
                      <ProtectedRoute allowedRoles={["receptionist", "reception"]}>
                        <Layout>
                          <ReceptionistDashboard />
                        </Layout>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/receptionist/register"
                    element={
                      <ProtectedRoute allowedRoles={["receptionist", "reception"]}>
                        <Layout>
                          <RegisterPatientPage />
                        </Layout>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/receptionist/payments"
                    element={
                      <ProtectedRoute allowedRoles={["receptionist", "reception"]}>
                        <Layout>
                          <PaymentCollectionPage />
                        </Layout>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/receptionist/queue"
                    element={
                      <ProtectedRoute allowedRoles={["receptionist", "reception"]}>
                        <Layout>
                          <QueueManagementPage />
                        </Layout>
                      </ProtectedRoute>
                    }
                  />
                  {/* OPD alias and Billing Verification */}
                  <Route
                    path="/receptionist/opd"
                    element={
                      <ProtectedRoute allowedRoles={["receptionist", "reception"]}>
                        <Layout>
                          <QueueManagementPage />
                        </Layout>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/receptionist/verify-payments"
                    element={
                      <ProtectedRoute allowedRoles={["receptionist", "reception"]}>
                        <Layout>
                          <BillsListPage />
                        </Layout>
                      </ProtectedRoute>
                    }
                  />

                  {/* Public TV Display Board */}
                  <Route path="/queue-display" element={<QueueDisplayBoard />} />

                  <Route
                    path="/nurse/shift"
                    element={
                      <ProtectedRoute allowedRoles={["nurse"]}>
                        <Layout>
                          <ShiftSchedulePage />
                        </Layout>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/receptionist/dashboard"
                    element={
                      <ProtectedRoute allowedRoles={["receptionist"]}>
                        <ReceptionistDashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/pharmacist/dashboard"
                    element={
                      <ProtectedRoute allowedRoles={["pharmacist"]}>
                        <Layout>
                          <PharmacistDashboard />
                        </Layout>
                      </ProtectedRoute>
                    }
                  />
                  {/* /pharmacy alias — PharmacistLoginPage navigates here after login */}
                  <Route
                    path="/pharmacy"
                    element={
                      <ProtectedRoute allowedRoles={["pharmacist"]}>
                        <Layout>
                          <PharmacistDashboard />
                        </Layout>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/pharmacist/queue"
                    element={
                      <ProtectedRoute allowedRoles={["pharmacist"]}>
                        <Layout>
                          <PharmacistDashboard />
                        </Layout>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/pharmacist/dispense/:appointmentId"
                    element={
                      <ProtectedRoute allowedRoles={["pharmacist"]}>
                        <Layout>
                          <DispenseMedicinesPage />
                        </Layout>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/pharmacist/inventory"
                    element={
                      <ProtectedRoute allowedRoles={["pharmacist"]}>
                        <Layout>
                          <InventoryPage />
                        </Layout>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/pharmacist/search"
                    element={
                      <ProtectedRoute allowedRoles={["pharmacist"]}>
                        <Layout>
                          <InventoryPage />
                        </Layout>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/pharmacist/purchase-orders"
                    element={
                      <ProtectedRoute allowedRoles={["pharmacist"]}>
                        <Layout>
                          <PurchaseOrdersPage />
                        </Layout>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/pharmacist/alerts"
                    element={
                      <ProtectedRoute allowedRoles={["pharmacist"]}>
                        <Layout>
                          <PharmacyAlertsPage />
                        </Layout>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/pharmacist/reports"
                    element={
                      <ProtectedRoute allowedRoles={["pharmacist"]}>
                        <Layout>
                          <PharmacyAlertsPage />
                        </Layout>
                      </ProtectedRoute>
                    }
                  />

                  {/* ── Admin Staff Management ── */}
                  <Route
                    path="/admin/staff"
                    element={
                      <ProtectedRoute allowedRoles={["admin"]}>
                        <AdminStaffPage />
                      </ProtectedRoute>
                    }
                  />

                  {/* ── Billing Routes ── */}
                  <Route
                    path="/billing/create"
                    element={
                      <ProtectedRoute allowedRoles={["admin", "receptionist"]}>
                        <CreateBillPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/billing"
                    element={
                      <ProtectedRoute allowedRoles={["admin", "receptionist", "doctor"]}>
                        <BillsListPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/billing/:id"
                    element={
                      <ProtectedRoute allowedRoles={["admin", "receptionist", "doctor"]}>
                        <BillDetailPage />
                      </ProtectedRoute>
                    }
                  />

                  {/* ── Prescriptions ── */}
                  <Route
                    path="/prescriptions"
                    element={
                      <ProtectedRoute allowedRoles={["doctor", "admin"]}>
                        <PrescriptionsListPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/prescriptions/create"
                    element={
                      <ProtectedRoute allowedRoles={["doctor"]}>
                        <CreatePrescriptionPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/prescriptions/:id"
                    element={
                      <ProtectedRoute allowedRoles={["admin", "doctor", "patient", "pharmacist"]}>
                        <PrescriptionDetailPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/patient/prescriptions"
                    element={
                      <ProtectedRoute allowedRoles={["patient"]}>
                        <PatientPrescriptionsPage />
                      </ProtectedRoute>
                    }
                  />

                  {/* Fallback */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Router>
            </LanguageProvider>
          </AuthProvider>
        </ThemeProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
