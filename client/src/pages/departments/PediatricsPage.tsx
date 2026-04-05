import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { useNavigate } from 'react-router-dom';
import {
    Baby,
    Activity,
    Shield,
    UserCheck,
    Clock,
    Heart,
    Phone,
    Stethoscope,
    Thermometer
} from 'lucide-react';

const PediatricsPage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-blue-50">
            {/* Hero Section */}
            <section className="relative bg-gradient-to-r from-pink-500 to-blue-500 text-white py-20">
                <div className="absolute inset-0">
                    <img
                        src="https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?auto=format&fit=crop&w=1600&q=80"
                        alt="Pediatrics Department - Indian Hospital"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-pink-500/70" />
                </div>
                <div className="relative container mx-auto px-6">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="flex justify-center mb-6">
                            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                                <Baby className="h-8 w-8 text-white" />
                            </div>
                        </div>
                        <h1 className="text-4xl lg:text-6xl font-bold mb-6">Pediatrics Department</h1>
                        <p className="text-xl lg:text-2xl mb-8 leading-relaxed">
                            Comprehensive Child Healthcare & Pediatric Specialists in India
                        </p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <Button
                                size="lg"
                                className="bg-white text-pink-600 hover:bg-gray-100"
                                onClick={() => navigate('/register')}
                            >
                                <Baby className="h-5 w-5 mr-2" />
                                Book Consultation
                            </Button>
                            <Button
                                size="lg"
                                variant="outline"
                                className="border-white text-white hover:bg-white/10"
                                onClick={() => window.open('tel:+91-11-4567-8905', '_self')}
                            >
                                <Phone className="h-5 w-5 mr-2" />
                                Pediatric Emergency
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
                                <Baby className="h-12 w-12 text-pink-600 mx-auto mb-4" />
                                <h3 className="text-2xl font-bold text-pink-800">15000+</h3>
                                <p className="text-pink-600">Children Treated</p>
                            </CardContent>
                        </Card>
                        <Card className="text-center bg-blue-50 border-blue-200">
                            <CardContent className="p-6">
                                <UserCheck className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                                <h3 className="text-2xl font-bold text-blue-800">15+</h3>
                                <p className="text-blue-600">Pediatric Specialists</p>
                            </CardContent>
                        </Card>
                        <Card className="text-center bg-green-50 border-green-200">
                            <CardContent className="p-6">
                                <Heart className="h-12 w-12 text-green-600 mx-auto mb-4" />
                                <h3 className="text-2xl font-bold text-green-800">99%</h3>
                                <p className="text-green-600">Recovery Rate</p>
                            </CardContent>
                        </Card>
                        <Card className="text-center bg-purple-50 border-purple-200">
                            <CardContent className="p-6">
                                <Clock className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                                <h3 className="text-2xl font-bold text-purple-800">24/7</h3>
                                <p className="text-purple-600">Pediatric ICU</p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Services */}
            <section className="py-16 bg-gray-50">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-800 mb-4">Pediatric Services</h2>
                        <p className="text-xl text-gray-600">Specialized healthcare for children from birth to adolescence</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <Card className="hover:shadow-xl transition-all duration-300">
                            <CardHeader>
                                <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mb-4">
                                    <Baby className="h-6 w-6 text-pink-600" />
                                </div>
                                <CardTitle className="text-pink-800">Neonatal Care</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600">
                                    Specialized care for newborns including premature babies.
                                </p>
                                <ul className="mt-4 space-y-2 text-sm text-gray-500">
                                    <li>• Neonatal Intensive Care (NICU)</li>
                                    <li>• Premature Baby Care</li>
                                    <li>• Birth Defect Management</li>
                                    <li>• Newborn Screening</li>
                                </ul>
                            </CardContent>
                        </Card>

                        <Card className="hover:shadow-xl transition-all duration-300">
                            <CardHeader>
                                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                                    <Stethoscope className="h-6 w-6 text-blue-600" />
                                </div>
                                <CardTitle className="text-blue-800">General Pediatrics</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600">
                                    Comprehensive primary care for children and adolescents.
                                </p>
                                <ul className="mt-4 space-y-2 text-sm text-gray-500">
                                    <li>• Regular Check-ups</li>
                                    <li>• Vaccination Programs</li>
                                    <li>• Growth Monitoring</li>
                                    <li>• Developmental Assessment</li>
                                </ul>
                            </CardContent>
                        </Card>

                        <Card className="hover:shadow-xl transition-all duration-300">
                            <CardHeader>
                                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                                    <Heart className="h-6 w-6 text-green-600" />
                                </div>
                                <CardTitle className="text-green-800">Pediatric Cardiology</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600">
                                    Specialized heart care for children with cardiac conditions.
                                </p>
                                <ul className="mt-4 space-y-2 text-sm text-gray-500">
                                    <li>• Congenital Heart Disease</li>
                                    <li>• Pediatric Heart Surgery</li>
                                    <li>• Heart Murmur Evaluation</li>
                                    <li>• Cardiac Monitoring</li>
                                </ul>
                            </CardContent>
                        </Card>

                        <Card className="hover:shadow-xl transition-all duration-300">
                            <CardHeader>
                                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                                    <Activity className="h-6 w-6 text-purple-600" />
                                </div>
                                <CardTitle className="text-purple-800">Pediatric Surgery</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600">
                                    Advanced surgical procedures for children and infants.
                                </p>
                                <ul className="mt-4 space-y-2 text-sm text-gray-500">
                                    <li>• Minimally Invasive Surgery</li>
                                    <li>• Congenital Anomaly Repair</li>
                                    <li>• Pediatric Trauma Surgery</li>
                                    <li>• Day Care Procedures</li>
                                </ul>
                            </CardContent>
                        </Card>

                        <Card className="hover:shadow-xl transition-all duration-300">
                            <CardHeader>
                                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                                    <Thermometer className="h-6 w-6 text-orange-600" />
                                </div>
                                <CardTitle className="text-orange-800">Pediatric Emergency</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600">
                                    24/7 emergency care specialized for children.
                                </p>
                                <ul className="mt-4 space-y-2 text-sm text-gray-500">
                                    <li>• Trauma Care</li>
                                    <li>• Poisoning Treatment</li>
                                    <li>• Fever Management</li>
                                    <li>• Respiratory Emergencies</li>
                                </ul>
                            </CardContent>
                        </Card>

                        <Card className="hover:shadow-xl transition-all duration-300">
                            <CardHeader>
                                <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
                                    <Shield className="h-6 w-6 text-teal-600" />
                                </div>
                                <CardTitle className="text-teal-800">Adolescent Medicine</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600">
                                    Specialized care for teenagers and adolescents.
                                </p>
                                <ul className="mt-4 space-y-2 text-sm text-gray-500">
                                    <li>• Puberty Management</li>
                                    <li>• Mental Health Support</li>
                                    <li>• Sports Medicine</li>
                                    <li>• Nutrition Counseling</li>
                                </ul>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Child-Friendly Environment */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-800 mb-4">Child-Friendly Healthcare Environment</h2>
                        <p className="text-xl text-gray-600">Creating a comfortable and welcoming space for children</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <img
                                src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=800&q=80"
                                alt="Child-Friendly Hospital Environment"
                                className="w-full h-80 object-cover rounded-lg shadow-lg"
                            />
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold text-gray-800 mb-6">Designed for Children's Comfort</h3>
                            <div className="space-y-4">
                                <div className="flex items-start space-x-3">
                                    <Baby className="h-6 w-6 text-pink-600 mt-1" />
                                    <div>
                                        <h4 className="font-semibold text-gray-800">Colorful Play Areas</h4>
                                        <p className="text-gray-600">Interactive play zones to reduce anxiety and stress</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <Heart className="h-6 w-6 text-blue-600 mt-1" />
                                    <div>
                                        <h4 className="font-semibold text-gray-800">Family Accommodation</h4>
                                        <p className="text-gray-600">Parent-friendly rooms for overnight stays</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <Shield className="h-6 w-6 text-green-600 mt-1" />
                                    <div>
                                        <h4 className="font-semibold text-gray-800">Child Life Specialists</h4>
                                        <p className="text-gray-600">Trained professionals to help children cope</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <Activity className="h-6 w-6 text-purple-600 mt-1" />
                                    <div>
                                        <h4 className="font-semibold text-gray-800">Educational Programs</h4>
                                        <p className="text-gray-600">School programs for long-term patients</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Vaccination Schedule */}
            <section className="py-16 bg-gradient-to-r from-pink-50 to-blue-50">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-800 mb-4">Vaccination Programs</h2>
                        <p className="text-xl text-gray-600">Complete immunization schedule following Indian Academy of Pediatrics guidelines</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <Card className="text-center hover:shadow-lg transition-all duration-300 bg-white">
                            <CardContent className="p-6">
                                <Shield className="h-12 w-12 text-pink-600 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">Birth Vaccines</h3>
                                <p className="text-gray-600 text-sm">BCG, Hepatitis B, OPV</p>
                            </CardContent>
                        </Card>
                        <Card className="text-center hover:shadow-lg transition-all duration-300 bg-white">
                            <CardContent className="p-6">
                                <Baby className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">Infant Vaccines</h3>
                                <p className="text-gray-600 text-sm">DPT, Polio, MMR, PCV</p>
                            </CardContent>
                        </Card>
                        <Card className="text-center hover:shadow-lg transition-all duration-300 bg-white">
                            <CardContent className="p-6">
                                <Heart className="h-12 w-12 text-green-600 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">School Age</h3>
                                <p className="text-gray-600 text-sm">Booster doses, Typhoid</p>
                            </CardContent>
                        </Card>
                        <Card className="text-center hover:shadow-lg transition-all duration-300 bg-white">
                            <CardContent className="p-6">
                                <UserCheck className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">Adolescent</h3>
                                <p className="text-gray-600 text-sm">HPV, Hepatitis A, TT</p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section className="py-16 bg-pink-600 text-white">
                <div className="container mx-auto px-6 text-center">
                    <h2 className="text-3xl font-bold mb-6">Contact Pediatrics Department</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
                        <div>
                            <Phone className="h-12 w-12 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold mb-2">Appointment Booking</h3>
                            <p className="text-2xl font-bold">+91-11-4567-8905</p>
                            <p className="text-pink-200">Mon-Sat: 8:00 AM - 6:00 PM</p>
                        </div>
                        <div>
                            <Baby className="h-12 w-12 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold mb-2">Pediatric Emergency</h3>
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

export default PediatricsPage;
