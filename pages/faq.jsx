import Head from 'next/head';
import { useState } from 'react';
import { Icon } from '../src/components/Icons';
import Breadcrumbs from '../src/components/Breadcrumbs';
import faqData from '../src/faq-data';
import { breadcrumbJsonLd } from '../src/seo-jsonld';

const FAQItem = ({ item, isOpen, onToggle }) => (
  <div
    style={{ background: '#1a1a1a', border: isOpen ? '1px solid #f59e0b' : '1px solid #2a2a2a', borderRadius: 0, marginBottom: '0.5rem', transition: 'border-color 0.3s ease' }}
  >
    <button
      onClick={onToggle}
      style={{
        width: '100%', background: 'none', border: 'none', padding: '1.25rem 1.5rem',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        cursor: 'pointer', color: '#d4d4d4', fontSize: '1rem', fontWeight: 600,
        textAlign: 'left', fontFamily: 'inherit',
      }}
    >
      <span>{item.q}</span>
      <span style={{ transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)', transition: 'transform 0.3s ease', flexShrink: 0, marginLeft: '1rem' }}>
        <Icon name="arrow-right" size={16} color="#f59e0b" />
      </span>
    </button>
    <div
      style={{
        maxHeight: isOpen ? '500px' : '0px', overflow: 'hidden',
        transition: 'max-height 0.3s ease, padding 0.3s ease',
        padding: isOpen ? '0 1.5rem 1.25rem' : '0 1.5rem',
      }}
    >
      <p style={{ color: '#a3a3a3', fontSize: '0.9375rem', lineHeight: 1.7, margin: 0 }}>{item.a}</p>
    </div>
  </div>
);

const FAQPage = () => {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <>
      <Head>
        <title>Часто задаваемые вопросы — New Line Cargo</title>
        <meta name="description" content="Ответы на частые вопросы о грузоперевозках: сроки, таможня, минимальный вес, виды транспорта, оплата, страховка." />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd([
          { label: 'FAQ' },
        ])) }} />
      </Head>

      <section className="wrapper position-relative" style={{ minHeight: '50vh', background: '#111111' }}>
        <div className="corrugated" />
        <div className="container position-relative" style={{ zIndex: 1, minHeight: '50vh', display: 'flex', alignItems: 'center' }}>
          <div className="row w-100">
            <div className="col-lg-8" data-cue="fadeIn">
              <Breadcrumbs items={[
                { label: 'FAQ' },
              ]} />
              <div className="hero-badge">
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e', display: 'inline-block' }} />
                FAQ
              </div>
              <h1 className="display-heading-1 text-white mb-3">Часто задаваемые вопросы</h1>
              <p className="fs-19 fw-light mb-0" style={{ color: '#a3a3a3', maxWidth: '600px' }}>
                Ответы на самые популярные вопросы о грузоперевозках и таможне
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="wrapper position-relative" style={{ background: '#1a1a1a' }}>
        <div className="container section-padding" style={{ maxWidth: '800px' }}>
          {faqData.map((item, i) => (
            <FAQItem
              key={i}
              item={item}
              isOpen={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? null : i)}
            />
          ))}
        </div>
      </section>
    </>
  );
};

export default FAQPage;
