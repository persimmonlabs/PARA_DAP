export type Area = 'tennis' | 'rose' | 'professional' | 'personal';

export interface Project {
  id: string;
  name: string;
  emoji?: string;
  area?: Area;
  archived_at?: string;
  created_at: string;
}

export interface Item {
  id: string;
  title: string;
  notes?: string;
  project_id?: string;
  area?: Area;
  due_date?: string;
  completed_at?: string;
  archived_at?: string;
  created_at: string;
}
