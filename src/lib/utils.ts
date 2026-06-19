import { clsx } from "clsx"
import type { ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(value: number): string {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

/**
 * Converte um texto digitado pelo usuário em número (padrão pt-BR).
 * Regras de separador:
 *  - Com vírgula: vírgula = decimal e pontos = milhar ("10.824,04" → 10824.04).
 *  - Só pontos em grupos de milhar ("1.000", "1.234.567"): pontos = milhar → 1000 / 1234567.
 *  - Ponto único decimal ("10824.04") ou inteiro puro: mantido como está.
 * Valida o resultado com regex estrita; entradas malformadas retornam null
 * (em vez de virar um número arbitrário silenciosamente).
 */
export function parseBRLNumber(raw: string): number | null {
  const cleaned = raw.replace(/[^\d.,-]/g, '').trim()
  if (!cleaned) return null
  let normalized: string
  if (cleaned.includes(',')) {
    normalized = cleaned.replace(/\./g, '').replace(',', '.')
  } else if (/^-?\d{1,3}(\.\d{3})+$/.test(cleaned)) {
    normalized = cleaned.replace(/\./g, '')
  } else {
    normalized = cleaned
  }
  if (!/^-?\d+(\.\d+)?$/.test(normalized)) return null
  const n = Number.parseFloat(normalized)
  return Number.isNaN(n) ? null : n
}

/**
 * Formata um desconto (decimal, ex.: 0.025) como percentual pt-BR sem zeros
 * decimais inúteis: 0.03 → "3", 0.025 → "2,5". Usado na tela e no PDF para
 * garantir o mesmo texto nos dois.
 */
export function formatPercent(value: number): string {
  const p = value * 100
  const s = Number.isInteger(p) ? String(p) : String(Number(p.toFixed(1)))
  return s.replace('.', ',')
}
