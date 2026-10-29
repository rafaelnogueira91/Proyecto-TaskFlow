# TaskFlow – Checkpoint Módulo 6

Aplicación React Native + Expo, ampliada desde el Módulo 5.

El proyecto se desarrolla progresivamente mediante checkpoints, incorporando componentes reutilizables, formularios controlados, listas interactivas y navegación anidada entre pantallas.
## Instalación

1. Instala Node.js.
2. Abre una terminal en la carpeta del proyecto.
3. Ejecuta `npm install`.
4. Ejecuta `npx expo start` y abre Expo Go o el navegador (`w`).

- `src/components`: componentes reutilizables de la interfaz.
- `src/screens`: pantallas principales de la aplicación.
- `src/navigation`: configuración de navegación con React Navigation.
- `src/assets`: imágenes y recursos locales.
- `src/constants`: colores y constantes de diseño.
## Funcionalidades

- Diseño original del Módulo 5 y validaciones de título (5 caracteres) y descripción (10 caracteres).
- Crear, visualizar, completar/descompletar desde la lista o el detalle y eliminar tareas.
- Filtros combinables por estado y categoría.
- Estado global centralizado con Redux Toolkit (`src/store/store.js` y `src/store/taskSlice.js`).
- `useSelector` y `useDispatch` sincronizan la lista y el detalle de tareas.
- Acciones `addTask`, `toggleTaskStatus`, `deleteTask`, `setFilter` y filtro adicional de categoría.
- Los filtros se conservan al navegar entre pestañas durante la sesión.
- Navegación Stack + Bottom Tabs para Tareas y Perfil.

- `HomeScreen`: visualización y gestión de tareas mediante FlatList.
- `AddTaskScreen`: formulario funcional para crear tareas.
- `TaskDetailScreen`: visualización de información detallada de una tarea.
- `ProfileScreen`: pantalla de perfil del usuario.
## Estructura

- `App.js`: Provider y navegadores.
- `src/store/`: store, slice, acciones y selectores.
- `src/screens/`: pantallas.
- `src/components/`: componentes reutilizables.
- `src/constants/colors.js`: colores originales.

**Nota:** el estado Redux se mantiene durante la sesión; no hay persistencia después de cerrar la aplicación. Esta entrega no incluye backend.

## GitHub

Se implementó un formulario que permite:

- Ingresar título, descripción y categoría.
- Controlar los campos mediante `useState`.
- Validar títulos de mínimo 5 caracteres.
- Validar descripciones de mínimo 10 caracteres.
- Mostrar mensajes de error.
- Seleccionar categorías Personal, Trabajo y Estudio.
- Confirmar el guardado de una tarea.
- Limpiar los campos después de guardar correctamente.

## Checkpoint 4: Lista de tareas con detalle

Se incorporaron las siguientes funcionalidades:

- Visualización de tareas mediante `FlatList`.
- Mensaje de estado vacío cuando no existen tareas.
- Incorporación de nuevas tareas a la lista.
- Selección de tareas mediante interacción táctil.
- Visualización de título, descripción, categoría, fecha y estado.
- Actualización del estado de tareas completadas.
- Eliminación de tareas.
- Manejo del estado local mediante React Hooks.

En este checkpoint se utilizó navegación simulada, posteriormente reemplazada por React Navigation.

## Checkpoint 5: Navegación anidada con React Navigation

Se implementó una arquitectura de navegación anidada utilizando React Navigation.

### Navegación principal

La aplicación utiliza `NavigationContainer` y un `BottomTabNavigator` con dos pestañas:

- **Inicio:** permite visualizar y administrar tareas.
- **Perfil:** muestra la información del usuario.

### Navegación de tareas

Dentro de Inicio se implementó un `NativeStackNavigator` con tres rutas:

- `TaskList`: lista principal de tareas.
- `TaskDetail`: información detallada de una tarea.
- `TaskForm`: formulario de creación de tareas.

### Funcionalidades implementadas

- Navegación desde la lista hacia el detalle de una tarea.
- Paso del ID mediante `navigation.navigate()` y `route.params`.
- Visualización de los datos correspondientes a la tarea seleccionada.
- Navegación desde la lista hacia el formulario.
- Redirección automática a la lista después de guardar.
- Regreso mediante el encabezado nativo.
- Navegación entre Inicio y Perfil mediante pestañas inferiores.
- Conservación temporal de las tareas utilizando Context API.

### Estructura de navegación

```text
App
 └── TasksProvider
      └── NavigationContainer
           └── BottomTabNavigator
                ├── Home
                │    └── NativeStackNavigator
                │         ├── TaskList
                │         ├── TaskDetail
                │         └── TaskForm
                └── Profile
                     └── ProfileScreen
```

## Pruebas y validaciones

Se realizaron pruebas manuales en el navegador mediante Expo.

Se comprobó:

- Visualización del estado vacío.
- Acceso al formulario de creación.
- Creación y visualización de una nueva tarea.
- Redirección automática a la lista después de guardar.
- Navegación hacia el detalle.
- Visualización del ID, título, descripción, categoría, fecha y estado.
- Regreso desde el detalle hacia la lista.
- Funcionamiento de las pestañas Inicio y Perfil.
- Conservación de la tarea al cambiar entre pestañas.

## Ejecución local

1. Clonar el repositorio.
2. Instalar las dependencias:

   `npm install`

3. Iniciar Expo:

   `npx expo start`

4. Abrir la aplicación mediante Expo Go, un emulador compatible o el navegador web.

## Tecnologías utilizadas

- React Native
- Expo
- JavaScript
- React Hooks (`useState`)
- Context API
- FlatList
- StyleSheet
- React Navigation
- Native Stack Navigator
- Bottom Tab Navigator

## Estado actual

El proyecto integra las funcionalidades correspondientes a los **Checkpoints 3, 4 y 5**.

La aplicación permite crear, visualizar, completar y eliminar tareas, consultar sus detalles y navegar entre las pantallas mediante una arquitectura anidada.

Las tareas se mantienen temporalmente durante la ejecución de la aplicación, sin persistencia permanente.

En los próximos módulos se incorporarán Redux Toolkit y Firebase para la gestión global y persistencia de datos.

## Repositorio

https://github.com/rafaelnogueira91/Proyecto-TaskFlow
El archivo `.gitignore` excluye `node_modules` y `.expo`. Sube los archivos fuente, `package.json`, el archivo de bloqueo que genere `npm install` y este README.
