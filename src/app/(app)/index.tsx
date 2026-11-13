import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Chip, Screen } from '@/components/ui';
import { Categories, categoryById } from '@/constants/categories';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { listEntries } from '@/lib/entries';
import type { Entry } from '@/types/db';

/** Diario: un solo historial, filtrable por apartado. */
export default function Diario() {
  const theme = useTheme();
  const [category, setCategory] = useState<string | undefined>();
  const [entries, setEntries] = useState<Entry[]>([]);
  const [error, setError] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      listEntries(category)
        .then((e) => {
          setEntries(e);
          setError(null);
        })
        .catch((e) => setError(e.message));
    }, [category]),
  );

  return (
    <Screen>
      <ThemedText type="subtitle">Mi diario</ThemedText>

      <View style={styles.chips}>
        <Chip label="Todo" selected={!category} onPress={() => setCategory(undefined)} />
        {Categories.map((c) => (
          <Chip
            key={c.id}
            label={c.label}
            selected={category === c.id}
            onPress={() => setCategory(c.id)}
          />
        ))}
      </View>

      {error && <ThemedText style={{ color: '#B42318' }}>{error}</ThemedText>}

      {entries.length === 0 && !error && (
        <ThemedText themeColor="textSecondary">
          Aún no hay nada aquí. Añade tu primera bebida desde la pestaña «Añadir».
        </ThemedText>
      )}

      {entries.map((e) => (
        <View key={e.id} style={[styles.card, { backgroundColor: theme.backgroundElement }]}>
          <View style={styles.row}>
            <ThemedText type="smallBold" style={{ flex: 1 }}>
              {e.name}
            </ThemedText>
            {e.rating != null && <ThemedText type="smallBold">{e.rating}/10</ThemedText>}
          </View>
          <ThemedText type="small" themeColor="textSecondary">
            {categoryById(e.category)?.label ?? e.category} ·{' '}
            {new Date(e.tasted_at).toLocaleDateString('es-ES')}
            {e.place ? ` · ${e.place}` : ''}
          </ThemedText>
          {e.occasion && <ThemedText type="small">{e.occasion}</ThemedText>}
        </View>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two },
  card: { borderRadius: 12, padding: Spacing.three, gap: Spacing.one },
  row: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two },
});
