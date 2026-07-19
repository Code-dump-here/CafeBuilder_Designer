'use client'

import { useRef, useState } from 'react'
import { files, type DesignResponse, type DesignImageResponse } from '@/lib/api'

// Images are now uploaded to GCS via POST /api/designs/{id}/files (multipart form)
// and viewed via GET /api/files/view?objectName=... (the viewUrl field on DesignImageResponse)

interface Props {
  design: DesignResponse
  onClose: () => void
  onChanged: () => void
}

export default function ManageImagesDialog({ design, onClose, onChanged }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [removingId, setRemovingId] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setError(null)
    try {
      await uploadDesignFile(design.id, file)
      onChanged()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  async function handleRemove(imageId: number) {
    setRemovingId(imageId)
    try {
      await removeDesignFile(design.id, imageId)
      onChanged()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to remove')
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
          <h2 className="text-sm font-medium mb-1" style={{ color: '#2d1e14' }}>Manage Files</h2>
          <p className="text-xs" style={{ color: '#5b483f' }}>{design.title}</p>
        </div>

        {/* Upload trigger */}
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif,application/pdf,.doc,.docx,.xls,.xlsx"
          className="hidden"
          onChange={handleFileChange}
        />
        <button
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border-2 border-dashed text-sm font-medium mb-4 disabled:opacity-50 transition-colors hover:border-[#b23f00] hover:text-[#b23f00]"
          style={{ borderColor: '#d4c8be', color: '#5b483f' }}
        >
          {uploading ? (
            <>
              <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
              Uploading…
            </>
          ) : (
            <>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
              Upload file or image
            </>
          )}
        </button>

        {error && (
          <p className="text-xs rounded-lg px-3 py-2 mb-3" style={{ backgroundColor: '#fee2e2', color: '#991b1b' }}>{error}</p>
        )}

        {/* File list */}
        <div className="flex-1 overflow-y-auto flex flex-col gap-2">
          {(!design.images || design.images.length === 0) ? (
            <div className="py-10 flex flex-col items-center gap-2" style={{ color: '#a89888' }}>
              <span className="text-2xl">🖼</span>
              <span className="text-xs">No files uploaded yet</span>
            </div>
          ) : design.images.map((img) => {
            const rich = img as DesignImageResponse
            const displayUrl = rich.viewUrl ?? files.viewUrl(img.imageUrl)
            const isImage = /\.(jpg|jpeg|png|webp|gif)(\?|$)/i.test(img.imageUrl)
            return (
              <div key={img.id} className="flex items-center gap-3 p-3 rounded-lg border" style={{ borderColor: '#e8ddd6' }}>
                <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center" style={{ backgroundColor: '#f0ebe5' }}>
                  {isImage ? (
                    <img src={displayUrl} alt="" className="w-full h-full object-cover" onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#a89888" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                  )}
                </div>
                <a href={displayUrl} target="_blank" rel="noopener noreferrer" className="flex-1 text-xs truncate hover:underline" style={{ color: '#5b483f' }}>
                  {img.imageUrl.split('/').pop() ?? img.imageUrl}
                </a>
                <button
                  disabled={removingId === img.id}
                  onClick={() => handleRemove(img.id)}
                  className="text-xs font-medium disabled:opacity-50 flex-shrink-0"
                  style={{ color: '#991b1b' }}
                >
                  {removingId === img.id ? '…' : 'Remove'}
                </button>
              </div>
            )
          })}
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

// POST /api/designs/{id}/files — multipart upload, stores file on GCS
async function uploadDesignFile(designId: number, file: File) {
  const BASE = 'https://smartcoffeebuilder-be-295284732683.asia-southeast1.run.app/api'
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null
  const form = new FormData()
  form.append('file', file)
  const res = await fetch(`${BASE}/designs/${designId}/files`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: form,
  })
  if (!res.ok) {
    console.error(`[API] POST ${BASE}/designs/${designId}/files failed (${res.status})`, await res.text())
    throw new Error(`Error ${res.status} — check the browser console for details`)
  }
  return res.json()
}

// DELETE /api/designs/{id}/files/{fileId}
async function removeDesignFile(designId: number, fileId: number) {
  const BASE = 'https://smartcoffeebuilder-be-295284732683.asia-southeast1.run.app/api'
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null
  const res = await fetch(`${BASE}/designs/${designId}/files/${fileId}`, {
    method: 'DELETE',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  })
  if (!res.ok && res.status !== 204) {
    console.error(`[API] DELETE ${BASE}/designs/${designId}/files/${fileId} failed (${res.status})`, await res.text())
    throw new Error(`Error ${res.status} — check the browser console for details`)
  }
}
