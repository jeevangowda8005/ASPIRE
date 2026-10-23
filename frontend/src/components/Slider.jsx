import React from 'react'

export default function Slider({ label, min, max, value, onChange, minLabel, maxLabel }) {
  return (
    <div className="mb-8 last:mb-0">
      <label className="block font-semibold text-base mb-3">{label}</label>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-ink/50 font-medium">{minLabel ?? min}</span>
        <span className="px-4 py-1.5 rounded-lg border-3 border-ink bg-peach font-bold text-lg min-w-[3rem] text-center">{value}</span>
        <span className="text-sm text-ink/50 font-medium">{maxLabel ?? max}</span>
      </div>
      <input type="range" min={min} max={max} value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-label={label} aria-valuemin={min} aria-valuemax={max} aria-valuenow={value} />
    </div>
  )
}
