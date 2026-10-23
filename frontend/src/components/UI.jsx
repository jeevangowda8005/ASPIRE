import React from 'react'

export function Card({ children, className = '' }) {
  return <div className={`border-3 border-ink rounded-2xl bg-white shadow-brutal ${className}`}>{children}</div>
}

export function Badge({ children, color = 'peach', className = '' }) {
  const colors = { peach: 'bg-peach', mint: 'bg-mint', rose: 'bg-rose', lilac: 'bg-lilac', ink: 'bg-ink text-cream', white: 'bg-white' }
  return <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border-3 border-ink text-xs font-bold uppercase tracking-wide ${colors[color]} ${className}`}>{children}</span>
}

export function PriorityBadge({ priority }) {
  const map = { HIGH: 'bg-rose', MEDIUM: 'bg-peach', LOW: 'bg-mint' }
  return <span className={`inline-block px-3 py-1 rounded-full border-3 border-ink text-xs font-bold uppercase tracking-wide ${map[priority] || 'bg-peach'}`}>{priority}</span>
}

export function CategoryBadge({ category }) {
  return <span className="inline-block px-3 py-1 rounded-full border-3 border-ink text-xs font-bold uppercase tracking-wide bg-white">{category}</span>
}

export function PrimaryButton({ children, className = '', as: As = 'button', ...props }) {
  return (
    <As className={`inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-bold border-3 border-ink bg-skyBlue text-white shadow-brutalSm hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed ${className}`} {...props}>
      {children}
    </As>
  )
}

export function SecondaryButton({ children, className = '', as: As = 'button', ...props }) {
  return (
    <As className={`inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-bold border-3 border-ink bg-peach hover:bg-peachDeep transition-colors ${className}`} {...props}>
      {children}
    </As>
  )
}

export function GhostButton({ children, className = '', as: As = 'button', ...props }) {
  return (
    <As className={`inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-bold border-3 border-ink bg-white hover:bg-cream transition-colors ${className}`} {...props}>
      {children}
    </As>
  )
}
