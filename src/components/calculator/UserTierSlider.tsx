import type { Product } from '@/lib/pricing-data'
import { USER_TIERS, getUserTier } from '@/lib/pricing-data'
import { cn } from '@/lib/utils'
import { Slider } from '@/components/ui/slider'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Users } from 'lucide-react'

interface UserTierSliderProps {
  users: number
  onChange: (users: number) => void
  product: Product
}

export function UserTierSlider({ users, onChange, product }: UserTierSliderProps) {
  const currentTier = getUserTier(users)

  function handleInputChange(value: string) {
    const num = parseInt(value, 10)
    if (!isNaN(num) && num >= 1) {
      onChange(Math.min(num, 200))
    }
  }

  return (
    <div className="animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-display font-bold text-foreground mb-2">
          Quantos usuários?
        </h2>
        <p className="text-muted-foreground">
          Quanto mais usuários, maior o desconto por volume
        </p>
      </div>

      <div className="max-w-2xl mx-auto">
        <div className="glass-card p-8 rounded-xl mb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div
                className="p-3 rounded-xl"
                style={{ backgroundColor: `${product.color.primary}15` }}
              >
                <Users className="w-6 h-6" style={{ color: product.color.primary }} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Faixa atual</p>
                <p className="text-lg font-semibold text-foreground">{currentTier.label}</p>
              </div>
            </div>

            {currentTier.discount > 0 && (
              <Badge
                variant="success"
                className="text-base px-4 py-1"
              >
                -{(currentTier.discount * 100).toFixed(0)}% desconto
              </Badge>
            )}
          </div>

          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-muted-foreground">1</span>
              <div className="flex items-center gap-3">
                <Input
                  type="number"
                  min={1}
                  max={200}
                  value={users}
                  onChange={(e) => handleInputChange(e.target.value)}
                  className="w-24 text-center text-lg font-bold"
                  style={{ borderColor: `${product.color.primary}40` }}
                />
                <span className="text-sm text-muted-foreground">usuários</span>
              </div>
              <span className="text-sm text-muted-foreground">100+</span>
            </div>

            <Slider
              value={[users]}
              onValueChange={(val) => onChange(val[0])}
              min={1}
              max={100}
              step={1}
              className="w-full"
              style={
                {
                  '--slider-color': product.color.primary,
                } as React.CSSProperties
              }
            />
          </div>
        </div>

        <div className="glass-card rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/50">
                <th className="text-left text-xs font-medium text-muted-foreground p-3">Faixa</th>
                <th className="text-right text-xs font-medium text-muted-foreground p-3">Desconto</th>
              </tr>
            </thead>
            <tbody>
              {USER_TIERS.map((tier) => {
                const isActive = tier.label === currentTier.label
                return (
                  <tr
                    key={tier.label}
                    className={cn(
                      'border-b border-border/30 transition-colors',
                      isActive && 'bg-primary/5',
                    )}
                  >
                    <td className="p-3">
                      <span
                        className={cn(
                          'text-sm',
                          isActive ? 'font-semibold text-foreground' : 'text-muted-foreground',
                        )}
                      >
                        {tier.label}
                      </span>
                      {isActive && (
                        <span
                          className="ml-2 text-xs font-medium"
                          style={{ color: product.color.primary }}
                        >
                          (atual)
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-right">
                      <span
                        className={cn(
                          'text-sm font-medium',
                          tier.discount > 0 ? 'text-success' : 'text-muted-foreground',
                        )}
                      >
                        {tier.discount > 0
                          ? `-${(tier.discount * 100).toFixed(0)}%`
                          : 'Sem desconto'}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
