import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '../../components/ui/card';
import { ArrowLeft, Users, Scissors, Activity, Shield, Zap, Monitor, Clock, Award, TrendingUp, Heart, Brain } from 'lucide-react';

const OperatingTheatersPage: React.FC = () => {
    const theaterStats = [
        { number: "15", label: "Operating Theaters", description: "State-of-the-art surgical suites with advanced technology" },
        { number: "50+", label: "Surgical Procedures", description: "Different types of surgeries performed daily" },
        { number: "99.2%", label: "Success Rate", description: "Excellent surgical outcomes and patient safety record" },
        { number: "24/7", label: "Emergency Surgery", description: "Round-the-clock availability for urgent surgical cases" },
        { number: "35", label: "Surgical Specialists", description: "Board-certified surgeons across multiple specialties" },
        { number: "< 30min", label: "Setup Time", description: "Rapid theater preparation for emergency procedures" }
    ];

    const surgicalSpecialties = [
        {
            icon: Heart,
            title: "Cardiac Surgery",
            description: "Advanced cardiac procedures including bypass, valve replacement, and minimally invasive heart surgery.",
            procedures: ["Coronary Bypass", "Valve Repair", "Angioplasty", "Pacemaker Implantation"],
            theaters: 3,
            specialists: 8
        },
        {
            icon: Brain,
            title: "Neurosurgery",
            description: "Complex brain and spinal surgeries using advanced navigation and imaging technology.",
            procedures: ["Brain Tumor Removal", "Spinal Surgery", "Aneurysm Repair", "Deep Brain Stimulation"],
            theaters: 2,
            specialists: 6
        },
        {
            icon: Scissors,
            title: "General Surgery",
            description: "Comprehensive surgical procedures for abdominal, trauma, and emergency surgical cases.",
            procedures: ["Appendectomy", "Gallbladder Surgery", "Hernia Repair", "Trauma Surgery"],
            theaters: 4,
            specialists: 10
        },
        {
            icon: Monitor,
            title: "Minimally Invasive Surgery",
            description: "Laparoscopic and robotic-assisted procedures for faster recovery and reduced scarring.",
            procedures: ["Laparoscopic Surgery", "Robotic Surgery", "Endoscopic Procedures", "Arthroscopy"],
            theaters: 3,
            specialists: 7
        },
        {
            icon: Activity,
            title: "Orthopedic Surgery",
            description: "Surgical treatment of musculoskeletal conditions, fractures, and joint replacement.",
            procedures: ["Joint Replacement", "Fracture Repair", "Spine Surgery", "Sports Medicine"],
            theaters: 2,
            specialists: 8
        },
        {
            icon: Shield,
            title: "Emergency Surgery",
            description: "Immediate surgical intervention for life-threatening conditions and trauma cases.",
            procedures: ["Trauma Surgery", "Emergency Procedures", "Life-Saving Operations", "Critical Care Surgery"],
            theaters: 1,
            specialists: 6
        }
    ];

    const advancedEquipment = [
        {
            name: "Surgical Navigation System",
            quantity: 5,
            description: "3D imaging and navigation for precise surgical guidance and improved outcomes",
            image: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?auto=format&fit=crop&w=600&q=80"
        },
        {
            name: "Robotic Surgical System",
            quantity: 2,
            description: "Da Vinci robotic system for minimally invasive precision surgery",
            image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=600&q=80"
        },
        {
            name: "Operating Microscopes",
            quantity: 8,
            description: "High-powered surgical microscopes for delicate neurosurgical and cardiac procedures",
            image: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&w=600&q=80"
        },
        {
            name: "Anesthesia Workstations",
            quantity: 15,
            description: "Advanced anesthesia delivery and monitoring systems for patient safety",
            image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?auto=format&fit=crop&w=600&q=80"
        },
        {
            name: "Surgical Lasers",
            quantity: 6,
            description: "Multiple laser systems for precise tissue cutting and coagulation",
            image: "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=600&q=80"
        },
        {
            name: "Intraoperative Imaging",
            quantity: 4,
            description: "Real-time imaging systems including C-arm and intraoperative MRI",
            image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=600&q=80"
        }
    ];

    const safetyProtocols = [
        {
            title: "Surgical Safety Checklist",
            description: "WHO-recommended safety protocols implemented before, during, and after every surgery",
            impact: "Reduces surgical complications by 35% and improves patient outcomes"
        },
        {
            title: "Infection Prevention",
            description: "Strict sterilization protocols, laminar air flow, and antimicrobial procedures",
            impact: "Maintains surgical site infection rate below 1%, exceeding international standards"
        },
        {
            title: "Team Communication",
            description: "Structured communication protocols and surgical briefings for every procedure",
            impact: "Eliminates communication errors and improves surgical team coordination"
        },
        {
            title: "Equipment Validation",
            description: "Rigorous testing and maintenance of all surgical equipment before each use",
            impact: "Ensures 99.9% equipment reliability and prevents surgical delays"
        }
    ];

    const surgicalTeam = [
        {
            role: "Surgeons",
            count: 35,
            description: "Board-certified surgeons specializing in various surgical disciplines",
            qualifications: ["Board Certification", "Fellowship Training", "Continuing Education", "Peer Review"]
        },
        {
            role: "Anesthesiologists",
            count: 20,
            description: "Specialist physicians managing anesthesia and patient monitoring during surgery",
            qualifications: ["Anesthesia Residency", "Pain Management", "Critical Care", "Cardiac Anesthesia"]
        },
        {
            role: "Surgical Nurses",
            count: 60,
            description: "Specialized nurses trained in sterile technique and surgical procedures",
            qualifications: ["OR Certification", "Sterile Technique", "Emergency Response", "Patient Advocacy"]
        },
        {
            role: "Surgical Technologists",
            count: 45,
            description: "Trained technicians managing surgical instruments and maintaining sterile fields",
            qualifications: ["Surgical Technology", "Instrument Management", "Sterile Processing", "Equipment Expertise"]
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
            <div className="relative bg-gradient-to-r from-green-600 to-blue-600 text-white py-20">
                <div className="absolute inset-0 bg-black opacity-20"></div>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-5xl font-bold mb-6">Operating Theaters</h1>
                    <p className="text-xl max-w-4xl mx-auto leading-relaxed">
                        Our 15 state-of-the-art operating theaters feature cutting-edge surgical technology, advanced safety systems,
                        and highly trained surgical teams dedicated to performing life-saving procedures with precision and excellence.
                    </p>
                </div>
            </div>

            {/* Theater Statistics */}
            <div className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">Surgical Excellence Metrics</h2>
                        <p className="text-xl text-gray-600">Performance indicators that demonstrate our commitment to surgical safety</p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {theaterStats.map((stat, index) => (
                            <Card key={index} className="text-center hover:shadow-lg transition-shadow border-green-200">
                                <CardContent className="p-6">
                                    <div className="text-4xl font-bold text-green-600 mb-2">{stat.number}</div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-3">{stat.label}</h3>
                                    <p className="text-gray-600">{stat.description}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>

            {/* Surgical Specialties */}
            <div className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">Surgical Specialties</h2>
                        <p className="text-xl text-gray-600">Comprehensive surgical services across multiple medical specialties</p>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-8">
                        {surgicalSpecialties.map((specialty, index) => (
                            <Card key={index} className="hover:shadow-lg transition-shadow">
                                <CardContent className="p-6">
                                    <div className="flex items-start space-x-4">
                                        <specialty.icon className="h-12 w-12 text-green-600 flex-shrink-0 mt-1" />
                                        <div className="flex-1">
                                            <h3 className="text-xl font-semibold text-gray-900 mb-3">{specialty.title}</h3>
                                            <div className="flex space-x-4 mb-3">
                                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                    {specialty.theaters} Theaters
                                                </span>
                                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                    {specialty.specialists} Specialists
                                                </span>
                                            </div>
                                            <p className="text-gray-600 mb-4">{specialty.description}</p>
                                            <div>
                                                <h4 className="font-medium text-gray-900 mb-2">Common Procedures:</h4>
                                                <div className="flex flex-wrap gap-2">
                                                    {specialty.procedures.map((procedure, idx) => (
                                                        <span key={idx} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
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

            {/* Safety Protocols */}
            <div className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">Patient Safety Protocols</h2>
                        <p className="text-xl text-gray-600">Comprehensive safety measures ensuring the highest standards of surgical care</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {safetyProtocols.map((protocol, index) => (
                            <Card key={index} className="hover:shadow-lg transition-shadow border-l-4 border-green-600">
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

            {/* Advanced Equipment */}
            <div className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">Advanced Surgical Equipment</h2>
                        <p className="text-xl text-gray-600">Cutting-edge technology enabling precise and minimally invasive procedures</p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {advancedEquipment.map((equipment, index) => (
                            <Card key={index} className="hover:shadow-lg transition-shadow">
                                <CardContent className="p-6">
                                    <img
                                        src={equipment.image}
                                        alt={equipment.name}
                                        className="w-full h-48 object-cover rounded-lg mb-4"
                                    />
                                    <div className="flex justify-between items-start mb-3">
                                        <h3 className="text-lg font-semibold text-gray-900">{equipment.name}</h3>
                                        <span className="bg-green-100 text-green-800 text-sm font-medium px-2 py-1 rounded">
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

            {/* Surgical Team */}
            <div className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">Expert Surgical Team</h2>
                        <p className="text-xl text-gray-600">Highly trained professionals ensuring excellent surgical outcomes</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {surgicalTeam.map((team, index) => (
                            <Card key={index} className="hover:shadow-lg transition-shadow">
                                <CardContent className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <h3 className="text-xl font-semibold text-gray-900">{team.role}</h3>
                                        <div className="text-right">
                                            <div className="text-2xl font-bold text-green-600">{team.count}</div>
                                            <div className="text-sm text-gray-500">Team Members</div>
                                        </div>
                                    </div>
                                    <p className="text-gray-600 mb-4">{team.description}</p>
                                    <div>
                                        <h4 className="font-medium text-gray-900 mb-2">Qualifications:</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {team.qualifications.map((qualification, idx) => (
                                                <span key={idx} className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                                                    {qualification}
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
            <div className="py-16 bg-gradient-to-r from-green-600 to-blue-600 text-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-bold mb-6">Trust Your Surgery to Our Expert Team</h2>
                    <p className="text-xl mb-8 leading-relaxed">
                        Our operating theaters combine advanced technology with skilled surgical expertise to deliver exceptional outcomes.
                        When you need surgery, you can trust our commitment to safety, precision, and your complete recovery.
                    </p>
                    <div className="space-x-4">
                        <Link to="/services">
                            <button className="bg-white text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                                View Surgical Services
                            </button>
                        </Link>
                        <Link to="/register">
                            <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-green-600 transition-colors">
                                Schedule Consultation
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OperatingTheatersPage;
