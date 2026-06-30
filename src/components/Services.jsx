import { services } from 'data';
import { Icon, ContainerFrame } from './Icons';

const Services = () => {
  return (
    <section id="services" className="wrapper position-relative" style={{ background: 'linear-gradient(180deg, #111111 0%, #1a1a1a 100%)' }}>
      <div className="corrugated" />
      <div className="container section-padding position-relative" style={{ zIndex: 1 }}>
        <div className="row mb-10" data-cue="fadeIn">
          <div className="col-md-10 col-lg-8 mx-auto text-center">
            <span className="display-heading-3 text-amber text-uppercase mb-2 d-block">Что мы предлагаем</span>
            <h2 className="display-heading-2 text-white mb-3">Наши услуги</h2>
            <div className="hazard-divider mx-auto mb-4" />
            <p className="fs-18" style={{ color: '#a3a3a3', maxWidth: '600px', margin: '0 auto' }}>
              Полный спектр логистических решений — от авиаперевозок до мультимодальных контейнерных перевозок
            </p>
          </div>
        </div>

        <div className="row gx-6 gy-8">
          {services.map(({ id, title, slug, desc, icon, details }, idx) => (
            <div className="col-md-6 col-lg-3" key={id} data-cue="zoomIn" data-delay={100 + idx * 150}>
              <a href={`/services/${slug}`} className="text-decoration-none d-block h-100">
                <div className="card-service-premium h-100 border-0 p-4 text-center hover-lift">
                  <div className="card-body d-flex flex-column">
                    <ContainerFrame className="mx-auto mb-4">
                      <Icon name={icon} size={28} color="#f59e0b" />
                    </ContainerFrame>
                    <h4 className="fw-bold mb-3 text-white fs-20">{title}</h4>
                    <p className="mb-4 fs-16 lh-lg flex-grow-1" style={{ color: '#a3a3a3' }}>{desc}</p>
                    {details && (
                      <ul className="list-unstyled text-start mb-0" style={{ borderTop: '1px solid #2a2a2a', paddingTop: '1rem' }}>
                        {details.map((d, i) => (
                          <li key={i} className="d-flex align-items-center mb-2 fs-15" style={{ color: '#a3a3a3' }}>
                            <Icon name="check" size={14} color="#f59e0b" />
                            <span className="ms-2">{d}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                    <div className="mt-3 text-start">
                      <span className="fs-14 text-amber fw-semibold">Подробнее →</span>
                    </div>
                  </div>
                </div>
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
