import { useEffect, useMemo, useState } from 'react'
import { createApiClient } from './api/client'
import AppShell from './components/AppShell'
import AuthPage from './pages/AuthPage'
import DashboardPage from './pages/DashboardPage'
import UploadPage from './pages/UploadPage'
import HistoryPage from './pages/HistoryPage'
import ChatPage from './pages/ChatPage'
import MedicinePage from './pages/MedicinePage'
import NotificationsPage from './pages/NotificationsPage'
import TrendPage from './pages/TrendPage'

function App() {
  const [token, setToken] = useState(localStorage.getItem('medlens_token') || '')
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('medlens_user')
    return saved ? JSON.parse(saved) : null
  })
  const [page, setPage] = useState('dashboard')
  const [toast, setToast] = useState('')
  const [reports, setReports] = useState([])
  const [uploads, setUploads] = useState([])
  const [notifications, setNotifications] = useState({
    total: 0,
    unread: 0,
    notifications: [],
  })
  const [trend, setTrend] = useState(null)

const api = useMemo(() => {
  const client = createApiClient(token)

  client.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        localStorage.removeItem('medlens_token')
        localStorage.removeItem('medlens_user')
        setToken('')
        setUser(null)
        setReports([])
        setUploads([])
        setNotifications({ total: 0, unread: 0, notifications: [] })
        setTrend(null)
        setPage('dashboard')
        showToast('Session expired. Please login again.')
      }

      return Promise.reject(error)
    }
  )

  return client
}, [token])

  const showToast = (message) => {
    setToast(message)
    window.setTimeout(() => setToast(''), 2600)
  }

  const logout = () => {
    localStorage.removeItem('medlens_token')
    localStorage.removeItem('medlens_user')
    setToken('')
    setUser(null)
    setReports([])
    setUploads([])
    setNotifications({ total: 0, unread: 0, notifications: [] })
    setTrend(null)
    setPage('dashboard')
  }

  const refreshReports = async () => {
    const response = await api.get('/history/all')
    setReports(response.data.reports || [])
  }

  const refreshUploads = async () => {
    const response = await api.get('/upload/my-uploads')
    setUploads(response.data.uploads || [])
  }

  const refreshNotifications = async () => {
    const response = await api.get('/notifications/my')
    setNotifications(response.data)
  }

  useEffect(() => {
    if (!token) return

    refreshReports().catch(() => {})
    refreshUploads().catch(() => {})
    refreshNotifications().catch(() => {})
  }, [token])

  if (!token || !user) {
    return (
      <>
        <AuthPage setToken={setToken} setUser={setUser} showToast={showToast} />
        <Toast message={toast} />
      </>
    )
  }

  return (
    <>
      <AppShell
        user={user}
        page={page}
        setPage={setPage}
        notifications={notifications}
        refreshNotifications={refreshNotifications}
        logout={logout}
      >
        {page === 'dashboard' && (
          <DashboardPage
            user={user}
            reports={reports}
            uploads={uploads}
            notifications={notifications}
            setPage={setPage}
          />
        )}

        {page === 'upload' && (
          <UploadPage
            user={user}
            api={api}
            refreshReports={refreshReports}
            refreshUploads={refreshUploads}
            refreshNotifications={refreshNotifications}
            showToast={showToast}
          />
        )}

        {page === 'history' && (
          <HistoryPage
            api={api}
            reports={reports}
            refreshReports={refreshReports}
            showToast={showToast}
          />
        )}

        {page === 'chat' && (
          <ChatPage api={api} reports={reports} showToast={showToast} />
        )}

        {page === 'medicine' && (
          <MedicinePage api={api} showToast={showToast} />
        )}

        {page === 'notifications' && (
          <NotificationsPage
            api={api}
            notifications={notifications}
            refreshNotifications={refreshNotifications}
            showToast={showToast}
          />
        )}

        {page === 'trend' && (
          <TrendPage
            api={api}
            trend={trend}
            setTrend={setTrend}
            showToast={showToast}
          />
        )}
      </AppShell>

      <Toast message={toast} />
    </>
  )
}

function Toast({ message }) {
  if (!message) return null

  return (
    <div className="fixed bottom-5 right-5 z-50 max-w-sm rounded-2xl bg-slate-950 px-5 py-4 text-sm font-black text-white shadow-2xl">
      {message}
    </div>
  )
}

export default App