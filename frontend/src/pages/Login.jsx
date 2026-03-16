import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { BookOpen, User, Lock, AlertCircle, CheckCircle, Shield, Users, Code, Award } from 'lucide-react';

const TEST_CREDENTIALS = [
    { username: 'admin', password: 'admin', role: 'Administrator', icon: Shield, color: 'red', description: 'Full system access' },
    { username: 'dev', password: 'dev', role: 'Developer', icon: Code, color: 'purple', description: 'Technical administration' },
    { username: 'mod', password: 'mod', role: 'Moderator', icon: Users, color: 'orange', description: 'Content moderation' },
    { username: 'userV', password: 'userV', role: 'Verified User', icon: Award, color: 'blue', description: 'Can post and vote' },
    { username: 'user', password: 'user', role: 'General User', icon: User, color: 'gray', description: 'View-only access' }
];

export default function Login({ setRole }) {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        // Simulate API call
        setTimeout(() => {
            const user = TEST_CREDENTIALS.find(cred => cred.username === username && cred.password === password);
            
            if (user) {
                setRole(user.role);
                navigate('/');
            } else {
                setError('Invalid username or password. Please try again.');
            }
            setIsLoading(false);
        }, 500);
    };

    const handleQuickLogin = (credential) => {
        setUsername(credential.username);
        setPassword(credential.password);
        setRole(credential.role);
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-academic-50 flex items-center justify-center p-4">
            <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                {/* Left Side - Branding */}
                <div className="text-center lg:text-left space-y-6">
                    <div className="flex items-center justify-center lg:justify-start space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-lg">
                            <BookOpen className="w-7 h-7 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold text-gradient">AcademiaHub</h1>
                    </div>
                    
                    <div className="space-y-4">
                        <h2 className="text-4xl font-bold text-academic-900">
                            Welcome back to the academic community
                        </h2>
                        <p className="text-lg text-academic-600">
                            Connect with scholars, share research, and engage in meaningful academic discussions.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-4 bg-white rounded-lg border border-academic-200">
                            <div className="text-2xl font-bold text-primary-600">5+</div>
                            <div className="text-sm text-academic-600">User Roles</div>
                        </div>
                        <div className="text-center p-4 bg-white rounded-lg border border-academic-200">
                            <div className="text-2xl font-bold text-primary-600">1000+</div>
                            <div className="text-sm text-academic-600">Discussions</div>
                        </div>
                    </div>
                </div>

                {/* Right Side - Login Form */}
                <div className="space-y-6">
                    <div className="card bg-white shadow-xl">
                        <div className="p-8">
                            <div className="text-center mb-6">
                                <h3 className="text-2xl font-bold text-academic-900">Sign In</h3>
                                <p className="text-academic-600 mt-2">Choose your role to experience the platform</p>
                            </div>

                            <form onSubmit={handleLogin} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-academic-700 mb-1">
                                        Username
                                    </label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-academic-400 w-4 h-4" />
                                        <input
                                            type="text"
                                            placeholder="Enter username"
                                            value={username}
                                            onChange={e => setUsername(e.target.value)}
                                            className="input pl-10"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-academic-700 mb-1">
                                        Password
                                    </label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-academic-400 w-4 h-4" />
                                        <input
                                            type="password"
                                            placeholder="Enter password"
                                            value={password}
                                            onChange={e => setPassword(e.target.value)}
                                            className="input pl-10"
                                            required
                                        />
                                    </div>
                                </div>

                                {error && (
                                    <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                                        <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                                        <span className="text-sm text-red-700">{error}</span>
                                    </div>
                                )}

                                <button 
                                    type="submit" 
                                    className="btn btn-primary w-full"
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Signing in...' : 'Sign In'}
                                </button>
                            </form>

                            <div className="mt-6 text-center">
                                <p className="text-sm text-academic-600">
                                    Don't have an account?{' '}
                                    <Link to="/signup" className="text-primary-600 hover:text-primary-700 font-medium">
                                        Sign up
                                    </Link>
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Quick Login Options */}
                    <div className="card bg-white shadow-lg">
                        <div className="p-6">
                            <h4 className="text-lg font-semibold text-academic-900 mb-4 text-center">
                                Quick Login - Test Accounts
                            </h4>
                            <div className="space-y-2">
                                {TEST_CREDENTIALS.map((cred) => {
                                    const Icon = cred.icon;
                                    return (
                                        <button
                                            key={cred.username}
                                            onClick={() => handleQuickLogin(cred)}
                                            className="w-full flex items-center justify-between p-3 rounded-lg border border-academic-200 hover:border-academic-300 hover:bg-academic-50 transition-all duration-200 group"
                                        >
                                            <div className="flex items-center space-x-3">
                                                <div className={`w-8 h-8 bg-${cred.color}-100 rounded-lg flex items-center justify-center`}>
                                                    <Icon className={`w-4 h-4 text-${cred.color}-600`} />
                                                </div>
                                                <div className="text-left">
                                                    <div className="font-medium text-academic-900 capitalize">
                                                        {cred.role}
                                                    </div>
                                                    <div className="text-xs text-academic-600">
                                                        {cred.username} / {cred.password}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-xs text-academic-500">
                                                {cred.description}
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
