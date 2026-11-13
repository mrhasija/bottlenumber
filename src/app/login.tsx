import { useState } from 'react';
import { Alert } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Button, Field, Screen } from '@/components/ui';
import { Brand } from '@/config/brand';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';

/** Acceso sin contraseña: el usuario recibe un código por email. Funciona igual en web y móvil. */
export default function Login() {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function sendCode() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({ email: email.trim() });
    setLoading(false);
    if (error) return Alert.alert('No se pudo enviar el código', error.message);
    setSent(true);
  }

  async function verify() {
    setLoading(true);
    const { error } = await supabase.auth.verifyOtp({
      email: email.trim(),
      token: code.trim(),
      type: 'email',
    });
    setLoading(false);
    if (error) Alert.alert('Código incorrecto', error.message);
  }

  return (
    <Screen>
      <ThemedText type="subtitle" style={{ marginTop: 48 }}>
        {Brand.name}
      </ThemedText>
      <ThemedText themeColor="textSecondary">{Brand.tagline}</ThemedText>

      {!isSupabaseConfigured && (
        <ThemedText type="small" style={{ color: '#B42318' }}>
          Falta configurar Supabase: copia .env.example a .env.local y rellena las claves.
        </ThemedText>
      )}

      <Field
        label="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        placeholder="tu@email.com"
      />
      {sent && (
        <Field
          label="Código recibido por email"
          value={code}
          onChangeText={setCode}
          keyboardType="number-pad"
          placeholder="123456"
        />
      )}
      <Button
        title={sent ? 'Entrar' : 'Enviarme un código'}
        onPress={sent ? verify : sendCode}
        loading={loading}
      />
    </Screen>
  );
}
