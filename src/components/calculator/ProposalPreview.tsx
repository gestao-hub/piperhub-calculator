import type { Product, PricingConfig, ProposalData, PaymentOverrides } from '@/lib/pricing-data'
import { calculatePaymentBreakdowns } from '@/lib/pricing-data'
import { formatPercent } from '@/lib/utils'

interface ProposalPreviewProps {
  product: Product
  data: ProposalData
  config?: PricingConfig
  paymentOverrides?: PaymentOverrides
}

function fmtCurrency(value: number): string {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export function ProposalPreview({ product, data, config, paymentOverrides }: ProposalPreviewProps) {
  const today = new Date().toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })

  const primaryColor = product.color.primary
  const primaryLight = `${primaryColor}12`
  const primaryMedium = `${primaryColor}20`

  // Formas de pagamento calculadas sobre o valor do plano anual (melhor preço).
  const paymentBreakdowns = calculatePaymentBreakdowns(data.annual, config, paymentOverrides)

  const plans = [
    {
      key: 'mensal',
      label: 'Mensal',
      caption: 'Plano mensal',
      value: data.monthly,
      discount: 0,
      highlight: false,
    },
    {
      key: 'semestral',
      label: 'Semestral',
      caption: 'Plano semestral',
      value: data.semiannual,
      discount: data.semiannualDiscount,
      highlight: false,
    },
    {
      key: 'anual',
      label: 'Anual',
      caption: 'Plano anual',
      value: data.annual,
      discount: data.annualDiscount,
      highlight: true,
    },
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
        boxSizing: 'border-box',
        backgroundColor: '#ffffff',
        color: '#1a1a2e',
        fontFamily: 'Inter, Arial, sans-serif',
        fontSize: '12px',
        lineHeight: '1.45',
        flexDirection: 'column',
      }}
    >
      {/* ==================== HEADER BAR ==================== */}
      <div style={{ backgroundColor: primaryColor, padding: '26px 32px 22px' }}>
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
                fontSize: '23px',
                fontWeight: 800,
                color: '#ffffff',
                fontFamily: 'Outfit, Inter, Arial, sans-serif',
                letterSpacing: '0.5px',
                textTransform: 'uppercase',
              }}
            >
              {data.title}
            </div>
            <div
              style={{
                fontSize: '13px',
                color: 'rgba(255,255,255,0.75)',
                marginTop: '4px',
                fontWeight: 400,
              }}
            >
              {product.name} — {product.tagline}
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div
              style={{
                fontSize: '12px',
                color: 'rgba(255,255,255,0.9)',
                fontWeight: 500,
              }}
            >
              {today}
            </div>
          </div>
        </div>
      </div>

      {/* ==================== LOGO + CLIENT ==================== */}
      <div
        style={{
          padding: '20px 32px',
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
            style={{ height: '40px', width: 'auto' }}
            crossOrigin="anonymous"
          />
        </div>
        {data.companyName && data.companyName.trim() !== '' && (
          <div style={{ textAlign: 'right' }}>
            <div
              style={{
                fontSize: '10px',
                color: '#9ca3af',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                fontWeight: 600,
                marginBottom: '3px',
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
              {data.companyName}
            </div>
          </div>
        )}
      </div>

      {/* ==================== 3 VALORES (MENSAL / SEMESTRAL / ANUAL) ==================== */}
      <div style={{ padding: '24px 32px 8px' }}>
        <h3
          style={{
            fontSize: '14px',
            fontWeight: 700,
            margin: '0 0 14px',
            color: '#1a1a2e',
            fontFamily: 'Outfit, Inter, Arial, sans-serif',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}
        >
          Investimento mensal
        </h3>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: '12px',
          }}
        >
          {plans.map((plan) => (
            <div
              key={plan.key}
              style={{
                position: 'relative',
                borderRadius: '12px',
                padding: '18px 16px 16px',
                textAlign: 'center',
                border: plan.highlight
                  ? `2px solid ${primaryColor}`
                  : '1px solid #e5e7eb',
                backgroundColor: plan.highlight ? primaryLight : '#ffffff',
              }}
            >
              {plan.highlight && (
                <div
                  style={{
                    position: 'absolute',
                    top: '-10px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    backgroundColor: primaryColor,
                    color: '#ffffff',
                    fontSize: '9px',
                    fontWeight: 700,
                    letterSpacing: '0.5px',
                    padding: '3px 12px',
                    borderRadius: '10px',
                    textTransform: 'uppercase',
                    whiteSpace: 'nowrap',
                  }}
                >
                  Melhor preço
                </div>
              )}
              <div
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  color: '#6b7280',
                }}
              >
                {plan.label}
              </div>
              <div
                style={{
                  fontSize: '24px',
                  fontWeight: 800,
                  color: primaryColor,
                  fontFamily: 'Outfit, Inter, Arial, sans-serif',
                  margin: '8px 0 2px',
                  lineHeight: 1.1,
                }}
              >
                {fmtCurrency(plan.value)}
              </div>
              <div style={{ fontSize: '10px', color: '#9ca3af', fontWeight: 500 }}>
                por mês
              </div>
              {plan.discount > 0 ? (
                <div
                  style={{
                    display: 'inline-block',
                    marginTop: '8px',
                    padding: '2px 10px',
                    borderRadius: '10px',
                    fontSize: '10px',
                    fontWeight: 700,
                    backgroundColor: primaryMedium,
                    color: primaryColor,
                  }}
                >
                  −{(plan.discount * 100).toFixed(0)}% no {plan.caption.toLowerCase()}
                </div>
              ) : (
                <div style={{ fontSize: '10px', color: '#9ca3af', marginTop: '8px' }}>
                  Sem fidelidade
                </div>
              )}
            </div>
          ))}
        </div>

        <div
          style={{
            marginTop: '10px',
            fontSize: '10px',
            color: '#9ca3af',
            textAlign: 'center',
          }}
        >
          {data.users} {data.users === 1 ? 'usuário' : 'usuários'} ({data.tierLabel})
          {data.packageName ? ` · ${data.packageName}` : ''} · valores por mês conforme o plano escolhido
        </div>
      </div>

      {/* ==================== TAXA DE IMPLANTAÇÃO ==================== */}
      <div style={{ padding: '12px 32px 0' }}>
        <div
          style={{
            border: `1.5px solid ${primaryMedium}`,
            borderRadius: '12px',
            padding: '14px 20px',
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
              Taxa de Implantação
            </div>
            <div style={{ fontSize: '10px', color: '#6b7280', marginTop: '2px' }}>
              Pagamento único — setup completo e treinamento da equipe
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
            {fmtCurrency(data.setupFee)}
          </span>
        </div>
      </div>

      {/* ==================== FORMAS DE PAGAMENTO ==================== */}
      <div style={{ padding: '22px 32px 0' }}>
        <h3
          style={{
            fontSize: '14px',
            fontWeight: 700,
            margin: '0 0 12px',
            color: '#1a1a2e',
            fontFamily: 'Outfit, Inter, Arial, sans-serif',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}
        >
          Formas de Pagamento
        </h3>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '10px',
          }}
        >
          {paymentBreakdowns.map((b) => {
            const showsDiscount = b.discount > 0
            const headlineLabel =
              b.method.id === 'boleto'
                ? 'Mensal'
                : b.method.id === 'card_installments'
                  ? `${b.installments}x de`
                  : 'Total à vista'
            const headlineValue =
              b.method.id === 'boleto'
                ? b.monthlyAfterDiscount
                : b.method.id === 'card_installments'
                  ? b.installmentValue
                  : b.totalUpfront
            const subLabel =
              b.method.id === 'boleto'
                ? 'Total no ano'
                : b.method.id === 'card_installments'
                  ? 'Total'
                  : 'Equivalente mensal'
            const subValue =
              b.method.id === 'boleto'
                ? b.annualTotal
                : b.method.id === 'card_installments'
                  ? b.totalUpfront
                  : b.monthlyAfterDiscount
            const description =
              b.method.id === 'card_installments'
                ? `Em até ${b.installments}x no cartão de crédito`
                : b.method.description

            return (
              <div
                key={b.method.id}
                style={{
                  borderRadius: '10px',
                  border: `1px solid ${showsDiscount ? primaryMedium : '#e5e7eb'}`,
                  padding: '12px 14px',
                  backgroundColor: '#ffffff',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '7px',
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: '12px',
                        fontWeight: 700,
                        color: '#1f2937',
                        fontFamily: 'Outfit, Inter, Arial, sans-serif',
                      }}
                    >
                      {b.method.label}
                    </div>
                    <div style={{ fontSize: '10px', color: '#9ca3af', marginTop: '1px' }}>
                      {description}
                    </div>
                  </div>
                  {showsDiscount && (
                    <span
                      style={{
                        fontSize: '10px',
                        fontWeight: 700,
                        padding: '2px 8px',
                        borderRadius: '8px',
                        backgroundColor: primaryMedium,
                        color: primaryColor,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      −{formatPercent(b.discount)}%
                    </span>
                  )}
                </div>
                <div
                  style={{
                    borderTop: '1px solid #f0f1f3',
                    paddingTop: '7px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2px',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'baseline',
                    }}
                  >
                    <span style={{ fontSize: '10px', color: '#6b7280' }}>{headlineLabel}</span>
                    <span
                      style={{
                        fontSize: '15px',
                        fontWeight: 800,
                        color: primaryColor,
                        fontFamily: 'Outfit, Inter, Arial, sans-serif',
                      }}
                    >
                      {fmtCurrency(headlineValue)}
                    </span>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: '10px',
                      color: '#9ca3af',
                    }}
                  >
                    <span>{subLabel}</span>
                    <span>{fmtCurrency(subValue)}</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* ==================== BENEFÍCIOS (linha curta) ==================== */}
      {data.benefits.length > 0 && (
        <div style={{ padding: '22px 32px 0' }}>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '8px 18px',
              justifyContent: 'center',
              padding: '14px 16px',
              borderRadius: '10px',
              backgroundColor: '#fafbfc',
              border: '1px solid #eef0f3',
            }}
          >
            {data.benefits.map((benefit) => (
              <div
                key={benefit}
                style={{ display: 'flex', alignItems: 'center', gap: '7px' }}
              >
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '16px',
                    height: '16px',
                    borderRadius: '50%',
                    backgroundColor: '#dcfce7',
                    color: '#16a34a',
                    fontSize: '10px',
                    fontWeight: 700,
                    flexShrink: 0,
                  }}
                >
                  &#10003;
                </span>
                <span style={{ fontSize: '11px', fontWeight: 500, color: '#374151' }}>
                  {benefit}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==================== FOOTER ==================== */}
      <div style={{ padding: '20px 32px 18px', marginTop: 'auto' }}>
        <div
          style={{
            borderTop: '1px solid #e5e7eb',
            paddingTop: '12px',
            textAlign: 'center',
          }}
        >
          <span style={{ fontSize: '10px', color: '#b0b5be', fontWeight: 400 }}>
            PiperHub — Proposta válida por {data.validity}
          </span>
        </div>
      </div>
    </div>
  )
}
