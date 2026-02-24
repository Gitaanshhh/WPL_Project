import React from 'react';

export default function Profile({ role }) {
    return (
        <div className="page-content">
            <h2>User Profile</h2>
            <div className="profile-card">
                <div className="profile-icon-large">👤</div>
                <div className="profile-details">
                    <h3>Academic User</h3>
                    <p><strong>Role:</strong> {role}</p>
                    <p><strong>Institution:</strong> State University</p>
                    <p><strong>Interests:</strong> Computer Science, Sociology</p>
                    <p><strong>Contribution Score:</strong> 120 points</p>
                </div>
            </div>

            <h3>Recent Activity</h3>
            <p>No recent activity found.</p>
        </div>
    );
}
