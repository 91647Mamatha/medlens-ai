import { useState } from 'react'
import { FileText, Trash2 } from 'lucide-react'
import DetailBlock from '../components/DetailBlock'
import EmptyState from '../components/EmptyState'
import GlowCard from '../components/GlowCard'
import { formatDate, parseEntities } from '../utils/format'

function HistoryPage({ api, reports, refreshReports, showToast }) {
  const [selectedReport, setSelectedReport] = useState(null)
  const [loadingId, setLoadingId] = useState('')

  const openReport = async (reportId) => {
    setLoadingId(reportId)
    try {
      const response = await api.get(`/history/${reportId}`)
      setSelectedReport(response.data)
    } catch {
      showToast('Could not open report')
    } finally {
      setLoadingId('')
    }
  }

  const deleteReport = async (reportId) => {
    const confirmed = window.confirm('Delete this report permanently? This cannot be undone.')
    if (!confirmed) return

    try {
      await api.delete(`/history/${reportId}`)
      setSelectedReport(null)
      await refreshReports()
      showToast('Report deleted')
    } catch {
      showToast('Could not delete report')
    }
  }

  const entities = parseEntities(selectedReport?.entities)

  return (
    <div className="grid gap-6 xl:grid-cols-[380px_1fr]">
      <GlowCard className="p-0">
        <div className="p-5">
          <div className="mb-5">
            <p className="text-sm font-black uppercase tracking-wide text-teal-700">History service</p>
            <h2 className="mt-1 text-2xl font-black">Saved reports</h2>
            <p className="mt-2 text-sm text-slate-500">{reports.length} reports saved</p>
          </div>

          <div className="max-h-[calc(100vh-260px)] space-y-3 overflow-y-auto pr-1 med-scroll">
            {reports.map((report) => (
              <button
                key={report.report_id}
                onClick={() => openReport(report.report_id)}
                className={`w-full rounded-3xl border p-4 text-left transition hover:-translate-y-0.5 hover:shadow-lg ${
                  selectedReport?.report_id === report.report_id
                    ? 'border-teal-300 bg-teal-50'
                    : 'border-slate-200 bg-white'
                }`}
              >
                <div className="flex gap-3">
                  <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-blue-50 text-blue-700">
                    <FileText size={21} />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-black text-slate-950">{report.file_name}</p>
                    <p className="mt-1 text-xs font-semibold text-slate-500">{formatDate(report.created_at)}</p>
                    {loadingId === report.report_id && (
                      <p className="mt-2 text-xs font-black text-teal-700">Opening...</p>
                    )}
                  </div>
                </div>
              </button>
            ))}

            {reports.length === 0 && (
              <EmptyState title="No reports yet" text="Upload and analyze a report to see it here." />
            )}
          </div>
        </div>
      </GlowCard>

      <GlowCard className="p-0">
        <div className="p-5">
          {!selectedReport ? (
            <EmptyState title="Select a report" text="Choose any saved report to view summaries, abnormal values, entities, and extracted text." />
          ) : (
            <div className="space-y-5">
              <div className="flex flex-col gap-4 rounded-3xl bg-slate-950 p-5 text-white md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="text-sm font-black uppercase tracking-wide text-teal-300">Report details</p>
                  <h2 className="mt-2 break-words text-2xl font-black">{selectedReport.file_name}</h2>
                  <p className="mt-2 break-all text-xs text-slate-300">Report ID: {selectedReport.report_id}</p>
                </div>
                <button
                  onClick={() => deleteReport(selectedReport.report_id)}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-rose-600 px-4 py-3 text-sm font-black text-white"
                >
                  <Trash2 size={17} />
                  Delete
                </button>
              </div>

              <div className="grid gap-4 lg:grid-cols-2">
                <DetailBlock title="Patient Summary" text={selectedReport.patient_summary} tone="success" />
                <DetailBlock title="Doctor Summary" text={selectedReport.doctor_summary} />
                <DetailBlock title="Health Tips" text={selectedReport.health_tips} />
                <DetailBlock title="Recommendations" text={selectedReport.recommendations} />
                <DetailBlock title="Abnormal Values" text={selectedReport.abnormal_values} tone="danger" />
              </div>

              {entities.length > 0 && (
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                  <h3 className="font-black">Medical Entities</h3>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {entities.map((entity, index) => (
                      <span key={`${entity.text}-${index}`} className="rounded-full bg-white px-3 py-2 text-xs font-black text-slate-700 shadow-sm ring-1 ring-slate-200">
                        {entity.text} · {entity.category}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <details className="rounded-3xl border border-slate-200 bg-white p-5">
                <summary className="cursor-pointer font-black">Extracted Text</summary>
                <p className="mt-4 max-h-96 overflow-y-auto whitespace-pre-wrap text-sm leading-6 text-slate-600 med-scroll">
                  {selectedReport.extracted_text}
                </p>
              </details>
            </div>
          )}
        </div>
      </GlowCard>
    </div>
  )
}

export default HistoryPage