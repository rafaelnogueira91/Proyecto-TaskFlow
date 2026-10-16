import React from 'react';
import AppNavigator from './src/navigation/AppNavigator';
import { TasksProvider } from './src/context/TasksContext';
export default function App() {
 return <TasksProvider><AppNavigator /></TasksProvider>;
}
