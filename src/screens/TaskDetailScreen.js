import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import colors from '../constants/colors';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTasks } from '../context/TasksContext';

export default function TaskDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { tasks } = useTasks();
  const taskId = route.params?.taskId;
  const task = tasks.find(item => item.id === taskId);
  if (!task) return <View style={styles.content}><Text>Tarea no encontrada.</Text><TouchableOpacity onPress={() => navigation.navigate('TaskList')}><Text style={styles.back}>← Volver a la lista</Text></TouchableOpacity></View>;
  const date = task.createdAt ? new Date(task.createdAt) : null;
  const dateLabel = date && !Number.isNaN(date.getTime()) ? date.toLocaleDateString('es-CL') : 'Sin fecha';
  return <ScrollView style={styles.container} contentContainerStyle={styles.content}>
    <TouchableOpacity onPress={() => navigation.navigate('TaskList')} accessibilityRole="button"><Text style={styles.back}>← Volver a la lista</Text></TouchableOpacity>
    <View style={styles.card}><Text style={styles.label}>ID: {taskId}</Text><Text style={styles.label}>Tarea</Text><Text style={styles.title}>{task.title}</Text>
      <Text style={styles.label}>Descripción</Text><Text style={styles.body}>{task.description}</Text>
      <Text style={styles.label}>Categoría</Text><Text style={styles.body}>{task.category}</Text>
      <Text style={styles.label}>Fecha de creación</Text><Text style={styles.body}>{dateLabel}</Text>
      <Text style={styles.label}>Estado</Text><Text style={styles.body}>{task.completed ? 'Completada' : 'Pendiente'}</Text>
    </View>
  </ScrollView>;
}
const styles=StyleSheet.create({container:{flex:1,backgroundColor:colors.background},content:{padding:24,paddingTop:48},back:{color:colors.primary,fontWeight:'600',fontSize:16,marginBottom:22},card:{backgroundColor:colors.white,borderRadius:16,padding:22},label:{fontSize:13,color:colors.primary,fontWeight:'700',marginTop:14,marginBottom:6},title:{fontSize:26,fontWeight:'700',color:colors.text,marginBottom:8},body:{fontSize:16,color:colors.text,lineHeight:24}});
