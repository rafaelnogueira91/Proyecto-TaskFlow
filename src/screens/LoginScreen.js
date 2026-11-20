
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
import { authStyles as styles } from '../styles/authStyles';

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

