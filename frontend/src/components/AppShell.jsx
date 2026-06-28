import {
  Activity,
  Bell,
  Bot,
  FileText,
  HeartPulse,
  History,
  LogOut,
  Menu,
  Pill,
  Sparkles,
  Stethoscope,
  Upload,
  X,
} from 'lucide-react'
import { useState } from 'react'

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: Activity },
  { id: 'upload', label: 'Upload', icon: Upload },
  { id: 'history', label: 'History', icon: History },
  { id: 'chat', label: 'AI Chat', icon: Bot },
  { id: 'medicine', label: 'Medicine', icon: Pill },
  { id: 'notifications', label: 'Alerts', icon: Bell },
  { id: 'trend', label: 'Trends', icon: HeartPulse },
]

function AppShell({ user, page, setPage, notifications, refreshNotifications, logout, children }) {
  const [mobileOpen, setMobileOpen] = useState(false)

  const openPage = (id) => {
    setPage(id)
    setMobileOpen(false)
  }

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-[#0f1e29] via-[#0b253a] to-[#121829] text-slate-100 font-[Inter]">
      {/* Ambient glow fields */}
      <div className="absolute left-[-5%] top-[-5%] h-[500px] w-[500px] rounded-full bg-cyan-500/10 blur-[130px] pointer-events-none" />
      <div className="absolute right-[-5%] bottom-[-5%] h-[500px] w-[500px] rounded-full bg-teal-500/10 blur-[130px] pointer-events-none" />

      {/* Desktop sidebar */}
      <div
        style={{ background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(24px)' }}
        className="fixed inset-y-0 left-0 z-30 hidden w-72 border-r border-cyan-500/10 px-5 py-5 shadow-2xl shadow-black/40 lg:block"
      >
        <Brand />
        <Nav page={page} openPage={openPage} />
        <UserCard user={user} />
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-slate-950/60 lg:hidden">
          <div
            style={{ background: 'rgba(15, 23, 42, 0.95)', backdropFilter: 'blur(24px)' }}
            className="h-full w-80 max-w-[88vw] px-5 py-5 shadow-2xl border-r border-cyan-500/10"
          >
            <div className="mb-5 flex items-center justify-between">
              <Brand compact />
              <button onClick={() => setMobileOpen(false)} className="rounded-xl p-2 text-slate-300 hover:bg-slate-800/60">
                <X size={22} />
              </button>
            </div>
            <Nav page={page} openPage={openPage} />
          </div>
        </div>
      )}

      <main className="relative z-10 lg:pl-72">
        <header
          style={{ background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(24px)' }}
          className="sticky top-0 z-20 border-b border-cyan-500/10 px-4 py-4 md:px-8"
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileOpen(true)}
                className="rounded-xl border border-cyan-500/20 p-2 text-cyan-300 lg:hidden"
              >
                <Menu size={22} />
              </button>
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-cyan-400">
                  {user.role === 'doctor' ? 'Doctor workspace' : 'Patient workspace'}
                </p>
                <h1 className="text-xl font-black text-white md:text-2xl tracking-tight">
                  {pageTitle(page)}
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => { refreshNotifications(); openPage('notifications') }}
                className="relative grid h-11 w-11 place-items-center rounded-xl border border-cyan-500/20 bg-slate-900/60 text-cyan-300 shadow-sm hover:border-cyan-400/40"
                title="Refresh alerts"
              >
                <Bell size={20} />
                {notifications?.unread > 0 && (
                  <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-cyan-400 px-1 text-xs font-black text-slate-950">
                    {notifications.unread}
                  </span>
                )}
              </button>
              <button
                onClick={logout}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 px-4 py-3 text-sm font-black text-white shadow-lg shadow-cyan-500/20 hover:opacity-90"
              >
                <LogOut size={17} />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </header>

        {/* 👇 Change this section wrapper to a clean light background 👇 */}
        <section className="px-4 py-6 md:px-8 flex-1 flex w-full bg-[#f8fafc] text-slate-900">
          {children}
        </section>
      </main>
      <AssistantOrb onOpen={() => openPage('chat')} />
    </div>
  )
}

function Brand({ compact = false }) {
  return (
    <div className={`flex items-center gap-3 ${compact ? '' : 'mb-8'}`}>
      <div className="relative grid h-12 w-12 place-items-center rounded-2xl bg-slate-900 border border-cyan-500/30 text-white shadow-xl shadow-cyan-500/10">
        <Stethoscope size={22} strokeWidth={2.2} className="text-cyan-400" />
        <span className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-cyan-400 text-slate-950 shadow-sm">
          <Sparkles size={11} />
        </span>
      </div>
      <div>
        <h2 className="text-lg font-black text-white tracking-tight">MedLens AI</h2>
        <p className="text-xs font-semibold text-slate-400">Smart report analysis</p>
      </div>
    </div>
  )
}

function Nav({ page, openPage }) {
  return (
    <nav className="space-y-1">
      {navItems.map((item) => {
        const Icon = item.icon
        const active = page === item.id

        return (
          <button
            key={item.id}
            onClick={() => openPage(item.id)}
            className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-black transition ${
              active
                ? 'bg-gradient-to-r from-cyan-500/20 to-teal-500/20 border border-cyan-400/30 text-cyan-300 shadow-lg shadow-cyan-500/10'
                : 'text-slate-400 hover:bg-slate-800/60 hover:text-white'
            }`}
          >
            <Icon size={19} />
            {item.label}
          </button>
        )
      })}
    </nav>
  )
}

function UserCard({ user }) {
  return (
    <div
      style={{ background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(34, 211, 238, 0.15)' }}
      className="absolute bottom-5 left-5 right-5 overflow-hidden rounded-2xl p-4"
    >
      <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-cyan-400/10 blur-2xl" />
      <div className="relative">
        <div className="mb-3 grid h-11 w-11 place-items-center rounded-xl bg-cyan-500/10 border border-cyan-500/20">
          <FileText size={21} className="text-cyan-400" />
        </div>
        <p className="font-black text-white">{user.full_name}</p>
        <p className="mt-1 truncate text-xs text-slate-400">{user.email}</p>
        <p className="mt-3 inline-flex rounded-full bg-cyan-400 px-3 py-1 text-xs font-black text-slate-950">
          {user.role}
        </p>
      </div>
    </div>
  )
}

function pageTitle(page) {
  const titles = {
    dashboard: 'Dashboard',
    upload: 'Upload Report',
    history: 'Report History',
    chat: 'AI Health Assistant',
    medicine: 'Medicine Lookup',
    notifications: 'Notifications',
    trend: 'Health Trends',
  }

  return titles[page] || 'Dashboard'
}
function AssistantOrb({ onOpen }) {
  const [showBubble, setShowBubble] = useState(true)
  const chips = ['Explain my CBC panel', "What's a normal hemoglobin level?", 'Find a medicine']

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {showBubble && (
        <div className="relative max-w-[260px] rounded-2xl border border-cyan-400/20 bg-[#1E293B]/95 p-4 text-white shadow-2xl shadow-black/30 backdrop-blur-xl animate-fade-in">
          <button
            onClick={() => setShowBubble(false)}
            className="absolute right-2 top-2 text-slate-400 hover:text-white"
          >
            <X size={14} />
          </button>
          <p className="pr-4 text-sm font-medium text-slate-100">
            Need help analyzing a medical term?
          </p>
          <div className="mt-3 flex flex-col gap-2">
            {chips.map((chip) => (
              <button
                key={chip}
                onClick={onOpen}
                className="rounded-full border border-cyan-400/40 bg-cyan-400/10 px-3 py-1.5 text-left text-xs font-medium text-cyan-200 hover:bg-cyan-400/20 transition"
              >
                {chip}
              </button>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={onOpen}
        className="relative grid h-14 w-14 place-items-center rounded-full bg-gradient-to-br from-cyan-400 to-emerald-400 text-slate-900 shadow-xl shadow-cyan-500/40 animate-orb-pulse"
      >
        <Bot size={24} />
      </button>
    </div>
  )
}

export default AppShell