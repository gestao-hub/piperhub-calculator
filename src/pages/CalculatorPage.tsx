import { useState, useCallback } from 'react'
import { PRODUCTS } from '@/lib/pricing-data'
import type { Product } from '@/lib/pricing-data'
import { generatePDF } from '@/lib/pdf-generator'
import { usePricingConfig } from '@/hooks/usePricingConfig'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ProductSelector } from '@/components/calculator/ProductSelector'
import { ModuleSelector } from '@/components/calculator/ModuleSelector'
import { UserTierSlider } from '@/components/calculator/UserTierSlider'
import { PriceSummary } from '@/components/calculator/PriceSummary'
import { ProposalPreview } from '@/components/calculator/ProposalPreview'
import { Settings, ChevronLeft, ChevronRight, Check } from 'lucide-react'

interface CalculatorPageProps {
  onOpenSettings: () => void
}

const STEPS = [
  { num: 1, label: 'Produto' },
  { num: 2, label: 'Modulos' },
  { num: 3, label: 'Usuarios' },
  { num: 4, label: 'Proposta' },
]

export function CalculatorPage({ onOpenSettings }: CalculatorPageProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null)
  const [selectedModuleIds, setSelectedModuleIds] = useState<string[]>([])
  const [users, setUsers] = useState(5)
  const [period, setPeriod] = useState('monthly')
  const { config } = usePricingConfig()

  const selectedProduct: Product | undefined = PRODUCTS.find(p => p.id === selectedProductId)

  const handleSelectProduct = useCallback((productId: string) => {
    setSelectedProductId(productId)
    const product = PRODUCTS.find(p => p.id === productId)
    if (product) {
      setSelectedModuleIds(product.modules.filter(m => m.included).map(m => m.id))
    }
  }, [])

  const handleToggleModule = useCallback((moduleId: string) => {
    setSelectedModuleIds(prev =>
      prev.includes(moduleId)
        ? prev.filter(id => id !== moduleId)
        : [...prev, moduleId]
    )
  }, [])

  const handleExportPDF = useCallback(async () => {
    if (!selectedProduct) return
    const filename = `proposta-${selectedProduct.name.toLowerCase()}-${Date.now()}.pdf`
    await generatePDF(filename)
  }, [selectedProduct])

  const handleReset = useCallback(() => {
    setCurrentStep(1)
    setSelectedProductId(null)
    setSelectedModuleIds([])
    setUsers(5)
    setPeriod('monthly')
  }, [])

  const canProceed =
    currentStep === 1 ? selectedProductId !== null :
    currentStep === 2 ? true :
    currentStep === 3 ? true :
    false

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/30 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/favicon.png" alt="PiperHub" className="h-8 w-8" />
            <h1 className="text-xl font-display font-bold text-foreground">
              Calculadora de Precos
            </h1>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onOpenSettings}
            className="text-muted-foreground hover:text-foreground"
          >
            <Settings className="w-5 h-5" />
          </Button>
        </div>
      </header>

      {/* Step indicator */}
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-12">
          {STEPS.map((step, idx) => (
            <div key={step.num} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    'w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 border-2',
                    currentStep > step.num
                      ? 'bg-primary text-primary-foreground border-primary'
                      : currentStep === step.num
                        ? 'bg-primary/10 text-primary border-primary'
                        : 'bg-card text-muted-foreground border-border',
                  )}
                >
                  {currentStep > step.num ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    step.num
                  )}
                </div>
                <span
                  className={cn(
                    'text-xs mt-2 font-medium hidden sm:block',
                    currentStep >= step.num ? 'text-foreground' : 'text-muted-foreground',
                  )}
                >
                  {step.label}
                </span>
              </div>
              {idx < STEPS.length - 1 && (
                <div
                  className={cn(
                    'flex-1 h-0.5 mx-3 transition-colors duration-300',
                    currentStep > step.num ? 'bg-primary' : 'bg-border',
                  )}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 pb-8">
        {currentStep === 1 && (
          <ProductSelector
            selectedProductId={selectedProductId}
            onSelect={handleSelectProduct}
          />
        )}

        {currentStep === 2 && selectedProduct && (
          <ModuleSelector
            product={selectedProduct}
            selectedModuleIds={selectedModuleIds}
            onToggle={handleToggleModule}
          />
        )}

        {currentStep === 3 && selectedProduct && (
          <UserTierSlider
            users={users}
            onChange={setUsers}
            product={selectedProduct}
          />
        )}

        {currentStep === 4 && selectedProduct && (
          <PriceSummary
            product={selectedProduct}
            selectedModuleIds={selectedModuleIds}
            users={users}
            period={period}
            onChangePeriod={setPeriod}
            onExportPDF={handleExportPDF}
            onReset={handleReset}
            config={config}
          />
        )}
      </div>

      {/* Navigation */}
      <div className="max-w-5xl mx-auto px-4 pb-12">
        <div className="flex justify-between">
          {currentStep > 1 ? (
            <Button
              variant="outline"
              onClick={() => setCurrentStep(s => s - 1)}
            >
              <ChevronLeft className="w-4 h-4" />
              Voltar
            </Button>
          ) : (
            <div />
          )}

          {currentStep < 4 && (
            <Button
              onClick={() => setCurrentStep(s => s + 1)}
              disabled={!canProceed}
            >
              Proximo
              <ChevronRight className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Hidden proposal for PDF */}
      {selectedProduct && (
        <ProposalPreview
          product={selectedProduct}
          selectedModuleIds={selectedModuleIds}
          users={users}
          period={period}
          config={config}
        />
      )}
    </div>
  )
}
