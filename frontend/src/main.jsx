import React from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/react'
import App from './App.jsx'
import './index.css'

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 2, // 2 minutes
            gcTime: 1000 * 60 * 10,   // 10 minutes (formerly cacheTime)
        },
    },
})

ReactDOM.createRoot(document.getElementById('app')).render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <App />
            <Analytics />
            <SpeedInsights />
        </QueryClientProvider>
    </React.StrictMode>,
)
