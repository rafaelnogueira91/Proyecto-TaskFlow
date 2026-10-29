import React from 'react';
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { store } from './src/store/store';
import HomeScreen from './src/screens/HomeScreen';
import AddTaskScreen from './src/screens/AddTaskScreen';
import TaskDetailScreen from './src/screens/TaskDetailScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import colors from './src/constants/colors';

const Stack = createNativeStackNavigator();
const Tabs = createBottomTabNavigator();
function MainTabs() {
  return <Tabs.Navigator screenOptions={{ headerShown: false, tabBarActiveTintColor: colors.primary }}>
    <Tabs.Screen name="Tareas" component={HomeScreen} />
    <Tabs.Screen name="Perfil" component={ProfileScreen} />
  </Tabs.Navigator>;
}
function Navigation() {
  return <NavigationContainer>
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Inicio" component={MainTabs} />
      <Stack.Screen name="AgregarTarea" component={AddTaskScreen} />
      <Stack.Screen name="DetalleTarea" component={TaskDetailScreen} />
    </Stack.Navigator>
  </NavigationContainer>;
}
export default function App() {
  return <Provider store={store}><StatusBar style="dark" /><Navigation /></Provider>;
}
