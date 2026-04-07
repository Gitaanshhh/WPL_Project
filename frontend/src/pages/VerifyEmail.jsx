import React, { useEffect, useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { CheckCircle, AlertCircle, Sparkles } from 'lucide-react';
import * as API from '../api';

export default function VerifyEmail({ onLogin }) {
    const navigate = useNavigate();
    const [params] = useSearchParams();
    const token = params.get('token') || '';
    const [status, setStatus] = useState('loading');
    const [message, setMessage] = useState('');
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        if (!token) {
            setStatus('error');
            setMessage('Missing verification token.');
            return;
        }

        const verify = async () => {
            try {
                const data = await API.verifyEmail(token);
                // Clear authentication token to log out
                localStorage.removeItem('token');
                setStatus('success');
                setMessage(data.detail || 'Email verified!');
                if (data.id) setUserData(data);
                // Redirect to login after 2 seconds
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            } catch (err) {
                setStatus('error');
                setMessage(err?.message || 'Verification failed.');
            }
        };

        verify();
    }, [token]);

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="card bg-white shadow-xl max-w-md w-full p-8 text-center space-y-4">
                {status === 'loading' && (
                    <>
                        <Sparkles className="w-12 h-12 text-primary-500 mx-auto animate-pulse" />
                        <p className="text-academic-600 font-medium">Verifying your email...</p>
                    </>
                )}
                {status === 'success' && (
                    <>
                        <CheckCircle className="w-12 h-12 text-green-500 mx-auto" />
                        <h2 className="text-2xl font-bold text-academic-900">Email Verified!</h2>
                        <p className="text-academic-600">{message}</p>
                        {userData && (
                            <p className="text-sm text-academic-500">Your role has been upgraded to <strong>{userData.role}</strong>.</p>
                        )}
                        <Link to="/login" className="btn btn-primary inline-block">Go to Login</Link>
                    </>
                )}
                {status === 'error' && (
                    <>
                        <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
                        <h2 className="text-xl font-bold text-academic-900">Verification Failed</h2>
                        <p className="text-academic-600">{message}</p>
                        <Link to="/login" className="btn btn-primary inline-block">Go to Login</Link>
                    </>
                )}
            </div>
        </div>
    );
}
