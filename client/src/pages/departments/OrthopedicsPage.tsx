import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { useNavigate } from 'react-router-dom';
import {
    Bone,
    Activity,
    Shield,
    UserCheck,
    Clock,
    Stethoscope,
    Phone,
    Zap,
    X
} from 'lucide-react';

const OrthopedicsPage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-teal-50">
            {/* Hero Section */}
            <section className="relative bg-gradient-to-r from-green-600 to-teal-600 text-white py-20">
                <div className="absolute inset-0">
                    <img
                        src="https://images.unsplash.com/photo-1551601651-2a8555f1a136?auto=format&fit=crop&w=1600&q=80"
                        alt="Orthopedics Department - Indian Hospital"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-green-600/70" />
                </div>
                <div className="relative container mx-auto px-6">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="flex justify-center mb-6">
                            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                                <Bone className="h-8 w-8 text-white" />
                            </div>
                        </div>
                        <h1 className="text-4xl lg:text-6xl font-bold mb-6">Orthopedics Department</h1>
                        <p className="text-xl lg:text-2xl mb-8 leading-relaxed">
                            Advanced Bone & Joint Care Specialists in India
                        </p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <Button
                                size="lg"
                                className="bg-white text-green-600 hover:bg-gray-100"
                                onClick={() => navigate('/register')}
                            >
                                <Bone className="h-5 w-5 mr-2" />
                                Book Consultation
                            </Button>
                            <Button
                                size="lg"
                                variant="outline"
                                className="border-white text-white hover:bg-white/10"
                                onClick={() => window.open('tel:+91-11-4567-8904', '_self')}
                            >
                                <Phone className="h-5 w-5 mr-2" />
                                Orthopedic Emergency
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Department Stats */}
            <section className="py-12 bg-white">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <Card className="text-center bg-green-50 border-green-200">
                            <CardContent className="p-6">
                                <Bone className="h-12 w-12 text-green-600 mx-auto mb-4" />
                                <h3 className="text-2xl font-bold text-green-800">4000+</h3>
                                <p className="text-green-600">Joint Replacements</p>
                            </CardContent>
                        </Card>
                        <Card className="text-center bg-teal-50 border-teal-200">
                            <CardContent className="p-6">
                                <UserCheck className="h-12 w-12 text-teal-600 mx-auto mb-4" />
                                <h3 className="text-2xl font-bold text-teal-800">18+</h3>
                                <p className="text-teal-600">Orthopedic Surgeons</p>
                            </CardContent>
                        </Card>
                        <Card className="text-center bg-blue-50 border-blue-200">
                            <CardContent className="p-6">
                                <Activity className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                                <h3 className="text-2xl font-bold text-blue-800">96%</h3>
                                <p className="text-blue-600">Success Rate</p>
                            </CardContent>
                        </Card>
                        <Card className="text-center bg-purple-50 border-purple-200">
                            <CardContent className="p-6">
                                <Clock className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                                <h3 className="text-2xl font-bold text-purple-800">24/7</h3>
                                <p className="text-purple-600">Trauma Care</p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Services */}
            <section className="py-16 bg-gray-50">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-800 mb-4">Orthopedic Services</h2>
                        <p className="text-xl text-gray-600">Comprehensive bone, joint, and muscle care</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <Card className="hover:shadow-xl transition-all duration-300">
                            <CardHeader>
                                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                                    <Bone className="h-6 w-6 text-green-600" />
                                </div>
                                <CardTitle className="text-green-800">Joint Replacement</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600">
                                    Advanced joint replacement surgeries with latest prosthetic technology.
                                </p>
                                <ul className="mt-4 space-y-2 text-sm text-gray-500">
                                    <li>• Knee Replacement Surgery</li>
                                    <li>• Hip Replacement Surgery</li>
                                    <li>• Shoulder Joint Replacement</li>
                                    <li>• Revision Joint Surgery</li>
                                </ul>
                            </CardContent>
                        </Card>

                        <Card className="hover:shadow-xl transition-all duration-300">
                            <CardHeader>
                                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                                    <Activity className="h-6 w-6 text-blue-600" />
                                </div>
                                <CardTitle className="text-blue-800">Sports Medicine</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600">
                                    Specialized treatment for sports injuries and athletic performance.
                                </p>
                                <ul className="mt-4 space-y-2 text-sm text-gray-500">
                                    <li>• ACL Reconstruction</li>
                                    <li>• Meniscus Repair</li>
                                    <li>• Rotator Cuff Surgery</li>
                                    <li>• Athletic Rehabilitation</li>
                                </ul>
                            </CardContent>
                        </Card>

                        <Card className="hover:shadow-xl transition-all duration-300">
                            <CardHeader>
                                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                                    <Shield className="h-6 w-6 text-purple-600" />
                                </div>
                                <CardTitle className="text-purple-800">Trauma Surgery</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600">
                                    Emergency orthopedic trauma care for fractures and injuries.
                                </p>
                                <ul className="mt-4 space-y-2 text-sm text-gray-500">
                                    <li>• Fracture Fixation</li>
                                    <li>• Polytrauma Management</li>
                                    <li>• Complex Trauma Surgery</li>
                                    <li>• Emergency Stabilization</li>
                                </ul>
                            </CardContent>
                        </Card>

                        <Card className="hover:shadow-xl transition-all duration-300">
                            <CardHeader>
                                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                                    <Stethoscope className="h-6 w-6 text-orange-600" />
                                </div>
                                <CardTitle className="text-orange-800">Spine Surgery</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600">
                                    Advanced spinal procedures for back and neck conditions.
                                </p>
                                <ul className="mt-4 space-y-2 text-sm text-gray-500">
                                    <li>• Disc Replacement Surgery</li>
                                    <li>• Spinal Fusion</li>
                                    <li>• Minimally Invasive Spine</li>
                                    <li>• Scoliosis Correction</li>
                                </ul>
                            </CardContent>
                        </Card>

                        <Card className="hover:shadow-xl transition-all duration-300">
                            <CardHeader>
                                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                                    <X className="h-6 w-6 text-red-600" />
                                </div>
                                <CardTitle className="text-red-800">Arthroscopy</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600">
                                    Minimally invasive joint surgeries using arthroscopic techniques.
                                </p>
                                <ul className="mt-4 space-y-2 text-sm text-gray-500">
                                    <li>• Knee Arthroscopy</li>
                                    <li>• Shoulder Arthroscopy</li>
                                    <li>• Hip Arthroscopy</li>
                                    <li>• Ankle Arthroscopy</li>
                                </ul>
                            </CardContent>
                        </Card>

                        <Card className="hover:shadow-xl transition-all duration-300">
                            <CardHeader>
                                <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
                                    <UserCheck className="h-6 w-6 text-teal-600" />
                                </div>
                                <CardTitle className="text-teal-800">Pediatric Orthopedics</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600">
                                    Specialized orthopedic care for children and adolescents.
                                </p>
                                <ul className="mt-4 space-y-2 text-sm text-gray-500">
                                    <li>• Clubfoot Treatment</li>
                                    <li>• Limb Deformity Correction</li>
                                    <li>• Growth Plate Injuries</li>
                                    <li>• Pediatric Fracture Care</li>
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
                        <h2 className="text-3xl font-bold text-gray-800 mb-4">Advanced Orthopedic Technology</h2>
                        <p className="text-xl text-gray-600">State-of-the-art equipment for precise treatment</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <img
                                src="https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80"
                                alt="Advanced Orthopedic Operating Room"
                                className="w-full h-80 object-cover rounded-lg shadow-lg"
                            />
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold text-gray-800 mb-6">Cutting-Edge Orthopedic Facilities</h3>
                            <div className="space-y-4">
                                <div className="flex items-start space-x-3">
                                    <Bone className="h-6 w-6 text-green-600 mt-1" />
                                    <div>
                                        <h4 className="font-semibold text-gray-800">Robotic Surgery Systems</h4>
                                        <p className="text-gray-600">Precision-guided robotic assistance for joint surgeries</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <Activity className="h-6 w-6 text-blue-600 mt-1" />
                                    <div>
                                        <h4 className="font-semibold text-gray-800">3D Imaging Technology</h4>
                                        <p className="text-gray-600">Advanced imaging for surgical planning and navigation</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <Shield className="h-6 w-6 text-purple-600 mt-1" />
                                    <div>
                                        <h4 className="font-semibold text-gray-800">Modular Operation Theaters</h4>
                                        <p className="text-gray-600">Specialized OTs with laminar air flow systems</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <Zap className="h-6 w-6 text-orange-600 mt-1" />
                                    <div>
                                        <h4 className="font-semibold text-gray-800">Physiotherapy Center</h4>
                                        <p className="text-gray-600">Comprehensive rehabilitation with modern equipment</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Rehabilitation Services */}
            <section className="py-16 bg-gray-50">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-800 mb-4">Rehabilitation Services</h2>
                        <p className="text-xl text-gray-600">Complete recovery programs for optimal outcomes</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <Card className="text-center hover:shadow-lg transition-all duration-300">
                            <CardContent className="p-6">
                                <Activity className="h-12 w-12 text-green-600 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">Physiotherapy</h3>
                                <p className="text-gray-600 text-sm">Specialized physical therapy programs</p>
                            </CardContent>
                        </Card>
                        <Card className="text-center hover:shadow-lg transition-all duration-300">
                            <CardContent className="p-6">
                                <Stethoscope className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">Occupational Therapy</h3>
                                <p className="text-gray-600 text-sm">Daily living skills rehabilitation</p>
                            </CardContent>
                        </Card>
                        <Card className="text-center hover:shadow-lg transition-all duration-300">
                            <CardContent className="p-6">
                                <Shield className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">Sports Rehab</h3>
                                <p className="text-gray-600 text-sm">Athletic performance recovery</p>
                            </CardContent>
                        </Card>
                        <Card className="text-center hover:shadow-lg transition-all duration-300">
                            <CardContent className="p-6">
                                <UserCheck className="h-12 w-12 text-teal-600 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">Pain Management</h3>
                                <p className="text-gray-600 text-sm">Comprehensive pain relief programs</p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section className="py-16 bg-green-600 text-white">
                <div className="container mx-auto px-6 text-center">
                    <h2 className="text-3xl font-bold mb-6">Contact Orthopedics Department</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
                        <div>
                            <Phone className="h-12 w-12 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold mb-2">Appointment Booking</h3>
                            <p className="text-2xl font-bold">+91-11-4567-8904</p>
                            <p className="text-green-200">Mon-Sat: 8:00 AM - 6:00 PM</p>
                        </div>
                        <div>
                            <Bone className="h-12 w-12 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold mb-2">Orthopedic Emergency</h3>
                            <p className="text-2xl font-bold">+91-11-4567-8901</p>
                            <p className="text-green-200">Available 24/7</p>
                        </div>
                    </div>
                    <div className="mt-12">
                        <Button
                            size="lg"
                            className="bg-white text-green-600 hover:bg-gray-100 mr-4"
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

export default OrthopedicsPage;
