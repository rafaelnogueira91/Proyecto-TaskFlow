import React from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, SafeAreaView } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import EmptyState from '../components/EmptyState';
import colors from '../constants/colors';
import { selectVisibleTasks, selectFilters, setFilter, setCategoryFilter, toggleTaskStatus, deleteTask } from '../store/taskSlice';
export default function HomeScreen({ navigation }) {
  const dispatch = useDispatch();
  const tasks = useSelector(selectVisibleTasks);
  const filters = useSelector(selectFilters);
  return <SafeAreaView style={styles.container}>
    <View style={styles.header}><Text style={styles.heading}>Mis tareas</Text>
      <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('AgregarTarea')} accessibilityRole="button"><Text style={styles.addText}>+ Nueva tarea</Text></TouchableOpacity>
      <Text style={styles.filterTitle}>Filtrar por estado</Text>
      <View style={styles.filterRow}>{['Todas','Pendientes','Completadas'].map(value => <TouchableOpacity key={value} onPress={() => dispatch(setFilter(value))} style={[styles.filterChip,filters.status === value && styles.filterActive]}><Text style={[styles.filterText,filters.status === value && styles.filterTextActive]}>{value}</Text></TouchableOpacity>)}</View>
      <Text style={styles.filterTitle}>Filtrar por categoría</Text>
      <View style={styles.filterRow}>{['Todas','Personal','Trabajo','Estudio'].map(value => <TouchableOpacity key={value} onPress={() => dispatch(setCategoryFilter(value))} style={[styles.filterChip,filters.category === value && styles.filterActive]}><Text style={[styles.filterText,filters.category === value && styles.filterTextActive]}>{value}</Text></TouchableOpacity>)}</View>
    </View>
    <FlatList data={tasks} keyExtractor={item => item.id} contentContainerStyle={styles.list}
      ListEmptyComponent={<EmptyState />}
      renderItem={({ item }) => <View style={styles.card}>
        <TouchableOpacity style={styles.cardContent} onPress={() => navigation.navigate('DetalleTarea', { taskId: item.id })} accessibilityRole="button">
          <Text style={[styles.taskTitle,item.completed && styles.done]}>{item.title}</Text>
          <Text style={styles.subtitle}>{item.category} · {item.completed ? 'Completada' : 'Pendiente'}</Text>
          <Text numberOfLines={2} style={styles.description}>{item.description}</Text>
          <Text style={styles.detailHint}>Ver detalle →</Text>
        </TouchableOpacity>
        <View style={styles.actions}>
          <TouchableOpacity onPress={() => dispatch(toggleTaskStatus(item.id))} accessibilityRole="button" style={styles.action}><Text style={styles.actionText}>{item.completed ? 'Marcar pendiente' : 'Completar'}</Text></TouchableOpacity>
          <TouchableOpacity onPress={() => dispatch(deleteTask(item.id))} accessibilityRole="button" style={styles.action}><Text style={styles.deleteText}>Eliminar</Text></TouchableOpacity>
        </View>
      </View>}
    />
  </SafeAreaView>;
}
const styles=StyleSheet.create({container:{flex:1,backgroundColor:colors.background},header:{paddingHorizontal:22,paddingTop:35,paddingBottom:12},heading:{fontSize:28,fontWeight:'bold',color:colors.primary,marginBottom:16},addButton:{backgroundColor:colors.primary,padding:15,borderRadius:10,alignItems:'center'},addText:{color:colors.white,fontWeight:'700',fontSize:16},list:{padding:20,flexGrow:1},card:{backgroundColor:colors.white,borderRadius:14,marginBottom:14,padding:16},cardContent:{paddingBottom:10},taskTitle:{fontSize:18,fontWeight:'700',color:colors.text},done:{textDecorationLine:'line-through',opacity:0.6},subtitle:{color:colors.primary,marginTop:6},description:{color:colors.text,marginTop:8},detailHint:{color:colors.primary,marginTop:12,fontWeight:'600'},actions:{flexDirection:'row',gap:16,borderTopWidth:1,borderTopColor:'#e5e7eb',paddingTop:12},action:{paddingVertical:4},actionText:{color:colors.primary,fontWeight:'600'},deleteText:{color:colors.error,fontWeight:'600'},filterTitle:{color:colors.text,fontWeight:'600',marginTop:14,marginBottom:7},filterRow:{flexDirection:'row',flexWrap:'wrap',gap:7},filterChip:{borderColor:colors.primary,borderWidth:1,borderRadius:8,paddingHorizontal:10,paddingVertical:7},filterActive:{backgroundColor:colors.primary},filterText:{color:colors.primary,fontSize:12},filterTextActive:{color:colors.white}});
