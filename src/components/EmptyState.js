import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import colors from '../constants/colors';

export default function EmptyState() {
  return <View style={styles.container}><Text style={styles.icon}>☑</Text><Text style={styles.title}>¡No tienes tareas pendientes!</Text><Text style={styles.message}>Empieza por crear una arriba.</Text></View>;
}
const styles = StyleSheet.create({container:{alignItems:'center',padding:36,marginTop:24,backgroundColor:colors.white,borderRadius:16},icon:{fontSize:40,color:colors.primary},title:{fontSize:18,fontWeight:'700',color:colors.text,marginTop:12,textAlign:'center'},message:{fontSize:15,color:colors.text,marginTop:8,textAlign:'center'}});
