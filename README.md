# TaskFlow

TaskFlow es una aplicación móvil desarrollada con **React Native y Expo**, orientada a la creación, organización y seguimiento de tareas.

El proyecto se desarrolla progresivamente mediante checkpoints, incorporando componentes reutilizables, formularios controlados, listas interactivas y pantallas de detalle.

## Estructura del proyecto

- `src/components`: componentes reutilizables de la interfaz.
- `src/screens`: pantallas principales de la aplicación.
- `src/assets`: imágenes y recursos locales.
- `src/constants`: colores y constantes de diseño.

## Pantallas implementadas

- `HomeScreen`: visualización y gestión de tareas mediante FlatList.
- `AddTaskScreen`: formulario funcional para crear tareas.
- `TaskDetailScreen`: visualización de la información detallada de una tarea.
- `ProfileScreen`: pantalla de perfil del usuario.

## Componentes implementados

- `ProfileCard`: componente reutilizable que recibe información mediante props.
- `EmptyState`: componente que informa cuando no existen tareas registradas.

## Checkpoint 3: Formulario funcional

El formulario de creación de tareas permite:

- Ingresar título, descripción y categoría.
- Controlar los campos mediante `useState`.
- Validar títulos de mínimo 5 caracteres.
- Validar descripciones de mínimo 10 caracteres.
- Mostrar mensajes de error en rojo.
- Seleccionar categorías con Personal como valor inicial.
- Registrar el objeto de la tarea en consola.
- Mostrar una confirmación de guardado.
- Limpiar automáticamente los campos después de guardar correctamente.

## Checkpoint 4: Lista de tareas con detalle

Se incorporaron las siguientes funcionalidades:

- Visualización de tareas mediante `FlatList`.
- Mensaje de estado vacío cuando no existen tareas.
- Incorporación de nuevas tareas a la lista.
- Selección de tareas mediante interacción táctil.
- Visualización de título, descripción, categoría, fecha y estado.
- Botón para regresar desde el detalle a la lista.
- Actualización del estado de tareas completadas.
- Manejo del estado local mediante `useState`.
- Navegación simulada sin React Navigation.

## Ejecución local

1. Instalar las dependencias:

   `npm install`

2. Iniciar Expo:

   `npx expo start`

3. Abrir la aplicación mediante Expo Go, un emulador compatible o el navegador web.

## Pruebas y validaciones

En el Checkpoint 3 se verificaron:

- Visualización del formulario.
- Validaciones de título y descripción.
- Mensajes de error.
- Confirmación de guardado en navegador.
- Limpieza de los campos después de guardar.

Para el Checkpoint 4 se deben comprobar:

- Visualización del estado vacío.
- Creación y visualización de tareas en la lista.
- Acceso al detalle de una tarea.
- Funcionamiento del botón Volver.
- Actualización de tareas completadas.

## Estado actual

El proyecto integra las funcionalidades correspondientes a los Checkpoints 3 y 4.

Las tareas se gestionan mediante estado local de React, sin persistencia permanente en una base de datos.

La implementación de React Navigation, Redux y Firebase se realizará en los módulos posteriores.

## Tecnologías utilizadas

- React Native
- Expo
- JavaScript
- React Hooks (`useState`)
- FlatList
- StyleSheet

## Repositorio

https://github.com/rafaelnogueira91/Proyecto-TaskFlow