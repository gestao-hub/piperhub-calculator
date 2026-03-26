import { useState, useCallback } from 'react'
import { PRODUCTS, USER_TIERS, PERIOD_DISCOUNTS } from '@/lib/pricing-data'
import type { PricingConfig } from '@/lib/pricing-data'

const STORAGE_KEY = 'piperhub-pricing-config'

function getDefaultConfig(): PricingConfig {
  const basePrices: Record<string, number> = {}
  const modulePrices: Record<string, Record<string, number>> = {}

  for (const product of PRODUCTS) {
    basePrices[product.id] = product.basePrice
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

  return { basePrices, modulePrices, tierDiscounts, periodDiscounts }
}

function loadConfig(): PricingConfig {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      return JSON.parse(stored) as PricingConfig
    }
  } catch {
    // ignore parse errors
  }
  return getDefaultConfig()
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
