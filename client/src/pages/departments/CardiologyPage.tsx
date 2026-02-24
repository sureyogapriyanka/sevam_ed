import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { useNavigate } from 'react-router-dom';
import LoginPromptModal from '../../components/common/LoginPromptModal';
import {
    Heart,
    Activity,
    Shield,
    UserCheck,
    Clock,
    Stethoscope,
    Phone,
    Zap
} from 'lucide-react';

const CardiologyPage: React.FC = () => {
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
                        src="https://images.unsplash.com/photo-1519494080410-f9aa76cb4283?auto=format&fit=crop&w=1600&q=80"
                        alt="Cardiology Department - Indian Hospital"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-slate-600/70" />
                </div>
                <div className="relative container mx-auto px-6">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="flex justify-center mb-6">
                            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                                <Heart className="h-8 w-8 text-white" />
                            </div>
                        </div>
                        <h1 className="text-4xl lg:text-6xl font-bold mb-6">Cardiology Department</h1>
                        <p className="text-xl lg:text-2xl mb-8 leading-relaxed">
                            Advanced Heart Care & Cardiac Specialists in India
                        </p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <Button
                                size="lg"
                                className="bg-white text-slate-600 hover:bg-gray-100"
                                onClick={handleBookAppointment}
                            >
                                <Heart className="h-5 w-5 mr-2" />
                                Book Consultation
                            </Button>
                            <Button
                                size="lg"
                                variant="outline"
                                className="border-white text-white hover:bg-white/10"
                                onClick={() => window.open('tel:+91-11-4567-8902', '_self')}
                            >
                                <Phone className="h-5 w-5 mr-2" />
                                Emergency Cardiac Care
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
                                <Heart className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                                <h3 className="text-2xl font-bold text-gray-800">5000+</h3>
                                <p className="text-gray-600">Successful Surgeries</p>
                            </CardContent>
                        </Card>
                        <Card className="text-center bg-gray-50 border-gray-200">
                            <CardContent className="p-6">
                                <UserCheck className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                                <h3 className="text-2xl font-bold text-gray-800">25+</h3>
                                <p className="text-gray-600">Cardiac Specialists</p>
                            </CardContent>
                        </Card>
                        <Card className="text-center bg-gray-50 border-gray-200">
                            <CardContent className="p-6">
                                <Activity className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                                <h3 className="text-2xl font-bold text-gray-800">98.5%</h3>
                                <p className="text-green-600">Success Rate</p>
                            </CardContent>
                        </Card>
                        <Card className="text-center bg-gray-50 border-gray-200">
                            <CardContent className="p-6">
                                <Clock className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                                <h3 className="text-2xl font-bold text-gray-800">24/7</h3>
                                <p className="text-gray-600">Cardiac ICU</p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Services */}
            <section className="py-16 bg-gray-50">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-800 mb-4">Cardiac Services</h2>
                        <p className="text-xl text-gray-600">Comprehensive heart care with advanced technology</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <Card className="hover:shadow-xl transition-all duration-300">
                            <CardHeader>
                                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                                    <Heart className="h-6 w-6 text-red-600" />
                                </div>
                                <CardTitle className="text-red-800">Cardiac Surgery</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600">
                                    Advanced cardiac surgeries including bypass, valve repair, and heart transplants.
                                </p>
                                <ul className="mt-4 space-y-2 text-sm text-gray-500">
                                    <li>• Coronary Artery Bypass (CABG)</li>
                                    <li>• Heart Valve Surgery</li>
                                    <li>• Heart Transplantation</li>
                                    <li>• Minimally Invasive Surgery</li>
                                </ul>
                            </CardContent>
                        </Card>

                        <Card className="hover:shadow-xl transition-all duration-300">
                            <CardHeader>
                                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                                    <Activity className="h-6 w-6 text-blue-600" />
                                </div>
                                <CardTitle className="text-blue-800">Interventional Cardiology</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600">
                                    Non-surgical cardiac procedures using advanced catheter techniques.
                                </p>
                                <ul className="mt-4 space-y-2 text-sm text-gray-500">
                                    <li>• Angioplasty & Stenting</li>
                                    <li>• Cardiac Catheterization</li>
                                    <li>• Balloon Valvuloplasty</li>
                                    <li>• Transcatheter Procedures</li>
                                </ul>
                            </CardContent>
                        </Card>

                        <Card className="hover:shadow-xl transition-all duration-300">
                            <CardHeader>
                                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                                    <Stethoscope className="h-6 w-6 text-green-600" />
                                </div>
                                <CardTitle className="text-green-800">Preventive Cardiology</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600">
                                    Comprehensive cardiac health assessment and prevention programs.
                                </p>
                                <ul className="mt-4 space-y-2 text-sm text-gray-500">
                                    <li>• Cardiac Risk Assessment</li>
                                    <li>• Lifestyle Counseling</li>
                                    <li>• Heart Health Check-ups</li>
                                    <li>• Cardiac Rehabilitation</li>
                                </ul>
                            </CardContent>
                        </Card>

                        <Card className="hover:shadow-xl transition-all duration-300">
                            <CardHeader>
                                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                                    <Zap className="h-6 w-6 text-purple-600" />
                                </div>
                                <CardTitle className="text-purple-800">Electrophysiology</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600">
                                    Advanced treatment for heart rhythm disorders and arrhythmias.
                                </p>
                                <ul className="mt-4 space-y-2 text-sm text-gray-500">
                                    <li>• Pacemaker Implantation</li>
                                    <li>• ICD/CRT Devices</li>
                                    <li>• Cardiac Ablation</li>
                                    <li>• Arrhythmia Management</li>
                                </ul>
                            </CardContent>
                        </Card>

                        <Card className="hover:shadow-xl transition-all duration-300">
                            <CardHeader>
                                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                                    <Shield className="h-6 w-6 text-orange-600" />
                                </div>
                                <CardTitle className="text-orange-800">Pediatric Cardiology</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600">
                                    Specialized cardiac care for children with congenital heart conditions.
                                </p>
                                <ul className="mt-4 space-y-2 text-sm text-gray-500">
                                    <li>• Congenital Heart Surgery</li>
                                    <li>• Pediatric Interventions</li>
                                    <li>• Heart Defect Repair</li>
                                    <li>• Newborn Cardiac Care</li>
                                </ul>
                            </CardContent>
                        </Card>

                        <Card className="hover:shadow-xl transition-all duration-300">
                            <CardHeader>
                                <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
                                    <UserCheck className="h-6 w-6 text-teal-600" />
                                </div>
                                <CardTitle className="text-teal-800">Cardiac Imaging</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600">
                                    State-of-the-art cardiac imaging and diagnostic services.
                                </p>
                                <ul className="mt-4 space-y-2 text-sm text-gray-500">
                                    <li>• Echocardiography</li>
                                    <li>• Cardiac MRI</li>
                                    <li>• CT Angiography</li>
                                    <li>• Nuclear Cardiology</li>
                                </ul>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Facilities */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-800 mb-4">World-Class Facilities</h2>
                        <p className="text-xl text-gray-600">Advanced cardiac care infrastructure in India</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <img
                                src="https://images.unsplash.com/photo-1519494080410-f9aa76cb4283?auto=format&fit=crop&w=800&q=80"
                                alt="Cardiac Catheterization Lab"
                                className="w-full h-80 object-cover rounded-lg shadow-lg"
                            />
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold text-gray-800 mb-6">Advanced Cardiac Infrastructure</h3>
                            <div className="space-y-4">
                                <div className="flex items-start space-x-3">
                                    <Heart className="h-6 w-6 text-red-600 mt-1" />
                                    <div>
                                        <h4 className="font-semibold text-gray-800">Cardiac Catheterization Labs</h4>
                                        <p className="text-gray-600">State-of-the-art cath labs with latest imaging technology</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <Activity className="h-6 w-6 text-blue-600 mt-1" />
                                    <div>
                                        <h4 className="font-semibold text-gray-800">Cardiac ICU</h4>
                                        <p className="text-gray-600">24/7 intensive care with advanced monitoring systems</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <Shield className="h-6 w-6 text-green-600 mt-1" />
                                    <div>
                                        <h4 className="font-semibold text-gray-800">Operation Theaters</h4>
                                        <p className="text-gray-600">Dedicated cardiac OTs with hybrid capabilities</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <Stethoscope className="h-6 w-6 text-purple-600 mt-1" />
                                    <div>
                                        <h4 className="font-semibold text-gray-800">Rehabilitation Center</h4>
                                        <p className="text-gray-600">Comprehensive cardiac rehabilitation programs</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section className="py-16 bg-red-600 text-white">
                <div className="container mx-auto px-6 text-center">
                    <h2 className="text-3xl font-bold mb-6">Contact Cardiology Department</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
                        <div>
                            <Phone className="h-12 w-12 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold mb-2">Appointment Booking</h3>
                            <p className="text-2xl font-bold">+91-11-4567-8902</p>
                            <p className="text-red-200">Mon-Sat: 8:00 AM - 6:00 PM</p>
                        </div>
                        <div>
                            <Heart className="h-12 w-12 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold mb-2">Emergency Cardiac Care</h3>
                            <p className="text-2xl font-bold">+91-11-4567-8901</p>
                            <p className="text-red-200">Available 24/7</p>
                        </div>
                    </div>
                    <div className="mt-12">
                        <Button
                            size="lg"
                            className="bg-white text-red-600 hover:bg-gray-100 mr-4"
                            onClick={() => navigate('/register')}
                        >
                            Book Appointment
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
                departmentName="Cardiology Department"
            />
        </div>
    );
};

export default CardiologyPage;
