import { useState } from 'react'
import { Activity, AlertTriangle, BarChart3, FileText, HeartPulse, Loader2, TrendingDown, TrendingUp, Minus } from 'lucide-react'
import { AreaChart, Area, ResponsiveContainer, YAxis } from 'recharts'
import DetailBlock from '../components/DetailBlock'
import GlowCard from '../components/GlowCard'

function TrendPage({ api, trend, setTrend, showToast }) {
  const [busy, setBusy] = useState(false)

  const analyze = async () => {
    setBusy(true)
    try {
      const response = await api.get('/trend/analyze')
      setTrend(response.data)
    } catch {
      showToast('Trend analysis failed')
    } finally {
      setBusy(false)
    }
  }

  const trends = trend?.parameter_trends || []

  return (
    <div className="grid gap-6 xl:grid-cols-[380px_1fr]">
      <GlowCard>
        <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-violet-600 via-blue-600 to-teal-500 p-6 text-white shadow-xl shadow-blue-500/20">
          <div className="grid h-16 w-16 place-items-center rounded-3xl bg-white/15 ring-1 ring-white/20">
            <HeartPulse size={34} />
          </div>
          <h2 className="mt-5 text-3xl font-black">Health Trends</h2>
          <p className="mt-3 text-sm leading-6 text-white/85">
            Analyze saved reports together to see improving, declining, or stable health patterns.
          </p>
        </div>

        <button
          onClick={analyze}
          disabled={busy}
          className="mt-5 inline-flex h-13 w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-4 text-sm font-black text-white shadow-lg shadow-slate-950/20"
        >
          {busy ? <Loader2 className="animate-spin" size={18} /> : <BarChart3 size={18} />}
          {busy ? 'Analyzing trends...' : 'Analyze trends'}
        </button>

        <div className="mt-5 rounded-3xl bg-slate-50 p-4">
          <p className="text-sm leading-6 text-slate-600">
            Trend analysis works best when the user has two or more saved reports.
          </p>
        </div>
      </GlowCard>

      <GlowCard>
        <div className="mb-6">
          <p className="text-sm font-black uppercase tracking-wide text-violet-700">Analytics</p>
          <h2 className="mt-1 text-3xl font-black">Trend dashboard</h2>
        </div>

        {!trend && !busy && (
          <div className="grid min-h-80 place-items-center rounded-[2rem] bg-slate-50 p-8 text-center">
            <div>
              <div className="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-white text-slate-500 shadow-sm">
                <Activity size={30} />
              </div>
              <h3 className="mt-5 text-lg font-black text-slate-800">No trend analysis yet</h3>
              <p className="mt-2 text-sm text-slate-500">Click analyze to generate trend insights.</p>
            </div>
          </div>
        )}

        {busy && (
          <div className="grid min-h-80 place-items-center rounded-[2rem] bg-slate-50 p-8 text-center">
            <Loader2 className="mx-auto animate-spin text-violet-700" size={34} />
            <p className="mt-4 font-black text-slate-700">Analyzing saved reports...</p>
          </div>
        )}

        {trend && !busy && (
          <div className="space-y-5">
            {trend.error && (
              <div className="rounded-3xl bg-rose-50 p-5 text-rose-900 ring-1 ring-rose-200">
                <div className="flex gap-3">
                  <AlertTriangle className="shrink-0" />
                  <div>
                    <h3 className="font-black">{trend.error}</h3>
                    <p className="mt-2 text-sm">{trend.message}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="grid gap-4 md:grid-cols-3">
              <StatCard icon={FileText} label="Reports" value={trend.total_reports || 0} />
              <StatCard icon={Activity} label="Period" value={trend.period || 'Current'} />
              <StatCard icon={BarChart3} label="Parameters" value={trends.length} />
            </div>

            <DetailBlock title="Overall Health Trend" text={trend.overall_health_trend || trend.current_summary || trend.message} tone="success" />
            <DetailBlock title="Recommendations" text={trend.recommendations} />
            <DetailBlock title="Alert" text={trend.alert} tone="danger" />

            {trends.length > 0 && (
              <div className="grid gap-4 md:grid-cols-2">
                {trends.map((item, index) => (
                  <ParameterChart key={`${item.parameter}-${index}`} item={item} />
                ))}
              </div>
            )}
          </div>
        )}
      </GlowCard>
    </div>
  )
}

function StatCard({ icon: Icon, label, value }) {
  return (
    <GlowCard>
      <Icon size={20} className="text-violet-600" />
      <p className="mt-3 text-sm font-black text-slate-500">{label}</p>
      <p className="mt-1 break-words text-2xl font-black text-slate-950">{value}</p>
    </GlowCard>
  )
}

function ParameterChart({ item }) {
  const trendWord = String(item.trend || '').toLowerCase()
  const isDeclining = trendWord.includes('declin')
  const isStable = trendWord.includes('stable')

  const color = isDeclining ? '#f43f5e' : isStable ? '#3b82f6' : '#10b981'
  const bgTint = isDeclining ? 'bg-rose-50' : isStable ? 'bg-blue-50' : 'bg-emerald-50'
  const TrendIcon = isDeclining ? TrendingDown : isStable ? Minus : TrendingUp

  const rawValues = item.values || []
  const chartData = rawValues.map((v, i) => ({
    index: i,
    value: parseFloat(String(v).replace(/[^\d.]/g, '')) || 0,
  }))

  const gradientId = `gradient-${item.parameter?.replace(/\s+/g, '-') || 'param'}`

  return (
    <GlowCard>
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-black text-slate-950">{item.parameter}</h3>
          <p className="mt-1 text-sm leading-6 text-slate-600">{item.interpretation}</p>
        </div>
        <span className={`flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-black ${bgTint}`} style={{ color }}>
          <TrendIcon size={14} />
          {item.trend}
        </span>
      </div>

      {chartData.length > 1 && (
        <div className="mt-4 h-24">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 8, right: 4, left: 4, bottom: 0 }}>
              <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={color} stopOpacity={0.35} />
                  <stop offset="100%" stopColor={color} stopOpacity={0} />
                </linearGradient>
              </defs>
              <YAxis hide domain={['dataMin - 1', 'dataMax + 1']} />
              <Area
                type="monotone"
                dataKey="value"
                stroke={color}
                strokeWidth={3}
                fill={`url(#${gradientId})`}
                dot={{ r: 3, fill: color, strokeWidth: 0 }}
                activeDot={{ r: 5, fill: color, strokeWidth: 2, stroke: '#fff' }}
                isAnimationActive={true}
                animationDuration={800}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        {rawValues.map((value, index) => (
          <span key={`${value}-${index}`} className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-black text-slate-700">
            {value}
          </span>
        ))}
      </div>
    </GlowCard>
  )
}

export default TrendPage