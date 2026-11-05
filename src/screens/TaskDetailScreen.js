
import React, { useState } from 'react';

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  Platform,
} from 'react-native';

import { useDispatch, useSelector } from 'react-redux';

import colors from '../constants/colors';

import {
  selectTaskById,
  toggleTaskInFirestore,
  deleteTaskFromFirestore,
} from '../store/taskSlice';

export default function TaskDetailScreen({
  route,
  navigation,
}) {
  const dispatch = useDispatch();

  const taskId = route.params?.taskId;

  const task = useSelector(state =>
    selectTaskById(state, taskId)
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Formatear fecha de Firestore o JavaScript.
  const formatDate = value => {
    if (!value) return 'Sin fecha';

    let date;

    if (typeof value?.toDate === 'function') {
      date = value.toDate();
    } else if (
      typeof value?.seconds === 'number'
    ) {
      date = new Date(value.seconds * 1000);
    } else {
      date = new Date(value);
    }

    if (Number.isNaN(date.getTime())) {
      return 'Sin fecha';
    }

    return date.toLocaleDateString('es-CL', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  // Cambiar estado en Firebase.
  const handleToggle = async () => {
    if (!task || loading) return;

    setLoading(true);
    setError('');

    try {
      await dispatch(
        toggleTaskInFirestore(task)
      ).unwrap();
    } catch (err) {
      setError(
        typeof err === 'string'
          ? err
          : 'No se pudo actualizar la tarea.'
      );
    } finally {
      setLoading(false);
    }
  };

  // Eliminar tarea en Firebase.
  const handleDelete = () => {
    if (!task || loading) return;

    const removeTask = async () => {
      setLoading(true);
      setError('');

      try {
        await dispatch(
          deleteTaskFromFirestore(task)
        ).unwrap();

        navigation.goBack();
      } catch (err) {
        setError(
          typeof err === 'string'
            ? err
            : 'No se pudo eliminar la tarea.'
        );
      } finally {
        setLoading(false);
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
        'Esta acción no se puede deshacer.',
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

  // La tarea fue eliminada o no existe.
  if (!task) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyTitle}>
          Tarea no disponible
        </Text>

        <Text style={styles.emptyText}>
          La tarea no existe o ya fue eliminada.
        </Text>

        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Text style={styles.backButtonText}>
            ← Volver a mis tareas
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  const dateLabel = formatDate(task.createdAt);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      <View style={styles.wrapper}>

        {/* Volver */}
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backLink}
          disabled={loading}
        >
          <Text style={styles.backText}>
            ← Volver a mis tareas
          </Text>
        </TouchableOpacity>

        {/* Encabezado */}
        <Text style={styles.heading}>
          Detalle de tarea
        </Text>

        <Text style={styles.subtitle}>
          Consulta la información y administra
          el estado de tu actividad.
        </Text>

        {/* Tarjeta principal */}
        <View style={styles.card}>

          {/* Categoría y estado */}
          <View style={styles.badgeRow}>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>
                {task.category || 'Personal'}
              </Text>
            </View>

            <View
              style={[
                styles.statusBadge,
                task.completed &&
                  styles.completedBadge,
              ]}
            >
              <Text
                style={[
                  styles.statusText,
                  task.completed &&
                    styles.completedText,
                ]}
              >
                {task.completed
                  ? '✓ Completada'
                  : '● Pendiente'}
              </Text>
            </View>
          </View>

          {/* Título */}
          <Text style={styles.label}>
            Título de la tarea
          </Text>

          <Text style={styles.title}>
            {task.title}
          </Text>

          <View style={styles.divider} />

          {/* Descripción */}
          <Text style={styles.label}>
            Descripción
          </Text>

          <Text style={styles.body}>
            {task.description ||
              'Sin descripción'}
          </Text>

          <View style={styles.divider} />

          {/* Información */}
          <Text style={styles.sectionTitle}>
            Información general
          </Text>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>
              Categoría
            </Text>

            <Text style={styles.infoValue}>
              {task.category || 'Personal'}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>
              Fecha de creación
            </Text>

            <Text style={styles.infoValue}>
              {dateLabel}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>
              Estado actual
            </Text>

            <Text
              style={[
                styles.infoValue,
                task.completed
                  ? styles.greenText
                  : styles.orangeText,
              ]}
            >
              {task.completed
                ? 'Completada'
                : 'Pendiente'}
            </Text>
          </View>

          {!!error && (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>
                {error}
              </Text>
            </View>
          )}

          {/* Acciones */}
          <View style={styles.actions}>
            <TouchableOpacity
              style={[
                styles.toggleButton,
                loading && styles.disabled,
              ]}
              onPress={handleToggle}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator
                  color="#FFFFFF"
                />
              ) : (
                <Text style={styles.toggleText}>
                  {task.completed
                    ? '↩ Marcar como pendiente'
                    : '✓ Marcar como completada'}
                </Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.deleteButton,
                loading && styles.disabled,
              ]}
              onPress={handleDelete}
              disabled={loading}
            >
              <Text style={styles.deleteText}>
                Eliminar tarea
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.footer}>
          TaskFlow · Gestión de tareas
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F7FC',
  },

  content: {
    flexGrow: 1,
    padding: 20,
  },

  wrapper: {
    width: '100%',
    maxWidth: 700,
    alignSelf: 'center',
    paddingTop: 25,
    paddingBottom: 35,
  },

  backLink: {
    marginBottom: 25,
  },

  backText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '600',
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
    marginBottom: 28,
    lineHeight: 23,
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 28,
    borderWidth: 1,
    borderColor: '#E6ECF5',
  },

  badgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 25,
  },

  categoryBadge: {
    backgroundColor: '#E8F1FF',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },

  categoryText: {
    color: '#2563EB',
    fontSize: 12,
    fontWeight: '600',
  },

  statusBadge: {
    backgroundColor: '#FFF5E5',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
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

  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#718096',
    marginBottom: 9,
  },

  title: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#172B4D',
    lineHeight: 34,
  },

  body: {
    fontSize: 16,
    color: '#475569',
    lineHeight: 26,
  },

  divider: {
    height: 1,
    backgroundColor: '#E6ECF5',
    marginVertical: 25,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#172B4D',
    marginBottom: 20,
  },

  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 18,
  },

  infoLabel: {
    color: '#718096',
    fontSize: 14,
    flex: 1,
  },

  infoValue: {
    color: '#172B4D',
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
    textAlign: 'right',
  },

  greenText: {
    color: '#198754',
  },

  orangeText: {
    color: '#D97706',
  },

  actions: {
    marginTop: 20,
    gap: 12,
  },

  toggleButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 17,
    minHeight: 54,
    alignItems: 'center',
    justifyContent: 'center',
  },

  toggleText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
  },

  deleteButton: {
    backgroundColor: '#FDECEC',
    borderRadius: 12,
    padding: 17,
    alignItems: 'center',
  },

  deleteText: {
    color: '#D94A4A',
    fontSize: 15,
    fontWeight: '600',
  },

  disabled: {
    opacity: 0.6,
  },

  errorBox: {
    backgroundColor: '#FDECEC',
    padding: 15,
    borderRadius: 10,
    marginTop: 15,
  },

  errorText: {
    color: '#D94A4A',
    fontSize: 13,
  },

  footer: {
    fontSize: 12,
    color: '#A0AEC0',
    textAlign: 'center',
    marginTop: 28,
  },

  emptyContainer: {
    flex: 1,
    backgroundColor: '#F4F7FC',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 25,
  },

  emptyTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#172B4D',
  },

  emptyText: {
    color: '#718096',
    marginTop: 10,
    textAlign: 'center',
  },

  backButton: {
    marginTop: 22,
    padding: 15,
  },

  backButtonText: {
    color: colors.primary,
    fontWeight: '600',
  },
});
