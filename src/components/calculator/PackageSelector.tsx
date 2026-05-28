import { PIPERKEY_PACKAGES, USER_TIERS, getPackageTierPrice, getUserTier } from '@/lib/pricing-data'
import type { Product, PricingConfig } from '@/lib/pricing-data'
import { formatCurrency, cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Slider } from '@/components/ui/slider'
import { CheckCircle, Sparkles, Package as PackageIcon, Zap, Users } from 'lucide-react'

interface PackageSelectorProps {
  product: Product
  selectedPackageId: string | null
  onSelect: (packageId: string | null) => void
  users: number
  onChangeUsers: (users: number) => void
  config?: PricingConfig
}

const PACKAGE_ICONS: Record<string, typeof PackageIcon> = {
  'pk-pacote-1': PackageIcon,
  'pk-pacote-2': Sparkles,
  'pk-pacote-3': Zap,
}

const MODULE_LABELS: Record<string, string> = {
  'pk-funis': 'Funis/CRM',
  'pk-agenda': 'Agenda',
  'pk-monitoramento': 'Monitoramento',
  'pk-analytics': 'Analytics',
  'pk-contatos': 'Contatos',
  'pk-pipeline-financeiro': 'Pipeline Financeiro',
  'pk-propriedades': 'Propriedades',
  'pk-empreendimentos': 'Empreendimentos',
  'pk-subpagina': 'Subpagina da Imobiliaria',
  'pk-agentes-ia': 'Agentes de IA',
  'pk-assistente-ia': 'Assistente de IA',
  'pk-pos-venda': 'Pos-Venda',
  'pk-gestao-aluguel': 'Gestao de Aluguel',
  'pk-campanhas-whatsapp': 'Campanhas WhatsApp',
}

export function PackageSelector({
  product,
  selectedPackageId,
  onSelect,
  users,
  onChangeUsers,
  config,
}: PackageSelectorProps) {
  const currentTier = getUserTier(users)

  return (
    <div className="animate-fade-in">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-display font-bold text-foreground mb-2">
          Escolha um pacote
        </h2>
        <p className="text-muted-foreground">
          Pacotes prontos com modulos selecionados. Voce tambem pode montar do zero abaixo.
        </p>
      </div>

      {/* Live users input — drives all package prices below */}
      <div
        className="rounded-xl border p-5 mb-6"
        style={{
          borderColor: `${product.color.primary}30`,
          backgroundColor: `${product.color.primary}06`,
        }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex items-center gap-3 shrink-0">
            <div
              className="p-2 rounded-lg"
              style={{ backgroundColor: `${product.color.primary}15` }}
            >
              <Users className="w-5 h-5" style={{ color: product.color.primary }} />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Quantos usuarios?</p>
              <p className="text-sm font-semibold text-foreground">
                Faixa atual: {currentTier.label}
              </p>
            </div>
          </div>

          <div className="flex-1 flex items-center gap-3">
            <Slider
              value={[users]}
              onValueChange={(val) => onChangeUsers(val[0])}
              min={1}
              max={100}
              step={1}
              className="flex-1"
              style={
                {
                  '--slider-color': product.color.primary,
                } as React.CSSProperties
              }
            />
            <div className="flex items-center gap-1.5 shrink-0">
              <input
                type="number"
                min={1}
                max={200}
                value={users}
                onChange={(e) => {
                  const num = parseInt(e.target.value, 10)
                  if (!isNaN(num) && num >= 1) onChangeUsers(Math.min(num, 200))
                }}
                className="w-16 text-center text-base font-bold rounded-md border border-border bg-card px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary/50"
                style={{ borderColor: `${product.color.primary}40` }}
              />
              <span className="text-xs text-muted-foreground">usuarios</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
        {PIPERKEY_PACKAGES.map((pkg) => {
          const Icon = PACKAGE_ICONS[pkg.id] ?? PackageIcon
          const isSelected = selectedPackageId === pkg.id
          const pricePerUser = getPackageTierPrice(pkg.id, users, config)
          const total = pricePerUser * users

          return (
            <button
              key={pkg.id}
              onClick={() => onSelect(isSelected ? null : pkg.id)}
              className={cn(
                'relative text-left rounded-xl border-2 p-5 transition-all duration-300 cursor-pointer',
                'bg-card/40',
                isSelected ? 'shadow-lg' : 'border-border/50 hover:border-border',
              )}
              style={
                isSelected
                  ? {
                      borderColor: product.color.primary,
                      boxShadow: `0 0 30px ${product.color.primary}25`,
                    }
                  : pkg.highlight
                    ? { borderColor: `${product.color.primary}50` }
                    : undefined
              }
            >
              {pkg.highlight && !isSelected && (
                <div
                  className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider"
                  style={{
                    backgroundColor: product.color.primary,
                    color: '#fff',
                  }}
                >
                  Mais escolhido
                </div>
              )}

              {isSelected && (
                <div className="absolute top-3 right-3">
                  <CheckCircle
                    className="w-5 h-5"
                    style={{ color: product.color.primary }}
                  />
                </div>
              )}

              <div className="flex items-center gap-2 mb-3">
                <div
                  className="p-2 rounded-lg"
                  style={{ backgroundColor: `${product.color.primary}15` }}
                >
                  <Icon className="w-5 h-5" style={{ color: product.color.primary }} />
                </div>
                <h3 className="text-base font-display font-bold text-foreground">
                  {pkg.name}
                </h3>
              </div>

              <p className="text-xs text-muted-foreground mb-4 line-clamp-2 min-h-[2.5rem]">
                {pkg.tagline}
              </p>

              <div className="mb-4">
                <div className="flex items-baseline gap-1">
                  <span
                    className="text-2xl font-display font-bold"
                    style={{ color: product.color.primary }}
                  >
                    {formatCurrency(pricePerUser)}
                  </span>
                  <span className="text-xs text-muted-foreground">/usuario/mes</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {users} usuarios = {formatCurrency(total)}/mes
                </p>
              </div>

              <div className="space-y-1.5">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Inclui
                </p>
                <ul className="space-y-1">
                  {pkg.moduleIds.map((id) => (
                    <li
                      key={id}
                      className="flex items-start gap-1.5 text-xs text-foreground/80"
                    >
                      <CheckCircle
                        className="w-3 h-3 mt-0.5 shrink-0"
                        style={{ color: product.color.primary }}
                      />
                      <span>{MODULE_LABELS[id] ?? id}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </button>
          )
        })}
      </div>

      {selectedPackageId && (
        <div
          className="rounded-xl border p-4 mb-6 text-center"
          style={{
            borderColor: `${product.color.primary}40`,
            backgroundColor: `${product.color.primary}08`,
          }}
        >
          <p className="text-sm text-foreground">
            <span className="font-semibold">Pacote selecionado.</span>{' '}
            <button
              onClick={() => onSelect(null)}
              className="text-xs underline text-muted-foreground hover:text-foreground"
            >
              Montar do zero
            </button>
          </p>
          <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
            {USER_TIERS.map((tier) => {
              const price = getPackageTierPrice(selectedPackageId, tier.min, config)
              return (
                <Badge
                  key={tier.label}
                  variant="secondary"
                  className={cn(
                    'text-[10px]',
                    users >= tier.min && (tier.max === null || users <= tier.max)
                      ? 'border'
                      : 'opacity-60',
                  )}
                  style={
                    users >= tier.min && (tier.max === null || users <= tier.max)
                      ? { borderColor: product.color.primary, color: product.color.primary }
                      : undefined
                  }
                >
                  {tier.label}: {formatCurrency(price)}
                </Badge>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
