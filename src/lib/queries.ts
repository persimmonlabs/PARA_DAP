import { getDb } from './db';
import { Item, Project } from '@/types';
import { randomUUID } from 'crypto';

// ============= ITEMS =============

interface ItemFilter {
  projectId?: string;
  area?: string;
  inbox?: boolean;
  today?: boolean;
  overdue?: boolean;
}

export function getItems(filter?: ItemFilter): Item[] {
  const db = getDb();
  let query = `
    SELECT * FROM items
    WHERE archived_at IS NULL AND completed_at IS NULL
  `;
  const params: any[] = [];

  if (filter?.projectId) {
    query += ' AND project_id = ?';
    params.push(filter.projectId);
  }

  if (filter?.area) {
    query += ' AND area = ?';
    params.push(filter.area);
  }

  if (filter?.inbox) {
    query += ' AND project_id IS NULL AND area IS NULL';
  }

  if (filter?.today) {
    const today = new Date().toISOString().split('T')[0];
    query += ' AND due_date = ?';
    params.push(today);
  }

  if (filter?.overdue) {
    const today = new Date().toISOString().split('T')[0];
    query += ' AND due_date < ?';
    params.push(today);
  }

  query += ' ORDER BY created_at DESC';

  const stmt = db.prepare(query);
  return stmt.all(...params) as Item[];
}

export function getItem(id: string): Item | undefined {
  const db = getDb();
  const stmt = db.prepare('SELECT * FROM items WHERE id = ?');
  return stmt.get(id) as Item | undefined;
}

export function createItem(item: Omit<Item, 'id' | 'created_at'>): Item {
  const db = getDb();
  const id = randomUUID();
  const created_at = new Date().toISOString();

  const stmt = db.prepare(`
    INSERT INTO items (id, title, notes, project_id, area, due_date, completed_at, archived_at, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  stmt.run(
    id,
    item.title,
    item.notes || null,
    item.project_id || null,
    item.area || null,
    item.due_date || null,
    item.completed_at || null,
    item.archived_at || null,
    created_at
  );

  return { id, created_at, ...item } as Item;
}

export function updateItem(id: string, updates: Partial<Omit<Item, 'id' | 'created_at'>>): Item | undefined {
  const db = getDb();
  const existing = getItem(id);
  if (!existing) return undefined;

  const fields: string[] = [];
  const values: any[] = [];

  Object.entries(updates).forEach(([key, value]) => {
    if (key !== 'id' && key !== 'created_at') {
      fields.push(`${key} = ?`);
      values.push(value === undefined ? null : value);
    }
  });

  if (fields.length === 0) return existing;

  values.push(id);
  const stmt = db.prepare(`UPDATE items SET ${fields.join(', ')} WHERE id = ?`);
  stmt.run(...values);

  return getItem(id);
}

export function completeItem(id: string): Item | undefined {
  const completed_at = new Date().toISOString();
  return updateItem(id, { completed_at });
}

export function deleteItem(id: string): boolean {
  const archived_at = new Date().toISOString();
  const result = updateItem(id, { archived_at });
  return !!result;
}

// ============= PROJECTS =============

export function getProjects(): Project[] {
  const db = getDb();
  const stmt = db.prepare('SELECT * FROM projects WHERE archived_at IS NULL ORDER BY created_at DESC');
  return stmt.all() as Project[];
}

export function getProject(id: string): Project | undefined {
  const db = getDb();
  const stmt = db.prepare('SELECT * FROM projects WHERE id = ?');
  return stmt.get(id) as Project | undefined;
}

export function createProject(project: Omit<Project, 'id' | 'created_at'>): Project {
  const db = getDb();
  const id = randomUUID();
  const created_at = new Date().toISOString();

  const stmt = db.prepare(`
    INSERT INTO projects (id, name, emoji, area, archived_at, created_at)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  stmt.run(
    id,
    project.name,
    project.emoji || null,
    project.area || null,
    project.archived_at || null,
    created_at
  );

  return { id, created_at, ...project } as Project;
}

export function updateProject(id: string, updates: Partial<Omit<Project, 'id' | 'created_at'>>): Project | undefined {
  const db = getDb();
  const existing = getProject(id);
  if (!existing) return undefined;

  const fields: string[] = [];
  const values: any[] = [];

  Object.entries(updates).forEach(([key, value]) => {
    if (key !== 'id' && key !== 'created_at') {
      fields.push(`${key} = ?`);
      values.push(value === undefined ? null : value);
    }
  });

  if (fields.length === 0) return existing;

  values.push(id);
  const stmt = db.prepare(`UPDATE projects SET ${fields.join(', ')} WHERE id = ?`);
  stmt.run(...values);

  return getProject(id);
}

export function deleteProject(id: string): boolean {
  const archived_at = new Date().toISOString();
  const result = updateProject(id, { archived_at });
  return !!result;
}
