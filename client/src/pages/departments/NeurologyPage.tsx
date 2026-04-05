import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { useNavigate } from 'react-router-dom';
import {
    Brain,
    Activity,
    Shield,
    UserCheck,
    Clock,
    Stethoscope,
    Phone,
    Zap,
    Eye
} from 'lucide-react';

const NeurologyPage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
            {/* Hero Section */}
            <section className="relative bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
                <div className="absolute inset-0">
                    <img
                        src="https://images.unsplash.com/photo-1559757148-5c350d0d3c56?auto=format&fit=crop&w=1600&q=80"
                        alt="Neurology Department - Indian Hospital"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-blue-600/70" />
                </div>
                <div className="relative container mx-auto px-6">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="flex justify-center mb-6">
                            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                                <Brain className="h-8 w-8 text-white" />
                            </div>
                        </div>
                        <h1 className="text-4xl lg:text-6xl font-bold mb-6">Neurology Department</h1>
                        <p className="text-xl lg:text-2xl mb-8 leading-relaxed">
                            Advanced Neurological Care & Brain Health Specialists in India
                        </p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <Button
                                size="lg"
                                className="bg-white text-blue-600 hover:bg-gray-100"
                                onClick={() => navigate('/register')}
                            >
                                <Brain className="h-5 w-5 mr-2" />
                                Book Consultation
                            </Button>
                            <Button
                                size="lg"
                                variant="outline"
                                className="border-white text-white hover:bg-white/10"
                                onClick={() => window.open('tel:+91-11-4567-8903', '_self')}
                            >
                                <Phone className="h-5 w-5 mr-2" />
                                Neuro Emergency
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Department Stats */}
            <section className="py-12 bg-white">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <Card className="text-center bg-blue-50 border-blue-200">
                            <CardContent className="p-6">
                                <Brain className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                                <h3 className="text-2xl font-bold text-blue-800">3000+</h3>
                                <p className="text-blue-600">Neuro Surgeries</p>
                            </CardContent>
                        </Card>
                        <Card className="text-center bg-purple-50 border-purple-200">
                            <CardContent className="p-6">
                                <UserCheck className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                                <h3 className="text-2xl font-bold text-purple-800">20+</h3>
                                <p className="text-purple-600">Neurologists</p>
                            </CardContent>
                        </Card>
                        <Card className="text-center bg-green-50 border-green-200">
                            <CardContent className="p-6">
                                <Activity className="h-12 w-12 text-green-600 mx-auto mb-4" />
                                <h3 className="text-2xl font-bold text-green-800">97%</h3>
                                <p className="text-green-600">Success Rate</p>
                            </CardContent>
                        </Card>
                        <Card className="text-center bg-indigo-50 border-indigo-200">
                            <CardContent className="p-6">
                                <Clock className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
                                <h3 className="text-2xl font-bold text-indigo-800">24/7</h3>
                                <p className="text-indigo-600">Neuro ICU</p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Services */}
            <section className="py-16 bg-gray-50">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-800 mb-4">Neurological Services</h2>
                        <p className="text-xl text-gray-600">Comprehensive brain and nervous system care</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <Card className="hover:shadow-xl transition-all duration-300">
                            <CardHeader>
                                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                                    <Brain className="h-6 w-6 text-blue-600" />
                                </div>
                                <CardTitle className="text-blue-800">Neurosurgery</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600">
                                    Advanced brain and spine surgery with minimally invasive techniques.
                                </p>
                                <ul className="mt-4 space-y-2 text-sm text-gray-500">
                                    <li>• Brain Tumor Surgery</li>
                                    <li>• Spine Surgery</li>
                                    <li>• Aneurysm Repair</li>
                                    <li>• Epilepsy Surgery</li>
                                </ul>
                            </CardContent>
                        </Card>

                        <Card className="hover:shadow-xl transition-all duration-300">
                            <CardHeader>
                                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                                    <Activity className="h-6 w-6 text-purple-600" />
                                </div>
                                <CardTitle className="text-purple-800">Stroke Care</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600">
                                    Comprehensive stroke treatment and rehabilitation services.
                                </p>
                                <ul className="mt-4 space-y-2 text-sm text-gray-500">
                                    <li>• Emergency Stroke Treatment</li>
                                    <li>• Clot Removal Procedures</li>
                                    <li>• Stroke Rehabilitation</li>
                                    <li>• Prevention Programs</li>
                                </ul>
                            </CardContent>
                        </Card>

                        <Card className="hover:shadow-xl transition-all duration-300">
                            <CardHeader>
                                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                                    <Stethoscope className="h-6 w-6 text-green-600" />
                                </div>
                                <CardTitle className="text-green-800">Movement Disorders</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600">
                                    Treatment for Parkinson's disease and other movement disorders.
                                </p>
                                <ul className="mt-4 space-y-2 text-sm text-gray-500">
                                    <li>• Parkinson's Treatment</li>
                                    <li>• Deep Brain Stimulation</li>
                                    <li>• Tremor Management</li>
                                    <li>• Physical Therapy</li>
                                </ul>
                            </CardContent>
                        </Card>

                        <Card className="hover:shadow-xl transition-all duration-300">
                            <CardHeader>
                                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                                    <Zap className="h-6 w-6 text-orange-600" />
                                </div>
                                <CardTitle className="text-orange-800">Epilepsy Center</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600">
                                    Comprehensive epilepsy evaluation and treatment programs.
                                </p>
                                <ul className="mt-4 space-y-2 text-sm text-gray-500">
                                    <li>• EEG Monitoring</li>
                                    <li>• Seizure Management</li>
                                    <li>• Medication Optimization</li>
                                    <li>• Surgical Options</li>
                                </ul>
                            </CardContent>
                        </Card>

                        <Card className="hover:shadow-xl transition-all duration-300">
                            <CardHeader>
                                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                                    <Shield className="h-6 w-6 text-red-600" />
                                </div>
                                <CardTitle className="text-red-800">Spine Center</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600">
                                    Advanced spine care for complex spinal conditions.
                                </p>
                                <ul className="mt-4 space-y-2 text-sm text-gray-500">
                                    <li>• Spinal Cord Injury</li>
                                    <li>• Disc Surgery</li>
                                    <li>• Spinal Fusion</li>
                                    <li>• Minimally Invasive Procedures</li>
                                </ul>
                            </CardContent>
                        </Card>

                        <Card className="hover:shadow-xl transition-all duration-300">
                            <CardHeader>
                                <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
                                    <Eye className="h-6 w-6 text-teal-600" />
                                </div>
                                <CardTitle className="text-teal-800">Neuro-Ophthalmology</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600">
                                    Treatment for vision problems related to neurological conditions.
                                </p>
                                <ul className="mt-4 space-y-2 text-sm text-gray-500">
                                    <li>• Visual Field Testing</li>
                                    <li>• Optic Nerve Disorders</li>
                                    <li>• Double Vision Treatment</li>
                                    <li>• Eye Movement Disorders</li>
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
                        <h2 className="text-3xl font-bold text-gray-800 mb-4">Advanced Neuro Technology</h2>
                        <p className="text-xl text-gray-600">State-of-the-art equipment for precise diagnosis and treatment</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <img
                                src="https://images.unsplash.com/photo-1559757175-0eb30cd8c063?auto=format&fit=crop&w=800&q=80"
                                alt="Advanced MRI Scanner"
                                className="w-full h-80 object-cover rounded-lg shadow-lg"
                            />
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold text-gray-800 mb-6">Cutting-Edge Neurology Infrastructure</h3>
                            <div className="space-y-4">
                                <div className="flex items-start space-x-3">
                                    <Brain className="h-6 w-6 text-blue-600 mt-1" />
                                    <div>
                                        <h4 className="font-semibold text-gray-800">3T MRI Scanner</h4>
                                        <p className="text-gray-600">High-resolution brain imaging for precise diagnosis</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <Activity className="h-6 w-6 text-purple-600 mt-1" />
                                    <div>
                                        <h4 className="font-semibold text-gray-800">Digital EEG Lab</h4>
                                        <p className="text-gray-600">Advanced brain wave monitoring and analysis</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <Shield className="h-6 w-6 text-green-600 mt-1" />
                                    <div>
                                        <h4 className="font-semibold text-gray-800">Neuro Navigation System</h4>
                                        <p className="text-gray-600">GPS-guided brain surgery for maximum precision</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <Zap className="h-6 w-6 text-orange-600 mt-1" />
                                    <div>
                                        <h4 className="font-semibold text-gray-800">Gamma Knife Radiosurgery</h4>
                                        <p className="text-gray-600">Non-invasive brain tumor treatment</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section className="py-16 bg-blue-600 text-white">
                <div className="container mx-auto px-6 text-center">
                    <h2 className="text-3xl font-bold mb-6">Contact Neurology Department</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
                        <div>
                            <Phone className="h-12 w-12 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold mb-2">Appointment Booking</h3>
                            <p className="text-2xl font-bold">+91-11-4567-8903</p>
                            <p className="text-blue-200">Mon-Sat: 8:00 AM - 6:00 PM</p>
                        </div>
                        <div>
                            <Brain className="h-12 w-12 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold mb-2">Neuro Emergency</h3>
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
        </div>
    );
};

export default NeurologyPage;
