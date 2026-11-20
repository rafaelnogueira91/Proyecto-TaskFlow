
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
import { collection, onSnapshot, query, where } from 'firebase/firestore';

import { store } from './src/store/store';
import { auth, db } from './src/services/firebaseConfig';

import {
  clearTasks,
  setTasksFromSnapshot,
  setTasksListenerError,
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
    let unsubscribeTasks = null;
    const unsubscribeAuth = onAuthStateChanged(auth, currentUser => {
      if (unsubscribeTasks) {
        unsubscribeTasks();
        unsubscribeTasks = null;
      }
      store.dispatch(clearTasks());
      setUser(currentUser);
      setLoading(false);
      if (currentUser) {
        const uid = currentUser.uid;
        const tasksQuery = query(collection(db, 'tasks'), where('userId', '==', uid));
        unsubscribeTasks = onSnapshot(tasksQuery, snapshot => {
          const items = snapshot.docs.map(item => ({
            ...item.data(),
            id: item.id,
            createdAt: item.data().createdAt?.toMillis?.() ?? null,
          }));
          store.dispatch(setTasksFromSnapshot({ userId: uid, items }));
        }, () => {
          if (auth.currentUser?.uid === uid) {
            store.dispatch(setTasksListenerError('No se pudieron sincronizar las tareas. Revisa tu conexión.'));
          }
        });
      }
    });
    return () => {
      unsubscribeAuth();
      if (unsubscribeTasks) unsubscribeTasks();
    };
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
