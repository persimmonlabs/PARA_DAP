import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const DB_PATH = process.env.VERCEL
  ? '/tmp/para.db'
  : path.join(process.cwd(), 'data', 'para.db');

let db: Database.Database | null = null;

export function getDb() {
  if (!db) {
    // Ensure data directory exists
    const dir = path.dirname(DB_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    db = new Database(DB_PATH);
    db.pragma('journal_mode = WAL');
    initTables();
  }
  return db;
}

function initTables() {
  const database = db!;

  database.exec(`
    CREATE TABLE IF NOT EXISTS projects (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      emoji TEXT,
      area TEXT CHECK (area IN ('tennis', 'rose', 'professional', 'personal')),
      archived_at TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS items (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      notes TEXT,
      project_id TEXT REFERENCES projects(id) ON DELETE SET NULL,
      area TEXT CHECK (area IN ('tennis', 'rose', 'professional', 'personal')),
      due_date TEXT,
      completed_at TEXT,
      archived_at TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE INDEX IF NOT EXISTS idx_items_due_date ON items(due_date);
    CREATE INDEX IF NOT EXISTS idx_items_project ON items(project_id);
    CREATE INDEX IF NOT EXISTS idx_items_completed ON items(completed_at);
  `);
}

export function closeDb() {
  if (db) {
    db.close();
    db = null;
  }
}
