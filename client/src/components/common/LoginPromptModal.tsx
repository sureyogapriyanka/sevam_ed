import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Alert, AlertDescription } from '../ui/alert';
import { useNavigate } from 'react-router-dom';
import { Lock, User, UserPlus, Shield, X } from 'lucide-react';

interface LoginPromptModalProps {
    isOpen: boolean;
    onClose: () => void;
    departmentName: string;
}

const LoginPromptModal: React.FC<LoginPromptModalProps> = ({ isOpen, onClose, departmentName }) => {
    const navigate = useNavigate();

    if (!isOpen) return null;

    const handleLogin = () => {
        navigate('/login');
    };

    const handleRegister = () => {
        navigate('/register');
    };

    return (
        <>
            {/* Overlay */}
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" onClick={onClose}>
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900/50 to-gray-900/50"></div>
            </div>

            {/* Modal */}
            <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
                <Card className="w-full max-w-md shadow-2xl border-2 border-gray-300 bg-white/98 backdrop-blur-md relative"
                    style={{ boxShadow: '0 25px 50px rgba(0,0,0,0.25)' }}
                    onClick={(e) => e.stopPropagation()}>

                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors z-10"
                    >
                        <X className="h-6 w-6" />
                    </button>

                    <CardHeader className="bg-gradient-to-r from-slate-600 to-gray-600 text-white rounded-t-lg pb-8">
                        <div className="text-center">
                            <div className="w-16 h-16 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center">
                                <Lock className="h-8 w-8 text-white" />
                            </div>
                            <CardTitle className="text-xl font-bold">Authentication Required</CardTitle>
                            <p className="text-slate-200 text-sm mt-2">Access to {departmentName}</p>
                        </div>
                    </CardHeader>

                    <CardContent className="p-8">
                        <Alert className="mb-6 border-amber-200 bg-amber-50">
                            <Shield className="h-4 w-4 text-amber-600" />
                            <AlertDescription className="text-amber-800">
                                <strong>Login Required:</strong> You must be authenticated to access detailed department information and services.
                            </AlertDescription>
                        </Alert>

                        <div className="space-y-4">
                            <div className="text-center mb-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">Choose an Option</h3>
                                <p className="text-sm text-gray-600">Login with existing account or create a new one</p>
                            </div>

                            {/* Login Button */}
                            <Button
                                onClick={handleLogin}
                                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg transition-all duration-300 transform hover:scale-105 h-12"
                            >
                                <User className="h-5 w-5 mr-2" />
                                Login to Existing Account
                            </Button>

                            <div className="relative my-4">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-300"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-white text-gray-500">OR</span>
                                </div>
                            </div>

                            {/* Register Button */}
                            <Button
                                onClick={handleRegister}
                                variant="outline"
                                className="w-full border-2 border-green-500 text-green-600 hover:bg-green-50 hover:border-green-600 transition-all duration-300 transform hover:scale-105 h-12"
                            >
                                <UserPlus className="h-5 w-5 mr-2" />
                                Create New Account
                            </Button>
                        </div>

                        {/* Information Box */}
                        <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                            <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                                <Shield className="h-4 w-4 mr-2 text-blue-600" />
                                Why Login is Required?
                            </h4>
                            <ul className="text-xs text-gray-600 space-y-1">
                                <li>• Access detailed medical information</li>
                                <li>• Book appointments and consultations</li>
                                <li>• View personalized treatment options</li>
                                <li>• Secure patient data protection</li>
                            </ul>
                        </div>

                        {/* Quick Access Note */}
                        <div className="mt-4 text-center">
                            <p className="text-xs text-gray-500">
                                Already a patient? <span className="text-blue-600 font-medium">Login for faster access</span>
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
};

export default LoginPromptModal;
