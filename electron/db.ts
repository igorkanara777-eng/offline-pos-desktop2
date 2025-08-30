
import path from 'path';
import Database from 'better-sqlite3';
import { app as electronApp } from 'electron';
import fs from 'fs';

let db: Database.Database | null = null;

export async function ensureDb() {
  if (db) return;
  const userData = electronApp.getPath('userData');
  const dbDir = path.join(userData, 'data');
  if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true });
  const dbPath = path.join(dbDir, 'pos.sqlite3');

  db = new Database(dbPath);
  db.pragma('journal_mode = WAL');
  db.exec(`
    CREATE TABLE IF NOT EXISTS items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      price REAL NOT NULL,
      stock INTEGER NOT NULL DEFAULT 0
    );
  `);
}

export function addItem(name: string, price: number, stock: number) {
  if (!db) throw new Error('DB not initialized');
  const info = db.prepare('INSERT INTO items (name, price, stock) VALUES (?, ?, ?)').run(name, price, stock);
  return info.lastInsertRowid as number;
}

export function listItems() {
  if (!db) throw new Error('DB not initialized');
  return db.prepare('SELECT id, name, price, stock FROM items ORDER BY id DESC').all() as Array<{
    id: number; name: string; price: number; stock: number;
  }>;
}
