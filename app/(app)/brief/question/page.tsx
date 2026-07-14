// TODO: Wire to BE once a brief-submission endpoint exists for providers.
// The question form below is a future interaction for providers to submit brief responses.
// Needs: POST /api/briefs or POST /api/project-posts/{id}/brief-response (endpoint TBD).
// All question definitions are kept here as they will be reused once wired.

/*
const questions = [
  { id: 'target',         label: 'Who is your target customer?',         hint: 'Describe your ideal cafe guest — age, lifestyle, habits.',         type: 'textarea' },
  { id: 'style',          label: 'What design style are you drawn to?',  hint: 'e.g. Minimalist, Tropical, Industrial, Wabi-sabi, Modern organic', type: 'select',   options: ['Minimalist', 'Tropical', 'Industrial', 'Wabi-sabi', 'Modern organic', 'Neo-classical', 'Other'] },
  { id: 'mood',           label: 'What mood should the space create?',   hint: 'e.g. Warm & cozy, Energetic, Calm & focused',                      type: 'select',   options: ['Warm & cozy', 'Energetic', 'Calm & focused', 'Luxurious', 'Playful', 'Other'] },
  { id: 'business_model', label: 'What type of cafe is this?',           hint: 'Select all that apply.',                                            type: 'checkbox', options: ['Dine-in', 'Takeaway / To-go', 'Co-working cafe', 'Specialty coffee bar', 'Roastery', 'Other'] },
  { id: 'brand_note',     label: 'Describe your brand in 3 words',       hint: 'e.g. "Bold, Authentic, Local"',                                     type: 'text' },
  { id: 'goals',          label: 'What are your key business goals?',    hint: 'Revenue targets, experience goals, differentiators...',             type: 'textarea' },
]
*/

export default function BriefQuestionPage() {
  return (
    <div className="p-10 max-w-3xl">
      <header className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: '#a89888' }}>Project Info</p>
        <h1 className="text-3xl font-bold" style={{ color: '#1c1008' }}>Brief — Questions</h1>
        <p className="text-sm mt-2" style={{ color: '#7a6a5a' }}>Answer these questions to help the designer understand your vision.</p>
      </header>

      <div className="flex flex-col items-center justify-center py-20 rounded-xl border" style={{ borderColor: '#d4c8be', backgroundColor: '#fdfbfa' }}>
        <div className="text-4xl mb-3">❓</div>
        <p className="font-medium mb-1" style={{ color: '#1c1008' }}>Brief questions coming soon</p>
        <p className="text-sm text-center max-w-xs" style={{ color: '#7a6a5a' }}>
          Waiting for the brief submission endpoint to be available on the BE.
        </p>
      </div>
    </div>
  )
}
