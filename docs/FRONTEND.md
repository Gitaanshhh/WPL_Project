# Frontend Setup & Architecture

Scholar frontend is a React SPA built with Vite, Tailwind CSS, and React Router. It communicates with the Django backend via REST API.

## Quick Start

### Local Development

```bash
cd frontend

# Install dependencies
npm install

# Start dev server
npm run dev
# Open http://localhost:5173
```

### Build for Production

```bash
npm run build
# Output: dist/ (ready for Vercel)
```

## Project Structure

```
frontend/
├── src/
│   ├── App.jsx              # Main app component (routing, state)
│   ├── main.jsx             # React Query provider setup
│   ├── index.css            # Tailwind + custom utilities
│   ├── api.js               # API client (centralized)
│   ├── supabase.js          # Supabase client config
│   ├── pages/               # Route pages (lazy-loaded)
│   │   ├── Home.jsx         # Feed with filtering
│   │   ├── PostDetail.jsx   # Single post view
│   │   ├── Profile.jsx      # User profile editor
│   │   ├── PublicProfile.jsx
│   │   ├── Login.jsx
│   │   ├── Signup.jsx
│   │   ├── AuthCallback.jsx
│   │   ├── AdminUsers.jsx
│   │   ├── ModerationReports.jsx
│   │   └── Settings.jsx
│   └── components/          # Shared components
│       └── ChatWidget.jsx
├── index.html               # HTML entry
├── vite.config.js           # Vite config
├── tailwind.config.js       # Tailwind config
├── vercel.json              # Vercel deployment config
└── package.json
```

## Core Concepts

### State Management (App.jsx)

Root state lifted to `App.jsx`:
```javascript
const [currentUser, setCurrentUser] = useState(null)          // Auth user
const [posts, setPosts] = useState([])                        // Feed
const [topics, setTopics] = useState([])                      // Topics
const [formData, setFormData] = useState({})                  // Post form
const [isLoadingPosts, setIsLoadingPosts] = useState(false)   // Loading state
```

**Redux not used** — Simple enough for prop drilling.

### API Client (api.js)

Centralized wrapper around `fetch()`:
```javascript
export const fetchPosts = (userId, { sort = 'new', topic_id = null, page = 1 }) => {
  const params = new URLSearchParams()
  params.append('sort', sort)
  params.append('page', page)
  if (topic_id) params.append('topic_id', topic_id)
  return request(`/posts/?${params}`)
}
```

**Error Handling:**
- `parseResponse()` extracts error messages from JSON or status code
- Throws error that components catch and display

### React Query

Client-side caching (in `main.jsx`):
```jsx
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 2,    // 2 min before refetch
      gcTime: 1000 * 60 * 10,       // 10 min before garbage collect
    },
  },
})
```

**Benefit:** Prevents duplicate API calls within 2 minutes.

### Routing

React Router in `App.jsx`:
```jsx
<Routes>
  <Route path="/" element={<Home ... />} />
  <Route path="/post/:id" element={<PostDetail ... />} />
  <Route path="/login" element={<Login ... />} />
  <Route path="/admin/users" element={<AdminUsers ... />} />
</Routes>
```

## Component Patterns

### Page Component (Home.jsx)

Receives props from `App.jsx`:
```jsx
export default function Home({
  posts,          // Array from backend
  role,           // Current user's role
  currentUser,    // Auth user object
  topics,         // Available topics
  isLoadingPosts, // Loading state
  handleDelete,   // Callback to delete post
  handlePostForm, // Callback to submit post
  handleVote,     // Callback for voting
  handleCreateTopic, // Callback for new topic
  handleFilterChange, // Callback for sort/topic filter
  formData,       // Form state
  setFormData,    // Update form state
}) {
  // ...
}
```

**Renders:**
- Post list with voting buttons
- Post form (if user has permission)
- Topic filter dropdown
- Sort buttons (Newest/Top Score)

**Callbacks trigger:**
1. Backend API calls
2. State updates in App.jsx
3. Visual feedback

### Form Component Pattern

```jsx
const [formData, setFormData] = useState({
  title: '', content: '', topic_id: ''
})

const handleSubmit = async (e) => {
  e.preventDefault()
  try {
    const result = await API.createPost(formData, authHeaders)
    onSuccess(result) // Callback to parent
    setFormData({})   // Reset
  } catch (error) {
    setError(error.message) // Show error
  }
}

return (
  <form onSubmit={handleSubmit}>
    <input
      value={formData.title}
      onChange={e => setFormData({...formData, title: e.target.value})}
    />
  </form>
)
```

### List Item Component Pattern

```jsx
posts.map(post => (
  <div key={post.id} className="card card-hover">
    <button onClick={() => handleVote(post.id, 1)}>
      <ThumbsUp className={post.user_vote === 1 ? 'text-green-600' : ''} />
    </button>
    <span>{post.score}</span>
    <Link to={`/post/${post.id}`}>{post.title}</Link>
  </div>
))
```

## Styling

### Tailwind CSS

All styling via utility classes (no component CSS files):
```jsx
<div className="max-w-4xl mx-auto space-y-6">
  <h1 className="text-3xl font-bold text-academic-900">Title</h1>
  <button className="btn btn-primary">Submit</button>
</div>
```

### Custom Classes (index.css)

```css
@layer components {
  .card {
    @apply bg-white rounded-lg border border-academic-200 p-6;
  }
  
  .btn {
    @apply px-4 py-2 rounded-lg font-medium transition-colors;
  }
  
  .btn-primary {
    @apply bg-primary-600 text-white hover:bg-primary-700;
  }
}
```

### Color System

- `academic-50` to `academic-900` — Neutrals
- `primary-600` — Main brand color
- `green-*`, `red-*`, `amber-*` — Status indicators
- Dark mode via `dark:` prefix (toggle in Settings)

## Authentication Flow

### Login Page

```jsx
const [username, setUsername] = useState('')
const [password, setPassword] = useState('')

const handleLogin = async (e) => {
  e.preventDefault()
  const data = await API.login(username, password)
  localStorage.setItem('scholr_current_user', JSON.stringify(data))
  onLogin(data) // Callback to App.jsx
}
```

### OAuth Callback

```jsx
// AuthCallback.jsx
const token = new URLSearchParams(location.search).get('access_token')
const response = await fetch('/api/accounts/oauth/callback/', {
  method: 'POST',
  body: JSON.stringify({ access_token: token })
})
const user = await response.json()
localStorage.setItem('scholr_current_user', JSON.stringify(user))
navigate('/')
```

### Session Persistence

```jsx
useEffect(() => {
  const stored = localStorage.getItem('scholr_current_user')
  if (stored) {
    setCurrentUser(JSON.parse(stored))
  }
}, [])
```

## Key Features

### Feed Filtering (Home.jsx)

```jsx
const [sortBy, setSortBy] = useState('new')
const [filterTopic, setFilterTopic] = useState('all')

const handleSortChange = (newSort) => {
  setSortBy(newSort)
  handleFilterChange({
    sort: newSort,
    topic_id: filterTopic === 'all' ? null : filterTopic
  })
}
```

Backend returns filtered results. No client-side sorting.

### Avatar Upload (Profile.jsx)

```jsx
const handleUploadProfilePicture = async (file) => {
  const path = `${currentUser.id}/${Date.now()}`
  const { data, error } = await supabase.storage
    .from('profile-pictures')
    .upload(path, file)
  
  const url = supabase.storage
    .from('profile-pictures')
    .getPublicUrl(data.path).data.publicUrl
  
  await API.updateUser(currentUser.id, {
    profile_picture: url
  }, authHeaders)
}
```

### Email Reverification (Profile.jsx)

Editing email marks user as `email_verified: false` and downgrades role to General User until they click reverification link.

### Role Switching (Header)

Admin/Developer can switch roles via dropdown (X-Acting-Role header).

### Moderation Dashboard (ModerationReports.jsx)

Shows pending/resolved/rejected reports with target metadata:
- Post reports: show post title + author
- User reports: show reported user + full name

## Environment Variables

Create `.env.local` in `frontend/` (not committed):

```env
VITE_API_URL=http://localhost:8000           # Dev
# or
VITE_API_URL=https://backend.onrender.com    # Prod

VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ0eXAiOiJKV1Q...

VITE_SUPABASE_PROFILE_BUCKET=profile-pictures
```

## Performance Optimizations

### Code Splitting

Each page lazily loaded:
```jsx
const Profile = lazy(() => import('./pages/Profile'))

<Suspense fallback={<Loading />}>
  <Profile />
</Suspense>
```

### Caching Headers (Vercel)

Set in `vercel.json`:
```json
{
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }
      ]
    }
  ]
}
```

Asset hashes ensure new versions bust cache automatically.

### React Query

Prevents duplicate API calls for same query within 2 minutes.

## Debugging

### Check Auth Token

```javascript
console.log(localStorage.getItem('scholr_current_user'))
```

### Test API Call

```javascript
import * as API from './api'
API.fetchPosts(1, { sort: 'new' })
  .then(r => console.log(r))
  .catch(e => console.error(e))
```

### Network Inspector

DevTools → Network tab:
- Filter by `XHR`
- Check request headers (Bearer token)
- Check response status + body

## Common Tasks

### Add a New Page

1. Create `src/pages/NewPage.jsx`
2. Add route in `App.jsx`: `<Route path="/newpage" element={<NewPage /> }`
3. Link from other pages: `<Link to="/newpage">New Page</Link>`

### Add API Endpoint Wrapper

In `src/api.js`:
```javascript
export const myNewEndpoint = (id, data, authHeaders) =>
  request(`/my-endpoint/${id}/`, {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify(data),
  })
```

Use in component:
```javascript
const result = await API.myNewEndpoint(42, {foo: 'bar'}, authHeaders)
```

### Handle Loading States

```jsx
const [isLoading, setIsLoading] = useState(false)

const handleSubmit = async (e) => {
  e.preventDefault()
  setIsLoading(true)
  try {
    await API.doSomething()
  } finally {
    setIsLoading(false)
  }
}

return (
  <button disabled={isLoading}>
    {isLoading ? 'Loading...' : 'Submit'}
  </button>
)
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| 404 errors from API | Check BASE_URL in api.js, VITE_API_URL env var |
| OAuth not working | Verify Supabase URL + anon key match between frontend + backend |
| Redux not found | We use simple state, not Redux |
| Styles not applying | Check Tailwind config includes `src/**` paths |
| Token expired | Log in again (manual refresh not implemented) |

---

**Last Updated:** April 7, 2026
