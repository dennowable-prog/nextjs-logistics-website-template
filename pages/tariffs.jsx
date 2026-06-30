import Head from 'next/head';
import { services } from '../src/data';
import { Icon, ContainerFrame } from '../src/components/Icons';
import Breadcrumbs from '../src/components/Breadcrumbs';
import { breadcrumbJsonLd } from '../src/seo-jsonld';

const transportComparison = [
  { mode: 'Авиа', via: 'Авиаперевозка', time: '3–14 дней', cost: '$3–7 / кг', weight: 'До 150 кг', pros: 'Скорость, сохранность', icon: 'plane' },
  { mode: 'Ж/Д', via: 'Железная дорога', time: '20–35 дней', cost: '$80–150 / м³', weight: 'От 50 кг', pros: 'Низкая стоимость, большие объёмы', icon: 'train' },
  { mode: 'Море', via: 'Морской транспорт', time: '35–55 дней', cost: '$50–90 / м³', weight: 'От 1 м³', pros: 'Самый дешёвый вариант', icon: 'ship' },
  { mode: 'Авто', via: 'Автомобиль', time: '10–20 дней', cost: '$100–200 / м³', weight: 'От 100 кг', pros: 'Гибкость маршрута, до двери', icon: 'truck' },
  { mode: 'Мульти', via: 'Мультимодальный', time: '15–30 дней', cost: 'Индивидуально', weight: 'Любой', pros: 'Оптимальный маршрут', icon: 'globe' },
];

const TariffsPage = () => (
  <>
    <Head>
      <title>Тарифы и сравнение видов транспорта — New Line Cargo</title>
      <meta name="description" content="Актуальные тарифы на грузоперевозки. Сравнение авиа, Ж/Д, морских и автомобильных перевозок по срокам, стоимости и весу." />
      <meta property="og:image" content="https://newlinecargo.ru/og/og-tariffs.png" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd([
        { label: 'Тарифы' },
      ])) }} />
    </Head>

    <section className="wrapper position-relative" style={{ minHeight: '50vh', background: '#111111' }}>
      <div className="corrugated" />
      <div className="container position-relative" style={{ zIndex: 1, minHeight: '50vh', display: 'flex', alignItems: 'center' }}>
        <div className="row w-100">
          <div className="col-lg-8" data-cue="fadeIn">
            <Breadcrumbs items={[
              { label: 'Тарифы' },
            ]} />
            <div className="hero-badge">
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e', display: 'inline-block' }} />
              Тарифы
            </div>
            <h1 className="display-heading-1 text-white mb-3">Тарифы на перевозки</h1>
            <p className="fs-19 fw-light mb-0" style={{ color: '#a3a3a3', maxWidth: '600px' }}>
              Базовые цены на основные направления и виды транспорта
            </p>
          </div>
        </div>
      </div>
    </section>

    <section className="wrapper position-relative" style={{ background: '#1a1a1a' }}>
      <div className="container section-padding">
        <div className="row mb-8" data-cue="fadeIn">
          <div className="col-md-10 col-lg-8 mx-auto text-center">
            <span className="display-heading-3 text-amber text-uppercase mb-2 d-block">Стоимость</span>
            <h2 className="display-heading-2 text-white mb-3">Базовые тарифы по направлениям</h2>
            <div className="hazard-divider mx-auto mb-4" />
            <p className="fs-16" style={{ color: '#a3a3a3' }}>Цены указаны ориентировочно. Точный расчёт — через форму заявки или по запросу.</p>
          </div>
        </div>
        <div className="row g-4" data-cue="fadeIn" data-delay="200">
          {services.slice(0, 4).map((s, i) => (
            <div className="col-md-6 col-lg-3" key={i}>
              <a href={`/services/${s.slug}`} className="text-decoration-none d-block h-100">
                <div className="p-4 h-100 text-center" style={{ background: '#111111', border: '1px solid #2a2a2a', transition: 'border-color 0.3s ease, transform 0.3s ease', cursor: 'pointer' }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#f59e0b'; e.currentTarget.style.transform = 'translateY(-4px)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#2a2a2a'; e.currentTarget.style.transform = 'translateY(0)'; }}
                >
                  <ContainerFrame className="mx-auto mb-3" hoverScan={false}>
                    <Icon name={s.icon} size={28} color="#f59e0b" />
                  </ContainerFrame>
                  <h4 className="fw-bold text-white fs-18 mb-3">{s.title}</h4>
                  <p className="fs-15 mb-0" style={{ color: '#a3a3a3' }}>{s.desc.split('.')[0]}.</p>
                </div>
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>

    <section className="wrapper position-relative" style={{ background: '#111111' }}>
      <div className="corrugated" />
      <div className="container section-padding position-relative" style={{ zIndex: 1 }}>
        <div className="row mb-8" data-cue="fadeIn">
          <div className="col-md-10 col-lg-8 mx-auto text-center">
            <span className="display-heading-3 text-amber text-uppercase mb-2 d-block">Сравнение</span>
            <h2 className="display-heading-2 text-white mb-3">Сравнение видов транспорта</h2>
            <div className="hazard-divider mx-auto mb-4" />
          </div>
        </div>
        <div className="row justify-content-center" data-cue="fadeIn" data-delay="200">
          <div className="col-12" style={{ overflowX: 'auto' }}>
            <table className="w-100" style={{ borderCollapse: 'collapse', minWidth: '700px' }}>
              <thead>
                <tr style={{ background: '#1a1a1a' }}>
                  {['Вид транспорта', 'Сроки', 'Стоимость', 'Вес груза', 'Преимущества'].map((h, i) => (
                    <th key={i} className="fw-bold text-amber text-uppercase fs-14 p-3" style={{ letterSpacing: '0.05em', fontFamily: "'Barlow Condensed', sans-serif", textAlign: 'left', borderBottom: '1px solid #2a2a2a' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {transportComparison.map((t, i) => (
                  <tr key={i} style={{ background: i % 2 === 0 ? '#111111' : '#0d0d0d', borderBottom: '1px solid #2a2a2a' }}>
                    <td className="p-3">
                      <div className="d-flex align-items-center gap-2">
                        <ContainerFrame hoverScan={false}>
                          <Icon name={t.icon} size={20} color="#f59e0b" />
                        </ContainerFrame>
                        <span className="fw-bold text-white fs-15">{t.mode}</span>
                      </div>
                    </td>
                    <td className="p-3 fs-15" style={{ color: '#d4d4d4' }}>{t.time}</td>
                    <td className="p-3 fs-15" style={{ color: '#f59e0b', fontFamily: "'JetBrains Mono', monospace" }}>{t.cost}</td>
                    <td className="p-3 fs-15" style={{ color: '#a3a3a3' }}>{t.weight}</td>
                    <td className="p-3 fs-15" style={{ color: '#a3a3a3' }}>{t.pros}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="row mt-8" data-cue="fadeIn">
          <div className="col text-center">
            <p className="fs-15" style={{ color: '#555' }}>
              * Цены могут меняться в зависимости от курса валют, сезона и объёма груза. Актуальную стоимость уточняйте у менеджера.
            </p>
          </div>
        </div>
      </div>
    </section>
  </>
);

export default TariffsPage;
