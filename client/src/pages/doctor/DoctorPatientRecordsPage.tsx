import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
    RefreshCw,
    Calendar,
    Heart,
    Droplets,
    Ruler,
    Weight,
    Activity,
    Search,
    Filter,
    Eye,
    BookOpen,
    Apple,
    FileText
} from "lucide-react";
import { User as UserType, Patient, Appointment } from "../../types/schema";

// Mock user data
const mockUsers: UserType[] = [
    {
        id: "user1",
        name: "Rajesh Kumar",
        email: "rajesh.kumar@example.com",
        phone: "+91 98765 43210",
        age: 38,
        gender: "male",
        address: "123 Main St, Mumbai",
        role: "patient",
        username: "rajeshk"
    },
    {
        id: "user2",
        name: "Priya Sharma",
        email: "priya.sharma@example.com",
        phone: "+91 98765 43211",
        age: 35,
        gender: "female",
        address: "456 Park Ave, Delhi",
        role: "patient",
        username: "priyas"
    },
    {
        id: "user3",
        name: "Amit Patel",
        email: "amit.patel@example.com",
        phone: "+91 98765 43212",
        age: 45,
        gender: "male",
        address: "789 Oak St, Bangalore",
        role: "patient",
        username: "amitp"
    },
    {
        id: "user4",
        name: "Sunita Verma",
        email: "sunita.verma@example.com",
        phone: "+91 98765 43213",
        age: 42,
        gender: "female",
        address: "101 Pine Rd, Chennai",
        role: "patient",
        username: "sunitav"
    },
    {
        id: "user5",
        name: "Vikram Singh",
        email: "vikram.singh@example.com",
        phone: "+91 98765 43214",
        age: 28,
        gender: "male",
        address: "202 Elm St, Kolkata",
        role: "patient",
        username: "vikrams"
    },
    {
        id: "user6",
        name: "Anjali Mehta",
        email: "anjali.mehta@example.com",
        phone: "+91 98765 43215",
        age: 35,
        gender: "female",
        address: "303 Cedar Ln, Hyderabad",
        role: "patient",
        username: "anjalim"
    },
    {
        id: "user7",
        name: "Deepak Gupta",
        email: "deepak.gupta@example.com",
        phone: "+91 98765 43216",
        age: 48,
        gender: "male",
        address: "404 Maple Dr, Pune",
        role: "patient",
        username: "deepakg"
    },
    {
        id: "user8",
        name: "Neha Reddy",
        email: "neha.reddy@example.com",
        phone: "+91 98765 43217",
        age: 31,
        gender: "female",
        address: "505 Birch Way, Ahmedabad",
        role: "patient",
        username: "nehar"
    },
    {
        id: "user9",
        name: "Sanjay Rao",
        email: "sanjay.rao@example.com",
        phone: "+91 98765 43218",
        age: 43,
        gender: "male",
        address: "606 Spruce Pl, Jaipur",
        role: "patient",
        username: "sanjayr"
    },
    {
        id: "user10",
        name: "Kavita Desai",
        email: "kavita.desai@example.com",
        phone: "+91 98765 43219",
        age: 36,
        gender: "female",
        address: "707 Willow St, Lucknow",
        role: "patient",
        username: "kavitad"
    }
];

// Mock patient data
const mockPatients: Patient[] = [
    {
        id: "1",
        userId: "user1",
        bloodType: "O+",
        height: 175,
        weight: 70,
        medicalHistory: {
            conditions: ["Hypertension"],
            allergies: ["Penicillin"],
            medications: ["Lisinopril"],
            surgeries: "Appendectomy (2010)",
            familyHistory: "Father had heart disease"
        }
    },
    {
        id: "2",
        userId: "user2",
        bloodType: "A+",
        height: 165,
        weight: 55,
        medicalHistory: {
            conditions: ["Diabetes"],
            allergies: ["Shellfish"],
            medications: ["Metformin"],
            surgeries: "None",
            familyHistory: "Mother has diabetes"
        }
    },
    {
        id: "3",
        userId: "user3",
        bloodType: "B+",
        height: 180,
        weight: 85,
        medicalHistory: {
            conditions: ["Asthma"],
            allergies: ["Dust"],
            medications: ["Albuterol"],
            surgeries: "None",
            familyHistory: "No significant history"
        }
    },
    {
        id: "4",
        userId: "user4",
        bloodType: "AB+",
        height: 160,
        weight: 60,
        medicalHistory: {
            conditions: ["Migraine"],
            allergies: ["Latex"],
            medications: ["Sumatriptan"],
            surgeries: "None",
            familyHistory: "Sister has migraines"
        }
    },
    {
        id: "5",
        userId: "user5",
        bloodType: "O-",
        height: 170,
        weight: 75,
        medicalHistory: {
            conditions: ["None"],
            allergies: ["None"],
            medications: ["None"],
            surgeries: "None",
            familyHistory: "No significant history"
        }
    },
    {
        id: "6",
        userId: "user6",
        bloodType: "A-",
        height: 168,
        weight: 58,
        medicalHistory: {
            conditions: ["Thyroid disorder"],
            allergies: ["Iodine"],
            medications: ["Levothyroxine"],
            surgeries: "None",
            familyHistory: "Mother has thyroid issues"
        }
    },
    {
        id: "7",
        userId: "user7",
        bloodType: "B-",
        height: 178,
        weight: 82,
        medicalHistory: {
            conditions: ["High cholesterol"],
            allergies: ["None"],
            medications: ["Atorvastatin"],
            surgeries: "None",
            familyHistory: "Father had heart attack"
        }
    },
    {
        id: "8",
        userId: "user8",
        bloodType: "AB-",
        height: 162,
        weight: 57,
        medicalHistory: {
            conditions: ["PCOS"],
            allergies: ["Peanuts"],
            medications: ["Metformin"],
            surgeries: "None",
            familyHistory: "Sister has PCOS"
        }
    },
    {
        id: "9",
        userId: "user9",
        bloodType: "O+",
        height: 176,
        weight: 78,
        medicalHistory: {
            conditions: ["GERD"],
            allergies: ["None"],
            medications: ["Omeprazole"],
            surgeries: "None",
            familyHistory: "No significant history"
        }
    },
    {
        id: "10",
        userId: "user10",
        bloodType: "A+",
        height: 164,
        weight: 62,
        medicalHistory: {
            conditions: ["Anemia"],
            allergies: ["None"],
            medications: ["Iron supplements"],
            surgeries: "None",
            familyHistory: "Mother had anemia"
        }
    }
];

export default function DoctorPatientRecordsPage() {
    const { user } = useAuth();
    const { t } = useLanguage();
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");
    const [filterGender, setFilterGender] = useState("all");

    // Mock query for patient data
    const { data: patients = [], isLoading, isError } = useQuery<Patient[]>({
        queryKey: ["/api/patients"],
        queryFn: () => Promise.resolve(mockPatients),
        staleTime: 5 * 60 * 1000, // 5 minutes
    });

    // Mock query for user data
    const { data: users = [] } = useQuery<UserType[]>({
        queryKey: ["/api/users"],
        queryFn: () => Promise.resolve(mockUsers),
        staleTime: 5 * 60 * 1000, // 5 minutes
    });

    // Combine patient and user data
    const patientUsers = patients.map(patient => {
        const user = users.find(u => u.id === patient.userId);
        return { ...patient, ...user };
    });

    // Filter patients based on search term and gender filter
    const filteredPatients = patientUsers.filter(patient => {
        const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            patient.phone.includes(searchTerm);

        const matchesGender = filterGender === "all" || patient.gender === filterGender;

        return matchesSearch && matchesGender;
    });

    const handleViewDetails = (patientId: string) => {
        navigate(`/doctor/patients/${patientId}`);
    };

    const handleRefresh = () => {
        queryClient.invalidateQueries({ queryKey: ["/api/patients"] });
        toast({
            title: "Refreshed",
            description: "Patient records have been updated",
            className: "bg-green-50 border-green-200 text-green-800"
        });
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                <div className="flex flex-col items-center">
                    <Activity className="h-12 w-12 text-red-500 mb-4" />
                    <h3 className="text-lg font-medium text-red-800 mb-2">Error Loading Data</h3>
                    <p className="text-red-600 mb-4">There was an issue loading patient records.</p>
                    <Button
                        onClick={handleRefresh}
                        className="bg-red-600 hover:bg-red-700 text-white"
                    >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Try Again
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-blue-900">Patient Records</h2>
                    <p className="text-gray-600">Manage and view patient medical records</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                    <Button
                        onClick={handleRefresh}
                        variant="outline"
                        className="border-blue-300 text-blue-700 hover:bg-blue-100 hover:shadow-md transition-all duration-200 flex items-center"
                    >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Refresh
                    </Button>
                </div>
            </div>

            {/* Search and Filter Section */}
            <Card className="border-2 border-blue-200 bg-gradient-to-br from-white to-blue-50 shadow-md">
                <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <input
                                type="text"
                                placeholder="Search by name, email, or phone..."
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-2">
                            <select
                                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                value={filterGender}
                                onChange={(e) => setFilterGender(e.target.value)}
                            >
                                <option value="all">All Genders</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                            </select>
                            <Button
                                variant="outline"
                                className="border-gray-300 text-gray-700 hover:bg-gray-100"
                                onClick={() => {
                                    setSearchTerm("");
                                    setFilterGender("all");
                                }}
                            >
                                <Filter className="h-4 w-4 mr-2" />
                                Clear
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Health Tips Quick Access */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Health Tips Card */}
                <Card className="border-t-4 border-t-green-500 hover:shadow-xl transition-all duration-300 bg-white border-2 border-gray-200">
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <Heart className="h-5 w-5 text-green-600" />
                                <span>Health Tips</span>
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                className="border-green-300 text-green-700 hover:bg-green-100"
                                onClick={() => navigate("/doctor/health-tips")}
                            >
                                View All
                            </Button>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            <div className="p-3 bg-green-50 rounded-lg border border-green-100 hover:bg-green-100 transition-colors cursor-pointer"
                                onClick={() => navigate("/doctor/health-tips")}>
                                <div className="flex items-start">
                                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-3">
                                        <Droplets className="h-4 w-4 text-green-600" />
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-green-900">Stay Hydrated</h4>
                                        <p className="text-xs text-green-700">Drink at least 8 glasses of water daily for optimal health.</p>
                                    </div>
                                </div>
                            </div>
                            <div className="p-3 bg-green-50 rounded-lg border border-green-100 hover:bg-green-100 transition-colors cursor-pointer"
                                onClick={() => navigate("/doctor/health-tips")}>
                                <div className="flex items-start">
                                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-3">
                                        <Activity className="h-4 w-4 text-green-600" />
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-green-900">Regular Exercise</h4>
                                        <p className="text-xs text-green-700">30 minutes of moderate exercise 5 times a week.</p>
                                    </div>
                                </div>
                            </div>
                            <div className="p-3 bg-green-50 rounded-lg border border-green-100 hover:bg-green-100 transition-colors cursor-pointer"
                                onClick={() => navigate("/doctor/health-tips")}>
                                <div className="flex items-start">
                                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-3">
                                        <Apple className="h-4 w-4 text-green-600" />
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-green-900">Balanced Diet</h4>
                                        <p className="text-xs text-green-700">Include variety of fruits, vegetables, and lean proteins.</p>
                                    </div>
                                </div>
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
                            <div className="p-3 bg-blue-50 rounded-lg border border-blue-100 hover:bg-blue-100 transition-colors cursor-pointer"
                                onClick={() => navigate("/doctor/health-tips")}>
                                <div className="flex items-start">
                                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                                        <Activity className="h-4 w-4 text-blue-600" />
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-blue-900">Understanding Blood Pressure</h4>
                                        <p className="text-xs text-blue-700">Learn about normal ranges and management techniques.</p>
                                    </div>
                                </div>
                            </div>
                            <div className="p-3 bg-blue-50 rounded-lg border border-blue-100 hover:bg-blue-100 transition-colors cursor-pointer"
                                onClick={() => navigate("/doctor/health-tips")}>
                                <div className="flex items-start">
                                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                                        <Droplets className="h-4 w-4 text-blue-600" />
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-blue-900">Diabetes Management</h4>
                                        <p className="text-xs text-blue-700">Essential guidelines for controlling blood sugar levels.</p>
                                    </div>
                                </div>
                            </div>
                            <div className="p-3 bg-blue-50 rounded-lg border border-blue-100 hover:bg-blue-100 transition-colors cursor-pointer"
                                onClick={() => navigate("/doctor/health-tips")}>
                                <div className="flex items-start">
                                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                                        <Heart className="h-4 w-4 text-blue-600" />
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-blue-900">Heart-Healthy Diet</h4>
                                        <p className="text-xs text-blue-700">Dietary recommendations to support cardiovascular health.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Quick Actions Card */}
                <Card className="border-t-4 border-t-purple-500 hover:shadow-xl transition-all duration-300 bg-white border-2 border-gray-200">
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <User className="h-5 w-5 text-purple-600" />
                                <span>Quick Actions</span>
                            </div>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            <Button
                                variant="outline"
                                className="w-full justify-start border-purple-300 text-purple-700 hover:bg-purple-100"
                                onClick={() => navigate("/doctor/health-tips")}
                            >
                                <Heart className="h-4 w-4 mr-2 text-purple-600" />
                                Share Health Tips
                            </Button>
                            <Button
                                variant="outline"
                                className="w-full justify-start border-purple-300 text-purple-700 hover:bg-purple-100"
                                onClick={() => navigate("/doctor/patients")}
                            >
                                <FileText className="h-4 w-4 mr-2 text-purple-600" />
                                View Patient Records
                            </Button>
                            <Button
                                variant="outline"
                                className="w-full justify-start border-purple-300 text-purple-700 hover:bg-purple-100"
                                onClick={() => navigate("/doctor/appointments")}
                            >
                                <Calendar className="h-4 w-4 mr-2 text-purple-600" />
                                Schedule Appointment
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Patient Records Grid */}
            {filteredPatients.length === 0 ? (
                <Card className="border-2 border-blue-200 bg-gradient-to-br from-white to-blue-50 shadow-md">
                    <CardContent className="py-12 text-center">
                        <User className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No Patients Found</h3>
                        <p className="text-gray-600 mb-4">Try adjusting your search or filter criteria</p>
                        <Button
                            onClick={() => {
                                setSearchTerm("");
                                setFilterGender("all");
                            }}
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Reset Filters
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredPatients.map((patient) => (
                        <Card
                            key={patient.id}
                            className="border-2 border-blue-200 bg-white shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
                        >
                            <CardHeader className="pb-3">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <CardTitle className="flex items-center gap-2 text-lg">
                                            <User className="h-5 w-5 text-blue-600" />
                                            <span className="text-blue-900">{patient.name}</span>
                                        </CardTitle>
                                        <p className="text-sm text-gray-600 mt-1">{patient.email}</p>
                                    </div>
                                    <Badge
                                        variant="outline"
                                        className={`${patient.gender === "male"
                                            ? "bg-blue-100 text-blue-800 border-blue-300"
                                            : "bg-pink-100 text-pink-800 border-pink-300"
                                            }`}
                                    >
                                        {patient.gender}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    <div className="flex items-center text-sm text-gray-600">
                                        <Phone className="h-4 w-4 mr-2 text-blue-500" />
                                        <span>{patient.phone}</span>
                                    </div>
                                    <div className="flex items-center text-sm text-gray-600">
                                        <Calendar className="h-4 w-4 mr-2 text-blue-500" />
                                        <span>
                                            Age: {patient.age} years
                                        </span>
                                    </div>
                                    <div className="flex items-center text-sm text-gray-600">
                                        <Droplets className="h-4 w-4 mr-2 text-blue-500" />
                                        <span>Blood: {patient.bloodType}</span>
                                    </div>
                                    <div className="flex items-center text-sm text-gray-600">
                                        <Ruler className="h-4 w-4 mr-2 text-blue-500" />
                                        <span>Height: {patient.height} cm</span>
                                        <Weight className="h-4 w-4 mx-2 text-blue-500" />
                                        <span>Weight: {patient.weight} kg</span>
                                    </div>
                                </div>

                                <div className="mt-4 pt-4 border-t border-gray-200">
                                    <div className="flex justify-between items-center">
                                        <div className="flex flex-wrap gap-1">
                                            {patient.medicalHistory.conditions.length > 0 && patient.medicalHistory.conditions[0] !== "None" ? (
                                                patient.medicalHistory.conditions.slice(0, 2).map((condition, index) => (
                                                    <Badge key={index} variant="default" className="bg-red-100 text-red-800 text-xs">
                                                        {condition}
                                                    </Badge>
                                                ))
                                            ) : (
                                                <Badge variant="default" className="bg-green-100 text-green-800 text-xs">
                                                    Healthy
                                                </Badge>
                                            )}
                                            {patient.medicalHistory.conditions.length > 2 && (
                                                <Badge variant="secondary" className="text-xs">
                                                    +{patient.medicalHistory.conditions.length - 2}
                                                </Badge>
                                            )}
                                        </div>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleViewDetails(patient.id)}
                                            className="border-blue-300 text-blue-700 hover:bg-blue-100"
                                        >
                                            <Eye className="h-4 w-4 mr-1" />
                                            View
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
