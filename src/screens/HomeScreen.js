
import React, { useMemo, useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  SafeAreaView,
  Alert,
  Platform,
  ActivityIndicator,
} from 'react-native';

import { useDispatch, useSelector } from 'react-redux';
import EmptyState from '../components/EmptyState';
import colors from '../constants/colors';

import {
  selectVisibleTasks,
  selectTasks,
  selectFilters,
  setFilter,
  setCategoryFilter,
  clearFilters,
  fetchTasks,
  toggleTaskInFirestore,
  deleteTaskFromFirestore,
} from '../store/taskSlice';

export default function HomeScreen({ navigation }) {
  const dispatch = useDispatch();

  const tasks = useSelector(selectVisibleTasks);
  const allTasks = useSelector(selectTasks);
  const filters = useSelector(selectFilters);
  const loading = useSelector(state => state.tasks.loading);
  const error = useSelector(state => state.tasks.error);

  const [busyId, setBusyId] = useState(null);
  const [actionError, setActionError] = useState('');

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  const statistics = useMemo(() => {
    const total = allTasks.length;
    const completed = allTasks.filter(
      task => task.completed
    ).length;

    return {
      total,
      completed,
      pending: total - completed,
    };
  }, [allTasks]);

  const handleToggle = async task => {
    if (busyId) return;

    setBusyId(task.id);
    setActionError('');

    try {
      await dispatch(
        toggleTaskInFirestore(task)
      ).unwrap();
    } catch (err) {
      setActionError(
        typeof err === 'string'
          ? err
          : 'No se pudo actualizar la tarea.'
      );
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = task => {
    if (busyId) return;

    const removeTask = async () => {
      setBusyId(task.id);
      setActionError('');

      try {
        await dispatch(
          deleteTaskFromFirestore(task)
        ).unwrap();
      } catch (err) {
        setActionError(
          typeof err === 'string'
            ? err
            : 'No se pudo eliminar la tarea.'
        );
      } finally {
        setBusyId(null);
      }
    };

    if (Platform.OS === 'web') {
      if (
        window.confirm(
          '¿Estás seguro de eliminar esta tarea?'
        )
      ) {
        removeTask();
      }
    } else {
      Alert.alert(
        'Eliminar tarea',
        '¿Estás seguro de eliminar esta tarea?',
        [
          {
            text: 'Cancelar',
            style: 'cancel',
          },
          {
            text: 'Eliminar',
            style: 'destructive',
            onPress: removeTask,
          },
        ]
      );
    }
  };

  const renderTask = ({ item }) => {
    const isBusy = busyId === item.id;

    return (
      <View style={styles.card}>
        <View style={styles.cardTop}>
          <View
            style={[
              styles.categoryBadge,
              item.category === 'Trabajo' &&
                styles.workBadge,
              item.category === 'Estudio' &&
                styles.studyBadge,
            ]}
          >
            <Text style={styles.categoryText}>
              {item.category}
            </Text>
          </View>

          <View
            style={[
              styles.statusBadge,
              item.completed && styles.completedBadge,
            ]}
          >
            <Text
              style={[
                styles.statusText,
                item.completed && styles.completedText,
              ]}
            >
              {item.completed
                ? '✓ Completada'
                : '● Pendiente'}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={() =>
            navigation.navigate('DetalleTarea', {
              taskId: item.id,
            })
          }
          accessibilityRole="button"
          activeOpacity={0.8}
        >
          <Text
            style={[
              styles.taskTitle,
              item.completed && styles.done,
            ]}
          >
            {item.title}
          </Text>

          <Text
            style={styles.description}
            numberOfLines={3}
          >
            {item.description}
          </Text>

          <Text style={styles.detailHint}>
            Ver detalle →
          </Text>
        </TouchableOpacity>

        <View style={styles.divider} />

        <View style={styles.actions}>
          <TouchableOpacity
            style={[
              styles.completeButton,
              item.completed && styles.pendingButton,
              isBusy && styles.disabledButton,
            ]}
            onPress={() => handleToggle(item)}
            disabled={busyId !== null}
          >
            <Text style={styles.completeText}>
              {isBusy
                ? 'Procesando...'
                : item.completed
                  ? '↩ Marcar pendiente'
                  : '✓ Completar'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.deleteButton,
              isBusy && styles.disabledButton,
            ]}
            onPress={() => handleDelete(item)}
            disabled={busyId !== null}
          >
            <Text style={styles.deleteText}>
              Eliminar
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={tasks}
        keyExtractor={item => String(item.id)}
        renderItem={renderTask}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <View>
            <View style={styles.header}>
              <Text style={styles.heading}>
                Mis tareas
              </Text>

              <Text style={styles.subtitle}>
                Organiza tus actividades y
                revisa tu progreso.
              </Text>
            </View>

            <View style={styles.statsRow}>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>
                  {statistics.total}
                </Text>
                <Text style={styles.statLabel}>
                  Total
                </Text>
              </View>

              <View style={styles.statCard}>
                <Text
                  style={[
                    styles.statNumber,
                    styles.pendingNumber,
                  ]}
                >
                  {statistics.pending}
                </Text>
                <Text style={styles.statLabel}>
                  Pendientes
                </Text>
              </View>

              <View style={styles.statCard}>
                <Text
                  style={[
                    styles.statNumber,
                    styles.completedNumber,
                  ]}
                >
                  {statistics.completed}
                </Text>
                <Text style={styles.statLabel}>
                  Completadas
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.addButton}
              onPress={() =>
                navigation.navigate('AgregarTarea')
              }
            >
              <Text style={styles.addText}>
                + Nueva tarea
              </Text>
            </TouchableOpacity>

            <View style={styles.filterCard}>
              <Text style={styles.filterHeading}>
                Filtrar tareas
              </Text>

              <Text style={styles.filterTitle}>
                Por estado
              </Text>

              <View style={styles.filterRow}>
                {[
                  'Todas',
                  'Pendientes',
                  'Completadas',
                ].map(value => (
                  <TouchableOpacity
                    key={value}
                    onPress={() =>
                      dispatch(setFilter(value))
                    }
                    style={[
                      styles.filterChip,
                      filters.status === value &&
                        styles.filterActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.filterText,
                        filters.status === value &&
                          styles.filterTextActive,
                      ]}
                    >
                      {value}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.filterTitle}>
                Por categoría
              </Text>

              <View style={styles.filterRow}>
                {[
                  'Todas',
                  'Personal',
                  'Trabajo',
                  'Estudio',
                ].map(value => (
                  <TouchableOpacity
                    key={value}
                    onPress={() =>
                      dispatch(
                        setCategoryFilter(value)
                      )
                    }
                    style={[
                      styles.filterChip,
                      filters.category === value &&
                        styles.filterActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.filterText,
                        filters.category === value &&
                          styles.filterTextActive,
                      ]}
                    >
                      {value}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {(filters.status !== 'Todas' ||
                filters.category !== 'Todas') && (
                <TouchableOpacity
                  onPress={() =>
                    dispatch(clearFilters())
                  }
                  style={styles.clearButton}
                >
                  <Text style={styles.clearText}>
                    Limpiar filtros
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            <View style={styles.listHeadingRow}>
              <Text style={styles.listHeading}>
                Lista de tareas
              </Text>

              <Text style={styles.taskCount}>
                {tasks.length} tareas
              </Text>
            </View>

            {loading && (
              <View style={styles.messageBox}>
                <ActivityIndicator
                  color={colors.primary}
                />
                <Text style={styles.messageText}>
                  Cargando tareas desde Firebase...
                </Text>
              </View>
            )}

            {!!error && (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>
                  Error al cargar: {error}
                </Text>

                <TouchableOpacity
                  onPress={() => dispatch(fetchTasks())}
                >
                  <Text style={styles.retryText}>
                    Reintentar
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            {!!actionError && (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>
                  {actionError}
                </Text>
              </View>
            )}
          </View>
        }
        ListEmptyComponent={
          !loading && !error ? (
            <View style={styles.emptyContainer}>
              <EmptyState />
            </View>
          ) : null
        }
        ListFooterComponent={
          <Text style={styles.footer}>
            TaskFlow · Gestión de tareas
          </Text>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F7FC',
  },
  list: {
    flexGrow: 1,
    width: '100%',
    maxWidth: 900,
    alignSelf: 'center',
    padding: 20,
    paddingBottom: 45,
  },
  header: {
    marginTop: 20,
    marginBottom: 24,
  },
  heading: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#172B4D',
  },
  subtitle: {
    fontSize: 15,
    color: '#718096',
    marginTop: 8,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    paddingVertical: 22,
    paddingHorizontal: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E6ECF5',
  },
  statNumber: {
    fontSize: 29,
    fontWeight: 'bold',
    color: '#4A90E2',
  },
  pendingNumber: {
    color: '#D97706',
  },
  completedNumber: {
    color: '#198754',
  },
  statLabel: {
    fontSize: 12,
    color: '#718096',
    marginTop: 7,
    textAlign: 'center',
  },
  addButton: {
    backgroundColor: colors.primary,
    padding: 17,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 24,
  },
  addText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  filterCard: {
    backgroundColor: '#FFFFFF',
    padding: 22,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E6ECF5',
    marginBottom: 28,
  },
  filterHeading: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#172B4D',
    marginBottom: 8,
  },
  filterTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
    marginTop: 15,
    marginBottom: 10,
  },
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 9,
  },
  filterChip: {
    borderWidth: 1,
    borderColor: '#DCE5F0',
    backgroundColor: '#FFFFFF',
    borderRadius: 9,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  filterActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterText: {
    color: '#64748B',
    fontSize: 13,
    fontWeight: '500',
  },
  filterTextActive: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  clearButton: {
    alignSelf: 'flex-start',
    marginTop: 18,
  },
  clearText: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '600',
  },
  listHeadingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  listHeading: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#172B4D',
  },
  taskCount: {
    fontSize: 13,
    color: '#718096',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 22,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#E6ECF5',
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 15,
  },
  categoryBadge: {
    backgroundColor: '#E8F1FF',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
  },
  workBadge: {
    backgroundColor: '#F3E8FF',
  },
  studyBadge: {
    backgroundColor: '#E6F7EE',
  },
  categoryText: {
    color: '#2563EB',
    fontSize: 12,
    fontWeight: '600',
  },
  statusBadge: {
    backgroundColor: '#FFF5E5',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
  },
  completedBadge: {
    backgroundColor: '#E6F7EE',
  },
  statusText: {
    color: '#B45309',
    fontSize: 12,
    fontWeight: '600',
  },
  completedText: {
    color: '#198754',
  },
  taskTitle: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#172B4D',
  },
  done: {
    textDecorationLine: 'line-through',
    opacity: 0.55,
  },
  description: {
    color: '#718096',
    fontSize: 14,
    marginTop: 10,
    lineHeight: 22,
  },
  detailHint: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '600',
    marginTop: 15,
  },
  divider: {
    height: 1,
    backgroundColor: '#E6ECF5',
    marginVertical: 18,
  },
  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  completeButton: {
    backgroundColor: '#E8F1FF',
    borderRadius: 9,
    paddingHorizontal: 15,
    paddingVertical: 11,
  },
  pendingButton: {
    backgroundColor: '#FFF5E5',
  },
  completeText: {
    color: '#2563EB',
    fontSize: 13,
    fontWeight: '600',
  },
  deleteButton: {
    backgroundColor: '#FDECEC',
    borderRadius: 9,
    paddingHorizontal: 15,
    paddingVertical: 11,
  },
  deleteText: {
    color: '#D94A4A',
    fontSize: 13,
    fontWeight: '600',
  },
  disabledButton: {
    opacity: 0.5,
  },
  emptyContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 25,
    borderWidth: 1,
    borderColor: '#E6ECF5',
  },
  messageBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 18,
    marginBottom: 15,
  },
  messageText: {
    color: '#718096',
    fontSize: 14,
  },
  errorBox: {
    backgroundColor: '#FDECEC',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  errorText: {
    color: '#D94A4A',
    fontSize: 13,
  },
  retryText: {
    color: '#2563EB',
    fontWeight: 'bold',
    marginTop: 10,
  },
  footer: {
    color: '#A0AEC0',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 30,
  },
});
