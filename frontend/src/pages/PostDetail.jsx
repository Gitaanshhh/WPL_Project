import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ThumbsUp, ThumbsDown, MessageSquare, Share2, Bookmark, User, Calendar, FileText } from 'lucide-react';

export default function PostDetail({ posts }) {
    const { id } = useParams();
    const post = posts.find(p => p.id === parseInt(id));

    if (!post) {
        return (
            <div className="max-w-4xl mx-auto">
                <div className="card text-center py-12">
                    <FileText className="w-16 h-16 text-academic-300 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-academic-900 mb-2">Discussion Not Found</h2>
                    <p className="text-academic-600 mb-6">The discussion you're looking for doesn't exist or has been removed.</p>
                    <Link to="/" className="btn btn-primary">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Feed
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Back Navigation */}
            <Link 
                to="/" 
                className="inline-flex items-center space-x-2 text-academic-600 hover:text-academic-900 transition-colors"
            >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Discussions</span>
            </Link>

            {/* Main Post */}
            <div className="card">
                <div className="space-y-6">
                    {/* Header */}
                    <div className="border-b border-academic-200 pb-6">
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                {/* Topic Badge */}
                                <div className="flex items-center space-x-3 mb-4">
                                    <span className="badge badge-primary text-sm">
                                        {post.topic}
                                    </span>
                                    <span className="text-sm text-academic-500">
                                        {post.timestamp}
                                    </span>
                                </div>

                                {/* Title */}
                                <h1 className="text-3xl font-bold text-academic-900 mb-4">
                                    {post.title}
                                </h1>

                                {/* Author Info */}
                                <div className="flex items-center space-x-4">
                                    <div className="flex items-center space-x-2">
                                        <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                                            <User className="w-5 h-5 text-primary-600" />
                                        </div>
                                        <div>
                                            <div className="font-medium text-academic-900">{post.author}</div>
                                            <div className="text-sm text-academic-500">Academic Contributor</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-1 text-sm text-academic-500">
                                        <Calendar className="w-4 h-4" />
                                        <span>{post.timestamp}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center space-x-2">
                                <button className="btn btn-ghost">
                                    <Bookmark className="w-4 h-4" />
                                </button>
                                <button className="btn btn-ghost">
                                    <Share2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="prose prose-lg max-w-none">
                        <div className="text-academic-800 leading-relaxed">
                            {post.content}
                        </div>
                    </div>

                    {/* References */}
                    {post.references && (
                        <div className="border-t border-academic-200 pt-6">
                            <h3 className="text-lg font-semibold text-academic-900 mb-3">References</h3>
                            <div className="bg-academic-50 rounded-lg p-4">
                                <p className="text-academic-700 italic">{post.references}</p>
                            </div>
                        </div>
                    )}

                    {/* Engagement */}
                    <div className="border-t border-academic-200 pt-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-6">
                                {/* Voting */}
                                <div className="flex items-center space-x-2">
                                    <button className="flex items-center space-x-1 p-2 rounded-lg hover:bg-academic-100 transition-colors">
                                        <ThumbsUp className="w-4 h-4 text-academic-500" />
                                        <span className="text-sm font-medium text-academic-900">{post.upvotes}</span>
                                    </button>
                                    <button className="flex items-center space-x-1 p-2 rounded-lg hover:bg-academic-100 transition-colors">
                                        <ThumbsDown className="w-4 h-4 text-academic-500" />
                                        <span className="text-sm font-medium text-academic-900">{post.downvotes}</span>
                                    </button>
                                </div>

                                {/* Comments */}
                                <button className="flex items-center space-x-2 p-2 rounded-lg hover:bg-academic-100 transition-colors">
                                    <MessageSquare className="w-4 h-4 text-academic-500" />
                                    <span className="text-sm font-medium text-academic-900">12 Comments</span>
                                </button>
                            </div>

                            <div className="text-sm text-academic-500">
                                {post.upvotes - post.downvotes > 0 ? '+' : ''}{post.upvotes - post.downvotes} points
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Comments Section */}
            <div className="card">
                <div className="space-y-6">
                    <h3 className="text-xl font-semibold text-academic-900">Discussion</h3>
                    
                    {/* Add Comment */}
                    <div className="space-y-3">
                        <textarea
                            placeholder="Share your thoughts on this discussion..."
                            rows={3}
                            className="textarea"
                        />
                        <div className="flex justify-end">
                            <button className="btn btn-primary">
                                Post Comment
                            </button>
                        </div>
                    </div>

                    {/* Comments List */}
                    <div className="space-y-4">
                        <div className="border-l-4 border-primary-200 pl-4 space-y-2">
                            <div className="flex items-center space-x-2">
                                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                    <User className="w-4 h-4 text-blue-600" />
                                </div>
                                <div>
                                    <div className="font-medium text-academic-900">Dr. Emily Watson</div>
                                    <div className="text-xs text-academic-500">2 hours ago</div>
                                </div>
                            </div>
                            <p className="text-academic-700">
                                This is an excellent analysis of the topic. The references provided are particularly relevant and add significant credibility to the argument. I'd be interested in seeing how this framework applies to emerging markets.
                            </p>
                            <div className="flex items-center space-x-4 text-sm text-academic-500">
                                <button className="hover:text-academic-700">↑ 5</button>
                                <button className="hover:text-academic-700">Reply</button>
                            </div>
                        </div>

                        <div className="border-l-4 border-academic-200 pl-4 space-y-2">
                            <div className="flex items-center space-x-2">
                                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                    <User className="w-4 h-4 text-green-600" />
                                </div>
                                <div>
                                    <div className="font-medium text-academic-900">Prof. James Chen</div>
                                    <div className="text-xs text-academic-500">1 hour ago</div>
                                </div>
                            </div>
                            <p className="text-academic-700">
                                Great insights! I've been working on similar research and would love to collaborate. The methodology you've described aligns perfectly with my recent findings.
                            </p>
                            <div className="flex items-center space-x-4 text-sm text-academic-500">
                                <button className="hover:text-academic-700">↑ 3</button>
                                <button className="hover:text-academic-700">Reply</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
