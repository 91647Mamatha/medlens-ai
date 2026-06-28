import { FileSearch } from 'lucide-react'

function EmptyState({ title = 'Nothing here yet', text = 'Your data will appear here when available.' }) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
      <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-white text-slate-500 shadow-sm">
        <FileSearch size={26} />
      </div>
      <h3 className="mt-4 text-base font-black text-slate-800">{title}</h3>
      <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">{text}</p>
    </div>
  )
}

export default EmptyState