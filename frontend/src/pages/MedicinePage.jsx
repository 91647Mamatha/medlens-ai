import { useState } from 'react'
import { AlertTriangle, Loader2, Pill, Search, ShieldAlert } from 'lucide-react'
import DetailBlock from '../components/DetailBlock'
import GlowCard from '../components/GlowCard'

function MedicinePage({ api, showToast }) {
  const [name, setName] = useState('')
  const [result, setResult] = useState(null)
  const [busy, setBusy] = useState(false)

  const lookup = async (event) => {
    event.preventDefault()
    if (!name.trim()) return

    setBusy(true)
    setResult(null)

    try {
      const response = await api.post('/medicine/lookup', {
        medicine_name: name.trim(),
      })
      setResult(response.data)
    } catch {
      showToast('Medicine lookup failed')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[420px_1fr]">
      <GlowCard>
        <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-teal-600 to-emerald-500 p-6 text-white shadow-xl shadow-blue-500/20">
          <div className="grid h-16 w-16 place-items-center rounded-3xl bg-white/15 ring-1 ring-white/20">
            <Pill size={34} />
          </div>
          <h2 className="mt-5 text-3xl font-black">Medicine Lookup</h2>
          <p className="mt-3 text-sm leading-6 text-white/85">
            Search medicine uses, side effects, interactions, warnings, and source information.
          </p>
        </div>

        <form onSubmit={lookup} className="mt-5">
          <label className="block">
            <span className="mb-2 block text-sm font-black text-slate-700">Medicine name</span>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Paracetamol, Metformin, Aspirin..."
              className="h-13 w-full rounded-2xl border border-slate-200 px-4 text-sm font-semibold outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
            />
          </label>

          <button
            disabled={busy || !name.trim()}
            className="mt-4 inline-flex h-13 w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-4 text-sm font-black text-white shadow-lg shadow-slate-950/20"
          >
            {busy ? <Loader2 className="animate-spin" size={18} /> : <Search size={18} />}
            {busy ? 'Searching...' : 'Search medicine'}
          </button>
        </form>

        <div className="mt-5 rounded-3xl bg-amber-50 p-4 text-amber-900 ring-1 ring-amber-200">
          <div className="flex gap-3">
            <ShieldAlert size={22} className="shrink-0" />
            <p className="text-sm leading-6">
              Medicine data is educational only. Always consult a doctor before making medical decisions.
            </p>
          </div>
        </div>
      </GlowCard>

      <GlowCard>
        <div className="mb-6">
          <p className="text-sm font-black uppercase tracking-wide text-blue-700">Lookup result</p>
          <h2 className="mt-1 text-3xl font-black">
            {result?.medicine_name || 'Search output'}
          </h2>
          {result?.source && (
            <p className="mt-2 inline-flex rounded-full bg-teal-50 px-3 py-1 text-xs font-black text-teal-700">
              Source: {result.source}
            </p>
          )}
        </div>

        {!result && !busy && (
          <div className="grid min-h-80 place-items-center rounded-[2rem] bg-slate-50 p-8 text-center">
            <div>
              <div className="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-white text-slate-500 shadow-sm">
                <Pill size={30} />
              </div>
              <h3 className="mt-5 text-lg font-black text-slate-800">No medicine searched yet</h3>
              <p className="mt-2 text-sm text-slate-500">Your latest lookup result will appear here.</p>
            </div>
          </div>
        )}

        {busy && (
          <div className="grid min-h-80 place-items-center rounded-[2rem] bg-slate-50 p-8 text-center">
            <Loader2 className="mx-auto animate-spin text-teal-700" size={34} />
            <p className="mt-4 font-black text-slate-700">Fetching medicine details...</p>
          </div>
        )}

        {result?.error && (
          <div className="rounded-3xl bg-rose-50 p-5 text-rose-900 ring-1 ring-rose-200">
            <div className="flex gap-3">
              <AlertTriangle className="shrink-0" />
              <div>
                <h3 className="font-black">Medicine not found</h3>
                <p className="mt-2 text-sm leading-6">{result.message}</p>
                <p className="mt-2 text-sm leading-6">{result.suggestion}</p>
              </div>
            </div>
          </div>
        )}

        {result && !result.error && (
          <div className="space-y-4">
            {result.category && (
              <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                {result.category}
              </span>
            )}

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-3xl bg-emerald-50 p-5 ring-1 ring-emerald-100">
                <h3 className="text-base font-black text-emerald-800">Uses</h3>
                <p className="mt-2 text-base leading-7 text-emerald-900 font-medium">{result.uses}</p>
              </div>

              <div className="rounded-3xl bg-rose-50 p-5 ring-1 ring-rose-100">
                <h3 className="text-base font-black text-rose-800">Side Effects</h3>
                <p className="mt-2 text-base leading-7 text-rose-900 font-medium">{result.side_effects}</p>
              </div>
            </div>

            {result.warnings && (
              <div className="rounded-2xl bg-amber-50 px-4 py-3 ring-1 ring-amber-100">
                <p className="text-xs font-bold text-amber-800">Warnings</p>
                <p className="mt-1 text-xs leading-5 text-amber-700">{result.warnings}</p>
              </div>
            )}

            <DetailBlock title="Disclaimer" text={result.disclaimer} />
          </div>
        )}
      </GlowCard>
    </div>
  )
}

export default MedicinePage