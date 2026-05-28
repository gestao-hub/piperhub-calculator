import type { Product, PricingConfig } from '@/lib/pricing-data'
import {
  calculatePrice,
  calculatePackagePrice,
  getUserTier,
  PERIOD_DISCOUNTS,
  PIPERHUNT_TIERS,
  getPiperHuntTier,
  PIPERKEY_PACKAGES,
} from '@/lib/pricing-data'

interface ProposalPreviewProps {
  product: Product
  selectedModuleIds: string[]
  selectedPackageId?: string | null
  users: number
  period: string
  config?: PricingConfig
  piperhuntCnpjs?: number
  companyName?: string
}

function fmtCurrency(value: number): string {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export function ProposalPreview({
  product,
  selectedModuleIds,
  selectedPackageId,
  users,
  period,
  config,
  piperhuntCnpjs = 0,
  companyName,
}: ProposalPreviewProps) {
  const selectedPackage = selectedPackageId
    ? PIPERKEY_PACKAGES.find(p => p.id === selectedPackageId)
    : undefined

  const breakdown = selectedPackage
    ? calculatePackagePrice(selectedPackage, product, users, period, config)
    : calculatePrice(product, selectedModuleIds, users, period, config, piperhuntCnpjs)

  const tier = getUserTier(users)
  const periodData = PERIOD_DISCOUNTS.find(p => p.id === period) ?? PERIOD_DISCOUNTS[0]
  const today = new Date().toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })

  const isPiperhuntSelected =
    !selectedPackage && selectedModuleIds.includes('pl-piperhunt') && piperhuntCnpjs > 0
  const piperhuntTier = isPiperhuntSelected ? getPiperHuntTier(piperhuntCnpjs) : null

  const allModules = product.modules.filter(
    m => selectedModuleIds.includes(m.id)
  )

  const benefits = [
    'Mensagens ilimitadas',
    'Suporte tecnico',
    'Atualizacoes inclusas',
    'Setup e treinamento',
    'Sem fidelidade',
    'Onboarding dedicado',
  ]

  // Derive a lighter tint from the primary color for accents
  const primaryColor = product.color.primary
  const primaryLight = `${primaryColor}12`
  const primaryMedium = `${primaryColor}20`

  return (
    <div
      id="proposal-content"
      style={{
        display: 'none',
        position: 'absolute',
        left: '-9999px',
        width: '210mm',
        minHeight: '297mm',
        backgroundColor: '#ffffff',
        color: '#1a1a2e',
        fontFamily: 'Inter, Arial, sans-serif',
        fontSize: '12px',
        lineHeight: '1.5',
      }}
    >
      {/* ==================== HEADER BAR ==================== */}
      <div
        style={{
          backgroundColor: primaryColor,
          padding: '32px 32px 28px',
          position: 'relative',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
          }}
        >
          <div>
            <div
              style={{
                fontSize: '24px',
                fontWeight: 800,
                color: '#ffffff',
                fontFamily: 'Outfit, Inter, Arial, sans-serif',
                letterSpacing: '0.5px',
                textTransform: 'uppercase',
              }}
            >
              Proposta Comercial
            </div>
            <div
              style={{
                fontSize: '13px',
                color: 'rgba(255,255,255,0.7)',
                marginTop: '4px',
                fontWeight: 400,
              }}
            >
              {product.name} - Solucao completa
            </div>
          </div>
          <div
            style={{
              textAlign: 'right',
            }}
          >
            <div
              style={{
                fontSize: '12px',
                color: 'rgba(255,255,255,0.85)',
                fontWeight: 500,
              }}
            >
              {today}
            </div>
          </div>
        </div>
      </div>

      {/* ==================== LOGO + CLIENT SECTION ==================== */}
      <div
        style={{
          padding: '24px 32px',
          borderBottom: '1px solid #e5e7eb',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <img
            src={product.logoLight}
            alt={product.name}
            style={{ height: '42px', width: 'auto' }}
            crossOrigin="anonymous"
          />
          <div style={{ fontSize: '12px', color: '#6b7280' }}>
            {product.tagline}
          </div>
        </div>
        {companyName && companyName.trim() !== '' && (
          <div style={{ textAlign: 'right' }}>
            <div
              style={{
                fontSize: '10px',
                color: '#9ca3af',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                fontWeight: 600,
                marginBottom: '4px',
              }}
            >
              Preparado para
            </div>
            <div
              style={{
                fontSize: '16px',
                fontWeight: 700,
                color: primaryColor,
                fontFamily: 'Outfit, Inter, Arial, sans-serif',
              }}
            >
              {companyName}
            </div>
          </div>
        )}
      </div>

      {/* ==================== MODULES TABLE ==================== */}
      <div style={{ padding: '24px 32px' }}>
        <h3
          style={{
            fontSize: '15px',
            fontWeight: 700,
            marginBottom: '14px',
            color: '#1a1a2e',
            fontFamily: 'Outfit, Inter, Arial, sans-serif',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}
        >
          Configuracao Selecionada
        </h3>

        {selectedPackage && (
          <div
            style={{
              padding: '14px 18px',
              borderRadius: '10px',
              backgroundColor: primaryLight,
              border: `1px solid ${primaryMedium}`,
              marginBottom: '14px',
            }}
          >
            <div
              style={{
                fontSize: '13px',
                fontWeight: 700,
                color: primaryColor,
                fontFamily: 'Outfit, Inter, Arial, sans-serif',
                marginBottom: '4px',
              }}
            >
              {selectedPackage.name}
            </div>
            <div style={{ fontSize: '11px', color: '#6b7280' }}>
              {selectedPackage.description}
            </div>
          </div>
        )}

        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: '12px',
            borderRadius: '8px',
            overflow: 'hidden',
          }}
        >
          <thead>
            <tr>
              <th
                style={{
                  textAlign: 'left',
                  padding: '12px 16px',
                  backgroundColor: primaryColor,
                  fontWeight: 600,
                  color: '#ffffff',
                  fontSize: '12px',
                }}
              >
                Modulo
              </th>
              <th
                style={{
                  textAlign: 'right',
                  padding: '12px 16px',
                  backgroundColor: primaryColor,
                  fontWeight: 600,
                  color: '#ffffff',
                  fontSize: '12px',
                }}
              >
                {selectedPackage ? 'Incluso' : 'Valor/mes'}
              </th>
            </tr>
          </thead>
          <tbody>
            {allModules.map((mod, idx) => {
              const isPiperhunt = mod.id === 'pl-piperhunt'
              const modPrice = isPiperhunt
                ? breakdown.piperhuntCost
                : (config?.modulePrices[product.id]?.[mod.id] ?? mod.price)
              const modLabel = isPiperhunt && isPiperhuntSelected
                ? `PiperHunt (${piperhuntCnpjs} CNPJs)`
                : mod.name
              const valueDisplay = selectedPackage ? '✓' : fmtCurrency(modPrice)

              return (
                <tr
                  key={mod.id}
                  style={{
                    backgroundColor: idx % 2 === 0 ? '#ffffff' : '#f8f9fb',
                  }}
                >
                  <td
                    style={{
                      padding: '11px 16px',
                      borderBottom: '1px solid #f0f1f3',
                      color: '#1f2937',
                      fontWeight: 500,
                    }}
                  >
                    {modLabel}
                  </td>
                  <td
                    style={{
                      padding: '11px 16px',
                      borderBottom: '1px solid #f0f1f3',
                      textAlign: 'right',
                      fontWeight: 600,
                      color: selectedPackage ? '#16a34a' : '#1f2937',
                    }}
                  >
                    {valueDisplay}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* ==================== FINANCIAL SUMMARY ==================== */}
      <div style={{ padding: '0 32px 24px' }}>
        <h3
          style={{
            fontSize: '15px',
            fontWeight: 700,
            marginBottom: '14px',
            color: '#1a1a2e',
            fontFamily: 'Outfit, Inter, Arial, sans-serif',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}
        >
          Resumo Financeiro
        </h3>

        <div
          style={{
            border: '1px solid #e5e7eb',
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03)',
          }}
        >
          {/* Users row */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '12px 20px',
              borderBottom: '1px solid #f0f1f3',
              backgroundColor: '#ffffff',
            }}
          >
            <span style={{ color: '#6b7280', fontSize: '12px' }}>Usuarios</span>
            <span style={{ fontWeight: 600, fontSize: '12px', color: '#1f2937' }}>
              {users} ({tier.label})
            </span>
          </div>

          {selectedPackage ? (
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '12px 20px',
                borderBottom: '1px solid #f0f1f3',
                backgroundColor: '#fafbfc',
              }}
            >
              <span style={{ color: '#6b7280', fontSize: '12px' }}>
                {selectedPackage.name} ({users} x {fmtCurrency(breakdown.basePerUser)})
              </span>
              <span style={{ fontWeight: 500, fontSize: '12px', color: '#1f2937' }}>
                {fmtCurrency(breakdown.usersTotal)}
              </span>
            </div>
          ) : (
            <>
              {/* Base row */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '12px 20px',
                  borderBottom: '1px solid #f0f1f3',
                  backgroundColor: '#fafbfc',
                }}
              >
                <span style={{ color: '#6b7280', fontSize: '12px' }}>
                  Base ({users} x {fmtCurrency(breakdown.basePerUser)})
                </span>
                <span style={{ fontWeight: 500, fontSize: '12px', color: '#1f2937' }}>
                  {fmtCurrency(breakdown.basePerUser * users)}
                </span>
              </div>

              {/* Volume discount */}
              {breakdown.discountPercent > 0 && (
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '12px 20px',
                    borderBottom: '1px solid #f0f1f3',
                    backgroundColor: '#ffffff',
                  }}
                >
                  <span style={{ color: '#6b7280', fontSize: '12px' }}>
                    Desconto volume (-{(breakdown.discountPercent * 100).toFixed(0)}%)
                  </span>
                  <span style={{ fontWeight: 600, color: '#16a34a', fontSize: '12px' }}>
                    -{fmtCurrency(breakdown.basePerUser * users - breakdown.usersTotal)}
                  </span>
                </div>
              )}

              {/* Modules total */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '12px 20px',
                  borderBottom: '1px solid #f0f1f3',
                  backgroundColor: '#fafbfc',
                }}
              >
                <span style={{ color: '#6b7280', fontSize: '12px' }}>Total modulos selecionados</span>
                <span style={{ fontWeight: 500, fontSize: '12px', color: '#1f2937' }}>
                  {fmtCurrency(breakdown.addonsTotal)}
                </span>
              </div>
            </>
          )}

          {/* PiperHunt line */}
          {isPiperhuntSelected && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '12px 20px',
                borderBottom: '1px solid #f0f1f3',
                backgroundColor: '#ffffff',
              }}
            >
              <span style={{ color: '#6b7280', fontSize: '12px' }}>
                PiperHunt ({piperhuntCnpjs} CNPJs x {fmtCurrency(piperhuntTier?.pricePerCnpj ?? 0)})
              </span>
              <span style={{ fontWeight: 500, fontSize: '12px', color: '#1f2937' }}>
                {fmtCurrency(breakdown.piperhuntCost)}
              </span>
            </div>
          )}

          {/* Period discount */}
          {breakdown.periodDiscount > 0 && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '12px 20px',
                borderBottom: '1px solid #f0f1f3',
                backgroundColor: '#fafbfc',
              }}
            >
              <span style={{ color: '#6b7280', fontSize: '12px' }}>
                Desconto {periodData.label} (-{(breakdown.periodDiscount * 100).toFixed(0)}%)
              </span>
              <span style={{ fontWeight: 600, color: '#16a34a', fontSize: '12px' }}>
                -{fmtCurrency(breakdown.periodDiscountAmount)}
              </span>
            </div>
          )}

          {/* TOTAL MENSAL - prominent */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '18px 20px',
              backgroundColor: primaryColor,
              color: '#ffffff',
            }}
          >
            <span
              style={{
                fontSize: '17px',
                fontWeight: 800,
                fontFamily: 'Outfit, Inter, Arial, sans-serif',
                letterSpacing: '0.3px',
              }}
            >
              TOTAL MENSAL
            </span>
            <span
              style={{
                fontSize: '22px',
                fontWeight: 800,
                fontFamily: 'Outfit, Inter, Arial, sans-serif',
              }}
            >
              {fmtCurrency(breakdown.total)}
            </span>
          </div>

          {/* Total anual */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '12px 20px',
              backgroundColor: primaryLight,
            }}
          >
            <span style={{ color: '#6b7280', fontSize: '12px', fontWeight: 500 }}>
              Total anual estimado
            </span>
            <span style={{ fontWeight: 700, fontSize: '13px', color: primaryColor }}>
              {fmtCurrency(breakdown.totalAnnual)}
            </span>
          </div>
        </div>

        {/* Setup fee - separate highlight box */}
        <div
          style={{
            marginTop: '16px',
            border: `2px solid ${primaryMedium}`,
            borderRadius: '12px',
            padding: '16px 20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: primaryLight,
          }}
        >
          <div>
            <div
              style={{
                fontWeight: 700,
                fontSize: '13px',
                color: '#1f2937',
                fontFamily: 'Outfit, Inter, Arial, sans-serif',
              }}
            >
              Taxa de Implantacao (pagamento unico)
            </div>
            <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '3px' }}>
              Setup completo + treinamento da equipe
            </div>
          </div>
          <span
            style={{
              fontSize: '20px',
              fontWeight: 800,
              color: primaryColor,
              fontFamily: 'Outfit, Inter, Arial, sans-serif',
            }}
          >
            {fmtCurrency(breakdown.setupFee)}
          </span>
        </div>
      </div>

      {/* ==================== PIPERHUNT CREDIT TABLE ==================== */}
      {isPiperhuntSelected && (
        <div style={{ padding: '0 32px 24px' }}>
          <h3
            style={{
              fontSize: '15px',
              fontWeight: 700,
              marginBottom: '14px',
              color: '#1a1a2e',
              fontFamily: 'Outfit, Inter, Arial, sans-serif',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}
          >
            PiperHunt - Tabela de Creditos
          </h3>

          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: '12px',
              borderRadius: '8px',
              overflow: 'hidden',
              border: '1px solid #e5e7eb',
            }}
          >
            <thead>
              <tr>
                <th
                  style={{
                    textAlign: 'left',
                    padding: '12px 16px',
                    backgroundColor: primaryColor,
                    fontWeight: 600,
                    color: '#ffffff',
                    fontSize: '12px',
                  }}
                >
                  Faixa
                </th>
                <th
                  style={{
                    textAlign: 'right',
                    padding: '12px 16px',
                    backgroundColor: primaryColor,
                    fontWeight: 600,
                    color: '#ffffff',
                    fontSize: '12px',
                  }}
                >
                  Preco/CNPJ
                </th>
                <th
                  style={{
                    textAlign: 'right',
                    padding: '12px 16px',
                    backgroundColor: primaryColor,
                    fontWeight: 600,
                    color: '#ffffff',
                    fontSize: '12px',
                  }}
                >
                  Custo maximo
                </th>
              </tr>
            </thead>
            <tbody>
              {PIPERHUNT_TIERS.map((t) => {
                const isActive = piperhuntTier !== null && t.min === piperhuntTier.min
                return (
                  <tr
                    key={t.label}
                    style={{
                      backgroundColor: isActive ? primaryLight : '#ffffff',
                    }}
                  >
                    <td
                      style={{
                        padding: '10px 16px',
                        borderBottom: '1px solid #f0f1f3',
                        color: '#1f2937',
                        fontWeight: isActive ? 700 : 400,
                      }}
                    >
                      {t.label}
                      {isActive && (
                        <span
                          style={{
                            marginLeft: '8px',
                            display: 'inline-block',
                            padding: '2px 10px',
                            borderRadius: '10px',
                            fontSize: '10px',
                            fontWeight: 700,
                            backgroundColor: primaryMedium,
                            color: primaryColor,
                          }}
                        >
                          SELECIONADO
                        </span>
                      )}
                    </td>
                    <td
                      style={{
                        padding: '10px 16px',
                        borderBottom: '1px solid #f0f1f3',
                        textAlign: 'right',
                        fontWeight: isActive ? 700 : 500,
                        color: '#1f2937',
                      }}
                    >
                      {fmtCurrency(t.pricePerCnpj)}
                    </td>
                    <td
                      style={{
                        padding: '10px 16px',
                        borderBottom: '1px solid #f0f1f3',
                        textAlign: 'right',
                        fontWeight: isActive ? 700 : 500,
                        color: '#1f2937',
                      }}
                    >
                      {t.maxCost !== null ? fmtCurrency(t.maxCost) : 'Sob consulta'}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>

          <div
            style={{
              marginTop: '10px',
              fontSize: '11px',
              color: '#6b7280',
              fontStyle: 'italic',
            }}
          >
            Cobrado conforme consumo mensal de CNPJs consultados.
          </div>
        </div>
      )}

      {/* ==================== BENEFITS - 2 COLUMN GRID ==================== */}
      <div style={{ padding: '0 32px 24px' }}>
        <h3
          style={{
            fontSize: '15px',
            fontWeight: 700,
            marginBottom: '14px',
            color: '#1a1a2e',
            fontFamily: 'Outfit, Inter, Arial, sans-serif',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}
        >
          O que esta incluso
        </h3>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '10px',
          }}
        >
          {benefits.map((benefit) => (
            <div
              key={benefit}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 14px',
                borderRadius: '8px',
                backgroundColor: '#fafbfc',
                borderLeft: '3px solid #16a34a',
              }}
            >
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  backgroundColor: '#dcfce7',
                  color: '#16a34a',
                  fontSize: '11px',
                  fontWeight: 700,
                  flexShrink: 0,
                }}
              >
                &#10003;
              </span>
              <span
                style={{
                  fontSize: '12px',
                  fontWeight: 500,
                  color: '#374151',
                }}
              >
                {benefit}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ==================== FOOTER ==================== */}
      <div
        style={{
          padding: '20px 32px 16px',
          marginTop: 'auto',
        }}
      >
        <div
          style={{
            borderTop: '1px solid #e5e7eb',
            paddingTop: '14px',
            textAlign: 'center',
          }}
        >
          <span style={{ fontSize: '10px', color: '#b0b5be', fontWeight: 400 }}>
            PiperHub | Proposta valida por 30 dias
          </span>
        </div>
      </div>
    </div>
  )
}
