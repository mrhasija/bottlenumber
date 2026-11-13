import type { CategoryId } from '@/constants/categories';

/** Una bebida probada + el momento en que se probó. */
export type Entry = {
  id: string;
  user_id: string;
  category: CategoryId;
  name: string;
  details: Record<string, string | number | null>;
  rating: number | null; // 0–10, nota del propio usuario
  notes: string | null; // comentarios y observaciones de cata
  // El momento
  tasted_at: string; // fecha (ISO)
  place: string | null;
  companions: string | null;
  occasion: string | null;
  event_id: string | null;
  created_at: string;
  updated_at: string;
};

export type NewEntry = Omit<Entry, 'id' | 'user_id' | 'created_at' | 'updated_at'>;

/** Cata o evento que agrupa varias bebidas. */
export type DrinkEvent = {
  id: string;
  user_id: string;
  title: string;
  held_at: string;
  place: string | null;
  organizer: string | null;
  notes: string | null;
  rating: number | null;
  created_at: string;
};

export type EntryPhoto = {
  id: string;
  entry_id: string;
  user_id: string;
  storage_path: string;
  created_at: string;
};
