'use client'

const FILE_FORMATS = ['.pdf', '.dwg', '.png', '.jpg', '.skp', '.fbx']

export default function DefineDrawingTypeDialog({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-sm rounded-2xl shadow-xl p-6 relative" style={{ backgroundColor: '#fdfbfa' }}>
        {/* Close */}
        <button onClick={onClose} className="absolute top-4 right-4 w-6 h-6 flex items-center justify-center rounded-lg" style={{ color: '#a89888' }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* Header */}
        <div className="mb-5">
          <h2 className="text-sm font-medium mb-1" style={{ color: '#2d1e14' }}>Define Drawing Type</h2>
          <p className="text-xs leading-relaxed" style={{ color: '#5b483f' }}>
            Create a new custom drawing type to categorize your design files.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          {/* Type Name */}
          <Field label="Type Name *">
            <input type="text" placeholder="e.g. MEP Coordination Plan" className="input-base" />
          </Field>

          {/* Category + Visibility */}
          <div className="flex gap-3">
            <Field label="Category Group" className="flex-1">
              <select className="input-base bg-white">
                <option>Architecture</option>
                <option>Interior</option>
                <option>Structural</option>
                <option>MEP</option>
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

          {/* Description */}
          <Field label="Description">
            <textarea rows={3} placeholder="Brief description of this drawing type..." className="input-base resize-none" />
          </Field>

          {/* File formats */}
          <div>
            <label className="block text-[10px] font-medium uppercase tracking-wider mb-2" style={{ color: '#5b483f' }}>
              Accepted File Formats
            </label>
            <div className="flex flex-wrap gap-3">
              {FILE_FORMATS.map((fmt) => (
                <label key={fmt} className="flex items-center gap-1.5 text-xs cursor-pointer" style={{ color: '#2d1e14' }}>
                  <input type="checkbox" defaultChecked={['pdf', 'dwg', 'png'].includes(fmt.slice(1))} className="accent-[#b23f00]" />
                  {fmt}
                </label>
              ))}
            </div>
          </div>

          {/* Required checkbox */}
          <label className="flex items-center gap-2 text-xs cursor-pointer" style={{ color: '#2d1e14' }}>
            <input type="checkbox" className="w-3.5 h-3.5 rounded border" style={{ accentColor: '#b23f00' }} />
            Required drawing type for project delivery
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
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Create Type
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
