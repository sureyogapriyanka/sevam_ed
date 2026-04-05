import { useAuth } from "../../contexts/AuthContext";
import { useLanguage } from "../../contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "../../lib/queryClient";
import { QueueEntry, Appointment, Attendance, User } from "../../types/schema";
import {
  Users,
  CreditCard,
  Clock,
  AlertTriangle,
  Activity,
  Search,
  Plus,
  CheckCircle,
  MessageSquare,
  Stethoscope,
  MessageCircle
} from "lucide-react";
import { useState } from "react";
import PaymentModal from "../../components/reception/PaymentModal";
import { sendUrgentMessageToDoctor } from "../../components/chat/ChatInterface";
import ChatInterface from "../../components/chat/ChatInterface";
import { useWebSocket } from "../../hooks/useWebSocket";
import { toast } from "../../hooks/use-toast";

export default function ReceptionDashboard() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const queryClient = useQueryClient();
  const { isConnected, sendMessage } = useWebSocket();
  const [searchTerm, setSearchTerm] = useState("");
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  const { data: currentQueue = [] } = useQuery({
    queryKey: ["/api/queue"],
  }) as { data: QueueEntry[] };

  const { data: todaysAppointments = [] } = useQuery({
    queryKey: ["/api/appointments/today"],
  }) as { data: Appointment[] };

  const { data: myAttendance = [] } = useQuery({
    queryKey: ["/api/attendance/user", user?.id],
  }) as { data: Attendance[] };

  const { data: allPatients = [] } = useQuery({
    queryKey: ["/api/patients"],
  }) as { data: any[] };

  const { data: doctors = [] } = useQuery({
    queryKey: ["/api/users/role/doctor"],
  }) as { data: User[] };

  const updateAttendanceMutation = useMutation({
    mutationFn: async (status: string) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const existingAttendance = myAttendance.find((att: any) => {
        const attDate = new Date(att.date);
        attDate.setHours(0, 0, 0, 0);
        return attDate.getTime() === today.getTime();
      });

      if (existingAttendance) {
        return apiRequest("PUT", `/api/attendance/${existingAttendance.id}`, {
          status,
          location: status
        });
      } else {
        return apiRequest("POST", "/api/attendance", {
          userId: user?.id,
          date: new Date(),
          status: "present",
          location: status,
          checkIn: new Date()
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/attendance/user", user?.id] });
    }
  });

  const updateQueueMutation = useMutation({
    mutationFn: async ({ queueId, status }: { queueId: string, status: string }) => {
      return apiRequest("PUT", `/api/queue/${queueId}`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/queue"] });
    }
  });

  const totalInQueue = currentQueue.length;
  const completedToday = todaysAppointments.filter((apt: any) => apt.status === "completed").length;
  const pendingPayments = Math.floor(Math.random() * 5) + 1; // Mock data
  const urgentCases = currentQueue.filter((q: any) => q.priority === "urgent" || q.priority === "critical").length;

  const todaysAttendance = myAttendance.find((att: any) => {
    const today = new Date();
    const attDate = new Date(att.date);
    return attDate.toDateString() === today.toDateString();
  });

  const filteredQueue = currentQueue.filter((entry: any) =>
    entry.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.position.toString().includes(searchTerm)
  );

  const handlePaymentProcessed = () => {
    // Refresh relevant data after payment processing
    queryClient.invalidateQueries({ queryKey: ["/api/queue"] });
    queryClient.invalidateQueries({ queryKey: ["/api/appointments/today"] });
  };

  // Function to send urgent message to all doctors
  const sendUrgentMessageToAllDoctors = (message: string) => {
    if (!isConnected) {
      toast({
        title: "Error",
        description: "Not connected to chat service",
        variant: "destructive"
      });
      return;
    }

    // Send to all doctors
    doctors.forEach((doctor: User) => {
      sendUrgentMessageToDoctor(user, isConnected, sendMessage, doctor.id, message);
    });

    toast({
      title: "Messages Sent",
      description: `Urgent message sent to ${doctors.length} doctor(s)`
    });
  };

  // Function to send urgent message to a specific doctor
  const sendUrgentMessageToSpecificDoctor = (doctorId: string, message: string) => {
    if (!isConnected) {
      toast({
        title: "Error",
        description: "Not connected to chat service",
        variant: "destructive"
      });
      return;
    }

    sendUrgentMessageToDoctor(user, isConnected, sendMessage, doctorId, message);
  };

  return (
    <div className="space-y-6 sm:space-y-8 fade-in" data-testid="reception-dashboard">
      {/* Header */}
      <div className="flex items-center space-x-2 sm:space-x-3">
        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center">
          <img
            src="/sevamed logo.png"
            alt="SevaMed Logo"
            className="w-full h-full object-contain"
          />
        </div>
        <div>
          <h1 className="text-xl sm:text-3xl font-bold text-foreground truncate max-w-[150px] sm:max-w-none">Welcome, {user?.name}</h1>
          <p className="text-xs sm:text-base text-muted-foreground">{t("manage_queue")}</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card data-testid="stat-queue">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Patients in Queue</p>
                <p className="text-3xl font-bold text-foreground">{totalInQueue}</p>
              </div>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-primary" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <Clock className="h-4 w-4 text-muted-foreground mr-1" />
              <span className="text-muted-foreground">Average wait: 25 min</span>
            </div>
          </CardContent>
        </Card>

        <Card data-testid="stat-completed">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Completed Today</p>
                <p className="text-3xl font-bold text-foreground">{completedToday}</p>
              </div>
              <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-secondary" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <Activity className="h-4 w-4 text-secondary mr-1" />
              <span className="text-secondary">+12%</span>
              <span className="text-muted-foreground ml-1">from yesterday</span>
            </div>
          </CardContent>
        </Card>

        <Card data-testid="stat-payments">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Pending Payments</p>
                <p className="text-3xl font-bold text-foreground">{pendingPayments}</p>
              </div>
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                <CreditCard className="h-6 w-6 text-accent" />
              </div>
            </div>
            <div className="mt-4">
              <Button
                variant="link"
                className="p-0 h-auto text-accent font-medium"
                onClick={() => setIsPaymentModalOpen(true)}
              >
                Review payments
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card data-testid="stat-urgent">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Urgent Cases</p>
                <p className="text-3xl font-bold text-destructive">{urgentCases}</p>
              </div>
              <div className="w-12 h-12 bg-destructive/10 rounded-lg flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-destructive" />
              </div>
            </div>
            <div className="mt-4">
              <span className="text-destructive text-sm font-medium">
                {urgentCases > 0 ? "Priority handling" : "All stable"}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Queue Management */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Queue Management</CardTitle>
                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Search queue..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9 w-48"
                      data-testid="search-queue"
                    />
                  </div>
                  <Button size="sm" data-testid="add-to-queue">
                    <Plus className="h-4 w-4 mr-1" />
                    Add to Queue
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {filteredQueue.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    {searchTerm ? "No matching patients found" : "No patients in queue"}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredQueue.map((entry: any, index: number) => (
                    <div key={entry.id || index} className="flex items-center justify-between p-4 bg-background rounded-lg border border-border">
                      <div className="flex items-center space-x-4">
                        <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                          {entry.position}
                        </div>
                        <div>
                          <p className="font-medium text-foreground">Patient #{entry.position}</p>
                          <p className="text-sm text-muted-foreground">
                            Wait time: {entry.estimatedWaitTime || 0} minutes
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Badge variant={
                          entry.priority === "critical" ? "destructive" :
                            entry.priority === "urgent" ? "secondary" : "default"
                        }>
                          {entry.priority}
                        </Badge>
                        <Badge variant="outline">
                          {entry.status}
                        </Badge>
                        {entry.status === "waiting" && (
                          <Button
                            size="sm"
                            onClick={() => updateQueueMutation.mutate({
                              queueId: entry.id,
                              status: "in-consultation"
                            })}
                            disabled={updateQueueMutation.isPending}
                            data-testid={`call-patient-${index}`}
                          >
                            Call Patient
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Attendance & Quick Actions */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-3">
                <Button variant="outline" className="justify-start" data-testid="new-appointment">
                  <Plus className="h-4 w-4 mr-2" />
                  New Appointment
                </Button>
                <Button variant="outline" className="justify-start" data-testid="patient-registration">
                  <Users className="h-4 w-4 mr-2" />
                  Patient Registration
                </Button>
                <Button
                  variant="outline"
                  className="justify-start"
                  data-testid="payment-processing"
                  onClick={() => setIsPaymentModalOpen(true)}
                >
                  <CreditCard className="h-4 w-4 mr-2" />
                  Process Payment
                </Button>
                <Button
                  variant="outline"
                  className="justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
                  data-testid="urgent-attention-all"
                  onClick={() => sendUrgentMessageToAllDoctors("Immediate attention required in Ward 3")}
                >
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Urgent: All Doctors to Ward 3
                </Button>
                <Button
                  variant="outline"
                  className="justify-start"
                  data-testid="chat-with-doctors"
                  onClick={() => {
                    // This would open the chat interface
                    const chatEvent = new CustomEvent('openChat');
                    window.dispatchEvent(chatEvent);
                  }}
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Chat with Doctors
                </Button>
                <Button variant="outline" className="justify-start" data-testid="generate-reports">
                  <Activity className="h-4 w-4 mr-2" />
                  Generate Reports
                </Button>
              </div>

              {/* Doctor-specific urgent messages */}
              {doctors.length > 0 && (
                <div className="mt-4 pt-4 border-t">
                  <h4 className="text-sm font-medium mb-2 flex items-center">
                    <Stethoscope className="h-4 w-4 mr-2" />
                    Send to Specific Doctor
                  </h4>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {doctors.map((doctor: User) => (
                      <Button
                        key={doctor.id}
                        variant="outline"
                        size="sm"
                        className="w-full justify-start text-xs"
                        onClick={() => sendUrgentMessageToSpecificDoctor(doctor.id, "Immediate attention required in Ward 3")}
                      >
                        <AlertTriangle className="h-3 w-3 mr-1 text-destructive" />
                        {doctor.name}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Attendance Tracker */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-accent" />
                <span>My Attendance</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-foreground">Check-in</span>
                  <span className="text-sm text-secondary font-medium">
                    {todaysAttendance?.checkIn ? new Date(todaysAttendance.checkIn).toLocaleTimeString() : "Not checked in"} ✓
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-foreground">Current Status</span>
                  <Badge>
                    {todaysAttendance?.location || "At Desk"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-foreground">Lunch Break</span>
                  <span className="text-sm text-muted-foreground">12:30 PM - 1:30 PM</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-foreground">Shift End</span>
                  <span className="text-sm text-muted-foreground">6:00 PM</span>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updateAttendanceMutation.mutate("desk")}
                  disabled={updateAttendanceMutation.isPending}
                  data-testid="status-desk"
                >
                  At Desk
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updateAttendanceMutation.mutate("resting")}
                  disabled={updateAttendanceMutation.isPending}
                  data-testid="status-resting"
                >
                  Resting
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updateAttendanceMutation.mutate("lunch")}
                  disabled={updateAttendanceMutation.isPending}
                  data-testid="status-lunch"
                >
                  Lunch Break
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updateAttendanceMutation.mutate("away")}
                  disabled={updateAttendanceMutation.isPending}
                  data-testid="status-away"
                >
                  Away
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    // Dispatch custom event to open chat
                    const chatEvent = new CustomEvent('openChat');
                    window.dispatchEvent(chatEvent);
                  }}
                  data-testid="open-chat"
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Chat with Doctors
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open('/chat', '_blank')}
                  data-testid="full-screen-chat"
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Full Screen Chat
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        onPaymentProcessed={handlePaymentProcessed}
      />
    </div>
  );
}
