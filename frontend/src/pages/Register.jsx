import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import Navbar from '../components/Navbar'
import { Card, Badge, PrimaryButton } from '../components/UI'
import { useAuth } from '../context/AuthContext'

export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [university, setUniversity] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await register(name, email, password, university)
      navigate('/assessment')
    } catch (err) {
      setError(err.response?.data?.detail || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-cream">
      <Navbar />
      <div className="max-w-6xl mx-auto px-6 md:px-10 py-16 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <Badge color="peach" className="mb-6"><span>✦</span> ASPIRE</Badge>
          <h1 className="font-display text-5xl mb-4">
            Create your <span className="bg-mint px-2 border-3 border-ink inline-block">account</span>.
          </h1>
          <p className="text-lg text-ink/70 mb-8">Free, takes 30 seconds. Your first check-in is just two steps away.</p>
          <div className="grid grid-cols-2 gap-3 max-w-sm">
            <Badge color="peach" className="justify-center py-3">10 quick sliders</Badge>
            <Badge color="rose" className="justify-center py-3">AI-powered analysis</Badge>
            <Badge color="lilac" className="justify-center py-3">Action plan in seconds</Badge>
            <Badge color="mint" className="justify-center py-3">Track week-over-week</Badge>
          </div>
        </div>
        <Card className="p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-2xl">Sign up</h2>
            <Link to="/login" className="text-sm font-semibold underline">Log in</Link>
          </div>
          <form onSubmit={handleSubmit}>
            <label className="block text-xs font-bold uppercase tracking-wide mb-2">Full name</label>
            <input type="text" required value={name} onChange={(e) => setName(e.target.value)}
              placeholder="Full name"
              className="w-full px-4 py-3 mb-5 rounded-lg border-3 border-ink bg-cream focus:bg-white outline-none" />
            <label className="block text-xs font-bold uppercase tracking-wide mb-2">Email</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="you@university.edu"
              className="w-full px-4 py-3 mb-5 rounded-lg border-3 border-ink bg-cream focus:bg-white outline-none" />
            <label className="block text-xs font-bold uppercase tracking-wide mb-2">
              University <span className="text-ink/40 normal-case font-normal">(optional)</span>
            </label>
            <input type="text" value={university} onChange={(e) => setUniversity(e.target.value)}
              placeholder="Your university"
              className="w-full px-4 py-3 mb-5 rounded-lg border-3 border-ink bg-cream focus:bg-white outline-none" />
            <label className="block text-xs font-bold uppercase tracking-wide mb-2">Password</label>
            <input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              className="w-full px-4 py-3 mb-2 rounded-lg border-3 border-ink bg-cream focus:bg-white outline-none" />
            {error && <p className="text-sm text-red-600 font-semibold mb-3 mt-2">{error}</p>}
            <PrimaryButton type="submit" disabled={loading} className="w-full mt-4">
              {loading ? 'Creating account…' : 'Create free account'} <ArrowRight className="w-4 h-4" />
            </PrimaryButton>
          </form>
        </Card>
      </div>
    </div>
  )
}
