'use client'

import { useCallback, useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import {
  issues,
  issueTypes,
  files,
  type IssueResponse,
  type IssueTypeResponse,
  type ProgressStatus,
} from '@/lib/api'

const STATUS_STYLE: Record<ProgressStatus, { bg: string; color: string; label: string }> = {
  pending:     { bg: '#fee2e2', color: '#991b1b', label: 'Open' },
  in_progress: { bg: '#fef3c7', color: '#92400e', label: 'Resolving' },
  completed:   { bg: '#d1fae5', color: '#065f46', label: 'Resolved' },
}

function nextStatus(s: ProgressStatus): ProgressStatus | null {
  if (s === 'pending') return 'in_progress'
  if (s === 'in_progress') return 'completed'
  return null
}

export default function IssuesPage() {
  return (
    <Suspense>
      <IssuesInner />
    </Suspense>
  )
}

function IssuesInner() {
  const searchParams = useSearchParams()
  const paramId = searchParams.get('projectWorkingId')
  const projectWorkingId = paramId ? Number(paramId) : null

  const [list, setList] = useState<IssueResponse[]>([])
  const [types, setTypes] = useState<IssueTypeResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState<number | null>(null)
  const [showForm, setShowForm] = useState(false)

  const load = useCallback(async () => {
    if (!projectWorkingId) { setLoading(false); return }
    setLoading(true)
    setError(null)
    try {
      const res = await issues.list({ projectWorkingId })
      setList(res.items)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to load')
    } finally {
      setLoading(false)
    }
  }, [projectWorkingId])

  useEffect(() => { load() }, [load])
  useEffect(() => { issueTypes.list().then(setTypes).catch(() => {}) }, [])

  async function advance(issue: IssueResponse) {
    const next = nextStatus(issue.status)
    if (!next) return
    setBusy(issue.id)
    try {
      await issues.setStatus(issue.id, next)
      await load()
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : 'Failed')
    } finally { setBusy(null) }
  }

  const open = list.filter((i) => i.status !== 'completed').length

  return (
    <div className="p-8 max-w-4xl">
      <header className="mb-6 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: '#a89888' }}>Construction</p>
          <h1 className="text-3xl font-bold" style={{ color: '#1c1008' }}>Issues</h1>
          <p className="text-sm mt-2" style={{ color: '#7a6a5a' }}>
            Problems found during work — cause, solution, and resolution photos.
          </p>
        </div>
        {projectWorkingId && (
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 rounded-lg text-sm font-semibold text-white flex-shrink-0"
            style={{ backgroundColor: '#b23f00' }}
          >
            + Report issue
          </button>
        )}
      </header>

      {list.length > 0 && (
        <p className="text-sm mb-5" style={{ color: '#a89888' }}>
          {open} open · {list.length - open} resolved
        </p>
      )}

      {!projectWorkingId ? (
        <Empty icon="⚠️" msg="No project selected" sub="Open this page from a project to see its issues." />
      ) : error ? (
        <div className="flex items-center gap-2 px-4 py-3 rounded-lg text-sm" style={{ backgroundColor: '#fee2e2', color: '#991b1b' }}>
          <span>⚠</span> {error}
          <button onClick={load} className="ml-auto underline text-xs">Retry</button>
        </div>
      ) : loading ? (
        <div className="flex flex-col gap-3">
          {[1, 2].map((i) => <div key={i} className="h-28 rounded-xl animate-pulse" style={{ backgroundColor: '#f0ebe5' }} />)}
        </div>
      ) : list.length === 0 ? (
        <Empty icon="✅" msg="No issues reported" sub="Nothing is blocking this project right now." />
      ) : (
        <div className="flex flex-col gap-3">
          {list.map((issue) => {
            const s = STATUS_STYLE[issue.status]
            const next = nextStatus(issue.status)
            return (
              <div key={issue.id} className="rounded-xl border bg-white p-5" style={{ borderColor: '#e8ddd6' }}>
                <div className="flex items-center gap-3 mb-3">
                  <span className="font-semibold text-sm" style={{ color: '#1c1008' }}>
                    {issue.issueTypeName ?? `Issue #${issue.id}`}
                  </span>
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full" style={{ backgroundColor: s.bg, color: s.color }}>
                    {s.label}
                  </span>
                  <span className="text-xs ml-auto" style={{ color: '#a89888' }}>
                    {new Date(issue.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex flex-col gap-1.5 text-sm">
                  {issue.cause && <Row label="Cause" value={issue.cause} />}
                  {issue.reason && <Row label="Reason" value={issue.reason} />}
                  {issue.solution && <Row label="Solution" value={issue.solution} />}
                  {issue.estimateAt && <Row label="Target" value={new Date(issue.estimateAt).toLocaleDateString()} />}
                </div>

                {(issue.issueImage || issue.confirmImage) && (
                  <div className="flex gap-2 mt-3">
                    {issue.issueImage && <Thumb url={issue.issueImage} label="Issue" />}
                    {issue.confirmImage && <Thumb url={issue.confirmImage} label="Confirmed" />}
                  </div>
                )}

                {next && (
                  <div className="flex justify-end mt-4">
                    <button
                      onClick={() => advance(issue)}
                      disabled={busy === issue.id}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white disabled:opacity-50"
                      style={{ backgroundColor: '#b23f00' }}
                    >
                      {busy === issue.id ? '…' : next === 'in_progress' ? 'Start resolving' : 'Mark resolved'}
                    </button>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {showForm && projectWorkingId && (
        <IssueDialog
          projectWorkingId={projectWorkingId}
          types={types}
          onClose={() => setShowForm(false)}
          onSaved={() => { setShowForm(false); load() }}
        />
      )}
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-3">
      <span className="w-20 flex-shrink-0" style={{ color: '#a89888' }}>{label}</span>
      <span style={{ color: '#2d1e14' }}>{value}</span>
    </div>
  )
}

function Thumb({ url, label }: { url: string; label: string }) {
  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className="flex flex-col gap-1">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={url} alt={label} className="w-16 h-16 rounded-lg object-cover border" style={{ borderColor: '#e8ddd6' }} />
      <span className="text-[10px] text-center" style={{ color: '#a89888' }}>{label}</span>
    </a>
  )
}

function IssueDialog({ projectWorkingId, types, onClose, onSaved }: {
  projectWorkingId: number
  types: IssueTypeResponse[]
  onClose: () => void
  onSaved: () => void
}) {
  const [issueTypeId, setIssueTypeId] = useState<number | ''>('')
  const [cause, setCause] = useState('')
  const [reason, setReason] = useState('')
  const [solution, setSolution] = useState('')
  const [estimateAt, setEstimateAt] = useState('')
  const [issueImage, setIssueImage] = useState<string | null>(null)
  const [fileName, setFileName] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const inputStyle = { borderColor: '#d4c8be', backgroundColor: 'rgba(212,200,190,0.2)', color: '#2d1e14' }

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setError(null)
    try {
      const res = await files.uploadImage(file, 'issues')
      setIssueImage(res.url)
      setFileName(file.name)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Upload failed')
    } finally { setUploading(false) }
  }

  async function handleSave() {
    if (!issueTypeId) { setError('Issue type is required'); return }
    setSaving(true)
    setError(null)
    try {
      const accountId = localStorage.getItem('accountId')
      await issues.create({
        projectWorkingId,
        issueTypeId: Number(issueTypeId),
        cause: cause.trim() || undefined,
        reason: reason.trim() || undefined,
        solution: solution.trim() || undefined,
        issueImage: issueImage ?? undefined,
        estimateAt: estimateAt || undefined,
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
      <div className="w-full max-w-md rounded-2xl shadow-xl p-6 relative max-h-[85vh] overflow-y-auto" style={{ backgroundColor: '#fdfbfa' }}>
        <button onClick={onClose} className="absolute top-4 right-4 w-6 h-6 flex items-center justify-center" style={{ color: '#a89888' }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <h2 className="text-sm font-medium mb-1" style={{ color: '#2d1e14' }}>Report Issue</h2>
        <p className="text-xs mb-5" style={{ color: '#5b483f' }}>Document a problem found during work.</p>

        <div className="mb-4">
          <label className="block text-[10px] font-medium uppercase tracking-wider mb-1.5" style={{ color: '#5b483f' }}>Issue Type *</label>
          <select
            value={issueTypeId}
            onChange={(e) => setIssueTypeId(e.target.value ? Number(e.target.value) : '')}
            className="w-full px-3 py-2 rounded-lg border text-sm outline-none"
            style={inputStyle}
          >
            <option value="">Select a type…</option>
            {types.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
        </div>

        <TextField label="Cause" value={cause} onChange={setCause} placeholder="What caused this?" textarea />
        <TextField label="Reason / Impact" value={reason} onChange={setReason} placeholder="Effect on the build..." textarea />
        <TextField label="Proposed Solution" value={solution} onChange={setSolution} placeholder="How it will be fixed..." textarea />
        <TextField label="Target Resolution Date" value={estimateAt} onChange={setEstimateAt} type="date" />

        <label className="block text-[10px] font-medium uppercase tracking-wider mb-1.5" style={{ color: '#5b483f' }}>Issue Photo</label>
        <label
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border-2 border-dashed text-sm font-medium cursor-pointer mb-4 transition-colors hover:border-[#b23f00]"
          style={{ borderColor: '#d4c8be', color: '#5b483f' }}
        >
          <input type="file" accept="image/*" className="hidden" onChange={handleFile} disabled={uploading} />
          {uploading ? 'Uploading…' : fileName ? `✓ ${fileName}` : 'Attach photo'}
        </label>

        {error && <p className="text-xs rounded-lg px-3 py-2 mb-3" style={{ backgroundColor: '#fee2e2', color: '#991b1b' }}>{error}</p>}

        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-1.5 rounded-lg border text-xs font-medium" style={{ borderColor: '#d4c8be', color: '#2d1e14' }}>Cancel</button>
          <button onClick={handleSave} disabled={saving || uploading} className="px-4 py-1.5 rounded-lg text-xs font-semibold text-white disabled:opacity-50" style={{ backgroundColor: '#b23f00' }}>
            {saving ? 'Saving…' : 'Report issue'}
          </button>
        </div>
      </div>
    </div>
  )
}

function TextField({ label, value, onChange, placeholder, type, textarea }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string; textarea?: boolean
}) {
  const style = { borderColor: '#d4c8be', backgroundColor: 'rgba(212,200,190,0.2)', color: '#2d1e14' }
  return (
    <div className="mb-4">
      <label className="block text-[10px] font-medium uppercase tracking-wider mb-1.5" style={{ color: '#5b483f' }}>{label}</label>
      {textarea ? (
        <textarea rows={2} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
          className="w-full px-3 py-2 rounded-lg border text-sm outline-none resize-none" style={style} />
      ) : (
        <input type={type ?? 'text'} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
          className="w-full px-3 py-2 rounded-lg border text-sm outline-none" style={style} />
      )}
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
