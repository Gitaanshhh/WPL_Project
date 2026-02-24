import React from 'react';

export default function Settings() {
    return (
        <div className="page-content">
            <h2>Account Settings</h2>
            <div className="form-container">
                <label>Email Notification Preferences</label>
                <select>
                    <option>All notifications</option>
                    <option>Only direct replies</option>
                    <option>None</option>
                </select>

                <label>Theme</label>
                <select>
                    <option>Light</option>
                    <option>Dark</option>
                </select>

                <button>Save Changes</button>
            </div>
        </div>
    );
}
