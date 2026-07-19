import Link from 'next/link'

const PAGES = [
  {
    section: 'Auth',
    color: '#7c3aed',
    items: [
      { href: '/sign-in',                     label: 'Sign In',                  note: 'POST /api/auth/login' },
      { href: '/register',                     label: 'Register',                 note: 'POST /api/auth/register' },
      { href: '/verify-email',                 label: 'Verify Email',             note: 'static' },
      { href: '/create-profile/designer',      label: 'Create Profile — Designer',note: 'POST /api/service-providers (capability: designer)' },
      { href: '/create-profile/constructor',   label: 'Create Profile — Constructor', note: 'POST /api/service-providers (capability: constructor)' },
    ],
  },
  {
    section: 'Projects',
    color: '#b23f00',
    items: [
      { href: '/my-projects',                  label: 'My Projects',              note: 'GET /api/project-providers + /project-applications' },
      { href: '/browse',                        label: 'Browse Projects',          note: 'GET /api/project-posts' },
    ],
  },
  {
    section: 'Per-Project (needs ?projectId= + ?projectWorkingId= in URL)',
    color: '#065f46',
    items: [
      { href: '/overview?projectId=1',          label: 'Overview',                 note: 'GET /api/projects/{id} + /design-briefs?projectId=' },
      { href: '/brief/overview?projectId=1',    label: 'Brief — Overview',         note: 'GET /api/projects/{id} + /design-briefs?projectId=' },
      { href: '/brief/full?projectId=1',        label: 'Brief — Full',             note: 'GET /api/projects/{id} + /design-briefs?projectId=' },
      { href: '/brief/question',                label: 'Brief — Questions',        note: 'no BE endpoint yet' },
      { href: '/site-survey',                   label: 'Site Survey',              note: 'no BE endpoint yet' },
      { href: '/concept?projectWorkingId=1',   label: 'Concept',                  note: 'GET /api/designs?type=concept&projectWorkingId=' },
      { href: '/design-management?projectWorkingId=1', label: 'Design Management', note: 'GET /api/designs?projectWorkingId= + POST/submit/revision/images' },
    ],
  },
  {
    section: 'Contracts (no BE endpoints yet)',
    color: '#003441',
    items: [
      { href: '/contracts',                     label: 'Contracts',                note: 'no BE endpoint yet' },
      { href: '/contracts/create',              label: 'Contract Wizard Step 2',   note: 'no BE endpoint yet' },
      { href: '/send-contract',                 label: 'Send Contract',            note: 'no BE endpoint yet' },
    ],
  },
]

export default function DevNavPage() {
  return (
    <div className="min-h-screen p-10" style={{ backgroundColor: '#fbfaf9' }}>
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8 pb-6 border-b" style={{ borderColor: '#e8ddd6' }}>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-widest px-2 py-0.5 rounded" style={{ backgroundColor: '#fef3c7', color: '#92400e' }}>DEV</span>
            <h1 className="text-2xl font-bold" style={{ color: '#1c1008' }}>Page Navigator</h1>
          </div>
          <p className="text-sm" style={{ color: '#7a6a5a' }}>All pages in the designer app. Sample IDs are placeholders — replace with real IDs.</p>
        </div>

        <div className="flex flex-col gap-8">
          {PAGES.map((group) => (
            <div key={group.section}>
              <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: group.color }}>{group.section}</p>
              <div className="flex flex-col gap-2">
                {group.items.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center justify-between gap-4 px-4 py-3 rounded-xl border bg-white hover:shadow-sm transition-shadow"
                    style={{ borderColor: '#e8ddd6' }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: group.color }} />
                      <span className="text-sm font-medium" style={{ color: '#1c1008' }}>{item.label}</span>
                    </div>
                    <span className="text-xs flex-shrink-0" style={{ color: '#a89888' }}>{item.note}</span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 pt-6 border-t text-xs" style={{ borderColor: '#e8ddd6', color: '#a89888' }}>
          This page is for development only. Accessible at <code className="px-1 py-0.5 rounded" style={{ backgroundColor: '#f0e8e0' }}>/dev-nav</code> from the floating button.
        </div>
      </div>
    </div>
  )
}
