import { PIPERHUNT_TIERS, getPiperHuntTier, calculatePiperHuntCost } from '@/lib/pricing-data'
import type { Product } from '@/lib/pricing-data'
import { formatCurrency, cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { CheckCircle } from 'lucide-react'
import {
  Bot,
  Calendar,
  Eye,
  BarChart3,
  Users,
  Megaphone,
  Sparkles,
  ThumbsUp,
  TrendingUp,
  FileText,
  Globe,
  DollarSign,
  Package,
  Home,
  Building,
  GitBranch,
  Shield,
  Zap,
  Mail,
  Camera,
  Search,
} from 'lucide-react'
import type { LucideProps } from 'lucide-react'
import type { ForwardRefExoticComponent, RefAttributes } from 'react'

type LucideIcon = ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>

const iconMap: Record<string, LucideIcon> = {
  Bot,
  Calendar,
  Eye,
  BarChart3,
  Users,
  Megaphone,
  Sparkles,
  ThumbsUp,
  TrendingUp,
  FileText,
  Globe,
  DollarSign,
  Package,
  Home,
  Building,
  GitBranch,
  Shield,
  Zap,
  Mail,
  Camera,
  Search,
}

interface ModuleSelectorProps {
  product: Product
  selectedModuleIds: string[]
  onToggle: (moduleId: string) => void
  piperhuntCnpjs?: number
  onChangePiperhuntCnpjs?: (n: number) => void
}

export function ModuleSelector({
  product,
  selectedModuleIds,
  onToggle,
  piperhuntCnpjs = 200,
  onChangePiperhuntCnpjs,
}: ModuleSelectorProps) {
  const isPiperhuntSelected = selectedModuleIds.includes('pl-piperhunt')
  const piperhuntTier = getPiperHuntTier(piperhuntCnpjs)
  const piperhuntCost = calculatePiperHuntCost(piperhuntCnpjs)

  const addonsTotal = product.modules
    .filter(m => !m.included && selectedModuleIds.includes(m.id))
    .reduce((sum, m) => {
      // PiperHunt is credit-based, add calculated cost instead of flat price
      if (m.id === 'pl-piperhunt') return sum + piperhuntCost
      return sum + m.price
    }, 0)

  return (
    <div className="animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-display font-bold text-foreground mb-2">
          Configure seus modulos
        </h2>
        <p className="text-muted-foreground">
          Modulos inclusos estao ativos. Adicione os extras que precisar.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {product.modules.map((mod) => {
          const IconComponent = iconMap[mod.icon]
          const isSelected = selectedModuleIds.includes(mod.id)
          const isPiperhunt = mod.id === 'pl-piperhunt'

          return (
            <div
              key={mod.id}
              className={cn(
                'relative rounded-xl border p-4 transition-all duration-200',
                mod.included
                  ? 'border-success/30 bg-success/5'
                  : isSelected
                    ? 'bg-card/80'
                    : 'border-border/50 bg-card/40',
              )}
              style={
                !mod.included && isSelected
                  ? { borderColor: `${product.color.primary}60` }
                  : undefined
              }
            >
              <div className="flex items-start justify-between mb-3">
                <div
                  className="p-2 rounded-lg"
                  style={{
                    backgroundColor: mod.included
                      ? 'rgba(34, 197, 94, 0.1)'
                      : isSelected
                        ? `${product.color.primary}15`
                        : 'rgba(255,255,255,0.05)',
                  }}
                >
                  {IconComponent && (
                    <IconComponent
                      className="w-5 h-5"
                      style={{
                        color: mod.included
                          ? 'hsl(var(--success))'
                          : isSelected
                            ? product.color.primary
                            : 'hsl(var(--muted-foreground))',
                      }}
                    />
                  )}
                </div>

                {mod.included ? (
                  <CheckCircle className="w-5 h-5 text-success" />
                ) : (
                  <Switch
                    checked={isSelected}
                    onCheckedChange={() => onToggle(mod.id)}
                  />
                )}
              </div>

              <h4 className="text-sm font-semibold text-foreground mb-1">
                {mod.name}
              </h4>
              <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                {mod.description}
              </p>

              {mod.included ? (
                <Badge variant="success" className="text-xs">Incluso</Badge>
              ) : isPiperhunt ? (
                <span
                  className="text-sm font-semibold"
                  style={{ color: product.color.primary }}
                >
                  A partir de R$ 0,70/CNPJ
                </span>
              ) : (
                <span
                  className="text-sm font-semibold"
                  style={{ color: product.color.primary }}
                >
                  {formatCurrency(mod.price)}/mes
                </span>
              )}
            </div>
          )
        })}
      </div>

      {/* PiperHunt credit configuration panel */}
      {isPiperhuntSelected && (
        <div
          className="mt-6 rounded-xl border p-6 space-y-5"
          style={{
            borderColor: `${product.color.primary}50`,
            backgroundColor: `${product.color.primary}06`,
          }}
        >
          <div className="flex items-center gap-2 mb-2">
            <Search className="w-5 h-5" style={{ color: product.color.primary }} />
            <h3
              className="text-base font-display font-bold"
              style={{ color: product.color.primary }}
            >
              PiperHunt - Configuracao de Creditos
            </h3>
          </div>

          {/* CNPJ quantity input */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Quantidade estimada de CNPJs/mes
            </label>
            <input
              type="number"
              min={1}
              value={piperhuntCnpjs}
              onChange={(e) => {
                const val = Math.max(1, parseInt(e.target.value) || 1)
                onChangePiperhuntCnpjs?.(val)
              }}
              className="w-full max-w-xs rounded-lg border border-border bg-card px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
            />
          </div>

          {/* Current tier info */}
          <div className="flex flex-wrap gap-4">
            <div className="rounded-lg border border-border/50 bg-card/60 px-4 py-3">
              <p className="text-xs text-muted-foreground mb-1">Faixa atual</p>
              <p className="text-sm font-semibold text-foreground">
                {piperhuntTier.label} — {formatCurrency(piperhuntTier.pricePerCnpj)}/CNPJ
              </p>
            </div>
            <div className="rounded-lg border border-border/50 bg-card/60 px-4 py-3">
              <p className="text-xs text-muted-foreground mb-1">Custo estimado</p>
              <p
                className="text-sm font-bold"
                style={{ color: product.color.primary }}
              >
                {formatCurrency(piperhuntCost)}/mes
              </p>
            </div>
          </div>

          {/* Tier table */}
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Tabela de faixas
            </p>
            <div className="overflow-hidden rounded-lg border border-border/50">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-secondary/60">
                    <th className="text-left px-4 py-2 text-xs font-semibold text-muted-foreground">
                      Faixa
                    </th>
                    <th className="text-right px-4 py-2 text-xs font-semibold text-muted-foreground">
                      Preco/CNPJ
                    </th>
                    <th className="text-right px-4 py-2 text-xs font-semibold text-muted-foreground">
                      Custo maximo
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {PIPERHUNT_TIERS.map((tier) => {
                    const isActive = tier.min === piperhuntTier.min
                    return (
                      <tr
                        key={tier.label}
                        className={cn(
                          'transition-colors',
                          isActive ? 'bg-primary/10' : 'bg-card/40 hover:bg-secondary/30',
                        )}
                        style={
                          isActive
                            ? { backgroundColor: `${product.color.primary}15` }
                            : undefined
                        }
                      >
                        <td className="px-4 py-2 border-t border-border/30">
                          <span
                            className={cn(
                              'text-sm',
                              isActive ? 'font-bold text-foreground' : 'text-muted-foreground',
                            )}
                          >
                            {tier.label}
                            {isActive && (
                              <span
                                className="ml-2 inline-block text-[10px] font-bold uppercase px-1.5 py-0.5 rounded"
                                style={{
                                  backgroundColor: `${product.color.primary}25`,
                                  color: product.color.primary,
                                }}
                              >
                                Atual
                              </span>
                            )}
                          </span>
                        </td>
                        <td
                          className={cn(
                            'px-4 py-2 border-t border-border/30 text-right',
                            isActive ? 'font-bold text-foreground' : 'text-muted-foreground',
                          )}
                        >
                          {formatCurrency(tier.pricePerCnpj)}
                        </td>
                        <td
                          className={cn(
                            'px-4 py-2 border-t border-border/30 text-right',
                            isActive ? 'font-bold text-foreground' : 'text-muted-foreground',
                          )}
                        >
                          {tier.maxCost !== null ? formatCurrency(tier.maxCost) : 'Sob consulta'}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {addonsTotal > 0 && (
        <div
          className="mt-6 p-4 rounded-xl border text-center"
          style={{ borderColor: `${product.color.primary}40`, backgroundColor: `${product.color.primary}08` }}
        >
          <span className="text-sm text-muted-foreground">Total de add-ons: </span>
          <span className="text-lg font-bold" style={{ color: product.color.primary }}>
            {formatCurrency(addonsTotal)}/mes
          </span>
        </div>
      )}
    </div>
  )
}
