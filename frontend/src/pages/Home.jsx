import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, MessageSquare, ThumbsUp, ThumbsDown, Flag, Trash2, TrendingUp, Clock, Filter, Search, Edit3, Eye } from 'lucide-react';

export default function Home({ posts, role, handleDelete, handlePostForm, formData, setFormData }) {
    const [sortBy, setSortBy] = useState('hot');
    const [filterTopic, setFilterTopic] = useState('all');
    const [showPostForm, setShowPostForm] = useState(false);

    const canPost = role !== 'General User';
    const canModerate = ['Moderator', 'Administrator', 'Developer'].includes(role);

    const filteredPosts = posts.filter(post => 
        filterTopic === 'all' || post.topic === filterTopic
    );

    const sortedPosts = [...filteredPosts].sort((a, b) => {
        if (sortBy === 'hot') {
            return (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes);
        } else if (sortBy === 'new') {
            return 0; // In real app, sort by timestamp
        }
        return 0;
    });

    const topics = ['all', ...new Set(posts.map(p => p.topic))];

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-academic-900">Academic Discussions</h1>
                    <p className="text-academic-600 mt-1">Explore scholarly conversations and research insights</p>
                </div>
                
                {canPost && (
                    <button
                        onClick={() => setShowPostForm(!showPostForm)}
                        className="btn btn-primary flex items-center space-x-2"
                    >
                        <Plus className="w-4 h-4" />
                        <span>New Discussion</span>
                    </button>
                )}
            </div>

            {/* Post Creation Form */}
            {canPost && showPostForm && (
                <div className="card card-hover animate-fade-in">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-academic-900">Start a Discussion</h3>
                        <button
                            onClick={() => setShowPostForm(false)}
                            className="text-academic-400 hover:text-academic-600"
                        >
                            ×
                        </button>
                    </div>
                    
                    <form onSubmit={handlePostForm} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-academic-700 mb-1">
                                    Academic Topic
                                </label>
                                <select
                                    value={formData.topic}
                                    onChange={e => setFormData({...formData, topic: e.target.value})}
                                    className="input"
                                    required
                                >
                                    <option value="">Select a topic...</option>
                                    <option value="Computer Science">Computer Science</option>
                                    <option value="Sociology">Sociology</option>
                                    <option value="Physics">Physics</option>
                                    <option value="Mathematics">Mathematics</option>
                                </select>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-academic-700 mb-1">
                                    Title
                                </label>
                                <input
                                    type="text"
                                    placeholder="Enter discussion title..."
                                    value={formData.title}
                                    onChange={e => setFormData({...formData, title: e.target.value})}
                                    className="input"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-academic-700 mb-1">
                                Content
                            </label>
                            <textarea
                                placeholder="Share your research, insights, or questions..."
                                rows={5}
                                value={formData.content}
                                onChange={e => setFormData({...formData, content: e.target.value})}
                                className="textarea"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-academic-700 mb-1">
                                References (Optional)
                            </label>
                            <input
                                type="text"
                                placeholder="Citations, DOIs, links to papers..."
                                value={formData.refs}
                                onChange={e => setFormData({...formData, refs: e.target.value})}
                                className="input"
                            />
                        </div>

                        <div className="flex justify-end space-x-3">
                            <button
                                type="button"
                                onClick={() => setShowPostForm(false)}
                                className="btn btn-outline"
                            >
                                Cancel
                            </button>
                            <button type="submit" className="btn btn-primary">
                                Publish Discussion
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Filters and Sort */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="flex flex-wrap gap-2">
                    <div className="flex items-center space-x-2 bg-white rounded-lg border border-academic-200 px-3 py-2">
                        <Filter className="w-4 h-4 text-academic-500" />
                        <select
                            value={filterTopic}
                            onChange={(e) => setFilterTopic(e.target.value)}
                            className="text-sm border-0 focus:ring-0 bg-transparent"
                        >
                            {topics.map(topic => (
                                <option key={topic} value={topic}>
                                    {topic === 'all' ? 'All Topics' : topic}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex items-center space-x-2 bg-white rounded-lg border border-academic-200 px-3 py-2">
                        <TrendingUp className="w-4 h-4 text-academic-500" />
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="text-sm border-0 focus:ring-0 bg-transparent"
                        >
                            <option value="hot">Hot</option>
                            <option value="new">New</option>
                            <option value="top">Top</option>
                        </select>
                    </div>
                </div>

                <div className="text-sm text-academic-600">
                    {sortedPosts.length} {sortedPosts.length === 1 ? 'discussion' : 'discussions'}
                </div>
            </div>

            {/* Access Notice */}
            {!canPost && (
                <div className="card bg-blue-50 border-blue-200">
                    <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0">
                            <Eye className="w-5 h-5 text-blue-600 mt-0.5" />
                        </div>
                        <div>
                            <h4 className="text-sm font-medium text-blue-900">Join the conversation</h4>
                            <p className="text-sm text-blue-700 mt-1">
                                Only verified users and above can publish posts. <Link to="/login" className="underline font-medium">Log in</Link> or <Link to="/signup" className="underline font-medium">sign up</Link> to participate.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Posts Feed */}
            <div className="space-y-4">
                {sortedPosts.length === 0 ? (
                    <div className="card text-center py-12">
                        <MessageSquare className="w-12 h-12 text-academic-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-academic-900 mb-2">No discussions yet</h3>
                        <p className="text-academic-600">
                            {filterTopic === 'all' 
                                ? 'Be the first to start an academic discussion!' 
                                : `No discussions in ${filterTopic} yet. Start one!`}
                        </p>
                    </div>
                ) : (
                    sortedPosts.map(post => (
                        <div key={post.id} className="card card-hover group">
                            <div className="flex items-start space-x-4">
                                {/* Voting */}
                                <div className="flex flex-col items-center space-y-1 flex-shrink-0">
                                    <button className="p-1 rounded hover:bg-academic-100 transition-colors">
                                        <ThumbsUp className="w-4 h-4 text-academic-500" />
                                    </button>
                                    <span className="text-sm font-medium text-academic-900">
                                        {post.upvotes - post.downvotes}
                                    </span>
                                    <button className="p-1 rounded hover:bg-academic-100 transition-colors">
                                        <ThumbsDown className="w-4 h-4 text-academic-500" />
                                    </button>
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            {/* Topic Badge */}
                                            <div className="flex items-center space-x-2 mb-2">
                                                <span className="badge badge-primary">
                                                    {post.topic}
                                                </span>
                                                <span className="text-xs text-academic-500">
                                                    {post.timestamp}
                                                </span>
                                            </div>

                                            {/* Title */}
                                            <Link 
                                                to={`/post/${post.id}`}
                                                className="text-lg font-semibold text-academic-900 hover:text-primary-600 transition-colors line-clamp-2"
                                            >
                                                {post.title}
                                            </Link>

                                            {/* Content Preview */}
                                            <p className="text-academic-600 mt-2 line-clamp-3">
                                                {post.content}
                                            </p>

                                            {/* Meta */}
                                            <div className="flex items-center space-x-4 mt-3 text-sm text-academic-500">
                                                <span>by {post.author}</span>
                                                <div className="flex items-center space-x-1">
                                                    <MessageSquare className="w-4 h-4" />
                                                    <span>12 comments</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    {canModerate && (
                                        <button
                                            onClick={() => handleDelete(post.id)}
                                            className="p-2 rounded-lg hover:bg-red-50 text-red-600 transition-colors"
                                            title="Delete post"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    )}
                                    {role === 'Verified User' && (
                                        <button
                                            className="p-2 rounded-lg hover:bg-yellow-50 text-yellow-600 transition-colors"
                                            title="Report post"
                                        >
                                            <Flag className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
