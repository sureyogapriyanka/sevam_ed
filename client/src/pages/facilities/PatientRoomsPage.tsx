import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '../../components/ui/card';
import { ArrowLeft, Users, Bed, Award, Clock, Stethoscope, Activity, Heart, Brain, UserCheck, Shield, TrendingUp } from 'lucide-react';

const PatientRoomsPage: React.FC = () => {
    const roomStats = [
        { number: "500+", label: "Total Patient Beds", description: "Comfortable beds across various room categories" },
        { number: "200", label: "Private Rooms", description: "Single-occupancy rooms with private bathrooms" },
        { number: "150", label: "Semi-Private Rooms", description: "Two-bed rooms with shared amenities" },
        { number: "50", label: "ICU Beds", description: "Intensive care beds with advanced monitoring" },
        { number: "40", label: "NICU Beds", description: "Specialized neonatal intensive care units" },
        { number: "60", label: "Recovery Beds", description: "Post-surgical recovery and observation beds" }
    ];

    const roomTypes = [
        {
            icon: Bed,
            title: "Private Patient Rooms",
            description: "Spacious single-occupancy rooms designed for comfort and privacy during recovery.",
            features: ["Private Bathroom", "Family Seating Area", "Entertainment System", "Climate Control", "Emergency Call System"],
            image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?auto=format&fit=crop&w=800&q=80",
            capacity: "200 Rooms"
        },
        {
            icon: Users,
            title: "Semi-Private Rooms",
            description: "Comfortable two-bed rooms with shared amenities, promoting healing in a community setting.",
            features: ["Shared Bathroom", "Individual Storage", "Curtain Privacy", "Visitor Chairs", "Bedside Tables"],
            image: "https://images.unsplash.com/photo-1631815589968-fdb09a223b1e?auto=format&fit=crop&w=800&q=80",
            capacity: "150 Rooms"
        },
        {
            icon: Activity,
            title: "Intensive Care Units",
            description: "Advanced ICU rooms with comprehensive monitoring systems for critically ill patients.",
            features: ["Advanced Monitoring", "Ventilator Support", "Central Nursing Station", "Family Conference Room", "24/7 Specialist Care"],
            image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?auto=format&fit=crop&w=800&q=80",
            capacity: "50 Beds"
        },
        {
            icon: Heart,
            title: "Cardiac Care Rooms",
            description: "Specialized rooms for cardiac patients with telemetry monitoring and emergency access.",
            features: ["Cardiac Monitoring", "Telemetry Systems", "Emergency Equipment", "Specialized Nursing", "Family Support Area"],
            image: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&w=800&q=80",
            capacity: "30 Rooms"
        },
        {
            icon: Brain,
            title: "Neurological Care Units",
            description: "Specialized accommodation for neurological patients requiring constant monitoring.",
            features: ["Neurological Monitoring", "Seizure Protocols", "Brain Activity Tracking", "Specialized Equipment", "Neuro Nursing Staff"],
            image: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?auto=format&fit=crop&w=800&q=80",
            capacity: "25 Rooms"
        },
        {
            icon: UserCheck,
            title: "Pediatric Rooms",
            description: "Child-friendly rooms designed specifically for young patients and their families.",
            features: ["Colorful Décor", "Family Accommodation", "Play Areas", "Child-Safe Design", "Pediatric Equipment"],
            image: "https://images.unsplash.com/photo-1551601651-2a8555f1a136?auto=format&fit=crop&w=800&q=80",
            capacity: "80 Rooms"
        }
    ];

    const comfortFeatures = [
        {
            title: "Healing Environment Design",
            description: "Rooms designed with natural lighting, calming colors, and therapeutic elements to promote faster recovery",
            impact: "Studies show 25% faster recovery in well-designed patient environments"
        },
        {
            title: "Family-Centered Care",
            description: "Accommodation and facilities for family members to stay close and participate in patient care",
            impact: "Improves patient satisfaction by 40% and reduces anxiety levels significantly"
        },
        {
            title: "Infection Control Systems",
            description: "Advanced air filtration, antimicrobial surfaces, and isolation capabilities when needed",
            impact: "Reduces hospital-acquired infections by 60% through environmental design"
        },
        {
            title: "Technology Integration",
            description: "Smart room controls, entertainment systems, and communication devices for patient convenience",
            impact: "Enhances patient experience and enables better communication with medical staff"
        }
    ];

    const nursingSupport = [
        {
            name: "Registered Nurses (RN)",
            count: 180,
            description: "Licensed professional nurses providing direct patient care and medication administration",
            specialties: ["Medical-Surgical", "Critical Care", "Cardiac", "Neurological"]
        },
        {
            name: "Licensed Practical Nurses (LPN)",
            count: 120,
            description: "Skilled nurses assisting with patient care, monitoring, and daily living activities",
            specialties: ["Patient Care", "Vital Signs", "Wound Care", "Patient Education"]
        },
        {
            name: "Certified Nursing Assistants (CNA)",
            count: 200,
            description: "Trained assistants providing essential patient care and comfort services",
            specialties: ["Personal Care", "Mobility Assistance", "Meal Support", "Patient Transport"]
        },
        {
            name: "Nurse Practitioners (NP)",
            count: 25,
            description: "Advanced practice nurses providing comprehensive patient assessment and treatment",
            specialties: ["Primary Care", "Chronic Disease", "Post-Surgical Care", "Patient Education"]
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
            <div className="relative bg-gradient-to-r from-blue-600 to-green-600 text-white py-20">
                <div className="absolute inset-0 bg-black opacity-20"></div>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-5xl font-bold mb-6">Patient Rooms & Accommodation</h1>
                    <p className="text-xl max-w-4xl mx-auto leading-relaxed">
                        Our patient rooms are designed as healing environments that combine medical excellence with comfort and dignity.
                        Each room is thoughtfully equipped to support recovery while providing a peaceful, family-friendly atmosphere.
                    </p>
                </div>
            </div>

            {/* Room Statistics */}
            <div className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">Accommodation Capacity</h2>
                        <p className="text-xl text-gray-600">Comprehensive room options to meet every patient's needs</p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {roomStats.map((stat, index) => (
                            <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                                <CardContent className="p-6">
                                    <div className="text-4xl font-bold text-blue-600 mb-2">{stat.number}</div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-3">{stat.label}</h3>
                                    <p className="text-gray-600">{stat.description}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>

            {/* Room Types */}
            <div className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">Types of Patient Rooms</h2>
                        <p className="text-xl text-gray-600">Specialized accommodations designed for different medical needs</p>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-8">
                        {roomTypes.map((room, index) => (
                            <Card key={index} className="hover:shadow-lg transition-shadow overflow-hidden">
                                <div className="flex flex-col md:flex-row">
                                    <div className="md:w-1/3">
                                        <img
                                            src={room.image}
                                            alt={room.title}
                                            className="w-full h-48 md:h-full object-cover"
                                        />
                                    </div>
                                    <CardContent className="md:w-2/3 p-6">
                                        <div className="flex items-center mb-3">
                                            <room.icon className="h-6 w-6 text-blue-600 mr-2" />
                                            <h3 className="text-xl font-semibold text-gray-900">{room.title}</h3>
                                        </div>
                                        <div className="mb-3">
                                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                                                {room.capacity}
                                            </span>
                                        </div>
                                        <p className="text-gray-600 mb-4">{room.description}</p>
                                        <div>
                                            <h4 className="font-medium text-gray-900 mb-2">Room Features:</h4>
                                            <div className="flex flex-wrap gap-2">
                                                {room.features.map((feature, idx) => (
                                                    <span key={idx} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                                                        {feature}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </CardContent>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>

            {/* Comfort & Healing Features */}
            <div className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">Healing Environment Features</h2>
                        <p className="text-xl text-gray-600">Design elements that actively promote patient recovery and well-being</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {comfortFeatures.map((feature, index) => (
                            <Card key={index} className="hover:shadow-lg transition-shadow border-l-4 border-green-600">
                                <CardContent className="p-6">
                                    <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                                    <p className="text-gray-600 mb-4">{feature.description}</p>
                                    <div className="flex items-center space-x-2">
                                        <TrendingUp className="h-5 w-5 text-green-600" />
                                        <span className="text-green-600 font-medium">{feature.impact}</span>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>

            {/* Nursing Support Staff */}
            <div className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">Dedicated Nursing Support</h2>
                        <p className="text-xl text-gray-600">Professional nursing staff ensuring excellent patient care in all rooms</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {nursingSupport.map((staff, index) => (
                            <Card key={index} className="hover:shadow-lg transition-shadow">
                                <CardContent className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <h3 className="text-xl font-semibold text-gray-900">{staff.name}</h3>
                                        <div className="text-right">
                                            <div className="text-2xl font-bold text-blue-600">{staff.count}</div>
                                            <div className="text-sm text-gray-500">Staff Members</div>
                                        </div>
                                    </div>
                                    <p className="text-gray-600 mb-4">{staff.description}</p>
                                    <div>
                                        <h4 className="font-medium text-gray-900 mb-2">Specialties:</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {staff.specialties.map((specialty, idx) => (
                                                <span key={idx} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                                                    {specialty}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>

            {/* Call to Action */}
            <div className="py-16 bg-gradient-to-r from-blue-600 to-green-600 text-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-bold mb-6">Experience Comfort During Your Stay</h2>
                    <p className="text-xl mb-8 leading-relaxed">
                        Our patient rooms are designed to support your healing journey with comfort, privacy, and access to excellent nursing care.
                        We believe that a peaceful environment contributes significantly to faster recovery and better health outcomes.
                    </p>
                    <div className="space-x-4">
                        <Link to="/services">
                            <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                                View Medical Services
                            </button>
                        </Link>
                        <Link to="/register">
                            <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors">
                                Register as Patient
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PatientRoomsPage;
