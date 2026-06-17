import html2pdf from 'html2pdf.js'

export async function generatePDF(filename: string) {
  const element = document.getElementById('proposal-content')
  if (!element) return
  const prev = element.style.display
  // O layout usa flex-column (rodapé fixado embaixo via margin-top:auto)
  element.style.display = 'flex'
  element.style.position = 'relative'
  element.style.left = '0'

  const options = {
    margin: [0, 0, 0, 0],
    filename,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true, logging: false },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
    pagebreak: { mode: ['avoid-all', 'css', 'legacy'] },
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await html2pdf().set(options as any).from(element).save()

  element.style.display = prev
  element.style.position = 'absolute'
  element.style.left = '-9999px'
}
