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
}

export function ModuleSelector({ product, selectedModuleIds, onToggle }: ModuleSelectorProps) {
  const addonsTotal = product.modules
    .filter(m => !m.included && selectedModuleIds.includes(m.id))
    .reduce((sum, m) => sum + m.price, 0)

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
