# TaskFlow

TaskFlow es una aplicación móvil desarrollada con React Native y Expo.

El proyecto se desarrolla por módulos, incorporando progresivamente pantallas, componentes reutilizables y funcionalidades para la gestión de tareas.

## Estructura del proyecto

- `src/components`: componentes reutilizables de la interfaz.
- `src/screens`: pantallas de la aplicación.
- `src/assets`: imágenes y recursos locales.
- `src/constants`: colores y constantes de diseño.

## Pantallas implementadas

- `HomeScreen`: pantalla base para visualizar tareas.
- `ProfileScreen`: pantalla de perfil del usuario.
- `AddTaskScreen`: formulario funcional para crear tareas.

## Componentes implementados

- `ProfileCard`: componente reutilizable que recibe nombre, rol e imagen mediante props.

## Formulario de creación de tareas

El formulario de `AddTaskScreen` permite:

- Ingresar título, descripción y categoría.
- Controlar los campos mediante `useState`.
- Validar un título de mínimo 5 caracteres.
- Validar una descripción de mínimo 10 caracteres.
- Mostrar mensajes de error debajo de los campos.
- Seleccionar una categoría, con Personal como valor inicial.
- Simular el guardado mostrando el objeto de la tarea en consola.
- Limpiar los campos después de guardar correctamente.
- Mostrar un mensaje de éxito mediante `Alert.alert` en dispositivos compatibles.

Los datos todavía no se almacenan en una base de datos.

## Ejecución local

1. Instalar las dependencias:

   `npm install`

2. Iniciar Expo:

   `npx expo start`

3. Abrir la aplicación en Expo Go, un emulador compatible o el navegador web.

## Visualización y pruebas

- Se visualizó correctamente `ProfileScreen` con el componente `ProfileCard` en la segunda entrega.
- Se visualizó `AddTaskScreen` en el navegador.
- Se comprobaron los mensajes de validación.
- Se verificó el registro del objeto de tarea en consola.
- Se comprobó la limpieza del formulario después de un guardado válido.

La verificación del mensaje nativo `Alert.alert` en Expo Go está pendiente.

## Estado actual

La aplicación inicia mostrando `AddTaskScreen`. Las pantallas `HomeScreen` y `ProfileScreen` permanecen disponibles en el código para futuras integraciones.

La navegación y la persistencia de datos se implementarán en próximos módulos.