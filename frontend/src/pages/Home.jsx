import React from 'react';
import { Link } from 'react-router-dom';

export default function Home({ posts, role, handleDelete, handlePostForm, formData, setFormData }) {
    const canPost = role !== 'General User';
    const canModerate = ['Moderator', 'Administrator', 'Developer'].includes(role);

    return (
        <div className="page-content feed-page">
            {canPost ? (
                <form className="form-container post-form" onSubmit={handlePostForm}>
                    <h3>Create a New Discussion</h3>
                    <input type="text" placeholder="Academic Topic (e.g. Physics, History)" 
                        value={formData.topic} onChange={e => setFormData({...formData, topic: e.target.value})} required />
                    <input type="text" placeholder="Post Title" 
                        value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
                    <textarea placeholder="Long-form explanation or research summary..." rows="5"
                        value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} required />
                    <input type="text" placeholder="References (Citations, DOIs, Links)" 
                        value={formData.refs} onChange={e => setFormData({...formData, refs: e.target.value})} />
                    <button type="submit">Publish Post</button>
                </form>
            ) : (
                <div style={{ background: '#f8d7da', padding: '10px', marginBottom: '20px', borderRadius: '5px', color: '#721c24' }}>
                    <strong>Notice:</strong> Only verified users and above can publish posts. Please log in or upgrade your account.
                </div>
            )}

            <div className="feed">
                {posts.map(post => (
                    <div className="post card" key={post.id}>
                        <Link to={`/post/${post.id}`} className="post-link-overlay" />
                        <div className="post-content">
                            <span className="topic-tag">{post.topic}</span>
                            <h2>{post.title}</h2>
                            <p>{post.content.substring(0, 150)}...</p>
                        </div>
                        <div className="actions" style={{ position: 'relative', zIndex: 10 }}>
                            {canModerate && <button className="btn-delete" onClick={() => handleDelete(post.id)}>Delete Post</button>}
                            {role === 'Verified User' && <button className="btn-report">Report</button>}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
