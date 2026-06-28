import { useState } from 'react'
import { CloudUpload, FileCheck2, Loader2, ShieldCheck } from 'lucide-react'
import DetailBlock from '../components/DetailBlock'
import GlowCard from '../components/GlowCard'

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

function UploadPage({ api, refreshReports, refreshUploads, refreshNotifications, showToast }) {
  const [file, setFile] = useState(null)
  const [result, setResult] = useState(null)
  const [busy, setBusy] = useState(false)
  const [step, setStep] = useState('')

  const handleFileSelect = (selected) => {
    if (!selected) return
    if (selected.size > MAX_FILE_SIZE) {
      showToast('File too large — max size is 10MB')
      return
    }
    setFile(selected)
  }

  const upload = async (event) => {
    event.preventDefault()
    if (!file) return

    setBusy(true)
    setResult(null)
    setStep('Uploading file securely...')

    try {
      const data = new FormData()
      data.append('file', file)

      const uploaded = await api.post('/upload/report', data)
      setStep('Running extraction, NLP, and summary generation...')

      if (uploaded.data.error) {
        showToast(uploaded.data.error)
        return
      }

      await api.post(`/history/save/${uploaded.data.report_id}`)
      setStep('Preparing full analysis view...')
      const fullReport = await api.get(`/history/${uploaded.data.report_id}`)
      setStep('Refreshing dashboard and alerts...')

      setResult({
        upload: uploaded.data,
        analysis: fullReport.data,
      })

      await refreshReports()
      await refreshUploads()
      await refreshNotifications()

      setStep('Analysis complete')
      showToast('Report uploaded and analyzed')
    } catch (error) {
      showToast(error.response?.data?.detail || 'Upload failed')
    } finally {
      setBusy(false)
      setTimeout(() => setStep(''), 1200)
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
      <GlowCard>
        <div className="mb-6">
          <p className="text-sm font-black uppercase tracking-wide text-teal-700">Upload service</p>
          <h2 className="mt-1 text-3xl font-black">Upload and analyze report</h2>
          <p className="mt-3 text-sm leading-6 text-slate-500">
            Supported formats are PDF, PNG, JPG, and JPEG. Maximum file size is 10 MB.
          </p>
        </div>

        <form onSubmit={upload}>
          <label className="flex min-h-72 cursor-pointer flex-col items-center justify-center rounded-[2rem] border-2 border-dashed border-teal-200 bg-gradient-to-br from-teal-50 via-white to-blue-50 p-8 text-center transition hover:border-teal-400">
            <div className="grid h-16 w-16 place-items-center rounded-3xl bg-teal-600 text-white shadow-xl shadow-teal-600/20">
              <CloudUpload size={30} />
            </div>
            <h3 className="mt-5 text-xl font-black text-slate-950">
              {file ? file.name : 'Choose your medical report'}
            </h3>
            <p className="mt-2 text-sm text-slate-500">
              Click here to select a file from your computer.
            </p>
            <input
              type="file"
              accept=".pdf,.png,.jpg,.jpeg"
              onChange={(event) => handleFileSelect(event.target.files?.[0])}
              className="hidden"
            />
          </label>

          <button
            disabled={!file || busy}
            className="mt-5 inline-flex h-13 w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-4 text-sm font-black text-white shadow-lg shadow-slate-950/20 transition hover:-translate-y-0.5 hover:bg-slate-800"
          >
            {busy ? <Loader2 className="animate-spin" size={18} /> : <FileCheck2 size={18} />}
            {busy ? 'Processing...' : 'Upload and analyze'}
          </button>

          {step && (
            <div className="mt-4 rounded-3xl bg-teal-50 p-4 text-sm font-black text-teal-800 ring-1 ring-teal-100">
              {step}
            </div>
          )}
        </form>

        <div className="mt-5 rounded-3xl bg-slate-50 p-4">
          <div className="flex gap-3">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-blue-100 text-blue-700">
              <ShieldCheck size={20} />
            </div>
            <p className="text-sm leading-6 text-slate-600">
              MedLens stores upload metadata and saves the complete AI analysis into report history automatically.
            </p>
          </div>
        </div>
      </GlowCard>

      <GlowCard>
        <div className="mb-6">
          <p className="text-sm font-black uppercase tracking-wide text-blue-700">Analysis result</p>
          <h2 className="mt-1 text-3xl font-black">Latest output</h2>
        </div>

        {!result && (
          <div className="grid min-h-80 place-items-center rounded-[2rem] bg-slate-50 p-8 text-center">
            <div>
              <div className="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-white text-slate-500 shadow-sm">
                <FileCheck2 size={30} />
              </div>
              <h3 className="mt-5 text-lg font-black text-slate-800">No report analyzed yet</h3>
              <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
                After upload, patient summary, health tips, recommendations, and abnormal values will appear here.
              </p>
            </div>
          </div>
        )}

        {result && (
          <div className="space-y-4">
            <div className="rounded-3xl bg-gradient-to-r from-teal-600 via-blue-600 to-violet-600 p-5 text-white shadow-xl shadow-blue-500/20">
              <h3 className="text-lg font-black">Analysis complete</h3>
              <p className="mt-2 break-all text-sm text-white/85">Report ID: {result.upload.report_id}</p>
              <p className="mt-1 text-sm text-white/85">File: {result.upload.file_name}</p>
            </div>

            <div className="grid gap-4">
              <DetailBlock title="Patient Summary" text={result.analysis.patient_summary} tone="success" />
              <DetailBlock title="Health Tips" text={result.analysis.health_tips} />
              <DetailBlock title="Recommendations" text={result.analysis.recommendations} />
              <DetailBlock title="Abnormal Values" text={result.analysis.abnormal_values} tone="danger" />
            </div>
          </div>
        )}
      </GlowCard>
    </div>
  )
}

export default UploadPage