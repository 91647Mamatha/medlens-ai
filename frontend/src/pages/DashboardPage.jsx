import { Bell, FileText, HeartPulse, Upload, ArrowUpRight } from 'lucide-react'
import MetricCard from '../components/MetricCard'
import GlowCard from '../components/GlowCard'

function DashboardPage({ user, reports = [], uploads = [], notifications, setPage }) {
  const latestReport = reports?.[0]

  return (
    <div className="w-full space-y-6 font-[Inter]">

      {/* Welcome hero */}
      <GlowCard>
        <div className="grid gap-6 md:grid-cols-[1.2fr_0.8fr]">
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-cyan-600">
              {user.role === 'doctor' ? 'Clinical Workspace Core' : 'Patient Workspace Core'}
            </p>
            <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-900 md:text-4xl">
              Welcome back, {user.full_name?.split(' ')[0] || 'there'} 👋
            </h2>
            <p className="mt-3 max-w-xl text-xs font-medium leading-relaxed text-slate-600 md:text-sm">
              Upload diagnostic files, generate precise clinical charts, isolate pharmaceutical interactions, and monitor your tracking metrics effortlessly.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                onClick={() => setPage('upload')}
                className="rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-cyan-500/20 transition hover:opacity-90 active:scale-[0.98]"
              >
                Upload report
              </button>
              <button
                onClick={() => setPage('chat')}
                className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-xs font-bold text-slate-800 transition hover:bg-slate-50"
              >
                Ask assistant
              </button>
            </div>
          </div>

          <GlowCard className="flex flex-col justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-wider text-cyan-600">Latest report</p>
              {latestReport ? (
                <>
                  <h3 className="mt-2 text-base font-black text-slate-900 truncate">{latestReport.file_name}</h3>
                  <p className="mt-1.5 line-clamp-4 text-xs font-medium leading-relaxed text-slate-600">
                    {latestReport.patient_summary || latestReport.doctor_summary || 'Saved report ready for review.'}
                  </p>
                </>
              ) : (
                <p className="mt-3 text-xs font-medium leading-relaxed text-slate-500">
                  No active report metrics available. Securely upload a diagnostic asset to begin file parsing.
                </p>
              )}
            </div>

            {latestReport && (
              <button
                onClick={() => setPage('history')}
                className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-cyan-600 hover:text-cyan-700 transition"
              >
                View full report <ArrowUpRight size={13} />
              </button>
            )}
          </GlowCard>
        </div>
      </GlowCard>

      {/* Metrics */}
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Saved Reports" value={reports?.length || 0} caption="Analyzed history" icon={FileText} color="cyan" onClick={() => setPage('history')} />
        <MetricCard label="Uploads" value={uploads?.length || 0} caption="Files uploaded" icon={Upload} color="cyan" onClick={() => setPage('upload')} />
        <MetricCard label="Unread Alerts" value={notifications?.unread || 0} caption="Needs attention" icon={Bell} color="emerald" onClick={() => setPage('notifications')} />
        <MetricCard label="Trends" value={reports?.length > 1 ? 'Ready' : 'Soon'} caption="Needs 2+ reports" icon={HeartPulse} color="emerald" onClick={() => setPage('trend')} />
      </section>

      {/* Quick actions */}
      <section className="grid gap-4 lg:grid-cols-3">
        <GlowCard onClick={() => setPage('upload')}>
          <ActionContent title="Analyze new report" text="Upload a PDF or image and let MedLens process extraction, NLP, summary, and alerts." action="Upload" />
        </GlowCard>
        <GlowCard onClick={() => setPage('chat')}>
          <ActionContent title="Ask health assistant" text="Use report Q&A, general health chat, or MedLens help mode from one assistant." action="Chat" />
        </GlowCard>
        <GlowCard onClick={() => setPage('medicine')}>
          <ActionContent title="Search medicine" text="Check uses, side effects, interactions, warnings, and source information." action="Lookup" />
        </GlowCard>
      </section>
    </div>
  )
}

function ActionContent({ title, text, action }) {
  return (
    <div className="flex flex-col justify-between h-full">
      <div>
        <h3 className="text-sm font-black text-slate-900">{title}</h3>
        <p className="mt-2 text-xs font-medium leading-relaxed text-slate-600">{text}</p>
      </div>
      <span className="mt-4 inline-flex self-start rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 px-3.5 py-1.5 text-[11px] font-bold text-white shadow-sm">
        {action}
      </span>
    </div>
  )
}

export default DashboardPage