import React, { createContext, useContext, useState } from 'react';
const TasksContext = createContext(null);
export function TasksProvider({ children }) {
  const [tasks, setTasks] = useState([]);
  const addTask = (task) => setTasks(current => [{ ...task, id: `${Date.now()}-${Math.random().toString(36).slice(2)}`, completed: false }, ...current]);
  const toggleCompleted = (id) => setTasks(current => current.map(task => task.id === id ? { ...task, completed: !task.completed } : task));
  const deleteTask = (id) => setTasks(current => current.filter(task => task.id !== id));
  return <TasksContext.Provider value={{ tasks, addTask, toggleCompleted, deleteTask }}>{children}</TasksContext.Provider>;
}
export function useTasks() {
  const context = useContext(TasksContext);
  if (!context) throw new Error('useTasks debe utilizarse dentro de TasksProvider');
  return context;
}
