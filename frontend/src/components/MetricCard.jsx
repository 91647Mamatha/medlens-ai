import GlowCard from './GlowCard'

const colorStyles = {
  cyan: 'bg-cyan-500/10 text-cyan-600',
  emerald: 'bg-emerald-500/10 text-emerald-600',
  rose: 'bg-rose-500/10 text-rose-600',
  violet: 'bg-violet-500/10 text-violet-600',
}

function MetricCard({ label, value, caption, icon: Icon, color = 'cyan', onClick }) {
  return (
    <GlowCard onClick={onClick}>
      <div className="flex items-center justify-between">
        <p className="text-xs font-black uppercase tracking-wider text-slate-500">{label}</p>
        <div className={`grid h-9 w-9 place-items-center rounded-xl ${colorStyles[color]}`}>
          <Icon size={18} />
        </div>
      </div>
      <p className="mt-3 text-3xl font-black text-slate-900">{value}</p>
      <p className="mt-1 text-xs font-medium text-slate-500">{caption}</p>
    </GlowCard>
  )
}

export default MetricCard