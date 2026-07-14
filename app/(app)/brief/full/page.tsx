// TODO: Wire to BE once a project-brief endpoint exists for providers.
// All sections below are mock data — replace with real API data when available.
// Fields needed from BE:
//   Project Details: projectName, location, totalArea, budget, timeline
//   Brand & Concept: brandWords, designStyle, mood, targetCustomer
//   Space Requirements: cafeType, seatingCount, functionalAreas
//   Site Survey: floor, dimensions, storefrontWidth, naturalLight, ventilation, notes
//   Business Goals: primaryGoal, differentiators

/*
const sections = [
  {
    title: 'Project Details',
    items: [
      { label: 'Project name', value: 'Artisan Reserve Roastery' },
      { label: 'Location', value: 'District 1, Ho Chi Minh City' },
      { label: 'Total area', value: '96 m²' },
      { label: 'Budget', value: '$120,000' },
      { label: 'Timeline', value: '14 weeks' },
    ],
  },
  {
    title: 'Brand & Concept',
    items: [
      { label: 'Brand in 3 words', value: 'Bold, Authentic, Local' },
      { label: 'Design style', value: 'Modern organic' },
      { label: 'Mood', value: 'Warm & cozy' },
      { label: 'Target customer', value: 'Urban professionals, 25–40, specialty coffee enthusiasts who value craft and environment.' },
    ],
  },
  {
    title: 'Space Requirements',
    items: [
      { label: 'Cafe type', value: 'Dine-in, Specialty coffee bar' },
      { label: 'Seating count', value: '40–50 seats' },
      { label: 'Functional areas', value: 'Customer seating, Coffee bar, Order counter, Small private section' },
    ],
  },
  {
    title: 'Site Survey',
    items: [
      { label: 'Floor', value: 'Ground floor' },
      { label: 'Dimensions', value: '12m × 8m, ceiling 3.5m' },
      { label: 'Storefront width', value: '6m' },
      { label: 'Natural light', value: 'Good — moderate windows facing east' },
      { label: 'Ventilation', value: 'Mixed' },
      { label: 'Notes', value: 'Existing plumbing along south wall. Load-bearing column at center.' },
    ],
  },
  {
    title: 'Business Goals',
    items: [
      { label: 'Primary goal', value: 'Create a destination cafe that drives repeat visits and social media presence.' },
      { label: 'Differentiators', value: 'In-house roasting display, specialty equipment visible to guests, curated local art.' },
    ],
  },
]
*/

export default function BriefFullPage() {
  return (
    <div className="p-10 max-w-3xl">
      <header className="mb-8 flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: '#a89888' }}>Project Info</p>
          <h1 className="text-3xl font-bold" style={{ color: '#1c1008' }}>Brief — Full</h1>
          <p className="text-sm mt-2" style={{ color: '#7a6a5a' }}>Complete project brief compiled from all inputs.</p>
        </div>
        <button className="px-4 py-2 rounded-lg border text-sm font-medium flex items-center gap-2" style={{ borderColor: '#d4c8be', color: '#1c1008' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          Export PDF
        </button>
      </header>

      <div className="flex flex-col items-center justify-center py-20 rounded-xl border" style={{ borderColor: '#d4c8be', backgroundColor: '#fdfbfa' }}>
        <div className="text-4xl mb-3">📄</div>
        <p className="font-medium mb-1" style={{ color: '#1c1008' }}>Full brief coming soon</p>
        <p className="text-sm text-center max-w-xs" style={{ color: '#7a6a5a' }}>
          Waiting for the project brief endpoint to be available on the BE.
        </p>
      </div>
    </div>
  )
}
