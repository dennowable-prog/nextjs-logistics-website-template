import CountUp from 'react-countup';
import { factList } from 'data';
import { Icon, ContainerFrame } from './Icons';

const Facts = () => {
  return (
    <section className="wrapper position-relative" style={{ background: 'linear-gradient(135deg, #111111 0%, #1a1a1a 100%)' }}>
      <div className="corrugated" />
      <div
        className="position-absolute top-0 start-0 w-100 h-100"
        style={{ backgroundImage: 'radial-gradient(circle at 30% 30%, #f59e0b 0%, transparent 50%)', opacity: 0.05 }}
      />
      <div className="container py-12 position-relative" style={{ zIndex: 1 }}>
        <div className="row mb-8" data-cue="fadeInUp">
          <div className="col-12 text-center">
            <span className="display-heading-3 text-uppercase mb-2 d-block" style={{ color: '#a3a3a3' }}>New Line Cargo в цифрах</span>
            <h2 className="display-heading-2 text-white mb-0">Ключевые показатели</h2>
          </div>
        </div>
        <div className="row counter-wrapper gy-8 text-center">
          {factList.map(({ value, suffix, title, icon, id }, idx) => (
            <div className="col-md-3" key={id} data-cue="fadeInUp" data-delay={100 + idx * 100}>
              <ContainerFrame className="mx-auto mb-4 fact-icon-frame">
                <Icon name={icon} size={24} color="#f59e0b" />
              </ContainerFrame>
              <h3 className="counter text-white mb-1 fs-40">
                <CountUp end={value} />{suffix}
              </h3>
              <p className="mb-0 fs-17" style={{ color: '#a3a3a3' }}>{title}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Facts;
