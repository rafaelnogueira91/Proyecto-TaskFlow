import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import TaskListScreen from '../screens/TaskListScreen';
import TaskDetailScreen from '../screens/TaskDetailScreen';
import AddTaskScreen from '../screens/AddTaskScreen';
import ProfileScreen from '../screens/ProfileScreen';
import colors from '../constants/colors';
const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
function TasksStack() {
  return <Stack.Navigator initialRouteName="TaskList" screenOptions={{ headerTintColor: colors.primary }}>
    <Stack.Screen name="TaskList" component={TaskListScreen} options={{ title: 'Mis tareas' }} />
    <Stack.Screen name="TaskDetail" component={TaskDetailScreen} options={{ title: 'Detalle de tarea' }} />
    <Stack.Screen name="TaskForm" component={AddTaskScreen} options={{ title: 'Nueva tarea' }} />
  </Stack.Navigator>;
}
export default function AppNavigator() {
  return <NavigationContainer>
    <Tab.Navigator screenOptions={({ route }) => ({
      tabBarActiveTintColor: colors.primary,
      headerTintColor: colors.primary,
      tabBarIcon: ({ color, size }) => <Ionicons name={route.name === 'Home' ? 'list-outline' : 'person-outline'} size={size} color={color} />,
    })}>
      <Tab.Screen name="Home" component={TasksStack} options={{ title: 'Mis tareas', headerShown: false, tabBarLabel: 'Inicio' }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: 'Mi perfil', tabBarLabel: 'Perfil' }} />
    </Tab.Navigator>
  </NavigationContainer>;
}
