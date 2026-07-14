export default function BriefQuestionPage() {
  const questions = [
    {
      id: 'target',
      label: 'Who is your target customer?',
      hint: 'Describe your ideal cafe guest — age, lifestyle, habits.',
      type: 'textarea',
    },
    {
      id: 'style',
      label: 'What design style are you drawn to?',
      hint: 'e.g. Minimalist, Tropical, Industrial, Wabi-sabi, Modern organic',
      type: 'select',
      options: ['Minimalist', 'Tropical', 'Industrial', 'Wabi-sabi', 'Modern organic', 'Neo-classical', 'Other'],
    },
    {
      id: 'mood',
      label: 'What mood should the space create?',
      hint: 'e.g. Warm & cozy, Energetic, Calm & focused',
      type: 'select',
      options: ['Warm & cozy', 'Energetic', 'Calm & focused', 'Luxurious', 'Playful', 'Other'],
    },
    {
      id: 'business_model',
      label: 'What type of cafe is this?',
      hint: 'Select all that apply.',
      type: 'checkbox',
      options: ['Dine-in', 'Takeaway / To-go', 'Co-working cafe', 'Specialty coffee bar', 'Roastery', 'Other'],
    },
    {
      id: 'brand_note',
      label: 'Describe your brand in 3 words',
      hint: 'e.g. "Bold, Authentic, Local"',
      type: 'text',
    },
    {
      id: 'goals',
      label: 'What are your key business goals for this space?',
      hint: 'Revenue targets, experience goals, differentiators...',
      type: 'textarea',
    },
  ]

  return (
    <div className="p-10 max-w-3xl">
      <header className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: '#a89888' }}>
          Project Info
        </p>
        <h1 className="text-3xl font-bold" style={{ color: '#1c1008' }}>Brief — Questions</h1>
        <p className="text-sm mt-2" style={{ color: '#7a6a5a' }}>
          Answer these questions to help the designer understand your vision.
        </p>
      </header>

      <form className="flex flex-col gap-7">
        {questions.map((q, i) => (
          <div key={q.id} className="pb-7 border-b last:border-0" style={{ borderColor: '#e8ddd6' }}>
            <div className="flex gap-3 mb-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ backgroundColor: '#1c1008' }}>
                {i + 1}
              </span>
              <div>
                <p className="text-sm font-semibold" style={{ color: '#1c1008' }}>{q.label}</p>
                {q.hint && <p className="text-xs mt-0.5" style={{ color: '#a89888' }}>{q.hint}</p>}
              </div>
            </div>

            {q.type === 'textarea' && (
              <textarea
                rows={3}
                className="w-full px-4 py-3 rounded-lg border text-sm outline-none resize-none"
                style={{ borderColor: '#d4c8be', backgroundColor: '#fff', color: '#1c1008' }}
              />
            )}
            {q.type === 'text' && (
              <input type="text" className="w-full px-4 py-3 rounded-lg border text-sm outline-none" style={{ borderColor: '#d4c8be', backgroundColor: '#fff', color: '#1c1008' }} />
            )}
            {q.type === 'select' && (
              <select className="w-full px-4 py-3 rounded-lg border text-sm outline-none bg-white" style={{ borderColor: '#d4c8be', color: '#1c1008' }}>
                {q.options?.map((o) => <option key={o}>{o}</option>)}
              </select>
            )}
            {q.type === 'checkbox' && (
              <div className="flex flex-wrap gap-2">
                {q.options?.map((o) => (
                  <label key={o} className="flex items-center gap-2 border rounded-lg px-3 py-2 cursor-pointer text-sm" style={{ borderColor: '#d4c8be', backgroundColor: '#fff', color: '#1c1008' }}>
                    <input type="checkbox" className="accent-[#1c1008]" />
                    {o}
                  </label>
                ))}
              </div>
            )}
          </div>
        ))}

        <div className="flex justify-end gap-3">
          <button type="button" className="px-6 py-2.5 rounded-lg border text-sm font-medium" style={{ borderColor: '#d4c8be', color: '#1c1008' }}>
            Save draft
          </button>
          <button type="submit" className="px-8 py-2.5 rounded-lg text-sm font-semibold text-white" style={{ backgroundColor: '#1c1008' }}>
            Submit brief
          </button>
        </div>
      </form>
    </div>
  )
}
