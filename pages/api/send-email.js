import { sendTelegramMessage } from '../../src/services/telegramService';

const SHEETS_WEBHOOK_URL = process.env.SHEETS_WEBHOOK_URL;

async function postToSheets(data) {
  if (!SHEETS_WEBHOOK_URL) return;
  try {
    await fetch(SHEETS_WEBHOOK_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  } catch (e) {
    console.error('Sheets webhook error:', e.message);
  }
}

function detectType(subject) {
  if (subject?.toLowerCase().includes('расчёт') || subject?.toLowerCase().includes('quote')) return 'quote';
  if (subject?.toLowerCase().includes('отслежив') || subject?.toLowerCase().includes('track')) return 'tracking';
  return 'contact';
}

function extractBody(text) {
  const lines = (text || '').split('\n').reduce((acc, line) => {
    const [key, ...rest] = line.split(':');
    if (key && rest.length) acc[key.trim().toLowerCase()] = rest.join(':').trim();
    return acc;
  }, {});
  return lines;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { to, subject, text, pdfBase64, pdfFilename, clientEmail } = req.body;

  console.log('=== Новая заявка с сайта ===');
  console.log(`To: ${to}`);
  console.log(`Subject: ${subject}`);
  if (clientEmail) console.log(`Client email for copy: ${clientEmail}`);
  console.log(text);
  if (pdfBase64) console.log(`PDF attachment: ${pdfFilename} (${Math.round(pdfBase64.length * 0.75 / 1024)} KB base64)`);
  console.log('============================');

  const type = detectType(subject);
  const body = extractBody(text);

  const sheetsPayload = { type, subject, ...body, clientEmail };

  await Promise.allSettled([
    sendTelegramMessage(`<b>${subject}</b>\n\n${text}`).catch(err => console.error('Telegram error:', err.message)),
    postToSheets(sheetsPayload),
  ]);

  return res.status(200).json({
    success: true,
    message: 'Заявка получена. Мы свяжемся с вами в ближайшее время.',
  });
}
