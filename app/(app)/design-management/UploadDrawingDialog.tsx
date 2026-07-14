'use client'

import { useState } from 'react'

export default function UploadDrawingDialog({ onClose }: { onClose: () => void }) {
  const [tags, setTags] = useState<string[]>(['floor plan'])
  const [tagInput, setTagInput] = useState('')

  const addTag = () => {
    const t = tagInput.trim()
    if (t && !tags.includes(t)) setTags([...tags, t])
    setTagInput('')
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-sm rounded-2xl shadow-xl p-6 relative max-h-[90vh] overflow-y-auto" style={{ backgroundColor: '#fdfbfa' }}>
        {/* Close */}
        <button onClick={onClose} className="absolute top-4 right-4 w-6 h-6 flex items-center justify-center rounded-lg" style={{ color: '#a89888' }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* Header */}
        <div className="mb-5">
          <h2 className="text-sm font-medium mb-1" style={{ color: '#2d1e14' }}>Upload Drawing</h2>
          <p className="text-xs leading-relaxed" style={{ color: '#5b483f' }}>
            Upload a new drawing file. It will be created as a new V1 or appended to an existing drawing.
          </p>
        </div>

        {/* Drop zone */}
        <div
          className="rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-2 py-8 mb-5 cursor-pointer"
          style={{ borderColor: '#b23f00' }}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#b23f00" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
          <p className="text-xs font-medium" style={{ color: '#2d1e14' }}>Drag & drop or click to select a file</p>
          <p className="text-[10px]" style={{ color: '#5b483f' }}>PDF, DWG, PNG, JPG, SKP, FBX · Max 50MB</p>
        </div>

        <div className="flex flex-col gap-4">
          {/* Name + Code */}
          <div className="flex gap-3">
            <Field label="Drawing Name *" className="flex-1">
              <input type="text" placeholder="Floor Plan — GF" className="input-base" />
            </Field>
            <Field label="Drawing Code *" className="flex-1">
              <input type="text" placeholder="A-001" className="input-base" />
            </Field>
          </div>

          {/* Type + Version */}
          <div className="flex gap-3">
            <Field label="Drawing Type *" className="flex-1">
              <select className="input-base bg-white">
                <option>Architecture</option>
                <option>Interior</option>
                <option>MEP</option>
                <option>Structural</option>
              </select>
            </Field>
            <Field label="Version Label" className="flex-1">
              <input type="text" placeholder="V1" className="input-base" />
            </Field>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-[10px] font-medium uppercase tracking-wider mb-1.5" style={{ color: '#5b483f' }}>Tags</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addTag()}
                placeholder="Add a tag..."
                className="input-base flex-1"
              />
              <button onClick={addTag} className="px-3 py-1.5 rounded-lg border text-xs font-medium" style={{ borderColor: '#d4c8be', color: '#2d1e14' }}>
                Add
              </button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {tags.map((t) => (
                  <span key={t} className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs" style={{ backgroundColor: '#f0e8e0', color: '#1c1008' }}>
                    {t}
                    <button onClick={() => setTags(tags.filter((x) => x !== t))} className="opacity-50 hover:opacity-100">×</button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Description */}
          <Field label="Description">
            <textarea rows={3} placeholder="Brief description of this drawing..." className="input-base resize-none" />
          </Field>

          {/* Phase + Visibility */}
          <div className="flex gap-3">
            <Field label="Project Phase" className="flex-1">
              <select className="input-base bg-white">
                <option>Concept</option>
                <option>Design Development</option>
                <option>Technical Drawings</option>
                <option>Construction</option>
              </select>
            </Field>
            <Field label="Visibility" className="flex-1">
              <select className="input-base bg-white">
                <option>All team</option>
                <option>Designer only</option>
                <option>Private</option>
              </select>
            </Field>
          </div>

          {/* Current version */}
          <label className="flex items-center gap-2 text-xs cursor-pointer" style={{ color: '#2d1e14' }}>
            <input type="checkbox" defaultChecked className="w-3.5 h-3.5 rounded" style={{ accentColor: '#b23f00' }} />
            Mark as current version
          </label>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg border text-xs font-medium"
            style={{ borderColor: '#d4c8be', color: '#2d1e14' }}
          >
            Cancel
          </button>
          <button
            className="px-4 py-1.5 rounded-lg text-xs font-medium text-white flex items-center gap-1.5"
            style={{ backgroundColor: '#b23f00' }}
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            Upload Drawing
          </button>
        </div>

        <style>{`.input-base { width: 100%; padding: 6px 10px; border-radius: 8px; border: 1px solid #d4c8be; background: rgba(212,200,190,0.2); font-size: 12px; color: #2d1e14; outline: none; }`}</style>
      </div>
    </div>
  )
}

function Field({ label, children, className = '' }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={className}>
      <label className="block text-[10px] font-medium uppercase tracking-wider mb-1.5" style={{ color: '#5b483f' }}>{label}</label>
      {children}
    </div>
  )
}
