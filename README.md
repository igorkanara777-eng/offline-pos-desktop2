
# Offline POS (Electron + React + SQLite)

Оффлайн-учёт товаров. Локальная база SQLite (better-sqlite3).
Инсталлятор Windows собирается через GitHub Actions.

## Скрипты
- `npm install`
- `npm run build` (UI + main + preload)
- `npm start` (локальный запуск Electron)
- В GitHub Actions: **Build Windows Installer**

База создаётся в `%APPDATA%/Offline POS/data/pos.sqlite3`.
