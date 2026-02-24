import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useLanguage } from "../../contexts/LanguageContext";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { toast } from "../../hooks/use-toast";
import {
    User,
    Phone,
    Mail,
    Calendar,
    Heart,
    Droplets,
    Ruler,
    Weight,
    Activity,
    ArrowLeft,
    Edit,
    FileText,
    Stethoscope,
    Pill,
    AlertTriangle,
    CheckCircle,
    Clock,
    MapPin,
    BookOpen
} from "lucide-react";
import { User as UserType, Patient, Appointment } from "../../types/schema";
import { getPatientImage } from "../../lib/patientImageGenerator";

export default function DoctorPatientDetailsPage() {
    const { user } = useAuth();
    const { t } = useLanguage();
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const { patientId } = useParams<{ patientId: string }>();

    // Fetch Vitals History
    const { data: vitals = [] } = useQuery<any[]>({
        queryKey: [`/api/vitals/patient/${patientId}`],
        enabled: !!patientId,
    });

    // Fetch Latest Vitals Snapshot
    const { data: latestVitals } = useQuery<any>({
        queryKey: [`/api/vitals/latest/${patientId}`],
        enabled: !!patientId,
    });

    // Mock doctor data
    const mockDoctors: UserType[] = [
        {
            id: "doc-001",
            username: "dr_priyanka",
            role: "doctor",
            name: "Dr. Sure Yoga Priyanka",
            email: "priyanka.sureyoga@example.com",
            age: 35,
            gender: "female",
            department: "General Medicine",
            specialization: "Yoga Therapy",
            phone: "+91 98765 43201",
            address: "Bangalore, Karnataka"
        },
        {
            id: "doc-002",
            username: "dr_manasa",
            role: "doctor",
            name: "Dr. Bhetabutdi Manasa",
            email: "manasa.bhetabutdi@example.com",
            age: 32,
            gender: "female",
            department: "Cardiology",
            specialization: "Heart Care",
            phone: "+91 98765 43202",
            address: "Hyderabad, Telangana"
        },
        {
            id: "doc-003",
            username: "dr_rajesh",
            role: "doctor",
            name: "Dr. Rajesh Kumar",
            email: "rajesh.kumar@example.com",
            age: 40,
            gender: "male",
            department: "Orthopedics",
            specialization: "Joint Replacement",
            phone: "+91 98765 43203",
            address: "Chennai, Tamil Nadu"
        }
    ];

    // Mock patient data with 5 male and 5 female patients
    const mockPatients: UserType[] = [
        // Male patients
        {
            id: "pat-001",
            username: "rohit_sharma",
            role: "patient",
            name: "Rohit Sharma",
            email: "rohit.sharma@example.com",
            age: 35,
            gender: "male",
            bloodGroup: "O+",
            phone: "+91 98765 43210",
            address: "Mumbai, Maharashtra",
            profileImage: null,
            createdAt: new Date("2023-01-15")
        },
        {
            id: "pat-002",
            username: "arjun_patel",
            role: "patient",
            name: "Arjun Patel",
            email: "arjun.patel@example.com",
            age: 28,
            gender: "male",
            bloodGroup: "A+",
            phone: "+91 98765 43211",
            address: "Ahmedabad, Gujarat",
            profileImage: null,
            createdAt: new Date("2023-02-20")
        },
        {
            id: "pat-003",
            username: "vikram_singh",
            role: "patient",
            name: "Vikram Singh",
            email: "vikram.singh@example.com",
            age: 42,
            gender: "male",
            bloodGroup: "B+",
            phone: "+91 98765 43212",
            address: "Delhi, India",
            profileImage: null,
            createdAt: new Date("2023-03-10")
        },
        {
            id: "pat-004",
            username: "rahul_mehra",
            role: "patient",
            name: "Rahul Mehra",
            email: "rahul.mehra@example.com",
            age: 31,
            gender: "male",
            bloodGroup: "AB+",
            phone: "+91 98765 43213",
            address: "Chandigarh, Punjab",
            profileImage: null,
            createdAt: new Date("2023-04-05")
        },
        {
            id: "pat-005",
            username: "sumit_kumar",
            role: "patient",
            name: "Sumit Kumar",
            email: "sumit.kumar@example.com",
            age: 26,
            gender: "male",
            bloodGroup: "O-",
            phone: "+91 98765 43214",
            address: "Kolkata, West Bengal",
            profileImage: null,
            createdAt: new Date("2023-05-12")
        },
        // Female patients
        {
            id: "pat-006",
            username: "priya_verma",
            role: "patient",
            name: "Priya Verma",
            email: "priya.verma@example.com",
            age: 30,
            gender: "female",
            bloodGroup: "A-",
            phone: "+91 98765 43215",
            address: "Bangalore, Karnataka",
            profileImage: null,
            createdAt: new Date("2023-06-18")
        },
        {
            id: "pat-007",
            username: "ananya_gupta",
            role: "patient",
            name: "Ananya Gupta",
            email: "ananya.gupta@example.com",
            age: 24,
            gender: "female",
            bloodGroup: "B-",
            phone: "+91 98765 43216",
            address: "Pune, Maharashtra",
            profileImage: null,
            createdAt: new Date("2023-07-22")
        },
        {
            id: "pat-008",
            username: "sneha_reddy",
            role: "patient",
            name: "Sneha Reddy",
            email: "sneha.reddy@example.com",
            age: 29,
            gender: "female",
            bloodGroup: "AB-",
            phone: "+91 98765 43217",
            address: "Hyderabad, Telangana",
            profileImage: null,
            createdAt: new Date("2023-08-30")
        },
        {
            id: "pat-009",
            username: "poonam_shah",
            role: "patient",
            name: "Poonam Shah",
            email: "poonam.shah@example.com",
            age: 33,
            gender: "female",
            bloodGroup: "O+",
            phone: "+91 98765 43218",
            address: "Chennai, Tamil Nadu",
            profileImage: null,
            createdAt: new Date("2023-09-15")
        },
        {
            id: "pat-010",
            username: "kriti_jain",
            role: "patient",
            name: "Kriti Jain",
            email: "kriti.jain@example.com",
            age: 27,
            gender: "female",
            bloodGroup: "A+",
            phone: "+91 98765 43219",
            address: "Jaipur, Rajasthan",
            profileImage: null,
            createdAt: new Date("2023-10-25")
        }
    ];

    // Mock appointments for all 10 patients
    const mockAppointments: Appointment[] = [
        // Appointments for Dr. Sure Yoga Priyanka (5 appointments)
        {
            id: "apt-001",
            patientId: "pat-001", // Rohit Sharma
            doctorId: "doc-001", // Dr. Sure Yoga Priyanka
            scheduledAt: new Date(new Date().setDate(new Date().getDate() + 1)),
            status: "scheduled",
            priority: "normal",
            symptoms: "Back pain and stiffness",
            diagnosis: "Muscle strain",
            treatment: "Yoga therapy and physiotherapy"
        },
        {
            id: "apt-002",
            patientId: "pat-002", // Arjun Patel
            doctorId: "doc-001", // Dr. Sure Yoga Priyanka
            scheduledAt: new Date(new Date().setDate(new Date().getDate() + 2)),
            status: "scheduled",
            priority: "urgent",
            symptoms: "Chronic neck pain",
            diagnosis: "Cervical spondylosis",
            treatment: "Yoga asanas and medication"
        },
        {
            id: "apt-003",
            patientId: "pat-003", // Vikram Singh
            doctorId: "doc-001", // Dr. Sure Yoga Priyanka
            scheduledAt: new Date(new Date().setDate(new Date().getDate() + 3)),
            status: "scheduled",
            priority: "normal",
            symptoms: "Stress and anxiety",
            diagnosis: "Work-related stress",
            treatment: "Meditation and breathing exercises"
        },
        {
            id: "apt-004",
            patientId: "pat-004", // Rahul Mehra
            doctorId: "doc-001", // Dr. Sure Yoga Priyanka
            scheduledAt: new Date(new Date().setDate(new Date().getDate() + 4)),
            status: "scheduled",
            priority: "critical",
            symptoms: "Severe headache and dizziness",
            diagnosis: "Migraine",
            treatment: "Yoga therapy and lifestyle changes"
        },
        {
            id: "apt-005",
            patientId: "pat-005", // Sumit Kumar
            doctorId: "doc-001", // Dr. Sure Yoga Priyanka
            scheduledAt: new Date(new Date().setDate(new Date().getDate() + 5)),
            status: "scheduled",
            priority: "normal",
            symptoms: "Joint pain",
            diagnosis: "Early arthritis",
            treatment: "Yoga and joint exercises"
        },
        // Appointments for Dr. Bhetabutdi Manasa
        {
            id: "apt-006",
            patientId: "pat-006", // Priya Verma
            doctorId: "doc-002", // Dr. Bhetabutdi Manasa
            scheduledAt: new Date(new Date().setDate(new Date().getDate() + 1)),
            status: "scheduled",
            priority: "urgent",
            symptoms: "Chest pain and palpitations",
            diagnosis: "Arrhythmia",
            treatment: "Medication and cardiac rehab"
        },
        {
            id: "apt-007",
            patientId: "pat-007", // Ananya Gupta
            doctorId: "doc-002", // Dr. Bhetabutdi Manasa
            scheduledAt: new Date(new Date().setDate(new Date().getDate() + 2)),
            status: "scheduled",
            priority: "normal",
            symptoms: "High blood pressure",
            diagnosis: "Hypertension",
            treatment: "Dietary changes and medication"
        },
        {
            id: "apt-008",
            patientId: "pat-008", // Sneha Reddy
            doctorId: "doc-002", // Dr. Bhetabutdi Manasa
            scheduledAt: new Date(new Date().setDate(new Date().getDate() + 3)),
            status: "scheduled",
            priority: "critical",
            symptoms: "Shortness of breath",
            diagnosis: "Heart failure",
            treatment: "Intensive care and medication"
        },
        // Appointments for Dr. Rajesh Kumar
        {
            id: "apt-009",
            patientId: "pat-009", // Poonam Shah
            doctorId: "doc-003", // Dr. Rajesh Kumar
            scheduledAt: new Date(new Date().setDate(new Date().getDate() + 1)),
            status: "scheduled",
            priority: "normal",
            symptoms: "Knee pain",
            diagnosis: "Osteoarthritis",
            treatment: "Physiotherapy and joint injections"
        },
        {
            id: "apt-010",
            patientId: "pat-010", // Kriti Jain
            doctorId: "doc-003", // Dr. Rajesh Kumar
            scheduledAt: new Date(new Date().setDate(new Date().getDate() + 2)),
            status: "scheduled",
            priority: "urgent",
            symptoms: "Back injury",
            diagnosis: "Herniated disc",
            treatment: "Spinal therapy and exercises"
        }
    ];

    // Find the current patient based on patientId
    const currentPatient = mockPatients.find(patient => patient.id === patientId) || mockPatients[0];

    // Find the current patient's appointments
    const currentPatientAppointments = mockAppointments.filter(appointment => appointment.patientId === currentPatient.id);

    // Find the doctors for the current patient's appointments
    const currentPatientDoctors = mockDoctors.filter(doctor =>
        currentPatientAppointments.some(appointment => appointment.doctorId === doctor.id)
    );

    // Mock patient medical data
    const mockPatientMedical: Patient = {
        id: `med-${currentPatient.id?.split('-')[1] || '001'}`,
        userId: currentPatient.id,
        medicalHistory: {
            conditions: ["Hypertension", "Type 2 Diabetes"],
            surgeries: ["Appendectomy (2010)"],
            hospitalizations: []
        },
        allergies: ["Penicillin", "Shellfish"],
        medications: [
            { name: "Metformin", dosage: "500mg", frequency: "Twice daily" },
            { name: "Lisinopril", dosage: "10mg", frequency: "Once daily" }
        ],
        emergencyContact: {
            name: "Jane Doe",
            relationship: "Spouse",
            phone: "+1 (555) 987-6543"
        },
        bloodType: currentPatient.bloodGroup || "O+",
        height: 175,
        weight: 82,
        bmi: "26.8",
        lastVisit: new Date("2024-01-15")
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center space-x-4">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate("/doctor/patients")}
                    className="border-gray-300 text-gray-700 hover:bg-gray-100"
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Patients
                </Button>
                <h2 className="text-2xl font-bold text-gray-900">Patient Details</h2>
            </div>

            {/* Patient Overview */}
            <Card className="border-t-4 border-t-blue-500 bg-white">
                <CardHeader>
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                        <div className="flex items-center space-x-4">
                            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
                                <img
                                    src={getPatientImage(currentPatient) || "/default-avatar.png"}
                                    alt={currentPatient.name}
                                    className="w-16 h-16 rounded-full object-cover"
                                    onError={(e) => {
                                        // Fallback to default icon if image fails to load
                                        const target = e.target as HTMLImageElement;
                                        target.onerror = null;
                                        target.style.display = "none";
                                        const fallback = document.createElement("div");
                                        fallback.innerHTML = '<User className="h-8 w-8 text-blue-600" />';
                                        target.parentElement?.appendChild(fallback);
                                    }}
                                />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-900">{currentPatient.name}</h3>
                                <p className="text-gray-600">Patient ID: {currentPatient.id}</p>
                            </div>
                        </div>
                        <div className="flex space-x-2">
                            <Button variant="outline" className="border-blue-300 text-blue-700 hover:bg-blue-100">
                                <Edit className="h-4 w-4 mr-2" />
                                Edit Profile
                            </Button>
                            <Button className="bg-blue-600 hover:bg-blue-700">
                                <FileText className="h-4 w-4 mr-2" />
                                New Appointment
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="flex items-center space-x-2">
                            <Mail className="h-4 w-4 text-blue-600" />
                            <span className="text-sm">{currentPatient.email}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Phone className="h-4 w-4 text-blue-600" />
                            <span className="text-sm">{currentPatient.phone}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4 text-blue-600" />
                            <span className="text-sm">{currentPatient.age} years old</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Droplets className="h-4 w-4 text-blue-600" />
                            <span className="text-sm">Blood: {currentPatient.bloodGroup}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <User className="h-4 w-4 text-blue-600" />
                            <span className="text-sm capitalize">{currentPatient.gender}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <MapPin className="h-4 w-4 text-blue-600" />
                            <span className="text-sm truncate">{currentPatient.address}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Activity className="h-4 w-4 text-blue-600" />
                            <span className="text-sm">Member since {currentPatient.createdAt?.toLocaleDateString()}</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Medical Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border-l-4 border-l-green-500 bg-white">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm">Height</p>
                                <p className="text-2xl font-bold text-gray-900">{mockPatientMedical.height} cm</p>
                            </div>
                            <Ruler className="h-8 w-8 text-green-600" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-amber-500 bg-white">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm">Weight</p>
                                <p className="text-2xl font-bold text-gray-900">{mockPatientMedical.weight} kg</p>
                            </div>
                            <Weight className="h-8 w-8 text-amber-600" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-purple-500 bg-white">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm">BMI</p>
                                <p className="text-2xl font-bold text-gray-900">{mockPatientMedical.bmi}</p>
                            </div>
                            <Activity className="h-8 w-8 text-purple-600" />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Normal range: 18.5 - 24.9</p>
                    </CardContent>
                </Card>
            </div>

            {/* Health Tips Recommendations */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Health Tips Card */}
                <Card className="border-t-4 border-t-green-500 hover:shadow-xl transition-all duration-300 bg-white border-2 border-gray-200">
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <Heart className="h-5 w-5 text-green-600" />
                                <span>Health Recommendations</span>
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                className="border-green-300 text-green-700 hover:bg-green-100"
                                onClick={() => navigate("/doctor/health-tips")}
                            >
                                View All Tips
                            </Button>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            <div className="p-3 bg-green-50 rounded-lg border border-green-100">
                                <h4 className="font-medium text-green-900">Stay Hydrated</h4>
                                <p className="text-sm text-green-700">Recommend drinking at least 8 glasses of water daily for optimal health.</p>
                            </div>
                            <div className="p-3 bg-green-50 rounded-lg border border-green-100">
                                <h4 className="font-medium text-green-900">Regular Exercise</h4>
                                <p className="text-sm text-green-700">Suggest 30 minutes of moderate exercise 5 times a week.</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Patient Education Card */}
                <Card className="border-t-4 border-t-blue-500 hover:shadow-xl transition-all duration-300 bg-white border-2 border-gray-200">
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <BookOpen className="h-5 w-5 text-blue-600" />
                                <span>Patient Education</span>
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                className="border-blue-300 text-blue-700 hover:bg-blue-100"
                                onClick={() => navigate("/doctor/health-tips")}
                            >
                                Browse Resources
                            </Button>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                                <h4 className="font-medium text-blue-900">Understanding Blood Pressure</h4>
                                <p className="text-sm text-blue-700">Educate about normal ranges and management techniques.</p>
                            </div>
                            <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                                <h4 className="font-medium text-blue-900">Diabetes Management</h4>
                                <p className="text-sm text-blue-700">Provide essential guidelines for controlling blood sugar levels.</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Medical History */}
                <Card className="border-t-4 border-t-red-500 bg-white">
                    <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                            <Stethoscope className="h-5 w-5 text-red-600" />
                            <span>Medical History</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div>
                                <h4 className="font-medium text-gray-900 mb-2">Conditions</h4>
                                <div className="flex flex-wrap gap-2">
                                    {mockPatientMedical.medicalHistory?.conditions?.map((condition, index) => (
                                        <Badge key={index} variant="destructive" className="text-xs">
                                            {condition}
                                        </Badge>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h4 className="font-medium text-gray-900 mb-2">Surgeries</h4>
                                <ul className="text-sm text-gray-600 space-y-1">
                                    {mockPatientMedical.medicalHistory?.surgeries?.map((surgery, index) => (
                                        <li key={index}>{surgery}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Allergies */}
                <Card className="border-t-4 border-t-yellow-500 bg-white">
                    <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                            <AlertTriangle className="h-5 w-5 text-yellow-600" />
                            <span>Allergies</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-2">
                            {mockPatientMedical.allergies?.map((allergy, index) => (
                                <Badge key={index} variant="outline" className="border-yellow-300 text-yellow-700">
                                    {allergy}
                                </Badge>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Current Medications */}
                <Card className="border-t-4 border-t-blue-500 bg-white">
                    <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                            <Pill className="h-5 w-5 text-blue-600" />
                            <span>Current Medications</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {mockPatientMedical.medications?.map((med, index) => (
                                <div key={index} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                                    <div>
                                        <p className="font-medium text-gray-900">{med.name}</p>
                                        <p className="text-sm text-gray-600">{med.dosage}</p>
                                    </div>
                                    <Badge variant="secondary" className="text-xs">
                                        {med.frequency}
                                    </Badge>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Clinical Vitals History (from Nurse) */}
                <Card className="border-t-4 border-t-rose-500 bg-white shadow-md">
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Activity className="h-5 w-5 text-rose-600" />
                                <span>Clinical Vitals History</span>
                                <Badge variant="outline" className="ml-2 bg-rose-50 text-rose-700 border-rose-200">Recent Nurse Records</Badge>
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                className="border-rose-200 text-rose-700 hover:bg-rose-50 font-bold"
                                onClick={() => navigate(`/nurse/vitals/history?patientId=${patientId}`)}
                            >
                                VIEW TREND CHARTS
                            </Button>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {latestVitals && (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 p-4 bg-rose-50/50 rounded-xl border border-rose-100">
                                <div className="text-center border-r border-rose-100">
                                    <p className="text-[10px] font-black text-rose-400 uppercase">Latest Temp</p>
                                    <p className="text-lg font-black text-rose-600">{latestVitals.temperature}°C</p>
                                </div>
                                <div className="text-center border-r border-rose-100">
                                    <p className="text-[10px] font-black text-rose-400 uppercase">Latest BP</p>
                                    <p className="text-lg font-black text-blue-600">{latestVitals.bloodPressure?.systolic}/{latestVitals.bloodPressure?.diastolic}</p>
                                </div>
                                <div className="text-center border-r border-rose-100">
                                    <p className="text-[10px] font-black text-rose-400 uppercase">Latest Pulse</p>
                                    <p className="text-lg font-black text-rose-600">{latestVitals.pulseRate} BPM</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-[10px] font-black text-rose-400 uppercase">Latest SpO2</p>
                                    <p className="text-lg font-black text-cyan-600">{latestVitals.spo2}%</p>
                                </div>
                            </div>
                        )}
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead>
                                    <tr className="bg-slate-50 text-slate-500 font-bold border-b">
                                        <th className="px-4 py-3">Date/Time</th>
                                        <th className="px-4 py-3 text-center">Temp</th>
                                        <th className="px-4 py-3 text-center">BP (Sys/Dia)</th>
                                        <th className="px-4 py-3 text-center">Pulse</th>
                                        <th className="px-4 py-3 text-center">SpO2</th>
                                        <th className="px-4 py-3">Nurse</th>
                                        <th className="px-4 py-3">Notes</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {vitals?.length > 0 ? (
                                        vitals.map((v: any) => (
                                            <tr key={v.id} className="hover:bg-slate-50">
                                                <td className="px-4 py-3 text-slate-600">{new Date(v.recordedAt).toLocaleString()}</td>
                                                <td className="px-4 py-3 text-center font-bold text-orange-600">{v.temperature}°C</td>
                                                <td className="px-4 py-3 text-center font-bold text-blue-600">{v.bloodPressure.systolic}/{v.bloodPressure.diastolic}</td>
                                                <td className="px-4 py-3 text-center font-bold text-rose-600">{v.pulseRate} bpm</td>
                                                <td className="px-4 py-3 text-center font-bold text-cyan-600">{v.spo2}%</td>
                                                <td className="px-4 py-3 font-medium text-slate-700">{v.nurseId?.name || 'Assigned Nurse'}</td>
                                                <td className="px-4 py-3 text-slate-500 italic max-w-xs truncate">{v.notes || '-'}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={7} className="px-4 py-8 text-center text-slate-400">
                                                <Activity className="w-8 h-8 mx-auto mb-2 opacity-20" />
                                                No recent vitals recorded by nursing staff.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>

                {/* Emergency Contact */}
                <Card className="border-t-4 border-t-green-500 bg-white">
                    <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                            <CheckCircle className="h-5 w-5 text-green-600" />
                            <span>Emergency Contact</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            <p className="font-medium text-gray-900">{mockPatientMedical.emergencyContact?.name}</p>
                            <p className="text-sm text-gray-600">{mockPatientMedical.emergencyContact?.relationship}</p>
                            <div className="flex items-center text-sm text-gray-600">
                                <Phone className="h-4 w-4 mr-2 text-green-600" />
                                <span>{mockPatientMedical.emergencyContact?.phone}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Appointment History */}
            <Card className="border-t-4 border-t-indigo-500 bg-white">
                <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                        <Clock className="h-5 w-5 text-indigo-600" />
                        <span>Appointment History</span>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {currentPatientAppointments.length > 0 ? (
                            currentPatientAppointments.map((appointment) => {
                                const doctor = mockDoctors.find(d => d.id === appointment.doctorId);
                                return (
                                    <div key={appointment.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                                        <div>
                                            <p className="font-medium text-gray-900">
                                                {new Date(appointment.scheduledAt).toLocaleDateString()} - {new Date(appointment.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                            <p className="text-sm text-gray-600">Doctor: {doctor?.name || "Unknown Doctor"}</p>
                                            <p className="text-sm text-gray-600">Symptoms: {appointment.symptoms}</p>
                                            {appointment.diagnosis && (
                                                <p className="text-sm text-gray-600">Diagnosis: {appointment.diagnosis}</p>
                                            )}
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Badge
                                                variant={
                                                    appointment.status === "completed" ? "default" :
                                                        appointment.priority === "critical" ? "destructive" :
                                                            appointment.priority === "urgent" ? "secondary" :
                                                                "default"
                                                }
                                            >
                                                {appointment.status}
                                            </Badge>
                                            <Badge
                                                variant={
                                                    appointment.priority === "critical" ? "destructive" :
                                                        appointment.priority === "urgent" ? "secondary" :
                                                            "default"
                                                }
                                            >
                                                {appointment.priority}
                                            </Badge>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <p className="text-gray-500 text-center py-4">No appointment history found</p>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
