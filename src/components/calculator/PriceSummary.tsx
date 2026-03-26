import type { Product } from '@/lib/pricing-data'
import { PRODUCTS, PERIOD_DISCOUNTS, calculatePrice, getUserTier } from '@/lib/pricing-data'
import type { PricingConfig } from '@/lib/pricing-data'
import { formatCurrency, cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { FileDown, RotateCcw } from 'lucide-react'

interface PriceSummaryProps {
  product: Product
  selectedModuleIds: string[]
  users: number
  period: string
  onChangePeriod: (period: string) => void
  onExportPDF: () => void
  onReset: () => void
  config?: PricingConfig
}

export function PriceSummary({
  product,
  selectedModuleIds,
  users,
  period,
  onChangePeriod,
  onExportPDF,
  onReset,
  config,
}: PriceSummaryProps) {
  const breakdown = calculatePrice(product, selectedModuleIds, users, period, config)
  const tier = getUserTier(users)
  const selectedAddons = product.modules.filter(
    m => !m.included && selectedModuleIds.includes(m.id)
  )

  // For product lookup in case config overrides prices
  const _productData = PRODUCTS.find(p => p.id === product.id)
  if (!_productData) return null

  return (
    <div className="animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-display font-bold text-foreground mb-2">
          Resumo da proposta
        </h2>
        <p className="text-muted-foreground">
          Confira os detalhes e exporte o PDF
        </p>
      </div>

      <div className="max-w-2xl mx-auto">
        <div className="glass-card rounded-xl p-6 mb-6">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <img src={product.logo} alt={product.name} className="h-10 w-auto" />
            <div>
              <h3 className="text-xl font-display font-bold" style={{ color: product.color.primary }}>
                {product.name}
              </h3>
              <p className="text-sm text-muted-foreground">{product.tagline}</p>
            </div>
          </div>

          <Separator className="mb-6" />

          {/* Line items */}
          <div className="space-y-3 mb-6">
            {/* Base */}
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                Base ({users} usuarios x {formatCurrency(breakdown.basePerUser)})
              </span>
              <span className="text-sm font-medium text-foreground">
                {formatCurrency(breakdown.basePerUser * users)}
              </span>
            </div>

            {/* Tier discount */}
            {breakdown.discountPercent > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  Desconto volume ({tier.label})
                </span>
                <span className="text-sm font-medium text-success">
                  -{(breakdown.discountPercent * 100).toFixed(0)}% ({formatCurrency(breakdown.basePerUser * users - breakdown.usersTotal)})
                </span>
              </div>
            )}

            {/* After discount subtotal for users */}
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Subtotal usuarios</span>
              <span className="font-medium text-foreground">{formatCurrency(breakdown.usersTotal)}</span>
            </div>

            {/* Add-ons */}
            {selectedAddons.length > 0 && (
              <>
                <Separator className="my-2" />
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Add-ons
                </p>
                {selectedAddons.map((mod) => {
                  const modPrice = config?.modulePrices[product.id]?.[mod.id] ?? mod.price
                  return (
                    <div key={mod.id} className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">{mod.name}</span>
                      <span className="text-sm font-medium text-foreground">
                        {formatCurrency(modPrice)}
                      </span>
                    </div>
                  )
                })}
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-muted-foreground">Total add-ons</span>
                  <span className="text-sm font-medium text-foreground">
                    {formatCurrency(breakdown.addonsTotal)}
                  </span>
                </div>
              </>
            )}
          </div>

          <Separator className="mb-6" />

          {/* Period selector */}
          <div className="mb-6">
            <p className="text-sm font-medium text-foreground mb-3">Periodo de contratacao</p>
            <div className="flex gap-2">
              {PERIOD_DISCOUNTS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => onChangePeriod(p.id)}
                  className={cn(
                    'flex-1 py-2.5 px-3 rounded-lg text-sm font-medium transition-all duration-200 border cursor-pointer',
                    period === p.id
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border bg-card text-muted-foreground hover:border-border hover:bg-secondary',
                  )}
                >
                  {p.label}
                  {p.discount > 0 && (
                    <Badge variant="success" className="ml-2 text-xs">
                      -{(p.discount * 100).toFixed(0)}%
                    </Badge>
                  )}
                </button>
              ))}
            </div>
          </div>

          <Separator className="mb-6" />

          {/* Totals */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Subtotal mensal</span>
              <span className="text-sm text-foreground">{formatCurrency(breakdown.subtotal)}</span>
            </div>

            {breakdown.periodDiscount > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  Desconto periodo (-{(breakdown.periodDiscount * 100).toFixed(0)}%)
                </span>
                <span className="text-sm font-medium text-success">
                  -{formatCurrency(breakdown.periodDiscountAmount)}
                </span>
              </div>
            )}

            <div
              className="flex justify-between items-center p-4 rounded-xl mt-4"
              style={{ backgroundColor: `${product.color.primary}10` }}
            >
              <span className="text-lg font-display font-bold text-foreground">
                TOTAL MENSAL
              </span>
              <span
                className="text-2xl font-display font-bold"
                style={{ color: product.color.primary }}
              >
                {formatCurrency(breakdown.total)}
              </span>
            </div>

            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Total anual estimado</span>
              <span className="text-foreground font-medium">{formatCurrency(breakdown.totalAnnual)}</span>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-4">
          <Button
            onClick={onExportPDF}
            size="lg"
            className="flex-1"
          >
            <FileDown className="w-5 h-5" />
            Exportar PDF
          </Button>
          <Button
            onClick={onReset}
            variant="outline"
            size="lg"
          >
            <RotateCcw className="w-5 h-5" />
            Nova simulacao
          </Button>
        </div>
      </div>
    </div>
  )
}
