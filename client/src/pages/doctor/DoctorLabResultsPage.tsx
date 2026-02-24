import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "../../lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import {
    Search,
    Filter,
    Download,
    Eye,
    FileText,
    Calendar,
    User as UserIcon,
    Heart,
    Activity,
    Droplets,
    Microscope,
    Syringe,
    Pill
} from "lucide-react";
import { User, Patient, LabResult } from "../../types/schema";
import { toast } from "../../hooks/use-toast";

export default function DoctorLabResultsPage() {
    const { user } = useAuth();
    // Mock lab results data
    const mockLabResults: LabResult[] = [
        {
            id: "lr-001",
            patientId: "pat-001",
            doctorId: user?.id || "doc-001",
            testType: "Complete Blood Count",
            testDate: new Date("2023-06-15"),
            collectionDate: new Date("2023-06-15"),
            reportedDate: new Date("2023-06-16"),
            status: "normal",
            results: [
                { name: "Hemoglobin", value: "14.2", unit: "g/dL", referenceRange: "13.5-17.5", status: "normal" },
                { name: "RBC Count", value: "4.8", unit: "million/μL", referenceRange: "4.5-5.9", status: "normal" },
                { name: "WBC Count", value: "6.5", unit: "thousand/μL", referenceRange: "4.0-11.0", status: "normal" },
                { name: "Platelets", value: "250", unit: "thousand/μL", referenceRange: "150-400", status: "normal" }
            ],
            patientAge: 35,
            patientGender: "male",
            bloodType: "O+",
            comments: "All values within normal range. Patient is in good health."
        },
        {
            id: "lr-002",
            patientId: "pat-002",
            doctorId: user?.id || "doc-001",
            testType: "Lipid Profile",
            testDate: new Date("2023-06-10"),
            collectionDate: new Date("2023-06-10"),
            reportedDate: new Date("2023-06-11"),
            status: "abnormal",
            results: [
                { name: "Total Cholesterol", value: "245", unit: "mg/dL", referenceRange: "&lt;200", status: "high" },
                { name: "LDL Cholesterol", value: "165", unit: "mg/dL", referenceRange: "&lt;100", status: "high" },
                { name: "HDL Cholesterol", value: "35", unit: "mg/dL", referenceRange: "&gt;40", status: "low" },
                { name: "Triglycerides", value: "180", unit: "mg/dL", referenceRange: "&lt;150", status: "high" }
            ],
            patientAge: 28,
            patientGender: "male",
            bloodType: "A+",
            comments: "Elevated cholesterol levels. Recommend dietary changes and follow-up in 3 months."
        },
        {
            id: "lr-003",
            patientId: "pat-003",
            doctorId: user?.id || "doc-001",
            testType: "Thyroid Function",
            testDate: new Date("2023-06-05"),
            collectionDate: new Date("2023-06-05"),
            reportedDate: new Date("2023-06-06"),
            status: "normal",
            results: [
                { name: "TSH", value: "2.1", unit: "μIU/mL", referenceRange: "0.4-4.0", status: "normal" },
                { name: "T3", value: "1.8", unit: "ng/dL", referenceRange: "0.8-2.0", status: "normal" },
                { name: "T4", value: "8.5", unit: "μg/dL", referenceRange: "5.0-12.0", status: "normal" }
            ],
            patientAge: 42,
            patientGender: "male",
            bloodType: "B+",
            comments: "Thyroid function normal. Continue current medication."
        },
        {
            id: "lr-004",
            patientId: "pat-004",
            doctorId: user?.id || "doc-001",
            testType: "Liver Function",
            testDate: new Date("2023-05-28"),
            collectionDate: new Date("2023-05-28"),
            reportedDate: new Date("2023-05-29"),
            status: "pending",
            results: [
                { name: "ALT", value: "45", unit: "U/L", referenceRange: "&lt;40", status: "high" },
                { name: "AST", value: "38", unit: "U/L", referenceRange: "&lt;37", status: "high" },
                { name: "ALP", value: "95", unit: "U/L", referenceRange: "44-147", status: "normal" },
                { name: "Bilirubin", value: "1.2", unit: "mg/dL", referenceRange: "&lt;1.2", status: "normal" }
            ],
            patientAge: 31,
            patientGender: "male",
            bloodType: "AB+",
            comments: "Slightly elevated liver enzymes. Further testing recommended."
        },
        {
            id: "lr-005",
            patientId: "pat-005",
            doctorId: user?.id || "doc-001",
            testType: "Kidney Function",
            testDate: new Date("2023-05-20"),
            collectionDate: new Date("2023-05-20"),
            reportedDate: new Date("2023-05-21"),
            status: "normal",
            results: [
                { name: "Creatinine", value: "0.9", unit: "mg/dL", referenceRange: "0.7-1.3", status: "normal" },
                { name: "BUN", value: "15", unit: "mg/dL", referenceRange: "7-20", status: "normal" },
                { name: "eGFR", value: "95", unit: "mL/min/1.73m²", referenceRange: "&gt;60", status: "normal" }
            ],
            patientAge: 26,
            patientGender: "male",
            bloodType: "O-",
            comments: "Kidney function normal. No concerns at this time."
        },
        {
            id: "lr-006",
            patientId: "pat-006",
            doctorId: user?.id || "doc-001",
            testType: "Blood Glucose",
            testDate: new Date("2023-06-12"),
            collectionDate: new Date("2023-06-12"),
            reportedDate: new Date("2023-06-13"),
            status: "abnormal",
            results: [
                { name: "Fasting Glucose", value: "126", unit: "mg/dL", referenceRange: "&lt;100", status: "high" },
                { name: "HbA1c", value: "6.8", unit: "%", referenceRange: "&lt;5.7", status: "high" }
            ],
            patientAge: 30,
            patientGender: "female",
            bloodType: "A-",
            comments: "Indicative of diabetes. Recommend consultation with endocrinologist."
        },
        {
            id: "lr-007",
            patientId: "pat-007",
            doctorId: user?.id || "doc-001",
            testType: "Vitamin D",
            testDate: new Date("2023-06-08"),
            collectionDate: new Date("2023-06-08"),
            reportedDate: new Date("2023-06-09"),
            status: "abnormal",
            results: [
                { name: "Vitamin D", value: "22", unit: "ng/mL", referenceRange: "30-100", status: "low" }
            ],
            patientAge: 24,
            patientGender: "female",
            bloodType: "B-",
            comments: "Vitamin D deficiency. Recommend supplementation and increased sun exposure."
        },
        {
            id: "lr-008",
            patientId: "pat-008",
            doctorId: user?.id || "doc-001",
            testType: "Iron Panel",
            testDate: new Date("2023-06-03"),
            collectionDate: new Date("2023-06-03"),
            reportedDate: new Date("2023-06-04"),
            status: "normal",
            results: [
                { name: "Serum Iron", value: "85", unit: "μg/dL", referenceRange: "65-175", status: "normal" },
                { name: "Ferritin", value: "45", unit: "ng/mL", referenceRange: "15-150", status: "normal" },
                { name: "TIBC", value: "320", unit: "μg/dL", referenceRange: "250-400", status: "normal" }
            ],
            patientAge: 29,
            patientGender: "female",
            bloodType: "AB-",
            comments: "Iron levels normal. No supplementation needed."
        }
    ];

    // Mock patients data
    const mockPatients: User[] = [
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
            address: "Mumbai, Maharashtra"
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
            address: "Ahmedabad, Gujarat"
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
            address: "Delhi, India"
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
            address: "Chandigarh, Punjab"
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
            address: "Kolkata, West Bengal"
        },
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
            address: "Bangalore, Karnataka"
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
            address: "Pune, Maharashtra"
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
            address: "Hyderabad, Telangana"
        }
    ];

    const [searchTerm, setSearchTerm] = useState("");
    const [filterType, setFilterType] = useState("all");
    const [selectedResult, setSelectedResult] = useState<LabResult | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);

    // Use mock data instead of API calls
    const labResults = mockLabResults;
    const patients = mockPatients;

    // Get patient name by ID
    const getPatientName = (patientId?: string) => {
        if (!patientId) return "Unknown Patient";
        const patient = patients.find(p => p.id === patientId);
        return patient ? patient.name : "Unknown Patient";
    };

    // Filter lab results based on search term and filter type
    const filteredResults = labResults.filter(result => {
        const matchesSearch = getPatientName(result.patientId).toLowerCase().includes(searchTerm.toLowerCase()) ||
            result.testType.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterType === "all" || result.testType === filterType;
        return matchesSearch && matchesFilter;
    });

    // Get unique test types for filter dropdown
    const testTypes = Array.from(new Set(labResults.map(result => result.testType)));

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
                    <p className="text-red-600 mb-4">There was an issue loading the lab results.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-gray-900">Lab Results Management</h2>
                <p className="text-gray-600">View and manage patient laboratory results</p>
            </div>

            {/* Search and Filter Section */}
            <Card className="border-2 border-blue-200 bg-gradient-to-br from-white to-blue-50 shadow-md">
                <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <Input
                                placeholder="Search by patient name or test type..."
                                className="pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-2">
                            <select
                                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                value={filterType}
                                onChange={(e) => setFilterType(e.target.value)}
                            >
                                <option value="all">All Test Types</option>
                                {testTypes.map(type => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </select>
                            <Button
                                variant="outline"
                                className="border-gray-300 text-gray-700 hover:bg-gray-100"
                                onClick={() => {
                                    setSearchTerm("");
                                    setFilterType("all");
                                }}
                            >
                                <Filter className="h-4 w-4 mr-2" />
                                Clear
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="border-2 border-blue-200 bg-gradient-to-br from-white to-blue-50 shadow-md">
                    <CardContent className="p-4">
                        <div className="flex items-center">
                            <Microscope className="h-8 w-8 text-blue-600" />
                            <div className="ml-3">
                                <p className="text-sm text-gray-600">Total Tests</p>
                                <p className="text-2xl font-bold text-blue-900">{labResults.length}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-2 border-green-200 bg-gradient-to-br from-white to-green-50 shadow-md">
                    <CardContent className="p-4">
                        <div className="flex items-center">
                            <FileText className="h-8 w-8 text-green-600" />
                            <div className="ml-3">
                                <p className="text-sm text-gray-600">Normal Results</p>
                                <p className="text-2xl font-bold text-green-900">
                                    {labResults.filter(r => r.status === "normal").length}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-2 border-amber-200 bg-gradient-to-br from-white to-amber-50 shadow-md">
                    <CardContent className="p-4">
                        <div className="flex items-center">
                            <Activity className="h-8 w-8 text-amber-600" />
                            <div className="ml-3">
                                <p className="text-sm text-gray-600">Pending</p>
                                <p className="text-2xl font-bold text-amber-900">
                                    {labResults.filter(r => r.status === "pending").length}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-2 border-red-200 bg-gradient-to-br from-white to-red-50 shadow-md">
                    <CardContent className="p-4">
                        <div className="flex items-center">
                            <Heart className="h-8 w-8 text-red-600" />
                            <div className="ml-3">
                                <p className="text-sm text-gray-600">Abnormal</p>
                                <p className="text-2xl font-bold text-red-900">
                                    {labResults.filter(r => r.status === "abnormal").length}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Lab Results List */}
            {filteredResults.length === 0 ? (
                <Card className="border-2 border-blue-200 bg-gradient-to-br from-white to-blue-50 shadow-md">
                    <CardContent className="py-12 text-center">
                        <Microscope className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No Lab Results Found</h3>
                        <p className="text-gray-600 mb-4">No lab results match your current search criteria</p>
                        <Button
                            onClick={() => {
                                setSearchTerm("");
                                setFilterType("all");
                            }}
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                            <Filter className="h-4 w-4 mr-2" />
                            Clear Filters
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-4">
                    {filteredResults.map((result) => (
                        <Card
                            key={result.id}
                            className="border-2 border-blue-200 bg-white shadow-md hover:shadow-xl transition-all duration-300"
                        >
                            <CardContent className="p-0">
                                {/* Desktop view */}
                                <div className="hidden md:block p-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                                                <Microscope className="h-6 w-6 text-blue-600" />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-bold text-gray-900">{getPatientName(result.patientId)}</h3>
                                                <p className="text-sm text-gray-600">{result.testType}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-4">
                                            <div className="text-right">
                                                <p className="text-sm text-gray-600">Test Date</p>
                                                <p className="font-medium">{new Date(result.testDate).toLocaleDateString()}</p>
                                            </div>
                                            <Badge
                                                variant="outline"
                                                className={`${result.status === "abnormal"
                                                    ? "bg-red-100 text-red-800 border-red-300"
                                                    : result.status === "pending"
                                                        ? "bg-amber-100 text-amber-800 border-amber-300"
                                                        : "bg-green-100 text-green-800 border-green-300"
                                                    }`}
                                            >
                                                {result.status}
                                            </Badge>
                                            <Button
                                                onClick={() => setSelectedResult(result)}
                                                className="bg-blue-600 hover:bg-blue-700 text-white"
                                            >
                                                <Eye className="h-4 w-4 mr-1" />
                                                View
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="flex items-center text-sm text-gray-600">
                                            <UserIcon className="h-4 w-4 mr-2 text-blue-500" />
                                            <span>Age: {result.patientAge} years</span>
                                        </div>
                                        <div className="flex items-center text-sm text-gray-600">
                                            <Droplets className="h-4 w-4 mr-2 text-blue-500" />
                                            <span>Blood Type: {result.bloodType}</span>
                                        </div>
                                        <div className="flex items-center text-sm text-gray-600">
                                            <Calendar className="h-4 w-4 mr-2 text-blue-500" />
                                            <span>Collected: {new Date(result.collectionDate).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Mobile view */}
                                <div className="md:hidden p-4">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                                                <Microscope className="h-5 w-5 text-blue-600" />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-gray-900">{getPatientName(result.patientId)}</h3>
                                                <p className="text-xs text-gray-600">{result.testType}</p>
                                            </div>
                                        </div>
                                        <Badge
                                            variant="outline"
                                            className={`text-xs ${result.status === "abnormal"
                                                ? "bg-red-100 text-red-800 border-red-300"
                                                : result.status === "pending"
                                                    ? "bg-amber-100 text-amber-800 border-amber-300"
                                                    : "bg-green-100 text-green-800 border-green-300"
                                                }`}
                                        >
                                            {result.status}
                                        </Badge>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 mb-3">
                                        <div className="flex items-center">
                                            <Calendar className="h-3 w-3 mr-1 text-blue-500" />
                                            <span>{new Date(result.testDate).toLocaleDateString()}</span>
                                        </div>
                                        <div className="flex items-center">
                                            <UserIcon className="h-3 w-3 mr-1 text-blue-500" />
                                            <span>{result.patientAge}y</span>
                                        </div>
                                    </div>

                                    <Button
                                        size="sm"
                                        onClick={() => setSelectedResult(result)}
                                        className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs py-1 px-2 h-8"
                                    >
                                        <Eye className="h-3 w-3 mr-1" />
                                        View Details
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* Detailed Lab Result Modal */}
            {selectedResult && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-bold text-gray-900">Lab Result Details</h3>
                                <Button
                                    variant="outline"
                                    onClick={() => setSelectedResult(null)}
                                    className="border-gray-300 text-gray-700 hover:bg-gray-100"
                                >
                                    Close
                                </Button>
                            </div>

                            <div className="space-y-6">
                                <Card className="border-2 border-blue-200 bg-gradient-to-br from-white to-blue-50">
                                    <CardHeader>
                                        <CardTitle className="flex items-center space-x-2">
                                            <UserIcon className="h-5 w-5 text-blue-600" />
                                            <span>Patient Information</span>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-sm text-gray-600">Patient Name</p>
                                                <p className="font-medium">{getPatientName(selectedResult.patientId)}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600">Age</p>
                                                <p className="font-medium">{selectedResult.patientAge} years</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600">Blood Type</p>
                                                <p className="font-medium">{selectedResult.bloodType}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600">Gender</p>
                                                <p className="font-medium capitalize">{selectedResult.patientGender}</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="border-2 border-green-200 bg-gradient-to-br from-white to-green-50">
                                    <CardHeader>
                                        <CardTitle className="flex items-center justify-between">
                                            <div className="flex items-center space-x-2">
                                                <Microscope className="h-5 w-5 text-green-600" />
                                                <span>Test Information</span>
                                            </div>
                                            <Badge
                                                variant="outline"
                                                className={`${selectedResult.status === "abnormal"
                                                    ? "bg-red-100 text-red-800 border-red-300"
                                                    : selectedResult.status === "pending"
                                                        ? "bg-amber-100 text-amber-800 border-amber-300"
                                                        : "bg-green-100 text-green-800 border-green-300"
                                                    }`}
                                            >
                                                {selectedResult.status}
                                            </Badge>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-sm text-gray-600">Test Type</p>
                                                <p className="font-medium">{selectedResult.testType}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600">Test Date</p>
                                                <p className="font-medium">{new Date(selectedResult.testDate).toLocaleDateString()}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600">Collection Date</p>
                                                <p className="font-medium">{new Date(selectedResult.collectionDate).toLocaleDateString()}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600">Reported Date</p>
                                                <p className="font-medium">{new Date(selectedResult.reportedDate).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="border-2 border-purple-200 bg-gradient-to-br from-white to-purple-50">
                                    <CardHeader>
                                        <CardTitle className="flex items-center space-x-2">
                                            <Activity className="h-5 w-5 text-purple-600" />
                                            <span>Test Results</span>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-3">
                                            {selectedResult.results.map((item, index) => (
                                                <div key={index} className="flex justify-between items-center p-3 bg-white rounded-lg border">
                                                    <div>
                                                        <p className="font-medium text-gray-900">{item.name}</p>
                                                        <p className="text-sm text-gray-600">{item.unit}</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className={`font-medium ${item.status === "high" ? "text-red-600" :
                                                            item.status === "low" ? "text-amber-600" :
                                                                "text-green-600"
                                                            }`}>
                                                            {item.value}
                                                        </p>
                                                        <p className="text-xs text-gray-500">Reference: {item.referenceRange}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="border-2 border-amber-200 bg-gradient-to-br from-white to-amber-50">
                                    <CardHeader>
                                        <CardTitle className="flex items-center space-x-2">
                                            <FileText className="h-5 w-5 text-amber-600" />
                                            <span>Comments</span>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-gray-700">{selectedResult.comments || "No additional comments provided."}</p>
                                    </CardContent>
                                </Card>

                                <div className="flex gap-2 mt-4">
                                    <Button
                                        variant="outline"
                                        className="border-gray-300 text-gray-700 hover:bg-gray-100"
                                        onClick={() => {
                                            toast({
                                                title: "Report Downloaded",
                                                description: "Lab report has been downloaded successfully.",
                                                className: "bg-blue-50 border-blue-200 text-blue-800"
                                            });
                                        }}
                                    >
                                        <Download className="h-4 w-4 mr-2" />
                                        Download Report
                                    </Button>
                                    <Button
                                        className="bg-blue-600 hover:bg-blue-700 text-white"
                                        onClick={() => {
                                            toast({
                                                title: "Follow-up Test Requested",
                                                description: "Follow-up test has been requested successfully.",
                                                className: "bg-green-50 border-green-200 text-green-800"
                                            });
                                        }}
                                    >
                                        <Syringe className="h-4 w-4 mr-2" />
                                        Request Follow-up Test
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
