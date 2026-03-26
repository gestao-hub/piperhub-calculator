import { PRODUCTS } from '@/lib/pricing-data'
import { formatCurrency, cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { CheckCircle } from 'lucide-react'

interface ProductSelectorProps {
  selectedProductId: string | null
  onSelect: (productId: string) => void
}

export function ProductSelector({ selectedProductId, onSelect }: ProductSelectorProps) {
  return (
    <div className="animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-display font-bold text-foreground mb-2">
          Escolha seu produto
        </h2>
        <p className="text-muted-foreground">
          Selecione a plataforma ideal para o seu negocio
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {PRODUCTS.map((product) => {
          const isSelected = selectedProductId === product.id
          const includedCount = product.modules.filter(m => m.included).length

          return (
            <button
              key={product.id}
              onClick={() => onSelect(product.id)}
              className={cn(
                'relative group text-left rounded-xl border-2 p-6 transition-all duration-300 cursor-pointer',
                'bg-gradient-to-br',
                product.color.bg,
                isSelected
                  ? `${product.color.border} shadow-lg`
                  : 'border-border/50 hover:border-border',
              )}
              style={isSelected ? { boxShadow: `0 0 40px ${product.color.primary}25` } : undefined}
            >
              {isSelected && (
                <div className="absolute top-4 right-4">
                  <CheckCircle
                    className="w-6 h-6"
                    style={{ color: product.color.primary }}
                  />
                </div>
              )}

              <div className="flex items-center gap-3 mb-4">
                <img
                  src={product.logo}
                  alt={product.name}
                  className="h-10 w-auto object-contain"
                />
              </div>

              <h3
                className="text-xl font-display font-bold mb-1"
                style={{ color: product.color.primary }}
              >
                {product.name}
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                {product.tagline}
              </p>

              <div className="mb-4">
                <span className="text-2xl font-display font-bold text-foreground">
                  {formatCurrency(product.basePrice)}
                </span>
                <span className="text-sm text-muted-foreground">/usuario/mes</span>
              </div>

              <div className="flex items-center gap-2">
                <Badge variant="success" className="text-xs">
                  {includedCount} modulos inclusos
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  +{product.modules.length - includedCount} add-ons
                </Badge>
              </div>

              <div className="mt-4 pt-4 border-t border-border/30">
                <p className="text-xs text-muted-foreground">
                  {product.modules
                    .filter(m => m.included)
                    .map(m => m.name)
                    .join(' - ')}
                </p>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
