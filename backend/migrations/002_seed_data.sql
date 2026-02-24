-- AcademiaHub Seed Data
-- Sample data for development and testing

-- Insert test users
-- Password for all test users: "password123" (hashed with bcrypt)
-- You'll need to generate actual bcrypt hashes in production
INSERT INTO users (email, password_hash, name, role, status, university, pronouns, bio) VALUES
('admin@academiahub.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYzpLaEu2Ha', 'Admin User', 'Administrator', 'active', 'Stanford University', 'they/them', 'System administrator overseeing platform operations.'),
('mod@academiahub.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYzpLaEu2Ha', 'Moderator User', 'Moderator', 'active', 'MIT', 'she/her', 'Community moderator ensuring quality discussions.'),
('dev@academiahub.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYzpLaEu2Ha', 'Developer User', 'Developer', 'active', 'UC Berkeley', 'he/him', 'Platform developer and technical contributor.'),
('verified@academiahub.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYzpLaEu2Ha', 'Verified User', 'Verified User', 'active', 'Harvard University', 'she/her', 'Verified academic researcher in Computer Science.'),
('user@academiahub.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYzpLaEu2Ha', 'General User', 'General User', 'active', 'Community College', 'he/him', 'General user exploring academic content.'),
('alice@academiahub.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYzpLaEu2Ha', 'Alice Johnson', 'Verified User', 'active', 'Oxford University', 'she/her', 'PhD candidate researching quantum computing algorithms.'),
('bob@academiahub.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYzpLaEu2Ha', 'Bob Wilson', 'Verified User', 'active', 'Cambridge University', 'he/him', 'Professor of Applied Mathematics and Machine Learning.');

-- Insert academic topics (hierarchical)
INSERT INTO topics (name, parent_id, description) VALUES
-- Top-level topics
('Computer Science', NULL, 'Computing, algorithms, and software development'),
('Mathematics', NULL, 'Pure and applied mathematics'),
('Physics', NULL, 'Study of matter, energy, and forces'),
('Biology', NULL, 'Life sciences and biological systems'),
('Chemistry', NULL, 'Study of matter and chemical reactions'),
('Engineering', NULL, 'Application of science and mathematics to solve problems'),
('Social Sciences', NULL, 'Study of human society and relationships');

-- Computer Science subtopics
INSERT INTO topics (name, parent_id, description) VALUES
('Artificial Intelligence', (SELECT id FROM topics WHERE name = 'Computer Science'), 'Machine learning, neural networks, and AI systems'),
('Algorithms', (SELECT id FROM topics WHERE name = 'Computer Science'), 'Algorithm design and analysis'),
('Databases', (SELECT id FROM topics WHERE name = 'Computer Science'), 'Database systems and data management'),
('Software Engineering', (SELECT id FROM topics WHERE name = 'Computer Science'), 'Software development practices and methodologies');

-- Mathematics subtopics
INSERT INTO topics (name, parent_id, description) VALUES
('Linear Algebra', (SELECT id FROM topics WHERE name = 'Mathematics'), 'Vector spaces and linear transformations'),
('Calculus', (SELECT id FROM topics WHERE name = 'Mathematics'), 'Differential and integral calculus'),
('Statistics', (SELECT id FROM topics WHERE name = 'Mathematics'), 'Statistical analysis and probability');

-- Insert sample posts
INSERT INTO posts (author_id, topic_id, title, content, references) VALUES
(
    (SELECT id FROM users WHERE email = 'alice@academiahub.com'),
    (SELECT id FROM topics WHERE name = 'Artificial Intelligence'),
    'Recent Advances in Transformer Architecture',
    '# Introduction to Transformers

Transformer models have revolutionized natural language processing since their introduction in 2017. The self-attention mechanism allows these models to process sequences in parallel, unlike traditional RNNs.

## Key Components

1. **Self-Attention**: Allows the model to weigh the importance of different words
2. **Positional Encoding**: Provides sequence order information
3. **Feed-Forward Networks**: Process representations independently

## Recent Developments

Recent research has focused on making transformers more efficient through sparse attention patterns and mixture-of-experts architectures.

What are your thoughts on the future of transformer models?',
    ARRAY['https://arxiv.org/abs/1706.03762', 'https://arxiv.org/abs/2005.14165']
),
(
    (SELECT id FROM users WHERE email = 'bob@academiahub.com'),
    (SELECT id FROM topics WHERE name = 'Linear Algebra'),
    'Understanding Eigenvalues and Their Applications',
    '# Eigenvalues in Machine Learning

Eigenvalues and eigenvectors are fundamental concepts in linear algebra with numerous applications in data science and machine learning.

## Principal Component Analysis (PCA)

PCA uses eigendecomposition to find the directions of maximum variance in high-dimensional data. This is incredibly useful for:

- Dimensionality reduction
- Data visualization
- Feature extraction
- Noise reduction

## Example

When we compute the covariance matrix of our data and find its eigenvectors, we identify the principal components that capture the most information.

The eigenvalues tell us how much variance is explained by each component.',
    ARRAY['https://en.wikipedia.org/wiki/Eigenvalues_and_eigenvectors', 'https://scikit-learn.org/stable/modules/decomposition.html#pca']
),
(
    (SELECT id FROM users WHERE email = 'verified@academiahub.com'),
    (SELECT id FROM topics WHERE name = 'Algorithms'),
    'Dynamic Programming: A Comprehensive Guide',
    '# Dynamic Programming Fundamentals

Dynamic programming is a method for solving complex problems by breaking them down into simpler subproblems.

## Key Principles

1. **Optimal Substructure**: The optimal solution contains optimal solutions to subproblems
2. **Overlapping Subproblems**: Subproblems recur many times

## Classic Examples

- Fibonacci sequence
- Longest common subsequence
- Knapsack problem
- Edit distance

## Memoization vs Tabulation

Both approaches store results of subproblems, but differ in implementation strategy.',
    ARRAY['https://en.wikipedia.org/wiki/Dynamic_programming']
),
(
    (SELECT id FROM users WHERE email = 'alice@academiahub.com'),
    (SELECT id FROM topics WHERE name = 'Databases'),
    'NoSQL vs SQL: When to Use Each',
    '# Database Selection Criteria

Choosing between SQL and NoSQL databases depends on your specific use case.

## SQL Databases (Relational)

**Pros:**
- ACID compliance
- Complex queries with JOINs
- Data integrity through constraints
- Mature ecosystem

**Use cases:** Financial systems, traditional business applications

## NoSQL Databases

**Pros:**
- Horizontal scalability
- Flexible schema
- High performance for specific access patterns

**Types:** Document (MongoDB), Key-Value (Redis), Column-Family (Cassandra), Graph (Neo4j)

**Use cases:** Real-time analytics, content management, IoT data

## Hybrid Approaches

Many modern applications use both paradigms to leverage their respective strengths.',
    ARRAY['https://www.mongodb.com/nosql-explained', 'https://www.postgresql.org/docs/']
),
(
    (SELECT id FROM users WHERE email = 'bob@academiahub.com'),
    (SELECT id FROM topics WHERE name = 'Statistics'),
    'Understanding P-Values and Statistical Significance',
    '# Statistical Hypothesis Testing

P-values are often misunderstood but are crucial for scientific research.

## What is a P-Value?

A p-value is the probability of obtaining test results at least as extreme as the observed results, assuming the null hypothesis is true.

## Common Misconceptions

- P < 0.05 does NOT mean the result is "important"
- P-values are NOT the probability that the null hypothesis is true
- Statistical significance ≠ practical significance

## Best Practices

1. Pre-register your analysis plan
2. Report effect sizes along with p-values
3. Consider confidence intervals
4. Be aware of multiple comparison problems

## The Replication Crisis

Many scientific fields are grappling with the replication crisis, partly due to p-value misuse.',
    ARRAY['https://www.nature.com/articles/d41586-019-00857-9', 'https://www.tandfonline.com/doi/full/10.1080/00031305.2016.1154108']
);

-- Insert votes on posts
INSERT INTO votes (user_id, post_id, value) VALUES
-- Transformer post gets upvotes
((SELECT id FROM users WHERE email = 'bob@academiahub.com'), 1, 1),
((SELECT id FROM users WHERE email = 'verified@academiahub.com'), 1, 1),
((SELECT id FROM users WHERE email = 'mod@academiahub.com'), 1, 1),
-- Linear Algebra post
((SELECT id FROM users WHERE email = 'alice@academiahub.com'), 2, 1),
((SELECT id FROM users WHERE email = 'verified@academiahub.com'), 2, 1),
-- Dynamic Programming post
((SELECT id FROM users WHERE email = 'bob@academiahub.com'), 3, 1),
((SELECT id FROM users WHERE email = 'alice@academiahub.com'), 3, 1),
((SELECT id FROM users WHERE email = 'user@academiahub.com'), 3, -1),
-- Database post
((SELECT id FROM users WHERE email = 'bob@academiahub.com'), 4, 1),
((SELECT id FROM users WHERE email = 'verified@academiahub.com'), 4, 1),
-- Statistics post
((SELECT id FROM users WHERE email = 'alice@academiahub.com'), 5, 1),
((SELECT id FROM users WHERE email = 'verified@academiahub.com'), 5, 1),
((SELECT id FROM users WHERE email = 'mod@academiahub.com'), 5, 1);

-- Insert a sample report (for testing moderation)
INSERT INTO reports (post_id, reporter_id, reason, status) VALUES
(
    3,
    (SELECT id FROM users WHERE email = 'user@academiahub.com'),
    'The content seems too basic for verified users and may not meet academic standards.',
    'pending'
);

-- Display summary
SELECT 'Database seeded successfully!' AS status;
SELECT COUNT(*) AS user_count FROM users;
SELECT COUNT(*) AS topic_count FROM topics;
SELECT COUNT(*) AS post_count FROM posts;
SELECT COUNT(*) AS vote_count FROM votes;
SELECT COUNT(*) AS report_count FROM reports;
