import { Bell, CheckCheck, CircleAlert } from 'lucide-react'
import EmptyState from '../components/EmptyState'
import GlowCard from '../components/GlowCard'
import { formatDate } from '../utils/format'

function NotificationsPage({ api, notifications, refreshNotifications, showToast }) {
  const markRead = async (id) => {
    try {
      await api.put(`/notifications/read/${id}`)
      await refreshNotifications()
      showToast('Notification marked as read')
    } catch {
      showToast('Could not update notification')
    }
  }

  const list = notifications?.notifications || []

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-3">
        <SummaryCard label="Total Alerts" value={notifications?.total || 0} tone="blue" />
        <SummaryCard label="Unread" value={notifications?.unread || 0} tone="rose" />
        <SummaryCard label="Read" value={(notifications?.total || 0) - (notifications?.unread || 0)} tone="teal" />
      </section>

      <GlowCard>
        <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-wide text-teal-700">Notification service</p>
            <h2 className="mt-1 text-3xl font-black">Alerts and updates</h2>
          </div>
          <button
            onClick={refreshNotifications}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-4 py-3 text-sm font-black text-white"
          >
            <Bell size={17} />
            Refresh
          </button>
        </div>

        <div className="space-y-3">
          {list.map((item) => {
            const unread = Number(item.is_read) === 0

            return (
              <article
                key={item.id}
                className={`rounded-3xl border p-5 shadow-sm ${
                  unread
                    ? 'border-amber-200 bg-amber-50'
                    : 'border-slate-200 bg-white'
                }`}
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div className="flex gap-3">
                    <div className={`grid h-11 w-11 shrink-0 place-items-center rounded-2xl ${
                      unread ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-500'
                    }`}>
                      <CircleAlert size={22} />
                    </div>
                    <div>
                      <h3 className="font-black text-slate-950">{item.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-slate-600">{item.message}</p>
                      <p className="mt-2 text-xs font-semibold text-slate-400">{formatDate(item.created_at)}</p>
                    </div>
                  </div>

                  {unread && (
                    <button
                      onClick={() => markRead(item.id)}
                      className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-4 py-3 text-sm font-black text-white"
                    >
                      <CheckCheck size={17} />
                      Mark read
                    </button>
                  )}
                </div>
              </article>
            )
          })}

          {list.length === 0 && (
            <EmptyState
              title="No notifications"
              text="If report analysis creates alerts, they will appear here. Use refresh after uploading a report."
            />
          )}
        </div>
      </GlowCard>
    </div>
  )
}

function SummaryCard({ label, value, tone }) {
  const colors = {
    blue: 'from-blue-500 to-cyan-500',
    rose: 'from-rose-500 to-orange-500',
    teal: 'from-teal-500 to-emerald-500',
  }

  return (
    <GlowCard>
      <div className={`mb-4 h-2 w-14 rounded-full bg-gradient-to-r ${colors[tone]}`} />
      <p className="text-sm font-black text-slate-500">{label}</p>
      <p className="mt-2 text-4xl font-black text-slate-950">{value}</p>
    </GlowCard>
  )
}

export default NotificationsPage