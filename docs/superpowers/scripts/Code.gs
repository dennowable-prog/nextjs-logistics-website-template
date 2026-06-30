/**
 * New Line Cargo — Google Sheets Apps Script Webhook
 *
 * Инструкция по установке:
 * 1. Создайте Google Sheets: https://sheets.new
 * 2. Назовите таблицу "New Line Cargo — Заявки с сайта"
 * 3. Расширения → Apps Script
 * 4. Вставьте этот код, сохраните (Ctrl+S)
 * 5. Разверните → Новое развертывание → Веб-приложение
 *    — Выполнять от: "Я" (ваш email)
 *    — Доступ: "Все, у кого есть ссылка"
 * 6. Скопируйте URL веб-приложения → вставьте в .env.local как SHEETS_WEBHOOK_URL
 * 7. Переименуйте Sheet1 в "Заявки"
 * 8. Установите триггер (см. функцию createSpreadsheetTrigger ниже)
 */

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName('Заявки') || ss.getSheetByName('Sheet1') || ss.insertSheet('Заявки');

    // Заголовки при первом запуске
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        'Дата', 'Тип', 'Тема',
        'Имя', 'Телефон', 'Email',
        'Компания', 'Откуда', 'Куда',
        'Вес (кг)', 'Объём (м³)', 'Груз',
        'Сообщение', 'Client Email'
      ]);
    }

    const now = new Date();
    const type = data.type || 'contact';
    const subject = data.subject || '';
    const name = data.name || data['ваше имя'] || data['имя'] || '';
    const phone = data.phone || data['телефон'] || data['номер телефона'] || '';
    const email = data.email || data['e-mail'] || '';
    const company = data.company || data['компания'] || data['организация'] || '';
    const from = data.from || data['откуда'] || data['пункт отправления'] || '';
    const to = data.to || data['куда'] || data['пункт назначения'] || '';
    const weight = data.weight || data['вес'] || data['вес (кг)'] || '';
    const volume = data.volume || data['объём'] || data['объём (м³)'] || '';
    const cargo = data.cargo || data['груз'] || data['тип груза'] || data['описание груза'] || '';
    const message = data.message || data['сообщение'] || data['комментарий'] || '';
    const clientEmail = data.clientEmail || '';

    sheet.appendRow([
      now, type, subject,
      name, phone, email,
      company, from, to,
      weight, volume, cargo,
      message, clientEmail
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * GET-запрос для проверки работоспособности
 */
function doGet() {
  return ContentService
    .createTextOutput(JSON.stringify({
      status: 'ok',
      message: 'New Line Cargo webhook is running',
      timestamp: new Date().toISOString()
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Запустите эту функцию один раз из редактора Apps Script,
 * чтобы установить ежечасный триггер синхронизации (опционально)
 */
function createSpreadsheetTrigger() {
  ScriptApp.newTrigger('doPost')
    .forSpreadsheet(SpreadsheetApp.getActiveSpreadsheet())
    .onOpen()
    .create();
}

/**
 * Функция для создания листа "Статистика" с формулами
 * Запустить один раз после появления данных
 */
function createStatsSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let stats = ss.getSheetByName('Статистика');
  if (!stats) {
    stats = ss.insertSheet('Статистика');
  }

  stats.getRange('A1').setValue('Всего заявок');
  stats.getRange('B1').setFormula('=COUNTIF(Заявки!A:A;"<>")-1');

  stats.getRange('A3').setValue('По типам:');
  stats.getRange('A4').setValue('Контактные');
  stats.getRange('B4').setFormula('=COUNTIF(Заявки!B:B;"contact")');
  stats.getRange('A5').setValue('Расчёт стоимости');
  stats.getRange('B5').setFormula('=COUNTIF(Заявки!B:B;"quote")');
  stats.getRange('A6').setValue('Отслеживание');
  stats.getRange('B6').setFormula('=COUNTIF(Заявки!B:B;"tracking")');

  stats.getRange('A8').setValue('За последние 7 дней:');
  stats.getRange('B8').setFormula('=COUNTIF(Заявки!A:A;">="&TODAY()-7)');

  stats.getRange('A10').setValue('Последняя заявка:');
  stats.getRange('B10').setFormula('=MAX(Заявки!A:A)');
}
