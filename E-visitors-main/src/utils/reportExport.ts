import type { Visitor } from '../api/visitor'

type ReportFormat = 'pdf' | 'word' | 'print'

type ReportField = {
  id: string
  label: string
  value: string
}

const formatDate = (value?: string) => {
  if (!value) return '-'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleString()
}

const escapeHtml = (value: string) => value
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#039;')

const getFieldLabel = (fields: { id: string; label: string }[], fieldId: string) =>
  fields.find(field => field.id === fieldId)?.label || fieldId

const getVisitorFieldValue = (visitor: Visitor, fieldId: string): string => {
  switch (fieldId) {
    case 'name':
      return visitor.fullName
    case 'email':
      return visitor.email || '-'
    case 'phoneNumber':
    case 'phone':
      // Frontend expects `phoneNumber`; backend visitor type uses `mobile`
      return (visitor as any).phoneNumber
        ? String((visitor as any).phoneNumber)
        : visitor.mobile
          ? String(visitor.mobile)
          : '-'

    case 'company':
      return visitor.visitorCompany || '-'
    case 'purpose':
      return visitor.purpose || '-'
    case 'host':
      return visitor.hostName || '-'
    case 'department':
      return visitor.department || '-'
    case 'checkIn':
      return formatDate(visitor.entryTime)
    case 'checkOut':
      return formatDate(visitor.exitTime)
    case 'status':
      return visitor.status || 'ACTIVE'
    case 'badge':
      return visitor.badgeId || '-'
    case 'signature':
      // Blank column for manual signature after printing
      return '-'
    default:
      return '-'
  }
}

const buildReportRows = (
  visitors: Visitor[],
  selectedFields: string[],
  fields: { id: string; label: string }[]
): ReportField[][] => visitors.map(visitor => selectedFields.map(fieldId => ({
  id: fieldId,
  label: getFieldLabel(fields, fieldId),
  value: getVisitorFieldValue(visitor, fieldId),
})))

const buildReportHtml = ({
  title,
  generatedAt,
  fields,
  rows,
}: {
  title: string
  generatedAt: string
  fields: { id: string; label: string }[]
  rows: ReportField[][]
}) => {
  // Only render selected columns.
  // `fields` includes *all possible* fields but the `rows` are built based on `selectedFields`.
  // So we must align headers to `rows` order (selected fields order).
  const tableHeaders = fields
    .filter(field => rows.length === 0 || rows[0]?.some(cell => cell.id === field.id))
    .map(field => `<th>${escapeHtml(field.label)}</th>`)
    .join('')
  const tableRows = rows
    .map(row => `<tr>${row.map(cell => `<td>${escapeHtml(cell.value)}</td>`).join('')}</tr>`)
    .join('')

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>${escapeHtml(title)}</title>
  <style>
    body { font-family: Arial, sans-serif; color: #111827; margin: 24px; }
    h1 { color: #1A3263; font-size: 24px; margin: 0 0 8px; }
    .meta { color: #6B7280; font-size: 13px; margin-bottom: 24px; }
    table { width: 100%; border-collapse: collapse; font-size: 12px; }
    th { background: #1A3263; color: #fff; padding: 10px; text-align: left; }
    td { border: 1px solid #D1D5DB; padding: 8px; vertical-align: top; word-break: break-word; }
    tr:nth-child(even) { background: #F9FAFB; }
    @media print {
      @page { margin: 12mm; }
      body { margin: 0; }
      th { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      tr:nth-child(even) { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    }
  </style>
</head>
<body>
  <h1>${escapeHtml(title)}</h1>
  <div class="meta">Generated on ${escapeHtml(generatedAt)} • Total records: ${rows.length}</div>
  <table>
    <thead><tr>${tableHeaders}</tr></thead>
    <tbody>${tableRows}</tbody>
  </table>
</body>
</html>`
}

const openReportWindow = (html: string) => {
  const printWindow = window.open('', '_blank')
  if (!printWindow) {
    window.alert('Pop-up blocked. Allow pop-ups to generate the report.')
    return null
  }

  printWindow.document.open()
  printWindow.document.write(html)
  printWindow.document.close()
  printWindow.focus()
  return printWindow
}

export const generateVisitorReport = ({
  visitors,
  selectedFields,
  fields,
  format,
  title = 'Visitor Report',
}: {
  visitors: Visitor[]
  selectedFields: string[]
  fields: { id: string; label: string }[]
  format: ReportFormat
  title?: string
}) => {
  if (selectedFields.length === 0) {
    window.alert('Please select at least one field')
    return
  }

  const rows = buildReportRows(visitors, selectedFields, fields)
  const generatedAt = new Date().toLocaleString()
  const html = buildReportHtml({ title, generatedAt, fields, rows })

  if (format === 'print') {
    openReportWindow(html)
    return
  }

  if (format === 'word') {
    const blob = new Blob([html], { type: 'application/msword;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    const safeTitle = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'visitor-report'
    link.href = url
    link.download = `${safeTitle}-${new Date().toISOString().slice(0, 10)}.doc`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    return
  }

  const printWindow = openReportWindow(html)
  if (printWindow) {
    printWindow.print()
  }
}
