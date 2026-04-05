import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '../../components/ui/card';
import { ArrowLeft, Clock, Users, Activity, Ambulance, Heart, Zap, Shield, Phone, AlertTriangle, TrendingUp } from 'lucide-react';

const EmergencyDepartmentPage: React.FC = () => {
    const emergencyStats = [
        { number: "< 5min", label: "Average Response Time", description: "Critical cases attended within 5 minutes of arrival" },
        { number: "24/7", label: "Always Available", description: "Round-the-clock emergency medical services" },
        { number: "98%", label: "Success Rate", description: "Patient survival rate for critical emergency cases" },
        { number: "50+", label: "Emergency Beds", description: "Dedicated emergency treatment beds and trauma units" },
        { number: "25", label: "Emergency Staff", description: "Specialized emergency physicians and trauma nurses" },
        { number: "3", label: "Trauma Bays", description: "Advanced trauma resuscitation bays with full equipment" }
    ];

    const equipmentList = [
        {
            name: "Advanced Life Support Ambulances",
            quantity: 8,
            description: "Fully equipped mobile ICUs with defibrillators, ventilators, and cardiac monitors",
            image: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&w=600&q=80"
        },
        {
            name: "Defibrillators",
            quantity: 15,
            description: "Automated external defibrillators for cardiac emergency response",
            image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?auto=format&fit=crop&w=600&q=80"
        },
        {
            name: "Trauma Ventilators",
            quantity: 12,
            description: "Emergency ventilators for critical respiratory support",
            image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?auto=format&fit=crop&w=600&q=80"
        },
        {
            name: "Portable X-Ray Units",
            quantity: 4,
            description: "Mobile X-ray machines for immediate trauma imaging",
            image: "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=600&q=80"
        },
        {
            name: "Emergency Surgical Kits",
            quantity: 20,
            description: "Complete surgical sets for emergency procedures",
            image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=600&q=80"
        },
        {
            name: "Blood Analysis Machines",
            quantity: 6,
            description: "Rapid blood testing equipment for emergency diagnostics",
            image: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?auto=format&fit=crop&w=600&q=80"
        }
    ];

    const emergencyServices = [
        {
            icon: Heart,
            title: "Cardiac Emergency Care",
            description: "Immediate response to heart attacks, cardiac arrests, and chest pain with advanced cardiac life support protocols.",
            procedures: ["ECG Monitoring", "Cardiac Catheterization", "Thrombolysis", "Emergency Angioplasty"]
        },
        {
            icon: Activity,
            title: "Trauma Center",
            description: "Comprehensive trauma care for accidents, injuries, and multi-system trauma cases with specialized trauma surgeons.",
            procedures: ["Emergency Surgery", "Wound Management", "Fracture Treatment", "Internal Bleeding Control"]
        },
        {
            icon: Zap,
            title: "Stroke Response Unit",
            description: "Rapid stroke intervention with advanced neurological assessment and thrombolytic therapy within the golden hour.",
            procedures: ["CT Brain Scans", "Clot Removal", "Neurological Assessment", "Rehabilitation Planning"]
        },
        {
            icon: Shield,
            title: "Pediatric Emergency",
            description: "Specialized emergency care for children with child-friendly environment and pediatric emergency physicians.",
            procedures: ["Pediatric Resuscitation", "Child-Safe Procedures", "Family Support", "Specialized Equipment"]
        }
    ];

    const lifeSavingProtocols = [
        {
            title: "Golden Hour Protocol",
            description: "Critical first hour response system that maximizes survival chances for trauma patients",
            impact: "Increases survival rate by 85% for critical trauma cases"
        },
        {
            title: "Code Blue Response",
            description: "Immediate cardiac arrest response with specialized resuscitation team deployment",
            impact: "Achieves 70% successful resuscitation rate for in-hospital cardiac arrests"
        },
        {
            title: "Stroke Fast Track",
            description: "Rapid stroke assessment and treatment pathway reducing door-to-needle time",
            impact: "Reduces permanent disability by 60% through timely intervention"
        },
        {
            title: "Trauma Team Activation",
            description: "Multi-disciplinary trauma response with surgeons, anesthesiologists, and specialists",
            impact: "Decreases mortality rate by 40% for severe trauma cases"
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navigation */}
            <div className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <Link to="/">
                        <button className="flex items-center text-blue-600 hover:text-blue-800 transition-colors">
                            <ArrowLeft className="h-5 w-5 mr-2" />
                            Back to Home
                        </button>
                    </Link>
                </div>
            </div>

            {/* Hero Section */}
            <div className="relative bg-gradient-to-r from-red-600 to-red-700 text-white py-20">
                <div className="absolute inset-0 bg-black opacity-20"></div>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-5xl font-bold mb-6">Emergency Department</h1>
                    <p className="text-xl max-w-4xl mx-auto leading-relaxed">
                        Our Emergency Department operates 24/7 with state-of-the-art equipment and highly trained medical professionals
                        ready to provide immediate, life-saving care for all medical emergencies. Every second counts, and we're prepared.
                    </p>
                </div>
            </div>

            {/* Emergency Statistics */}
            <div className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">Emergency Response Excellence</h2>
                        <p className="text-xl text-gray-600">Critical metrics that demonstrate our commitment to saving lives</p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {emergencyStats.map((stat, index) => (
                            <Card key={index} className="text-center hover:shadow-lg transition-shadow border-red-200">
                                <CardContent className="p-6">
                                    <div className="text-4xl font-bold text-red-600 mb-2">{stat.number}</div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-3">{stat.label}</h3>
                                    <p className="text-gray-600">{stat.description}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>

            {/* Emergency Services */}
            <div className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">Specialized Emergency Services</h2>
                        <p className="text-xl text-gray-600">Comprehensive emergency care across all medical specialties</p>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-8">
                        {emergencyServices.map((service, index) => (
                            <Card key={index} className="hover:shadow-lg transition-shadow">
                                <CardContent className="p-6">
                                    <div className="flex items-start space-x-4">
                                        <service.icon className="h-12 w-12 text-red-600 flex-shrink-0 mt-1" />
                                        <div className="flex-1">
                                            <h3 className="text-xl font-semibold text-gray-900 mb-3">{service.title}</h3>
                                            <p className="text-gray-600 mb-4">{service.description}</p>
                                            <div>
                                                <h4 className="font-medium text-gray-900 mb-2">Key Procedures:</h4>
                                                <div className="flex flex-wrap gap-2">
                                                    {service.procedures.map((procedure, idx) => (
                                                        <span key={idx} className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">
                                                            {procedure}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>

            {/* Life-Saving Protocols */}
            <div className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">Life-Saving Protocols</h2>
                        <p className="text-xl text-gray-600">Proven emergency protocols that save lives every day</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {lifeSavingProtocols.map((protocol, index) => (
                            <Card key={index} className="hover:shadow-lg transition-shadow border-l-4 border-red-600">
                                <CardContent className="p-6">
                                    <h3 className="text-xl font-semibold text-gray-900 mb-3">{protocol.title}</h3>
                                    <p className="text-gray-600 mb-4">{protocol.description}</p>
                                    <div className="flex items-center space-x-2">
                                        <TrendingUp className="h-5 w-5 text-green-600" />
                                        <span className="text-green-600 font-medium">{protocol.impact}</span>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>

            {/* Emergency Equipment */}
            <div className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">Emergency Medical Equipment</h2>
                        <p className="text-xl text-gray-600">Advanced technology for immediate emergency response</p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {equipmentList.map((equipment, index) => (
                            <Card key={index} className="hover:shadow-lg transition-shadow">
                                <CardContent className="p-6">
                                    <img
                                        src={equipment.image}
                                        alt={equipment.name}
                                        className="w-full h-48 object-cover rounded-lg mb-4"
                                    />
                                    <div className="flex justify-between items-start mb-3">
                                        <h3 className="text-lg font-semibold text-gray-900">{equipment.name}</h3>
                                        <span className="bg-red-100 text-red-800 text-sm font-medium px-2 py-1 rounded">
                                            {equipment.quantity} Units
                                        </span>
                                    </div>
                                    <p className="text-gray-600">{equipment.description}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>

            {/* Emergency Contact */}
            <div className="py-16 bg-red-600 text-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-bold mb-6">Emergency Contact Information</h2>
                    <p className="text-xl mb-8 leading-relaxed">
                        In case of medical emergency, our Emergency Department is available 24/7 to provide immediate,
                        life-saving care. Don't hesitate to seek help when every minute counts.
                    </p>
                    <div className="grid md:grid-cols-2 gap-8 text-left">
                        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                            <div className="flex items-center mb-4">
                                <Phone className="h-6 w-6 mr-3" />
                                <h3 className="text-xl font-semibold">Emergency Hotline</h3>
                            </div>
                            <p className="text-2xl font-bold mb-2">911 or +1 (555) 911-HELP</p>
                            <p className="text-sm opacity-90">Available 24/7 for all medical emergencies</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                            <div className="flex items-center mb-4">
                                <Ambulance className="h-6 w-6 mr-3" />
                                <h3 className="text-xl font-semibold">Emergency Department</h3>
                            </div>
                            <p className="text-lg mb-2">123 Healthcare Street, Medical District</p>
                            <p className="text-sm opacity-90">Direct access to emergency treatment area</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmergencyDepartmentPage;
