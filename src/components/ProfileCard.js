import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import colors from '../constants/colors';

export default function ProfileCard({ name, role, image }) {
  return (
    <View style={styles.card}>
      <Image
        source={{ uri: image }}
        style={styles.avatar}
      />

      <View style={styles.info}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.role}>{role}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    padding: 20,
    borderRadius: 15,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },

  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 20,
  },

  info: {
    flex: 1,
  },

  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
  },

  role: {
    fontSize: 16,
    color: colors.primary,
    marginTop: 5,
  },
});