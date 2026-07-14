'use client'

import { useState } from 'react'
import DefineDrawingTypeDialog from './DefineDrawingTypeDialog'
import UploadDrawingDialog from './UploadDrawingDialog'

const drawings = [
  {
    id: 1,
    code: 'A-001',
    name: 'Floor Plan — Ground Floor',
    type: 'Architecture',
    version: 'V3',
    phase: 'Design Development',
    updatedAt: '2 hours ago',
    tags: ['current', 'reviewed'],
  },
  {
    id: 2,
    code: 'A-002',
    name: 'Elevation — North Facade',
    type: 'Architecture',
    version: 'V2',
    phase: 'Design Development',
    updatedAt: '1 day ago',
    tags: ['pending review'],
  },
  {
    id: 3,
    code: 'I-001',
    name: 'Interior Layout — Seating',
    type: 'Interior',
    version: 'V1',
    phase: 'Concept',
    updatedAt: '3 days ago',
    tags: ['draft'],
  },
  {
    id: 4,
    code: 'M-001',
    name: 'MEP Coordination Plan',
    type: 'MEP',
    version: 'V1',
    phase: 'Design Development',
    updatedAt: '5 days ago',
    tags: ['draft'],
  },
]

const tagColors: Record<string, { bg: string; color: string }> = {
  current: { bg: '#d1fae5', color: '#065f46' },
  reviewed: { bg: '#e0e7ff', color: '#3730a3' },
  'pending review': { bg: '#fef3c7', color: '#92400e' },
  draft: { bg: '#f3f4f6', color: '#6b7280' },
}

export default function DesignManagementPage() {
  const [showDefineType, setShowDefineType] = useState(false)
  const [showUpload, setShowUpload] = useState(false)

  return (
    <div className="p-10 max-w-5xl">
      <header className="mb-8 flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: '#a89888' }}>
            Design Work
          </p>
          <h1 className="text-3xl font-bold" style={{ color: '#1c1008' }}>Design Management</h1>
          <p className="text-sm mt-2" style={{ color: '#7a6a5a' }}>
            Manage, upload, and version-control all design drawings for this project.
          </p>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <button
            onClick={() => setShowDefineType(true)}
            className="px-4 py-2.5 rounded-lg border text-sm font-medium transition-colors hover:bg-black/5"
            style={{ borderColor: '#d4c8be', color: '#1c1008' }}
          >
            Define type
          </button>
          <button
            onClick={() => setShowUpload(true)}
            className="px-4 py-2.5 rounded-lg text-sm font-semibold text-white"
            style={{ backgroundColor: '#b23f00' }}
          >
            + Upload drawing
          </button>
        </div>
      </header>

      {/* Filter bar */}
      <div className="flex gap-3 mb-6">
        <div className="relative flex-1 max-w-xs">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#a89888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Search drawings..."
            className="w-full pl-8 pr-4 py-2.5 rounded-lg border text-sm outline-none"
            style={{ borderColor: '#d4c8be', backgroundColor: '#fff', color: '#1c1008' }}
          />
        </div>
        {['All', 'Architecture', 'Interior', 'MEP', 'Structural'].map((f) => (
          <button
            key={f}
            className="px-3 py-2 rounded-lg border text-xs font-medium transition-colors"
            style={{
              borderColor: f === 'All' ? '#1c1008' : '#d4c8be',
              backgroundColor: f === 'All' ? '#1c1008' : 'transparent',
              color: f === 'All' ? '#fff' : '#7a6a5a',
            }}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="rounded-xl border overflow-hidden" style={{ borderColor: '#e8ddd6' }}>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ backgroundColor: '#f5ede6' }}>
              {['Code', 'Drawing Name', 'Type', 'Phase', 'Version', 'Tags', 'Updated', ''].map((h) => (
                <th key={h} className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider" style={{ color: '#a89888' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y bg-white" style={{ borderColor: '#f0e8e0' }}>
            {drawings.map((d) => (
              <tr key={d.id} className="hover:bg-[#fdf9f7] transition-colors">
                <td className="px-4 py-3 font-mono text-xs font-semibold" style={{ color: '#a89888' }}>{d.code}</td>
                <td className="px-4 py-3 font-medium" style={{ color: '#1c1008' }}>{d.name}</td>
                <td className="px-4 py-3" style={{ color: '#7a6a5a' }}>{d.type}</td>
                <td className="px-4 py-3" style={{ color: '#7a6a5a' }}>{d.phase}</td>
                <td className="px-4 py-3">
                  <span className="px-2 py-0.5 rounded text-xs font-semibold" style={{ backgroundColor: '#f0e8e0', color: '#1c1008' }}>
                    {d.version}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    {d.tags.map((tag) => {
                      const s = tagColors[tag] ?? { bg: '#f3f4f6', color: '#6b7280' }
                      return (
                        <span key={tag} className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ backgroundColor: s.bg, color: s.color }}>
                          {tag}
                        </span>
                      )
                    })}
                  </div>
                </td>
                <td className="px-4 py-3 text-xs whitespace-nowrap" style={{ color: '#a89888' }}>{d.updatedAt}</td>
                <td className="px-4 py-3">
                  <button className="text-xs font-medium underline" style={{ color: '#b23f00' }}>View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Dialogs */}
      {showDefineType && <DefineDrawingTypeDialog onClose={() => setShowDefineType(false)} />}
      {showUpload && <UploadDrawingDialog onClose={() => setShowUpload(false)} />}
    </div>
  )
}
