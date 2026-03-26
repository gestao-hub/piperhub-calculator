import html2pdf from 'html2pdf.js'

export async function generatePDF(filename: string) {
  const element = document.getElementById('proposal-content')
  if (!element) return
  const prev = element.style.display
  element.style.display = 'block'
  element.style.position = 'relative'
  element.style.left = '0'

  await html2pdf().set({
    margin: 0,
    filename,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true, logging: false },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
  }).from(element).save()

  element.style.display = prev
  element.style.position = 'absolute'
  element.style.left = '-9999px'
}
