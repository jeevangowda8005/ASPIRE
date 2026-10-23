import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import Navbar from '../components/Navbar'
import { Card, Badge, PrimaryButton } from '../components/UI'
import { assessmentApi } from '../lib/api'

export default function History() {
  const [checkins, setCheckins] = useState([])
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    assessmentApi.history().then((res) => setCheckins(res.data)).finally(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-cream">
      <Navbar />
      <div className="max-w-5xl mx-auto px-6 md:px-10 py-10">
        <Badge color="lilac" className="mb-3">History</Badge>
        <h1 className="font-display text-4xl mb-8">Your check-ins</h1>
        {loading && <p className="text-ink/50">Loading…</p>}
        {!loading && checkins.length === 0 && (
          <Card className="p-10 text-center">
            <p className="text-ink/60 mb-6">No check-ins yet.</p>
            <PrimaryButton as={Link} to="/assessment">Start your first assessment <ArrowRight className="w-4 h-4" /></PrimaryButton>
          </Card>
        )}
        <div className="space-y-4">
          {checkins.map((c) => (
            <Card key={c.id} className="p-6 flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
              <div className="md:w-40 flex-shrink-0">
                <div className="text-xs text-ink/50 font-semibold">
                  {new Date(c.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                </div>
                <div className="text-xs text-ink/40">
                  {new Date(c.created_at).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="font-display text-3xl">{Math.round(c.final_score)}</div>
                <Badge color={c.stress_category === 'Low' ? 'mint' : c.stress_category === 'Moderate' ? 'peach' : 'rose'}>{c.stress_category}</Badge>
              </div>
              <p className="text-sm text-ink/65 flex-1 leading-relaxed">{c.ai_summary}</p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
