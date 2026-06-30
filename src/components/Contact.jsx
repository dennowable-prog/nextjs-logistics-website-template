import { Icon, ContainerFrame } from './Icons';

const Contact = () => {
  return (
    <section id="contact" className="wrapper position-relative" style={{ background: 'linear-gradient(180deg, #111111 0%, #1a1a1a 100%)' }}>
      <div className="corrugated" />
      <div className="container section-padding position-relative" style={{ zIndex: 1 }}>
        <div className="row gx-10 gy-8">
          <div className="col-lg-5" data-cue="slideInRight" data-delay="100">
            <span className="display-heading-3 text-amber text-uppercase mb-2 d-block">Свяжитесь с нами</span>
            <h2 className="display-heading-2 text-white mb-3">Контакты</h2>
            <div className="hazard-divider mb-5" />

            <div className="contact-item d-flex align-items-start mb-3">
              <ContainerFrame className="contact-icon-frame me-3" hoverScan={false}>
                <Icon name="pin" size={20} color="#f59e0b" />
              </ContainerFrame>
              <div>
                <h6 className="fw-bold text-white mb-1 fs-16">Адрес</h6>
                <p className="mb-0 fs-15" style={{ color: '#a3a3a3' }}>г. Москва, Новая Басманная улица, 12с2А</p>
              </div>
            </div>

            <div className="contact-item d-flex align-items-start mb-3">
              <ContainerFrame className="contact-icon-frame me-3" hoverScan={false}>
                <Icon name="phone" size={20} color="#f59e0b" />
              </ContainerFrame>
              <div>
                <h6 className="fw-bold text-white mb-1 fs-16">Телефон</h6>
                <a href="tel:+79636948738" className="text-decoration-none d-block mb-1 fs-15" style={{ color: '#a3a3a3' }}>+7 (963) 694-87-38</a>
                <span className="fs-14" style={{ color: '#555' }}>Звонки с 9:00 до 18:00</span>
              </div>
            </div>

            <div className="contact-item d-flex align-items-start mb-3">
              <ContainerFrame className="contact-icon-frame me-3" hoverScan={false}>
                <Icon name="email" size={20} color="#f59e0b" />
              </ContainerFrame>
              <div>
                <h6 className="fw-bold text-white mb-1 fs-16">Email</h6>
                <a href="mailto:newlinecargo2003@gmail.com" className="text-decoration-none d-block mb-1 fs-15" style={{ color: '#a3a3a3' }}>newlinecargo2003@gmail.com</a>
                <a href="mailto:newlinecargo2003@yandex.ru" className="text-decoration-none fs-15" style={{ color: '#a3a3a3' }}>newlinecargo2003@yandex.ru</a>
              </div>
            </div>

            <div className="contact-item d-flex align-items-start">
              <ContainerFrame className="contact-icon-frame me-3" hoverScan={false}>
                <Icon name="clock" size={20} color="#f59e0b" />
              </ContainerFrame>
              <div>
                <h6 className="fw-bold text-white mb-1 fs-16">Режим работы</h6>
                <p className="mb-0 fs-15" style={{ color: '#a3a3a3' }}>Пн–Пт: 9:00–18:00</p>
              </div>
            </div>
          </div>

          <div className="col-lg-7" data-cue="slideInLeft" data-delay="300">
            <div className="overflow-hidden shadow-lg" style={{ height: '520px', border: '1px solid #2a2a2a' }}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2244.286776578097!2d37.6553!3d55.7712!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNTXCsDQ2JzE2LjMiTiAzN8KwMzknMTkuMSJF!5e0!3m2!1sru!2sru!4v1"
                width="100%"
                height="100%"
                style={{ border: 0, filter: 'grayscale(0.8) invert(0.9)' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="New Line Cargo на карте"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
