import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ActivityIndicator, ScrollView, KeyboardAvoidingView, Platform,
} from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../services/firebaseConfig';
import { authStyles as styles } from '../styles/authStyles';

export default function RegisterScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const register = async () => {
    if (loading) return;
    setError('');
    const cleanEmail = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail) || password.length < 6) {
      setError('Ingresa un correo válido y una contraseña de al menos 6 caracteres.');
      return;
    }
    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, cleanEmail, password);
    } catch (err) {
      setError(
        err.code === 'auth/email-already-in-use' ? 'Este correo ya está registrado.' :
        err.code === 'auth/invalid-email' ? 'Ingresa un correo válido.' :
        err.code === 'auth/network-request-failed' ? 'Revisa tu conexión a internet.' :
        err.code === 'auth/weak-password' ? 'La contraseña debe tener al menos 6 caracteres.' :
        'No se pudo crear la cuenta. Intenta nuevamente.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.wrapper}>
          <View style={styles.header}>
            <View style={styles.logo}><Text style={styles.logoText}>✓</Text></View>
            <Text style={styles.brand}>TaskFlow</Text>
            <Text style={styles.tagline}>Organiza tus tareas de manera sencilla</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.title}>Crear cuenta</Text>
            <Text style={styles.subtitle}>Regístrate para comenzar a organizar tus tareas</Text>
            <Text style={styles.label}>Correo electrónico</Text>
            <TextInput
              style={styles.input} placeholder="nombre@correo.com" placeholderTextColor="#A0AEC0"
              keyboardType="email-address" autoCapitalize="none" autoCorrect={false}
              textContentType="emailAddress" autoComplete="email" value={email}
              onChangeText={setEmail} editable={!loading} returnKeyType="next"
            />
            <Text style={styles.label}>Contraseña</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput} placeholder="Mínimo 6 caracteres"
                placeholderTextColor="#A0AEC0" secureTextEntry={!showPassword}
                textContentType="newPassword" autoComplete="new-password"
                value={password} onChangeText={setPassword} editable={!loading}
                onSubmitEditing={register} returnKeyType="done"
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.showButton}
                accessibilityRole="button" accessibilityLabel={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}>
                <Text style={styles.showText}>{showPassword ? 'Ocultar' : 'Mostrar'}</Text>
              </TouchableOpacity>
            </View>
            {!!error && <View style={styles.errorBox}><Text style={styles.errorText}>{error}</Text></View>}
            <TouchableOpacity style={[styles.button, loading && styles.buttonDisabled]}
              onPress={register} disabled={loading} activeOpacity={0.85} accessibilityRole="button">
              {loading ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.buttonText}>Crear cuenta</Text>}
            </TouchableOpacity>
            <View style={styles.registerContainer}>
              <Text style={styles.registerText}>¿Ya tienes una cuenta?</Text>
              <TouchableOpacity onPress={() => navigation.goBack()} disabled={loading} accessibilityRole="button">
                <Text style={styles.registerLink}>Inicia sesión</Text>
              </TouchableOpacity>
            </View>
          </View>
          <Text style={styles.footer}>TaskFlow · Gestión de tareas</Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
