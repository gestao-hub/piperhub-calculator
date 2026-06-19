import { useRef, useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import type { Product, PricingConfig, PaymentOverrides, PaymentOverride } from '@/lib/pricing-data'
import { calculatePaymentBreakdowns } from '@/lib/pricing-data'
import { formatCurrency, formatPercent, parseBRLNumber, cn } from '@/lib/utils'
import { Zap, FileText, CreditCard, Calendar, RotateCcw } from 'lucide-react'
import type { LucideProps } from 'lucide-react'
import type { ForwardRefExoticComponent, RefAttributes } from 'react'

type LucideIcon = ForwardRefExoticComponent<Omit<LucideProps, 'ref'> & RefAttributes<SVGSVGElement>>

const iconMap: Record<string, LucideIcon> = {
  Zap,
  FileText,
  CreditCard,
  Calendar,
}

/** Texto cru pré-preenchido no input ao começar a editar um valor em R$. */
function seedCurrency(value: number): string {
  return value.toFixed(2).replace('.', ',')
}

interface InlineEditProps {
  value: number
  format: (v: number) => string
  parse: (raw: string) => number | null
  seed?: (v: number) => string
  onCommit: (v: number) => void
  overridden?: boolean
  underline?: boolean
  title?: string
  className?: string
  inputClassName?: string
  style?: CSSProperties
  ariaLabel?: string
  inputMode?: 'decimal' | 'numeric'
}

/** Valor exibido como texto; ao clicar vira um input. Enter/blur confirma, Esc cancela. */
function InlineEdit({
  value,
  format,
  parse,
  seed,
  onCommit,
  overridden,
  underline = true,
  title,
  className,
  inputClassName,
  style,
  ariaLabel,
  inputMode,
}: InlineEditProps) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState('')
  const cancelled = useRef(false)
  const initial = useRef('')

  function begin() {
    const s = seed ? seed(value) : String(value)
    setDraft(s)
    initial.current = s
    setEditing(true)
  }

  function commit() {
    if (cancelled.current) {
      cancelled.current = false
      setEditing(false)
      return
    }
    // Só comita se o texto realmente mudou — clicar e confirmar sem editar
    // não deve "travar" o valor (criar override de uma versão arredondada).
    if (draft !== initial.current) {
      const parsed = parse(draft)
      if (parsed != null) onCommit(parsed)
    }
    setEditing(false)
  }

  if (editing) {
    return (
      <input
        autoFocus
        value={draft}
        aria-label={ariaLabel}
        inputMode={inputMode}
        enterKeyHint="done"
        onChange={(e) => setDraft(e.target.value)}
        onFocus={(e) => e.target.select()}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.currentTarget.blur()
          } else if (e.key === 'Escape') {
            cancelled.current = true
            e.currentTarget.blur()
          }
        }}
        className={inputClassName}
        style={style}
      />
    )
  }

  return (
    <button
      type="button"
      onClick={begin}
      title={title ?? 'Clique para editar'}
      aria-label={ariaLabel}
      className={cn(
        'cursor-text transition-colors',
        underline && 'border-b border-dotted border-transparent hover:border-current',
        underline && overridden && 'border-current',
        className,
      )}
      style={style}
    >
      {format(value)}
    </button>
  )
}

interface PaymentMethodsGridProps {
  product: Product
  monthlyTotal: number
  config?: PricingConfig
  overrides?: PaymentOverrides
  onChangeOverrides: (next: PaymentOverrides) => void
}

export function PaymentMethodsGrid({
  product,
  monthlyTotal,
  config,
  overrides = {},
  onChangeOverrides,
}: PaymentMethodsGridProps) {
  const breakdowns = calculatePaymentBreakdowns(monthlyTotal, config, overrides)
  const anyOverridden = breakdowns.some((b) => b.isOverridden)

  function setField(methodId: string, key: keyof PaymentOverride, value: number) {
    onChangeOverrides({
      ...overrides,
      [methodId]: { ...(overrides[methodId] ?? {}), [key]: value },
    })
  }

  function resetMethod(methodId: string) {
    const next = { ...overrides }
    delete next[methodId]
    onChangeOverrides(next)
  }

  function moneyRow(
    methodId: string,
    methodLabel: string,
    fieldKey: 'primary' | 'secondary',
    label: ReactNode,
    labelText: string,
    value: number,
    overridden: boolean,
    big: boolean,
  ) {
    return (
      <div className="flex items-baseline justify-between gap-2">
        <span className={big ? 'text-xs text-muted-foreground' : 'text-[10px] text-muted-foreground'}>
          {label}
        </span>
        <InlineEdit
          value={value}
          format={formatCurrency}
          seed={seedCurrency}
          parse={(raw) => {
            const n = parseBRLNumber(raw)
            return n == null ? null : Math.max(0, n)
          }}
          onCommit={(v) => setField(methodId, fieldKey, v)}
          overridden={overridden}
          ariaLabel={`Editar ${labelText} de ${methodLabel}`}
          inputMode="decimal"
          className={cn(
            'font-bold',
            big ? 'text-base' : 'text-[10px] font-normal text-muted-foreground',
          )}
          inputClassName={cn(
            'text-right bg-background border border-border rounded px-1 outline-none focus:ring-2 focus:ring-primary/50',
            big ? 'w-32 text-base font-bold' : 'w-24 text-[10px]',
          )}
          style={big ? { color: product.color.primary } : undefined}
        />
      </div>
    )
  }

  return (
    <div className="glass-card rounded-xl p-6 mb-6">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h4 className="text-sm font-semibold text-foreground mb-1">
            Formas de pagamento
          </h4>
          <p className="text-xs text-muted-foreground">
            Compare os valores em cada modalidade. Clique em qualquer valor, desconto ou parcela para editar.
          </p>
        </div>
        {anyOverridden && (
          <button
            type="button"
            onClick={() => onChangeOverrides({})}
            className="shrink-0 flex items-center gap-1 text-[11px] font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            Restaurar padrões
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {breakdowns.map((b) => {
          const Icon = iconMap[b.method.icon]
          const hasDiscount = b.discount > 0
          const description =
            b.method.id === 'card_installments'
              ? `Em até ${b.installments}x no cartão de crédito`
              : b.method.description
          return (
            <div
              key={b.method.id}
              className="rounded-lg border border-border/50 bg-card/40 p-4 flex flex-col gap-2"
              style={hasDiscount ? { borderColor: `${product.color.primary}40` } : undefined}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div
                    className="p-1.5 rounded-md"
                    style={{ backgroundColor: `${product.color.primary}15` }}
                  >
                    {Icon && (
                      <Icon className="w-4 h-4" style={{ color: product.color.primary }} />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground leading-tight">
                      {b.method.label}
                    </p>
                    <p className="text-[10px] text-muted-foreground leading-tight">
                      {description}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <InlineEdit
                    value={b.discount}
                    format={(d) => (d > 0 ? `-${formatPercent(d)}%` : `${formatPercent(d)}%`)}
                    seed={(d) => formatPercent(d)}
                    parse={(raw) => {
                      const n = parseBRLNumber(raw)
                      if (n == null) return null
                      // arredonda a 0,1% para o valor salvo bater com o exibido
                      return Math.round(Math.min(100, Math.max(0, n)) * 10) / 1000
                    }}
                    onCommit={(v) => setField(b.method.id, 'discount', v)}
                    overridden={b.overridden.discount}
                    underline={false}
                    title="Editar desconto"
                    ariaLabel={`Editar desconto de ${b.method.label}`}
                    inputMode="decimal"
                    className={cn(
                      'text-[10px] font-bold px-1.5 py-0.5 rounded transition-all',
                      'hover:ring-1 hover:ring-inset hover:ring-current/50',
                      b.overridden.discount && 'ring-1 ring-inset ring-current/50',
                      !hasDiscount && 'text-foreground/70 bg-muted',
                    )}
                    inputClassName="w-12 text-center text-[10px] font-bold bg-background border border-border rounded px-1 outline-none focus:ring-2 focus:ring-primary/50"
                    style={
                      hasDiscount
                        ? { backgroundColor: `${product.color.primary}20`, color: product.color.primary }
                        : undefined
                    }
                  />
                  {b.isOverridden && (
                    <button
                      type="button"
                      onClick={() => resetMethod(b.method.id)}
                      title="Redefinir este card"
                      aria-label={`Redefinir ${b.method.label}`}
                      className="p-1.5 -m-0.5 rounded text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                    >
                      <RotateCcw className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>

              <div className="border-t border-border/30 pt-2 mt-1">
                {b.method.id === 'boleto' ? (
                  <>
                    {moneyRow(b.method.id, b.method.label, 'primary', 'Mensal', 'valor mensal', b.monthlyAfterDiscount, b.overridden.primary, true)}
                    {moneyRow(b.method.id, b.method.label, 'secondary', 'Anual', 'valor anual', b.annualTotal, b.overridden.secondary, false)}
                  </>
                ) : b.method.id === 'card_installments' ? (
                  <>
                    {moneyRow(
                      b.method.id,
                      b.method.label,
                      'primary',
                      <span className="flex items-center gap-1">
                        <InlineEdit
                          value={b.installments}
                          format={(n) => String(n)}
                          parse={(raw) => {
                            const n = parseBRLNumber(raw)
                            if (n == null) return null
                            return Math.min(60, Math.max(1, Math.round(n)))
                          }}
                          onCommit={(v) => setField(b.method.id, 'installments', v)}
                          overridden={b.overridden.installments}
                          underline={false}
                          title="Editar nº de parcelas"
                          ariaLabel={`Editar número de parcelas de ${b.method.label}`}
                          inputMode="numeric"
                          className="font-bold text-foreground underline decoration-dotted underline-offset-2"
                          inputClassName="w-10 text-center text-xs bg-background border border-border rounded px-1 outline-none focus:ring-2 focus:ring-primary/50"
                        />
                        x de
                      </span>,
                      'valor da parcela',
                      b.installmentValue,
                      b.overridden.primary,
                      true,
                    )}
                    {moneyRow(b.method.id, b.method.label, 'secondary', 'Total', 'valor total', b.totalUpfront, b.overridden.secondary, false)}
                  </>
                ) : (
                  <>
                    {moneyRow(b.method.id, b.method.label, 'primary', 'Total à vista', 'total à vista', b.totalUpfront, b.overridden.primary, true)}
                    {moneyRow(b.method.id, b.method.label, 'secondary', 'Equivalente mensal', 'equivalente mensal', b.monthlyAfterDiscount, b.overridden.secondary, false)}
                  </>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
