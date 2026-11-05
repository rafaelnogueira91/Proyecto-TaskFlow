
import {
  createSlice,
  createAsyncThunk,
  createSelector,
} from '@reduxjs/toolkit';

import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  serverTimestamp,
} from 'firebase/firestore';

import { auth, db } from '../services/firebaseConfig';

// Obtener el usuario autenticado
const getUserId = () => {
  const user = auth.currentUser;

  if (!user) {
    throw new Error('Debes iniciar sesión.');
  }

  return user.uid;
};

// Convertir fechas de Firestore a valores compatibles con Redux
const normalizeTask = (snapshot) => {
  const data = snapshot.data();

  return {
    ...data,
    id: snapshot.id,
    createdAt: data.createdAt?.toMillis?.() ?? null,
  };
};

// Cargar tareas desde Firestore
export const fetchTasks = createAsyncThunk(
  'tasks/fetchTasks',
  async (_, { rejectWithValue }) => {
    try {
      const userId = getUserId();

      const tasksQuery = query(
        collection(db, 'tasks'),
        where('userId', '==', userId)
      );

      const snapshot = await getDocs(tasksQuery);

      return {
        userId,
        items: snapshot.docs.map(normalizeTask),
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Crear tarea en Firestore
export const addTaskToFirestore = createAsyncThunk(
  'tasks/addTaskToFirestore',
  async (task, { rejectWithValue }) => {
    try {
      const userId = getUserId();

      const newTask = {
        title: task.title,
        description: task.description || '',
        category: task.category || 'Personal',
        completed: false,
        userId,
        createdAt: serverTimestamp(),
      };

      const reference = await addDoc(
        collection(db, 'tasks'),
        newTask
      );

      return {
        id: reference.id,
        title: newTask.title,
        description: newTask.description,
        category: newTask.category,
        completed: false,
        userId,
        createdAt: Date.now(),
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Cambiar estado de una tarea
export const toggleTaskInFirestore = createAsyncThunk(
  'tasks/toggleTaskInFirestore',
  async (task, { rejectWithValue }) => {
    try {
      const userId = getUserId();

      if (task.userId !== userId) {
        throw new Error('No puedes modificar esta tarea.');
      }

      const completed = !task.completed;

      await updateDoc(
        doc(db, 'tasks', task.id),
        { completed }
      );

      return {
        id: task.id,
        completed,
        userId,
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Eliminar tarea de Firestore
export const deleteTaskFromFirestore = createAsyncThunk(
  'tasks/deleteTaskFromFirestore',
  async (task, { rejectWithValue }) => {
    try {
      const userId = getUserId();

      if (task.userId !== userId) {
        throw new Error('No puedes eliminar esta tarea.');
      }

      await deleteDoc(
        doc(db, 'tasks', task.id)
      );

      return {
        id: task.id,
        userId,
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Estado inicial de Redux
const initialState = {
  items: [],
  userId: null,
  activeRequestId: null,
  filters: {
    status: 'Todas',
    category: 'Todas',
  },
  loading: false,
  error: null,
};

// Slice principal
const taskSlice = createSlice({
  name: 'tasks',
  initialState,

  reducers: {
    setFilter(state, action) {
      state.filters.status = action.payload;
    },

    setCategoryFilter(state, action) {
      state.filters.category = action.payload;
    },

    clearFilters(state) {
      state.filters = {
        status: 'Todas',
        category: 'Todas',
      };
    },

    clearTasks(state) {
      state.items = [];
      state.userId = null;
      state.activeRequestId = null;
      state.loading = false;
      state.error = null;
    },
  },

  extraReducers: builder => {
    builder

      // Cargar tareas
      .addCase(fetchTasks.pending, (state, action) => {
        state.loading = true;
        state.error = null;
        state.activeRequestId = action.meta.requestId;
      })

      .addCase(fetchTasks.fulfilled, (state, action) => {
        if (
          state.activeRequestId !== action.meta.requestId ||
          auth.currentUser?.uid !== action.payload.userId
        ) {
          return;
        }

        state.loading = false;
        state.activeRequestId = null;
        state.userId = action.payload.userId;
        state.items = action.payload.items;
      })

      .addCase(fetchTasks.rejected, (state, action) => {
        if (state.activeRequestId !== action.meta.requestId) {
          return;
        }

        state.loading = false;
        state.activeRequestId = null;
        state.error =
          action.payload || 'No se pudieron cargar las tareas.';
      })

      // Agregar tarea
      .addCase(addTaskToFirestore.fulfilled, (state, action) => {
        if (auth.currentUser?.uid !== action.payload.userId) {
          return;
        }

        const exists = state.items.some(
          item => item.id === action.payload.id
        );

        if (!exists) {
          state.items.unshift(action.payload);
        }
      })

      // Actualizar estado
      .addCase(toggleTaskInFirestore.fulfilled, (state, action) => {
        if (auth.currentUser?.uid !== action.payload.userId) {
          return;
        }

        const task = state.items.find(
          item => item.id === action.payload.id
        );

        if (task) {
          task.completed = action.payload.completed;
        }
      })

      // Eliminar tarea
      .addCase(deleteTaskFromFirestore.fulfilled, (state, action) => {
        if (auth.currentUser?.uid !== action.payload.userId) {
          return;
        }

        state.items = state.items.filter(
          task => task.id !== action.payload.id
        );
      });
  },
});

// Acciones
export const {
  setFilter,
  setCategoryFilter,
  clearFilters,
  clearTasks,
} = taskSlice.actions;

// Selectores
export const selectTasks = state => state.tasks.items;

export const selectTaskById = (state, id) =>
  state.tasks.items.find(task => task.id === id);

export const selectFilters = state => state.tasks.filters;

// Selector memoizado: evita renderizaciones innecesarias
export const selectVisibleTasks = createSelector(
  [selectTasks, selectFilters],
  (tasks, filters) =>
    tasks.filter(task => {
      const matchesStatus =
        filters.status === 'Todas' ||
        (
          filters.status === 'Completadas'
            ? task.completed
            : !task.completed
        );

      const matchesCategory =
        filters.category === 'Todas' ||
        task.category === filters.category;

      return matchesStatus && matchesCategory;
    })
);

export default taskSlice.reducer;
