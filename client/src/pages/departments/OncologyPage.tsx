import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { useNavigate } from 'react-router-dom';
import {
    Shield,
    Activity,
    Heart,
    UserCheck,
    Clock,
    Stethoscope,
    Phone,
    Zap,
    Target
} from 'lucide-react';

const OncologyPage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50">
            {/* Hero Section */}
            <section className="relative bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-20">
                <div className="absolute inset-0">
                    <img
                        src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?auto=format&fit=crop&w=1600&q=80"
                        alt="Oncology Department - Indian Hospital"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-purple-600/70" />
                </div>
                <div className="relative container mx-auto px-6">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="flex justify-center mb-6">
                            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                                <Shield className="h-8 w-8 text-white" />
                            </div>
                        </div>
                        <h1 className="text-4xl lg:text-6xl font-bold mb-6">Oncology Department</h1>
                        <p className="text-xl lg:text-2xl mb-8 leading-relaxed">
                            Comprehensive Cancer Care & Treatment Center in India
                        </p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <Button
                                size="lg"
                                className="bg-white text-purple-600 hover:bg-gray-100"
                                onClick={() => navigate('/register')}
                            >
                                <Shield className="h-5 w-5 mr-2" />
                                Book Consultation
                            </Button>
                            <Button
                                size="lg"
                                variant="outline"
                                className="border-white text-white hover:bg-white/10"
                                onClick={() => window.open('tel:+91-11-4567-8906', '_self')}
                            >
                                <Phone className="h-5 w-5 mr-2" />
                                Cancer Helpline
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Department Stats */}
            <section className="py-12 bg-white">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <Card className="text-center bg-purple-50 border-purple-200">
                            <CardContent className="p-6">
                                <Shield className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                                <h3 className="text-2xl font-bold text-purple-800">2000+</h3>
                                <p className="text-purple-600">Cancer Patients Treated</p>
                            </CardContent>
                        </Card>
                        <Card className="text-center bg-indigo-50 border-indigo-200">
                            <CardContent className="p-6">
                                <UserCheck className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
                                <h3 className="text-2xl font-bold text-indigo-800">12+</h3>
                                <p className="text-indigo-600">Oncology Specialists</p>
                            </CardContent>
                        </Card>
                        <Card className="text-center bg-green-50 border-green-200">
                            <CardContent className="p-6">
                                <Heart className="h-12 w-12 text-green-600 mx-auto mb-4" />
                                <h3 className="text-2xl font-bold text-green-800">85%</h3>
                                <p className="text-green-600">5-Year Survival Rate</p>
                            </CardContent>
                        </Card>
                        <Card className="text-center bg-blue-50 border-blue-200">
                            <CardContent className="p-6">
                                <Clock className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                                <h3 className="text-2xl font-bold text-blue-800">24/7</h3>
                                <p className="text-blue-600">Cancer Care Support</p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Treatment Modalities */}
            <section className="py-16 bg-gray-50">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-800 mb-4">Cancer Treatment Modalities</h2>
                        <p className="text-xl text-gray-600">Advanced cancer treatment options with personalized care</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <Card className="hover:shadow-xl transition-all duration-300">
                            <CardHeader>
                                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                                    <Target className="h-6 w-6 text-purple-600" />
                                </div>
                                <CardTitle className="text-purple-800">Radiation Therapy</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600">
                                    Advanced radiation therapy with precise targeting technology.
                                </p>
                                <ul className="mt-4 space-y-2 text-sm text-gray-500">
                                    <li>• Linear Accelerator (LINAC)</li>
                                    <li>• Intensity Modulated RT (IMRT)</li>
                                    <li>• Stereotactic Radiosurgery</li>
                                    <li>• Brachytherapy</li>
                                </ul>
                            </CardContent>
                        </Card>

                        <Card className="hover:shadow-xl transition-all duration-300">
                            <CardHeader>
                                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                                    <Activity className="h-6 w-6 text-blue-600" />
                                </div>
                                <CardTitle className="text-blue-800">Medical Oncology</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600">
                                    Comprehensive chemotherapy and targeted therapy treatments.
                                </p>
                                <ul className="mt-4 space-y-2 text-sm text-gray-500">
                                    <li>• Chemotherapy Protocols</li>
                                    <li>• Targeted Therapy</li>
                                    <li>• Immunotherapy</li>
                                    <li>• Hormone Therapy</li>
                                </ul>
                            </CardContent>
                        </Card>

                        <Card className="hover:shadow-xl transition-all duration-300">
                            <CardHeader>
                                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                                    <Stethoscope className="h-6 w-6 text-green-600" />
                                </div>
                                <CardTitle className="text-green-800">Surgical Oncology</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600">
                                    Advanced surgical procedures for cancer treatment.
                                </p>
                                <ul className="mt-4 space-y-2 text-sm text-gray-500">
                                    <li>• Minimally Invasive Surgery</li>
                                    <li>• Robotic Surgery</li>
                                    <li>• Organ Preservation</li>
                                    <li>• Reconstructive Surgery</li>
                                </ul>
                            </CardContent>
                        </Card>

                        <Card className="hover:shadow-xl transition-all duration-300">
                            <CardHeader>
                                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                                    <Zap className="h-6 w-6 text-orange-600" />
                                </div>
                                <CardTitle className="text-orange-800">Bone Marrow Transplant</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600">
                                    Advanced stem cell and bone marrow transplantation.
                                </p>
                                <ul className="mt-4 space-y-2 text-sm text-gray-500">
                                    <li>• Autologous Transplant</li>
                                    <li>• Allogeneic Transplant</li>
                                    <li>• Haploidentical Transplant</li>
                                    <li>• CAR-T Cell Therapy</li>
                                </ul>
                            </CardContent>
                        </Card>

                        <Card className="hover:shadow-xl transition-all duration-300">
                            <CardHeader>
                                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                                    <Heart className="h-6 w-6 text-red-600" />
                                </div>
                                <CardTitle className="text-red-800">Palliative Care</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600">
                                    Comprehensive supportive care for comfort and quality of life.
                                </p>
                                <ul className="mt-4 space-y-2 text-sm text-gray-500">
                                    <li>• Pain Management</li>
                                    <li>• Symptom Control</li>
                                    <li>• Psychological Support</li>
                                    <li>• Family Counseling</li>
                                </ul>
                            </CardContent>
                        </Card>

                        <Card className="hover:shadow-xl transition-all duration-300">
                            <CardHeader>
                                <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
                                    <Shield className="h-6 w-6 text-teal-600" />
                                </div>
                                <CardTitle className="text-teal-800">Precision Medicine</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600">
                                    Personalized treatment based on genetic profiling.
                                </p>
                                <ul className="mt-4 space-y-2 text-sm text-gray-500">
                                    <li>• Genetic Testing</li>
                                    <li>• Molecular Profiling</li>
                                    <li>• Personalized Therapy</li>
                                    <li>• Clinical Trials</li>
                                </ul>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Cancer Specialties */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-800 mb-4">Cancer Specialties</h2>
                        <p className="text-xl text-gray-600">Expert care for all types of cancer</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <Card className="text-center hover:shadow-lg transition-all duration-300">
                            <CardContent className="p-6">
                                <Shield className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">Breast Cancer</h3>
                                <p className="text-gray-600 text-sm">Comprehensive breast cancer care</p>
                            </CardContent>
                        </Card>
                        <Card className="text-center hover:shadow-lg transition-all duration-300">
                            <CardContent className="p-6">
                                <Activity className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">Lung Cancer</h3>
                                <p className="text-gray-600 text-sm">Advanced lung cancer treatment</p>
                            </CardContent>
                        </Card>
                        <Card className="text-center hover:shadow-lg transition-all duration-300">
                            <CardContent className="p-6">
                                <Heart className="h-12 w-12 text-red-600 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">Blood Cancer</h3>
                                <p className="text-gray-600 text-sm">Hematological malignancies</p>
                            </CardContent>
                        </Card>
                        <Card className="text-center hover:shadow-lg transition-all duration-300">
                            <CardContent className="p-6">
                                <Stethoscope className="h-12 w-12 text-green-600 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">GI Cancer</h3>
                                <p className="text-gray-600 text-sm">Gastrointestinal cancer care</p>
                            </CardContent>
                        </Card>
                        <Card className="text-center hover:shadow-lg transition-all duration-300">
                            <CardContent className="p-6">
                                <Target className="h-12 w-12 text-orange-600 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">Head & Neck</h3>
                                <p className="text-gray-600 text-sm">Head and neck cancer treatment</p>
                            </CardContent>
                        </Card>
                        <Card className="text-center hover:shadow-lg transition-all duration-300">
                            <CardContent className="p-6">
                                <Zap className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">Brain Tumors</h3>
                                <p className="text-gray-600 text-sm">Neuro-oncology services</p>
                            </CardContent>
                        </Card>
                        <Card className="text-center hover:shadow-lg transition-all duration-300">
                            <CardContent className="p-6">
                                <UserCheck className="h-12 w-12 text-teal-600 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">Gynecologic</h3>
                                <p className="text-gray-600 text-sm">Women's cancer care</p>
                            </CardContent>
                        </Card>
                        <Card className="text-center hover:shadow-lg transition-all duration-300">
                            <CardContent className="p-6">
                                <Clock className="h-12 w-12 text-pink-600 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">Pediatric Cancer</h3>
                                <p className="text-gray-600 text-sm">Childhood cancer treatment</p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Support Services */}
            <section className="py-16 bg-gradient-to-r from-purple-50 to-indigo-50">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-800 mb-4">Comprehensive Support Services</h2>
                        <p className="text-xl text-gray-600">Holistic care beyond medical treatment</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <img
                                src="https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&w=800&q=80"
                                alt="Cancer Support Services"
                                className="w-full h-80 object-cover rounded-lg shadow-lg"
                            />
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold text-gray-800 mb-6">Complete Cancer Care Ecosystem</h3>
                            <div className="space-y-4">
                                <div className="flex items-start space-x-3">
                                    <Heart className="h-6 w-6 text-purple-600 mt-1" />
                                    <div>
                                        <h4 className="font-semibold text-gray-800">Psycho-Oncology</h4>
                                        <p className="text-gray-600">Mental health support and counseling</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <UserCheck className="h-6 w-6 text-blue-600 mt-1" />
                                    <div>
                                        <h4 className="font-semibold text-gray-800">Nutrition Support</h4>
                                        <p className="text-gray-600">Specialized diet planning and nutrition counseling</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <Shield className="h-6 w-6 text-green-600 mt-1" />
                                    <div>
                                        <h4 className="font-semibold text-gray-800">Social Work Services</h4>
                                        <p className="text-gray-600">Financial assistance and social support</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <Activity className="h-6 w-6 text-orange-600 mt-1" />
                                    <div>
                                        <h4 className="font-semibold text-gray-800">Rehabilitation Services</h4>
                                        <p className="text-gray-600">Physical therapy and occupational therapy</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section className="py-16 bg-purple-600 text-white">
                <div className="container mx-auto px-6 text-center">
                    <h2 className="text-3xl font-bold mb-6">Contact Oncology Department</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
                        <div>
                            <Phone className="h-12 w-12 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold mb-2">Appointment Booking</h3>
                            <p className="text-2xl font-bold">+91-11-4567-8906</p>
                            <p className="text-purple-200">Mon-Sat: 8:00 AM - 6:00 PM</p>
                        </div>
                        <div>
                            <Shield className="h-12 w-12 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold mb-2">Cancer Helpline</h3>
                            <p className="text-2xl font-bold">1800-XXX-XXXX</p>
                            <p className="text-purple-200">Available 24/7</p>
                        </div>
                    </div>
                    <div className="mt-12">
                        <Button
                            size="lg"
                            className="bg-white text-purple-600 hover:bg-gray-100 mr-4"
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

export default OncologyPage;
