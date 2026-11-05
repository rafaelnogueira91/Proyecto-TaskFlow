
import React, { useEffect, useState } from 'react';

import {
  ActivityIndicator,
  View,
  StyleSheet,
} from 'react-native';

import { Provider } from 'react-redux';

import {
  NavigationContainer,
} from '@react-navigation/native';

import {
  createNativeStackNavigator,
} from '@react-navigation/native-stack';

import {
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';

import { StatusBar } from 'expo-status-bar';
import { onAuthStateChanged } from 'firebase/auth';

import { store } from './src/store/store';
import { auth } from './src/services/firebaseConfig';

import {
  clearTasks,
  fetchTasks,
} from './src/store/taskSlice';

import HomeScreen from './src/screens/HomeScreen';
import AddTaskScreen from './src/screens/AddTaskScreen';
import TaskDetailScreen from './src/screens/TaskDetailScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';

import colors from './src/constants/colors';

const Stack = createNativeStackNavigator();
const Tabs = createBottomTabNavigator();

// Navegación privada: usuario autenticado
function MainTabs() {
  return (
    <Tabs.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: '#94A3B8',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopColor: '#E6ECF5',
        },
      }}
    >
      <Tabs.Screen
        name="Tareas"
        component={HomeScreen}
      />

      <Tabs.Screen
        name="Perfil"
        component={ProfileScreen}
      />
    </Tabs.Navigator>
  );
}

// Control de autenticación y navegación
function Navigation() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      currentUser => {
        // Limpiar datos del usuario anterior
        store.dispatch(clearTasks());

        // Actualizar usuario autenticado
        setUser(currentUser);

        // Cargar tareas del usuario actual
        if (currentUser) {
          store.dispatch(fetchTasks());
        }

        setLoading(false);
      }
    );

    return unsubscribe;
  }, []);

  // Esperar la verificación de sesión
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator
          size="large"
          color={colors.primary}
        />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        {user ? (
          <Stack.Group
            navigationKey={`user-${user.uid}`}
          >
            <Stack.Screen
              name="Inicio"
              component={MainTabs}
            />

            <Stack.Screen
              name="AgregarTarea"
              component={AddTaskScreen}
            />

            <Stack.Screen
              name="DetalleTarea"
              component={TaskDetailScreen}
            />
          </Stack.Group>
        ) : (
          <Stack.Group navigationKey="guest">
            <Stack.Screen
              name="Login"
              component={LoginScreen}
            />

            <Stack.Screen
              name="Registro"
              component={RegisterScreen}
            />
          </Stack.Group>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// Componente principal
export default function App() {
  return (
    <Provider store={store}>
      <StatusBar style="dark" />
      <Navigation />
    </Provider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F4F7FC',
  },
});
