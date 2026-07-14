'use client'

import { useState } from 'react'
import { designs, type DesignType } from '@/lib/api'

const DESIGN_TYPES: { value: DesignType; label: string }[] = [
  { value: 'concept',           label: 'Concept' },
  { value: 'layout_2d',         label: 'Layout 2D' },
  { value: 'render_3d',         label: '3D Render' },
  { value: 'technical_drawing', label: 'Technical Drawing' },
]

interface Props {
  projectProviderId: number
  onClose: () => void
  onCreated: () => void
}

export default function CreateDesignDialog({ projectProviderId, onClose, onCreated }: Props) {
  const [title, setTitle] = useState('')
  const [type, setType] = useState<DesignType>('concept')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit() {
    if (!title.trim()) { setError('Title is required'); return }
    setLoading(true)
    setError(null)
    try {
      await designs.create({ projectProviderId, title: title.trim(), type })
      onCreated()
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to create design')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-sm rounded-2xl shadow-xl p-6 relative" style={{ backgroundColor: '#fdfbfa' }}>
        <button onClick={onClose} className="absolute top-4 right-4 w-6 h-6 flex items-center justify-center rounded-lg" style={{ color: '#a89888' }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <div className="mb-5">
          <h2 className="text-sm font-medium mb-1" style={{ color: '#2d1e14' }}>New Design</h2>
          <p className="text-xs leading-relaxed" style={{ color: '#5b483f' }}>
            Create a new design submission for this engagement.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-[10px] font-medium uppercase tracking-wider mb-1.5" style={{ color: '#5b483f' }}>Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Ground Floor Concept"
              className="w-full px-3 py-2 rounded-lg border text-sm outline-none"
              style={{ borderColor: '#d4c8be', backgroundColor: 'rgba(212,200,190,0.2)', color: '#2d1e14' }}
            />
          </div>

          <div>
            <label className="block text-[10px] font-medium uppercase tracking-wider mb-1.5" style={{ color: '#5b483f' }}>Type *</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as DesignType)}
              className="w-full px-3 py-2 rounded-lg border text-sm outline-none bg-white"
              style={{ borderColor: '#d4c8be', color: '#2d1e14' }}
            >
              {DESIGN_TYPES.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>

          {error && (
            <p className="text-xs rounded-lg px-3 py-2" style={{ backgroundColor: '#fee2e2', color: '#991b1b' }}>{error}</p>
          )}
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg border text-xs font-medium"
            style={{ borderColor: '#d4c8be', color: '#2d1e14' }}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-4 py-1.5 rounded-lg text-xs font-medium text-white disabled:opacity-50"
            style={{ backgroundColor: '#b23f00' }}
          >
            {loading ? 'Creating…' : 'Create Design'}
          </button>
        </div>
      </div>
    </div>
  )
}
