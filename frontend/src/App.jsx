import { useState } from 'react'
import Header from './components/Header.jsx'
import StudyInput from './components/StudyInput.jsx'
import GenerateButton from './components/GenerateButton.jsx'
import EmptyState from './components/EmptyState.jsx'

function App() {
  const [notes, setNotes] = useState('')

  const handleChange = (event) => {
    setNotes(event.target.value)
  }

  const hasValidInput = notes.trim().length > 0

  const handleGenerate = () => {
    // API integration is added in a later module.
    console.log('Generate clicked with:', notes)
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-4 py-12 sm:py-16">
        <Header />

        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-6">
            <StudyInput value={notes} onChange={handleChange} disabled={false} />
            <div className="flex justify-center">
              <GenerateButton onClick={handleGenerate} disabled={!hasValidInput} />
            </div>
          </div>
        </section>

        <EmptyState />
      </main>
    </div>
  )
}

export default App
