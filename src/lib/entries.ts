import { supabase } from '@/lib/supabase';
import type { DrinkEvent, Entry, NewEntry } from '@/types/db';

export async function listEntries(category?: string) {
  let q = supabase.from('entries').select('*').order('tasted_at', { ascending: false });
  if (category) q = q.eq('category', category);
  const { data, error } = await q;
  if (error) throw error;
  return data as Entry[];
}

export async function createEntry(entry: NewEntry) {
  const { data, error } = await supabase.from('entries').insert(entry).select().single();
  if (error) throw error;
  return data as Entry;
}

export async function listEvents() {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .order('held_at', { ascending: false });
  if (error) throw error;
  return data as DrinkEvent[];
}

/** Exportación completa del diario (portabilidad, RGPD art. 20). JSON en UTF-8. */
export async function exportAll() {
  const [entries, events, photos] = await Promise.all([
    supabase.from('entries').select('*'),
    supabase.from('events').select('*'),
    supabase.from('entry_photos').select('*'),
  ]);
  for (const r of [entries, events, photos]) if (r.error) throw r.error;
  return {
    format: 'bottlenumber-export',
    version: 1,
    exported_at: new Date().toISOString(),
    entries: entries.data,
    events: events.data,
    photos: photos.data,
  };
}
