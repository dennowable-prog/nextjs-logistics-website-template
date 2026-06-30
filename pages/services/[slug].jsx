import Head from 'next/head';
import servicesData, { getRelatedServices } from '../../src/services-data';
import { Icon, ContainerFrame } from '../../src/components/Icons';
import Breadcrumbs from '../../src/components/Breadcrumbs';
import QuoteForm from '../../src/components/QuoteForm';
import { breadcrumbJsonLd } from '../../src/seo-jsonld';

export async function getStaticPaths() {
  return {
    paths: servicesData.map((s) => ({ params: { slug: s.slug } })),
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const service = servicesData.find((s) => s.slug === params.slug);
  const related = getRelatedServices(params.slug, 3);
  return { props: { service, related } };
}

const processSteps = {
  transport: [
    { title: 'Забор груза', desc: 'Забираем груз от поставщика или со склада. Проверяем количество, целостность упаковки, соответствие документам.' },
    { title: 'Основная перевозка', desc: 'Организуем транспортировку выбранным видом транспорта. Полное отслеживание на всём пути следования.' },
    { title: 'Таможня', desc: 'Оформляем таможенную декларацию, рассчитываем пошлины, проходим все этапы контроля. Вы получаете растаможенный груз.' },
    { title: 'Доставка до двери', desc: 'Доставляем груз до вашего склада или адреса в Москве и регионах. Предоставляем полный пакет закрывающих документов.' },
  ],
  geo: [
    { title: 'Забор в стране отправления', desc: 'Забираем груз от поставщика. Проверяем комплектность, упаковываем для международной перевозки.' },
    { title: 'Международная перевозка', desc: 'Отправляем выбранным транспортом (авиа, море, Ж/Д, авто). Полный контроль на всех этапах.' },
    { title: 'Таможня в РФ', desc: 'Растаможиваем груз, подготавливаем документы, уплачиваем пошлины. Выпуск на территории РФ.' },
    { title: 'Доставка до двери', desc: 'Финальная доставка до адреса получателя. Подписание актов, закрывающие документы.' },
  ],
  service: [
    { title: 'Консультация', desc: 'Анализируем ваш груз, подбираем код ТН ВЭД, рассчитываем пошлины и сборы.' },
    { title: 'Подготовка документов', desc: 'Готовим полный пакет: ДТ, ДТС, сертификаты, разрешения.' },
    { title: 'Подача декларации', desc: 'Подаём электронную декларацию, проходим все этапы таможенного контроля.' },
    { title: 'Выпуск груза', desc: 'Получаем выпуск товара. Вы получаете готовый к продаже груз с полным пакетом документов.' },
  ],
};

const faqData = {
  transport: [
    { q: 'Как рассчитать стоимость перевозки?', a: 'Стоимость зависит от веса, объёма, маршрута и способа перевозки. Оставьте заявку на сайте — мы рассчитаем за 30 минут.' },
    { q: 'Какой минимальный вес груза?', a: 'Минимальная партия — от 1 кг для авиаперевозок. Для Ж/Д и морских перевозок минимальный объём — от 1 м³ (сборный груз).' },
    { q: 'Нужна ли страховка?', a: 'Страхование не обязательно, но мы настоятельно рекомендуем его для всех грузов. Стоимость — 0.3% от объявленной стоимости груза.' },
    { q: 'Какие документы нужны для отправки?', a: 'Для начала достаточно инвойса и упаковочного листа. Остальные документы (контракт, ДТ, сертификаты) мы готовим в процессе работы.' },
  ],
  geo: [
    { q: 'Как начать сотрудничество?', a: 'Оставьте заявку на сайте или позвоните. Мы свяжемся, уточним детали груза, подготовим коммерческое предложение в течение 30 минут.' },
    { q: 'Вы работаете с физическими лицами?', a: 'New Line Cargo оказывает услуги исключительно юридическим лицам. Работаем по договору, предоставляем полный пакет закрывающих документов.' },
    { q: 'Как отслеживать груз?', a: 'Отслеживание груза осуществляется через диспетчера. Для получения информации о статусе свяжитесь с нами по телефону +7 (963) 694-87-38 или email newlinecargo2003@gmail.com. Сообщите номер вашей заявки — мы предоставим актуальную информацию.' },
  ],
  service: [
    { q: 'Сколько стоит таможенное оформление?', a: 'Стоимость — от 15 000 ₽ за партию. Точная цена зависит от сложности, количества позиций и необходимости сертификации.' },
    { q: 'Какие сроки оформления?', a: 'При правильной подготовке документов — 1-2 дня. При необходимости дополнительных проверок — до 7-10 дней.' },
    { q: 'Что делать, если нет своего бухгалтера по ВЭД?', a: 'Мы полностью берём на себя всю документацию: от подготовки контракта до закрывающих документов после растаможки.' },
  ],
};

const ServicePage = ({ service, related }) => {
  if (!service) return null;

  const steps = processSteps[service.category] || processSteps.transport;
  const faqs = faqData[service.category] || faqData.transport;

  return (
    <>
      <Head>
        <title>{service.title} — New Line Cargo</title>
        <meta name="description" content={service.metaDesc} />
        <meta property="og:title" content={`${service.title} — New Line Cargo`} />
        <meta property="og:description" content={service.metaDesc} />
        <meta property="og:image" content={`https://newlinecargo.ru/og/og-${service.slug}.png`} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:url" content={`https://newlinecargo.ru/services/${service.slug}`} />
        <link rel="canonical" href={`https://newlinecargo.ru/services/${service.slug}`} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd([
          { label: 'Услуги', href: '/services' },
          { label: service.h1 },
        ])) }} />
      </Head>

      <section className="wrapper position-relative" style={{ minHeight: '60vh', background: '#111111' }}>
        <div className="corrugated" />
        <div
          className="position-absolute top-0 start-0 w-100 h-100"
          style={{
            backgroundImage: 'radial-gradient(circle at 70% 50%, #f59e0b 0%, transparent 50%)',
            opacity: 0.06,
          }}
        />
        <div className="container position-relative" style={{ zIndex: 1, minHeight: '60vh', display: 'flex', alignItems: 'center' }}>
          <div className="row w-100">
            <div className="col-lg-8" data-cue="fadeIn">
              <Breadcrumbs items={[
                { label: 'Услуги', href: '/services' },
                { label: service.h1 },
              ]} />
              <div className="hero-badge">
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e', display: 'inline-block' }} />
                {service.strapline}
              </div>
              <h1 className="display-heading-1 text-white mb-3">{service.h1}</h1>
              <p className="fs-19 fw-light mb-0" style={{ color: '#a3a3a3', maxWidth: '600px' }}>
                {service.heroBg}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="wrapper position-relative" style={{ background: '#1a1a1a' }}>
        <div className="container section-padding">
          <div className="row gx-8 gy-8 align-items-start">
            <div className="col-lg-7" data-cue="fadeIn">
              {service.paragraphs.map((p, i) => (
                <p key={i} className="fs-17 lh-lg mb-4" style={{ color: '#a3a3a3' }}>{p}</p>
              ))}
            </div>
            <div className="col-lg-5" data-cue="fadeIn" data-delay="200">
              <div className="p-4" style={{ background: '#111111', border: '1px solid #2a2a2a' }}>
                <h5 className="fw-bold text-white text-uppercase tracking-wide mb-4 fs-16">Преимущества</h5>
                <div className="d-flex flex-column gap-3">
                  {service.advantages.map((adv, i) => (
                    <div key={i} className="d-flex align-items-center gap-3">
                      <ContainerFrame hoverScan={false}>
                        <Icon name={adv.icon} size={18} color="#f59e0b" />
                      </ContainerFrame>
                      <span className="fs-16" style={{ color: '#d4d4d4' }}>{adv.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="wrapper position-relative" style={{ background: '#111111' }}>
        <div className="corrugated" />
        <div className="container section-padding position-relative" style={{ zIndex: 1 }}>
          <div className="row mb-8" data-cue="fadeIn">
            <div className="col-md-10 col-lg-8 mx-auto text-center">
              <span className="display-heading-3 text-amber text-uppercase mb-2 d-block">Как мы работаем</span>
              <h2 className="display-heading-2 text-white mb-3">Процесс работы</h2>
              <div className="hazard-divider mx-auto mb-4" />
            </div>
          </div>
          <div className="row g-4 justify-content-center" data-cue="fadeIn" data-delay="200">
            {steps.map((step, i) => (
              <div className="col-md-6 col-lg-3" key={i}>
                <div className="p-4 text-center h-100" style={{ background: '#1a1a1a', border: '1px solid #2a2a2a' }}>
                  <div className="d-inline-flex align-items-center justify-content-center mb-3"
                    style={{ width: 40, height: 40, borderRadius: '50%', background: '#f59e0b', color: '#111', fontWeight: 700, fontSize: '16px' }}>
                    {i + 1}
                  </div>
                  <h5 className="fw-bold text-white mb-2 fs-16">{step.title}</h5>
                  <p className="fs-14 mb-0" style={{ color: '#a3a3a3' }}>{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {service.pricing && service.pricing.length > 0 && (
        <section className="wrapper position-relative" style={{ background: '#1a1a1a' }}>
          <div className="container section-padding">
            <div className="row mb-8" data-cue="fadeIn">
              <div className="col-md-10 col-lg-8 mx-auto text-center">
                <span className="display-heading-3 text-amber text-uppercase mb-2 d-block">Тарифы</span>
                <h2 className="display-heading-2 text-white mb-3">Стоимость {service.slug === 'customs' ? 'оформления' : 'перевозки'}</h2>
                <div className="hazard-divider mx-auto mb-4" />
              </div>
            </div>
            <div className="row g-4 justify-content-center" data-cue="fadeIn" data-delay="200">
              {service.pricing.map((p, i) => (
                <div className="col-md-6 col-lg-4" key={i}>
                  <div className="p-4 text-center" style={{ background: '#111111', border: '1px solid #2a2a2a', transition: 'border-color 0.3s ease' }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#f59e0b'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#2a2a2a'; }}
                  >
                    <p className="fs-16 mb-2" style={{ color: '#a3a3a3' }}>{p.label}</p>
                    <p className="data-number fs-32 fw-bold text-amber mb-1">{p.value}</p>
                    {p.note && <p className="fs-14 mb-0" style={{ color: '#555' }}>{p.note}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="wrapper position-relative" style={{ background: '#111111' }}>
        <div className="corrugated" />
        <div className="container section-padding position-relative" style={{ zIndex: 1 }}>
          <div className="row mb-8" data-cue="fadeIn">
            <div className="col-md-10 col-lg-8 mx-auto text-center">
              <span className="display-heading-3 text-amber text-uppercase mb-2 d-block">FAQ</span>
              <h2 className="display-heading-2 text-white mb-3">Часто задаваемые вопросы</h2>
              <div className="hazard-divider mx-auto mb-4" />
            </div>
          </div>
          <div className="row justify-content-center" data-cue="fadeIn" data-delay="200">
            <div className="col-lg-8">
              {faqs.map((item, i) => (
                <details key={i} className="mb-2 p-4" style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', cursor: 'pointer' }}>
                  <summary className="fw-bold text-white fs-16" style={{ cursor: 'pointer', listStyle: 'none' }}>
                    <div className="d-flex justify-content-between align-items-center">
                      <span>{item.q}</span>
                      <span className="text-amber fs-20 ms-3" style={{ lineHeight: 1 }}>+</span>
                    </div>
                  </summary>
                  <p className="fs-15 mt-3 mb-0" style={{ color: '#a3a3a3', cursor: 'auto' }}>{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      {related && related.length > 0 && (
        <section className="wrapper position-relative" style={{ background: '#1a1a1a' }}>
          <div className="container section-padding">
            <div className="row mb-8" data-cue="fadeIn">
              <div className="col-md-10 col-lg-8 mx-auto text-center">
                <span className="display-heading-3 text-amber text-uppercase mb-2 d-block">Похожие услуги</span>
                <h2 className="display-heading-2 text-white mb-3">Вам может быть интересно</h2>
                <div className="hazard-divider mx-auto mb-4" />
              </div>
            </div>
            <div className="row g-4 justify-content-center" data-cue="fadeIn" data-delay="200">
              {related.map((r, i) => (
                <div className="col-md-6 col-lg-4" key={i}>
                  <a href={`/services/${r.slug}`} className="text-decoration-none">
                    <div className="p-4 h-100" style={{ background: '#111111', border: '1px solid #2a2a2a', transition: 'border-color 0.3s ease, transform 0.3s ease', cursor: 'pointer' }}
                      onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#f59e0b'; e.currentTarget.style.transform = 'translateY(-4px)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#2a2a2a'; e.currentTarget.style.transform = 'translateY(0)'; }}
                    >
                      <div className="d-flex align-items-center gap-3 mb-3">
                        <ContainerFrame hoverScan={false}>
                          <Icon name={r.icon} size={22} color="#f59e0b" />
                        </ContainerFrame>
                        <h5 className="fw-bold text-white mb-0 fs-17">{r.title}</h5>
                      </div>
                      <p className="fs-15 mb-0" style={{ color: '#a3a3a3' }}>{r.strapline}</p>
                    </div>
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <QuoteForm service={service.title} serviceSlug={service.slug} />
    </>
  );
};

export default ServicePage;
