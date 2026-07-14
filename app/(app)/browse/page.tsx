const projects = [
  {
    id: 1,
    title: 'The Greenhouse Cafe',
    location: 'District 2, Ho Chi Minh City',
    style: 'Biophilic',
    budget: '$80,000–$100,000',
    area: '70 m²',
    deadline: 'Jul 20',
    proposals: 3,
    status: 'Open',
  },
  {
    id: 2,
    title: 'Midnight Espresso Bar',
    location: 'District 3, Ho Chi Minh City',
    style: 'Industrial',
    budget: '$50,000–$70,000',
    area: '45 m²',
    deadline: 'Jul 28',
    proposals: 7,
    status: 'Open',
  },
  {
    id: 3,
    title: 'Rooftop Terrace Coffee',
    location: 'Binh Thanh District',
    style: 'Modern organic',
    budget: '$150,000+',
    area: '200 m²',
    deadline: 'Aug 5',
    proposals: 1,
    status: 'Urgent',
  },
  {
    id: 4,
    title: 'Phin & Press',
    location: 'Thu Duc City',
    style: 'Wabi-sabi',
    budget: '$30,000–$50,000',
    area: '38 m²',
    deadline: 'Aug 12',
    proposals: 0,
    status: 'Open',
  },
]

const statusStyle: Record<string, { bg: string; color: string }> = {
  Open: { bg: '#d1fae5', color: '#065f46' },
  Urgent: { bg: '#fee2e2', color: '#991b1b' },
}

export default function BrowsePage() {
  return (
    <div className="p-10 max-w-5xl">
      <header className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: '#a89888' }}>Collaboration</p>
        <h1 className="text-3xl font-bold" style={{ color: '#1c1008' }}>Browse Projects</h1>
        <p className="text-sm mt-2" style={{ color: '#7a6a5a' }}>Discover open project briefs and submit proposals.</p>
      </header>

      {/* Search + filter */}
      <div className="flex gap-3 mb-6">
        <div className="flex-1 relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#a89888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Search by name, style, or location..."
            className="w-full pl-9 pr-4 py-3 rounded-lg border text-sm outline-none"
            style={{ borderColor: '#d4c8be', backgroundColor: '#fff', color: '#1c1008' }}
          />
        </div>
        <select className="px-4 py-3 rounded-lg border text-sm outline-none bg-white" style={{ borderColor: '#d4c8be', color: '#1c1008' }}>
          <option>All styles</option>
          <option>Biophilic</option>
          <option>Industrial</option>
          <option>Modern organic</option>
          <option>Minimalist</option>
          <option>Wabi-sabi</option>
        </select>
        <select className="px-4 py-3 rounded-lg border text-sm outline-none bg-white" style={{ borderColor: '#d4c8be', color: '#1c1008' }}>
          <option>Any budget</option>
          <option>Under $50k</option>
          <option>$50k–$100k</option>
          <option>$100k+</option>
        </select>
      </div>

      {/* Results count */}
      <p className="text-sm mb-4" style={{ color: '#a89888' }}>{projects.length} projects available</p>

      {/* Cards */}
      <div className="flex flex-col gap-4">
        {projects.map((p) => {
          const s = statusStyle[p.status] ?? statusStyle['Open']
          return (
            <div key={p.id} className="flex gap-5 rounded-xl border bg-white p-6 items-start" style={{ borderColor: '#e8ddd6' }}>
              {/* Thumb placeholder */}
              <div className="hidden md:block w-24 h-24 rounded-lg flex-shrink-0" style={{ backgroundColor: '#f5ede6' }} />

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <h2 className="font-semibold text-base" style={{ color: '#1c1008' }}>{p.title}</h2>
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full flex-shrink-0" style={{ backgroundColor: s.bg, color: s.color }}>
                    {p.status}
                  </span>
                </div>
                <p className="text-sm mb-3" style={{ color: '#7a6a5a' }}>{p.location} · {p.style}</p>
                <div className="flex flex-wrap gap-4 text-xs" style={{ color: '#a89888' }}>
                  <span>Area: {p.area}</span>
                  <span>Budget: {p.budget}</span>
                  <span>Deadline: {p.deadline}</span>
                  <span>{p.proposals} proposal{p.proposals !== 1 ? 's' : ''}</span>
                </div>
              </div>

              {/* CTA */}
              <div className="flex flex-col gap-2 flex-shrink-0">
                <button className="px-5 py-2 rounded-lg text-sm font-semibold text-white whitespace-nowrap" style={{ backgroundColor: '#1c1008' }}>
                  Submit proposal
                </button>
                <button className="px-5 py-2 rounded-lg border text-sm font-medium whitespace-nowrap" style={{ borderColor: '#d4c8be', color: '#1c1008' }}>
                  View brief
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
