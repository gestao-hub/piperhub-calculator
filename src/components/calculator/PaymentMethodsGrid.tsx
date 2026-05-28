import type { Product, PricingConfig } from '@/lib/pricing-data'
import { calculatePaymentBreakdowns } from '@/lib/pricing-data'
import { formatCurrency } from '@/lib/utils'
import { Zap, FileText, CreditCard, Calendar } from 'lucide-react'
import type { LucideProps } from 'lucide-react'
import type { ForwardRefExoticComponent, RefAttributes } from 'react'

type LucideIcon = ForwardRefExoticComponent<Omit<LucideProps, 'ref'> & RefAttributes<SVGSVGElement>>

const iconMap: Record<string, LucideIcon> = {
  Zap,
  FileText,
  CreditCard,
  Calendar,
}

interface PaymentMethodsGridProps {
  product: Product
  monthlyTotal: number
  config?: PricingConfig
}

export function PaymentMethodsGrid({ product, monthlyTotal, config }: PaymentMethodsGridProps) {
  const breakdowns = calculatePaymentBreakdowns(monthlyTotal, config)

  return (
    <div className="glass-card rounded-xl p-6 mb-6">
      <div className="mb-4">
        <h4 className="text-sm font-semibold text-foreground mb-1">
          Formas de pagamento
        </h4>
        <p className="text-xs text-muted-foreground">
          Compare os valores em cada modalidade. Descontos aplicados sobre o total.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {breakdowns.map((b) => {
          const Icon = iconMap[b.method.icon]
          const showsDiscount = b.discount > 0
          return (
            <div
              key={b.method.id}
              className="rounded-lg border border-border/50 bg-card/40 p-4 flex flex-col gap-2"
              style={
                showsDiscount
                  ? { borderColor: `${product.color.primary}40` }
                  : undefined
              }
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div
                    className="p-1.5 rounded-md"
                    style={{ backgroundColor: `${product.color.primary}15` }}
                  >
                    {Icon && (
                      <Icon
                        className="w-4 h-4"
                        style={{ color: product.color.primary }}
                      />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground leading-tight">
                      {b.method.label}
                    </p>
                    <p className="text-[10px] text-muted-foreground leading-tight">
                      {b.method.description}
                    </p>
                  </div>
                </div>
                {showsDiscount && (
                  <span
                    className="text-[10px] font-bold px-1.5 py-0.5 rounded shrink-0"
                    style={{
                      backgroundColor: `${product.color.primary}20`,
                      color: product.color.primary,
                    }}
                  >
                    -{(b.discount * 100).toFixed(0)}%
                  </span>
                )}
              </div>

              <div className="border-t border-border/30 pt-2 mt-1">
                {b.method.id === 'boleto' ? (
                  <>
                    <div className="flex items-baseline justify-between">
                      <span className="text-xs text-muted-foreground">Mensal</span>
                      <span
                        className="text-base font-bold"
                        style={{ color: product.color.primary }}
                      >
                        {formatCurrency(b.monthlyAfterDiscount)}
                      </span>
                    </div>
                    <div className="flex items-baseline justify-between text-[10px] text-muted-foreground">
                      <span>Anual</span>
                      <span>{formatCurrency(b.monthlyAfterDiscount * 12)}</span>
                    </div>
                  </>
                ) : b.method.id === 'card_installments' ? (
                  <>
                    <div className="flex items-baseline justify-between">
                      <span className="text-xs text-muted-foreground">12x de</span>
                      <span
                        className="text-base font-bold"
                        style={{ color: product.color.primary }}
                      >
                        {formatCurrency(b.installmentValue)}
                      </span>
                    </div>
                    <div className="flex items-baseline justify-between text-[10px] text-muted-foreground">
                      <span>Total</span>
                      <span>{formatCurrency(b.totalUpfront)}</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-baseline justify-between">
                      <span className="text-xs text-muted-foreground">Total a vista</span>
                      <span
                        className="text-base font-bold"
                        style={{ color: product.color.primary }}
                      >
                        {formatCurrency(b.totalUpfront)}
                      </span>
                    </div>
                    <div className="flex items-baseline justify-between text-[10px] text-muted-foreground">
                      <span>Equivalente mensal</span>
                      <span>{formatCurrency(b.monthlyAfterDiscount)}</span>
                    </div>
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
