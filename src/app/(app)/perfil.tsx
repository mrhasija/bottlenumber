import { useState } from 'react';
import { Alert, Platform, Share } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Button, Screen } from '@/components/ui';
import { useAuth } from '@/lib/auth';
import { exportAll } from '@/lib/entries';
import { supabase } from '@/lib/supabase';

export default function Perfil() {
  const { session } = useAuth();
  const [exporting, setExporting] = useState(false);

  async function doExport() {
    setExporting(true);
    try {
      const json = JSON.stringify(await exportAll(), null, 2);
      if (Platform.OS === 'web') {
        const blob = new Blob([json], { type: 'application/json;charset=utf-8' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `bottlenumber-${new Date().toISOString().slice(0, 10)}.json`;
        a.click();
      } else {
        // Provisional: compartir como texto. Pendiente: fichero con expo-file-system + expo-sharing.
        await Share.share({ message: json });
      }
    } catch (e) {
      Alert.alert('No se pudo exportar', (e as Error).message);
    } finally {
      setExporting(false);
    }
  }

  return (
    <Screen>
      <ThemedText type="subtitle">Perfil</ThemedText>
      <ThemedText themeColor="textSecondary">{session?.user.email}</ThemedText>

      <ThemedText type="smallBold">Tus datos son tuyos</ThemedText>
      <ThemedText type="small" themeColor="textSecondary">
        Descarga todo tu diario (bebidas, notas, momentos y eventos) cuando quieras.
      </ThemedText>
      <Button title="Exportar mi diario" onPress={doExport} loading={exporting} />

      <Button title="Cerrar sesión" variant="secondary" onPress={() => supabase.auth.signOut()} />
    </Screen>
  );
}
