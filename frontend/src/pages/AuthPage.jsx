import axios from 'axios'
import { useState } from 'react'
import { Activity, Brain, HeartPulse, ShieldCheck, Sparkles, Stethoscope, UserRound, Pill, Eye, EyeOff } from 'lucide-react'
import { API_BASE } from '../api/client'

function AuthPage({ setToken, setUser, showToast }) {
  const [mode, setMode] = useState('login')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [shake, setShake] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [form, setForm] = useState({
    full_name: '',
    email: '',
    password: '',
    role: 'patient',
  })

  const triggerShake = () => {
    setShake(true)
    setTimeout(() => setShake(false), 500)
  }

  const submit = async (event) => {
    event.preventDefault()
    setError('')
    setLoading(true)

    try {
      const endpoint = mode === 'login' ? '/auth/login' : '/auth/register'
      const payload =
        mode === 'login'
          ? { email: form.email, password: form.password }
          : form

      const response = await axios.post(`${API_BASE}${endpoint}`, payload)

      if (mode === 'register') {
        if (response.data.error) {
          setError(response.data.message || 'Registration failed')
          triggerShake()
          return
        }

        showToast(response.data.message || 'Account created')
        setMode('login')
        return
      }

      if (!response.data.access_token) {
        setError(response.data.message || 'Invalid email or password')
        triggerShake()
        return
      }

      const user = {
        full_name: response.data.full_name,
        email: form.email,
        role: response.data.role,
      }

      localStorage.setItem('medlens_token', response.data.access_token)
      localStorage.setItem('medlens_user', JSON.stringify(user))

      setToken(response.data.access_token)
      setUser(user)
    } catch (error) {
      setError(error.response?.data?.detail || 'Unable to continue')
      triggerShake()
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen relative overflow-hidden bg-gradient-to-br from-[#0f1e29] via-[#0b253a] to-[#121829] text-slate-100 font-[Inter]">
      {/* Precision Medical Grid Backdrop */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.45]" 
        style={{
          backgroundImage: `linear-gradient(to right, #e2e8f0 1px, transparent 1px),
                            linear-gradient(to bottom, #e2e8f0 1px, transparent 1px)`,
          backgroundSize: '36px 36px',
          maskImage: 'radial-gradient(ellipse at center, black, transparent 85%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, black, transparent 85%)'
        }}
      />

      {/* Hospital Telemetry Ambient Lighting Fields */}
      <div className="absolute left-[-5%] top-[-5%] h-[600px] w-[600px] rounded-full bg-cyan-500/10 blur-[130px] pointer-events-none" />
      <div className="absolute right-[-5%] bottom-[-5%] h-[600px] w-[600px] rounded-full bg-teal-500/10 blur-[130px] pointer-events-none" />

      {/* Subdued Watermark Stethoscope layered behind the heartbeat grid */}
      <div className="absolute left-[5%] bottom-[8%] text-slate-300/40 pointer-events-none hidden lg:block transform -rotate-12">
        <Stethoscope size={280} strokeWidth={0.8} />
      </div>

      <div className="relative z-10 mx-auto grid min-h-screen max-w-7xl grid-cols-1 lg:grid-cols-[1.1fr_0.9fr]">

        {/* ================= LEFT PANEL: MEDICAL TELEMETRY DISPLAY ================= */}
        <section className="relative flex flex-col justify-center overflow-hidden px-6 py-12 md:px-16 border-b lg:border-b-0 lg:border-r border-slate-200/80">

          {/* Vibrant High-Contrast Neon Clinical Heartbeat Line */}
        <div className="absolute inset-x-0 top-[40%] h-32 pointer-events-none">
          <svg className="w-full h-full opacity-100" viewBox="0 0 600 100" preserveAspectRatio="none">
            <path
              d="M0,50 L120,50 L135,15 L150,85 L165,42 L180,58 L195,50 L600,50"
              fill="none"
              stroke="#22d3ee" /* Electric Cyan Line */
              strokeWidth="3.5"
              className="ecg-path"
            />
          </svg>
        </div>

        {/* Hyper-Highlighted Electric Neon Capsules */}
        <div className="pointer-events-none absolute -right-4 top-16 h-8 w-24 rounded-full bg-gradient-to-r from-cyan-400 to-teal-500 shadow-lg shadow-cyan-500/50 animate-float-slow" />
        <div className="pointer-events-none absolute left-10 bottom-32 h-6 w-16 rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400 shadow-lg shadow-emerald-500/40 animate-float-slower" />


          {/* Floating Organic Medical Capsules */}
          {/* Sharp, Dark Medical Capsules for High Contrast */}
          <div className="pointer-events-none absolute -right-4 top-16 h-8 w-24 rounded-full bg-slate-900 border border-slate-700 shadow-md animate-float-slow" />
          <div className="pointer-events-none absolute left-10 bottom-32 h-6 w-16 rounded-full bg-teal-950 border border-teal-800 shadow-md animate-float-slower" />
          <div className="pointer-events-none absolute right-24 bottom-16 h-5 w-12 rounded-full bg-cyan-950 border border-cyan-800 shadow-sm animate-float-slow" />
          <div className="relative z-10">
            {/* Master Ecosystem Header with high contrast text */}
          <div className="mb-12 flex items-center gap-3">
            <div className="relative grid h-14 w-14 place-items-center rounded-2xl bg-slate-900 border border-cyan-500/30 text-white shadow-xl shadow-cyan-500/10">
              <Stethoscope size={24} strokeWidth={2.2} className="text-cyan-400" />
              <span className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-cyan-400 text-slate-950 shadow-sm">
                <Sparkles size={11} />
              </span>
            </div>
            <div>
              {/* Changed text-slate-900 to text-white */}
              <h1 className="text-2xl font-black text-white tracking-tight">MediLens AI</h1>
              {/* Changed text-slate-400 to text-slate-300 */}
              <p className="text-xs font-bold text-slate-300 tracking-widest uppercase mt-0.5">Clinical Systems Ecosystem</p>
            </div>
          </div>

            {/* Clean Professional Solid Heading Syntax */}
           <h2 className="max-w-2xl text-4xl font-extrabold leading-[1.15] tracking-tight text-white md:text-5xl">
            Understand Your Medical <br />
            <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent font-black">
            Report With AI 
            </span>
          </h2>

          <p className="mt-4 max-w-lg text-sm leading-relaxed text-slate-300 font-medium">
            Upload diagnostic files, generate precise clinical charts, isolate pharmaceutical interactions, and monitor your tracking metrics effortlessly.
          </p>

            {/* Shifted Feature Modules down to leave clean visual track space for the wave line */}
            <div className="mt-44 grid max-w-2xl gap-4 sm:grid-cols-2">
              <Feature icon={Brain} title="AI summaries" text="Simple for patients, highly detailed structure for medical staff." color="cyan" />
              <Feature icon={ShieldCheck} title="Secure access" text="Encrypted data tokens keeping health profiles entirely isolated." color="emerald" />
              <Feature icon={Pill} title="Medicine lookup" text="Instantly isolate indications, collateral actions, and risks." color="cyan" />
              <Feature icon={Activity} title="Smart workflow" text="Upload diagnostic documents once, track changes continuously." color="emerald" />
            </div>
          </div>
        </section>

        {/* ================= RIGHT PANEL: INTERFACE FORM CONSOLE ================= */}
        <section className="flex items-center justify-center px-6 py-12 md:px-12 bg-transparent relative z-10">
            <div
              style={{
                background: 'rgba(15, 23, 42, 0.6)',
                border: '1px solid rgba(34, 211, 238, 0.2)',
                backdropFilter: 'blur(24px)',
                WebkitBackdropFilter: 'blur(24px)'
              }}
              className={`w-full max-w-[430px] rounded-3xl p-8 shadow-2xl shadow-black/80 transition-all duration-300 ${shake ? 'animate-shake' : ''}`}
            >
            <div className="mb-8">
              <p className="text-xs font-black uppercase tracking-widest text-cyan-400">
                {mode === 'login' ? 'Authentication Secure' : 'Registration Protocol'}
              </p>
              {/* Changed from text-slate-900 to text-white so it stands out cleanly */}
              <h2 className="mt-1.5 text-3xl font-black text-white tracking-tight">
                {mode === 'login' ? 'Welcome Back' : 'Create Account'}
              </h2>
              {/* Changed from text-slate-500 to text-slate-300 for premium readability */}
              <p className="text-slate-300 text-xs font-semibold mt-1">
                {mode === 'login' ? 'Access your medical telemetry logs.' : 'Sign up to start parsing your healthcare data.'}
              </p>
          </div>

            <form onSubmit={submit}>
              {mode === 'register' && (
                <>
                  <Field 
                    label="Full name" 
                    value={form.full_name} 
                    placeholder="John Doe"
                    onChange={(value) => setForm({ ...form, full_name: value })} 
                  />

                  <div className="mb-5">
                    <span className="mb-2.5 block text-xs font-bold uppercase tracking-wider text-slate-400">Portal Access Tier</span>
                    <div className="grid grid-cols-2 gap-3">
                      <RoleCard
                        icon={UserRound}
                        label="Patient"
                        desc="Track personal files"
                        active={form.role === 'patient'}
                        onClick={() => setForm({ ...form, role: 'patient' })}
                      />
                      <RoleCard
                        icon={Stethoscope}
                        label="Doctor"
                        desc="Clinical overview"
                        active={form.role === 'doctor'}
                        onClick={() => setForm({ ...form, role: 'doctor' })}
                      />
                    </div>
                  </div>
                </>
              )}

              <Field 
                label="Email Address" 
                type="email" 
                placeholder="name@example.com"
                value={form.email} 
                onChange={(value) => setForm({ ...form, email: value })} 
              />
              
              <div className="mb-6">
                <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">Password</span>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    required
                    placeholder="••••••••"
                    className="h-11 w-full rounded-xl border border-slate-200 bg-white/80 px-4 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-300 focus:bg-white focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="mb-5 flex items-center gap-2 rounded-xl bg-red-50 border border-red-100 p-3 text-xs font-bold text-red-600">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                  {error}
                </div>
              )}

              {mode === 'register' && (
                <div className="mb-6 rounded-xl bg-slate-50 border border-slate-200 px-4 py-3 text-[11px] font-semibold leading-relaxed text-slate-600">
                  <span className="font-bold text-slate-800 block mb-0.5">Security Notice:</span>
                  Requires 8+ keys mixing alphanumeric characters and specialized symbols.
                </div>
              )}

              <button
                disabled={loading}
                className="h-11 w-full rounded-xl text-sm font-bold bg-slate-900 text-white shadow-xl shadow-slate-900/10 transition-all duration-200 hover:bg-slate-800 active:scale-[0.99] disabled:opacity-50"
              >
                {loading ? 'Validating Entry...' : mode === 'login' ? 'Sign In To Interface' : 'Establish Digital Account'}
              </button>

              <button
                type="button"
                onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError('') }}
                className="mt-6 w-full text-center text-xs font-bold text-slate-500 tracking-wide transition hover:text-slate-900 hover:underline underline-offset-4"
              >
                {mode === 'login' ? "Need an account? Register" : 'Already configured? Access Portal'}
              </button>
            </form>
          </div>
        </section>
      </div>
    </main>
  )
}

function Field({ label, value, onChange, type = 'text', placeholder }) {
  return (
    <label className="mb-5 block">
      <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required
        placeholder={placeholder}
        className="h-11 w-full rounded-xl border border-slate-200 bg-white/80 px-4 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-300 focus:bg-white focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5"
      />
    </label>
  )
}

function RoleCard({ icon: Icon, label, desc, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-xl border p-3 text-left transition-all duration-200 ${
        active 
          ? 'border-slate-900 bg-slate-50 shadow-sm' 
          : 'border-slate-200 bg-white/70 hover:border-slate-300'
      }`}
    >
      <Icon size={18} className={active ? 'text-slate-900' : 'text-slate-400'} />
      <p className="mt-2 text-xs font-bold text-slate-900 tracking-tight">{label}</p>
      <p className="text-[10px] font-semibold text-slate-400 mt-0.5 leading-none">{desc}</p>
    </button>
  )
}
function Feature({ icon: Icon, title, text, color }) {
  const colors = {
    cyan: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
    emerald: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  }

  return (
    <div 
      style={{ background: 'rgba(15, 23, 42, 0.45)', border: '1px solid rgba(255, 255, 255, 0.08)' }}
      className="rounded-2xl p-4 backdrop-blur-md shadow-lg"
    >
      <div className={`mb-3 grid h-9 w-9 place-items-center rounded-xl border ${colors[color]}`}>
        <Icon size={18} />
      </div>
      <h3 className="text-xs font-bold text-white tracking-tight">{title}</h3>
      <p className="mt-1 text-[11px] leading-relaxed text-slate-300 font-medium">{text}</p>
    </div>
  )
}


export default AuthPage