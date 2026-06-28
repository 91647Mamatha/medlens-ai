import { AlertTriangle, CheckCircle2, ClipboardList } from 'lucide-react'
import { safeText } from '../utils/format'

const toneStyles = {
  normal: {
    card: 'border-slate-200 bg-white',
    icon: 'bg-blue-50 text-blue-700',
    Icon: ClipboardList,
  },
  success: {
    card: 'border-emerald-200 bg-emerald-50',
    icon: 'bg-emerald-100 text-emerald-700',
    Icon: CheckCircle2,
  },
  danger: {
    card: 'border-rose-200 bg-rose-50',
    icon: 'bg-rose-100 text-rose-700',
    Icon: AlertTriangle,
  },
}

function DetailBlock({ title, text, tone = 'normal' }) {
  if (!text) return null

  const styles = toneStyles[tone] || toneStyles.normal
  const Icon = styles.Icon

  return (
    <article className={`rounded-2xl border p-5 shadow-sm ${styles.card}`}>
      <div className="flex items-start gap-3">
        <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${styles.icon}`}>
          <Icon size={20} />
        </div>
        <div className="min-w-0">
          <h3 className="text-sm font-black uppercase tracking-wide text-slate-700">
            {title}
          </h3>
          <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-700">
            {safeText(text)}
          </p>
        </div>
      </div>
    </article>
  )
}

export default DetailBlock