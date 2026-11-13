import { Tabs } from 'expo-router';

import { Brand } from '@/config/brand';

export default function AppLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Brand.colors.primary,
        tabBarIconStyle: { display: 'none' },
        tabBarLabelStyle: { fontSize: 14, fontWeight: '600' },
      }}>
      <Tabs.Screen name="index" options={{ title: 'Diario' }} />
      <Tabs.Screen name="nueva" options={{ title: 'Añadir' }} />
      <Tabs.Screen name="eventos" options={{ title: 'Catas y eventos' }} />
      <Tabs.Screen name="perfil" options={{ title: 'Perfil' }} />
    </Tabs>
  );
}
