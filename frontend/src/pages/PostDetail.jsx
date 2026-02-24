import React from 'react';
import { useParams, Link } from 'react-router-dom';

export default function PostDetail({ posts }) {
    const { id } = useParams();
    const post = posts.find(p => p.id === parseInt(id));

    if (!post) {
        return (
            <div className="page-content">
                <h2>Post not found</h2>
                <Link to="/">← Back to Feed</Link>
            </div>
        );
    }

    return (
        <div className="page-content post-detail">
            <Link to="/" className="back-link">← Back to Feed</Link>
            <div className="post-header">
                <span className="topic-tag">{post.topic}</span>
                <h2>{post.title}</h2>
            </div>

            <div className="post-body">
                <p>{post.content}</p>
            </div>

            <div className="references">
                <strong>References:</strong>
                <p>{post.references}</p>
            </div>
        </div>
    );
}
