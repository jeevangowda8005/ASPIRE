import React from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Sparkles, LogOut } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const isActive = (path) => location.pathname === path
  const handleLogout = () => { logout(); navigate('/') }

  return (
    <header className="border-b-3 border-ink bg-cream">
      <div className="bg-ink text-cream text-center text-xs tracking-widest font-semibold py-2 uppercase">
        ASPIRE · Academic Stress Prediction &amp; Intervention Recommendation Engine
      </div>
      <nav className="max-w-7xl mx-auto px-6 md:px-10 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="w-9 h-9 bg-skyBlue border-3 border-ink rounded-xl flex items-center justify-center shadow-brutalSm">
            <Sparkles className="w-5 h-5 text-white" />
          </span>
          <span className="font-display text-xl tracking-tight">ASPIRE</span>
        </Link>
        {user ? (
          <div className="flex items-center gap-2 md:gap-3">
            <Link to="/dashboard" className={`px-4 py-2 rounded-lg font-semibold text-sm border-3 border-ink transition-colors ${isActive('/dashboard') ? 'bg-peach' : 'bg-cream hover:bg-peach/40'}`}>Dashboard</Link>
            <Link to="/assessment" className={`px-4 py-2 rounded-lg font-semibold text-sm border-3 border-ink transition-colors ${isActive('/assessment') ? 'bg-peach' : 'bg-cream hover:bg-peach/40'}`}>New Assessment</Link>
            <Link to="/history" className={`px-4 py-2 rounded-lg font-semibold text-sm border-3 border-ink transition-colors ${isActive('/history') ? 'bg-peach' : 'bg-cream hover:bg-peach/40'}`}>History</Link>
            <div className="hidden md:block w-px h-8 bg-ink mx-1" />
            <div className="text-right hidden md:block leading-tight">
              <div className="text-[10px] uppercase tracking-wide text-ink/60">Hi,</div>
              <div className="font-bold text-sm uppercase">{user.name}</div>
            </div>
            <button onClick={handleLogout} aria-label="Log out" className="w-10 h-10 flex items-center justify-center border-3 border-ink rounded-lg bg-cream hover:bg-rose/40 transition-colors">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Link to="/features" className="hidden md:block font-semibold text-sm hover:underline">Features</Link>
            <Link to="/how-it-works" className="hidden md:block font-semibold text-sm hover:underline">How it works</Link>
            <Link to="/login" className="px-5 py-2.5 rounded-lg font-semibold text-sm border-3 border-ink bg-cream hover:bg-peach/40 transition-colors">Log in</Link>
            <Link to="/register" className="px-5 py-2.5 rounded-lg font-semibold text-sm border-3 border-ink bg-skyBlue text-white shadow-brutalSm hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all">Get started</Link>
          </div>
        )}
      </nav>
    </header>
  )
}
