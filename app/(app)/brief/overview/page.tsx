// TODO: Wire to BE once a project-brief endpoint exists for providers.
// The stats and field values below are mock data — replace with real API data
// when GET /api/projects/{id} or GET /api/project-posts/{id} returns these fields:
//   totalArea, budget, timeline, seatingCount,
//   designStyle, mood, brandWords, cafeType,
//   location, dimensions, ceilingHeight, naturalLight,
//   targetCustomer

/*
const stats = [
  { label: 'Total area', value: '96 m²' },
  { label: 'Budget', value: '$120,000' },
  { label: 'Timeline', value: '14 weeks' },
  { label: 'Seating', value: '40–50' },
]
*/

export default function BriefOverviewPage() {
  return (
    <div className="p-10 max-w-4xl">
      <header className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: '#a89888' }}>Project Info</p>
        <h1 className="text-3xl font-bold" style={{ color: '#1c1008' }}>Brief — Overview</h1>
        <p className="text-sm mt-2" style={{ color: '#7a6a5a' }}>A snapshot of the project brief for quick reference.</p>
      </header>

      <div className="flex flex-col items-center justify-center py-20 rounded-xl border" style={{ borderColor: '#d4c8be', backgroundColor: '#fdfbfa' }}>
        <div className="text-4xl mb-3">📋</div>
        <p className="font-medium mb-1" style={{ color: '#1c1008' }}>Brief data coming soon</p>
        <p className="text-sm text-center max-w-xs" style={{ color: '#7a6a5a' }}>
          Waiting for the project brief endpoint to be available on the BE.
        </p>
      </div>
    </div>
  )
}
