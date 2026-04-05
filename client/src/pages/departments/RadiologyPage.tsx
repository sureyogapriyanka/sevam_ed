import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { useNavigate } from 'react-router-dom';
import LoginPromptModal from '../../components/common/LoginPromptModal';
import {
    Scan,
    Activity,
    Shield,
    UserCheck,
    Clock,
    Stethoscope,
    Phone,
    Zap,
    Eye
} from 'lucide-react';

const RadiologyPage: React.FC = () => {
    const navigate = useNavigate();
    const [showLoginModal, setShowLoginModal] = useState(false);

    const handleBookAppointment = () => {
        setShowLoginModal(true);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
            {/* Hero Section */}
            <section className="relative bg-gradient-to-r from-slate-600 to-gray-600 text-white py-20">
                <div className="absolute inset-0">
                    <img
                        src="https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=1600&q=80"
                        alt="Radiology Department - Indian Hospital"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-slate-600/70" />
                </div>
                <div className="relative container mx-auto px-6">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="flex justify-center mb-6">
                            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                                <Scan className="h-8 w-8 text-white" />
                            </div>
                        </div>
                        <h1 className="text-4xl lg:text-6xl font-bold mb-6">Radiology Department</h1>
                        <p className="text-xl lg:text-2xl mb-8 leading-relaxed">
                            Advanced Medical Imaging & Diagnostic Services in India
                        </p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <Button
                                size="lg"
                                className="bg-white text-slate-600 hover:bg-gray-100"
                                onClick={handleBookAppointment}
                            >
                                <Scan className="h-5 w-5 mr-2" />
                                Book Imaging Scan
                            </Button>
                            <Button
                                size="lg"
                                variant="outline"
                                className="border-white text-white hover:bg-white/10"
                                onClick={() => window.open('tel:+91-11-4567-8907', '_self')}
                            >
                                <Phone className="h-5 w-5 mr-2" />
                                Radiology Helpline
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Department Stats */}
            <section className="py-12 bg-white">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <Card className="text-center bg-gray-50 border-gray-200">
                            <CardContent className="p-6">
                                <Scan className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                                <h3 className="text-2xl font-bold text-gray-800">50000+</h3>
                                <p className="text-gray-600">Scans Performed</p>
                            </CardContent>
                        </Card>
                        <Card className="text-center bg-gray-50 border-gray-200">
                            <CardContent className="p-6">
                                <UserCheck className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                                <h3 className="text-2xl font-bold text-gray-800">10+</h3>
                                <p className="text-gray-600">Radiologists</p>
                            </CardContent>
                        </Card>
                        <Card className="text-center bg-gray-50 border-gray-200">
                            <CardContent className="p-6">
                                <Eye className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                                <h3 className="text-2xl font-bold text-gray-800">99.8%</h3>
                                <p className="text-gray-600">Accuracy Rate</p>
                            </CardContent>
                        </Card>
                        <Card className="text-center bg-gray-50 border-gray-200">
                            <CardContent className="p-6">
                                <Clock className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                                <h3 className="text-2xl font-bold text-gray-800">24/7</h3>
                                <p className="text-gray-600">Emergency Imaging</p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Imaging Services */}
            <section className="py-16 bg-gray-50">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-800 mb-4">Advanced Imaging Services</h2>
                        <p className="text-xl text-gray-600">State-of-the-art diagnostic imaging technology</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <Card className="hover:shadow-lg transition-all duration-300">
                            <CardHeader>
                                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                                    <Scan className="h-6 w-6 text-gray-600" />
                                </div>
                                <CardTitle className="text-gray-800">MRI Scanning</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600">
                                    High-resolution magnetic resonance imaging for detailed diagnosis.
                                </p>
                                <ul className="mt-4 space-y-2 text-sm text-gray-500">
                                    <li>• 3T MRI Scanner</li>
                                    <li>• Brain & Spine MRI</li>
                                    <li>• Cardiac MRI</li>
                                    <li>• MR Angiography</li>
                                </ul>
                            </CardContent>
                        </Card>

                        <Card className="hover:shadow-lg transition-all duration-300">
                            <CardHeader>
                                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                                    <Activity className="h-6 w-6 text-gray-600" />
                                </div>
                                <CardTitle className="text-gray-800">CT Scanning</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600">
                                    Advanced computed tomography with rapid image acquisition.
                                </p>
                                <ul className="mt-4 space-y-2 text-sm text-gray-500">
                                    <li>• 128-Slice CT Scanner</li>
                                    <li>• CT Angiography</li>
                                    <li>• Contrast Studies</li>
                                    <li>• Emergency CT</li>
                                </ul>
                            </CardContent>
                        </Card>

                        <Card className="hover:shadow-xl transition-all duration-300">
                            <CardHeader>
                                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                                    <Stethoscope className="h-6 w-6 text-green-600" />
                                </div>
                                <CardTitle className="text-green-800">Ultrasound</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600">
                                    High-frequency ultrasound imaging for various applications.
                                </p>
                                <ul className="mt-4 space-y-2 text-sm text-gray-500">
                                    <li>• Obstetric Ultrasound</li>
                                    <li>• Abdominal Scanning</li>
                                    <li>• Doppler Studies</li>
                                    <li>• 4D Imaging</li>
                                </ul>
                            </CardContent>
                        </Card>

                        <Card className="hover:shadow-xl transition-all duration-300">
                            <CardHeader>
                                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                                    <Zap className="h-6 w-6 text-purple-600" />
                                </div>
                                <CardTitle className="text-purple-800">X-Ray Services</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600">
                                    Digital radiography with immediate image processing.
                                </p>
                                <ul className="mt-4 space-y-2 text-sm text-gray-500">
                                    <li>• Digital X-Ray</li>
                                    <li>• Fluoroscopy</li>
                                    <li>• Mammography</li>
                                    <li>• Bone Densitometry</li>
                                </ul>
                            </CardContent>
                        </Card>

                        <Card className="hover:shadow-xl transition-all duration-300">
                            <CardHeader>
                                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                                    <Eye className="h-6 w-6 text-orange-600" />
                                </div>
                                <CardTitle className="text-orange-800">Nuclear Medicine</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600">
                                    Functional imaging using radioactive tracers.
                                </p>
                                <ul className="mt-4 space-y-2 text-sm text-gray-500">
                                    <li>• PET-CT Scanning</li>
                                    <li>• SPECT Imaging</li>
                                    <li>• Thyroid Scans</li>
                                    <li>• Bone Scans</li>
                                </ul>
                            </CardContent>
                        </Card>

                        <Card className="hover:shadow-xl transition-all duration-300">
                            <CardHeader>
                                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                                    <Shield className="h-6 w-6 text-red-600" />
                                </div>
                                <CardTitle className="text-red-800">Interventional Radiology</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600">
                                    Minimally invasive procedures guided by imaging.
                                </p>
                                <ul className="mt-4 space-y-2 text-sm text-gray-500">
                                    <li>• Angioplasty</li>
                                    <li>• Embolization</li>
                                    <li>• Biopsy Procedures</li>
                                    <li>• Drainage Procedures</li>
                                </ul>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Advanced Technology */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-800 mb-4">Cutting-Edge Technology</h2>
                        <p className="text-xl text-gray-600">Latest imaging equipment for precise diagnosis</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <img
                                src="https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80"
                                alt="Advanced MRI Scanner"
                                className="w-full h-80 object-cover rounded-lg shadow-lg"
                            />
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold text-gray-800 mb-6">State-of-the-Art Imaging Infrastructure</h3>
                            <div className="space-y-4">
                                <div className="flex items-start space-x-3">
                                    <Scan className="h-6 w-6 text-blue-600 mt-1" />
                                    <div>
                                        <h4 className="font-semibold text-gray-800">3 Tesla MRI Scanner</h4>
                                        <p className="text-gray-600">Ultra-high field strength for superior image quality</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <Activity className="h-6 w-6 text-cyan-600 mt-1" />
                                    <div>
                                        <h4 className="font-semibold text-gray-800">128-Slice CT Scanner</h4>
                                        <p className="text-gray-600">Rapid scanning with excellent image resolution</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <Eye className="h-6 w-6 text-green-600 mt-1" />
                                    <div>
                                        <h4 className="font-semibold text-gray-800">PET-CT Hybrid System</h4>
                                        <p className="text-gray-600">Combined metabolic and anatomical imaging</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <Shield className="h-6 w-6 text-purple-600 mt-1" />
                                    <div>
                                        <h4 className="font-semibold text-gray-800">AI-Assisted Reporting</h4>
                                        <p className="text-gray-600">Artificial intelligence for enhanced accuracy</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Specialized Studies */}
            <section className="py-16 bg-gray-50">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-800 mb-4">Specialized Imaging Studies</h2>
                        <p className="text-xl text-gray-600">Expert imaging for specific medical conditions</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <Card className="text-center hover:shadow-lg transition-all duration-300">
                            <CardContent className="p-6">
                                <Scan className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">Neuroimaging</h3>
                                <p className="text-gray-600 text-sm">Brain and spine imaging</p>
                            </CardContent>
                        </Card>
                        <Card className="text-center hover:shadow-lg transition-all duration-300">
                            <CardContent className="p-6">
                                <Activity className="h-12 w-12 text-red-600 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">Cardiac Imaging</h3>
                                <p className="text-gray-600 text-sm">Heart and vascular studies</p>
                            </CardContent>
                        </Card>
                        <Card className="text-center hover:shadow-lg transition-all duration-300">
                            <CardContent className="p-6">
                                <Stethoscope className="h-12 w-12 text-green-600 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">Musculoskeletal</h3>
                                <p className="text-gray-600 text-sm">Bone and joint imaging</p>
                            </CardContent>
                        </Card>
                        <Card className="text-center hover:shadow-lg transition-all duration-300">
                            <CardContent className="p-6">
                                <Eye className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">Oncologic Imaging</h3>
                                <p className="text-gray-600 text-sm">Cancer detection and staging</p>
                            </CardContent>
                        </Card>
                        <Card className="text-center hover:shadow-lg transition-all duration-300">
                            <CardContent className="p-6">
                                <Shield className="h-12 w-12 text-orange-600 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">Abdominal Imaging</h3>
                                <p className="text-gray-600 text-sm">GI tract and organ studies</p>
                            </CardContent>
                        </Card>
                        <Card className="text-center hover:shadow-lg transition-all duration-300">
                            <CardContent className="p-6">
                                <UserCheck className="h-12 w-12 text-teal-600 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">Women's Imaging</h3>
                                <p className="text-gray-600 text-sm">Obstetric and gynecologic</p>
                            </CardContent>
                        </Card>
                        <Card className="text-center hover:shadow-lg transition-all duration-300">
                            <CardContent className="p-6">
                                <Zap className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">Pediatric Imaging</h3>
                                <p className="text-gray-600 text-sm">Child-friendly protocols</p>
                            </CardContent>
                        </Card>
                        <Card className="text-center hover:shadow-lg transition-all duration-300">
                            <CardContent className="p-6">
                                <Clock className="h-12 w-12 text-pink-600 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">Emergency Imaging</h3>
                                <p className="text-gray-600 text-sm">24/7 urgent studies</p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Report Delivery */}
            <section className="py-16 bg-blue-50">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-800 mb-4">Fast & Accurate Reporting</h2>
                        <p className="text-xl text-gray-600">Quick turnaround times with expert interpretation</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <Card className="text-center">
                            <CardContent className="p-8">
                                <Clock className="h-16 w-16 text-blue-600 mx-auto mb-4" />
                                <h3 className="text-2xl font-bold text-gray-800 mb-2">Same Day Reports</h3>
                                <p className="text-gray-600">Most studies reported within hours</p>
                            </CardContent>
                        </Card>
                        <Card className="text-center">
                            <CardContent className="p-8">
                                <UserCheck className="h-16 w-16 text-green-600 mx-auto mb-4" />
                                <h3 className="text-2xl font-bold text-gray-800 mb-2">Expert Radiologists</h3>
                                <p className="text-gray-600">Board-certified specialists</p>
                            </CardContent>
                        </Card>
                        <Card className="text-center">
                            <CardContent className="p-8">
                                <Shield className="h-16 w-16 text-purple-600 mx-auto mb-4" />
                                <h3 className="text-2xl font-bold text-gray-800 mb-2">Digital Delivery</h3>
                                <p className="text-gray-600">Secure online report access</p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section className="py-16 bg-blue-600 text-white">
                <div className="container mx-auto px-6 text-center">
                    <h2 className="text-3xl font-bold mb-6">Contact Radiology Department</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
                        <div>
                            <Phone className="h-12 w-12 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold mb-2">Appointment Booking</h3>
                            <p className="text-2xl font-bold">+91-11-4567-8907</p>
                            <p className="text-blue-200">Mon-Sat: 8:00 AM - 6:00 PM</p>
                        </div>
                        <div>
                            <Scan className="h-12 w-12 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold mb-2">Emergency Imaging</h3>
                            <p className="text-2xl font-bold">+91-11-4567-8901</p>
                            <p className="text-blue-200">Available 24/7</p>
                        </div>
                    </div>
                    <div className="mt-12">
                        <Button
                            size="lg"
                            className="bg-white text-blue-600 hover:bg-gray-100 mr-4"
                            onClick={() => navigate('/register')}
                        >
                            Book Imaging Study
                        </Button>
                        <Button
                            size="lg"
                            variant="outline"
                            className="border-white text-white hover:bg-white/10"
                            onClick={() => navigate('/')}
                        >
                            Back to Home
                        </Button>
                    </div>
                </div>
            </section>

            <LoginPromptModal
                isOpen={showLoginModal}
                onClose={() => setShowLoginModal(false)}
                departmentName="Radiology Department"
            />
        </div>
    );
};

export default RadiologyPage;
