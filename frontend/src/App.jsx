import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import PostDetail from './pages/PostDetail';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Login from './pages/Login';
import Signup from './pages/Signup';
import './index.css';

const INITIAL_POSTS = [
    { id: 1, topic: 'Computer Science', title: 'Stateless Architecture in Modern Web Apps', 
      content: 'A stateless architecture ensures that no client context is stored on the server between requests. This improves scalability as any server can handle any request.',
      references: 'Fielding, R. T. (2000). Architectural Styles and the Design of Network-based Software Architectures.' },
    { id: 2, topic: 'Sociology', title: 'The Impact of Gamification on Academic Participation',
      content: 'Gamification elements like points and badges can temporarily increase engagement, but sustained intrinsic motivation requires deeper structural alignment with learning goals.',
      references: 'Deterding, S. et al. (2011). From game design elements to gamefulness: defining gamification.' }
];

const TOPICS = [
    { id: 'cs', name: 'Computer Science', subtopics: ['Algorithms', 'Architecture', 'AI'] },
    { id: 'soc', name: 'Sociology', subtopics: ['Culture', 'Social Networks'] },
    { id: 'phy', name: 'Physics', subtopics: ['Quantum', 'Astrophysics'] }
];

function App() {
    const [role, setRole] = useState('General User');
    const [posts, setPosts] = useState(INITIAL_POSTS);
    const [formData, setFormData] = useState({ title: '', topic: '', content: '', refs: '' });

    const handlePostForm = (e) => {
        e.preventDefault();
        if (!formData.title || !formData.content || !formData.topic) return;

        setPosts([{
            id: Math.max(...posts.map(p => p.id), 0) + 1,
            title: formData.title,
            topic: formData.topic,
            content: formData.content,
            references: formData.refs || 'No references provided.'
        }, ...posts]);

        setFormData({ title: '', topic: '', content: '', refs: '' });
    };

    const handleDelete = (id) => setPosts(posts.filter(p => p.id !== id));
    const isLoggedIn = role !== 'General User';

    return (
        <Router>
            <div className="app-layout">
                <header className="top-nav">
                    <div className="nav-left">
                        <Link to="/" className="logo">AcademicPlatform</Link>
                    </div>

                    <div className="nav-right">
                        <span className="current-role">Viewing as: <strong>{role}</strong></span>

                        <div className="user-menu">
                            {isLoggedIn ? (
                                <>
                                    <Link to="/profile" className="icon-link" title="Profile">👤 Profile</Link>
                                    <Link to="/settings" className="icon-link" title="Settings">⚙️ Settings</Link>
                                    <button onClick={() => setRole('General User')} className="btn-link">Logout</button>
                                </>
                            ) : (
                                <>
                                    <Link to="/login" className="btn-outline">Log In</Link>
                                    <Link to="/signup" className="btn-primary">Sign Up</Link>
                                </>
                            )}
                        </div>
                    </div>
                </header>

                <div className="main-container">
                    <aside className="sidebar">
                        <h3>Explore Topics</h3>
                        <ul className="topic-list">
                            {TOPICS.map(topic => (
                                <li key={topic.id} className="topic-item">
                                    <span className="topic-name">{topic.name}</span>
                                    <ul className="subtopic-list">
                                        {topic.subtopics.map(sub => <li key={sub}><Link to="/">{sub}</Link></li>)}
                                    </ul>
                                </li>
                            ))}
                        </ul>
                    </aside>

                    <main className="content">
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
            </div>
        </Router>
    );
}

export default App;
