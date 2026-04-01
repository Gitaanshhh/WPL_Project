// Centralized API configuration
// Uses VITE_API_URL from environment variables (or defaults to localhost for development)
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// ============ TOPICS ============
export const fetchTopics = () =>
  fetch(`${BASE_URL}/topics/`).then(r => r.json());

export const createTopic = (topicData, authHeaders) =>
  fetch(`${BASE_URL}/topics/`, {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify(topicData),
  }).then(r => r.json());

// ============ POSTS ============
export const fetchPosts = (userId = null) => {
  const url = userId 
    ? `${BASE_URL}/posts/?viewer_id=${userId}` 
    : `${BASE_URL}/posts/`;
  return fetch(url).then(r => r.json());
};

export const createPost = (postData, authHeaders) =>
  fetch(`${BASE_URL}/posts/`, {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify(postData),
  }).then(r => r.json());

export const deletePost = (postId, authHeaders) =>
  fetch(`${BASE_URL}/posts/${postId}/`, {
    method: 'DELETE',
    headers: authHeaders,
  });

export const votePost = (postId, voteData, authHeaders) =>
  fetch(`${BASE_URL}/posts/${postId}/vote/`, {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify(voteData),
  }).then(r => r.json());

// ============ COMMENTS ============
export const fetchComments = (postId) =>
  fetch(`${BASE_URL}/posts/${postId}/comments/`).then(r => r.json());

export const createComment = (postId, commentData, authHeaders) =>
  fetch(`${BASE_URL}/posts/${postId}/comments/`, {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify(commentData),
  }).then(r => r.json());

export const deleteComment = (commentId, authHeaders) =>
  fetch(`${BASE_URL}/comments/${commentId}/`, {
    method: 'DELETE',
    headers: authHeaders,
  });

// ============ AUTHENTICATION ============
export const login = (username, password) =>
  fetch(`${BASE_URL}/accounts/login/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  }).then(r => r.json());

export const signup = (userData) =>
  fetch(`${BASE_URL}/accounts/users/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  }).then(r => r.json());

export const logout = (authHeaders) =>
  fetch(`${BASE_URL}/accounts/logout/`, {
    method: 'POST',
    headers: authHeaders,
  });

// ============ USERS ============
export const getUser = (userId, authHeaders) =>
  fetch(`${BASE_URL}/accounts/users/${userId}/`, {
    method: 'GET',
    headers: authHeaders,
  }).then(r => r.json());

export const updateUser = (userId, userData, authHeaders) =>
  fetch(`${BASE_URL}/accounts/users/${userId}/`, {
    method: 'PATCH',
    headers: authHeaders,
    body: JSON.stringify(userData),
  }).then(r => r.json());

export { BASE_URL };
