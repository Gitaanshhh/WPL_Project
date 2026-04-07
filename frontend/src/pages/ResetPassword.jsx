import React, { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Lock, CheckCircle, AlertCircle } from 'lucide-react';
import * as API from '../api';

export default function ResetPassword() {
    const [params] = useSearchParams();
    const token = params.get('token') || '';
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [done, setDone] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (password !== confirm) {
            setError('Passwords do not match.');
            return;
        }
        if (password.length < 6) {
            setError('Password must be at least 6 characters.');
            return;
        }

        setIsLoading(true);
        try {
            await API.resetPassword(token, password);
            setDone(true);
        } catch (err) {
            setError(err?.message || 'Failed to reset password.');
        } finally {
            setIsLoading(false);
        }
    };

    if (!token) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <div className="card bg-white shadow-xl max-w-md w-full p-8 text-center space-y-4">
                    <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
                    <h2 className="text-xl font-bold text-academic-900">Invalid Link</h2>
                    <p className="text-academic-600">This reset link is missing or invalid.</p>
                    <Link to="/forgot-password" className="btn btn-primary inline-block">Request New Link</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="card bg-white shadow-xl max-w-md w-full p-8">
                {done ? (
                    <div className="text-center space-y-4">
                        <CheckCircle className="w-12 h-12 text-green-500 mx-auto" />
                        <h2 className="text-2xl font-bold text-academic-900">Password Reset</h2>
                        <p className="text-academic-600">Your password has been changed. You can now log in.</p>
                        <Link to="/login" className="btn btn-primary inline-block">Go to Login</Link>
                    </div>
                ) : (
                    <>
                        <div className="text-center mb-6">
                            <Lock className="w-10 h-10 text-primary-600 mx-auto mb-2" />
                            <h2 className="text-2xl font-bold text-academic-900">Set New Password</h2>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-academic-700 mb-1">New Password</label>
                                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                                    className="input" placeholder="At least 6 characters" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-academic-700 mb-1">Confirm Password</label>
                                <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)}
                                    className="input" placeholder="Re-enter password" required />
                            </div>

                            {error && (
                                <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                                    <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                                    <span className="text-sm text-red-700">{error}</span>
                                </div>
                            )}

                            <button type="submit" className="btn btn-primary w-full" disabled={isLoading}>
                                {isLoading ? 'Resetting...' : 'Reset Password'}
                            </button>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
}
