
import React, { useState } from 'react';
import {
  View, Text, TextInput,
  TouchableOpacity, StyleSheet
} from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../services/firebaseConfig';

export default function RegisterScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const register = async () => {
    setError('');

    if (!email.trim() || password.length < 6) {
      setError('Ingresa un correo y una contraseña de al menos 6 caracteres.');
      return;
    }

    setLoading(true);
    try {
      await createUserWithEmailAndPassword(
        auth, email.trim(), password
      );
    } catch (err) {
      setError(
        err.code === 'auth/email-already-in-use'
          ? 'Este correo ya está registrado.'
          : err.code === 'auth/invalid-email'
          ? 'Ingresa un correo válido.'
          : 'No se pudo crear la cuenta. Intenta nuevamente.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Crear cuenta</Text>

      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Contraseña (mínimo 6 caracteres)"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      {!!error && <Text style={styles.error}>{error}</Text>}

      <TouchableOpacity
        style={styles.button}
        onPress={register}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Registrando...' : 'Registrarme'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.link}>
          Ya tengo una cuenta
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#F5F7FB',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#4A90E2',
    textAlign: 'center',
    marginBottom: 30,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 10,
    padding: 14,
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#4A90E2',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  link: {
    color: '#4A90E2',
    textAlign: 'center',
    marginTop: 22,
  },
  error: {
    color: '#D32F2F',
    textAlign: 'center',
    marginBottom: 14,
  },
});
