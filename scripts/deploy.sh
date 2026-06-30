#!/usr/bin/env bash
set -euo pipefail

# ═══════════════════════════════════════════════════════════
# New Line Cargo — Deploy Script
# ═══════════════════════════════════════════════════════════
# Запуск: bash scripts/deploy.sh
# Требования: Node.js 18+, git, доступ к GitHub
# ═══════════════════════════════════════════════════════════

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

info()  { echo -e "${CYAN}[INFO]${NC} $1"; }
ok()    { echo -e "${GREEN}[OK]${NC} $1"; }
warn()  { echo -e "${YELLOW}[WARN]${NC} $1"; }
err()   { echo -e "${RED}[ERR]${NC} $1"; }

info "══════════════════════════════════════════"
info "  New Line Cargo — Deploy"
info "══════════════════════════════════════════"
echo ""

# ─── Проверка Node.js ───
info "Проверка Node.js..."
if ! command -v node &>/dev/null; then
  err "Node.js не найден. Установите Node.js 18+"
  exit 1
fi
NODE_VER=$(node -v | sed 's/v//' | cut -d. -f1)
if [ "$NODE_VER" -lt 18 ]; then
  err "Node.js 18+ требуется. Текущая версия: $(node -v)"
  exit 1
fi
ok "Node.js $(node -v)"

# ─── Проверка .env.local ───
info "Проверка .env.local..."
if [ ! -f .env.local ]; then
  warn ".env.local не найден. Создаю из шаблона..."
  cat > .env.local << 'EOF'
TELEGRAM_BOT_TOKEN=your_telegram_bot_token
TELEGRAM_CHAT_ID=your_telegram_chat_id
NEXT_PUBLIC_YM_ID=110285417
NEXT_PUBLIC_GA_ID=G-G5D95HLMMQ
SHEETS_WEBHOOK_URL=https://script.google.com/macros/s/your-script-id/exec
NEXT_PUBLIC_ADMIN_PASSWORD=changeme
NEXT_PUBLIC_SHEETS_URL=https://docs.google.com/spreadsheets/d/your-sheet-id/edit
EOF
  warn ".env.local создан — отредактируйте его перед деплоем!"
else
  ok ".env.local найден"
fi

# ─── Установка зависимостей ───
info "Установка зависимостей..."
if [ -d node_modules ]; then
  info "node_modules существует, проверка актуальности..."
fi
npm install --silent 2>&1 | tail -1
ok "Зависимости установлены"

# ─── Линтинг ───
info "Проверка линтером..."
if npm run lint 2>&1; then
  ok "Линтинг пройден"
else
  err "Линтинг не пройден. Исправьте ошибки и запустите снова."
  exit 1
fi

# ─── Сборка ───
info "Продакшен-сборка..."
BUILD_OUTPUT=$(npm run build 2>&1) || {
  err "Сборка не удалась:"
  echo "$BUILD_OUTPUT"
  exit 1
}
echo "$BUILD_OUTPUT" | grep -E "(✓|✓|Successfully|out/|pages:)" || true
ok "Сборка завершена успешно"

# ─── Проверка out/ ───
if [ -d out ]; then
  PAGE_COUNT=$(find out -name "*.html" | wc -l | tr -d ' ')
  ok "Сгенерировано $PAGE_COUNT HTML-страниц в out/"
else
  warn "Директория out/ не найдена (возможно, не static export)"
fi

# ─── Пуш в GitHub ───
echo ""
info "══════════════════════════════════════════"
info "  Git Push"
info "══════════════════════════════════════════"
CURRENT_BRANCH=$(git branch --show-current)

if [ -z "${GIT_TOKEN:-}" ]; then
  warn "Переменная GIT_TOKEN не установлена."
  warn "Для пуша введите GitHub токен (или нажмите Enter, чтобы пропустить):"
  read -r GIT_TOKEN
  if [ -z "$GIT_TOKEN" ]; then
    warn "Git push пропущен. Запустите позже: git push origin $CURRENT_BRANCH"
  fi
fi

if [ -n "${GIT_TOKEN:-}" ]; then
  REMOTE_URL=$(git remote get-url origin | sed 's|https://|https://token:'"$GIT_TOKEN"'@|')
  git push "$REMOTE_URL" "$CURRENT_BRANCH" 2>&1 || {
    err "Git push не удался. Проверьте токен и доступ."
  }
  ok "Ветка $CURRENT_BRANCH запушена в origin"
fi

# ─── Инструкции по Cloudflare Pages ───
echo ""
info "══════════════════════════════════════════"
info "  Cloudflare Pages — Инструкция"
info "══════════════════════════════════════════"
echo ""
echo "  1. Перейдите: https://dash.cloudflare.com/"
echo "  2. Workers & Pages → Pages → Connect to Git"
echo "  3. Выберите репозиторий и ветку $CURRENT_BRANCH"
echo ""
echo "  4. Настройки сборки:"
echo "     — Build command:  npm run build"
echo "     — Output dir:     out"
echo ""
echo "  5. Environment Variables (добавить обязательно!):"
echo "     — TELEGRAM_BOT_TOKEN"
echo "     — TELEGRAM_CHAT_ID"
echo "     — SHEETS_WEBHOOK_URL"
echo "     — NEXT_PUBLIC_ADMIN_PASSWORD"
echo "     — NEXT_PUBLIC_YM_ID=110285417"
echo "     — NEXT_PUBLIC_GA_ID=G-G5D95HLMMQ"
echo "     — NEXT_PUBLIC_SHEETS_URL"
echo ""

# ─── Финальная сводка ───
echo ""
info "══════════════════════════════════════════"
info "  Сводка"
info "══════════════════════════════════════════"
echo ""
echo "  ✓ Ветка:      $CURRENT_BRANCH"
echo "  ✓ Коммитов:   $(git log --oneline main..HEAD 2>/dev/null | wc -l | tr -d ' ')"
echo "  ✓ Страниц:    ${PAGE_COUNT:-?}"
echo "  ✓ Линтинг:    ✅"
echo ""
ok "Deploy готов!"
echo ""
