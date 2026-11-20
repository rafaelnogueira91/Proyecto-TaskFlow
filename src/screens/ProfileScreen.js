
import React, { useEffect, useState } from 'react';

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Image,
} from 'react-native';

import { signOut } from 'firebase/auth';
import { auth } from '../services/firebaseConfig';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ProfileScreen() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [avatar, setAvatar] = useState(null);
  const [choosingPhoto, setChoosingPhoto] = useState(false);

  // Usuario autenticado en Firebase
  const user = auth.currentUser;

  const email = user?.email || 'Correo no disponible';

  const name =
    user?.displayName?.trim() ||
    user?.email?.split('@')[0] ||
    'Usuario';

  const initials = name.split(/\s+/).map(part => part[0]).join('').slice(0, 2).toUpperCase();
  const avatarKey = user ? `taskflow:avatar:${user.uid}` : null;

  useEffect(() => {
    let active = true;
    setAvatar(null);
    if (avatarKey) {
      AsyncStorage.getItem(avatarKey)
        .then(value => { if (active) setAvatar(value); })
        .catch(() => { if (active) setError('No se pudo recuperar la foto.'); });
    }
    return () => { active = false; };
  }, [avatarKey]);

  const choosePhoto = async () => {
    if (choosingPhoto || !avatarKey) return;
    setChoosingPhoto(true);
    setError('');
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        setError('Debes permitir el acceso a las fotos para seleccionar una imagen.');
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.35,
        base64: true,
      });
      if (result.canceled || !result.assets?.length) return;
      const asset = result.assets[0];
      if (!asset.base64) throw new Error('No se pudo leer la imagen.');
      const uri = `data:image/jpeg;base64,${asset.base64}`;
      await AsyncStorage.setItem(avatarKey, uri);
      setAvatar(uri);
    } catch (_) {
      setError('No se pudo guardar la foto. Prueba con una imagen más pequeña.');
    } finally {
      setChoosingPhoto(false);
    }
  };

  // Cerrar sesión
  const logout = async () => {
    if (loading) return;

    setLoading(true);
    setError('');

    try {
      await signOut(auth);
    } catch (err) {
      setError(
        'No se pudo cerrar la sesión. Intenta nuevamente.'
      );
      setLoading(false);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
    >
      <View style={styles.content}>

        <Text style={styles.heading}>
          Mi perfil
        </Text>

        <Text style={styles.subtitle}>
          Administra tu cuenta de TaskFlow
        </Text>

        <View style={styles.card}>

          {/* Avatar */}
          <View style={styles.avatar}>
            {avatar ? (
              <Image source={{ uri: avatar }} style={styles.avatarImage} />
            ) : (
              <Text style={styles.initials}>{initials}</Text>
            )}
          </View>
          <TouchableOpacity onPress={choosePhoto} disabled={choosingPhoto}
            accessibilityRole="button" style={styles.photoButton}>
            <Text style={styles.photoButtonText}>
              {choosingPhoto ? 'Seleccionando...' : 'Cambiar foto de perfil'}
            </Text>
          </TouchableOpacity>

          {/* Nombre del usuario */}
          <Text style={styles.name}>
            {name}
          </Text>

          {/* Correo electrónico */}
          <Text style={styles.email}>
            {email}
          </Text>

          <View style={styles.divider} />

          {/* Información de la cuenta */}
          <View style={styles.infoSection}>

            <Text style={styles.label}>
              Correo electrónico
            </Text>

            <Text style={styles.value}>
              {email}
            </Text>

            <Text style={styles.label}>
              Estado de cuenta
            </Text>

            <Text style={styles.active}>
              ● Sesión activa
            </Text>

          </View>
        </View>

        {/* Mensaje de error */}
        {!!error && (
          <Text style={styles.error}>
            {error}
          </Text>
        )}

        {/* Botón cerrar sesión */}
        <TouchableOpacity
          style={[
            styles.logoutButton,
            loading && styles.disabledButton,
          ]}
          onPress={logout}
          disabled={loading}
          activeOpacity={0.8}
          accessibilityRole="button"
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.logoutText}>
              Cerrar sesión
            </Text>
          )}
        </TouchableOpacity>

        <Text style={styles.footer}>
          TaskFlow · Gestión de tareas
        </Text>

      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F7FC',
  },

  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },

  content: {
    width: '100%',
    maxWidth: 650,
    alignSelf: 'center',
    paddingTop: 35,
    paddingBottom: 30,
  },

  heading: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#172B4D',
  },

  subtitle: {
    fontSize: 15,
    color: '#718096',
    marginTop: 8,
    marginBottom: 25,
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 28,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E6ECF5',
  },

  // Avatar circular azul
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#4A90E2',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },

  avatarImage: { width: 90, height: 90, borderRadius: 45 },
  photoButton: { padding: 10, marginBottom: 12 },
  photoButtonText: { color: '#4A90E2', fontWeight: '600', textAlign: 'center' },

  // Iniciales centradas
  initials: {
    fontSize: 26,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    includeFontPadding: false,
  },

  name: {
    fontSize: 23,
    fontWeight: 'bold',
    color: '#172B4D',
    textAlign: 'center',
  },

  email: {
    fontSize: 14,
    color: '#718096',
    marginTop: 7,
    textAlign: 'center',
  },

  divider: {
    width: '100%',
    height: 1,
    backgroundColor: '#E6ECF5',
    marginVertical: 25,
  },

  infoSection: {
    width: '100%',
  },

  label: {
    fontSize: 13,
    color: '#718096',
    marginTop: 12,
  },

  value: {
    fontSize: 16,
    color: '#172B4D',
    marginTop: 5,
  },

  active: {
    fontSize: 15,
    color: '#198754',
    marginTop: 5,
    fontWeight: '500',
  },

  logoutButton: {
    backgroundColor: '#D94A4A',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 22,
    minHeight: 52,
    justifyContent: 'center',
  },

  disabledButton: {
    opacity: 0.7,
  },

  logoutText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },

  error: {
    color: '#D94A4A',
    marginTop: 15,
    textAlign: 'center',
  },

  footer: {
    fontSize: 12,
    color: '#A0AEC0',
    textAlign: 'center',
    marginTop: 30,
  },
});
