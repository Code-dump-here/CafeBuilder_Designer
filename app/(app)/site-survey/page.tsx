'use client'

import { useState } from 'react'

// TODO: Wire to BE once a site-survey endpoint exists for providers.
// All field data below is mock — replace with real API data when available.
// Fields needed from BE (endpoint TBD, likely GET /api/site-surveys?projectProviderId=):
//   Overview: surveyDate, surveyorName, version, purpose, briefSummary, ownerExpectations[]
//   Size: totalFloorArea, groundFloor, 2ndFloor, 3rdFloor, ceilingHeights, frontageWidth, buildingDepth
//   Structure: frameType, loadBearingWalls, staircase, mezzaninePossibility, renovationConstraint, facadeMaterial
//   Electricity: currentCapacity, panelLocation, upgradeRequired, estimatedCost, emergencyLighting
//   (Drainage, Lighting, Front, Traffic flow, Limitation, Photos, Notes, Comparison — all TBD fields)

const TABS = [
  'Overview', 'Size', 'Structure', 'Electricity', 'Drainage',
  'Lighting', 'Front', 'Traffic flow', 'Limitation',
  'Current situation photo', 'Notes', 'Comparison', 'Confirmation required',
]

/*
const OVERVIEW_CARD = {
  title: 'Survey Overview',
  status: 'In Progress',
  meta: [
    { icon: '📅', text: 'Survey date: 10/06/2026' },
    { icon: '👤', text: 'Surveyor: TROP Studio' },
    { icon: '🔖', text: 'Version: V2.0' },
  ],
  purpose: 'Conduct a site survey to verify actual dimensions, assess the structure, electrical and plumbing systems, and identify construction constraints before developing the concept and layout.',
  brief: 'French-Indochina style café, 3 floors, 107m², budget 250–350 million VND, vintage retro design.',
  ownerExpectations: [
    'Verify the actual usable area across 3 floors',
    'Identify load-bearing walls and structural constraints',
    'Document current electrical capacity and panel location',
    'Check drainage and plumbing feasibility for the bar area',
  ],
}

const SIZE_CARD = {
  title: 'Size & Dimensions',
  fields: [
    { label: 'Total Floor Area', value: '107 m²' },
    { label: 'Ground Floor', value: '38 m²' },
    { label: '2nd Floor', value: '36 m²' },
    { label: '3rd Floor', value: '33 m²' },
    { label: 'Ceiling Height (GF)', value: '3.6 m' },
    { label: 'Ceiling Height (2F)', value: '3.2 m' },
    { label: 'Ceiling Height (3F)', value: '3.0 m' },
    { label: 'Frontage Width', value: '4.5 m' },
    { label: 'Building Depth', value: '8.4 m' },
  ],
}

const STRUCTURE_CARD = {
  title: 'Structure',
  fields: [
    { label: 'Frame Type', value: 'Reinforced concrete' },
    { label: 'Load-bearing Walls', value: '2 core walls (north & south)' },
    { label: 'Staircase', value: 'Internal, right side' },
    { label: 'Mezzanine Possibility', value: 'Yes — 2nd floor suitable' },
    { label: 'Renovation Constraint', value: 'Cannot remove south wall' },
    { label: 'Facade Material', value: 'Old brick + plaster' },
  ],
}

const ELECTRICITY_CARD = {
  title: 'Electricity',
  fields: [
    { label: 'Current Capacity', value: '15A / 3-phase' },
    { label: 'Main Panel Location', value: 'Ground floor, rear-right' },
    { label: 'Upgrade Required', value: 'Yes — upgrade to 40A' },
    { label: 'Estimated Cost', value: '12,000,000 VND' },
    { label: 'Emergency Lighting', value: 'Not installed' },
  ],
}
*/

export default function SiteSurveyPage() {
  const [activeTab, setActiveTab] = useState('Overview')
  const [editMode, setEditMode] = useState(false)

  return (
    <div className="flex flex-col min-h-full">
      {/* Sticky top bar */}
      <div className="sticky top-0 z-10 rounded-t-2xl" style={{ backgroundColor: 'rgba(251,250,249,0.92)', backdropFilter: 'blur(6px)', borderBottom: '1px solid #e8ddd6' }}>
        <div className="flex items-center justify-between px-8 py-4">
          <div>
            <nav className="flex items-center gap-1.5 text-xs mb-1" style={{ color: '#5b483f' }}>
              <span className="hover:underline cursor-pointer">Projects</span>
              <span>/</span>
              <span className="font-medium" style={{ color: '#2d1e14' }}>Survey</span>
            </nav>
            <h1 className="text-xl font-bold" style={{ color: '#2d1e14' }}>Site Survey Report</h1>
          </div>
          <div className="flex items-center gap-2">
            {['Export', 'Share', 'Compare', 'History', 'Add Section', 'Save Draft'].map((btn) => (
              <button key={btn} className="px-3 py-1.5 rounded-lg text-xs font-medium border" style={{ borderColor: '#d4c8be', color: '#5b483f' }}>
                {btn}
              </button>
            ))}
            <button
              onClick={() => setEditMode((e) => !e)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold"
              style={{ backgroundColor: editMode ? '#b23f00' : '#2d1e14', color: '#fff' }}
            >
              {editMode ? 'Exit Edit' : 'Edit'}
            </button>
          </div>
        </div>

        {editMode && (
          <div className="flex items-center gap-2 px-8 py-2.5 text-sm font-medium" style={{ backgroundColor: '#eff6ff', borderTop: '1px solid #bedbff', color: '#1447e6' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            Edit mode is active. Click on any item to edit its value.
          </div>
        )}

        <div className="flex items-center gap-1 px-8 py-2 overflow-x-auto">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap flex-shrink-0 transition-colors"
              style={{
                backgroundColor: activeTab === tab ? 'rgba(178,63,0,0.1)' : 'transparent',
                color: activeTab === tab ? '#b23f00' : '#5b483f',
              }}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-8">
        <div className="flex flex-col items-center justify-center py-20 rounded-xl border" style={{ borderColor: '#d4c8be', backgroundColor: '#fdfbfa' }}>
          <div className="text-4xl mb-3">📐</div>
          <p className="font-medium mb-1" style={{ color: '#1c1008' }}>Survey data coming soon</p>
          <p className="text-sm text-center max-w-xs" style={{ color: '#7a6a5a' }}>
            Waiting for the site-survey endpoint to be available on the BE.
          </p>
        </div>
      </div>
    </div>
  )
}
