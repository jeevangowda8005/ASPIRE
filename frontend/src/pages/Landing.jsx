import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Brain, Target, HeartPulse, TrendingUp, Clock, Compass, BookOpen } from 'lucide-react'
import Navbar from '../components/Navbar'
import { Card, Badge, PrimaryButton, SecondaryButton } from '../components/UI'

const FEATURES = [
  { icon: Brain, iconBg: 'bg-rose', title: 'Hybrid AI scoring', desc: 'Rule-based weights + ML ensemble analysis blend into one trustworthy number.' },
  { icon: Target, iconBg: 'bg-rose', title: 'Top stress drivers', desc: 'Surface the 4 factors hurting you most this week — sleep, workload, mood, more.' },
  { icon: HeartPulse, iconBg: 'bg-lilac', title: 'Actionable interventions', desc: 'Get 4-6 concrete micro-actions tailored to your data, prioritized by impact.' },
  { icon: TrendingUp, iconBg: 'bg-mint', title: 'Trend tracking', desc: "Watch stress curves over time. Confirm what's working. Drop what isn't." },
  { icon: Clock, iconBg: 'bg-peach', title: 'Sub-90 second check-in', desc: 'Ten quick sliders. Designed to be done between lectures, not on a retreat.' },
  { icon: Compass, iconBg: 'bg-rose', title: 'Student-first design', desc: 'Built around real student rhythms: deadlines, exams, group projects, sleep debt.' },
]

const STEPS = [
  { n: '01', title: 'Check in', desc: 'Answer quick sliders about sleep, workload, mood, deadlines, and movement.', color: 'bg-mint' },
  { n: '02', title: 'Get scored', desc: 'We compute a rule-based score and an ML ensemble analysis, then blend them.', color: 'bg-peach' },
  { n: '03', title: 'Act this week', desc: 'Personalized, prioritized micro-actions show up on your dashboard. Tackle two.', color: 'bg-rose' },
]

export default function Landing() {
  return (
    <div className="min-h-screen bg-cream">
      <Navbar />
      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 md:px-10 pt-16 pb-20 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <Badge color="white" className="mb-6">
            <span className="w-2 h-2 rounded-full bg-skyBlue inline-block" />
            For students, by people who survived finals
          </Badge>
          <h1 className="font-display text-5xl md:text-6xl leading-[1.05] mb-6">
            Predict your{' '}
            <span className="bg-peach px-2 border-3 border-ink inline-block rotate-[-0.5deg]">stress</span>{' '}
            before it predicts{' '}
            <span className="underline decoration-skyBlue decoration-4 underline-offset-4">your grades</span>.
          </h1>
          <p className="text-lg text-ink/70 mb-8 max-w-lg leading-relaxed">
            ASPIRE blends a research-grade questionnaire with an AI wellness analyst to score your academic stress and hand you a short list of things to actually <strong className="text-ink">do</strong> this week.
          </p>
          <div className="flex flex-wrap gap-3 mb-10">
            <PrimaryButton as={Link} to="/register">Start your assessment <ArrowRight className="w-4 h-4" /></PrimaryButton>
            <SecondaryButton as="a" href="#how-it-works">How it works</SecondaryButton>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex -space-x-3">
              {['bg-mint', 'bg-peach', 'bg-rose', 'bg-lilac'].map((c, i) => (
                <span key={i} className={`w-9 h-9 rounded-full border-3 border-ink ${c}`} />
              ))}
            </div>
            <div className="text-sm">
              <div className="font-bold">Built for student wellbeing</div>
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="absolute -inset-3 bg-lilac border-3 border-ink rounded-3xl -z-10 rotate-2" />
          <Card className="overflow-hidden">
            <div className="aspect-[4/3] overflow-hidden">
              <img
                src="/images/hero-student.jpg"
                alt="Student focused on studying"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-5 border-t-3 border-ink bg-white flex items-center justify-between">
              <div>
                <div className="text-xs uppercase tracking-wide text-ink/50 font-semibold">Stress score</div>
                <div className="font-display text-3xl">42<span className="text-base text-ink/50">/100</span></div>
              </div>
              <Badge color="peach">Moderate · -8 since last week</Badge>
            </div>
          </Card>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="max-w-7xl mx-auto px-6 md:px-10 py-16">
        <Badge color="mint" className="mb-4">Why ASPIRE</Badge>
        <h2 className="font-display text-4xl mb-10 max-w-2xl">Everything you need, nothing you don't.</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {FEATURES.map((f) => (
            <Card key={f.title} className="p-6">
              <div className={`w-12 h-12 rounded-xl border-3 border-ink ${f.iconBg} flex items-center justify-center mb-4`}>
                <f.icon className="w-6 h-6 text-ink" strokeWidth={2} />
              </div>
              <h3 className="font-display text-lg mb-2">{f.title}</h3>
              <p className="text-ink/65 text-sm leading-relaxed">{f.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-6 md:px-10 py-16">
        <Badge color="lilac" className="mb-4">How it works</Badge>
        <h2 className="font-display text-4xl mb-10">
          Three steps.{' '}
          <span className="bg-rose px-2 border-3 border-ink inline-block rotate-[0.5deg]">No clinical jargon.</span>
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {STEPS.map((s) => (
            <Card key={s.n} className="p-6 relative overflow-hidden">
              <div className={`absolute -top-6 -right-6 w-24 h-24 rounded-full ${s.color} opacity-90`} />
              <div className="relative">
                <div className="font-display text-4xl mb-3">{s.n}</div>
                <h3 className="font-display text-xl mb-2">{s.title}</h3>
                <p className="text-ink/65 text-sm leading-relaxed">{s.desc}</p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-6 md:px-10 pb-20">
        <div className="border-3 border-ink rounded-2xl bg-skyBlue text-white p-10 md:p-14 relative overflow-hidden shadow-brutalLg">
          <div className="absolute -top-10 -right-10 w-56 h-56 rounded-full bg-peach/90" />
          <div className="relative max-w-xl">
            <BookOpen className="w-9 h-9 mb-5" />
            <h2 className="font-display text-3xl md:text-4xl mb-4 leading-tight">Stop white-knuckling the semester.</h2>
            <p className="text-white/85 mb-8 leading-relaxed">Take your first assessment in 90 seconds and get an action plan that actually fits this week.</p>
            <div className="flex flex-wrap gap-3">
              <SecondaryButton as={Link} to="/register">Create free account <ArrowRight className="w-4 h-4" /></SecondaryButton>
              <Link to="/login" className="inline-flex items-center px-6 py-3 rounded-lg font-bold border-3 border-white text-white hover:bg-white/10 transition-colors">Log in</Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t-3 border-ink py-8 text-center text-sm text-ink/50">
        ASPIRE — Academic Stress Prediction &amp; Intervention Recommendation Engine. An educational wellness tool, not a replacement for professional mental health care.
      </footer>
    </div>
  )
}
