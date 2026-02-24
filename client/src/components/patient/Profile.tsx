import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authService, patientService } from '../../services/api';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { useToast } from '../../hooks/use-toast';

interface User {
    id: string;
    name: string;
    email: string;
    age: number | null;
    gender: string | null;
    phone: string | null;
    address: string | null;
    bloodGroup: string | null;
    profileImage: string | null;
}

interface Patient {
    id: string;
    userId: string;
    medicalHistory: any;
    allergies: string[];
    medications: any;
    emergencyContact: any;
    bloodType: string | null;
    height: number | null;
    weight: number | null;
    bmi: string | null;
    lastVisit: string | null;
}

const Profile: React.FC = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [patient, setPatient] = useState<Patient | null>(null);
    const { toast } = useToast();
    const queryClient = useQueryClient();

    // Fetch user profile
    const { data: profileData, isLoading: isProfileLoading } = useQuery({
        queryKey: ['userProfile'],
        queryFn: authService.getProfile
    });

    useEffect(() => {
        if (profileData?.data) {
            setUser(profileData.data);
        }
    }, [profileData]);

    // Fetch patient data
    const { data: patientData, isLoading: isPatientLoading } = useQuery({
        queryKey: ['patientData', user?.id],
        queryFn: () => patientService.getByUserId(user?.id || ''),
        enabled: !!user?.id
    });

    useEffect(() => {
        if (patientData?.data) {
            setPatient(patientData.data);
        }
    }, [patientData]);

    // Update profile mutation
    const updateProfileMutation = useMutation({
        mutationFn: (profileData: any) => authService.updateProfile(profileData),
        onSuccess: (data) => {
            if (data.data) {
                setUser(data.data);
                toast({
                    title: "Success",
                    description: "Profile updated successfully!",
                });
                setIsEditing(false);
                queryClient.invalidateQueries({ queryKey: ['userProfile'] });
            } else {
                toast({
                    title: "Error",
                    description: data.error || "Failed to update profile",
                    variant: "destructive",
                });
            }
        },
        onError: (error: any) => {
            toast({
                title: "Error",
                description: "Failed to update profile",
                variant: "destructive",
            });
        }
    });

    // Update patient data mutation
    const updatePatientMutation = useMutation({
        mutationFn: (patientData: any) => patientService.update(patient?.id || '', patientData),
        onSuccess: (data) => {
            if (data.data) {
                setPatient(data.data);
                toast({
                    title: "Success",
                    description: "Patient information updated successfully!",
                });
                queryClient.invalidateQueries({ queryKey: ['patientData', user?.id] });
            } else {
                toast({
                    title: "Error",
                    description: data.error || "Failed to update patient information",
                    variant: "destructive",
                });
            }
        },
        onError: (error: any) => {
            toast({
                title: "Error",
                description: "Failed to update patient information",
                variant: "destructive",
            });
        }
    });

    const handleSave = () => {
        if (user) {
            updateProfileMutation.mutate({
                name: user.name,
                email: user.email,
                age: user.age,
                gender: user.gender,
                phone: user.phone,
                address: user.address,
                bloodGroup: user.bloodGroup,
            });
        }

        if (patient) {
            updatePatientMutation.mutate({
                bloodType: patient.bloodType,
                height: patient.height,
                weight: patient.weight,
            });
        }
    };

    const handleChange = (field: keyof User, value: string | number | null) => {
        if (user) {
            setUser({
                ...user,
                [field]: value
            });
        }
    };

    const handlePatientChange = (field: keyof Patient, value: string | number | null) => {
        if (patient) {
            setPatient({
                ...patient,
                [field]: value
            });
        }
    };

    if (isProfileLoading || isPatientLoading) {
        return <div>Loading profile...</div>;
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle>My Profile</CardTitle>
                        <Button
                            onClick={() => setIsEditing(!isEditing)}
                            variant={isEditing ? "outline" : "default"}
                        >
                            {isEditing ? 'Cancel' : 'Edit Profile'}
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-bold">{user?.name || 'N/A'}</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="name">Full Name</Label>
                            {isEditing ? (
                                <Input
                                    id="name"
                                    value={user?.name || ''}
                                    onChange={(e) => handleChange('name', e.target.value)}
                                />
                            ) : (
                                <p>{user?.name || 'N/A'}</p>
                            )}
                        </div>

                        <div>
                            <Label htmlFor="email">Email</Label>
                            {isEditing ? (
                                <Input
                                    id="email"
                                    type="email"
                                    value={user?.email || ''}
                                    onChange={(e) => handleChange('email', e.target.value)}
                                />
                            ) : (
                                <p>{user?.email || 'N/A'}</p>
                            )}
                        </div>

                        <div>
                            <Label htmlFor="phone">Phone</Label>
                            {isEditing ? (
                                <Input
                                    id="phone"
                                    value={user?.phone || ''}
                                    onChange={(e) => handleChange('phone', e.target.value)}
                                />
                            ) : (
                                <p>{user?.phone || 'N/A'}</p>
                            )}
                        </div>

                        <div>
                            <Label htmlFor="age">Age</Label>
                            {isEditing ? (
                                <Input
                                    id="age"
                                    type="number"
                                    value={user?.age || ''}
                                    onChange={(e) => handleChange('age', e.target.value ? parseInt(e.target.value) : null)}
                                />
                            ) : (
                                <p>{user?.age || 'N/A'}</p>
                            )}
                        </div>

                        <div>
                            <Label htmlFor="gender">Gender</Label>
                            {isEditing ? (
                                <select
                                    id="gender"
                                    className="w-full p-2 border rounded"
                                    value={user?.gender || ''}
                                    onChange={(e) => handleChange('gender', e.target.value || null)}
                                >
                                    <option value="">Select Gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                            ) : (
                                <p>{user?.gender || 'N/A'}</p>
                            )}
                        </div>

                        <div>
                            <Label htmlFor="bloodGroup">Blood Group</Label>
                            {isEditing ? (
                                <Input
                                    id="bloodGroup"
                                    value={user?.bloodGroup || ''}
                                    onChange={(e) => handleChange('bloodGroup', e.target.value)}
                                />
                            ) : (
                                <p>{user?.bloodGroup || 'N/A'}</p>
                            )}
                        </div>

                        <div className="md:col-span-2">
                            <Label htmlFor="address">Address</Label>
                            {isEditing ? (
                                <Input
                                    id="address"
                                    value={user?.address || ''}
                                    onChange={(e) => handleChange('address', e.target.value)}
                                />
                            ) : (
                                <p>{user?.address || 'N/A'}</p>
                            )}
                        </div>
                    </div>

                    {isEditing && (
                        <div className="flex justify-end space-x-2 pt-4">
                            <Button
                                variant="outline"
                                onClick={() => setIsEditing(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleSave}
                                disabled={updateProfileMutation.isPending || updatePatientMutation.isPending}
                            >
                                {updateProfileMutation.isPending || updatePatientMutation.isPending ? 'Saving...' : 'Update Profile'}
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle>Medical Information</CardTitle>
                        {isEditing && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    // Scroll to the medical info section when editing
                                    document.getElementById('bloodType')?.scrollIntoView({ behavior: 'smooth' });
                                }}
                            >
                                Edit Medical Info
                            </Button>
                        )}
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="bloodType">Blood Type</Label>
                            {isEditing ? (
                                <Input
                                    id="bloodType"
                                    value={patient?.bloodType || ''}
                                    onChange={(e) => handlePatientChange('bloodType', e.target.value)}
                                />
                            ) : (
                                <p>{patient?.bloodType || 'N/A'}</p>
                            )}
                        </div>

                        <div>
                            <Label htmlFor="height">Height (cm)</Label>
                            {isEditing ? (
                                <Input
                                    id="height"
                                    type="number"
                                    value={patient?.height || ''}
                                    onChange={(e) => handlePatientChange('height', e.target.value ? parseInt(e.target.value) : null)}
                                />
                            ) : (
                                <p>{patient?.height || 'N/A'}</p>
                            )}
                        </div>

                        <div>
                            <Label htmlFor="weight">Weight (kg)</Label>
                            {isEditing ? (
                                <Input
                                    id="weight"
                                    type="number"
                                    value={patient?.weight || ''}
                                    onChange={(e) => handlePatientChange('weight', e.target.value ? parseInt(e.target.value) : null)}
                                />
                            ) : (
                                <p>{patient?.weight || 'N/A'}</p>
                            )}
                        </div>

                        <div>
                            <Label>BMI</Label>
                            <p className="text-lg font-semibold">
                                {patient?.bmi ||
                                    (patient?.height && patient?.weight
                                        ? (patient.weight / Math.pow(patient.height / 100, 2)).toFixed(1)
                                        : 'N/A')}
                            </p>
                            <p className="text-sm text-muted-foreground">
                                {patient?.height && patient?.weight && (
                                    parseFloat((patient.weight / Math.pow(patient.height / 100, 2)).toFixed(1)) < 18.5
                                        ? 'Underweight'
                                        : parseFloat((patient.weight / Math.pow(patient.height / 100, 2)).toFixed(1)) < 25
                                            ? 'Normal weight'
                                            : parseFloat((patient.weight / Math.pow(patient.height / 100, 2)).toFixed(1)) < 30
                                                ? 'Overweight'
                                                : 'Obese'
                                )}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Profile Summary</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-3">
                            <h3 className="text-lg font-semibold">Personal Information</h3>
                            <div className="space-y-2">
                                <div>
                                    <Label className="text-sm text-muted-foreground">Full Name</Label>
                                    <p className="font-medium">{user?.name || 'N/A'}</p>
                                </div>
                                <div>
                                    <Label className="text-sm text-muted-foreground">Email</Label>
                                    <p className="font-medium">{user?.email || 'N/A'}</p>
                                </div>
                                <div>
                                    <Label className="text-sm text-muted-foreground">Phone</Label>
                                    <p className="font-medium">{user?.phone || 'N/A'}</p>
                                </div>
                                <div>
                                    <Label className="text-sm text-muted-foreground">Age</Label>
                                    <p className="font-medium">{user?.age ? `${user.age} years` : 'N/A'}</p>
                                </div>
                                <div>
                                    <Label className="text-sm text-muted-foreground">Gender</Label>
                                    <p className="font-medium">{user?.gender || 'N/A'}</p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <h3 className="text-lg font-semibold">Medical Information</h3>
                            <div className="space-y-2">
                                <div>
                                    <Label className="text-sm text-muted-foreground">Blood Group</Label>
                                    <p className="font-medium">{user?.bloodGroup || 'N/A'}</p>
                                </div>
                                <div>
                                    <Label className="text-sm text-muted-foreground">Blood Type</Label>
                                    <p className="font-medium">{patient?.bloodType || 'N/A'}</p>
                                </div>
                                <div>
                                    <Label className="text-sm text-muted-foreground">Height</Label>
                                    <p className="font-medium">{patient?.height ? `${patient.height} cm` : 'N/A'}</p>
                                </div>
                                <div>
                                    <Label className="text-sm text-muted-foreground">Weight</Label>
                                    <p className="font-medium">{patient?.weight ? `${patient.weight} kg` : 'N/A'}</p>
                                </div>
                                <div>
                                    <Label className="text-sm text-muted-foreground">BMI</Label>
                                    <p className="font-medium">
                                        {patient?.bmi ||
                                            (patient?.height && patient?.weight
                                                ? (patient.weight / Math.pow(patient.height / 100, 2)).toFixed(1)
                                                : 'N/A')}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="md:col-span-2 pt-4">
                            <div>
                                <Label className="text-sm text-muted-foreground">Address</Label>
                                <p className="font-medium">{user?.address || 'N/A'}</p>
                            </div>
                        </div>
                    </div>

                    <div className="pt-6 flex justify-center">
                        <Button
                            onClick={() => setIsEditing(true)}
                            size="lg"
                            className="w-full md:w-auto"
                        >
                            Update Profile Information
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default Profile;
