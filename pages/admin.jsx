import Head from 'next/head';
import { useState, useEffect } from 'react';

const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined' && sessionStorage.getItem('admin_auth')) {
      setAuthed(true);
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem('admin_auth', 'true');
      setAuthed(true);
      setError('');
    } else {
      setError('Неверный пароль');
    }
  };

  if (!authed) {
    return (
      <div style={{ minHeight: '100vh', background: '#111', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <form onSubmit={handleLogin} className="p-5" style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 8, maxWidth: 400, width: '90%' }}>
          <h2 className="text-white mb-4 fs-20 fw-bold">Админ-панель</h2>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Пароль"
            className="w-100 px-3 py-2 mb-3 fs-15 border-0"
            style={{ background: '#111', color: '#e5e5e5', borderRadius: 4, outline: '1px solid #333' }}
          />
          {error && <p className="fs-14 mb-2" style={{ color: '#ef4444' }}>{error}</p>}
          <button type="submit" className="btn btn-amber text-white w-100 py-2 fw-semibold">Войти</button>
        </form>
      </div>
    );
  }

  return (
    <>
      <Head><title>Админ-панель — New Line Cargo</title></Head>
      <section className="wrapper section-padding" style={{ background: '#111', minHeight: '100vh' }}>
        <div className="container">
          <div className="d-flex justify-content-between align-items-center mb-6">
            <h1 className="display-heading-2 text-white mb-0">Админ-панель</h1>
            <button onClick={() => { sessionStorage.removeItem('admin_auth'); setAuthed(false); }}
              className="btn px-3 py-1 fs-14 border-0"
              style={{ background: '#2a2a2a', color: '#a3a3a3' }}>
              Выйти
            </button>
          </div>

          <div className="row g-4 mb-6">
            <div className="col-md-4">
              <div className="p-4" style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 6 }}>
                <h3 className="text-white fs-16 fw-semibold mb-1">Заявки на расчёт</h3>
                <p className="fs-14 mb-3" style={{ color: '#737373' }}>Просмотр и экспорт</p>
                <a href={process.env.NEXT_PUBLIC_SHEETS_URL || '#'} target="_blank" rel="noopener noreferrer"
                  className="btn btn-amber text-white px-3 py-1 fs-14">
                  Открыть Google Sheets
                </a>
              </div>
            </div>
            <div className="col-md-4">
              <div className="p-4" style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 6 }}>
                <h3 className="text-white fs-16 fw-semibold mb-1">Яндекс.Метрика</h3>
                <p className="fs-14 mb-3" style={{ color: '#737373' }}>Посещаемость и поведение</p>
                <a href={`https://metrika.yandex.ru/dashboard?id=${process.env.NEXT_PUBLIC_YM_ID}`} target="_blank" rel="noopener noreferrer"
                  className="btn px-3 py-1 fs-14"
                  style={{ background: '#2a2a2a', color: '#a3a3a3', textDecoration: 'none' }}>
                  Открыть Метрику
                </a>
              </div>
            </div>
            <div className="col-md-4">
              <div className="p-4" style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 6 }}>
                <h3 className="text-white fs-16 fw-semibold mb-1">Google Analytics</h3>
                <p className="fs-14 mb-3" style={{ color: '#737373' }}>Детальная аналитика</p>
                <a href={`https://analytics.google.com/analytics/web/#/p${process.env.NEXT_PUBLIC_GA_ID?.replace('G-', '')}/`} target="_blank" rel="noopener noreferrer"
                  className="btn px-3 py-1 fs-14"
                  style={{ background: '#2a2a2a', color: '#a3a3a3', textDecoration: 'none' }}>
                  Открыть GA
                </a>
              </div>
            </div>
          </div>

          <div className="p-4" style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 6 }}>
            <h3 className="text-white fs-16 fw-semibold mb-2">Telegram-уведомления</h3>
            <p className="fs-14 mb-0" style={{ color: '#737373' }}>Новые заявки автоматически отправляются в Telegram-чат. Статус: <span style={{ color: '#22c55e' }}>активно</span></p>
          </div>
        </div>
      </section>
    </>
  );
}
