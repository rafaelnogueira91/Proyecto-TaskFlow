import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ProfileCard from '../components/ProfileCard';
import colors from '../constants/colors';

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mi Perfil</Text>

      <ProfileCard
        name="Karina Aguilar"
        role="Estudiante"
        image="https://i.pravatar.cc/150?img=47"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: colors.background,
    padding: 20,
  },

  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 20,
    textAlign: 'center',
  },
});