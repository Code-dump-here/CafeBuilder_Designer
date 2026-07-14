'use client'

import { useState } from 'react'

// TODO: Wire to BE once a project-detail endpoint exists for providers.
// All data below is mock — replace with real API data when available.
// Fields needed from BE (likely GET /api/project-providers/{id} or GET /api/projects/{id}):
//   projectName, projectCode, status, address, type (new construction / renovation),
//   ownerName, tags (cafeType), description,
//   Brief: style, targetCustomer, budgetRange, mood, businessModel
//   Survey: surveyDate, surveyVersion, surveyStatus
//   Design Scope: per-type status (concept/layout2d/render3d/technicalDrawing)
//   Budget: designFee, constructionEst, contingency, total
//   Team: designerName, projectManager, constructor
//   Timeline: startDate, handoverDate, durationWeeks, currentPhase
//   Sidebar: daysActive, daysRemaining, completionPct, openIssues

/*
const PROJECT = {
  name: 'Old Town Coffee',
  code: 'SCB-2024-001',
  status: 'Brief Submitted',
  urgent: true,
  address: 'Hoan Kiem District, Hanoi',
  type: 'New Construction',
  owner: 'Nguyen Van Minh',
  updated: 'Updated 18/05/2026',
  tags: ['Dine-in', 'Check-in Café', 'Specialty Coffee'],
  description: "Opening a French-Indochinese style café in Hanoi's Old Quarter, approximately 120m² in size...",
}

const SECTIONS = [
  { title: 'Project Info',    rows: [{ label: 'Project Code', value: 'SCB-2024-001' }, ...] },
  { title: 'Brief Summary',   rows: [{ label: 'Style', value: 'French-Indochina' }, ...] },
  { title: 'Site Survey',     rows: [...] },
  { title: 'Design Scope',    rows: [...] },
  { title: 'Budget',          rows: [...] },
  { title: 'Team',            rows: [...] },
  { title: 'Timeline',        rows: [...] },
]

const SIDEBAR_PHASES = [
  { label: 'Brief', status: 'done' },
  { label: 'Site Survey', status: 'done' },
  { label: 'Concept Design', status: 'active' },
  { label: 'Layout 2D', status: 'pending' },
  { label: '3D Render', status: 'pending' },
  { label: 'Technical Drawing', status: 'pending' },
  { label: 'Handover', status: 'pending' },
]

const QUICK_STATS = [
  { label: 'Days Active', value: '47' },
  { label: 'Days Remaining', value: '107' },
  { label: 'Completion', value: '28%' },
  { label: 'Open Issues', value: '3' },
]
*/

const ACTION_BUTTONS = ['Site Visit', 'Brief', 'Design Scope', 'Budget', 'Contractor', 'Progress', 'Export', 'Edit']

export default function OverviewPage() {
  const [activeAction, setActiveAction] = useState('Site Visit')

  return (
    <div className="p-8 max-w-[1400px]">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs mb-5" style={{ color: '#5b483f' }}>
        <span className="hover:underline cursor-pointer">Projects</span>
        <span>/</span>
        <span style={{ color: '#2d1e14' }}>Project Detail</span>
      </nav>

      {/* Action bar */}
      <div className="flex items-center gap-2 mb-8 flex-wrap">
        {ACTION_BUTTONS.map((btn) => (
          <button
            key={btn}
            onClick={() => setActiveAction(btn)}
            className="px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors"
            style={{
              borderColor: activeAction === btn ? 'transparent' : '#d4c8be',
              backgroundColor: activeAction === btn ? '#b23f00' : 'transparent',
              color: activeAction === btn ? '#fff' : '#5b483f',
            }}
          >
            {btn}
          </button>
        ))}
      </div>

      <div className="flex flex-col items-center justify-center py-20 rounded-xl border" style={{ borderColor: '#d4c8be', backgroundColor: '#fdfbfa' }}>
        <div className="text-4xl mb-3">🏗</div>
        <p className="font-medium mb-1" style={{ color: '#1c1008' }}>Project overview coming soon</p>
        <p className="text-sm text-center max-w-xs" style={{ color: '#7a6a5a' }}>
          Waiting for the project detail endpoint to be available on the BE.
        </p>
      </div>
    </div>
  )
}
