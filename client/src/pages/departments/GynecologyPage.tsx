import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { useNavigate } from 'react-router-dom';
import {
    Heart,
    Activity,
    Shield,
    UserCheck,
    Clock,
    Stethoscope,
    Phone,
    Baby,
    Flower
} from 'lucide-react';

const GynecologyPage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
            {/* Hero Section */}
            <section className="relative bg-gradient-to-r from-pink-600 to-purple-600 text-white py-20">
                <div className="absolute inset-0">
                    <img
                        src="https://images.unsplash.com/photo-1576602375682-5cc0f2fc754a?auto=format&fit=crop&w=1600&q=80"
                        alt="Gynecology Department - Indian Hospital"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-pink-600/70" />
                </div>
                <div className="relative container mx-auto px-6">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="flex justify-center mb-6">
                            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                                <Flower className="h-8 w-8 text-white" />
                            </div>
                        </div>
                        <h1 className="text-4xl lg:text-6xl font-bold mb-6">Gynecology Department</h1>
                        <p className="text-xl lg:text-2xl mb-8 leading-relaxed">
                            Comprehensive Women's Health & Gynecological Care in India
                        </p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <Button
                                size="lg"
                                className="bg-white text-pink-600 hover:bg-gray-100"
                                onClick={() => navigate('/register')}
                            >
                                <Flower className="h-5 w-5 mr-2" />
                                Book Consultation
                            </Button>
                            <Button
                                size="lg"
                                variant="outline"
                                className="border-white text-white hover:bg-white/10"
                                onClick={() => window.open('tel:+91-11-4567-8908', '_self')}
                            >
                                <Phone className="h-5 w-5 mr-2" />
                                Women's Helpline
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Department Stats */}
            <section className="py-12 bg-white">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <Card className="text-center bg-pink-50 border-pink-200">
                            <CardContent className="p-6">
                                <Flower className="h-12 w-12 text-pink-600 mx-auto mb-4" />
                                <h3 className="text-2xl font-bold text-pink-800">25000+</h3>
                                <p className="text-pink-600">Women Treated</p>
                            </CardContent>
                        </Card>
                        <Card className="text-center bg-purple-50 border-purple-200">
                            <CardContent className="p-6">
                                <UserCheck className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                                <h3 className="text-2xl font-bold text-purple-800">12+</h3>
                                <p className="text-purple-600">Gynecologists</p>
                            </CardContent>
                        </Card>
                        <Card className="text-center bg-blue-50 border-blue-200">
                            <CardContent className="p-6">
                                <Baby className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                                <h3 className="text-2xl font-bold text-blue-800">5000+</h3>
                                <p className="text-blue-600">Safe Deliveries</p>
                            </CardContent>
                        </Card>
                        <Card className="text-center bg-green-50 border-green-200">
                            <CardContent className="p-6">
                                <Clock className="h-12 w-12 text-green-600 mx-auto mb-4" />
                                <h3 className="text-2xl font-bold text-green-800">24/7</h3>
                                <p className="text-green-600">Maternity Care</p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Services */}
            <section className="py-16 bg-gray-50">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-800 mb-4">Women's Health Services</h2>
                        <p className="text-xl text-gray-600">Comprehensive care for all stages of a woman's life</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <Card className="hover:shadow-xl transition-all duration-300">
                            <CardHeader>
                                <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mb-4">
                                    <Baby className="h-6 w-6 text-pink-600" />
                                </div>
                                <CardTitle className="text-pink-800">Obstetrics & Delivery</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600">
                                    Complete pregnancy care from conception to delivery.
                                </p>
                                <ul className="mt-4 space-y-2 text-sm text-gray-500">
                                    <li>• Antenatal Care</li>
                                    <li>• Normal & Cesarean Delivery</li>
                                    <li>• High-Risk Pregnancy</li>
                                    <li>• Postnatal Care</li>
                                </ul>
                            </CardContent>
                        </Card>

                        <Card className="hover:shadow-xl transition-all duration-300">
                            <CardHeader>
                                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                                    <Flower className="h-6 w-6 text-purple-600" />
                                </div>
                                <CardTitle className="text-purple-800">Gynecological Surgery</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600">
                                    Advanced surgical procedures for women's health conditions.
                                </p>
                                <ul className="mt-4 space-y-2 text-sm text-gray-500">
                                    <li>• Laparoscopic Surgery</li>
                                    <li>• Hysterectomy</li>
                                    <li>• Ovarian Surgery</li>
                                    <li>• Endometriosis Treatment</li>
                                </ul>
                            </CardContent>
                        </Card>

                        <Card className="hover:shadow-xl transition-all duration-300">
                            <CardHeader>
                                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                                    <Stethoscope className="h-6 w-6 text-blue-600" />
                                </div>
                                <CardTitle className="text-blue-800">Fertility Treatment</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600">
                                    Comprehensive fertility evaluation and treatment options.
                                </p>
                                <ul className="mt-4 space-y-2 text-sm text-gray-500">
                                    <li>• IVF Treatment</li>
                                    <li>• IUI Procedures</li>
                                    <li>• Ovulation Induction</li>
                                    <li>• Fertility Counseling</li>
                                </ul>
                            </CardContent>
                        </Card>

                        <Card className="hover:shadow-xl transition-all duration-300">
                            <CardHeader>
                                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                                    <Shield className="h-6 w-6 text-green-600" />
                                </div>
                                <CardTitle className="text-green-800">Cancer Screening</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600">
                                    Early detection and prevention of gynecological cancers.
                                </p>
                                <ul className="mt-4 space-y-2 text-sm text-gray-500">
                                    <li>• Cervical Cancer Screening</li>
                                    <li>• Pap Smear Tests</li>
                                    <li>• HPV Testing</li>
                                    <li>• Breast Cancer Screening</li>
                                </ul>
                            </CardContent>
                        </Card>

                        <Card className="hover:shadow-xl transition-all duration-300">
                            <CardHeader>
                                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                                    <Heart className="h-6 w-6 text-orange-600" />
                                </div>
                                <CardTitle className="text-orange-800">Menopause Care</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600">
                                    Comprehensive care for menopausal and postmenopausal women.
                                </p>
                                <ul className="mt-4 space-y-2 text-sm text-gray-500">
                                    <li>• Hormone Replacement Therapy</li>
                                    <li>• Bone Health Management</li>
                                    <li>• Lifestyle Counseling</li>
                                    <li>• Cardiovascular Care</li>
                                </ul>
                            </CardContent>
                        </Card>

                        <Card className="hover:shadow-xl transition-all duration-300">
                            <CardHeader>
                                <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
                                    <Activity className="h-6 w-6 text-teal-600" />
                                </div>
                                <CardTitle className="text-teal-800">Adolescent Gynecology</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600">
                                    Specialized care for teenage girls and young women.
                                </p>
                                <ul className="mt-4 space-y-2 text-sm text-gray-500">
                                    <li>• Menstrual Disorders</li>
                                    <li>• PCOS Management</li>
                                    <li>• Contraceptive Counseling</li>
                                    <li>• Sexual Health Education</li>
                                </ul>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Maternity Services */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-800 mb-4">Maternity Care Excellence</h2>
                        <p className="text-xl text-gray-600">Creating beautiful birth experiences with safety and comfort</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <img
                                src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=800&q=80"
                                alt="Modern Maternity Ward"
                                className="w-full h-80 object-cover rounded-lg shadow-lg"
                            />
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold text-gray-800 mb-6">World-Class Maternity Facilities</h3>
                            <div className="space-y-4">
                                <div className="flex items-start space-x-3">
                                    <Baby className="h-6 w-6 text-pink-600 mt-1" />
                                    <div>
                                        <h4 className="font-semibold text-gray-800">Labor & Delivery Suites</h4>
                                        <p className="text-gray-600">Private, comfortable rooms with advanced monitoring</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <Heart className="h-6 w-6 text-purple-600 mt-1" />
                                    <div>
                                        <h4 className="font-semibold text-gray-800">NICU Facilities</h4>
                                        <p className="text-gray-600">Level III neonatal intensive care unit</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <Shield className="h-6 w-6 text-blue-600 mt-1" />
                                    <div>
                                        <h4 className="font-semibold text-gray-800">24/7 Obstetric Care</h4>
                                        <p className="text-gray-600">Round-the-clock specialist availability</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <Flower className="h-6 w-6 text-green-600 mt-1" />
                                    <div>
                                        <h4 className="font-semibold text-gray-800">Family-Centered Care</h4>
                                        <p className="text-gray-600">Partner accommodation and newborn bonding</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Specialized Programs */}
            <section className="py-16 bg-gradient-to-r from-pink-50 to-purple-50">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-800 mb-4">Women's Health Programs</h2>
                        <p className="text-xl text-gray-600">Specialized programs designed for women's unique health needs</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <Card className="text-center hover:shadow-lg transition-all duration-300 bg-white">
                            <CardContent className="p-6">
                                <Flower className="h-12 w-12 text-pink-600 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">Well Woman Checkup</h3>
                                <p className="text-gray-600 text-sm">Annual health screening</p>
                            </CardContent>
                        </Card>
                        <Card className="text-center hover:shadow-lg transition-all duration-300 bg-white">
                            <CardContent className="p-6">
                                <Baby className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">Preconception Care</h3>
                                <p className="text-gray-600 text-sm">Planning for healthy pregnancy</p>
                            </CardContent>
                        </Card>
                        <Card className="text-center hover:shadow-lg transition-all duration-300 bg-white">
                            <CardContent className="p-6">
                                <Heart className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">Breast Health Center</h3>
                                <p className="text-gray-600 text-sm">Comprehensive breast care</p>
                            </CardContent>
                        </Card>
                        <Card className="text-center hover:shadow-lg transition-all duration-300 bg-white">
                            <CardContent className="p-6">
                                <Shield className="h-12 w-12 text-green-600 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">Menstrual Clinic</h3>
                                <p className="text-gray-600 text-sm">Menstrual disorder treatment</p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Emergency Services */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-800 mb-4">Emergency Gynecological Care</h2>
                        <p className="text-xl text-gray-600">24/7 emergency services for women's health emergencies</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <Card className="text-center">
                            <CardContent className="p-8">
                                <Clock className="h-16 w-16 text-pink-600 mx-auto mb-4" />
                                <h3 className="text-2xl font-bold text-gray-800 mb-2">24/7 Emergency</h3>
                                <p className="text-gray-600">Round-the-clock emergency obstetric care</p>
                            </CardContent>
                        </Card>
                        <Card className="text-center">
                            <CardContent className="p-8">
                                <Activity className="h-16 w-16 text-purple-600 mx-auto mb-4" />
                                <h3 className="text-2xl font-bold text-gray-800 mb-2">Emergency Surgery</h3>
                                <p className="text-gray-600">Immediate surgical intervention when needed</p>
                            </CardContent>
                        </Card>
                        <Card className="text-center">
                            <CardContent className="p-8">
                                <UserCheck className="h-16 w-16 text-blue-600 mx-auto mb-4" />
                                <h3 className="text-2xl font-bold text-gray-800 mb-2">Expert Team</h3>
                                <p className="text-gray-600">Experienced gynecologists always available</p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section className="py-16 bg-pink-600 text-white">
                <div className="container mx-auto px-6 text-center">
                    <h2 className="text-3xl font-bold mb-6">Contact Gynecology Department</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
                        <div>
                            <Phone className="h-12 w-12 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold mb-2">Appointment Booking</h3>
                            <p className="text-2xl font-bold">+91-11-4567-8908</p>
                            <p className="text-pink-200">Mon-Sat: 8:00 AM - 6:00 PM</p>
                        </div>
                        <div>
                            <Flower className="h-12 w-12 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold mb-2">Women's Emergency</h3>
                            <p className="text-2xl font-bold">+91-11-4567-8901</p>
                            <p className="text-pink-200">Available 24/7</p>
                        </div>
                    </div>
                    <div className="mt-12">
                        <Button
                            size="lg"
                            className="bg-white text-pink-600 hover:bg-gray-100 mr-4"
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

export default GynecologyPage;
