import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Button, Chip, Field, Screen } from '@/components/ui';
import { Categories, type CategoryId, categoryById } from '@/constants/categories';
import { Spacing } from '@/constants/theme';
import { createEntry } from '@/lib/entries';

const today = () => new Date().toISOString().slice(0, 10);

/** Alta libre: cualquier bebida, esté o no en una base de datos. */
export default function Nueva() {
  const [category, setCategory] = useState<CategoryId>('vino');
  const [name, setName] = useState('');
  const [details, setDetails] = useState<Record<string, string>>({});
  const [rating, setRating] = useState('');
  const [notes, setNotes] = useState('');
  const [date, setDate] = useState(today());
  const [place, setPlace] = useState('');
  const [companions, setCompanions] = useState('');
  const [occasion, setOccasion] = useState('');
  const [saving, setSaving] = useState(false);

  const fields = categoryById(category)?.fields ?? [];

  function reset() {
    setName('');
    setDetails({});
    setRating('');
    setNotes('');
    setDate(today());
    setPlace('');
    setCompanions('');
    setOccasion('');
  }

  async function save() {
    if (!name.trim()) return Alert.alert('Falta el nombre de la bebida');
    const r = rating.trim() ? Number(rating.replace(',', '.')) : null;
    if (r != null && (Number.isNaN(r) || r < 0 || r > 10))
      return Alert.alert('La nota debe estar entre 0 y 10');

    const cleanDetails: Record<string, string | number | null> = {};
    for (const f of fields) {
      const v = details[f.key]?.trim();
      if (v) cleanDetails[f.key] = f.numeric ? Number(v.replace(',', '.')) : v;
    }

    setSaving(true);
    try {
      await createEntry({
        category,
        name: name.trim(),
        details: cleanDetails,
        rating: r,
        notes: notes.trim() || null,
        tasted_at: new Date(date).toISOString(),
        place: place.trim() || null,
        companions: companions.trim() || null,
        occasion: occasion.trim() || null,
        event_id: null,
      });
      reset();
      router.navigate('/');
    } catch (e) {
      Alert.alert('No se pudo guardar', (e as Error).message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Screen>
      <ThemedText type="subtitle">Añadir bebida</ThemedText>

      <View style={styles.chips}>
        {Categories.map((c) => (
          <Chip
            key={c.id}
            label={c.label}
            selected={category === c.id}
            onPress={() => setCategory(c.id)}
          />
        ))}
      </View>

      <Field label="Nombre *" value={name} onChangeText={setName} />
      {fields.map((f) => (
        <Field
          key={`${category}-${f.key}`}
          label={f.label}
          placeholder={f.placeholder}
          keyboardType={f.numeric ? 'decimal-pad' : 'default'}
          value={details[f.key] ?? ''}
          onChangeText={(v) => setDetails((d) => ({ ...d, [f.key]: v }))}
        />
      ))}

      <ThemedText type="smallBold" style={styles.section}>
        Tu valoración
      </ThemedText>
      <Field label="Nota (0–10)" value={rating} onChangeText={setRating} keyboardType="decimal-pad" />
      <Field label="Comentarios y notas de cata" value={notes} onChangeText={setNotes} multiline />

      <ThemedText type="smallBold" style={styles.section}>
        El momento
      </ThemedText>
      <Field label="Fecha (AAAA-MM-DD)" value={date} onChangeText={setDate} />
      <Field label="Dónde" value={place} onChangeText={setPlace} />
      <Field label="Con quién" value={companions} onChangeText={setCompanions} />
      <Field
        label="Qué se celebraba"
        value={occasion}
        onChangeText={setOccasion}
        placeholder="Cumpleaños, cena con amigos, un martes cualquiera…"
      />

      <Button title="Guardar en mi diario" onPress={save} loading={saving} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two },
  section: { marginTop: Spacing.two },
});
