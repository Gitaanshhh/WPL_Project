import React from 'react';
import {
    Bar,
    BarChart,
    CartesianGrid,
    Legend,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';

const RANGE_OPTIONS = [
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
];

const SERIES = [
    { dataKey: 'visits', fill: '#0ea5e9', name: 'Visits' },
    { dataKey: 'logins', fill: '#10b981', name: 'Logins' },
    { dataKey: 'posts', fill: '#f59e0b', name: 'Claims Posted' },
    { dataKey: 'votes', fill: '#f43f5e', name: 'Votes' },
    { dataKey: 'evidence_reviews', fill: '#8b5cf6', name: 'Evidence Reviews' },
];

function formatXAxisLabel(value, range) {
    if (!value) return '';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;

    if (range === 'daily') {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    }
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
}

export default function LineChartCard({ data, range, onRangeChange }) {
    return (
        <section className="rounded-2xl border border-academic-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-5 shadow-sm">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-lg font-semibold text-academic-900 dark:text-slate-100">Intellectual Activity Over Time</h2>
                    <p className="text-sm text-academic-600 dark:text-slate-300">Evidence-backed participation trends, not vanity traffic.</p>
                </div>
                <div className="inline-flex rounded-xl border border-academic-200 dark:border-slate-700 p-1 bg-academic-50 dark:bg-slate-800">
                    {RANGE_OPTIONS.map((option) => (
                        <button
                            key={option.value}
                            onClick={() => onRangeChange(option.value)}
                            className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                                range === option.value
                                    ? 'bg-white dark:bg-slate-700 text-academic-900 dark:text-slate-100 shadow-sm'
                                    : 'text-academic-600 dark:text-slate-300 hover:text-academic-900 dark:hover:text-slate-100'
                            }`}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="mt-5 h-90">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 4 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.25)" />
                        <XAxis
                            dataKey="date"
                            tick={{ fill: '#64748b', fontSize: 12 }}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) => formatXAxisLabel(value, range)}
                        />
                        <YAxis allowDecimals={false} tick={{ fill: '#64748b', fontSize: 12 }} tickLine={false} axisLine={false} />
                        <Tooltip
                            contentStyle={{ borderRadius: 12, border: '1px solid rgba(148, 163, 184, 0.3)' }}
                            labelStyle={{ fontWeight: 600 }}
                            labelFormatter={(value) => formatXAxisLabel(value, range)}
                        />
                        <Legend />
                        {SERIES.map((bar) => (
                            <Bar
                                key={bar.dataKey}
                                dataKey={bar.dataKey}
                                fill={bar.fill}
                                name={bar.name}
                                radius={[4, 4, 0, 0]}
                                maxBarSize={24}
                            />
                        ))}
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </section>
    );
}
