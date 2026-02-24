import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '../components/ui/card';
import { ArrowLeft, Users, Bed, Award, Clock, Car, Brain, Heart, Eye, Baby, Bone, UserCheck } from 'lucide-react';

const FacilitiesPage: React.FC = () => {
    const facilityStats = [
        { number: "500+", label: "Hospital Beds", description: "State-of-the-art patient rooms and ICU units" },
        { number: "150+", label: "Medical Doctors", description: "Highly qualified specialists and general practitioners" },
        { number: "300+", label: "Nursing Staff", description: "Compassionate and skilled nursing professionals" },
        { number: "50+", label: "Specialists", description: "Expert consultants in various medical fields" },
        { number: "24/7", label: "Emergency Care", description: "Round-the-clock emergency medical services" },
        { number: "15", label: "Operating Theaters", description: "Advanced surgical suites with latest technology" }
    ];

    const departments = [
        {
            icon: Heart,
            name: "Cardiology Department",
            doctors: 12,
            description: "Comprehensive heart care with advanced cardiac procedures and diagnostics",
            facilities: ["Cardiac Catheterization Lab", "ECG/EKG Units", "Stress Test Laboratory", "Cardiac Rehabilitation Center"],
            image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?auto=format&fit=crop&w=800&q=80"
        },
        {
            icon: Brain,
            name: "Neurology Department",
            doctors: 8,
            description: "Advanced neurological care and brain surgery facilities",
            facilities: ["MRI Scanning", "CT Scan Units", "Neurosurgery Suites", "Stroke Unit"],
            image: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?auto=format&fit=crop&w=800&q=80"
        },
        {
            icon: Baby,
            name: "Pediatrics Department",
            doctors: 15,
            description: "Specialized care for infants, children, and adolescents",
            facilities: ["Pediatric ICU", "Neonatal Unit", "Pediatric Emergency", "Child-Friendly Rooms"],
            image: "https://images.unsplash.com/photo-1551601651-2a8555f1a136?auto=format&fit=crop&w=800&q=80"
        },
        {
            icon: Eye,
            name: "Ophthalmology Department",
            doctors: 6,
            description: "Complete eye care services and advanced eye surgery",
            facilities: ["Laser Surgery Suite", "Retinal Imaging", "Vision Testing Lab", "Eye Emergency Unit"],
            image: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&w=800&q=80"
        },
        {
            icon: Bone,
            name: "Orthopedics Department",
            doctors: 10,
            description: "Bone, joint, and musculoskeletal system treatment",
            facilities: ["Orthopedic Surgery", "Physical Therapy", "Sports Medicine", "Joint Replacement Center"],
            image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?auto=format&fit=crop&w=800&q=80"
        },
        {
            icon: UserCheck,
            name: "General Medicine",
            doctors: 20,
            description: "Primary healthcare and internal medicine services",
            facilities: ["Outpatient Clinics", "Health Screening", "Preventive Care", "Chronic Disease Management"],
            image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=800&q=80"
        }
    ];

    const medicalEquipment = [
        {
            name: "MRI Machine",
            quantity: 3,
            description: "High-resolution magnetic resonance imaging for detailed diagnostics",
            image: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?auto=format&fit=crop&w=600&q=80"
        },
        {
            name: "CT Scanner",
            quantity: 4,
            description: "Advanced computed tomography for rapid diagnosis",
            image: "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=600&q=80"
        },
        {
            name: "Ultrasound Machines",
            quantity: 15,
            description: "Latest ultrasound technology for various medical applications",
            image: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&w=600&q=80"
        },
        {
            name: "X-Ray Units",
            quantity: 10,
            description: "Digital X-ray systems for quick and accurate imaging",
            image: "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=600&q=80"
        },
        {
            name: "Ventilators",
            quantity: 50,
            description: "Life support systems for critical care patients",
            image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?auto=format&fit=crop&w=600&q=80"
        },
        {
            name: "Dialysis Machines",
            quantity: 20,
            description: "Advanced renal replacement therapy equipment",
            image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?auto=format&fit=crop&w=600&q=80"
        }
    ];

    const hospitalImages = [
        {
            url: "https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&w=1200&q=80",
            title: "SevaMed Hospital Main Building",
            description: "Our modern 10-story main hospital building with 500+ beds"
        },
        {
            url: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=1200&q=80",
            title: "Hospital Reception & Lobby",
            description: "Welcoming reception area with comfortable patient waiting spaces"
        },
        {
            url: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?auto=format&fit=crop&w=1200&q=80",
            title: "Patient Rooms",
            description: "Private and semi-private rooms equipped with modern amenities"
        },
        {
            url: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1200&q=80",
            title: "Operating Theaters",
            description: "15 state-of-the-art operating theaters with advanced surgical equipment"
        },
        {
            url: "https://images.unsplash.com/photo-1666214280557-f1b5022eb634?auto=format&fit=crop&w=1200&q=80",
            title: "Emergency Department",
            description: "24/7 emergency care with trauma units and rapid response capabilities"
        },
        {
            url: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?auto=format&fit=crop&w=1200&q=80",
            title: "Medical Laboratory",
            description: "Advanced diagnostic laboratory with automated testing equipment"
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
                    <h1 className="text-5xl font-bold mb-6">Our Medical Facilities</h1>
                    <p className="text-xl max-w-4xl mx-auto leading-relaxed">
                        Discover our world-class medical facilities, advanced equipment, and dedicated healthcare professionals
                        committed to providing exceptional patient care and saving lives every day.
                    </p>
                </div>
            </div>

            {/* Facility Statistics */}
            <div className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Capacity & Capabilities</h2>
                        <p className="text-xl text-gray-600">Numbers that demonstrate our commitment to healthcare excellence</p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {facilityStats.map((stat, index) => (
                            <Card key={index} className="text-center hover:shadow-lg transition-shadow border-2 border-blue-500/30 bg-gradient-to-br from-gray-800 to-gray-900 backdrop-blur-sm">
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

            {/* Hospital Image Gallery */}
            <div className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">Facility Gallery</h2>
                        <p className="text-xl text-gray-600">Take a virtual tour of our modern medical facilities</p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {hospitalImages.map((image, index) => (
                            <div key={index} className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                                <img
                                    src={image.url}
                                    alt={image.title}
                                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                                    <div className="p-6 text-white">
                                        <h3 className="text-lg font-semibold mb-2">{image.title}</h3>
                                        <p className="text-sm opacity-90">{image.description}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Medical Departments */}
            <div className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">Medical Departments</h2>
                        <p className="text-xl text-gray-600">Specialized departments with expert medical professionals</p>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-8">
                        {departments.map((dept, index) => (
                            <Card key={index} className="hover:shadow-lg transition-shadow border-2 border-green-500/30 bg-gradient-to-br from-gray-800 to-gray-900 backdrop-blur-sm">
                                <CardContent className="p-6">
                                    <div className="flex items-start space-x-6">
                                        <div className="flex-shrink-0">
                                            <img
                                                src={dept.image}
                                                alt={dept.name}
                                                className="w-24 h-24 rounded-lg object-cover"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center mb-3">
                                                <dept.icon className="h-6 w-6 text-blue-600 mr-2" />
                                                <h3 className="text-xl font-semibold text-gray-900">{dept.name}</h3>
                                            </div>
                                            <div className="mb-3">
                                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                                                    <Users className="h-4 w-4 mr-1" />
                                                    {dept.doctors} Doctors
                                                </span>
                                            </div>
                                            <p className="text-gray-600 mb-4">{dept.description}</p>
                                            <div>
                                                <h4 className="font-medium text-gray-900 mb-2">Key Facilities:</h4>
                                                <div className="flex flex-wrap gap-2">
                                                    {dept.facilities.map((facility, idx) => (
                                                        <span key={idx} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                                                            {facility}
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

            {/* Medical Equipment */}
            <div className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">Advanced Medical Equipment</h2>
                        <p className="text-xl text-gray-600">State-of-the-art technology for accurate diagnosis and treatment</p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {medicalEquipment.map((equipment, index) => (
                            <Card key={index} className="hover:shadow-lg transition-shadow border-2 border-purple-500/30 bg-gradient-to-br from-gray-800 to-gray-900 backdrop-blur-sm">
                                <CardContent className="p-6">
                                    <img
                                        src={equipment.image}
                                        alt={equipment.name}
                                        className="w-full h-48 object-cover rounded-lg mb-4"
                                    />
                                    <div className="flex justify-between items-start mb-3">
                                        <h3 className="text-xl font-semibold text-gray-900">{equipment.name}</h3>
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

            {/* Call to Action */}
            <div className="py-16 bg-gradient-to-r from-blue-600 to-green-600 text-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-bold mb-6">Experience Excellence in Healthcare</h2>
                    <p className="text-xl mb-8 leading-relaxed">
                        Our comprehensive facilities and dedicated medical professionals are here to provide you
                        with the highest quality healthcare services. Your health and well-being are our top priorities.
                    </p>
                    <div className="space-x-4">
                        <Link to="/services">
                            <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                                View All Services
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

export default FacilitiesPage;
