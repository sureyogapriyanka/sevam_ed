import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '../components/ui/card';
import { ArrowLeft, Target, Users, Globe, Brain, Shield, Zap } from 'lucide-react';

const VisionPage: React.FC = () => {
    const visionPillars = [
        {
            icon: Brain,
            title: "AI-Powered Healthcare",
            description: "Leveraging artificial intelligence to enhance diagnostic accuracy, predict health outcomes, and personalize treatment plans for every patient."
        },
        {
            icon: Globe,
            title: "Global Healthcare Access",
            description: "Breaking geographical barriers to provide quality healthcare services to underserved communities worldwide through telemedicine and mobile health units."
        },
        {
            icon: Shield,
            title: "Preventive Care Focus",
            description: "Shifting from reactive to proactive healthcare by emphasizing early detection, health monitoring, and lifestyle interventions."
        },
        {
            icon: Zap,
            title: "Rapid Response Systems",
            description: "Implementing cutting-edge emergency response systems that can save lives within the critical golden hour."
        },
        {
            icon: Users,
            title: "Patient-Centered Care",
            description: "Designing every aspect of our services around patient needs, comfort, and dignity while maintaining the highest medical standards."
        },
        {
            icon: Target,
            title: "Precision Medicine",
            description: "Utilizing genomic data and personalized diagnostics to deliver targeted treatments that maximize effectiveness and minimize side effects."
        }
    ];

    const timeline = [
        { year: "2024", milestone: "Launch AI-powered diagnostic systems", status: "In Progress" },
        { year: "2025", milestone: "Expand telemedicine to rural areas", status: "Planned" },
        { year: "2026", milestone: "Implement blockchain health records", status: "Planned" },
        { year: "2027", milestone: "Open 10 new specialized centers", status: "Planned" },
        { year: "2028", milestone: "Launch preventive care mobile units", status: "Planned" },
        { year: "2030", milestone: "Achieve 1 million lives saved milestone", status: "Goal" }
    ];

    const impactGoals = [
        { metric: "1M+", label: "Lives Saved", description: "Through advanced medical interventions and preventive care" },
        { metric: "50+", label: "Countries Served", description: "Expanding our reach to underserved global communities" },
        { metric: "95%", label: "Patient Satisfaction", description: "Maintaining excellence in patient care and experience" },
        { metric: "24/7", label: "Emergency Response", description: "Round-the-clock availability for critical medical situations" }
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navigation */}
            <div className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <Link href="/">
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
                    <h1 className="text-5xl font-bold mb-6">Our Vision</h1>
                    <p className="text-xl max-w-4xl mx-auto leading-relaxed">
                        To revolutionize global healthcare by 2030, creating a world where advanced medical technology,
                        compassionate care, and innovative solutions unite to save lives, eliminate health disparities,
                        and ensure that quality healthcare is accessible to every person, regardless of their location or circumstances.
                    </p>
                </div>
            </div>

            {/* Vision Pillars */}
            <div className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">Vision 2030 Pillars</h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Six foundational pillars that guide our journey toward transforming healthcare delivery and saving millions of lives
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {visionPillars.map((pillar, index) => (
                            <Card key={index} className="hover:shadow-lg transition-shadow">
                                <CardContent className="p-6">
                                    <pillar.icon className="h-12 w-12 text-blue-600 mb-4" />
                                    <h3 className="text-xl font-semibold text-gray-900 mb-3">{pillar.title}</h3>
                                    <p className="text-gray-600 leading-relaxed">{pillar.description}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>

            {/* Timeline */}
            <div className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">Vision 2030 Timeline</h2>
                        <p className="text-xl text-gray-600">Key milestones on our journey to transform healthcare</p>
                    </div>

                    <div className="space-y-8">
                        {timeline.map((item, index) => (
                            <div key={index} className="flex items-center space-x-8">
                                <div className="flex-shrink-0 w-20">
                                    <div className="text-2xl font-bold text-blue-600">{item.year}</div>
                                </div>
                                <div className="flex-1">
                                    <Card>
                                        <CardContent className="p-6">
                                            <div className="flex justify-between items-center">
                                                <h3 className="text-lg font-semibold text-gray-900">{item.milestone}</h3>
                                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${item.status === 'In Progress' ? 'bg-green-100 text-green-800' :
                                                        item.status === 'Planned' ? 'bg-blue-100 text-blue-800' :
                                                            'bg-purple-100 text-purple-800'
                                                    }`}>
                                                    {item.status}
                                                </span>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Impact Goals */}
            <div className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">Vision Impact Goals</h2>
                        <p className="text-xl text-gray-600">Measurable outcomes we aim to achieve by 2030</p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {impactGoals.map((goal, index) => (
                            <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                                <CardContent className="p-6">
                                    <div className="text-4xl font-bold text-blue-600 mb-2">{goal.metric}</div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-3">{goal.label}</h3>
                                    <p className="text-gray-600">{goal.description}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>

            {/* Call to Action */}
            <div className="py-16 bg-gradient-to-r from-blue-600 to-green-600 text-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-bold mb-6">Join Us in Shaping the Future of Healthcare</h2>
                    <p className="text-xl mb-8 leading-relaxed">
                        Our vision becomes reality through the collective efforts of healthcare professionals,
                        technology innovators, and communities working together to save lives and improve health outcomes worldwide.
                    </p>
                    <div className="space-x-4">
                        <Link href="/services">
                            <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                                Explore Our Services
                            </button>
                        </Link>
                        <Link href="/contact">
                            <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors">
                                Partner With Us
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VisionPage;
