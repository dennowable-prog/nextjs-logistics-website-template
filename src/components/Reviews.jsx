import Image from 'next/image';
import { reviews } from 'data';
import { Icon } from './Icons';

const Reviews = () => {
  return (
    <section id="reviews" className="wrapper position-relative" style={{ backgroundColor: '#111111' }}>
      <div className="corrugated" />
      <div
        className="position-absolute top-0 start-0 w-100 h-100"
        style={{ backgroundImage: 'radial-gradient(circle at 70% 50%, #f59e0b 0%, transparent 50%)', opacity: 0.04 }}
      />
      <div className="container section-padding position-relative" style={{ zIndex: 1 }}>
        <div className="row mb-10" data-cue="fadeInUp">
          <div className="col-md-10 col-lg-8 mx-auto text-center">
            <span className="display-heading-3 text-amber text-uppercase mb-2 d-block">Нам доверяют</span>
            <h2 className="display-heading-2 text-white mb-3">Благодарственные письма</h2>
            <div className="hazard-divider mx-auto mb-4" />
            <p className="fs-18" style={{ color: '#a3a3a3', maxWidth: '600px', margin: '0 auto' }}>
              Нас рекомендуют ведущие организации России
            </p>
          </div>
        </div>
        <div className="row gx-6 gy-6">
          {reviews.map(({ id, name, company, text, rating, certImage }, idx) => (
            <div className="col-md-6 col-lg-4" key={id} data-cue="fadeInUp" data-delay={100 + idx * 150}>
              <div className="review-card h-100 d-flex flex-column">
                {certImage && (
                  <div className="mb-4 overflow-hidden d-flex align-items-center justify-content-center" style={{ height: '140px', background: 'rgba(255,255,255,0.02)' }}>
                    <Image
                      src={certImage}
                      alt={name}
                      width={200}
                      height={140}
                      style={{ objectFit: 'contain', padding: '12px' }}
                    />
                  </div>
                )}
                <div className="d-flex gap-1 mb-3">
                  {[...Array(rating)].map((_, i) => (
                    <Icon key={i} name="star" size={14} color="#f59e0b" />
                  ))}
                </div>
                <p className="mb-4 fs-16 lh-lg flex-grow-1" style={{ color: '#d4d4d4' }}>{'\u201C'}{text}{'\u201D'}</p>
                <div style={{ borderTop: '1px solid #2a2a2a', paddingTop: '1rem' }}>
                  <h6 className="fw-bold mb-0 text-white fs-16">{name}</h6>
                  <small style={{ color: '#a3a3a3' }}>{company}</small>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Reviews;
