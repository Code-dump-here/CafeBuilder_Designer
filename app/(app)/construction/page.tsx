'use client'

import { useCallback, useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import {
  constructionItems,
  constructionTasks,
  files,
  type ConstructionItemResponse,
  type ConstructionTaskResponse,
  type ProgressStatus,
} from '@/lib/api'

const STATUS_STYLE: Record<ProgressStatus, { bg: string; color: string; label: string }> = {
  pending:     { bg: '#f3f4f6', color: '#6b7280', label: 'Pending' },
  in_progress: { bg: '#fef3c7', color: '#92400e', label: 'In progress' },
  completed:   { bg: '#d1fae5', color: '#065f46', label: 'Completed' },
}

/** Status only moves forward: pending → in_progress → completed. */
function nextStatus(s: ProgressStatus): ProgressStatus | null {
  if (s === 'pending') return 'in_progress'
  if (s === 'in_progress') return 'completed'
  return null
}

export default function ConstructionPage() {
  return (
    <Suspense>
      <ConstructionInner />
    </Suspense>
  )
}

function ConstructionInner() {
  const searchParams = useSearchParams()
  const paramId = searchParams.get('projectWorkingId')
  const projectWorkingId = paramId ? Number(paramId) : null

  const [items, setItems] = useState<ConstructionItemResponse[]>([])
  const [tasksByItem, setTasksByItem] = useState<Record<number, ConstructionTaskResponse[]>>({})
  const [expanded, setExpanded] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState<number | null>(null)
  const [showItemForm, setShowItemForm] = useState(false)
  const [taskFormFor, setTaskFormFor] = useState<number | null>(null)

  const load = useCallback(async () => {
    if (!projectWorkingId) { setLoading(false); return }
    setLoading(true)
    setError(null)
    try {
      const res = await constructionItems.list({ projectWorkingId })
      setItems(res.items)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to load')
    } finally {
      setLoading(false)
    }
  }, [projectWorkingId])

  useEffect(() => { load() }, [load])

  const loadTasks = useCallback(async (itemId: number) => {
    try {
      const res = await constructionTasks.list({ constructionItemId: itemId })
      setTasksByItem((prev) => ({ ...prev, [itemId]: res.items }))
    } catch { /* already logged */ }
  }, [])

  async function toggleExpand(itemId: number) {
    if (expanded === itemId) { setExpanded(null); return }
    setExpanded(itemId)
    if (!tasksByItem[itemId]) await loadTasks(itemId)
  }

  async function advanceItem(item: ConstructionItemResponse) {
    const next = nextStatus(item.status)
    if (!next) return
    setBusy(item.id)
    try {
      await constructionItems.setStatus(item.id, next)
      await load()
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : 'Failed')
    } finally { setBusy(null) }
  }

  async function advanceTask(task: ConstructionTaskResponse) {
    const next = nextStatus(task.status)
    if (!next) return
    setBusy(-task.id)
    try {
      await constructionTasks.setStatus(task.id, next)
      await loadTasks(task.constructionItemId)
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : 'Failed')
    } finally { setBusy(null) }
  }

  // Top-level milestones only; children are nested under their parent.
  const roots = items.filter((i) => i.parentId == null)
  const childrenOf = (id: number) => items.filter((i) => i.parentId === id)

  const done = items.filter((i) => i.status === 'completed').length
  const pct = items.length ? Math.round((done / items.length) * 100) : 0

  return (
    <div className="p-8 max-w-5xl">
      <header className="mb-6 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: '#a89888' }}>Construction</p>
          <h1 className="text-3xl font-bold" style={{ color: '#1c1008' }}>Milestones</h1>
          <p className="text-sm mt-2" style={{ color: '#7a6a5a' }}>
            Track build milestones and the tasks inside them. Requires a confirmed contract.
          </p>
        </div>
        {projectWorkingId && (
          <button
            onClick={() => setShowItemForm(true)}
            className="px-4 py-2 rounded-lg text-sm font-semibold text-white flex-shrink-0"
            style={{ backgroundColor: '#b23f00' }}
          >
            + New milestone
          </button>
        )}
      </header>

      {/* Progress bar */}
      {items.length > 0 && (
        <div className="mb-8">
          <div className="flex justify-between text-xs mb-2">
            <span style={{ color: '#a89888' }}>{done} of {items.length} milestones complete</span>
            <span className="font-semibold" style={{ color: '#b23f00' }}>{pct}%</span>
          </div>
          <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: '#f0ebe5' }}>
            <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: '#b23f00' }} />
          </div>
        </div>
      )}

      {!projectWorkingId ? (
        <Empty icon="🏗" msg="No project selected" sub="Open this page from a project to manage its construction milestones." />
      ) : error ? (
        <div className="flex items-center gap-2 px-4 py-3 rounded-lg text-sm" style={{ backgroundColor: '#fee2e2', color: '#991b1b' }}>
          <span>⚠</span> {error}
          <button onClick={load} className="ml-auto underline text-xs">Retry</button>
        </div>
      ) : loading ? (
        <div className="flex flex-col gap-3">
          {[1, 2, 3].map((i) => <div key={i} className="h-20 rounded-xl animate-pulse" style={{ backgroundColor: '#f0ebe5' }} />)}
        </div>
      ) : roots.length === 0 ? (
        <Empty icon="🏗" msg="No milestones yet" sub="Break the build into milestones, then add tasks inside each one." />
      ) : (
        <div className="flex flex-col gap-3">
          {roots.map((item) => (
            <ItemRow
              key={item.id}
              item={item}
              children={childrenOf(item.id)}
              tasks={tasksByItem[item.id] ?? []}
              expanded={expanded === item.id}
              busy={busy}
              onToggle={() => toggleExpand(item.id)}
              onAdvance={() => advanceItem(item)}
              onAdvanceTask={advanceTask}
              onAddTask={() => setTaskFormFor(item.id)}
            />
          ))}
        </div>
      )}

      {showItemForm && projectWorkingId && (
        <ItemDialog
          projectWorkingId={projectWorkingId}
          onClose={() => setShowItemForm(false)}
          onSaved={() => { setShowItemForm(false); load() }}
        />
      )}

      {taskFormFor != null && (
        <TaskDialog
          constructionItemId={taskFormFor}
          onClose={() => setTaskFormFor(null)}
          onSaved={() => { const id = taskFormFor; setTaskFormFor(null); loadTasks(id) }}
        />
      )}
    </div>
  )
}

function ItemRow({
  item, children, tasks, expanded, busy, onToggle, onAdvance, onAdvanceTask, onAddTask,
}: {
  item: ConstructionItemResponse
  children: ConstructionItemResponse[]
  tasks: ConstructionTaskResponse[]
  expanded: boolean
  busy: number | null
  onToggle: () => void
  onAdvance: () => void
  onAdvanceTask: (t: ConstructionTaskResponse) => void
  onAddTask: () => void
}) {
  const s = STATUS_STYLE[item.status]
  const next = nextStatus(item.status)

  return (
    <div className="rounded-xl border bg-white overflow-hidden" style={{ borderColor: '#e8ddd6' }}>
      <div className="flex items-center gap-3 p-5">
        <button onClick={onToggle} className="flex-1 flex items-center gap-3 text-left min-w-0">
          <svg
            width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#a89888" strokeWidth="2.5" strokeLinecap="round"
            style={{ transform: expanded ? 'rotate(90deg)' : 'none', transition: 'transform 0.15s' }}
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm truncate" style={{ color: '#1c1008' }}>{item.name}</span>
              {item.category && (
                <span className="text-[10px] px-2 py-0.5 rounded-full flex-shrink-0" style={{ backgroundColor: '#f5ede6', color: '#5b483f' }}>
                  {item.category}
                </span>
              )}
            </div>
            {item.description && <p className="text-xs mt-1 truncate" style={{ color: '#7a6a5a' }}>{item.description}</p>}
          </div>
        </button>

        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full flex-shrink-0" style={{ backgroundColor: s.bg, color: s.color }}>
          {s.label}
        </span>

        {item.estimateAt && (
          <span className="text-xs flex-shrink-0 hidden sm:block" style={{ color: '#a89888' }}>
            Due {new Date(item.estimateAt).toLocaleDateString()}
          </span>
        )}

        {next && (
          <button
            onClick={onAdvance}
            disabled={busy === item.id}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white flex-shrink-0 disabled:opacity-50"
            style={{ backgroundColor: '#b23f00' }}
          >
            {busy === item.id ? '…' : next === 'in_progress' ? 'Start' : 'Complete'}
          </button>
        )}
      </div>

      {expanded && (
        <div className="border-t px-5 py-4" style={{ borderColor: '#f0e8e0', backgroundColor: '#fdfbfa' }}>
          {/* Nested milestones */}
          {children.length > 0 && (
            <div className="mb-4">
              <p className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: '#a89888' }}>Sub-milestones</p>
              {children.map((c) => (
                <div key={c.id} className="flex items-center gap-2 py-1.5 text-sm">
                  <span style={{ color: '#2d1e14' }}>{c.name}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full ml-auto" style={{ backgroundColor: STATUS_STYLE[c.status].bg, color: STATUS_STYLE[c.status].color }}>
                    {STATUS_STYLE[c.status].label}
                  </span>
                </div>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between mb-2">
            <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: '#a89888' }}>Tasks</p>
            <button onClick={onAddTask} className="text-xs font-medium hover:underline" style={{ color: '#b23f00' }}>+ Add task</button>
          </div>

          {tasks.length === 0 ? (
            <p className="text-xs py-3" style={{ color: '#a89888' }}>No tasks in this milestone yet.</p>
          ) : (
            <div className="flex flex-col gap-2">
              {tasks.map((t) => {
                const ts = STATUS_STYLE[t.status]
                const tnext = nextStatus(t.status)
                return (
                  <div key={t.id} className="flex items-center gap-3 p-3 rounded-lg border bg-white" style={{ borderColor: '#e8ddd6' }}>
                    {t.imageUrl && (
                      <a href={t.imageUrl} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0" style={{ backgroundColor: '#f0ebe5' }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={t.imageUrl} alt="" className="w-full h-full object-cover" />
                      </a>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate" style={{ color: '#2d1e14' }}>{t.name}</p>
                      {t.description && <p className="text-xs truncate" style={{ color: '#7a6a5a' }}>{t.description}</p>}
                      {t.reason && <p className="text-xs mt-0.5" style={{ color: '#991b1b' }}>Delay: {t.reason}</p>}
                    </div>
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0" style={{ backgroundColor: ts.bg, color: ts.color }}>
                      {ts.label}
                    </span>
                    {tnext && (
                      <button
                        onClick={() => onAdvanceTask(t)}
                        disabled={busy === -t.id}
                        className="text-xs font-semibold flex-shrink-0 disabled:opacity-50 hover:underline"
                        style={{ color: '#b23f00' }}
                      >
                        {busy === -t.id ? '…' : tnext === 'in_progress' ? 'Start' : 'Done'}
                      </button>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function ItemDialog({ projectWorkingId, onClose, onSaved }: { projectWorkingId: number; onClose: () => void; onSaved: () => void }) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')
  const [estimateAt, setEstimateAt] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSave() {
    if (!name.trim()) { setError('Name is required'); return }
    setSaving(true)
    setError(null)
    try {
      const accountId = localStorage.getItem('accountId')
      await constructionItems.create({
        projectWorkingId,
        name: name.trim(),
        description: description.trim() || undefined,
        category: category.trim() || undefined,
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
    <Dialog title="New Milestone" subtitle="A milestone groups related construction work." onClose={onClose}>
      <Field label="Name *" value={name} onChange={setName} placeholder="Demolition & site prep" />
      <Field label="Description" value={description} onChange={setDescription} placeholder="What this milestone covers..." textarea />
      <Field label="Category" value={category} onChange={setCategory} placeholder="Structural, MEP, Finishing..." />
      <Field label="Target Date" value={estimateAt} onChange={setEstimateAt} type="date" />
      {error && <p className="text-xs rounded-lg px-3 py-2 mb-3" style={{ backgroundColor: '#fee2e2', color: '#991b1b' }}>{error}</p>}
      <DialogActions onClose={onClose} onSave={handleSave} saving={saving} />
    </Dialog>
  )
}

function TaskDialog({ constructionItemId, onClose, onSaved }: { constructionItemId: number; onClose: () => void; onSaved: () => void }) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [estimateAt, setEstimateAt] = useState('')
  const [imageUrl, setImageUrl] = useState<string | null>(null)
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
      const res = await files.uploadImage(file, 'construction')
      setImageUrl(res.url)
      setFileName(file.name)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Upload failed')
    } finally { setUploading(false) }
  }

  async function handleSave() {
    if (!name.trim()) { setError('Name is required'); return }
    setSaving(true)
    setError(null)
    try {
      const accountId = localStorage.getItem('accountId')
      await constructionTasks.create({
        constructionItemId,
        name: name.trim(),
        description: description.trim() || undefined,
        imageUrl: imageUrl ?? undefined,
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
    <Dialog title="New Task" subtitle="Work inside this milestone, with an optional site photo." onClose={onClose}>
      <Field label="Name *" value={name} onChange={setName} placeholder="Pour concrete slab" />
      <Field label="Description" value={description} onChange={setDescription} placeholder="Details..." textarea />
      <Field label="Target Date" value={estimateAt} onChange={setEstimateAt} type="date" />
      <label className="block text-[10px] font-medium uppercase tracking-wider mb-1.5" style={{ color: '#5b483f' }}>Site Photo</label>
      <label
        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border-2 border-dashed text-sm font-medium cursor-pointer mb-4 transition-colors hover:border-[#b23f00]"
        style={{ borderColor: '#d4c8be', color: '#5b483f' }}
      >
        <input type="file" accept="image/*" className="hidden" onChange={handleFile} disabled={uploading} />
        {uploading ? 'Uploading…' : fileName ? `✓ ${fileName}` : 'Attach photo'}
      </label>
      {error && <p className="text-xs rounded-lg px-3 py-2 mb-3" style={{ backgroundColor: '#fee2e2', color: '#991b1b' }}>{error}</p>}
      <DialogActions onClose={onClose} onSave={handleSave} saving={saving || uploading} />
    </Dialog>
  )
}

// ── Shared dialog bits ────────────────────────────────────────────────────────

function Dialog({ title, subtitle, onClose, children }: { title: string; subtitle: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md rounded-2xl shadow-xl p-6 relative max-h-[85vh] overflow-y-auto" style={{ backgroundColor: '#fdfbfa' }}>
        <button onClick={onClose} className="absolute top-4 right-4 w-6 h-6 flex items-center justify-center" style={{ color: '#a89888' }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
        <h2 className="text-sm font-medium mb-1" style={{ color: '#2d1e14' }}>{title}</h2>
        <p className="text-xs mb-5" style={{ color: '#5b483f' }}>{subtitle}</p>
        {children}
      </div>
    </div>
  )
}

function Field({ label, value, onChange, placeholder, type, textarea }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string; textarea?: boolean
}) {
  const style = { borderColor: '#d4c8be', backgroundColor: 'rgba(212,200,190,0.2)', color: '#2d1e14' }
  return (
    <div className="mb-4">
      <label className="block text-[10px] font-medium uppercase tracking-wider mb-1.5" style={{ color: '#5b483f' }}>{label}</label>
      {textarea ? (
        <textarea rows={3} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
          className="w-full px-3 py-2 rounded-lg border text-sm outline-none resize-none" style={style} />
      ) : (
        <input type={type ?? 'text'} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
          className="w-full px-3 py-2 rounded-lg border text-sm outline-none" style={style} />
      )}
    </div>
  )
}

function DialogActions({ onClose, onSave, saving }: { onClose: () => void; onSave: () => void; saving: boolean }) {
  return (
    <div className="flex justify-end gap-2">
      <button onClick={onClose} className="px-4 py-1.5 rounded-lg border text-xs font-medium" style={{ borderColor: '#d4c8be', color: '#2d1e14' }}>Cancel</button>
      <button onClick={onSave} disabled={saving} className="px-4 py-1.5 rounded-lg text-xs font-semibold text-white disabled:opacity-50" style={{ backgroundColor: '#b23f00' }}>
        {saving ? 'Saving…' : 'Save'}
      </button>
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
