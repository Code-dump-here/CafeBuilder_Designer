import TopNav from '../TopNav'

// Browse isn't tied to a project, so it gets the plain top nav only —
// no project sidebar, since there's no project context here.
export default function BrowseLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen" style={{ backgroundColor: '#fbfaf9' }}>
      <TopNav />
      <main className="flex-1">{children}</main>
    </div>
  )
}
