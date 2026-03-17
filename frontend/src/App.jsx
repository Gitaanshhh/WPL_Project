import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { BookOpen, User as UserIcon, Settings as SettingsIcon, LogOut, Menu, X, Search, Bell, ChevronDown, Home as HomeIcon, Users, FileText, Shield, Code } from 'lucide-react';
import Home from './pages/Home';
import PostDetail from './pages/PostDetail';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Login from './pages/Login';
import Signup from './pages/Signup';
import './index.css';

const INITIAL_POSTS = [
    { 
        id: 1, 
        topic: 'Computer Science', 
        title: 'Stateless Architecture in Modern Web Apps', 
        content: 'A stateless architecture ensures that no client context is stored on the server between requests. This improves scalability as any server can handle any request.',
        references: 'Fielding, R. T. (2000). Architectural Styles and the Design of Network-based Software Architectures.',
        author: 'Dr. Sarah Chen',
        upvotes: 42,
        downvotes: 3,
        timestamp: '2 hours ago'
    },
    { 
        id: 2, 
        topic: 'Sociology', 
        title: 'The Impact of Gamification on Academic Participation',
        content: 'Gamification elements like points and badges can temporarily increase engagement, but sustained intrinsic motivation requires deeper structural alignment with learning goals.',
        references: 'Deterding, S. et al. (2011). From game design elements to gamefulness: defining gamification.',
        author: 'Prof. Michael Roberts',
        upvotes: 28,
        downvotes: 5,
        timestamp: '5 hours ago'
    },
    {
        id: 3,
        topic: 'Physics',
        title: 'Quantum Entanglement in Information Theory',
        content: 'Recent advances in quantum computing have demonstrated that entangled particles can be used for instant information transfer across vast distances, challenging our understanding of spacetime.',
        references: 'Nielsen, M. A. & Chuang, I. L. (2010). Quantum Computation and Quantum Information.',
        author: 'Dr. Elena Volkov',
        upvotes: 67,
        downvotes: 8,
        timestamp: '1 day ago'
    }
];

const TOPICS = [
    { id: 'cs', name: 'Computer Science', icon: Code, subtopics: ['Algorithms', 'Architecture', 'AI', 'Machine Learning'] },
    { id: 'soc', name: 'Sociology', icon: Users, subtopics: ['Culture', 'Social Networks', 'Urban Studies'] },
    { id: 'phy', name: 'Physics', icon: Shield, subtopics: ['Quantum', 'Astrophysics', 'Thermodynamics'] },
    { id: 'math', name: 'Mathematics', icon: FileText, subtopics: ['Calculus', 'Linear Algebra', 'Statistics'] }
];

function App() {
    const [role, setRole] = useState('General User');
    const [posts, setPosts] = useState(INITIAL_POSTS);
    const [formData, setFormData] = useState({ title: '', topic: '', content: '', refs: '' });
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const handlePostForm = (e) => {
        e.preventDefault();
        if (!formData.title || !formData.content || !formData.topic) return;

        setPosts([{
            id: Math.max(...posts.map(p => p.id), 0) + 1,
            title: formData.title,
            topic: formData.topic,
            content: formData.content,
            references: formData.refs || 'No references provided.',
            author: role === 'Administrator' ? 'Admin' : role,
            upvotes: 0,
            downvotes: 0,
            timestamp: 'Just now'
        }, ...posts]);

        setFormData({ title: '', topic: '', content: '', refs: '' });
    };

    const handleDelete = (id) => setPosts(posts.filter(p => p.id !== id));
    const isLoggedIn = role !== 'General User';

    const getRoleIcon = (role) => {
        switch(role) {
            case 'Administrator': return <Shield className="w-4 h-4" />;
            case 'Moderator': return <Users className="w-4 h-4" />;
            case 'Developer': return <Code className="w-4 h-4" />;
            case 'Verified User': return <UserIcon className="w-4 h-4" />;
            default: return <UserIcon className="w-4 h-4" />;
        }
    };

    const getRoleColor = (role) => {
        switch(role) {
            case 'Administrator': return 'text-red-600 bg-red-50';
            case 'Moderator': return 'text-orange-600 bg-orange-50';
            case 'Developer': return 'text-purple-600 bg-purple-50';
            case 'Verified User': return 'text-blue-600 bg-blue-50';
            default: return 'text-gray-600 bg-gray-50';
        }
    };

    return (
        <Router>
            <div className="min-h-screen bg-academic-50">
                {/* Header */}
                <header className="sticky top-0 z-50 bg-white border-b border-academic-200 backdrop-blur-lg bg-opacity-90">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between h-16">
                            {/* Logo and Menu */}
                            <div className="flex items-center">
                                <button
                                    onClick={() => setSidebarOpen(!sidebarOpen)}
                                    className="lg:hidden p-2 rounded-lg hover:bg-academic-100 transition-colors"
                                >
                                    {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                                </button>
                                <Link to="/" className="flex items-center space-x-2 ml-2 lg:ml-0">
                                    <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                                        <BookOpen className="w-5 h-5 text-white" />
                                    </div>
                                    <span className="text-xl font-bold text-gradient">AcademiaHub</span>
                                </Link>
                            </div>

                            {/* Search Bar */}
                            <div className="hidden md:flex flex-1 max-w-md mx-8">
                                <div className="relative w-full">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-academic-400 w-4 h-4" />
                                    <input
                                        type="text"
                                        placeholder="Search discussions, topics, authors..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 border border-academic-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                                    />
                                </div>
                            </div>

                            {/* User Menu */}
                            <div className="flex items-center space-x-4">
                                {isLoggedIn && (
                                    <button className="relative p-2 rounded-lg hover:bg-academic-100 transition-colors">
                                        <Bell className="w-5 h-5 text-academic-600" />
                                        <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                                    </button>
                                )}
                                
                                <div className="flex items-center space-x-2">
                                    {isLoggedIn ? (
                                        <>
                                            <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${getRoleColor(role)}`}>
                                                {getRoleIcon(role)}
                                                <span>{role}</span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Link to="/profile" className="btn btn-ghost">
                                                    <UserIcon className="w-4 h-4" />
                                                </Link>
                                                <Link to="/settings" className="btn btn-ghost">
                                                    <SettingsIcon className="w-4 h-4" />
                                                </Link>
                                                <button 
                                                    onClick={() => setRole('General User')} 
                                                    className="btn btn-ghost text-red-600 hover:text-red-700"
                                                >
                                                    <LogOut className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="flex items-center space-x-2">
                                            <Link to="/login" className="btn btn-outline">
                                                Log In
                                            </Link>
                                            <Link to="/signup" className="btn btn-primary">
                                                Sign Up
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                <div className="flex max-w-7xl mx-auto">
                    {/* Sidebar */}
                    <aside className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white border-r border-academic-200 transform transition-transform duration-200 ease-in-out lg:transform-none ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} mt-16 lg:mt-0`}>
                        <div className="h-full overflow-y-auto p-6">
                            <nav className="space-y-6">
                                <div>
                                    <h3 className="text-xs font-semibold text-academic-500 uppercase tracking-wider mb-3">Navigation</h3>
                                    <div className="space-y-1">
                                        <Link to="/" className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-academic-100 text-academic-700 transition-colors">
                                            <HomeIcon className="w-4 h-4" />
                                            <span>Home Feed</span>
                                        </Link>
                                        <Link to="/trending" className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-academic-100 text-academic-700 transition-colors">
                                            <FileText className="w-4 h-4" />
                                            <span>Trending</span>
                                        </Link>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-xs font-semibold text-academic-500 uppercase tracking-wider mb-3">Explore Topics</h3>
                                    <div className="space-y-2">
                                        {TOPICS.map(topic => {
                                            const Icon = topic.icon;
                                            return (
                                                <div key={topic.id} className="group">
                                                    <button className="flex items-center justify-between w-full px-3 py-2 rounded-lg hover:bg-academic-100 text-academic-700 transition-colors">
                                                        <div className="flex items-center space-x-2">
                                                            <Icon className="w-4 h-4" />
                                                            <span className="font-medium">{topic.name}</span>
                                                        </div>
                                                        <ChevronDown className="w-4 h-4 transform group-hover:rotate-180 transition-transform" />
                                                    </button>
                                                    <div className="ml-6 mt-1 space-y-1 hidden group-hover:block">
                                                        {topic.subtopics.map(sub => (
                                                            <Link key={sub} to="/" className="block px-3 py-1 text-sm text-academic-600 hover:text-academic-900 hover:bg-academic-50 rounded transition-colors">
                                                                {sub}
                                                            </Link>
                                                        ))}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </nav>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <main className="flex-1 p-6 lg:p-8">
                        <Routes>
                            <Route path="/" element={<Home posts={posts} role={role} handleDelete={handleDelete} 
                                handlePostForm={handlePostForm} formData={formData} setFormData={setFormData} />} />
                            <Route path="/post/:id" element={<PostDetail posts={posts} />} />
                            <Route path="/login" element={<Login setRole={setRole} />} />
                            <Route path="/signup" element={<Signup setRole={setRole} />} />
                            <Route path="/profile" element={<Profile role={role} />} />
                            <Route path="/settings" element={<Settings />} />
                        </Routes>
                    </main>
                </div>

                {/* Mobile overlay */}
                {sidebarOpen && (
                    <div 
                        className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
                        onClick={() => setSidebarOpen(false)}
                    />
                )}
            </div>
        </Router>
    );
}

export default App;
