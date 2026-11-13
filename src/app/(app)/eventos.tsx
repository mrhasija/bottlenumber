import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';

import { ThemedText } from '@/components/themed-text';
import { Screen } from '@/components/ui';
import { listEvents } from '@/lib/entries';
import type { DrinkEvent } from '@/types/db';

/** Catas y eventos. Pendiente: alta de evento y asociar bebidas (siguiente paso de la v1). */
export default function Eventos() {
  const [events, setEvents] = useState<DrinkEvent[]>([]);

  useFocusEffect(
    useCallback(() => {
      listEvents().then(setEvents).catch(() => setEvents([]));
    }, []),
  );

  return (
    <Screen>
      <ThemedText type="subtitle">Catas y eventos</ThemedText>
      {events.length === 0 ? (
        <ThemedText themeColor="textSecondary">
          Aquí aparecerán las catas y eventos a los que acudas, con las bebidas que probaste en
          cada uno.
        </ThemedText>
      ) : (
        events.map((ev) => (
          <ThemedText key={ev.id}>
            {ev.title} · {new Date(ev.held_at).toLocaleDateString('es-ES')}
          </ThemedText>
        ))
      )}
    </Screen>
  );
}
