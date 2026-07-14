export default function SiteSurveyPage() {
  return (
    <div className="p-10 max-w-3xl">
      <header className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: '#a89888' }}>
          Project Info
        </p>
        <h1 className="text-3xl font-bold" style={{ color: '#1c1008' }}>Site Survey</h1>
        <p className="text-sm mt-2" style={{ color: '#7a6a5a' }}>
          Provide accurate on-site measurements and observations for the design team.
        </p>
      </header>

      <form className="flex flex-col gap-8">
        {/* Location */}
        <section>
          <h2 className="text-base font-semibold mb-4" style={{ color: '#1c1008' }}>Location Details</h2>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Street address" placeholder="123 Nguyen Hue" />
            <Field label="District / Area" placeholder="District 1" />
            <Field label="City" placeholder="Ho Chi Minh City" />
            <Field label="Floor / Level" placeholder="Ground floor" />
          </div>
        </section>

        {/* Dimensions */}
        <section>
          <h2 className="text-base font-semibold mb-4" style={{ color: '#1c1008' }}>Dimensions</h2>
          <div className="grid grid-cols-3 gap-4">
            <Field label="Length (m)" placeholder="12" type="number" />
            <Field label="Width (m)" placeholder="8" type="number" />
            <Field label="Ceiling height (m)" placeholder="3.5" type="number" />
            <Field label="Storefront width (m)" placeholder="6" type="number" />
            <Field label="Total area (m²)" placeholder="96" type="number" />
            <Field label="Number of floors" placeholder="1" type="number" />
          </div>
        </section>

        {/* Conditions */}
        <section>
          <h2 className="text-base font-semibold mb-4" style={{ color: '#1c1008' }}>Site Conditions</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: '#1c1008' }}>Natural light</label>
              <select className="w-full px-4 py-3 rounded-lg border text-sm outline-none bg-white" style={{ borderColor: '#d4c8be', color: '#1c1008' }}>
                <option>Excellent — large windows</option>
                <option>Good — moderate windows</option>
                <option>Limited — few windows</option>
                <option>None — basement / internal</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: '#1c1008' }}>Ventilation</label>
              <select className="w-full px-4 py-3 rounded-lg border text-sm outline-none bg-white" style={{ borderColor: '#d4c8be', color: '#1c1008' }}>
                <option>Natural ventilation</option>
                <option>Mechanical only</option>
                <option>Mixed</option>
              </select>
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium mb-1" style={{ color: '#1c1008' }}>Observations / notes</label>
            <textarea
              rows={4}
              placeholder="Note any structural constraints, existing fixtures, or special site conditions..."
              className="w-full px-4 py-3 rounded-lg border text-sm outline-none resize-none"
              style={{ borderColor: '#d4c8be', backgroundColor: '#fff', color: '#1c1008' }}
            />
          </div>
        </section>

        <div className="flex justify-end gap-3 pt-2">
          <button type="button" className="px-6 py-2.5 rounded-lg border text-sm font-medium" style={{ borderColor: '#d4c8be', color: '#1c1008' }}>
            Save draft
          </button>
          <button type="submit" className="px-8 py-2.5 rounded-lg text-sm font-semibold text-white" style={{ backgroundColor: '#1c1008' }}>
            Save & continue
          </button>
        </div>
      </form>
    </div>
  )
}

function Field({ label, placeholder, type = 'text' }: { label: string; placeholder: string; type?: string }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1" style={{ color: '#1c1008' }}>{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        className="w-full px-4 py-3 rounded-lg border text-sm outline-none"
        style={{ borderColor: '#d4c8be', backgroundColor: '#fff', color: '#1c1008' }}
      />
    </div>
  )
}
