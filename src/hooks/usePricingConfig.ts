import { useState, useCallback } from 'react'
import { PRODUCTS, USER_TIERS, PERIOD_DISCOUNTS, PIPERKEY_PACKAGES } from '@/lib/pricing-data'
import type { PricingConfig } from '@/lib/pricing-data'

const STORAGE_KEY = 'piperhub-pricing-config'

function getDefaultConfig(): PricingConfig {
  const basePrices: Record<string, number> = {}
  const setupFees: Record<string, number> = {}
  const modulePrices: Record<string, Record<string, number>> = {}

  for (const product of PRODUCTS) {
    basePrices[product.id] = product.basePrice
    setupFees[product.id] = product.setupFee
    modulePrices[product.id] = {}
    for (const mod of product.modules) {
      modulePrices[product.id][mod.id] = mod.price
    }
  }

  const tierDiscounts = USER_TIERS.map(t => t.discount)
  const periodDiscounts: Record<string, number> = {}
  for (const p of PERIOD_DISCOUNTS) {
    periodDiscounts[p.id] = p.discount
  }

  const packageTierPrices: Record<string, number[]> = {}
  for (const pkg of PIPERKEY_PACKAGES) {
    packageTierPrices[pkg.id] = [...pkg.tierPrices]
  }

  return { basePrices, setupFees, modulePrices, tierDiscounts, periodDiscounts, packageTierPrices }
}

function loadConfig(): PricingConfig {
  const defaults = getDefaultConfig()
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored) as Partial<PricingConfig>
      return {
        basePrices: { ...defaults.basePrices, ...parsed.basePrices },
        setupFees: { ...defaults.setupFees, ...parsed.setupFees },
        modulePrices: {
          ...defaults.modulePrices,
          ...Object.fromEntries(
            Object.entries(parsed.modulePrices ?? {}).map(([pid, mods]) => [
              pid,
              { ...defaults.modulePrices[pid], ...mods },
            ])
          ),
        },
        tierDiscounts: parsed.tierDiscounts ?? defaults.tierDiscounts,
        periodDiscounts: { ...defaults.periodDiscounts, ...parsed.periodDiscounts },
        packageTierPrices: { ...defaults.packageTierPrices, ...parsed.packageTierPrices },
      }
    }
  } catch {
    // ignore parse errors
  }
  return defaults
}

export function usePricingConfig() {
  const [config, setConfig] = useState<PricingConfig>(loadConfig)

  const updateConfig = useCallback((newConfig: PricingConfig) => {
    setConfig(newConfig)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newConfig))
  }, [])

  const resetConfig = useCallback(() => {
    const defaults = getDefaultConfig()
    setConfig(defaults)
    localStorage.removeItem(STORAGE_KEY)
  }, [])

  return { config, updateConfig, resetConfig }
}
