import { Icon, ContainerFrame } from './Icons';

const steps = [
  {
    id: 1,
    title: 'Оставьте заявку',
    desc: 'Заполните форму на сайте или позвоните нам. Мы уточним детали вашего груза и маршрут.',
    icon: 'file',
  },
  {
    id: 2,
    title: 'Расчёт стоимости',
    desc: 'Рассчитаем оптимальный маршрут и стоимость с учётом веса, объёма и сроков доставки.',
    icon: 'calculator',
  },
  {
    id: 3,
    title: 'Организация перевозки',
    desc: 'Оформляем документы, страхуем груз, выбираем транспорт. Полное таможенное сопровождение.',
    icon: 'truck',
  },
  {
    id: 4,
    title: 'Доставка до двери',
    desc: 'Отслеживаем груз на каждом этапе. Доставляем точно в срок до двери получателя.',
    icon: 'home',
  },
];

const Steps = () => {
  return (
    <section className="wrapper position-relative" style={{ background: 'linear-gradient(180deg, #1a1a1a 0%, #111111 100%)' }}>
      <div className="corrugated" />
      <div className="container section-padding position-relative" style={{ zIndex: 1 }}>
        <div className="row mb-10" data-cue="fadeInUp">
          <div className="col-md-10 col-lg-8 mx-auto text-center">
            <span className="display-heading-3 text-amber text-uppercase mb-2 d-block">Как мы работаем</span>
            <h2 className="display-heading-2 text-white mb-3">Схема работы</h2>
            <div className="hazard-divider mx-auto mb-4" />
            <p className="fs-18" style={{ color: '#a3a3a3', maxWidth: '600px', margin: '0 auto' }}>
              От заявки до доставки — прозрачный процесс с полным контролем на каждом этапе
            </p>
          </div>
        </div>

        <div className="row gx-6 gy-8 position-relative">
          {/* Connection line */}
          <div className="position-absolute d-none d-lg-block" style={{ top: '70px', left: '10%', right: '10%', height: '1px', background: 'linear-gradient(90deg, transparent, #f59e0b, transparent)', opacity: 0.3 }} />

          {steps.map(({ id, title, desc, icon }, idx) => (
            <div className="col-lg-3" key={id} data-cue="fadeInUp" data-delay={100 + idx * 150}>
              <div className="step-card text-center">
                <ContainerFrame className="mx-auto mb-3 step-icon-frame">
                  <Icon name={icon} size={26} color="#f59e0b" />
                </ContainerFrame>
                <span className="step-number position-absolute top-0 end-0 mt-2 me-3">{String(id).padStart(2, '0')}</span>
                <h5 className="fw-bold text-white mb-2 fs-18">{title}</h5>
                <p className="fs-15 lh-lg mb-0" style={{ color: '#a3a3a3' }}>{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Steps;
