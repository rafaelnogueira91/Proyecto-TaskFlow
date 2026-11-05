
import React, { useState } from 'react';

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../services/firebaseConfig';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const login = async () => {
    if (loading) return;

    setError('');

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail || !password) {
      setError('Ingresa tu correo y contraseña.');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setError('Ingresa un correo electrónico válido.');
      return;
    }

    setLoading(true);

    try {
      await signInWithEmailAndPassword(
        auth,
        cleanEmail,
        password
      );
    } catch (err) {
      if (err.code === 'auth/invalid-email') {
        setError('El correo ingresado no es válido.');
      } else if (err.code === 'auth/too-many-requests') {
        setError('Demasiados intentos. Intenta más tarde.');
      } else if (err.code === 'auth/network-request-failed') {
        setError('Revisa tu conexión a internet.');
      } else {
        setError(
          'No se pudo iniciar sesión. Revisa tu correo y contraseña.'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.wrapper}>

          {/* Encabezado */}
          <View style={styles.header}>
            <View style={styles.logo}>
              <Text style={styles.logoText}>✓</Text>
            </View>

            <Text style={styles.brand}>TaskFlow</Text>

            <Text style={styles.tagline}>
              Organiza tus tareas de manera sencilla
            </Text>
          </View>

          {/* Tarjeta de inicio de sesión */}
          <View style={styles.card}>

            <Text style={styles.title}>
              Bienvenido nuevamente
            </Text>

            <Text style={styles.subtitle}>
              Inicia sesión para continuar
            </Text>

            {/* Correo */}
            <Text style={styles.label}>
              Correo electrónico
            </Text>

            <TextInput
              style={styles.input}
              placeholder="nombre@correo.com"
              placeholderTextColor="#A0AEC0"
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              textContentType="emailAddress"
              autoComplete="email"
              value={email}
              onChangeText={setEmail}
              editable={!loading}
              returnKeyType="next"
            />

            {/* Contraseña */}
            <Text style={styles.label}>
              Contraseña
            </Text>

            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Ingresa tu contraseña"
                placeholderTextColor="#A0AEC0"
                secureTextEntry={!showPassword}
                textContentType="password"
                autoComplete="password"
                value={password}
                onChangeText={setPassword}
                editable={!loading}
                onSubmitEditing={login}
                returnKeyType="done"
              />

              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.showButton}
                accessibilityRole="button"
                accessibilityLabel={
                  showPassword
                    ? 'Ocultar contraseña'
                    : 'Mostrar contraseña'
                }
              >
                <Text style={styles.showText}>
                  {showPassword ? 'Ocultar' : 'Mostrar'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Mensaje de error */}
            {!!error && (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>
                  {error}
                </Text>
              </View>
            )}

            {/* Botón de ingreso */}
            <TouchableOpacity
              style={[
                styles.button,
                loading && styles.buttonDisabled,
              ]}
              onPress={login}
              disabled={loading}
              activeOpacity={0.85}
              accessibilityRole="button"
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.buttonText}>
                  Iniciar sesión
                </Text>
              )}
            </TouchableOpacity>

            {/* Registro */}
            <View style={styles.registerContainer}>
              <Text style={styles.registerText}>
                ¿No tienes una cuenta?
              </Text>

              <TouchableOpacity
                onPress={() => navigation.navigate('Registro')}
                disabled={loading}
                accessibilityRole="button"
              >
                <Text style={styles.registerLink}>
                  Regístrate
                </Text>
              </TouchableOpacity>
            </View>

          </View>

          {/* Pie de página */}
          <Text style={styles.footer}>
            TaskFlow · Gestión de tareas
          </Text>

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F7FC',
  },

  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 40,
  },

  wrapper: {
    width: '100%',
    maxWidth: 460,
    alignSelf: 'center',
  },

  header: {
    alignItems: 'center',
    marginBottom: 28,
  },

  logo: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: '#4A90E2',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },

  logoText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },

  brand: {
    fontSize: 34,
    fontWeight: 'bold',
    color: '#172B4D',
  },

  tagline: {
    fontSize: 14,
    color: '#718096',
    marginTop: 8,
    textAlign: 'center',
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 30,
    borderWidth: 1,
    borderColor: '#E6ECF5',
    ...Platform.select({
      web: {
        boxShadow: '0px 8px 30px rgba(23,43,77,0.06)',
      },
      default: {
        elevation: 3,
      },
    }),
  },

  title: {
    fontSize: 23,
    fontWeight: 'bold',
    color: '#172B4D',
    textAlign: 'center',
  },

  subtitle: {
    fontSize: 14,
    color: '#718096',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 28,
  },

  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#344563',
    marginBottom: 8,
  },

  input: {
    width: '100%',
    minHeight: 50,
    borderWidth: 1,
    borderColor: '#DCE5F1',
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    fontSize: 15,
    color: '#172B4D',
    marginBottom: 20,
  },

  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DCE5F1',
    borderRadius: 10,
    minHeight: 50,
    marginBottom: 20,
    backgroundColor: '#FFFFFF',
  },

  passwordInput: {
    flex: 1,
    minWidth: 0,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: '#172B4D',
  },

  showButton: {
    paddingHorizontal: 12,
    paddingVertical: 12,
  },

  showText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4A90E2',
  },

  errorBox: {
    backgroundColor: '#FFF1F1',
    borderRadius: 10,
    padding: 12,
    marginBottom: 18,
  },

  errorText: {
    color: '#C53030',
    fontSize: 13,
    textAlign: 'center',
  },

  button: {
    backgroundColor: '#4A90E2',
    minHeight: 52,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 4,
  },

  buttonDisabled: {
    opacity: 0.7,
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },

  registerContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
    gap: 5,
  },

  registerText: {
    fontSize: 13,
    color: '#718096',
  },

  registerLink: {
    fontSize: 13,
    color: '#4A90E2',
    fontWeight: 'bold',
  },

  footer: {
    textAlign: 'center',
    fontSize: 12,
    color: '#A0AEC0',
    marginTop: 28,
  },
});
