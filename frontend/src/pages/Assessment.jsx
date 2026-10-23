import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Sparkles } from 'lucide-react'
import Navbar from '../components/Navbar'
import { Card, Badge, PrimaryButton, GhostButton } from '../components/UI'
import Slider from '../components/Slider'
import { assessmentApi } from '../lib/api'

const TOTAL_STEPS = 5
const initialState = {
  sleep_hours: 7, sleep_quality: 6, workload_intensity: 5, deadlines_count: 2,
  academic_performance: 6, focus_ability: 6, mood: 6, anxiety_level: 5,
  self_esteem: 6, physical_activity_days: 2, social_support: 6, journal_text: '',
}

export default function Assessment() {
  const [step, setStep] = useState(1)
  const [form, setForm] = useState(initialState)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const set = (key) => (val) => setForm((f) => ({ ...f, [key]: val }))
  const next = () => setStep((s) => Math.min(TOTAL_STEPS, s + 1))
  const back = () => setStep((s) => Math.max(1, s - 1))
  const handleSubmit = async () => {
    setSubmitting(true); setError('')
    try { await assessmentApi.submit(form); navigate('/dashboard') }
    catch (err) { setError(err.response?.data?.detail || 'Could not submit. Please try again.'); setSubmitting(false) }
  }
  const progress = (step / TOTAL_STEPS) * 100

  return (
    <div className="min-h-screen bg-cream">
      <Navbar />
      <div className="max-w-3xl mx-auto px-6 md:px-10 py-12">
        <div className="flex items-center justify-between mb-4">
          <Badge color="mint"><Sparkles className="w-3.5 h-3.5" /> New check-in</Badge>
          <span className="text-xs font-bold uppercase tracking-widest text-ink/50">Step {step} of {TOTAL_STEPS}</span>
        </div>
        <div className="h-3 rounded-full border-3 border-ink bg-white overflow-hidden mb-8">
          <div className="h-full bg-skyBlue transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
        <Card className="p-8 md:p-10">
          {step === 1 && <StepSleep form={form} set={set} />}
          {step === 2 && <StepAcademics form={form} set={set} />}
          {step === 3 && <StepMood form={form} set={set} />}
          {step === 4 && <StepLifestyle form={form} set={set} />}
          {step === 5 && <StepJournal form={form} set={set} />}
          {error && <p className="text-sm text-red-600 font-semibold mt-4">{error}</p>}
          <div className="flex items-center justify-between mt-10 pt-6 border-t-3 border-ink">
            <GhostButton onClick={back} disabled={step === 1} className={step === 1 ? 'opacity-40 cursor-not-allowed' : ''}>
              <ArrowLeft className="w-4 h-4" /> Back
            </GhostButton>
            {step < TOTAL_STEPS
              ? <PrimaryButton onClick={next}>Next <ArrowRight className="w-4 h-4" /></PrimaryButton>
              : <PrimaryButton onClick={handleSubmit} disabled={submitting}>
                  {submitting ? 'Scoring…' : 'See my results'} <ArrowRight className="w-4 h-4" />
                </PrimaryButton>
            }
          </div>
        </Card>
        <p className="text-center text-xs text-ink/50 mt-6">
          Your inputs stay in your account. We use them to compute your stress score and personalize recommendations.
        </p>
      </div>
    </div>
  )
}

function StepSleep({ form, set }) {
  return (
    <div>
      <Badge color="lilac" className="mb-4">Sleep</Badge>
      <h2 className="font-display text-3xl mb-8">How's your sleep been?</h2>
      <Slider label="Average hours of sleep per night" min={0} max={12} value={form.sleep_hours} onChange={set('sleep_hours')} minLabel="0 hours" maxLabel="12 hours" />
      <Slider label="Sleep quality (1 = terrible, 10 = great)" min={1} max={10} value={form.sleep_quality} onChange={set('sleep_quality')} />
    </div>
  )
}

function StepAcademics({ form, set }) {
  return (
    <div>
      <Badge color="peach" className="mb-4">Academics</Badge>
      <h2 className="font-display text-3xl mb-8">What does your workload look like?</h2>
      <Slider label="Current workload intensity (1 = light, 10 = crushing)" min={1} max={10} value={form.workload_intensity} onChange={set('workload_intensity')} />
      <Slider label="Deadlines / exams in the next 2 weeks" min={0} max={15} value={form.deadlines_count} onChange={set('deadlines_count')} />
      <Slider label="How you'd rate your recent academic performance (1-10)" min={1} max={10} value={form.academic_performance} onChange={set('academic_performance')} />
      <Slider label="Ability to focus (1 = scattered, 10 = locked in)" min={1} max={10} value={form.focus_ability} onChange={set('focus_ability')} />
    </div>
  )
}

function StepMood({ form, set }) {
  return (
    <div>
      <Badge color="rose" className="mb-4">Mood &amp; Anxiety</Badge>
      <h2 className="font-display text-3xl mb-8">How are you feeling lately?</h2>
      <Slider label="Overall mood this week (1 = low, 10 = great)" min={1} max={10} value={form.mood} onChange={set('mood')} />
      <Slider label="Anxiety level (1 = calm, 10 = on edge)" min={1} max={10} value={form.anxiety_level} onChange={set('anxiety_level')} />
      <Slider label="Self-esteem / confidence right now (1-10)" min={1} max={10} value={form.self_esteem} onChange={set('self_esteem')} />
    </div>
  )
}

function StepLifestyle({ form, set }) {
  return (
    <div>
      <Badge color="mint" className="mb-4">Lifestyle</Badge>
      <h2 className="font-display text-3xl mb-8">Movement &amp; support check</h2>
      <Slider label="Days you were physically active this week" min={0} max={7} value={form.physical_activity_days} onChange={set('physical_activity_days')} minLabel="0 days" maxLabel="7 days" />
      <Slider label="How supported do you feel by friends/family (1-10)" min={1} max={10} value={form.social_support} onChange={set('social_support')} />
    </div>
  )
}

function StepJournal({ form, set }) {
  const wordCount = form.journal_text.trim() ? form.journal_text.trim().split(/\s+/).length : 0
  return (
    <div>
      <Badge color="lilac" className="mb-4">Journal</Badge>
      <h2 className="font-display text-3xl mb-3">Anything on your mind?</h2>
      <p className="text-ink/60 mb-6 text-sm leading-relaxed">Optional — a couple of sentences about how the week has been. We run this through a sentiment model to add nuance your sliders might miss.</p>
      <textarea value={form.journal_text} onChange={(e) => set('journal_text')(e.target.value)} rows={6}
        placeholder="e.g. Felt pretty overwhelmed after the midterm, but my friends helped me decompress this weekend..."
        className="w-full px-4 py-3 rounded-lg border-3 border-ink bg-cream focus:bg-white outline-none resize-none" />
      <div className="text-right text-xs text-ink/40 mt-2">{wordCount} words</div>
    </div>
  )
}
