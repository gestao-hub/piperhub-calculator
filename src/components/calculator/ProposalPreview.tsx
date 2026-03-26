import type { Product, PricingConfig } from '@/lib/pricing-data'
import { calculatePrice, getUserTier, PERIOD_DISCOUNTS, PIPERHUNT_TIERS, getPiperHuntTier } from '@/lib/pricing-data'

interface ProposalPreviewProps {
  product: Product
  selectedModuleIds: string[]
  users: number
  period: string
  config?: PricingConfig
  piperhuntCnpjs?: number
}

function fmtCurrency(value: number): string {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export function ProposalPreview({
  product,
  selectedModuleIds,
  users,
  period,
  config,
  piperhuntCnpjs = 0,
}: ProposalPreviewProps) {
  const breakdown = calculatePrice(product, selectedModuleIds, users, period, config, piperhuntCnpjs)
  const tier = getUserTier(users)
  const periodData = PERIOD_DISCOUNTS.find(p => p.id === period) ?? PERIOD_DISCOUNTS[0]
  const today = new Date().toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })

  const isPiperhuntSelected = selectedModuleIds.includes('pl-piperhunt') && piperhuntCnpjs > 0
  const piperhuntTier = isPiperhuntSelected ? getPiperHuntTier(piperhuntCnpjs) : null

  const allModules = product.modules.filter(
    m => m.included || selectedModuleIds.includes(m.id)
  )

  const benefits = [
    'Mensagens ilimitadas',
    'Suporte tecnico',
    'Atualizacoes inclusas',
    'Setup e treinamento',
    'Sem fidelidade',
  ]

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
      {/* Header bar */}
      <div
        style={{
          backgroundColor: product.color.primary,
          padding: '24px 32px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <span
          style={{
            color: '#ffffff',
            fontSize: '22px',
            fontWeight: 700,
            fontFamily: 'Outfit, Inter, Arial, sans-serif',
          }}
        >
          Proposta Comercial
        </span>
        <span style={{ color: '#ffffffcc', fontSize: '12px' }}>
          {today}
        </span>
      </div>

      {/* Logo section */}
      <div style={{ padding: '24px 32px', borderBottom: '1px solid #e5e7eb' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img
            src={product.logoLight}
            alt={product.name}
            style={{ height: '40px', width: 'auto' }}
            crossOrigin="anonymous"
          />
          <div>
            <div
              style={{
                fontSize: '20px',
                fontWeight: 700,
                color: product.color.primary,
                fontFamily: 'Outfit, Inter, Arial, sans-serif',
              }}
            >
              {product.name}
            </div>
            <div style={{ fontSize: '13px', color: '#6b7280' }}>
              {product.tagline}
            </div>
          </div>
        </div>
      </div>

      {/* Configuracao Selecionada */}
      <div style={{ padding: '24px 32px' }}>
        <h3
          style={{
            fontSize: '16px',
            fontWeight: 600,
            marginBottom: '16px',
            color: '#1a1a2e',
            fontFamily: 'Outfit, Inter, Arial, sans-serif',
          }}
        >
          Configuracao Selecionada
        </h3>

        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: '12px',
          }}
        >
          <thead>
            <tr>
              <th
                style={{
                  textAlign: 'left',
                  padding: '10px 12px',
                  backgroundColor: '#f3f4f6',
                  borderBottom: '2px solid #e5e7eb',
                  fontWeight: 600,
                  color: '#374151',
                }}
              >
                Modulo
              </th>
              <th
                style={{
                  textAlign: 'center',
                  padding: '10px 12px',
                  backgroundColor: '#f3f4f6',
                  borderBottom: '2px solid #e5e7eb',
                  fontWeight: 600,
                  color: '#374151',
                }}
              >
                Status
              </th>
              <th
                style={{
                  textAlign: 'right',
                  padding: '10px 12px',
                  backgroundColor: '#f3f4f6',
                  borderBottom: '2px solid #e5e7eb',
                  fontWeight: 600,
                  color: '#374151',
                }}
              >
                Valor
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

              return (
                <tr
                  key={mod.id}
                  style={{
                    backgroundColor: idx % 2 === 0 ? '#ffffff' : '#f9fafb',
                  }}
                >
                  <td
                    style={{
                      padding: '8px 12px',
                      borderBottom: '1px solid #e5e7eb',
                      color: '#1f2937',
                    }}
                  >
                    {modLabel}
                  </td>
                  <td
                    style={{
                      padding: '8px 12px',
                      borderBottom: '1px solid #e5e7eb',
                      textAlign: 'center',
                    }}
                  >
                    <span
                      style={{
                        display: 'inline-block',
                        padding: '2px 10px',
                        borderRadius: '12px',
                        fontSize: '11px',
                        fontWeight: 600,
                        backgroundColor: mod.included ? '#dcfce7' : `${product.color.primary}20`,
                        color: mod.included ? '#166534' : product.color.primary,
                      }}
                    >
                      {mod.included ? 'Incluso' : isPiperhunt ? 'Creditos' : 'Add-on'}
                    </span>
                  </td>
                  <td
                    style={{
                      padding: '8px 12px',
                      borderBottom: '1px solid #e5e7eb',
                      textAlign: 'right',
                      fontWeight: 500,
                      color: mod.included ? '#16a34a' : '#1f2937',
                    }}
                  >
                    {mod.included ? 'Incluso' : `${fmtCurrency(modPrice)}/mes`}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Resumo Financeiro */}
      <div style={{ padding: '0 32px 24px' }}>
        <h3
          style={{
            fontSize: '16px',
            fontWeight: 600,
            marginBottom: '16px',
            color: '#1a1a2e',
            fontFamily: 'Outfit, Inter, Arial, sans-serif',
          }}
        >
          Resumo Financeiro
        </h3>

        <div
          style={{
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '10px 16px',
              borderBottom: '1px solid #e5e7eb',
            }}
          >
            <span style={{ color: '#6b7280' }}>Usuarios</span>
            <span style={{ fontWeight: 600 }}>
              {users} ({tier.label})
            </span>
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '10px 16px',
              borderBottom: '1px solid #e5e7eb',
              backgroundColor: '#f9fafb',
            }}
          >
            <span style={{ color: '#6b7280' }}>
              Base ({users} x {fmtCurrency(breakdown.basePerUser)})
            </span>
            <span style={{ fontWeight: 500 }}>
              {fmtCurrency(breakdown.basePerUser * users)}
            </span>
          </div>
          {breakdown.discountPercent > 0 && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '10px 16px',
                borderBottom: '1px solid #e5e7eb',
              }}
            >
              <span style={{ color: '#6b7280' }}>
                Desconto volume (-{(breakdown.discountPercent * 100).toFixed(0)}%)
              </span>
              <span style={{ fontWeight: 500, color: '#16a34a' }}>
                -{fmtCurrency(breakdown.basePerUser * users - breakdown.usersTotal)}
              </span>
            </div>
          )}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '10px 16px',
              borderBottom: '1px solid #e5e7eb',
              backgroundColor: '#f9fafb',
            }}
          >
            <span style={{ color: '#6b7280' }}>Total add-ons</span>
            <span style={{ fontWeight: 500 }}>
              {fmtCurrency(breakdown.addonsTotal)}
            </span>
          </div>
          {isPiperhuntSelected && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '10px 16px',
                borderBottom: '1px solid #e5e7eb',
              }}
            >
              <span style={{ color: '#6b7280' }}>
                PiperHunt ({piperhuntCnpjs} CNPJs x {fmtCurrency(piperhuntTier?.pricePerCnpj ?? 0)})
              </span>
              <span style={{ fontWeight: 500 }}>
                {fmtCurrency(breakdown.piperhuntCost)}
              </span>
            </div>
          )}
          {breakdown.periodDiscount > 0 && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '10px 16px',
                borderBottom: '1px solid #e5e7eb',
              }}
            >
              <span style={{ color: '#6b7280' }}>
                Desconto {periodData.label} (-{(breakdown.periodDiscount * 100).toFixed(0)}%)
              </span>
              <span style={{ fontWeight: 500, color: '#16a34a' }}>
                -{fmtCurrency(breakdown.periodDiscountAmount)}
              </span>
            </div>
          )}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '16px',
              backgroundColor: product.color.primary,
              color: '#ffffff',
            }}
          >
            <span style={{ fontSize: '16px', fontWeight: 700 }}>
              TOTAL MENSAL
            </span>
            <span style={{ fontSize: '20px', fontWeight: 700 }}>
              {fmtCurrency(breakdown.total)}
            </span>
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '10px 16px',
              backgroundColor: '#f9fafb',
            }}
          >
            <span style={{ color: '#6b7280' }}>Total anual estimado</span>
            <span style={{ fontWeight: 600 }}>
              {fmtCurrency(breakdown.totalAnnual)}
            </span>
          </div>
        </div>

        {/* Taxa de implantacao */}
        <div
          style={{
            marginTop: '16px',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            padding: '14px 16px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: '#f9fafb',
          }}
        >
          <div>
            <div style={{ fontWeight: 600, fontSize: '13px', color: '#1f2937' }}>
              Taxa de Implantacao (pagamento unico)
            </div>
            <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '2px' }}>
              Setup completo + treinamento da equipe
            </div>
          </div>
          <span
            style={{
              fontSize: '18px',
              fontWeight: 700,
              color: product.color.primary,
            }}
          >
            {fmtCurrency(breakdown.setupFee)}
          </span>
        </div>
      </div>

      {/* PiperHunt Credit Table */}
      {isPiperhuntSelected && (
        <div style={{ padding: '0 32px 24px' }}>
          <h3
            style={{
              fontSize: '16px',
              fontWeight: 600,
              marginBottom: '16px',
              color: '#1a1a2e',
              fontFamily: 'Outfit, Inter, Arial, sans-serif',
            }}
          >
            PiperHunt - Tabela de Creditos
          </h3>

          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: '12px',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
            }}
          >
            <thead>
              <tr>
                <th
                  style={{
                    textAlign: 'left',
                    padding: '10px 12px',
                    backgroundColor: '#f3f4f6',
                    borderBottom: '2px solid #e5e7eb',
                    fontWeight: 600,
                    color: '#374151',
                  }}
                >
                  Faixa
                </th>
                <th
                  style={{
                    textAlign: 'right',
                    padding: '10px 12px',
                    backgroundColor: '#f3f4f6',
                    borderBottom: '2px solid #e5e7eb',
                    fontWeight: 600,
                    color: '#374151',
                  }}
                >
                  Preco/CNPJ
                </th>
                <th
                  style={{
                    textAlign: 'right',
                    padding: '10px 12px',
                    backgroundColor: '#f3f4f6',
                    borderBottom: '2px solid #e5e7eb',
                    fontWeight: 600,
                    color: '#374151',
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
                      backgroundColor: isActive ? `${product.color.primary}15` : '#ffffff',
                    }}
                  >
                    <td
                      style={{
                        padding: '8px 12px',
                        borderBottom: '1px solid #e5e7eb',
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
                            padding: '1px 8px',
                            borderRadius: '10px',
                            fontSize: '10px',
                            fontWeight: 700,
                            backgroundColor: `${product.color.primary}25`,
                            color: product.color.primary,
                          }}
                        >
                          SELECIONADO
                        </span>
                      )}
                    </td>
                    <td
                      style={{
                        padding: '8px 12px',
                        borderBottom: '1px solid #e5e7eb',
                        textAlign: 'right',
                        fontWeight: isActive ? 700 : 500,
                        color: '#1f2937',
                      }}
                    >
                      {fmtCurrency(t.pricePerCnpj)}
                    </td>
                    <td
                      style={{
                        padding: '8px 12px',
                        borderBottom: '1px solid #e5e7eb',
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

      {/* O que esta incluso */}
      <div style={{ padding: '0 32px 24px' }}>
        <h3
          style={{
            fontSize: '16px',
            fontWeight: 600,
            marginBottom: '12px',
            color: '#1a1a2e',
            fontFamily: 'Outfit, Inter, Arial, sans-serif',
          }}
        >
          O que esta incluso
        </h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {benefits.map((benefit) => (
            <span
              key={benefit}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 14px',
                borderRadius: '20px',
                backgroundColor: '#f0fdf4',
                color: '#166534',
                fontSize: '11px',
                fontWeight: 500,
              }}
            >
              &#10003; {benefit}
            </span>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          backgroundColor: '#f3f4f6',
          padding: '16px 32px',
          textAlign: 'center',
          marginTop: 'auto',
          borderTop: '1px solid #e5e7eb',
        }}
      >
        <span style={{ fontSize: '11px', color: '#9ca3af' }}>
          PiperHub | piperhub.io | Proposta valida por 30 dias
        </span>
      </div>
    </div>
  )
}
