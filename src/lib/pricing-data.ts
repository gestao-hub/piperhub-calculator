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
  packageTierPrices: Record<string, number[]>
  paymentDiscounts: Record<string, number>
}

export interface PaymentMethod {
  id: string
  label: string
  shortLabel: string
  description: string
  icon: 'Zap' | 'FileText' | 'CreditCard' | 'Calendar'
  discount: number
}

export const PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: 'pix',
    label: 'PIX a vista',
    shortLabel: 'PIX',
    description: 'Pagamento instantaneo, total anual a vista',
    icon: 'Zap',
    discount: 0.03,
  },
  {
    id: 'boleto',
    label: 'Boleto bancario',
    shortLabel: 'Boleto',
    description: 'Mensal via boleto compensado em 3 dias',
    icon: 'FileText',
    discount: 0.02,
  },
  {
    id: 'card_full',
    label: 'Cartao a vista (TCV)',
    shortLabel: 'TCV',
    description: 'Total anual no cartao em uma cobranca',
    icon: 'CreditCard',
    discount: 0.02,
  },
  {
    id: 'card_installments',
    label: 'Cartao parcelado',
    shortLabel: 'Parcelado',
    description: 'Em ate 12x no cartao de credito',
    icon: 'Calendar',
    discount: 0,
  },
]

export interface PaymentBreakdown {
  method: PaymentMethod
  discount: number
  monthlyAfterDiscount: number
  totalUpfront: number
  installmentValue: number
  installments: number
}

export function calculatePaymentBreakdowns(
  baseMonthly: number,
  config?: PricingConfig,
): PaymentBreakdown[] {
  return PAYMENT_METHODS.map(method => {
    const discount = config?.paymentDiscounts?.[method.id] ?? method.discount
    const monthlyAfterDiscount = baseMonthly * (1 - discount)
    const annualAfterDiscount = monthlyAfterDiscount * 12

    let totalUpfront = monthlyAfterDiscount
    let installmentValue = monthlyAfterDiscount
    let installments = 1

    if (method.id === 'pix' || method.id === 'card_full') {
      totalUpfront = annualAfterDiscount
      installmentValue = annualAfterDiscount
      installments = 1
    } else if (method.id === 'boleto') {
      totalUpfront = monthlyAfterDiscount
      installmentValue = monthlyAfterDiscount
      installments = 12
    } else if (method.id === 'card_installments') {
      totalUpfront = annualAfterDiscount
      installments = 12
      installmentValue = annualAfterDiscount / 12
    }

    return {
      method: { ...method, discount },
      discount,
      monthlyAfterDiscount,
      totalUpfront,
      installmentValue,
      installments,
    }
  })
}

export interface Package {
  id: string
  productId: 'piperkey'
  name: string
  tagline: string
  description: string
  moduleIds: string[]
  tierPrices: number[]
  setupFeeMultiplier: number
  highlight?: boolean
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
    setupFee: 2.5,
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
      { id: 'pk-funis', name: 'Funis/CRM', description: 'Gestao de funis e pipeline de vendas', icon: 'GitBranch', price: 87, included: false },
      { id: 'pk-agenda', name: 'Agenda', description: 'Agendamento de visitas e reunioes', icon: 'Calendar', price: 54, included: false },
      { id: 'pk-monitoramento', name: 'Monitoramento', description: 'Monitoramento de atividades e equipe', icon: 'Eye', price: 54, included: false },
      { id: 'pk-analytics', name: 'Analytics', description: 'Relatorios e dashboards avancados', icon: 'BarChart3', price: 65, included: false },
      { id: 'pk-contatos', name: 'Contatos', description: 'Gestao de contatos e leads', icon: 'Users', price: 54, included: false },
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
      { id: 'pk-empreendimentos', name: 'Empreendimentos', description: 'Gestao de empreendimentos imobiliarios', icon: 'Building2', price: 109, included: false },
      { id: 'pk-subpagina', name: 'Subpagina da Imobiliaria', description: 'Pagina publica personalizada da imobiliaria', icon: 'Layout', price: 87, included: false },
    ],
  },
  {
    id: 'pipercore',
    name: 'PiperCore',
    tagline: 'CRM para Contabilidade',
    basePrice: 76,
    setupFee: 2.5,
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
      { id: 'pc-funis', name: 'Funis/CRM', description: 'Gestao de funis e pipeline', icon: 'GitBranch', price: 76, included: false },
      { id: 'pc-agenda', name: 'Agenda', description: 'Agendamento de reunioes e tarefas', icon: 'Calendar', price: 43, included: false },
      { id: 'pc-monitoramento', name: 'Monitoramento', description: 'Monitoramento de equipe e atividades', icon: 'Eye', price: 43, included: false },
      { id: 'pc-agentes-ia', name: 'Agentes IA', description: 'Automacao com agentes de inteligencia artificial', icon: 'Bot', price: 329, included: false },
      { id: 'pc-assistente-ia', name: 'Assistente IA', description: 'Assistente inteligente para produtividade', icon: 'Sparkles', price: 87, included: false },
      { id: 'pc-campanhas-whatsapp', name: 'Campanhas WhatsApp', description: 'Campanhas em massa via WhatsApp', icon: 'Megaphone', price: 164, included: false },
      { id: 'pc-csat', name: 'CSAT', description: 'Pesquisa de satisfacao do cliente', icon: 'ThumbsUp', price: 43, included: false },
      { id: 'pc-analytics-avancado', name: 'Analytics Avancado', description: 'Relatorios e dashboards avancados', icon: 'BarChart3', price: 65, included: false },
      { id: 'pc-monitoramento-avancado', name: 'Monitoramento Avancado', description: 'Monitoramento avancado com alertas', icon: 'Shield', price: 54, included: false },
      { id: 'pc-portal-cliente', name: 'Portal do Cliente', description: 'Portal para clientes acompanharem obrigacoes', icon: 'Layout', price: 109, included: false },
      { id: 'pc-monitoramento-fiscal', name: 'Monitoramento Fiscal', description: 'Monitoramento fiscal automatizado (CNDs, situacao fiscal)', icon: 'FileSearch', price: 164, included: false },
    ],
  },
  {
    id: 'piperleads2',
    name: 'PiperLeads',
    tagline: 'CRM de Vendas com IA',
    basePrice: 87,
    setupFee: 2.5,
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
      { id: 'pl-funis', name: 'Funis/CRM', description: 'Gestao de funis e pipeline de vendas', icon: 'GitBranch', price: 87, included: false },
      { id: 'pl-agenda', name: 'Agenda', description: 'Agendamento de reunioes e tarefas', icon: 'Calendar', price: 54, included: false },
      { id: 'pl-monitoramento', name: 'Monitoramento', description: 'Monitoramento de equipe e atividades', icon: 'Eye', price: 54, included: false },
      { id: 'pl-analytics', name: 'Analytics', description: 'Relatorios e dashboards avancados', icon: 'BarChart3', price: 65, included: false },
      { id: 'pl-contatos', name: 'Contatos', description: 'Gestao de contatos e leads', icon: 'Users', price: 54, included: false },
      { id: 'pl-automacoes', name: 'Automacoes', description: 'Workflows e automacoes de processos', icon: 'Zap', price: 87, included: false },
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

const PACOTE_1_MODULES = [
  'pk-funis',
  'pk-agenda',
  'pk-monitoramento',
  'pk-analytics',
  'pk-contatos',
  'pk-pipeline-financeiro',
  'pk-propriedades',
  'pk-empreendimentos',
  'pk-subpagina',
]

const PACOTE_2_MODULES = [
  ...PACOTE_1_MODULES,
  'pk-agentes-ia',
  'pk-assistente-ia',
]

const PACOTE_3_MODULES = [
  ...PACOTE_2_MODULES,
  'pk-pos-venda',
  'pk-gestao-aluguel',
  'pk-campanhas-whatsapp',
]

export const PIPERKEY_PACKAGES: Package[] = [
  {
    id: 'pk-pacote-1',
    productId: 'piperkey',
    name: 'Pacote Essencial',
    tagline: 'O essencial para operar',
    description: 'CRM completo, agenda, monitoramento, analytics, contatos, pipeline financeiro, propriedades, empreendimentos e subpagina da imobiliaria.',
    moduleIds: PACOTE_1_MODULES,
    tierPrices: [347, 312, 295, 278, 260],
    setupFeeMultiplier: 2.5,
  },
  {
    id: 'pk-pacote-2',
    productId: 'piperkey',
    name: 'Pacote IA',
    tagline: 'Essencial + Inteligencia Artificial',
    description: 'Tudo do Pacote Essencial + Agentes de IA + Assistente de IA para automacao e produtividade.',
    moduleIds: PACOTE_2_MODULES,
    tierPrices: [497, 447, 422, 397, 372],
    setupFeeMultiplier: 2.5,
    highlight: true,
  },
  {
    id: 'pk-pacote-3',
    productId: 'piperkey',
    name: 'Pacote Completo',
    tagline: 'Tudo do PiperKey',
    description: 'Tudo do Pacote IA + Pos-venda + Gestao de Aluguel + Campanhas WhatsApp.',
    moduleIds: PACOTE_3_MODULES,
    tierPrices: [547, 492, 465, 437, 410],
    setupFeeMultiplier: 2.5,
  },
]

export function getPackageTierPrice(
  packageId: string,
  users: number,
  config?: PricingConfig,
): number {
  const pkg = PIPERKEY_PACKAGES.find(p => p.id === packageId)
  if (!pkg) return 0
  const tier = getUserTier(users)
  const tierIndex = USER_TIERS.indexOf(tier)
  const customPrices = config?.packageTierPrices?.[packageId]
  if (customPrices && customPrices[tierIndex] !== undefined) {
    return customPrices[tierIndex]
  }
  return pkg.tierPrices[tierIndex] ?? pkg.tierPrices[0]
}

export function calculatePackagePrice(
  pkg: Package,
  product: Product,
  users: number,
  periodId: string,
  config?: PricingConfig,
): PriceBreakdown {
  const pricePerUser = getPackageTierPrice(pkg.id, users, config)
  const usersTotal = pricePerUser * users

  const subtotal = usersTotal

  const periodData = PERIOD_DISCOUNTS.find(p => p.id === periodId) ?? PERIOD_DISCOUNTS[0]
  const periodDiscount = config?.periodDiscounts[periodData.id] ?? periodData.discount
  const periodDiscountAmount = subtotal * periodDiscount
  const total = subtotal - periodDiscountAmount
  const totalAnnual = total * 12

  const setupMultiplier = config?.setupFees[product.id] ?? pkg.setupFeeMultiplier
  const setupFee = total * setupMultiplier

  return {
    basePerUser: pricePerUser,
    discountPercent: 0,
    discountedPerUser: pricePerUser,
    usersTotal,
    addonsTotal: 0,
    piperhuntCost: 0,
    subtotal,
    periodDiscount,
    periodDiscountAmount,
    total,
    totalAnnual,
    setupFee,
  }
}

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
  const setupMultiplier = config?.setupFees[product.id] ?? 2.5

  const tier = getUserTier(users)
  const tierIndex = USER_TIERS.indexOf(tier)
  const discountPercent = config?.tierDiscounts[tierIndex] ?? tier.discount

  const discountedPerUser = basePrice * (1 - discountPercent)
  const usersTotal = discountedPerUser * users

  let addonsTotal = 0
  for (const mod of product.modules) {
    if (selectedModuleIds.includes(mod.id)) {
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
  const setupFee = total * setupMultiplier

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
