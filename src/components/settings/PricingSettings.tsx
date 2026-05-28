import { useState, useEffect } from 'react'
import { PRODUCTS, USER_TIERS, PERIOD_DISCOUNTS, PIPERKEY_PACKAGES } from '@/lib/pricing-data'
import type { PricingConfig } from '@/lib/pricing-data'
import { usePricingConfig } from '@/hooks/usePricingConfig'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { cn, formatCurrency } from '@/lib/utils'
import { Save, RotateCcw, ChevronDown, ChevronRight, Package as PackageIcon } from 'lucide-react'

export function PricingSettings() {
  const { config, updateConfig, resetConfig } = usePricingConfig()
  const [draft, setDraft] = useState<PricingConfig>(config)
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({})
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    setDraft(config)
  }, [config])

  function toggleSection(id: string) {
    setOpenSections(prev => ({ ...prev, [id]: !prev[id] }))
  }

  function handleSetupFee(productId: string, value: string) {
    const num = parseFloat(value)
    if (!isNaN(num)) {
      setDraft(prev => ({
        ...prev,
        setupFees: { ...prev.setupFees, [productId]: num },
      }))
    }
  }

  function handleBasePrice(productId: string, value: string) {
    const num = parseFloat(value)
    if (!isNaN(num)) {
      setDraft(prev => ({
        ...prev,
        basePrices: { ...prev.basePrices, [productId]: num },
      }))
    }
  }

  function handleModulePrice(productId: string, moduleId: string, value: string) {
    const num = parseFloat(value)
    if (!isNaN(num)) {
      setDraft(prev => ({
        ...prev,
        modulePrices: {
          ...prev.modulePrices,
          [productId]: {
            ...prev.modulePrices[productId],
            [moduleId]: num,
          },
        },
      }))
    }
  }

  function handleTierDiscount(index: number, value: string) {
    const num = parseFloat(value) / 100
    if (!isNaN(num)) {
      setDraft(prev => {
        const tierDiscounts = [...prev.tierDiscounts]
        tierDiscounts[index] = Math.min(1, Math.max(0, num))
        return { ...prev, tierDiscounts }
      })
    }
  }

  function handlePackageTierPrice(packageId: string, tierIndex: number, value: string) {
    const num = parseFloat(value)
    if (!isNaN(num)) {
      setDraft(prev => {
        const current = prev.packageTierPrices[packageId]
          ?? PIPERKEY_PACKAGES.find(p => p.id === packageId)?.tierPrices
          ?? []
        const next = [...current]
        next[tierIndex] = Math.max(0, num)
        return {
          ...prev,
          packageTierPrices: { ...prev.packageTierPrices, [packageId]: next },
        }
      })
    }
  }

  function handlePeriodDiscount(periodId: string, value: string) {
    const num = parseFloat(value) / 100
    if (!isNaN(num)) {
      setDraft(prev => ({
        ...prev,
        periodDiscounts: {
          ...prev.periodDiscounts,
          [periodId]: Math.min(1, Math.max(0, num)),
        },
      }))
    }
  }

  function handleSave() {
    updateConfig(draft)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  function handleReset() {
    resetConfig()
    setDraft({
      basePrices: Object.fromEntries(PRODUCTS.map(p => [p.id, p.basePrice])),
      setupFees: Object.fromEntries(PRODUCTS.map(p => [p.id, p.setupFee])),
      modulePrices: Object.fromEntries(
        PRODUCTS.map(p => [
          p.id,
          Object.fromEntries(p.modules.map(m => [m.id, m.price])),
        ])
      ),
      tierDiscounts: USER_TIERS.map(t => t.discount),
      periodDiscounts: Object.fromEntries(PERIOD_DISCOUNTS.map(p => [p.id, p.discount])),
      packageTierPrices: Object.fromEntries(PIPERKEY_PACKAGES.map(p => [p.id, [...p.tierPrices]])),
    })
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Products */}
      {PRODUCTS.map((product) => {
        const isOpen = openSections[product.id] ?? false

        return (
          <div key={product.id} className="glass-card rounded-xl overflow-hidden">
            <button
              onClick={() => toggleSection(product.id)}
              className={cn(
                'w-full flex items-center justify-between p-5 cursor-pointer',
                'hover:bg-secondary/50 transition-colors',
              )}
            >
              <div className="flex items-center gap-3">
                <img src={product.logo} alt={product.name} className="h-8 w-auto" />
                <div className="text-left">
                  <h3 className="text-base font-display font-bold" style={{ color: product.color.primary }}>
                    {product.name}
                  </h3>
                  <p className="text-xs text-muted-foreground">{product.tagline}</p>
                </div>
              </div>
              {isOpen ? (
                <ChevronDown className="w-5 h-5 text-muted-foreground" />
              ) : (
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              )}
            </button>

            {isOpen && (
              <div className="px-5 pb-5 space-y-6">
                {/* Base price + Setup fee */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground block mb-2">
                      Preco base (R$/usuario/mes)
                    </label>
                    <Input
                      type="number"
                      step="0.01"
                      value={draft.basePrices[product.id] ?? product.basePrice}
                      onChange={(e) => handleBasePrice(product.id, e.target.value)}
                      className="w-40"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground block mb-2">
                      Multiplicador implantacao (x mensalidade)
                    </label>
                    <Input
                      type="number"
                      step="0.1"
                      min="0"
                      value={draft.setupFees[product.id] ?? product.setupFee}
                      onChange={(e) => handleSetupFee(product.id, e.target.value)}
                      className="w-40"
                    />
                  </div>
                </div>

                <Separator />

                {/* Module prices */}
                <div>
                  <h4 className="text-sm font-medium text-foreground mb-3">
                    Precos dos modulos
                  </h4>
                  <div className="space-y-2">
                    {product.modules.map((mod) => (
                      <div key={mod.id} className="flex items-center justify-between gap-4">
                        <span className="text-sm text-muted-foreground flex-1">{mod.name}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">R$</span>
                          <Input
                            type="number"
                            step="1"
                            value={draft.modulePrices[product.id]?.[mod.id] ?? mod.price}
                            onChange={(e) => handleModulePrice(product.id, mod.id, e.target.value)}
                            className="w-28"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )
      })}

      {/* Pacotes PiperKey */}
      <div className="glass-card rounded-xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <PackageIcon className="w-5 h-5 text-foreground" />
          <h3 className="text-base font-display font-bold text-foreground">
            Pacotes PiperKey - preco por faixa de usuarios
          </h3>
        </div>
        <p className="text-xs text-muted-foreground mb-4">
          Cada pacote tem um preco R$/usuario/mes diferente para cada faixa. Edite os valores abaixo.
        </p>

        <div className="space-y-6">
          {PIPERKEY_PACKAGES.map((pkg) => {
            const currentPrices = draft.packageTierPrices[pkg.id] ?? pkg.tierPrices
            return (
              <div key={pkg.id} className="rounded-lg border border-border/50 p-4">
                <div className="flex items-baseline justify-between mb-3">
                  <div>
                    <h4 className="text-sm font-semibold text-foreground">{pkg.name}</h4>
                    <p className="text-xs text-muted-foreground">{pkg.tagline}</p>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {pkg.moduleIds.length} modulos
                  </p>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  {USER_TIERS.map((tier, idx) => (
                    <div key={tier.label}>
                      <label className="block text-xs text-muted-foreground mb-1">
                        {tier.label}
                      </label>
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-muted-foreground">R$</span>
                        <Input
                          type="number"
                          step="1"
                          min="0"
                          value={currentPrices[idx] ?? pkg.tierPrices[idx]}
                          onChange={(e) => handlePackageTierPrice(pkg.id, idx, e.target.value)}
                          className="w-full text-sm"
                        />
                      </div>
                      <p className="text-[10px] text-muted-foreground mt-1">
                        Padrao: {formatCurrency(pkg.tierPrices[idx])}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Tier discounts */}
      <div className="glass-card rounded-xl p-5">
        <h3 className="text-base font-display font-bold text-foreground mb-4">
          Descontos por volume
        </h3>
        <div className="space-y-2">
          {USER_TIERS.map((tier, index) => (
            <div key={tier.label} className="flex items-center justify-between gap-4">
              <span className="text-sm text-muted-foreground flex-1">{tier.label}</span>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  step="1"
                  min="0"
                  max="100"
                  value={((draft.tierDiscounts[index] ?? tier.discount) * 100).toFixed(0)}
                  onChange={(e) => handleTierDiscount(index, e.target.value)}
                  className="w-20"
                />
                <span className="text-xs text-muted-foreground">%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Period discounts */}
      <div className="glass-card rounded-xl p-5">
        <h3 className="text-base font-display font-bold text-foreground mb-4">
          Descontos por periodo
        </h3>
        <div className="space-y-2">
          {PERIOD_DISCOUNTS.map((p) => (
            <div key={p.id} className="flex items-center justify-between gap-4">
              <span className="text-sm text-muted-foreground flex-1">{p.label}</span>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  step="1"
                  min="0"
                  max="100"
                  value={((draft.periodDiscounts[p.id] ?? p.discount) * 100).toFixed(0)}
                  onChange={(e) => handlePeriodDiscount(p.id, e.target.value)}
                  className="w-20"
                />
                <span className="text-xs text-muted-foreground">%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-4">
        <Button onClick={handleSave} size="lg" className="flex-1">
          <Save className="w-5 h-5" />
          {saved ? 'Salvo!' : 'Salvar configuracoes'}
        </Button>
        <Button onClick={handleReset} variant="outline" size="lg">
          <RotateCcw className="w-5 h-5" />
          Resetar
        </Button>
      </div>
    </div>
  )
}
