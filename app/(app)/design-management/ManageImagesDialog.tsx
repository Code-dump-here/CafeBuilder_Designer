'use client'

import { useState } from 'react'
import { designs, type DesignResponse } from '@/lib/api'

interface Props {
  design: DesignResponse
  onClose: () => void
  onChanged: () => void
}

export default function ManageImagesDialog({ design, onClose, onChanged }: Props) {
  const [imageUrl, setImageUrl] = useState('')
  const [adding, setAdding] = useState(false)
  const [removingId, setRemovingId] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleAdd() {
    const url = imageUrl.trim()
    if (!url) { setError('Image URL is required'); return }
    setAdding(true)
    setError(null)
    try {
      await designs.addImage(design.id, url)
      setImageUrl('')
      onChanged()
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to add image')
      setAdding(false)
    }
  }

  async function handleRemove(imageId: number) {
    setRemovingId(imageId)
    try {
      await designs.removeImage(design.id, imageId)
      onChanged()
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to remove image')
      setRemovingId(null)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md rounded-2xl shadow-xl p-6 relative max-h-[80vh] flex flex-col" style={{ backgroundColor: '#fdfbfa' }}>
        <button onClick={onClose} className="absolute top-4 right-4 w-6 h-6 flex items-center justify-center rounded-lg" style={{ color: '#a89888' }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <div className="mb-5">
          <h2 className="text-sm font-medium mb-1" style={{ color: '#2d1e14' }}>Manage Images</h2>
          <p className="text-xs" style={{ color: '#5b483f' }}>{design.title}</p>
        </div>

        {/* Add image */}
        <div className="flex gap-2 mb-4">
          <input
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            placeholder="Paste image URL..."
            className="flex-1 px-3 py-2 rounded-lg border text-sm outline-none"
            style={{ borderColor: '#d4c8be', backgroundColor: 'rgba(212,200,190,0.2)', color: '#2d1e14' }}
          />
          <button
            onClick={handleAdd}
            disabled={adding}
            className="px-4 py-2 rounded-lg text-xs font-semibold text-white disabled:opacity-50 flex-shrink-0"
            style={{ backgroundColor: '#b23f00' }}
          >
            {adding ? '…' : 'Add'}
          </button>
        </div>

        {error && (
          <p className="text-xs rounded-lg px-3 py-2 mb-3" style={{ backgroundColor: '#fee2e2', color: '#991b1b' }}>{error}</p>
        )}

        {/* Image list */}
        <div className="flex-1 overflow-y-auto flex flex-col gap-2">
          {(!design.images || design.images.length === 0) ? (
            <div className="py-10 flex flex-col items-center gap-2" style={{ color: '#a89888' }}>
              <span className="text-2xl">🖼</span>
              <span className="text-xs">No images added yet</span>
            </div>
          ) : design.images.map((img) => (
            <div key={img.id} className="flex items-center gap-3 p-3 rounded-lg border" style={{ borderColor: '#e8ddd6' }}>
              {/* Preview */}
              <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-[#f0ebe5] flex items-center justify-center">
                <img src={img.imageUrl} alt="" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
              </div>
              <span className="flex-1 text-xs truncate" style={{ color: '#5b483f' }}>{img.imageUrl}</span>
              <button
                disabled={removingId === img.id}
                onClick={() => handleRemove(img.id)}
                className="text-xs font-medium disabled:opacity-50 flex-shrink-0"
                style={{ color: '#991b1b' }}
              >
                {removingId === img.id ? '…' : 'Remove'}
              </button>
            </div>
          ))}
        </div>

        <div className="flex justify-end mt-5">
          <button onClick={onClose} className="px-4 py-1.5 rounded-lg border text-xs font-medium" style={{ borderColor: '#d4c8be', color: '#2d1e14' }}>
            Done
          </button>
        </div>
      </div>
    </div>
  )
}
