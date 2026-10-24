import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ChevronRight } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import Navbar from '../components/Navbar'
import { Card, Badge, PriorityBadge, CategoryBadge, PrimaryButton, GhostButton } from '../components/UI'
import { useAuth } from '../context/AuthContext'
import { assessmentApi } from '../lib/api'

export default function Dashboard() {
  const { user } = useAuth()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadDashboard = async () => {
    setLoading(true)
    setError('')
    try {
      const { data: dashboard } = await assessmentApi.dashboard()
      if (!dashboard || !Array.isArray(dashboard.history)) {
        throw new Error('The dashboard response was incomplete.')
      }
      setData(dashboard)
    } catch (err) {
      const detail = err.response?.data?.detail
      setError(
        typeof detail === 'string'
          ? detail
          : err.message || 'Could not load your dashboard. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDashboard()
  }, [])

  if (loading) return <div className="min-h-screen bg-cream"><Navbar /><div className="max-w-7xl mx-auto px-6 py-20 text-center text-ink/50">Loading your dashboard…</div></div>
  if (error) return (
    <div className="min-h-screen bg-cream">
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 py-20 text-center" role="alert">
        <p className="text-red-600 font-semibold mb-6">{error}</p>
        <GhostButton onClick={loadDashboard}>Try again</GhostButton>
      </div>
    </div>
  )

  if (!data?.latest) {
    return (
      <div className="min-h-screen bg-cream">
        <Navbar />
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-20 text-center">
          <h2 className="font-display text-3xl mb-4">No check-ins yet.</h2>
          <p className="text-ink/60 mb-8">Take your first 90-second assessment to see your dashboard.</p>
          <PrimaryButton as={Link} to="/assessment">Start your assessment <ArrowRight className="w-4 h-4" /></PrimaryButton>
        </div>
      </div>
    )
  }

  const { latest, history, avg_score, delta_since_start, checkin_count } = data
  const driverEntries = Object.entries(latest.top_drivers || {})
  const trendData = history.map((c) => ({
    score: Math.round(c.final_score),
    date: new Date(c.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
  }))

  return (
    <div className="min-h-screen bg-cream">
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <Badge color="lilac" className="mb-3">Your dashboard</Badge>
            <h1 className="font-display text-4xl">Hey, {user?.name?.split(' ')[0]?.toUpperCase()}.</h1>
          </div>
          <PrimaryButton as={Link} to="/assessment">New check-in <ArrowRight className="w-4 h-4" /></PrimaryButton>
        </div>

        {/* Score + Drivers */}
        <div className="grid md:grid-cols-2 gap-6 mb-10">
          <Card className="p-7 relative overflow-hidden">
            <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-peach/70" />
            <div className="relative">
              <div className="text-xs font-bold uppercase tracking-widest text-ink/50 mb-2">Current stress score</div>
              <div className="font-display text-6xl mb-4">
                {Math.round(latest.final_score)}<span className="text-2xl text-ink/40">/100</span>
              </div>
              <div className="flex flex-wrap gap-2 mb-5">
                <Badge color={categoryColor(latest.stress_category)}>{latest.stress_category} stress</Badge>
                {checkin_count > 1 && delta_since_start != null && (
                  <Badge color="white">{delta_since_start <= 0 ? '↘' : '↗'} {Math.abs(delta_since_start).toFixed(1)} since start</Badge>
                )}
                <Badge color="mint">{checkin_count} check-in{checkin_count !== 1 ? 's' : ''}</Badge>
              </div>
              <p className="text-ink/75 leading-relaxed text-[15px]">{latest.ai_summary}</p>
            </div>
          </Card>

          <Card className="p-7">
            <div className="text-xs font-bold uppercase tracking-widest text-ink/50 mb-1">Top stress drivers</div>
            <h3 className="font-display text-2xl mb-6">What's pulling you down</h3>
            <div className="space-y-4">
              {driverEntries.map(([label, value]) => (
                <div key={label}>
                  <div className="flex justify-between text-sm font-semibold mb-1.5"><span>{label}</span></div>
                  <div className="h-6 bg-cream border-3 border-ink rounded-lg overflow-hidden">
                    <div className="h-full bg-skyBlue transition-all duration-500" style={{ width: `${value}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Action Plan */}
        <div className="mb-4">
          <Badge color="rose" className="mb-3">Action plan</Badge>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-2">
            <h2 className="font-display text-3xl">Do these this week</h2>
            <p className="text-sm text-ink/60 max-w-sm md:text-right">Ranked by impact. Pick two. Be honest with yourself about which ones you can actually start tomorrow.</p>
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-6 mb-10 mt-6">
          {latest.recommendations?.map((rec, i) => (
            <Card key={i} className="p-6">
              <div className="flex items-center justify-between mb-4">
                <PriorityBadge priority={rec.priority} />
                <CategoryBadge category={rec.category} />
              </div>
              <h3 className="font-display text-xl mb-2">{rec.title}</h3>
              <p className="text-ink/65 text-sm leading-relaxed mb-4">{rec.description}</p>
              <ul className="space-y-2">
                {rec.action_items.map((item, j) => (
                  <li key={j} className="flex items-start gap-2 text-sm">
                    <ChevronRight className="w-4 h-4 mt-0.5 flex-shrink-0 text-skyBlue" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>

        {/* Trend */}
        {trendData.length > 1 && (
          <Card className="p-7 mb-10">
            <Badge color="lilac" className="mb-3">Trend</Badge>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-display text-2xl">Stress over time</h3>
              <div className="text-sm text-ink/60">Avg <strong className="text-ink">{avg_score}</strong> · Latest <strong className="text-ink">{Math.round(latest.final_score)}</strong></div>
            </div>
            <div className="h-72 mt-6">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#0F0F0F" strokeOpacity={0.1} />
                  <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#0F0F0F99' }} axisLine={{ stroke: '#0F0F0F' }} tickLine={false} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: '#0F0F0F99' }} axisLine={{ stroke: '#0F0F0F' }} tickLine={false} />
                  <Tooltip contentStyle={{ border: '3px solid #0F0F0F', borderRadius: 8, fontFamily: 'Inter' }} />
                  <Line type="monotone" dataKey="score" stroke="#0B5FFF" strokeWidth={3} dot={{ fill: '#0B5FFF', stroke: '#0F0F0F', strokeWidth: 2, r: 5 }} activeDot={{ r: 7 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        )}

        {latest.journal_text && (
          <Card className="p-7 mb-10">
            <Badge color="mint" className="mb-3">Journal sentiment</Badge>
            <h3 className="font-display text-2xl mb-3">What you wrote</h3>
            <p className="text-ink/70 italic mb-4">"{latest.journal_text}"</p>
            <Badge color={sentimentColor(latest.sentiment_label)}>
              {latest.sentiment_label} · compound {latest.sentiment_compound?.toFixed(2)}
            </Badge>
          </Card>
        )}
      </div>
    </div>
  )
}

function categoryColor(c) {
  return c === 'Low' ? 'mint' : c === 'Moderate' ? 'peach' : 'rose'
}
function sentimentColor(l) {
  return l === 'positive' ? 'mint' : l === 'negative' ? 'rose' : 'peach'
}
