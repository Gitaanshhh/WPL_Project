import React from 'react';
import { User, Mail, Calendar, Award, BookOpen, Settings, LogOut, Edit3, Shield, Users, Code, CheckCircle } from 'lucide-react';

export default function Profile({ role }) {
    const getRoleIcon = (role) => {
        switch(role) {
            case 'Administrator': return <Shield className="w-6 h-6" />;
            case 'Moderator': return <Users className="w-6 h-6" />;
            case 'Developer': return <Code className="w-6 h-6" />;
            case 'Verified User': return <CheckCircle className="w-6 h-6" />;
            default: return <User className="w-6 h-6" />;
        }
    };

    const getRoleColor = (role) => {
        switch(role) {
            case 'Administrator': return 'text-red-600 bg-red-50 border-red-200';
            case 'Moderator': return 'text-orange-600 bg-orange-50 border-orange-200';
            case 'Developer': return 'text-purple-600 bg-purple-50 border-purple-200';
            case 'Verified User': return 'text-blue-600 bg-blue-50 border-blue-200';
            default: return 'text-gray-600 bg-gray-50 border-gray-200';
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-academic-900">Profile</h1>
                <button className="btn btn-outline flex items-center space-x-2">
                    <Edit3 className="w-4 h-4" />
                    <span>Edit Profile</span>
                </button>
            </div>

            {/* Profile Card */}
            <div className="card">
                <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
                    <div className="w-24 h-24 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center shadow-lg">
                        <User className="w-12 h-12 text-white" />
                    </div>
                    
                    <div className="flex-1 text-center md:text-left">
                        <h2 className="text-2xl font-bold text-academic-900 mb-2">Academic User</h2>
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-4">
                            <div className={`flex items-center space-x-2 px-3 py-1 rounded-full border ${getRoleColor(role)}`}>
                                {getRoleIcon(role)}
                                <span className="font-medium">{role}</span>
                            </div>
                            <div className="flex items-center space-x-1 text-academic-600">
                                <Calendar className="w-4 h-4" />
                                <span className="text-sm">Joined March 2024</span>
                            </div>
                        </div>
                        <p className="text-academic-600">
                            Passionate about academic research and knowledge sharing. Contributing to meaningful discussions in the academic community.
                        </p>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="card text-center">
                    <div className="text-3xl font-bold text-primary-600 mb-1">42</div>
                    <div className="text-sm text-academic-600">Discussions</div>
                </div>
                <div className="card text-center">
                    <div className="text-3xl font-bold text-primary-600 mb-1">128</div>
                    <div className="text-sm text-academic-600">Comments</div>
                </div>
                <div className="card text-center">
                    <div className="text-3xl font-bold text-primary-600 mb-1">256</div>
                    <div className="text-sm text-academic-600">Upvotes</div>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="card">
                <h3 className="text-xl font-semibold text-academic-900 mb-4">Recent Activity</h3>
                <div className="space-y-4">
                    <div className="flex items-start space-x-3 pb-4 border-b border-academic-200">
                        <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <BookOpen className="w-4 h-4 text-primary-600" />
                        </div>
                        <div className="flex-1">
                            <p className="text-academic-900">Posted a discussion in <span className="font-medium">Computer Science</span></p>
                            <p className="text-sm text-academic-500">2 hours ago</p>
                        </div>
                    </div>
                    <div className="flex items-start space-x-3 pb-4 border-b border-academic-200">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <Award className="w-4 h-4 text-green-600" />
                        </div>
                        <div className="flex-1">
                            <p className="text-academic-900">Received <span className="font-medium">Top Contributor</span> badge</p>
                            <p className="text-sm text-academic-500">1 day ago</p>
                        </div>
                    </div>
                    <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <User className="w-4 h-4 text-blue-600" />
                        </div>
                        <div className="flex-1">
                            <p className="text-academic-900">Commented on "Quantum Entanglement in Information Theory"</p>
                            <p className="text-sm text-academic-500">3 days ago</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
