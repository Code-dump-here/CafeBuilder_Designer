const concepts = [
  {
    id: 1,
    title: 'Concept A — Forest Within',
    description: 'A layered interior inspired by the Vietnamese highland forest. Raw timber, living plant walls, and warm amber lighting create an immersive nature escape in the heart of the city.',
    tags: ['Biophilic', 'Warm tones', 'Natural materials'],
    status: 'Selected',
  },
  {
    id: 2,
    title: 'Concept B — Urban Roast',
    description: 'Industrial bones meet artisan warmth. Exposed concrete columns, blackened steel shelving, and tactile leather seating speak to the craft of coffee-making.',
    tags: ['Industrial', 'Monochrome', 'Bold'],
    status: 'Under review',
  },
  {
    id: 3,
    title: 'Concept C — Minimal Edit',
    description: 'A stripped-back palette lets the coffee and the people take centre stage. White oak joinery, soft plaster walls, and carefully considered light design.',
    tags: ['Minimalist', 'Light palette', 'Refined'],
    status: 'Draft',
  },
]

const statusStyles: Record<string, { bg: string; color: string }> = {
  'Selected': { bg: '#d1fae5', color: '#065f46' },
  'Under review': { bg: '#fef3c7', color: '#92400e' },
  'Draft': { bg: '#f3f4f6', color: '#6b7280' },
}

export default function ConceptPage() {
  return (
    <div className="p-10 max-w-4xl">
      <header className="mb-8 flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: '#a89888' }}>Design Work</p>
          <h1 className="text-3xl font-bold" style={{ color: '#1c1008' }}>Concept</h1>
          <p className="text-sm mt-2" style={{ color: '#7a6a5a' }}>Design directions proposed for the client&apos;s review.</p>
        </div>
        <button className="px-5 py-2.5 rounded-lg text-sm font-semibold text-white" style={{ backgroundColor: '#1c1008' }}>
          + Add concept
        </button>
      </header>

      <div className="flex flex-col gap-5">
        {concepts.map((c) => {
          const style = statusStyles[c.status] ?? statusStyles['Draft']
          return (
            <div key={c.id} className="rounded-xl border bg-white overflow-hidden" style={{ borderColor: '#e8ddd6' }}>
              {/* Image placeholder */}
              <div className="h-44 w-full" style={{ backgroundColor: '#f5ede6' }} />
              <div className="p-6">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <h2 className="text-lg font-bold" style={{ color: '#1c1008' }}>{c.title}</h2>
                  <span
                    className="text-xs font-semibold px-3 py-1 rounded-full flex-shrink-0"
                    style={{ backgroundColor: style.bg, color: style.color }}
                  >
                    {c.status}
                  </span>
                </div>
                <p className="text-sm leading-relaxed mb-4" style={{ color: '#7a6a5a' }}>{c.description}</p>
                <div className="flex flex-wrap gap-2">
                  {c.tags.map((tag) => (
                    <span key={tag} className="text-xs font-medium px-3 py-1 rounded-full border" style={{ borderColor: '#d4c8be', color: '#5c4a38' }}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
