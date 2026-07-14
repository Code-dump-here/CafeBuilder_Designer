import Link from 'next/link'

const mockProjects = [
  {
    id: 1,
    title: 'Artisan Reserve Roastery',
    location: 'District 1, Ho Chi Minh City',
    status: 'In Progress',
    phase: 'Design Review',
    budget: '$120,000',
    updatedAt: '2 hours ago',
  },
  {
    id: 2,
    title: 'The Oak Brew',
    location: 'District 3, Ho Chi Minh City',
    status: 'Completed',
    phase: 'Handover',
    budget: '$85,000',
    updatedAt: '3 days ago',
  },
  {
    id: 3,
    title: 'Urban Roast',
    location: 'Thu Duc City',
    status: 'Pending',
    phase: 'Brief Review',
    budget: '$60,000',
    updatedAt: '1 week ago',
  },
]

const statusColors: Record<string, string> = {
  'In Progress': '#2563eb',
  'Completed': '#16a34a',
  'Pending': '#d97706',
}

export default function MyProjectsPage() {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#fbfaf9' }}>
      {/* Nav */}
      <header className="flex items-center justify-between px-8 h-16 border-b" style={{ borderColor: '#d4c8be', backgroundColor: '#fbfaf9' }}>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-[#1c1008] flex items-center justify-center">
            <span className="text-white text-xs font-bold">D</span>
          </div>
          <span className="font-semibold" style={{ color: '#1c1008' }}>Designer</span>
        </div>
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium" style={{ color: '#7a6a5a' }}>
          <Link href="/my-projects" style={{ color: '#1c1008' }}>My Projects</Link>
          <Link href="#">Browse</Link>
          <Link href="#">Messages</Link>
          <Link href="#">Profile</Link>
        </nav>
        <div className="w-8 h-8 rounded-full bg-[#1c1008] flex items-center justify-center">
          <span className="text-white text-xs font-bold">JD</span>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 px-8 py-10 max-w-6xl mx-auto w-full">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold" style={{ color: '#1c1008' }}>My Projects</h1>
            <p className="text-sm mt-1" style={{ color: '#7a6a5a' }}>Manage your ongoing design collaborations</p>
          </div>
          <button
            className="px-5 py-2.5 rounded-lg text-sm font-semibold text-white"
            style={{ backgroundColor: '#1c1008' }}
          >
            + New project
          </button>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-6">
          {['All', 'In Progress', 'Pending', 'Completed'].map((tab) => (
            <button
              key={tab}
              className="px-4 py-2 rounded-full text-sm font-medium border transition-colors"
              style={{
                borderColor: tab === 'All' ? '#1c1008' : '#d4c8be',
                backgroundColor: tab === 'All' ? '#1c1008' : 'transparent',
                color: tab === 'All' ? '#fff' : '#7a6a5a',
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Project list */}
        <div className="flex flex-col gap-4">
          {mockProjects.map((project) => (
            <div
              key={project.id}
              className="flex items-center gap-6 p-6 rounded-xl border bg-white transition-shadow hover:shadow-md"
              style={{ borderColor: '#d4c8be' }}
            >
              {/* Thumbnail placeholder */}
              <div className="hidden md:block w-20 h-20 rounded-lg flex-shrink-0" style={{ backgroundColor: '#f0ebe5' }} />

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <h2 className="font-semibold text-base truncate" style={{ color: '#1c1008' }}>{project.title}</h2>
                  <span
                    className="text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0"
                    style={{
                      color: statusColors[project.status] ?? '#7a6a5a',
                      backgroundColor: (statusColors[project.status] ?? '#7a6a5a') + '18',
                    }}
                  >
                    {project.status}
                  </span>
                </div>
                <p className="text-sm" style={{ color: '#7a6a5a' }}>{project.location}</p>
                <p className="text-xs mt-1" style={{ color: '#a89888' }}>Phase: {project.phase} · Updated {project.updatedAt}</p>
              </div>

              {/* Budget */}
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold" style={{ color: '#1c1008' }}>{project.budget}</p>
                <p className="text-xs" style={{ color: '#7a6a5a' }}>Budget</p>
              </div>

              {/* CTA */}
              <button
                className="px-4 py-2 rounded-lg border text-sm font-medium flex-shrink-0 transition-colors hover:bg-black/5"
                style={{ borderColor: '#d4c8be', color: '#1c1008' }}
              >
                View
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
