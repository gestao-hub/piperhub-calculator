import type { Product, PricingConfig } from '@/lib/pricing-data'
import {
  PRODUCTS,
  PERIOD_DISCOUNTS,
  PIPERKEY_PACKAGES,
  calculatePrice,
  calculatePackagePrice,
  getUserTier,
  getPiperHuntTier,
} from '@/lib/pricing-data'
import { formatCurrency, cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { PaymentMethodsGrid } from './PaymentMethodsGrid'
import { FileDown, RotateCcw, Wrench, Building2, Package as PackageIcon } from 'lucide-react'

interface PriceSummaryProps {
  product: Product
  selectedModuleIds: string[]
  selectedPackageId: string | null
  users: number
  period: string
  onChangePeriod: (period: string) => void
  onExportPDF: () => void
  onReset: () => void
  config?: PricingConfig
  piperhuntCnpjs?: number
  companyName: string
  onChangeCompanyName: (name: string) => void
}

export function PriceSummary({
  product,
  selectedModuleIds,
  selectedPackageId,
  users,
  period,
  onChangePeriod,
  onExportPDF,
  onReset,
  config,
  piperhuntCnpjs = 0,
  companyName,
  onChangeCompanyName,
}: PriceSummaryProps) {
  const selectedPackage = selectedPackageId
    ? PIPERKEY_PACKAGES.find(p => p.id === selectedPackageId)
    : undefined

  const breakdown = selectedPackage
    ? calculatePackagePrice(selectedPackage, product, users, period, config)
    : calculatePrice(product, selectedModuleIds, users, period, config, piperhuntCnpjs)

  const tier = getUserTier(users)
  const isPiperhuntSelected =
    !selectedPackage && selectedModuleIds.includes('pl-piperhunt') && piperhuntCnpjs > 0
  const piperhuntTier = isPiperhuntSelected ? getPiperHuntTier(piperhuntCnpjs) : null

  const selectedModules = product.modules.filter(
    m => selectedModuleIds.includes(m.id)
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
            <p className="text-sm text-muted-foreground">{product.tagline}</p>
          </div>

          <Separator className="mb-6" />

          {/* Line items */}
          <div className="space-y-3 mb-6">
            {selectedPackage ? (
              <>
                <div className="flex items-start gap-2">
                  <PackageIcon
                    className="w-4 h-4 mt-0.5 shrink-0"
                    style={{ color: product.color.primary }}
                  />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-foreground">{selectedPackage.name}</p>
                    <p className="text-xs text-muted-foreground">{selectedPackage.tagline}</p>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    {users} usuarios x {formatCurrency(breakdown.basePerUser)} ({tier.label})
                  </span>
                  <span className="text-sm font-medium text-foreground">
                    {formatCurrency(breakdown.usersTotal)}
                  </span>
                </div>
                <div className="pt-1">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                    Inclui {selectedPackage.moduleIds.length} modulos
                  </p>
                </div>
              </>
            ) : (
              <>
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

                {/* Modulos selecionados */}
                {selectedModules.length > 0 && (
                  <>
                    <Separator className="my-2" />
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Modulos selecionados
                    </p>
                    {selectedModules.map((mod) => {
                      const isPiperhunt = mod.id === 'pl-piperhunt'

                      if (isPiperhunt && isPiperhuntSelected && piperhuntTier) {
                        return (
                          <div key={mod.id} className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">
                              PiperHunt ({piperhuntCnpjs} CNPJs x {formatCurrency(piperhuntTier.pricePerCnpj)})
                            </span>
                            <span className="text-sm font-medium text-foreground">
                              {formatCurrency(breakdown.piperhuntCost)}
                            </span>
                          </div>
                        )
                      }

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
                      <span className="text-sm font-medium text-muted-foreground">Total modulos</span>
                      <span className="text-sm font-medium text-foreground">
                        {formatCurrency(breakdown.addonsTotal + breakdown.piperhuntCost)}
                      </span>
                    </div>
                  </>
                )}
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

          <Separator className="my-6" />

          {/* Setup fee */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/50 border border-border/50">
            <div className="flex items-center gap-3">
              <Wrench className="w-5 h-5 text-muted-foreground shrink-0" />
              <p className="text-sm font-semibold text-foreground">Taxa de implantacao</p>
            </div>
            <span
              className="text-lg font-display font-bold"
              style={{ color: product.color.primary }}
            >
              {formatCurrency(breakdown.setupFee)}
            </span>
          </div>

          {/* PiperHunt credit note */}
          {isPiperhuntSelected && (
            <div className="mt-4 p-3 rounded-lg border border-border/50 bg-secondary/30">
              <p className="text-xs text-muted-foreground">
                * PiperHunt: cobrado conforme consumo mensal de CNPJs consultados.
                Faixa atual: {piperhuntTier?.label} ({formatCurrency(piperhuntTier?.pricePerCnpj ?? 0)}/CNPJ).
              </p>
            </div>
          )}
        </div>

        {/* Payment methods comparison */}
        <PaymentMethodsGrid
          product={product}
          monthlyTotal={breakdown.total}
          config={config}
        />

        {/* Client data section */}
        <div className="glass-card rounded-xl p-6 mb-6">
          <h4 className="text-sm font-semibold text-foreground mb-4">Dados do cliente</h4>
          <div className="relative">
            <Building2
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"
            />
            <input
              type="text"
              value={companyName}
              onChange={(e) => onChangeCompanyName(e.target.value)}
              placeholder="Digite o nome da empresa..."
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
            />
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
