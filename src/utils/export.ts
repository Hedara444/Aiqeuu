export type PositionExport = {
  id: string
  title: string
  description?: string
  status: string
  createdAt: string
  criterias: { id: string; description: string; createdAt: string }[]
  resumes: { id: string; title: string; path?: string; score?: number; explanation?: string; createdAt: string }[]
}

const safe = (s: string) => (s ?? '').toString()
const fileSafe = (s: string) => s.replace(/[^\w\-]+/g, '_').slice(0, 60)
const q = (s: string) => `"${safe(s).replace(/"/g, '""')}"`

const download = (name: string, mime: string, content: string) => {
  const blob = new Blob([content], { type: mime })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = name
  document.body.appendChild(a)
  a.click()
  setTimeout(() => {
    URL.revokeObjectURL(url)
    a.remove()
  }, 0)
}

export const exportJSON = (position: PositionExport) => {
  const name = `analysis_${fileSafe(position.title || 'position')}.json`
  const content = JSON.stringify(position, null, 2)
  download(name, 'application/json;charset=utf-8', content)
}

export const exportCSV = (position: PositionExport) => {
  const lines: string[] = []
  lines.push(`Position,${q(position.title)}`)
  lines.push(`Description,${q(position.description || '')}`)
  lines.push(`Status,${q(position.status)}`)
  lines.push(`Created At,${q(position.createdAt)}`)
  lines.push('')
  lines.push(`"Resume Title","Score","Explanation","Created At"`)
  position.resumes.forEach(r => {
    lines.push(
      [q(r.title), q(String(r.score ?? '')), q(r.explanation ?? ''), q(r.createdAt)].join(',')
    )
  })
  const name = `analysis_${fileSafe(position.title || 'position')}.csv`
  download(name, 'text/csv;charset=utf-8', lines.join('\r\n'))
}

export const exportExcel = (position: PositionExport) => {
  const rows = position.resumes
    .map(
      r =>
        `<tr><td>${safe(r.title)}</td><td>${safe(r.score ?? '')}</td><td>${safe(r.explanation ?? '')}</td><td>${safe(
          r.path ?? ''
        )}</td><td>${safe(r.createdAt)}</td></tr>`
    )
    .join('')
  const table = `<table border="1"><thead><tr><th>Resume Title</th><th>Score</th><th>Explanation</th><th>Path</th><th>Created At</th></tr></thead><tbody>${rows}</tbody></table>`
  const header = `<div><b>Position:</b> ${safe(position.title)}<br/><b>Description:</b> ${safe(
    position.description ?? ''
  )}<br/><b>Status:</b> ${safe(position.status)}<br/><b>Created At:</b> ${safe(position.createdAt)}</div><br/>`
  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"></head><body>${header}${table}</body></html>`
  const name = `analysis_${fileSafe(position.title || 'position')}.xls`
  download(name, 'application/vnd.ms-excel', html)
}