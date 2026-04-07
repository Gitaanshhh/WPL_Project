import React, { useState } from 'react';
import { Lock, CheckCircle, AlertCircle, Mail } from 'lucide-react';
import * as API from '../api';

export default function Settings({ currentUser, authHeaders }) {
    const [currentPw, setCurrentPw] = useState('');
    const [newPw, setNewPw] = useState('');
    const [confirmPw, setConfirmPw] = useState('');
    const [pwMessage, setPwMessage] = useState('');
    const [pwError, setPwError] = useState('');
    const [pwLoading, setPwLoading] = useState(false);

    const [verifyMessage, setVerifyMessage] = useState('');
    const [verifyLoading, setVerifyLoading] = useState(false);

    if (!currentUser) {
        return <div className="card text-academic-700">Please log in to view settings.</div>;
    }

    const headers = authHeaders ? authHeaders(true) : {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${currentUser.token}`,
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        setPwError('');
        setPwMessage('');

        if (newPw !== confirmPw) {
            setPwError('New passwords do not match.');
            return;
        }
        if (newPw.length < 6) {
            setPwError('New password must be at least 6 characters.');
            return;
        }

        setPwLoading(true);
        try {
            const data = await API.changePassword(currentPw, newPw, headers);
            setPwMessage(data.detail || 'Password changed successfully.');
            setCurrentPw('');
            setNewPw('');
            setConfirmPw('');
        } catch (err) {
            setPwError(err?.message || 'Failed to change password.');
        } finally {
            setPwLoading(false);
        }
    };

    const handleResendVerification = async () => {
        setVerifyMessage('');
        setVerifyLoading(true);
        try {
            const data = await API.sendVerification(headers);
            setVerifyMessage(data.detail || 'Verification email sent!');
        } catch (err) {
            setVerifyMessage(err?.message || 'Failed to send verification email.');
        } finally {
            setVerifyLoading(false);
        }
    };

    return (
        <div className="settings-page max-w-2xl mx-auto space-y-6">
            <h2 className="text-2xl font-bold text-academic-900">Settings</h2>

            {/* Email Verification */}
            {!currentUser.email_verified && (
                <div className="card border-amber-200 bg-amber-50">
                    <div className="flex items-start gap-3">
                        <Mail className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                            <h3 className="font-semibold text-amber-900">Email not verified</h3>
                            <p className="text-sm text-amber-700 mt-1">
                                Verify your email ({currentUser.email}) to unlock full access — create posts, vote, and comment.
                            </p>
                            <button
                                onClick={handleResendVerification}
                                disabled={verifyLoading}
                                className="btn btn-primary mt-3 text-sm"
                            >
                                {verifyLoading ? 'Sending...' : 'Resend Verification Email'}
                            </button>
                            {verifyMessage && <p className="text-sm text-amber-800 mt-2">{verifyMessage}</p>}
                        </div>
                    </div>
                </div>
            )}

            {currentUser.email_verified && (
                <div className="card border-green-200 bg-green-50">
                    <div className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <span className="text-green-800 font-medium">Email verified</span>
                    </div>
                </div>
            )}

            {/* Change Password */}
            <div className="card">
                <div className="flex items-center gap-2 mb-4">
                    <Lock className="w-5 h-5 text-academic-600" />
                    <h3 className="text-lg font-semibold text-academic-900">Change Password</h3>
                </div>

                <form onSubmit={handleChangePassword} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-academic-700 mb-1">Current Password</label>
                        <input type="password" value={currentPw} onChange={(e) => setCurrentPw(e.target.value)}
                            className="input" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-academic-700 mb-1">New Password</label>
                        <input type="password" value={newPw} onChange={(e) => setNewPw(e.target.value)}
                            className="input" placeholder="At least 6 characters" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-academic-700 mb-1">Confirm New Password</label>
                        <input type="password" value={confirmPw} onChange={(e) => setConfirmPw(e.target.value)}
                            className="input" required />
                    </div>

                    {pwError && (
                        <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                            <span className="text-sm text-red-700">{pwError}</span>
                        </div>
                    )}
                    {pwMessage && (
                        <div className="flex items-center space-x-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                            <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                            <span className="text-sm text-green-700">{pwMessage}</span>
                        </div>
                    )}

                    <button type="submit" className="btn btn-primary" disabled={pwLoading}>
                        {pwLoading ? 'Changing...' : 'Change Password'}
                    </button>
                </form>
            </div>
        </div>
    );
}
