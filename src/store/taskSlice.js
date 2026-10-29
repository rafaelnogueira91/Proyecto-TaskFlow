import { createSlice, nanoid } from '@reduxjs/toolkit';

const initialState = { items: [], filters: { status: 'Todas', category: 'Todas' } };
const taskSlice = createSlice({
  name: 'tasks', initialState,
  reducers: {
    addTask: { reducer(state, action) { state.items.unshift(action.payload); }, prepare(task) { return { payload: { ...task, id: nanoid(), completed: false } }; } },
    deleteTask(state, action) { state.items = state.items.filter(task => task.id !== action.payload); },
    toggleTaskStatus(state, action) { const task = state.items.find(item => item.id === action.payload); if (task) task.completed = !task.completed; },
    setFilter(state, action) { state.filters.status = action.payload; },
    setCategoryFilter(state, action) { state.filters.category = action.payload; },
    clearFilters(state) { state.filters = { status: 'Todas', category: 'Todas' }; },
  },
});
export const { addTask, deleteTask, toggleTaskStatus, setFilter, setCategoryFilter, clearFilters } = taskSlice.actions;
export const selectTasks = state => state.tasks.items;
export const selectTaskById = (state, id) => state.tasks.items.find(task => task.id === id);
export const selectFilters = state => state.tasks.filters;
export const selectVisibleTasks = state => state.tasks.items.filter(task =>
  (state.tasks.filters.status === 'Todas' || (state.tasks.filters.status === 'Completadas' ? task.completed : !task.completed)) &&
  (state.tasks.filters.category === 'Todas' || task.category === state.tasks.filters.category)
);
export default taskSlice.reducer;
