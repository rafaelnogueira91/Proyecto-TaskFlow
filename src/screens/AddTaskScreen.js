
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';

import { useDispatch } from 'react-redux';
import { addTaskToFirestore } from '../store/taskSlice';
import colors from '../constants/colors';

const categories = ['Personal', 'Trabajo', 'Estudio'];

export default function AddTaskScreen({ navigation }) {
  const dispatch = useDispatch();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Personal');
  const [errors, setErrors] = useState({});
  const [focused, setFocused] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

  const validateForm = () => {
    const newErrors = {};

    if (title.trim().length < 5) {
      newErrors.title =
        'El título debe tener al menos 5 caracteres.';
    }

    if (description.trim().length < 10) {
      newErrors.description =
        'La descripción debe tener al menos 10 caracteres.';
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleTitleChange = value => {
    setTitle(value);

    if (errors.title && value.trim().length >= 5) {
      setErrors(current => ({
        ...current,
        title: undefined,
      }));
    }
  };

  const handleDescriptionChange = value => {
    setDescription(value);

    if (errors.description && value.trim().length >= 10) {
      setErrors(current => ({
        ...current,
        description: undefined,
      }));
    }
  };

  const handleAddTask = async () => {
    if (saving) return;
    if (!validateForm()) return;

    setSaving(true);
    setSaveError('');

    try {
      const task = {
        title: title.trim(),
        description: description.trim(),
        category,
      };

      await dispatch(
        addTaskToFirestore(task)
      ).unwrap();

      setTitle('');
      setDescription('');
      setCategory('Personal');
      setErrors({});

      // Regresar al listado después de guardar.
      navigation.goBack();

    } catch (error) {
      const message =
        typeof error === 'string'
          ? error
          : error?.message ||
            'No se pudo guardar la tarea.';

      setSaveError(message);

      if (Platform.OS !== 'web') {
        Alert.alert(
          'Error al guardar',
          message
        );
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={
        Platform.OS === 'ios'
          ? 'padding'
          : undefined
      }
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.content}>

          {/* Encabezado */}
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
            disabled={saving}
          >
            <Text style={styles.backText}>
              ← Volver a mis tareas
            </Text>
          </TouchableOpacity>

          <Text style={styles.heading}>
            Nueva tarea
          </Text>

          <Text style={styles.subtitle}>
            Organiza tus actividades y mantén
            el control de tus pendientes.
          </Text>

          {/* Formulario */}
          <View style={styles.card}>

            <Text style={styles.sectionTitle}>
              Información de la tarea
            </Text>

            <Text style={styles.sectionSubtitle}>
              Completa los siguientes campos
              para registrar una nueva actividad.
            </Text>

            {/* Título */}
            <Text style={styles.label}>
              Título de la tarea
              <Text style={styles.required}> *</Text>
            </Text>

            <TextInput
              style={[
                styles.input,
                focused === 'title' &&
                  styles.inputFocused,
                errors.title &&
                  styles.inputError,
              ]}
              placeholder="Ej. Estudiar programación"
              placeholderTextColor="#9AA8BC"
              value={title}
              onChangeText={handleTitleChange}
              onFocus={() => setFocused('title')}
              onBlur={() => setFocused('')}
              maxLength={100}
              editable={!saving}
            />

            <Text style={styles.helper}>
              Mínimo 5 caracteres
            </Text>

            {!!errors.title && (
              <Text style={styles.error}>
                {errors.title}
              </Text>
            )}

            {/* Descripción */}
            <Text style={styles.label}>
              Descripción
              <Text style={styles.required}> *</Text>
            </Text>

            <TextInput
              style={[
                styles.input,
                styles.description,
                focused === 'description' &&
                  styles.inputFocused,
                errors.description &&
                  styles.inputError,
              ]}
              placeholder="Describe lo que necesitas realizar..."
              placeholderTextColor="#9AA8BC"
              value={description}
              onChangeText={handleDescriptionChange}
              onFocus={() => setFocused('description')}
              onBlur={() => setFocused('')}
              multiline
              textAlignVertical="top"
              maxLength={500}
              editable={!saving}
            />

            <Text style={styles.helper}>
              Mínimo 10 caracteres
            </Text>

            {!!errors.description && (
              <Text style={styles.error}>
                {errors.description}
              </Text>
            )}

            {/* Categoría */}
            <Text style={styles.label}>
              Categoría
            </Text>

            <Text style={styles.categoryHint}>
              Selecciona el tipo de actividad.
            </Text>

            <View style={styles.categories}>
              {categories.map(item => (
                <TouchableOpacity
                  key={item}
                  disabled={saving}
                  onPress={() => setCategory(item)}
                  style={[
                    styles.categoryButton,
                    category === item &&
                      styles.categorySelected,
                  ]}
                >
                  <Text
                    style={[
                      styles.categoryText,
                      category === item &&
                        styles.selectedText,
                    ]}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Estado inicial */}
            <View style={styles.statusBox}>
              <View style={styles.statusDot} />

              <View style={styles.statusContent}>
                <Text style={styles.statusTitle}>
                  Estado inicial: Pendiente
                </Text>

                <Text style={styles.statusDescription}>
                  Podrás marcar esta tarea como
                  completada cuando la termines.
                </Text>
              </View>
            </View>

            {!!saveError && (
              <Text style={styles.saveError}>
                {saveError}
              </Text>
            )}

            {/* Botón guardar */}
            <TouchableOpacity
              style={[
                styles.saveButton,
                saving && styles.saveButtonDisabled,
              ]}
              onPress={handleAddTask}
              disabled={saving}
              activeOpacity={0.8}
            >
              {saving ? (
                <View style={styles.loadingRow}>
                  <ActivityIndicator
                    color="#FFFFFF"
                    size="small"
                  />
                  <Text style={styles.saveText}>
                    Guardando...
                  </Text>
                </View>
              ) : (
                <Text style={styles.saveText}>
                  + Guardar tarea
                </Text>
              )}
            </TouchableOpacity>

            <Text style={styles.footer}>
              Tus tareas se guardan en Firebase
              y se asocian a tu cuenta.
            </Text>

          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F7FC',
  },

  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },

  content: {
    width: '100%',
    maxWidth: 650,
    alignSelf: 'center',
    paddingTop: 25,
    paddingBottom: 40,
  },

  backButton: {
    marginBottom: 24,
    alignSelf: 'flex-start',
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
    marginBottom: 25,
    lineHeight: 23,
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 28,
    borderWidth: 1,
    borderColor: '#E6ECF5',
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#172B4D',
  },

  sectionSubtitle: {
    fontSize: 14,
    color: '#718096',
    marginTop: 8,
    marginBottom: 20,
    lineHeight: 21,
  },

  label: {
    fontSize: 15,
    fontWeight: '600',
    color: '#172B4D',
    marginTop: 18,
    marginBottom: 9,
  },

  required: {
    color: '#D94A4A',
  },

  input: {
    backgroundColor: '#FAFBFE',
    borderWidth: 1,
    borderColor: '#DCE5F0',
    borderRadius: 12,
    padding: 15,
    fontSize: 15,
    color: '#172B4D',
    minHeight: 52,
  },

  inputFocused: {
    borderColor: colors.primary,
    borderWidth: 2,
  },

  inputError: {
    borderColor: '#D94A4A',
  },

  description: {
    height: 125,
    paddingTop: 15,
  },

  helper: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 7,
  },

  error: {
    color: '#D94A4A',
    fontSize: 12,
    marginTop: 6,
  },

  categoryHint: {
    color: '#718096',
    fontSize: 13,
    marginBottom: 12,
  },

  categories: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },

  categoryButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: '#DCE5F0',
    borderRadius: 10,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    minWidth: 95,
  },

  categorySelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },

  categoryText: {
    color: '#64748B',
    fontSize: 14,
    fontWeight: '500',
  },

  selectedText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },

  statusBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F4F8FF',
    borderRadius: 12,
    padding: 16,
    marginTop: 28,
  },

  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#F59E0B',
    marginRight: 12,
  },

  statusContent: {
    flex: 1,
  },

  statusTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#172B4D',
  },

  statusDescription: {
    fontSize: 12,
    color: '#718096',
    marginTop: 5,
    lineHeight: 18,
  },

  saveButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 17,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 54,
    marginTop: 28,
  },

  saveButtonDisabled: {
    opacity: 0.65,
  },

  saveText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },

  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  saveError: {
    color: '#D94A4A',
    fontSize: 13,
    marginTop: 15,
    textAlign: 'center',
  },

  footer: {
    color: '#94A3B8',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 20,
    lineHeight: 18,
  },
});
