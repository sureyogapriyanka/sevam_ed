import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "../../lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { toast } from "../../hooks/use-toast";
import {
    UserPlus,
    ArrowRight,
    ArrowLeft,
    CheckCircle2,
    Smartphone,
    Fingerprint,
    Home,
    Search
} from "lucide-react";

type Step = 'personal' | 'identity' | 'location' | 'otp';

export default function RegisterPatientPage() {
    const navigate = useNavigate();
    const [step, setStep] = useState<Step>('personal');
    const [formData, setFormData] = useState({
        name: '',
        age: '',
        gender: '',
        bloodGroup: '',
        mobileNumber: '',
        aadhaarNumber: '',
        abhaId: '',
        state: '',
        district: '',
        city: '',
        pincode: '',
        address: '',
        insuranceProvider: '',
        policyNumber: ''
    });

    const [otp, setOtp] = useState('');
    const [sentOtp, setSentOtp] = useState<string | null>(null);

    const updateFormData = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const sendOtpMutation = useMutation({
        mutationFn: async () => {
            const res = await apiRequest("POST", "/api/patients/send-otp", { mobileNumber: formData.mobileNumber });
            return res.json();
        },
        onSuccess: (data) => {
            setSentOtp(data.otp);
            setStep('otp');
            toast({
                title: "OTP Sent",
                description: `Verification code sent to ${formData.mobileNumber}`,
            });
        }
    });

    const registerPatientMutation = useMutation({
        mutationFn: async () => {
            const API = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
            const token = localStorage.getItem('token') || '';
            const res = await fetch(`${API}/patients/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({
                    name: formData.name,
                    age: parseInt(formData.age),
                    gender: formData.gender,
                    bloodGroup: formData.bloodGroup,
                    mobileNumber: formData.mobileNumber,
                    aadhaarNumber: formData.aadhaarNumber,
                    abhaId: formData.abhaId,
                    address: `${formData.address}, ${formData.city}, ${formData.district}, ${formData.state} - ${formData.pincode}`,
                    state: formData.state,
                    district: formData.district,
                    city: formData.city,
                    pincode: formData.pincode,
                    insuranceProvider: formData.insuranceProvider,
                    policyNumber: formData.policyNumber,
                })
            });
            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.message || 'Registration failed');
            }
            return res.json();
        },
        onSuccess: () => {
            toast({ title: "Success", description: "Patient registered successfully" });
            navigate('/receptionist/dashboard');
        },
        onError: (err: any) => {
            toast({ title: "Registration Failed", description: err.message, variant: "destructive" });
        }
    });

    const handleNext = () => {
        if (step === 'personal') setStep('identity');
        else if (step === 'identity') setStep('location');
        else if (step === 'location') sendOtpMutation.mutate();
    };

    const handleBack = () => {
        if (step === 'identity') setStep('personal');
        else if (step === 'location') setStep('identity');
        else if (step === 'otp') setStep('location');
    };

    const verifyAndRegister = () => {
        if (otp === sentOtp || otp === '123456') { // Allow 123456 for demo
            registerPatientMutation.mutate();
        } else {
            toast({
                title: "Invalid OTP",
                description: "Please enter the correct verification code",
                variant: "destructive"
            });
        }
    };

    return (
        <div className="max-w-4xl mx-auto py-8 px-4">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-black text-gray-900">Patient Registration</h1>
                    <p className="text-gray-500 font-medium">Add a new patient to SevaOnline HMS</p>
                </div>
                <div className="flex space-x-2">
                    {(['personal', 'identity', 'location', 'otp'] as Step[]).map((s, idx) => (
                        <div
                            key={s}
                            className={`h-2 w-8 rounded-full transition-all duration-300 ${step === s ? 'bg-blue-600 w-12' :
                                (['personal', 'identity', 'location', 'otp'].indexOf(step) > idx ? 'bg-emerald-500' : 'bg-gray-200')
                                }`}
                        />
                    ))}
                </div>
            </div>

            <Card className="border-2 border-gray-100 shadow-xl overflow-hidden rounded-3xl mt-2">
                <CardHeader className="bg-slate-50 border-b border-gray-100 p-6">
                    <CardTitle className="flex items-center gap-3 text-xl font-black">
                        {step === 'personal' && <UserPlus className="h-6 w-6 text-blue-600" />}
                        {step === 'identity' && <Fingerprint className="h-6 w-6 text-purple-600" />}
                        {step === 'location' && <Home className="h-6 w-6 text-emerald-600" />}
                        {step === 'otp' && <Smartphone className="h-6 w-6 text-amber-600" />}
                        {step.charAt(0).toUpperCase() + step.slice(1)} Information
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                    {step === 'personal' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-right-4">
                            <div className="space-y-2">
                                <Label className="text-sm font-bold text-gray-700">Full Name (As per Aadhaar)</Label>
                                <Input
                                    placeholder="Enter full name"
                                    className="h-12 border-2 focus-visible:ring-blue-600"
                                    value={formData.name}
                                    onChange={(e) => updateFormData('name', e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-sm font-bold text-gray-700">Mobile Number</Label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold">+91</span>
                                    <Input
                                        placeholder="10-digit mobile"
                                        className="h-12 pl-12 border-2 focus-visible:ring-blue-600"
                                        maxLength={10}
                                        value={formData.mobileNumber}
                                        onChange={(e) => updateFormData('mobileNumber', e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-sm font-bold text-gray-700">Age</Label>
                                <Input
                                    type="number"
                                    placeholder="Years"
                                    className="h-12 border-2 focus-visible:ring-blue-600"
                                    value={formData.age}
                                    onChange={(e) => updateFormData('age', e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-sm font-bold text-gray-700">Gender</Label>
                                <Select onValueChange={(v) => updateFormData('gender', v)} value={formData.gender}>
                                    <SelectTrigger className="h-12 border-2">
                                        <SelectValue placeholder="Select gender" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="male">Male</SelectItem>
                                        <SelectItem value="female">Female</SelectItem>
                                        <SelectItem value="other">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-sm font-bold text-gray-700">Blood Group</Label>
                                <Select onValueChange={(v) => updateFormData('bloodGroup', v)} value={formData.bloodGroup}>
                                    <SelectTrigger className="h-12 border-2">
                                        <SelectValue placeholder="Select blood group" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                                            <SelectItem key={bg} value={bg}>{bg}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-sm font-bold text-gray-700">Address / Street</Label>
                                <Input
                                    placeholder="House no., street name"
                                    className="h-12 border-2"
                                    value={formData.address}
                                    onChange={(e) => updateFormData('address', e.target.value)}
                                />
                            </div>
                        </div>
                    )}

                    {step === 'identity' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-right-4">
                            <div className="space-y-2">
                                <Label className="text-sm font-bold text-gray-700">Aadhaar Number</Label>
                                <Input
                                    placeholder="12-digit number"
                                    className="h-12 border-2 focus-visible:ring-purple-600"
                                    maxLength={12}
                                    value={formData.aadhaarNumber}
                                    onChange={(e) => updateFormData('aadhaarNumber', e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-sm font-bold text-gray-700">ABHA ID (Health ID)</Label>
                                <Input
                                    placeholder="14-digit number"
                                    className="h-12 border-2 focus-visible:ring-purple-600"
                                    maxLength={14}
                                    value={formData.abhaId}
                                    onChange={(e) => updateFormData('abhaId', e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-sm font-bold text-gray-700">Insurance Provider (Optional)</Label>
                                <Input
                                    placeholder="e.g. Star Health, PMJAY"
                                    className="h-12 border-2"
                                    value={formData.insuranceProvider}
                                    onChange={(e) => updateFormData('insuranceProvider', e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-sm font-bold text-gray-700">Policy Number</Label>
                                <Input
                                    placeholder="Enter policy number"
                                    className="h-12 border-2"
                                    value={formData.policyNumber}
                                    onChange={(e) => updateFormData('policyNumber', e.target.value)}
                                />
                            </div>
                        </div>
                    )}

                    {step === 'location' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-right-4">
                            <div className="space-y-2">
                                <Label className="text-sm font-bold text-gray-700">State</Label>
                                <Input
                                    placeholder="Enter state"
                                    className="h-12 border-2 focus-visible:ring-emerald-600"
                                    value={formData.state}
                                    onChange={(e) => updateFormData('state', e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-sm font-bold text-gray-700">District</Label>
                                <Input
                                    placeholder="Enter district"
                                    className="h-12 border-2 focus-visible:ring-emerald-600"
                                    value={formData.district}
                                    onChange={(e) => updateFormData('district', e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-sm font-bold text-gray-700">Pincode</Label>
                                <Input
                                    placeholder="6-digit pincode"
                                    className="h-12 border-2 focus-visible:ring-emerald-600"
                                    maxLength={6}
                                    value={formData.pincode}
                                    onChange={(e) => updateFormData('pincode', e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-sm font-bold text-gray-700">City/Local Area</Label>
                                <Input
                                    placeholder="Enter city or area"
                                    className="h-12 border-2 focus-visible:ring-emerald-600"
                                    value={formData.city}
                                    onChange={(e) => updateFormData('city', e.target.value)}
                                />
                            </div>
                        </div>
                    )}

                    {step === 'otp' && (
                        <div className="flex flex-col items-center text-center space-y-6 py-6 animate-in fade-in zoom-in-95">
                            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center">
                                <Smartphone className="h-8 w-8 text-amber-600" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-black text-gray-900">Verify Mobile</h3>
                                <p className="text-gray-500 font-medium max-w-xs mx-auto">
                                    A 6-digit verification code has been sent to +91 {formData.mobileNumber}
                                </p>
                            </div>
                            <div className="w-full max-w-xs">
                                <Input
                                    placeholder="X X X X X X"
                                    className="h-16 text-center text-3xl font-black tracking-[1em] border-2 focus-visible:ring-amber-500"
                                    maxLength={6}
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                />
                            </div>
                            <Button variant="link" className="text-gray-400 font-bold" onClick={() => sendOtpMutation.mutate()}>
                                Didn't receive code? Resend
                            </Button>
                        </div>
                    )}

                    <div className="mt-12 flex items-center justify-between">
                        <Button
                            variant="ghost"
                            className={`h-12 px-8 font-black text-gray-400 hover:text-gray-900 ${step === 'personal' ? 'opacity-0 pointer-events-none' : ''}`}
                            onClick={handleBack}
                        >
                            <ArrowLeft className="mr-2 h-5 w-5" />
                            BACK
                        </Button>

                        {step === 'otp' ? (
                            <Button
                                className="h-14 px-12 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-2xl shadow-lg shadow-emerald-200"
                                onClick={verifyAndRegister}
                                disabled={registerPatientMutation.isPending}
                            >
                                <CheckCircle2 className="mr-2 h-5 w-5" />
                                {registerPatientMutation.isPending ? 'REGISTERING...' : 'COMPLETE REGISTRATION'}
                            </Button>
                        ) : (
                            <Button
                                className="h-14 px-12 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl shadow-lg shadow-blue-200"
                                onClick={handleNext}
                                disabled={sendOtpMutation.isPending}
                            >
                                {sendOtpMutation.isPending ? 'SENDING OTP...' : 'NEXT STEP'}
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
