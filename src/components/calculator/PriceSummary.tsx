import type {
  Product,
  PricingConfig,
  ProposalData,
  ProposalComputed,
  ProposalEdits,
  PaymentOverrides,
} from '@/lib/pricing-data'
import { formatCurrency } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { PaymentMethodsGrid } from './PaymentMethodsGrid'
import { FileDown, RotateCcw, Building2, Pencil } from 'lucide-react'

interface PriceSummaryProps {
  product: Product
  data: ProposalData
  computed: ProposalComputed
  edits: ProposalEdits
  onChangeEdit: <K extends keyof ProposalEdits>(field: K, value: ProposalEdits[K]) => void
  onChangeCompanyName: (name: string) => void
  onResetValues: () => void
  onExportPDF: () => void
  onReset: () => void
  config?: PricingConfig
  paymentOverrides?: PaymentOverrides
  onChangePaymentOverrides: (next: PaymentOverrides) => void
}

function round2(n: number): number {
  return Math.round(n * 100) / 100
}

interface MoneyFieldProps {
  label: string
  badge?: string
  value: number
  computedValue: number
  edited: boolean
  highlight?: boolean
  onChange: (value: number | null) => void
}

function MoneyField({
  label,
  badge,
  value,
  computedValue,
  edited,
  highlight,
  onChange,
}: MoneyFieldProps) {
  return (
    <div
      className="rounded-lg border bg-card/40 p-3"
      style={{ borderColor: highlight ? 'var(--primary-tint, #2B7FD940)' : undefined }}
    >
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {label}
        </span>
        {badge && (
          <span className="text-[10px] font-bold text-success">{badge}</span>
        )}
      </div>
      <div className="flex items-center gap-1.5">
        <span className="text-sm font-medium text-muted-foreground">R$</span>
        <input
          type="number"
          inputMode="decimal"
          step="0.01"
          min="0"
          value={round2(value)}
          onChange={(e) =>
            onChange(e.target.value === '' ? null : Number(e.target.value))
          }
          className="w-full bg-transparent text-lg font-display font-bold text-foreground focus:outline-none"
        />
      </div>
      {edited && (
        <button
          type="button"
          onClick={() => onChange(null)}
          className="mt-1 text-[10px] text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
        >
          calculado: {formatCurrency(computedValue)} · restaurar
        </button>
      )}
    </div>
  )
}

export function PriceSummary({
  product,
  data,
  computed,
  edits,
  onChangeEdit,
  onChangeCompanyName,
  onResetValues,
  onExportPDF,
  onReset,
  config,
  paymentOverrides,
  onChangePaymentOverrides,
}: PriceSummaryProps) {
  const hasValueEdits =
    edits.monthly !== null ||
    edits.semiannual !== null ||
    edits.annual !== null ||
    edits.setupFee !== null

  const benefitsValue =
    edits.benefits !== null ? edits.benefits : data.benefits.join(', ')

  return (
    <div className="animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-display font-bold text-foreground mb-2">
          Editar proposta
        </h2>
        <p className="text-muted-foreground">
          Ajuste qualquer campo manualmente — tudo reflete no PDF do cliente
        </p>
      </div>

      <div className="max-w-2xl mx-auto">
        {/* Product header */}
        <div className="glass-card rounded-xl p-6 mb-6">
          <div className="flex items-center gap-4">
            <img src={product.logo} alt={product.name} className="h-10 w-auto" />
            <p className="text-sm text-muted-foreground">{product.tagline}</p>
          </div>
        </div>

        {/* Textos da proposta */}
        <div className="glass-card rounded-xl p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Pencil className="w-4 h-4 text-muted-foreground" />
            <h4 className="text-sm font-semibold text-foreground">Conteúdo</h4>
          </div>

          <div className="space-y-4">
            {/* Título */}
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                Título da proposta
              </label>
              <input
                type="text"
                value={data.title}
                onChange={(e) => onChangeEdit('title', e.target.value)}
                placeholder="Proposta Comercial"
                className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
              />
            </div>

            {/* Nome da empresa */}
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                Nome da empresa (cliente)
              </label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  value={data.companyName}
                  onChange={(e) => onChangeCompanyName(e.target.value)}
                  placeholder="Digite o nome da empresa..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                />
              </div>
            </div>

            {/* Validade */}
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                Validade da proposta
              </label>
              <input
                type="text"
                value={data.validity}
                onChange={(e) => onChangeEdit('validity', e.target.value)}
                placeholder="30 dias"
                className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
              />
            </div>

            {/* Benefícios */}
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                Benefícios (separados por vírgula)
              </label>
              <input
                type="text"
                value={benefitsValue}
                onChange={(e) => onChangeEdit('benefits', e.target.value)}
                placeholder="Suporte técnico, Setup e treinamento..."
                className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
              />
            </div>
          </div>
        </div>

        {/* Valores */}
        <div className="glass-card rounded-xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-semibold text-foreground">
              Valores mensais
            </h4>
            {hasValueEdits && (
              <button
                type="button"
                onClick={onResetValues}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                Restaurar calculados
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <MoneyField
              label="Mensal"
              value={data.monthly}
              computedValue={computed.monthly}
              edited={edits.monthly !== null}
              onChange={(v) => onChangeEdit('monthly', v)}
            />
            <MoneyField
              label="Semestral"
              badge={`−${(data.semiannualDiscount * 100).toFixed(0)}%`}
              value={data.semiannual}
              computedValue={computed.semiannual}
              edited={edits.semiannual !== null}
              onChange={(v) => onChangeEdit('semiannual', v)}
            />
            <MoneyField
              label="Anual"
              badge={`−${(data.annualDiscount * 100).toFixed(0)}%`}
              value={data.annual}
              computedValue={computed.annual}
              edited={edits.annual !== null}
              highlight
              onChange={(v) => onChangeEdit('annual', v)}
            />
          </div>

          <div className="mt-4 pt-4 border-t border-border/40">
            <div className="max-w-[12rem]">
              <MoneyField
                label="Taxa de implantação"
                value={data.setupFee}
                computedValue={computed.setupFee}
                edited={edits.setupFee !== null}
                onChange={(v) => onChangeEdit('setupFee', v)}
              />
            </div>
            <p className="text-[11px] text-muted-foreground mt-2">
              Pagamento único (setup + treinamento).
            </p>
          </div>
        </div>

        {/* Formas de pagamento editáveis (sobre o plano anual) */}
        <PaymentMethodsGrid
          product={product}
          monthlyTotal={data.annual}
          config={config}
          overrides={paymentOverrides}
          onChangeOverrides={onChangePaymentOverrides}
        />

        {/* Action buttons */}
        <div className="flex gap-4">
          <Button onClick={onExportPDF} size="lg" className="flex-1">
            <FileDown className="w-5 h-5" />
            Exportar PDF
          </Button>
          <Button onClick={onReset} variant="outline" size="lg">
            <RotateCcw className="w-5 h-5" />
            Nova simulação
          </Button>
        </div>
      </div>
    </div>
  )
}
