import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldAlert, RefreshCw, MessageSquareWarning, Users, FileText, Clock } from 'lucide-react';
import * as API from '../api';

const FILTERS = [
    { key: 'all', label: 'All reports' },
    { key: 'post', label: 'Posts' },
    { key: 'user', label: 'Users' },
];

function formatDate(isoTime) {
    if (!isoTime) {
        return 'Unknown';
    }
    return new Date(isoTime).toLocaleString();
}

export default function ModerationReports({ currentUser }) {
    const navigate = useNavigate();
    const [reports, setReports] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        const allowedRoles = ['Administrator', 'Developer', 'Moderator'];
        if (!currentUser || !allowedRoles.includes(currentUser.acting_role || currentUser.role)) {
            setIsLoading(false);
            return;
        }

        const loadReports = async () => {
            setIsLoading(true);
            setError('');
            try {
                const data = await API.getReports({
                    Authorization: `Bearer ${currentUser.token}`,
                });
                setReports(data.results || []);
            } catch (err) {
                setError(err?.message || 'Unable to load reports.');
            } finally {
                setIsLoading(false);
            }
        };

        loadReports();
    }, [currentUser]);

    const filteredReports = useMemo(() => {
        if (filter === 'all') {
            return reports;
        }
        return reports.filter((report) => report.target_type === filter);
    }, [reports, filter]);

    if (!currentUser) {
        return <div className="card text-academic-700">Please log in to view reports.</div>;
    }

    const role = currentUser.acting_role || currentUser.role;
    if (!['Administrator', 'Developer', 'Moderator'].includes(role)) {
        return <div className="card text-academic-700">Access restricted to administrators, developers, and moderators.</div>;
    }

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            <div className="card bg-gradient-to-br from-slate-900 to-slate-700 text-white border-slate-700">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 text-sm mb-4">
                            <ShieldAlert className="w-4 h-4" />
                            <span>Moderation</span>
                        </div>
                        <h1 className="text-3xl font-bold">Reports</h1>
                        <p className="text-slate-200 mt-2">Review reported posts and reported accounts.</p>
                    </div>
                    <button className="btn btn-outline bg-white text-slate-900 hover:bg-slate-100" onClick={() => window.location.reload()}>
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Refresh
                    </button>
                </div>
            </div>

            <div className="flex flex-wrap gap-2">
                {FILTERS.map((item) => (
                    <button
                        key={item.key}
                        type="button"
                        onClick={() => setFilter(item.key)}
                        className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                            filter === item.key
                                ? 'bg-primary-600 text-white border-primary-600'
                                : 'bg-white border-academic-200 text-academic-700 hover:bg-academic-50'
                        }`}
                    >
                        {item.label}
                    </button>
                ))}
            </div>

            {error && <div className="card border-red-200 bg-red-50 text-red-700">{error}</div>}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="card text-center">
                    <div className="text-3xl font-bold text-primary-600 mb-1">{reports.length}</div>
                    <div className="text-sm text-academic-600">Total reports</div>
                </div>
                <div className="card text-center">
                    <div className="text-3xl font-bold text-primary-600 mb-1">{reports.filter((report) => report.target_type === 'post').length}</div>
                    <div className="text-sm text-academic-600">Post reports</div>
                </div>
                <div className="card text-center">
                    <div className="text-3xl font-bold text-primary-600 mb-1">{reports.filter((report) => report.target_type === 'user').length}</div>
                    <div className="text-sm text-academic-600">User reports</div>
                </div>
            </div>

            {isLoading ? (
                <div className="card text-sm text-academic-600">Loading reports...</div>
            ) : filteredReports.length === 0 ? (
                <div className="card text-center py-12">
                    <MessageSquareWarning className="w-12 h-12 text-academic-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-academic-900 mb-2">No reports found</h3>
                    <p className="text-academic-600">Try a different filter or check back later.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredReports.map((report) => (
                        <div key={report.id} className="card card-hover">
                            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                                <div className="flex-1 space-y-3">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <span className="badge badge-primary">{report.target_type === 'post' ? 'Post' : 'User'}</span>
                                        <span className="badge bg-yellow-50 text-yellow-700 border border-yellow-200">{report.status}</span>
                                        <span className="inline-flex items-center gap-1 text-xs text-academic-500">
                                            <Clock className="w-3 h-3" />
                                            {formatDate(report.created_at)}
                                        </span>
                                    </div>

                                    <div className="text-sm text-academic-700">
                                        <span className="font-medium text-academic-900">Reported by:</span> @{report.reporter_username}
                                    </div>

                                    {report.target_type === 'post' ? (
                                        <div className="space-y-1">
                                            <div className="text-sm text-academic-700">
                                                <span className="font-medium text-academic-900">Post:</span>{' '}
                                                <Link to={`/post/${report.post_id}`} className="text-primary-600 hover:underline">
                                                    {report.post_title}
                                                </Link>
                                            </div>
                                            <div className="text-sm text-academic-600">Author: @{report.post_author_username}</div>
                                        </div>
                                    ) : (
                                        <div className="space-y-1">
                                            <div className="text-sm text-academic-700">
                                                <span className="font-medium text-academic-900">User:</span>{' '}
                                                <Link to={`/profile/${report.reported_username}`} className="text-primary-600 hover:underline">
                                                    @{report.reported_username}
                                                </Link>
                                            </div>
                                            <div className="text-sm text-academic-600">{report.reported_full_name || 'No name set'}</div>
                                        </div>
                                    )}

                                    <div>
                                        <div className="text-sm font-medium text-academic-900 mb-1">Reason</div>
                                        <p className="text-sm text-academic-700 whitespace-pre-wrap rounded-lg border border-academic-200 bg-academic-50 p-3">
                                            {report.reason}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
