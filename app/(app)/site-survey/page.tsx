'use client'

import { useCallback, useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { surveys, files, type SurveyResponse } from '@/lib/api'

export default function SiteSurveyPage() {
  return (
    <Suspense>
      <SiteSurveyInner />
    </Suspense>
  )
}

function SiteSurveyInner() {
  const searchParams = useSearchParams()
  const paramId = searchParams.get('projectWorkingId')
  const projectWorkingId = paramId ? Number(paramId) : null

  const [items, setItems] = useState<SurveyResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)

  const load = useCallback(async () => {
    if (!projectWorkingId) { setLoading(false); return }
    setLoading(true)
    setError(null)
    try {
      const res = await surveys.list({ projectWorkingId })
      setItems(res.items)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to load')
    } finally {
      setLoading(false)
    }
  }, [projectWorkingId])

  useEffect(() => { load() }, [load])

  // Newest version first
  const sorted = [...items].sort((a, b) => b.version - a.version)

  return (
    <div className="p-8 max-w-4xl">
      <header className="mb-8 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: '#a89888' }}>Project Info</p>
          <h1 className="text-3xl font-bold" style={{ color: '#1c1008' }}>Site Survey</h1>
          <p className="text-sm mt-2" style={{ color: '#7a6a5a' }}>
            Record site conditions before the contract is signed. Each submission bumps the version.
          </p>
        </div>
        {projectWorkingId && (
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 rounded-lg text-sm font-semibold text-white flex-shrink-0"
            style={{ backgroundColor: '#b23f00' }}
          >
            + New survey
          </button>
        )}
      </header>

      {!projectWorkingId ? (
        <Empty icon="📐" msg="No project selected" sub="Open this page from a project to record or view its site survey." />
      ) : error ? (
        <div className="flex items-center gap-2 px-4 py-3 rounded-lg text-sm" style={{ backgroundColor: '#fee2e2', color: '#991b1b' }}>
          <span>⚠</span> {error}
          <button onClick={load} className="ml-auto underline text-xs">Retry</button>
        </div>
      ) : loading ? (
        <div className="flex flex-col gap-4">
          {[1, 2].map((i) => <div key={i} className="h-32 rounded-xl animate-pulse" style={{ backgroundColor: '#f0ebe5' }} />)}
        </div>
      ) : sorted.length === 0 ? (
        <Empty icon="📐" msg="No survey recorded yet" sub="Add your first site survey to document existing conditions." />
      ) : (
        <div className="flex flex-col gap-4">
          {sorted.map((s, i) => (
            <div key={s.id} className="rounded-xl border bg-white p-6" style={{ borderColor: '#e8ddd6' }}>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full" style={{ backgroundColor: '#eeded1', color: '#2d1e14' }}>
                  v{s.version.toFixed(1)}
                </span>
                {i === 0 && (
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full" style={{ backgroundColor: '#d1fae5', color: '#065f46' }}>
                    Latest
                  </span>
                )}
                <span className="text-xs ml-auto" style={{ color: '#a89888' }}>
                  {new Date(s.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="text-sm whitespace-pre-wrap leading-relaxed" style={{ color: '#2d1e14' }}>{s.conditionNote}</p>
              {s.reportUrl && (
                <a
                  href={s.reportUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-medium mt-4 hover:underline"
                  style={{ color: '#b23f00' }}
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" />
                  </svg>
                  View report
                </a>
              )}
            </div>
          ))}
        </div>
      )}

      {showForm && projectWorkingId && (
        <SurveyDialog
          projectWorkingId={projectWorkingId}
          onClose={() => setShowForm(false)}
          onSaved={() => { setShowForm(false); load() }}
        />
      )}
    </div>
  )
}

function SurveyDialog({ projectWorkingId, onClose, onSaved }: { projectWorkingId: number; onClose: () => void; onSaved: () => void }) {
  const [note, setNote] = useState('')
  const [reportUrl, setReportUrl] = useState<string | null>(null)
  const [fileName, setFileName] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setError(null)
    try {
      const res = await files.upload(file, 'surveys')
      setReportUrl(res.url)
      setFileName(file.name)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  async function handleSave() {
    if (!note.trim()) { setError('Condition notes are required'); return }
    setSaving(true)
    setError(null)
    try {
      const accountId = localStorage.getItem('accountId')
      await surveys.create({
        projectWorkingId,
        conditionNote: note.trim(),
        reportUrl: reportUrl ?? undefined,
        createdBy: accountId ? Number(accountId) : undefined,
      })
      onSaved()
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to save')
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-lg rounded-2xl shadow-xl p-6 relative" style={{ backgroundColor: '#fdfbfa' }}>
        <button onClick={onClose} className="absolute top-4 right-4 w-6 h-6 flex items-center justify-center" style={{ color: '#a89888' }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <h2 className="text-sm font-medium mb-1" style={{ color: '#2d1e14' }}>New Site Survey</h2>
        <p className="text-xs mb-5" style={{ color: '#5b483f' }}>Version increments automatically per engagement.</p>

        <label className="block text-[10px] font-medium uppercase tracking-wider mb-1.5" style={{ color: '#5b483f' }}>Condition Notes *</label>
        <textarea
          rows={7}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Existing structure, ceiling height, electrical capacity, drainage, natural light, access constraints..."
          className="w-full px-3 py-2 rounded-lg border text-sm outline-none resize-none mb-4"
          style={{ borderColor: '#d4c8be', backgroundColor: 'rgba(212,200,190,0.2)', color: '#2d1e14' }}
        />

        <label className="block text-[10px] font-medium uppercase tracking-wider mb-1.5" style={{ color: '#5b483f' }}>Report File</label>
        <label
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border-2 border-dashed text-sm font-medium cursor-pointer mb-4 transition-colors hover:border-[#b23f00]"
          style={{ borderColor: '#d4c8be', color: '#5b483f' }}
        >
          <input type="file" className="hidden" onChange={handleFile} disabled={uploading} />
          {uploading ? 'Uploading…' : fileName ? `✓ ${fileName}` : 'Attach report (PDF, image, doc)'}
        </label>

        {error && <p className="text-xs rounded-lg px-3 py-2 mb-3" style={{ backgroundColor: '#fee2e2', color: '#991b1b' }}>{error}</p>}

        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-1.5 rounded-lg border text-xs font-medium" style={{ borderColor: '#d4c8be', color: '#2d1e14' }}>Cancel</button>
          <button
            onClick={handleSave}
            disabled={saving || uploading}
            className="px-4 py-1.5 rounded-lg text-xs font-semibold text-white disabled:opacity-50"
            style={{ backgroundColor: '#b23f00' }}
          >
            {saving ? 'Saving…' : 'Save survey'}
          </button>
        </div>
      </div>
    </div>
  )
}

function Empty({ icon, msg, sub }: { icon: string; msg: string; sub: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 rounded-xl border" style={{ borderColor: '#d4c8be', backgroundColor: '#fdfbfa' }}>
      <div className="text-4xl mb-3">{icon}</div>
      <p className="font-medium mb-1" style={{ color: '#1c1008' }}>{msg}</p>
      <p className="text-sm text-center max-w-xs" style={{ color: '#7a6a5a' }}>{sub}</p>
    </div>
  )
}
