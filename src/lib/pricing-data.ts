export interface Module {
  id: string
  name: string
  description: string
  icon: string
  price: number
  included: boolean
}

export interface Product {
  id: 'piperkey' | 'pipercore' | 'piperleads2'
  name: string
  tagline: string
  basePrice: number
  setupFee: number
  color: { primary: string; secondary: string; bg: string; border: string; text: string }
  logo: string
  logoLight: string
  modules: Module[]
}

export interface UserTier {
  min: number
  max: number | null
  label: string
  discount: number
}

export interface PeriodDiscount {
  id: string
  label: string
  months: number
  discount: number
}

export interface PricingConfig {
  basePrices: Record<string, number>
  setupFees: Record<string, number>
  modulePrices: Record<string, Record<string, number>>
  tierDiscounts: number[]
  periodDiscounts: Record<string, number>
}

export interface PriceBreakdown {
  basePerUser: number
  discountPercent: number
  discountedPerUser: number
  usersTotal: number
  addonsTotal: number
  piperhuntCost: number
  subtotal: number
  periodDiscount: number
  periodDiscountAmount: number
  total: number
  totalAnnual: number
  setupFee: number
}

export interface PiperHuntTier {
  min: number
  max: number | null
  label: string
  pricePerCnpj: number
  maxCost: number | null
}

export const PIPERHUNT_TIERS: PiperHuntTier[] = [
  { min: 1, max: 100, label: '1-100 CNPJs', pricePerCnpj: 3.00, maxCost: 300 },
  { min: 101, max: 500, label: '101-500 CNPJs', pricePerCnpj: 2.00, maxCost: 1000 },
  { min: 501, max: 2000, label: '501-2.000 CNPJs', pricePerCnpj: 1.50, maxCost: 3000 },
  { min: 2001, max: 5000, label: '2.001-5.000 CNPJs', pricePerCnpj: 1.00, maxCost: 5000 },
  { min: 5001, max: null, label: '5.001+ CNPJs', pricePerCnpj: 0.70, maxCost: null },
]

export function getPiperHuntTier(cnpjs: number): PiperHuntTier {
  for (const tier of PIPERHUNT_TIERS) {
    if (tier.max === null && cnpjs >= tier.min) return tier
    if (tier.max !== null && cnpjs >= tier.min && cnpjs <= tier.max) return tier
  }
  return PIPERHUNT_TIERS[0]
}

export function calculatePiperHuntCost(cnpjs: number): number {
  const tier = getPiperHuntTier(cnpjs)
  return cnpjs * tier.pricePerCnpj
}

export const USER_TIERS: UserTier[] = [
  { min: 1, max: 5, label: '1-5 usuarios', discount: 0 },
  { min: 6, max: 15, label: '6-15 usuarios', discount: 0.10 },
  { min: 16, max: 30, label: '16-30 usuarios', discount: 0.15 },
  { min: 31, max: 50, label: '31-50 usuarios', discount: 0.20 },
  { min: 51, max: null, label: '51+ usuarios', discount: 0.25 },
]

export const PERIOD_DISCOUNTS: PeriodDiscount[] = [
  { id: 'monthly', label: 'Mensal', months: 1, discount: 0 },
  { id: 'semiannual', label: 'Semestral', months: 6, discount: 0.10 },
  { id: 'annual', label: 'Anual', months: 12, discount: 0.15 },
]

export const PRODUCTS: Product[] = [
  {
    id: 'piperkey',
    name: 'PiperKey',
    tagline: 'CRM Imobiliario com IA',
    basePrice: 98,
    setupFee: 1649,
    color: {
      primary: '#2B7FD9',
      secondary: '#D4A920',
      bg: 'from-blue-500/15 to-amber-500/10',
      border: 'border-blue-500/40',
      text: 'text-blue-400',
    },
    logo: '/piperkey-logo.png',
    logoLight: '/piperkey-logo-light.png',
    modules: [
      { id: 'pk-funis', name: 'Funis/CRM', description: 'Gestao de funis e pipeline de vendas', icon: 'GitBranch', price: 0, included: true },
      { id: 'pk-agenda', name: 'Agenda', description: 'Agendamento de visitas e reunioes', icon: 'Calendar', price: 0, included: true },
      { id: 'pk-monitoramento', name: 'Monitoramento', description: 'Monitoramento de atividades e equipe', icon: 'Eye', price: 0, included: true },
      { id: 'pk-analytics', name: 'Analytics', description: 'Relatorios e dashboards avancados', icon: 'BarChart3', price: 0, included: true },
      { id: 'pk-contatos', name: 'Contatos', description: 'Gestao de contatos e leads', icon: 'Users', price: 0, included: true },
      { id: 'pk-agentes-ia', name: 'Agentes IA', description: 'Automacao com agentes de inteligencia artificial', icon: 'Bot', price: 384, included: false },
      { id: 'pk-assistente-ia', name: 'Assistente IA', description: 'Assistente inteligente para produtividade', icon: 'Sparkles', price: 98, included: false },
      { id: 'pk-campanhas-whatsapp', name: 'Campanhas WhatsApp', description: 'Campanhas em massa via WhatsApp', icon: 'Megaphone', price: 219, included: false },
      { id: 'pk-csat', name: 'CSAT', description: 'Pesquisa de satisfacao do cliente', icon: 'ThumbsUp', price: 54, included: false },
      { id: 'pk-sales-assist', name: 'Sales Assist', description: 'Assistencia inteligente para vendas', icon: 'TrendingUp', price: 142, included: false },
      { id: 'pk-propostas', name: 'Propostas', description: 'Geracao e gestao de propostas comerciais', icon: 'FileText', price: 87, included: false },
      { id: 'pk-analise-mercado', name: 'Analise de Mercado', description: 'Inteligencia de mercado imobiliario', icon: 'Globe', price: 164, included: false },
      { id: 'pk-pipeline-financeiro', name: 'Pipeline Financeiro', description: 'Gestao de pipeline financeiro', icon: 'DollarSign', price: 109, included: false },
      { id: 'pk-pos-venda', name: 'Pos-Venda', description: 'Gestao do pos-venda e entrega', icon: 'Package', price: 109, included: false },
      { id: 'pk-gestao-aluguel', name: 'Gestao de Aluguel', description: 'Administracao de imoveis para aluguel', icon: 'Home', price: 164, included: false },
      { id: 'pk-propriedades', name: 'Propriedades', description: 'Catalogo e gestao de propriedades', icon: 'Building', price: 87, included: false },
    ],
  },
  {
    id: 'pipercore',
    name: 'PiperCore',
    tagline: 'CRM para Contabilidade',
    basePrice: 76,
    setupFee: 989,
    color: {
      primary: '#00E632',
      secondary: '#0F1729',
      bg: 'from-emerald-500/15 to-cyan-500/10',
      border: 'border-emerald-500/40',
      text: 'text-emerald-400',
    },
    logo: '/pipercore-logo-dark.png',
    logoLight: '/pipercore-logo-light.png',
    modules: [
      { id: 'pc-funis', name: 'Funis/CRM', description: 'Gestao de funis e pipeline', icon: 'GitBranch', price: 0, included: true },
      { id: 'pc-agenda', name: 'Agenda', description: 'Agendamento de reunioes e tarefas', icon: 'Calendar', price: 0, included: true },
      { id: 'pc-monitoramento', name: 'Monitoramento', description: 'Monitoramento de equipe e atividades', icon: 'Eye', price: 0, included: true },
      { id: 'pc-agentes-ia', name: 'Agentes IA', description: 'Automacao com agentes de inteligencia artificial', icon: 'Bot', price: 329, included: false },
      { id: 'pc-assistente-ia', name: 'Assistente IA', description: 'Assistente inteligente para produtividade', icon: 'Sparkles', price: 87, included: false },
      { id: 'pc-campanhas-whatsapp', name: 'Campanhas WhatsApp', description: 'Campanhas em massa via WhatsApp', icon: 'Megaphone', price: 164, included: false },
      { id: 'pc-csat', name: 'CSAT', description: 'Pesquisa de satisfacao do cliente', icon: 'ThumbsUp', price: 43, included: false },
      { id: 'pc-analytics-avancado', name: 'Analytics Avancado', description: 'Relatorios e dashboards avancados', icon: 'BarChart3', price: 65, included: false },
      { id: 'pc-monitoramento-avancado', name: 'Monitoramento Avancado', description: 'Monitoramento avancado com alertas', icon: 'Shield', price: 54, included: false },
    ],
  },
  {
    id: 'piperleads2',
    name: 'PiperLeads2',
    tagline: 'CRM de Vendas com IA',
    basePrice: 87,
    setupFee: 1319,
    color: {
      primary: '#A78BFA',
      secondary: '#BFFF00',
      bg: 'from-purple-500/15 to-lime-500/10',
      border: 'border-purple-500/40',
      text: 'text-purple-400',
    },
    logo: '/piperleads-logo.png',
    logoLight: '/piperleads-logo-light.png',
    modules: [
      { id: 'pl-funis', name: 'Funis/CRM', description: 'Gestao de funis e pipeline de vendas', icon: 'GitBranch', price: 0, included: true },
      { id: 'pl-agenda', name: 'Agenda', description: 'Agendamento de reunioes e tarefas', icon: 'Calendar', price: 0, included: true },
      { id: 'pl-monitoramento', name: 'Monitoramento', description: 'Monitoramento de equipe e atividades', icon: 'Eye', price: 0, included: true },
      { id: 'pl-analytics', name: 'Analytics', description: 'Relatorios e dashboards avancados', icon: 'BarChart3', price: 0, included: true },
      { id: 'pl-contatos', name: 'Contatos', description: 'Gestao de contatos e leads', icon: 'Users', price: 0, included: true },
      { id: 'pl-automacoes', name: 'Automacoes', description: 'Workflows e automacoes de processos', icon: 'Zap', price: 0, included: true },
      { id: 'pl-agentes-ia', name: 'Agentes IA', description: 'Automacao com agentes de inteligencia artificial', icon: 'Bot', price: 384, included: false },
      { id: 'pl-assistente-ia', name: 'Assistente IA', description: 'Assistente inteligente para produtividade', icon: 'Sparkles', price: 98, included: false },
      { id: 'pl-campanhas-whatsapp', name: 'Campanhas WhatsApp', description: 'Campanhas em massa via WhatsApp', icon: 'Megaphone', price: 219, included: false },
      { id: 'pl-csat', name: 'CSAT', description: 'Pesquisa de satisfacao do cliente', icon: 'ThumbsUp', price: 54, included: false },
      { id: 'pl-sales-assist', name: 'Sales Assist', description: 'Assistencia inteligente para vendas', icon: 'TrendingUp', price: 142, included: false },
      { id: 'pl-propostas', name: 'Propostas', description: 'Geracao e gestao de propostas comerciais', icon: 'FileText', price: 87, included: false },
      { id: 'pl-email-cadences', name: 'Email Cadences', description: 'Sequencias automatizadas de email', icon: 'Mail', price: 109, included: false },
      { id: 'pl-instagram', name: 'Instagram', description: 'Integracao com Instagram para captacao', icon: 'Camera', price: 54, included: false },
      { id: 'pl-piperhunt', name: 'PiperHunt', description: 'Prospeccao B2B - cobranca por CNPJ consultado', icon: 'Search', price: 0, included: false },
    ],
  },
]

export function getUserTier(users: number): UserTier {
  for (const tier of USER_TIERS) {
    if (tier.max === null && users >= tier.min) return tier
    if (tier.max !== null && users >= tier.min && users <= tier.max) return tier
  }
  return USER_TIERS[0]
}

export function calculatePrice(
  product: Product,
  selectedModuleIds: string[],
  users: number,
  periodId: string,
  config?: PricingConfig,
  piperhuntCnpjs?: number,
): PriceBreakdown {
  const basePrice = config?.basePrices[product.id] ?? product.basePrice
  const setupFee = config?.setupFees[product.id] ?? product.setupFee

  const tier = getUserTier(users)
  const tierIndex = USER_TIERS.indexOf(tier)
  const discountPercent = config?.tierDiscounts[tierIndex] ?? tier.discount

  const discountedPerUser = basePrice * (1 - discountPercent)
  const usersTotal = discountedPerUser * users

  let addonsTotal = 0
  for (const mod of product.modules) {
    if (!mod.included && selectedModuleIds.includes(mod.id)) {
      // PiperHunt is credit-based, skip from flat addon total
      if (mod.id === 'pl-piperhunt') continue
      const modPrice = config?.modulePrices[product.id]?.[mod.id] ?? mod.price
      addonsTotal += modPrice
    }
  }

  let piperhuntCost = 0
  if (selectedModuleIds.includes('pl-piperhunt') && piperhuntCnpjs && piperhuntCnpjs > 0) {
    piperhuntCost = calculatePiperHuntCost(piperhuntCnpjs)
  }

  const subtotal = usersTotal + addonsTotal + piperhuntCost

  const periodData = PERIOD_DISCOUNTS.find(p => p.id === periodId) ?? PERIOD_DISCOUNTS[0]
  const periodDiscount = config?.periodDiscounts[periodData.id] ?? periodData.discount
  const periodDiscountAmount = subtotal * periodDiscount
  const total = subtotal - periodDiscountAmount
  const totalAnnual = total * 12

  return {
    basePerUser: basePrice,
    discountPercent,
    discountedPerUser,
    usersTotal,
    addonsTotal,
    piperhuntCost,
    subtotal,
    periodDiscount,
    periodDiscountAmount,
    total,
    totalAnnual,
    setupFee,
  }
}
