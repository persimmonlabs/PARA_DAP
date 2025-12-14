/**
 * Seed script for PARA Tasks
 * Run with: npx tsx scripts/seed.ts
 */

import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const DB_PATH = path.join(process.cwd(), 'data', 'para.db');

// Ensure data directory exists
const dir = path.dirname(DB_PATH);
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

const db = new Database(DB_PATH);
db.pragma('journal_mode = WAL');

// Initialize tables
db.exec(`
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

// Helper to get date
function getDate(day: string): string {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 = Sunday

  const days: Record<string, number> = {
    sunday: 0,
    monday: 1,
    tuesday: 2,
    wednesday: 3,
    thursday: 4,
    friday: 5,
    saturday: 6,
  };

  const targetDay = days[day.toLowerCase()];
  if (targetDay === undefined) return day; // Return as-is if not a day name

  let diff = targetDay - dayOfWeek;
  if (diff <= 0) diff += 7; // Next week if today or past

  const targetDate = new Date(today);
  targetDate.setDate(today.getDate() + diff);
  return targetDate.toISOString().split('T')[0];
}

// Seed Projects
const projects = [
  { name: "PLC", emoji: "📘", area: "rose" },
  { name: "CompArch", emoji: "🖥️", area: "rose" },
  { name: "Capstone", emoji: "🍳", area: "rose" },
  { name: "IMENSIAH", emoji: "🚀", area: "professional" },
  { name: "Alpha Grit", emoji: "📚", area: "professional" },
  { name: "Job Search", emoji: "💼", area: "professional" },
  { name: "Tennis", emoji: "🎾", area: "tennis" },
  { name: "Winter Arc", emoji: "❄️", area: "personal" },
];

const insertProject = db.prepare(`
  INSERT OR REPLACE INTO projects (id, name, emoji, area, created_at)
  VALUES (?, ?, ?, ?, datetime('now'))
`);

const projectIds: Record<string, string> = {};

console.log('Seeding projects...');
for (const p of projects) {
  const id = crypto.randomUUID();
  projectIds[p.name] = id;
  insertProject.run(id, p.name, p.emoji, p.area);
  console.log(`  ✓ ${p.emoji} ${p.name}`);
}

// Seed Items
const items = [
  // PLC
  { title: "A7a, A7b", project: "PLC", area: "rose", due_date: "monday" },
  { title: "Exam 1", project: "PLC", area: "rose", due_date: "tuesday" },

  // CompArch
  { title: "Review HW1", project: "CompArch", area: "rose" },
  { title: "Complete HW2", project: "CompArch", area: "rose", due_date: "tuesday" },
  { title: "Memo", project: "CompArch", area: "rose", due_date: "thursday" },
  { title: "Topic", project: "CompArch", area: "rose", due_date: "friday" },

  // Capstone
  { title: "BL Grooming", project: "Capstone", area: "rose", due_date: "tuesday" },
  { title: "Siri Code Demo", project: "Capstone", area: "rose", due_date: "wednesday" },
  { title: "Week 3 Comp", project: "Capstone", area: "rose", due_date: "sunday" },
  { title: "Week 4 Planning", project: "Capstone", area: "rose", due_date: "sunday" },

  // IMENSIAH
  { title: "Tickets in Jira", project: "IMENSIAH", area: "professional", due_date: "monday" },

  // Alpha Grit
  { title: "Finish Stripe integration", project: "Alpha Grit", area: "professional" },

  // Job Search
  { title: "Call with Russ Meade (Aslan Advisors)", project: "Job Search", area: "professional", due_date: "monday" },
  { title: "Zach Nicoson call 7pm ET", project: "Job Search", area: "professional", due_date: "sunday" },

  // Tennis
  { title: "Practice Plan", project: "Tennis", area: "tennis", due_date: "monday" },

  // Personal (no project)
  { title: "Natal presentation prep", area: "personal" },
];

const insertItem = db.prepare(`
  INSERT INTO items (id, title, project_id, area, due_date, created_at)
  VALUES (?, ?, ?, ?, ?, datetime('now'))
`);

console.log('\nSeeding items...');
for (const item of items) {
  const id = crypto.randomUUID();
  const projectId = item.project ? projectIds[item.project] : null;
  const dueDate = item.due_date ? getDate(item.due_date) : null;
  insertItem.run(id, item.title, projectId, item.area, dueDate);
  console.log(`  ✓ ${item.title}${dueDate ? ` (${dueDate})` : ''}`);
}

db.close();

console.log('\n✅ Seed complete!');
console.log(`   ${projects.length} projects`);
console.log(`   ${items.length} items`);
