import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { useNavigate } from 'react-router-dom';
import {
    Clock,
    Ambulance,
    Phone,
    Heart,
    Shield,
    UserCheck,
    AlertTriangle,
    Activity
} from 'lucide-react';

const EmergencyPage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50">
            {/* Hero Section */}
            <section className="relative bg-gradient-to-r from-red-600 to-red-800 text-white py-20">
                <div className="absolute inset-0">
                    <img
                        src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=1600&q=80"
                        alt="Emergency Department - Indian Hospital"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-red-600/70" />
                </div>
                <div className="relative container mx-auto px-6">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="flex justify-center mb-6">
                            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                                <Ambulance className="h-8 w-8 text-white" />
                            </div>
                        </div>
                        <h1 className="text-4xl lg:text-6xl font-bold mb-6">Emergency Department</h1>
                        <p className="text-xl lg:text-2xl mb-8 leading-relaxed">
                            24/7 Critical Care & Emergency Medical Services
                        </p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <Button
                                size="lg"
                                className="bg-white text-red-600 hover:bg-gray-100"
                                onClick={() => window.open('tel:102', '_self')}
                            >
                                <Phone className="h-5 w-5 mr-2" />
                                Emergency: 102
                            </Button>
                            <Button
                                size="lg"
                                variant="outline"
                                className="border-white text-white hover:bg-white/10"
                                onClick={() => navigate('/register')}
                            >
                                Register Patient
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Quick Stats */}
            <section className="py-12 bg-white">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <Card className="text-center bg-red-50 border-red-200">
                            <CardContent className="p-6">
                                <Clock className="h-12 w-12 text-red-600 mx-auto mb-4" />
                                <h3 className="text-2xl font-bold text-red-800">24/7</h3>
                                <p className="text-red-600">Always Available</p>
                            </CardContent>
                        </Card>
                        <Card className="text-center bg-orange-50 border-orange-200">
                            <CardContent className="p-6">
                                <Activity className="h-12 w-12 text-orange-600 mx-auto mb-4" />
                                <h3 className="text-2xl font-bold text-orange-800">&lt;5 Min</h3>
                                <p className="text-orange-600">Response Time</p>
                            </CardContent>
                        </Card>
                        <Card className="text-center bg-green-50 border-green-200">
                            <CardContent className="p-6">
                                <Heart className="h-12 w-12 text-green-600 mx-auto mb-4" />
                                <h3 className="text-2xl font-bold text-green-800">98%</h3>
                                <p className="text-green-600">Success Rate</p>
                            </CardContent>
                        </Card>
                        <Card className="text-center bg-blue-50 border-blue-200">
                            <CardContent className="p-6">
                                <UserCheck className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                                <h3 className="text-2xl font-bold text-blue-800">50+</h3>
                                <p className="text-blue-600">Expert Staff</p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Services */}
            <section className="py-16 bg-gray-50">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-800 mb-4">Emergency Services</h2>
                        <p className="text-xl text-gray-600">Comprehensive emergency care with advanced medical facilities</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <Card className="hover:shadow-xl transition-all duration-300">
                            <CardHeader>
                                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                                    <Heart className="h-6 w-6 text-red-600" />
                                </div>
                                <CardTitle className="text-red-800">Trauma Care</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600">
                                    Advanced trauma care with state-of-the-art equipment for critical injuries and accidents.
                                </p>
                                <ul className="mt-4 space-y-2 text-sm text-gray-500">
                                    <li>• Multi-trauma management</li>
                                    <li>• Emergency surgery</li>
                                    <li>• Critical care monitoring</li>
                                </ul>
                            </CardContent>
                        </Card>

                        <Card className="hover:shadow-xl transition-all duration-300">
                            <CardHeader>
                                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                                    <Activity className="h-6 w-6 text-blue-600" />
                                </div>
                                <CardTitle className="text-blue-800">Cardiac Emergency</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600">
                                    Specialized cardiac emergency care with advanced life support systems.
                                </p>
                                <ul className="mt-4 space-y-2 text-sm text-gray-500">
                                    <li>• Heart attack treatment</li>
                                    <li>• ECG monitoring</li>
                                    <li>• Defibrillation services</li>
                                </ul>
                            </CardContent>
                        </Card>

                        <Card className="hover:shadow-xl transition-all duration-300">
                            <CardHeader>
                                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                                    <Shield className="h-6 w-6 text-green-600" />
                                </div>
                                <CardTitle className="text-green-800">Poison Control</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600">
                                    Expert toxicology services for poisoning cases and drug overdoses.
                                </p>
                                <ul className="mt-4 space-y-2 text-sm text-gray-500">
                                    <li>• Antidote administration</li>
                                    <li>• Gastric lavage</li>
                                    <li>• Toxicology consultation</li>
                                </ul>
                            </CardContent>
                        </Card>

                        <Card className="hover:shadow-xl transition-all duration-300">
                            <CardHeader>
                                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                                    <AlertTriangle className="h-6 w-6 text-purple-600" />
                                </div>
                                <CardTitle className="text-purple-800">Emergency Surgery</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600">
                                    24/7 emergency surgical services with experienced surgical teams.
                                </p>
                                <ul className="mt-4 space-y-2 text-sm text-gray-500">
                                    <li>• Emergency appendectomy</li>
                                    <li>• Trauma surgery</li>
                                    <li>• Emergency cesarean</li>
                                </ul>
                            </CardContent>
                        </Card>

                        <Card className="hover:shadow-xl transition-all duration-300">
                            <CardHeader>
                                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                                    <Ambulance className="h-6 w-6 text-orange-600" />
                                </div>
                                <CardTitle className="text-orange-800">Ambulance Services</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600">
                                    Advanced life support ambulances with trained paramedics.
                                </p>
                                <ul className="mt-4 space-y-2 text-sm text-gray-500">
                                    <li>• GPS-enabled fleet</li>
                                    <li>• Mobile ICU facilities</li>
                                    <li>• Trained paramedics</li>
                                </ul>
                            </CardContent>
                        </Card>

                        <Card className="hover:shadow-xl transition-all duration-300">
                            <CardHeader>
                                <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
                                    <UserCheck className="h-6 w-6 text-teal-600" />
                                </div>
                                <CardTitle className="text-teal-800">Pediatric Emergency</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600">
                                    Specialized emergency care for children with pediatric-trained staff.
                                </p>
                                <ul className="mt-4 space-y-2 text-sm text-gray-500">
                                    <li>• Child-friendly environment</li>
                                    <li>• Pediatric specialists</li>
                                    <li>• Family support services</li>
                                </ul>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Contact Emergency */}
            <section className="py-16 bg-red-600 text-white">
                <div className="container mx-auto px-6 text-center">
                    <h2 className="text-3xl font-bold mb-6">Emergency Contact Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                        <div>
                            <Phone className="h-12 w-12 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold mb-2">Emergency Hotline</h3>
                            <p className="text-2xl font-bold">102</p>
                            <p className="text-red-200">Available 24/7</p>
                        </div>
                        <div>
                            <Ambulance className="h-12 w-12 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold mb-2">Ambulance Service</h3>
                            <p className="text-2xl font-bold">108</p>
                            <p className="text-red-200">Free Emergency Service</p>
                        </div>
                        <div>
                            <Heart className="h-12 w-12 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold mb-2">Direct Hospital</h3>
                            <p className="text-2xl font-bold">+91-11-4567-8901</p>
                            <p className="text-red-200">Emergency Department</p>
                        </div>
                    </div>
                    <div className="mt-12">
                        <Button
                            size="lg"
                            className="bg-white text-red-600 hover:bg-gray-100"
                            onClick={() => navigate('/')}
                        >
                            Back to Home
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default EmergencyPage;
