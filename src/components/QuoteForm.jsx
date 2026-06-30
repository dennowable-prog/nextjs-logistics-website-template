import { useState, useRef, useEffect } from 'react';
import { Icon } from './Icons';

const extraServices = [
  { id: 'buyout', label: 'Выкуп товаров в Китае' },
  { id: 'export_org', label: 'Организация экспорта под ключ' },
  { id: 'inspection', label: 'Инспекция груза' },
  { id: 'parallel_import', label: 'Параллельный импорт' },
  { id: 'certification', label: 'Сертификация / Честный знак' },
  { id: 'ved_optimization', label: 'Оптимизация ВЭД' },
  { id: 'insurance', label: 'Страховка' },
];

const transportOptions = ['Авиа', 'Ж/Д', 'Море', 'Авто', 'Мультимодально'];

const stepLabels = ['Контакты', 'Маршрут + Груз', 'Подтверждение'];

const slugToTransport = {
  avia: 'Авиа',
  rail: 'Ж/Д',
  auto: 'Авто',
  sea: 'Море',
  multimodal: 'Мультимодально',
};

const QuoteForm = ({ service, serviceSlug, prefill, onPrefillApplied }) => {
  const fileInputRef = useRef(null);
  const fileRefs = useRef({});
  const [currentStep, setCurrentStep] = useState(0);
  const [animDir, setAnimDir] = useState('forward');
  const [animKey, setAnimKey] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    phone: '',
    email: '',
    from: '',
    to: '',
    transport: transportOptions[0],
    cargoName: '',
    cargoDesc: '',
    cargoQty: '',
    cargoWeight: '',
    cargoVolume: '',
    comment: '',
    extras: [],
    files: [],
  });
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (prefill) {
      setFormData((prev) => ({
        ...prev,
        from: prefill.from || prev.from,
        to: prefill.to || prev.to,
        transport: prefill.transport || prev.transport,
      }));
      if (prefill.from || prefill.transport) {
        setAnimDir('forward');
        setAnimKey((k) => k + 1);
        setCurrentStep(1);
      }
      if (onPrefillApplied) onPrefillApplied();
    }
  }, [prefill, onPrefillApplied]);

  useEffect(() => {
    if (serviceSlug) {
      const transport = slugToTransport[serviceSlug];
      if (transport) {
        setFormData((prev) => ({ ...prev, transport }));
      }
    }
  }, [serviceSlug]);

  const goToStep = (step) => {
    if (step < currentStep) {
      setAnimDir('backward');
      setAnimKey((k) => k + 1);
      setCurrentStep(step);
    }
  };

  const validateStep0 = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Укажите имя';
    if (!formData.company.trim()) errs.company = 'Укажите компанию';
    if (!formData.phone.trim()) errs.phone = 'Укажите телефон';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const goNext = () => {
    if (currentStep === 0 && !validateStep0()) return;
    setAnimDir('forward');
    setAnimKey((k) => k + 1);
    setErrors({});
    setCurrentStep((s) => Math.min(s + 1, 2));
  };

  const goBack = () => {
    setAnimDir('backward');
    setAnimKey((k) => k + 1);
    setCurrentStep((s) => Math.max(s - 1, 0));
  };

  const toggleExtra = (id) => {
    setFormData((prev) => ({
      ...prev,
      extras: prev.extras.includes(id)
        ? prev.extras.filter((e) => e !== id)
        : [...prev.extras, id],
    }));
  };

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFormData((prev) => ({
      ...prev,
      files: [...prev.files, { name: file.name, size: file.size, type: file.type }],
    }));
    fileRefs.current[file.name] = file;
    e.target.value = '';
  };

  const removeFile = (name) => {
    setFormData((prev) => ({
      ...prev,
      files: prev.files.filter((f) => f.name !== name),
    }));
    delete fileRefs.current[name];
  };

  const handleSubmit = async () => {
    if (!validateStep0()) {
      setAnimDir('backward');
      setAnimKey((k) => k + 1);
      setCurrentStep(0);
      setSending(false);
      return;
    }
    setSending(true);

    const extrasText = formData.extras
      .map((id) => extraServices.find((s) => s.id === id)?.label)
      .filter(Boolean)
      .join(', ');

    const text = [
      `Имя: ${formData.name}`,
      `Компания: ${formData.company}`,
      `Телефон: ${formData.phone}`,
      formData.email ? `Email: ${formData.email}` : '',
      '',
      `Откуда: ${formData.from || '—'}`,
      `Куда: ${formData.to || '—'}`,
      `Вид транспорта: ${formData.transport}`,
      '',
      `Наименование груза: ${formData.cargoName || '—'}`,
      `Описание: ${formData.cargoDesc || '—'}`,
      `Количество: ${formData.cargoQty || '—'} шт`,
      `Вес: ${formData.cargoWeight || '—'} кг`,
      `Объём: ${formData.cargoVolume || '—'} м³`,
      '',
      extrasText ? `Дополнительные услуги: ${extrasText}` : '',
      formData.comment ? `Комментарий: ${formData.comment}` : '',
      formData.files.length > 0 ? `Приложено файлов: ${formData.files.length}` : '',
    ]
      .filter(Boolean)
      .join('\n');

    const subject = `Новая заявка с сайта New Line Cargo${service ? ` — ${service}` : ''}`;

    try {
      await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to: 'newlinecargo2003@gmail.com', subject, text }),
      }).catch(() => {});
    } catch (_) {}

    setSending(false);
    setSubmitted(true);

    try {
      const saved = JSON.parse(localStorage.getItem('nlc_requests') || '[]');
      saved.push({
        id: Date.now(),
        date: new Date().toLocaleDateString('ru-RU', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
        name: formData.name,
        company: formData.company,
        phone: formData.phone,
        email: formData.email,
        from: formData.from,
        to: formData.to,
        transport: formData.transport,
        cargoName: formData.cargoName,
        extras: extrasText,
        status: 'Отправлена',
      });
      localStorage.setItem('nlc_requests', JSON.stringify(saved));
    } catch (_) {}
  };

  const resetForm = () => {
    setSubmitted(false);
    setFormData({
      name: '', company: '', phone: '', email: '',
      from: '', to: '', transport: transportOptions[0],
      cargoName: '', cargoDesc: '', cargoQty: '', cargoWeight: '', cargoVolume: '',
      comment: '', extras: [], files: [],
    });
    setCurrentStep(0);
    setErrors({});
  };

  if (submitted) {
    return (
      <section id="quote" className="wrapper position-relative" style={{ background: '#111111' }}>
        <div className="container section-padding text-center position-relative" style={{ zIndex: 1 }}>
          <div className="row justify-content-center" data-cue="fadeInUp">
            <div className="col-md-8 col-lg-6">
              <div className="p-6" style={{ background: '#1a1a1a', border: '1px solid #2a2a2a' }}>
                <div className="mb-4">
                  <div
                    className="d-inline-flex align-items-center justify-content-center mb-4"
                    style={{ width: '72px', height: '72px', background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)' }}
                  >
                    <Icon name="check" size={32} color="#f59e0b" />
                  </div>
                  <h3 className="display-heading-2 text-white mb-2">Заявка отправлена!</h3>
                  <p className="fs-17 mb-4 lh-lg" style={{ color: '#a3a3a3', maxWidth: '420px', margin: '0 auto' }}>
                    Спасибо! Мы свяжемся с вами в ближайшее время для расчёта стоимости и сроков доставки.
                  </p>
                </div>
                <button
                  className="btn btn-amber text-white px-5 py-3 fw-semibold"
                  onClick={resetForm}
                >
                  Отправить ещё заявку
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const labelStyle = { color: '#d4d4d4' };
  const inputStyle = { background: '#1a1a1a', border: '1px solid #333', color: '#fff' };

  const inputClass = 'form-control form-control-lg';
  const inputDark = { background: '#1a1a1a', border: '1px solid #333', color: '#fff' };
  const selectClass = 'form-select form-select-lg';
  const selectDark = { background: '#1a1a1a', border: '1px solid #333', color: '#fff' };

  const animStyle = {
    animation: `${animDir === 'forward' ? 'nlcFadeUp' : 'nlcFadeDown'} 0.3s ease forwards`,
  };

  return (
    <section id="quote" className="wrapper position-relative" style={{ background: '#1a1a1a' }}>
      <style>{`
@keyframes nlcFadeUp {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes nlcFadeDown {
  from { opacity: 0; transform: translateY(-12px); }
  to { opacity: 1; transform: translateY(0); }
}
`}</style>
      <div className="corrugated" />
      <div className="container section-padding position-relative" style={{ zIndex: 1 }}>
        <div className="row mb-10" data-cue="fadeInUp">
          <div className="col-md-10 col-lg-8 mx-auto text-center">
            <span className="display-heading-3 text-amber text-uppercase mb-2 d-block">Свяжитесь с нами</span>
            <h2 className="display-heading-2 text-white mb-3">Заявка на расчёт</h2>
            <div className="hazard-divider mx-auto mb-4" />
            <p className="fs-18" style={{ color: '#a3a3a3', maxWidth: '560px', margin: '0 auto' }}>
              Оставьте заявку — мы рассчитаем стоимость и сроки доставки вашего груза в течение часа
            </p>
          </div>
        </div>

        {/* Step Indicator */}
        <div className="d-flex align-items-center justify-content-center mb-5" style={{ gap: 0 }}>
          {stepLabels.map((label, idx) => (
            <div key={idx} className="d-flex align-items-center" style={{ gap: 0 }}>
              {idx > 0 && (
                <div
                  style={{
                    flex: 'none',
                    width: '60px',
                    height: '2px',
                    background: idx <= currentStep ? '#f59e0b' : '#2a2a2a',
                    transition: 'background 0.3s ease',
                  }}
                />
              )}
              <button
                type="button"
                onClick={() => idx < currentStep && goToStep(idx)}
                disabled={idx > currentStep}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: idx < currentStep ? 'pointer' : idx === currentStep ? 'default' : 'default',
                  padding: 0,
                  textAlign: 'center',
                  opacity: idx > currentStep ? 0.5 : 1,
                }}
              >
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 6px',
                    background: idx < currentStep ? '#22c55e' : idx === currentStep ? '#f59e0b' : '#2a2a2a',
                    color: '#fff',
                    fontSize: '14px',
                    fontWeight: 700,
                    transition: 'all 0.3s ease',
                  }}
                >
                  {idx < currentStep ? '✓' : idx + 1}
                </div>
                <span
                  style={{
                    fontSize: '13px',
                    color: idx <= currentStep ? '#fff' : '#666',
                    fontWeight: idx === currentStep ? 600 : 400,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {label}
                </span>
              </button>
            </div>
          ))}
        </div>

        <div className="row justify-content-center" data-cue="fadeInUp" data-delay="200">
          <div className="col-lg-10">
            <div style={{ background: '#111111', border: '1px solid #2a2a2a', padding: '2.5rem' }}>
              <form onSubmit={(e) => { e.preventDefault(); if (currentStep === 2) handleSubmit(); }}>
                {/* Step 0: Контакты */}
                {currentStep === 0 && (
                  <div key={`step0-${animKey}`} style={animStyle}>
                    <div className="row g-4 mb-4">
                      <div className="col-12">
                        <h5 className="fw-bold text-white mb-0 fs-16 text-uppercase tracking-wide" style={{ letterSpacing: '0.05em' }}>Контактные данные</h5>
                        <hr style={{ borderColor: '#2a2a2a', marginTop: '8px' }} />
                      </div>
                      <div className="col-md-4">
                        <label className="form-label fw-semibold" style={labelStyle}>Имя *</label>
                        <input
                          type="text"
                          className={`${inputClass} ${errors.name ? 'is-invalid' : ''}`}
                          style={inputDark}
                          placeholder="Иван Иванов"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          onKeyDown={(e) => e.key === 'Enter' && goNext()}
                        />
                        {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                      </div>
                      <div className="col-md-4">
                        <label className="form-label fw-semibold" style={labelStyle}>Компания *</label>
                        <input
                          type="text"
                          className={`${inputClass} ${errors.company ? 'is-invalid' : ''}`}
                          style={inputDark}
                          placeholder="ООО «Ваша компания»"
                          value={formData.company}
                          onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                          onKeyDown={(e) => e.key === 'Enter' && goNext()}
                        />
                        {errors.company && <div className="invalid-feedback">{errors.company}</div>}
                      </div>
                      <div className="col-md-4">
                        <label className="form-label fw-semibold" style={labelStyle}>Телефон *</label>
                        <input
                          type="tel"
                          className={`${inputClass} ${errors.phone ? 'is-invalid' : ''}`}
                          style={inputDark}
                          placeholder="+7 (999) 123-45-67"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          onKeyDown={(e) => e.key === 'Enter' && goNext()}
                        />
                        {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
                      </div>
                      <div className="col-md-12">
                        <label className="form-label fw-semibold" style={labelStyle}>Email</label>
                        <input
                          type="email"
                          className={inputClass}
                          style={inputDark}
                          placeholder="company@mail.ru"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          onKeyDown={(e) => e.key === 'Enter' && goNext()}
                        />
                      </div>
                    </div>
                    <div className="text-end mt-4">
                      <button type="button" className="btn btn-amber text-white px-5 py-2 fw-semibold" onClick={goNext}>
                        Далее
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ms-2" style={{ verticalAlign: 'middle' }}>
                          <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                        </svg>
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 1: Маршрут + Груз */}
                {currentStep === 1 && (
                  <div key={`step1-${animKey}`} style={animStyle}>
                    <div className="row g-4 mb-4">
                      <div className="col-12">
                        <h5 className="fw-bold text-white mb-0 fs-16 text-uppercase tracking-wide" style={{ letterSpacing: '0.05em' }}>Маршрут</h5>
                        <hr style={{ borderColor: '#2a2a2a', marginTop: '8px' }} />
                      </div>
                      <div className="col-md-4">
                        <label className="form-label fw-semibold" style={labelStyle}>Откуда</label>
                        <input
                          type="text"
                          className={inputClass}
                          style={inputDark}
                          placeholder="Шанхай"
                          value={formData.from}
                          onChange={(e) => setFormData({ ...formData, from: e.target.value })}
                        />
                      </div>
                      <div className="col-md-4">
                        <label className="form-label fw-semibold" style={labelStyle}>Куда</label>
                        <input
                          type="text"
                          className={inputClass}
                          style={inputDark}
                          placeholder="Москва"
                          value={formData.to}
                          onChange={(e) => setFormData({ ...formData, to: e.target.value })}
                        />
                      </div>
                      <div className="col-md-4">
                        <label className="form-label fw-semibold" style={labelStyle}>Вид транспорта</label>
                        <select
                          className={selectClass}
                          style={selectDark}
                          value={formData.transport}
                          onChange={(e) => setFormData({ ...formData, transport: e.target.value })}
                        >
                          {transportOptions.map((opt) => (
                            <option key={opt} style={{ background: '#1a1a1a', color: '#fff' }}>{opt}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="row g-4 mb-4">
                      <div className="col-12">
                        <h5 className="fw-bold text-white mb-0 fs-16 text-uppercase tracking-wide" style={{ letterSpacing: '0.05em' }}>Груз</h5>
                        <hr style={{ borderColor: '#2a2a2a', marginTop: '8px' }} />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label fw-semibold" style={labelStyle}>Наименование</label>
                        <input
                          type="text"
                          className={inputClass}
                          style={inputDark}
                          placeholder="Оборудование, товары народного потребления..."
                          value={formData.cargoName}
                          onChange={(e) => setFormData({ ...formData, cargoName: e.target.value })}
                        />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label fw-semibold" style={labelStyle}>Описание</label>
                        <input
                          type="text"
                          className={inputClass}
                          style={inputDark}
                          placeholder="Краткое описание груза"
                          value={formData.cargoDesc}
                          onChange={(e) => setFormData({ ...formData, cargoDesc: e.target.value })}
                        />
                      </div>
                      <div className="col-md-4">
                        <label className="form-label fw-semibold" style={labelStyle}>Количество (шт)</label>
                        <input
                          type="number"
                          className={inputClass}
                          style={inputDark}
                          placeholder="100"
                          value={formData.cargoQty}
                          onChange={(e) => setFormData({ ...formData, cargoQty: e.target.value })}
                        />
                      </div>
                      <div className="col-md-4">
                        <label className="form-label fw-semibold" style={labelStyle}>Вес (кг)</label>
                        <input
                          type="number"
                          className={inputClass}
                          style={inputDark}
                          placeholder="1000"
                          value={formData.cargoWeight}
                          onChange={(e) => setFormData({ ...formData, cargoWeight: e.target.value })}
                        />
                      </div>
                      <div className="col-md-4">
                        <label className="form-label fw-semibold" style={labelStyle}>Объём (м³)</label>
                        <input
                          type="number"
                          className={inputClass}
                          style={inputDark}
                          placeholder="5"
                          step="0.1"
                          value={formData.cargoVolume}
                          onChange={(e) => setFormData({ ...formData, cargoVolume: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="d-flex justify-content-between mt-4">
                      <button type="button" className="btn px-4 py-2 fw-semibold" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid #333', color: '#a3a3a3' }} onClick={goBack}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="me-2" style={{ verticalAlign: 'middle' }}>
                          <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
                        </svg>
                        Назад
                      </button>
                      <button type="button" className="btn btn-amber text-white px-5 py-2 fw-semibold" onClick={goNext}>
                        Далее
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ms-2" style={{ verticalAlign: 'middle' }}>
                          <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                        </svg>
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 2: Сводка + Подтверждение */}
                {currentStep === 2 && (
                  <div key={`step2-${animKey}`} style={animStyle}>
                    {/* Summary */}
                    <div className="row g-3 mb-5">
                      <div className="col-12">
                        <h5 className="fw-bold text-white mb-0 fs-16 text-uppercase tracking-wide" style={{ letterSpacing: '0.05em' }}>Проверьте данные</h5>
                        <hr style={{ borderColor: '#2a2a2a', marginTop: '8px' }} />
                      </div>
                      <div className="col-12">
                        <div style={{ background: '#1a1a1a', border: '1px solid #2a2a2a' }}>
                          {/* Contacts */}
                          <div className="d-flex align-items-start gap-3 px-4 py-3" style={{ borderBottom: '1px solid #2a2a2a' }}>
                            <span className="fs-13 fw-semibold text-uppercase" style={{ color: '#666', minWidth: '100px', letterSpacing: '0.5px' }}>Контакты</span>
                            <div>
                              <div className="fs-15 text-white fw-semibold">{formData.name}</div>
                              <div className="fs-14" style={{ color: '#a3a3a3' }}>{formData.company}</div>
                              <div className="fs-14" style={{ color: '#a3a3a3' }}>{formData.phone}{formData.email ? `, ${formData.email}` : ''}</div>
                            </div>
                          </div>
                          {/* Route */}
                          <div className="d-flex align-items-start gap-3 px-4 py-3" style={{ borderBottom: '1px solid #2a2a2a' }}>
                            <span className="fs-13 fw-semibold text-uppercase" style={{ color: '#666', minWidth: '100px', letterSpacing: '0.5px' }}>Маршрут</span>
                            <div>
                              <div className="fs-15 text-white">
                                {formData.from || '—'} <span style={{ color: '#f59e0b' }}>→</span> {formData.to || '—'}
                              </div>
                              <div className="fs-14" style={{ color: '#f59e0b' }}>{formData.transport}</div>
                            </div>
                          </div>
                          {/* Cargo */}
                          <div className="d-flex align-items-start gap-3 px-4 py-3" style={{ borderBottom: '1px solid #2a2a2a' }}>
                            <span className="fs-13 fw-semibold text-uppercase" style={{ color: '#666', minWidth: '100px', letterSpacing: '0.5px' }}>Груз</span>
                            <div>
                              <div className="fs-15 text-white">{formData.cargoName || '—'}</div>
                              {formData.cargoDesc && <div className="fs-14" style={{ color: '#a3a3a3' }}>{formData.cargoDesc}</div>}
                              {(formData.cargoQty || formData.cargoWeight || formData.cargoVolume) && (
                                <div className="fs-14" style={{ color: '#a3a3a3', marginTop: '2px' }}>
                                  {[formData.cargoQty && `${formData.cargoQty} шт`, formData.cargoWeight && `${formData.cargoWeight} кг`, formData.cargoVolume && `${formData.cargoVolume} м³`].filter(Boolean).join(', ')}
                                </div>
                              )}
                            </div>
                          </div>
                          {/* Files count */}
                          {formData.files.length > 0 && (
                            <div className="d-flex align-items-start gap-3 px-4 py-3" style={{ borderBottom: '1px solid #2a2a2a' }}>
                              <span className="fs-13 fw-semibold text-uppercase" style={{ color: '#666', minWidth: '100px', letterSpacing: '0.5px' }}>Файлы</span>
                              <div className="fs-15 text-white">{formData.files.length} файл(а)</div>
                            </div>
                          )}
                          {/* Extras count */}
                          {formData.extras.length > 0 && (
                            <div className="d-flex align-items-start gap-3 px-4 py-3">
                              <span className="fs-13 fw-semibold text-uppercase" style={{ color: '#666', minWidth: '100px', letterSpacing: '0.5px' }}>Услуги</span>
                              <div className="fs-15 text-white">{formData.extras.length} услуги(а)</div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Extra services */}
                    <div className="row g-4 mb-5">
                      <div className="col-12">
                        <h5 className="fw-bold text-white mb-0 fs-16 text-uppercase tracking-wide" style={{ letterSpacing: '0.05em' }}>Дополнительные услуги</h5>
                        <hr style={{ borderColor: '#2a2a2a', marginTop: '8px' }} />
                      </div>
                      {extraServices.map((svc) => (
                        <div className="col-md-6" key={svc.id}>
                          <label className="d-flex align-items-center gap-2" style={{ cursor: 'pointer' }}>
                            <input
                              type="checkbox"
                              checked={formData.extras.includes(svc.id)}
                              onChange={() => toggleExtra(svc.id)}
                              style={{ accentColor: '#f59e0b', width: 18, height: 18 }}
                            />
                            <span className="fs-15" style={{ color: '#d4d4d4' }}>{svc.label}</span>
                          </label>
                        </div>
                      ))}
                    </div>

                    {/* Comment */}
                    <div className="row g-4 mb-5">
                      <div className="col-12">
                        <label className="form-label fw-semibold" style={labelStyle}>Комментарий</label>
                        <textarea
                          className={inputClass}
                          style={inputDark}
                          rows="3"
                          placeholder="Опишите ваш груз, укажите особенности..."
                          value={formData.comment}
                          onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                        />
                      </div>
                    </div>

                    {/* Files */}
                    <div className="row g-4 mb-5">
                      <div className="col-12">
                        <h5 className="fw-bold text-white mb-0 fs-16 text-uppercase tracking-wide" style={{ letterSpacing: '0.05em' }}>Файлы</h5>
                        <hr style={{ borderColor: '#2a2a2a', marginTop: '8px' }} />
                      </div>
                      <div className="col-12">
                        <div
                          className="p-5 text-center"
                          style={{ background: '#111111', border: '1px dashed #2a2a2a', cursor: 'pointer', minHeight: 140 }}
                          onClick={() => fileInputRef.current?.click()}
                          onDragOver={(e) => { e.preventDefault(); e.currentTarget.style.borderColor = '#f59e0b'; }}
                          onDragLeave={(e) => { e.currentTarget.style.borderColor = '#2a2a2a'; }}
                          onDrop={(e) => {
                            e.preventDefault();
                            e.currentTarget.style.borderColor = '#2a2a2a';
                            const file = e.dataTransfer.files?.[0];
                            if (file) {
                              setFormData((prev) => ({
                                ...prev,
                                files: [...prev.files, { name: file.name, size: file.size, type: file.type }],
                              }));
                              fileRefs.current[file.name] = file;
                            }
                          }}
                        >
                          <Icon name="upload" size={32} color="#f59e0b" />
                          <p className="fs-15 mt-3 mb-1" style={{ color: '#a3a3a3' }}>
                            Перетащите файл сюда или нажмите для выбора
                          </p>
                          <p className="fs-13 mb-0" style={{ color: '#555' }}>Инвойс, упаковочный лист, контракт — .pdf, .jpg, .xlsx</p>
                          <input
                            ref={fileInputRef}
                            type="file"
                            className="d-none"
                            accept=".pdf,.jpg,.jpeg,.png,.xls,.xlsx,.doc,.docx"
                            onChange={handleFile}
                          />
                        </div>
                        {formData.files.length > 0 && (
                          <div className="d-flex flex-column gap-2 mt-3">
                            {formData.files.map((f) => (
                              <div key={f.name} className="d-flex align-items-center justify-content-between px-3 py-2" style={{ background: '#111111', border: '1px solid #2a2a2a' }}>
                                <div className="d-flex align-items-center gap-2">
                                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="20 6 9 17 4 12" />
                                  </svg>
                                  <span className="fs-14 text-white">{f.name}</span>
                                  <span className="fs-12" style={{ color: '#555' }}>({(f.size / 1024).toFixed(1)} KB)</span>
                                </div>
                                <button type="button" onClick={() => removeFile(f.name)} className="border-0 bg-transparent p-1" style={{ color: '#ef4444', cursor: 'pointer' }}>
                                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                                  </svg>
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Privacy + Submit */}
                    <div className="col-12">
                      <div className="d-flex align-items-start gap-2 justify-content-center">
                        <input type="checkbox" id="privacy" defaultChecked style={{ marginTop: '3px', accentColor: '#f59e0b' }} />
                        <label htmlFor="privacy" className="fs-13" style={{ color: '#666' }}>
                          Отправляя заявку, я соглашаюсь на{' '}
                          <a href="/privacy" target="_blank" className="text-decoration-underline" style={{ color: '#f59e0b' }}>обработку персональных данных</a>
                        </label>
                      </div>
                    </div>

                    <div className="d-flex justify-content-between mt-4">
                      <button type="button" className="btn px-4 py-2 fw-semibold" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid #333', color: '#a3a3a3' }} onClick={goBack}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="me-2" style={{ verticalAlign: 'middle' }}>
                          <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
                        </svg>
                        Назад
                      </button>
                      <button
                        type="submit"
                        className="btn btn-amber btn-lg text-white px-5 py-2 fw-semibold"
                        disabled={sending}
                      >
                        {sending ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" />
                            Отправка...
                          </>
                        ) : (
                          <>
                            Отправить заявку
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ms-2" style={{ verticalAlign: 'middle' }}>
                              <line x1="22" y1="2" x2="11" y2="13" /><polyline points="22 2 15 22 11 13 2 9 22 2" />
                            </svg>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default QuoteForm;
