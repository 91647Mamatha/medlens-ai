import { useState } from 'react'
import { Bot, Brain, FileText, Loader2, Send, Sparkles, MessageCircleQuestion } from 'lucide-react'
import GlowCard from '../components/GlowCard'

function ChatPage({ api, reports, showToast }) {
  const [reportId, setReportId] = useState('')
  const [question, setQuestion] = useState('')
  const [showNudge, setShowNudge] = useState(true)
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      answer: 'Hi, I am your MedLens assistant. Ask me about your report, a general health topic, or how to use the app.',
      source: 'MediLens Assistant',
      mode: 'welcome',
    },
  ])
  const [busy, setBusy] = useState(false)
  const suggestions = reportId
    ? [
        'Explain my report in simple words',
        'What abnormal values are present?',
        'What should I ask my doctor?',
        'What are the key findings?',
      ]
    : [
        'How do I upload a report?',
        'What is anemia?',
        'How can MedLens help me?',
        'What is diabetes?',
      ]

  const ask = async (event) => {
    event.preventDefault()
    if (!question.trim()) return

    const selectedReport = reports.find((report) => report.report_id === reportId)
    const userQuestion = question.trim()

    setMessages((prev) => [...prev, { role: 'user', question: userQuestion }])
    setQuestion('')
    setShowNudge(false)
    setBusy(true)

    try {
      const response = await api.post('/chat/ask', {
        question: userQuestion,
        report_id: reportId || null,
        report_text: selectedReport?.extracted_text || null,
      })

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          ...response.data,
        },
      ])
    } catch {
      showToast('Chat failed')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[360px_1fr]">
      <GlowCard className="p-0">
        <div className="p-5">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-cyan-600 via-cyan-500 to-emerald-500 p-5 text-white">
            <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
            <div className="relative mx-auto grid h-24 w-24 place-items-center rounded-[2rem] bg-white/15 ring-1 ring-white/25 shadow-lg">
              <Bot size={48} className="animate-bot-float" />
              <span className="absolute -right-1 -top-1 h-4 w-4 rounded-full bg-emerald-300 ring-4 ring-cyan-500 animate-pulse" />
            </div>
            <h2 className="relative mt-5 text-center text-2xl font-bold">MedLens Assistant</h2>
            <p className="relative mt-3 text-center text-sm leading-6 text-cyan-50">
              Report Q&A, general health help, and app guidance in one chat.
            </p>
          </div>

          <div className="mt-5 space-y-3">
            <Mode icon={FileText} title="Report Q&A" text="Select a saved report and ask about its findings." />
            <Mode icon={Brain} title="General Health" text="Ask simple health education questions." />
            <Mode icon={Sparkles} title="App Help" text="Ask how to upload, view history, or check trends." />
          </div>
        </div>
      </GlowCard>

      <GlowCard className="p-0 flex flex-col">
        <div className="flex min-h-[650px] flex-col">
          <div className="border-b border-slate-200 p-4">
            <select
              value={reportId}
              onChange={(event) => setReportId(event.target.value)}
              className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold text-slate-700 outline-none focus:border-cyan-500"
            >
              <option value="">General chat / MedLens help</option>
              {reports.map((report) => (
                <option key={report.report_id} value={report.report_id}>
                  {report.file_name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto bg-slate-50 p-4 med-scroll">
            {messages.map((message, index) => (
              <ChatBubble key={index} message={message} />
            ))}

            {busy && (
              <div className="flex items-center gap-3 rounded-3xl bg-white p-4 text-sm font-semibold text-slate-500 shadow-sm">
                <Loader2 className="animate-spin text-cyan-600" size={18} />
                Thinking...
              </div>
            )}
          </div>

          {showNudge && (
            <div className="mx-4 mb-3 flex items-center gap-3 rounded-2xl border border-cyan-200 bg-cyan-50 px-4 py-3">
              <MessageCircleQuestion size={18} className="shrink-0 text-cyan-600" />
              <p className="text-sm font-medium text-cyan-800">
                Need help? Ask me anything about your reports or health.
              </p>
            </div>
          )}

          <div className="border-t border-slate-200 bg-white p-4">
            <p className="mb-3 text-xs font-bold uppercase tracking-wide text-slate-400">
              Suggested questions
            </p>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setQuestion(item)}
                  className="rounded-full bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-600 transition hover:bg-cyan-50 hover:text-cyan-700"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={ask} className="border-t border-slate-200 p-4">
            <div className="flex gap-3">
              <input
                value={question}
                onChange={(event) => setQuestion(event.target.value)}
                placeholder="Ask how can I help, explain my report, or what causes anemia..."
                className="h-13 flex-1 rounded-2xl border border-slate-200 px-4 text-sm font-medium outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
              />
              <button
                disabled={busy || !question.trim()}
                className="grid h-13 w-14 place-items-center rounded-2xl bg-cyan-500 text-white shadow-lg shadow-cyan-500/30 transition hover:bg-cyan-400 disabled:opacity-50"
              >
                <Send size={20} />
              </button>
            </div>
          </form>
        </div>
      </GlowCard>
    </div>
  )
}

function Mode({ icon: Icon, title, text }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
      <div className="flex gap-3">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-white text-cyan-600 shadow-sm">
          <Icon size={20} />
        </div>
        <div>
          <p className="font-bold text-slate-900">{title}</p>
          <p className="mt-1 text-sm leading-5 text-slate-500">{text}</p>
        </div>
      </div>
    </div>
  )
}

function ChatBubble({ message }) {
  if (message.role === 'user') {
    return (
      <div className="flex justify-end">
        <div className="max-w-[82%] rounded-[1.5rem] rounded-br-md bg-slate-900 px-5 py-4 text-white">
          <p className="text-sm leading-6">{message.question}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex justify-start gap-3">
      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-cyan-500 to-emerald-500 text-white shadow-md">
        <Bot size={20} />
      </div>
      <div className="max-w-[86%] rounded-[1.5rem] rounded-bl-md bg-white px-5 py-4 shadow-sm ring-1 ring-slate-200">
        <p className="whitespace-pre-wrap text-sm leading-6 text-slate-700">{message.answer}</p>
        {message.source && (
          <p className="mt-3 inline-flex rounded-full bg-cyan-50 px-3 py-1 text-xs font-bold text-cyan-700">
            {message.source}
          </p>
        )}
      </div>
    </div>
  )
}

export default ChatPage