import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const TEST_CREDENTIALS = {
    'admin': { password: 'admin', role: 'Administrator' },
    'user': { password: 'user', role: 'General User' },
    'userV': { password: 'userV', role: 'Verified User' },
    'mod': { password: 'mod', role: 'Moderator' },
    'dev': { password: 'dev', role: 'Developer' }
};

export default function Login({ setRole }) {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();
        setError('');

        const user = TEST_CREDENTIALS[username];
        if (user && user.password === password) {
            setRole(user.role);
            navigate('/');
        } else {
            setError('Invalid username or password. Try: admin/admin, user/user, userV/userV, mod/mod, or dev/dev');
        }
    };

    return (
        <div className="page-content auth-page">
            <h2>Login</h2>
            <form onSubmit={handleLogin} className="form-container">
                <input 
                    type="text" 
                    placeholder="Username" 
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    required 
                />
                <input 
                    type="password" 
                    placeholder="Password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required 
                />

                {error && <div style={{ color: '#d32f2f', padding: '8px', fontSize: '0.9em' }}>{error}</div>}

                <div style={{ fontSize: '0.85em', color: '#666', marginTop: '10px' }}>
                    <strong>Test Accounts:</strong>
                    <ul style={{ margin: '5px 0', paddingLeft: '20px' }}>
                        <li>admin : admin (Administrator)</li>
                        <li>user : user (General User)</li>
                        <li>userV : userV (Verified User)</li>
                        <li>mod : mod (Moderator)</li>
                        <li>dev : dev (Developer)</li>
                    </ul>
                </div>

                <button type="submit">Sign In</button>
            </form>
        </div>
    );
}
