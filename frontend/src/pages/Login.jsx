import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import Navbar from '../components/Navbar'
import { Card, Badge, PrimaryButton } from '../components/UI'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.detail || 'Incorrect email or password. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-cream">
      <Navbar />
      <div className="max-w-6xl mx-auto px-6 md:px-10 py-16 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <Badge color="mint" className="mb-6"><span>✦</span> ASPIRE</Badge>
          <h1 className="font-display text-5xl mb-4">
            Welcome <span className="bg-peach px-2 border-3 border-ink inline-block">back</span>.
          </h1>
          <p className="text-lg text-ink/70 mb-8">Pick up where you left off. Your trends, your action plan, your week.</p>
          <div className="grid grid-cols-2 gap-3 max-w-sm">
            <Badge color="peach" className="justify-center py-3">10 quick sliders</Badge>
            <Badge color="rose" className="justify-center py-3">AI-powered analysis</Badge>
            <Badge color="lilac" className="justify-center py-3">Action plan in seconds</Badge>
            <Badge color="mint" className="justify-center py-3">Track week-over-week</Badge>
          </div>
        </div>
        <Card className="p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-2xl">Log in</h2>
            <Link to="/register" className="text-sm font-semibold underline">Sign up</Link>
          </div>
          <form onSubmit={handleSubmit}>
            <label className="block text-xs font-bold uppercase tracking-wide mb-2">Email</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="you@university.edu"
              className="w-full px-4 py-3 mb-5 rounded-lg border-3 border-ink bg-cream focus:bg-white outline-none" />
            <label className="block text-xs font-bold uppercase tracking-wide mb-2">Password</label>
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
              placeholder="Your password"
              className="w-full px-4 py-3 mb-2 rounded-lg border-3 border-ink bg-cream focus:bg-white outline-none" />
            {error && <p className="text-sm text-red-600 font-semibold mb-3 mt-2">{error}</p>}
            <PrimaryButton type="submit" disabled={loading} className="w-full mt-4">
              {loading ? 'Logging in…' : 'Log In'} <ArrowRight className="w-4 h-4" />
            </PrimaryButton>
            <p className="text-xs text-ink/50 mt-4 leading-relaxed">
              By logging in, you agree to use ASPIRE as an educational wellness tool — not a replacement for professional mental health care.
            </p>
          </form>
        </Card>
      </div>
    </div>
  )
}
