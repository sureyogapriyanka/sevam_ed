import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

type StaffRole = 'nurse' | 'receptionist' | 'pharmacist';

interface StaffLoginPageProps {
    role: StaffRole;
}

const roleConfig = {
    nurse: {
        label: 'Nurse Portal',
        icon: '👩‍⚕️',
        primaryColor: 'blue',
        bgGradient: 'from-blue-50 to-blue-100',
        btnClass: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500',
        borderClass: 'border-blue-300 focus:ring-blue-500 focus:border-blue-500',
        textClass: 'text-blue-700',
        headingClass: 'text-blue-800',
    },
    receptionist: {
        label: 'Receptionist Portal',
        icon: '🏥',
        primaryColor: 'green',
        bgGradient: 'from-green-50 to-green-100',
        btnClass: 'bg-green-600 hover:bg-green-700 focus:ring-green-500',
        borderClass: 'border-green-300 focus:ring-green-500 focus:border-green-500',
        textClass: 'text-green-700',
        headingClass: 'text-green-800',
    },
    pharmacist: {
        label: 'Pharmacist Portal',
        icon: '💊',
        primaryColor: 'purple',
        bgGradient: 'from-purple-50 to-purple-100',
        btnClass: 'bg-purple-600 hover:bg-purple-700 focus:ring-purple-500',
        borderClass: 'border-purple-300 focus:ring-purple-500 focus:border-purple-500',
        textClass: 'text-purple-700',
        headingClass: 'text-purple-800',
    },
};

export default function StaffLoginPage({ role }: StaffLoginPageProps) {
    const navigate = useNavigate();
    const config = roleConfig[role];

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Validation
        if (!username.trim() || !password.trim()) {
            setError('Please fill in all fields');
            return;
        }

        setLoading(true);
        try {
            const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
            const response = await fetch(`${apiBase}/users/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: username.trim(), password }),
            });

            const data = await response.json();

            if (!response.ok || !data.user || data.user.role !== role) {
                setError('Invalid credentials or unauthorized role');
                setLoading(false);
                return;
            }

            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            navigate(`/${role}/dashboard`);
        } catch (err) {
            setError('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`min-h-screen bg-gradient-to-br ${config.bgGradient} flex items-center justify-center px-4`}>
            <div className="w-full max-w-md">
                {/* Card */}
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    {/* Icon & Heading */}
                    <div className="text-center mb-8">
                        <div className="text-6xl mb-4">{config.icon}</div>
                        <h1 className={`text-2xl font-bold ${config.headingClass}`}>{config.label}</h1>
                        <p className="text-gray-500 text-sm mt-1">Sign in to your account</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-5">
                        {/* Error message */}
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
                                {error}
                            </div>
                        )}

                        {/* Username */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Username
                            </label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Enter your username"
                                className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 ${config.borderClass} transition`}
                                autoComplete="username"
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter your password"
                                    className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 pr-12 ${config.borderClass} transition`}
                                    autoComplete="current-password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-sm"
                                >
                                    {showPassword ? '🙈' : '👁️'}
                                </button>
                            </div>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full flex items-center justify-center gap-2 py-2.5 px-4 text-white font-semibold rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition disabled:opacity-60 disabled:cursor-not-allowed ${config.btnClass}`}
                        >
                            {loading ? (
                                <>
                                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                    </svg>
                                    Signing in...
                                </>
                            ) : (
                                'Sign In'
                            )}
                        </button>
                    </form>

                    {/* Back to Home */}
                    <div className="text-center mt-6">
                        <Link to="/" className={`text-sm ${config.textClass} hover:underline`}>
                            ← Back to Home
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
