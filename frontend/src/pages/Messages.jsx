import React from 'react';
import { Link } from 'react-router-dom';
import ChatWidget from '../components/ChatWidget';

export default function Messages({ currentUser, authHeaders, onAuthExpired }) {
    if (!currentUser) {
        return (
            <div className="card max-w-xl mx-auto text-center space-y-3">
                <h1 className="text-2xl font-bold text-academic-900">Messages</h1>
                <p className="text-academic-600">Please log in to use messaging.</p>
                <div>
                    <Link to="/login" className="btn btn-primary">Log In</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="-mx-3 -my-3 sm:-mx-5 sm:-my-5 lg:-mx-8 lg:-my-8 h-[calc(100vh-8rem)] md:h-[calc(100vh-4rem)]">
            <ChatWidget
                currentUser={currentUser}
                authHeaders={authHeaders}
                onAuthExpired={onAuthExpired}
                pageMode
                forceOpen
                hideLauncher
            />
        </div>
    );
}
