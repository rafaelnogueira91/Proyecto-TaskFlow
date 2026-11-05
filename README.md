# TaskFlow — Módulo 7 | Autenticación y Persistencia

**Coderhouse · Checkpoint: Autenticación y Persistencia**

TaskFlow es una aplicación de gestión de tareas creada con **React Native y Expo**. Usa **Firebase Authentication** para registrar usuarios e iniciar sesión, **Cloud Firestore** para conservar las tareas y **Redux Toolkit** para mantener sincronizada la interfaz.

Repositorio del proyecto: https://github.com/rafaelnogueira91/Proyecto-TaskFlow

## Tecnologías

- React Native + Expo (web y dispositivos compatibles)
- React Navigation: Stack Navigator y Bottom Tabs
- Redux Toolkit + React Redux
- Firebase Authentication (correo y contraseña)
- Cloud Firestore

## Instalación y ejecución

1. Instalar **Node.js** y descargar o clonar este proyecto.
2. Abrir una terminal en la carpeta que contiene `package.json`.
3. Ejecutar `npm install`.
4. Ejecutar `npx expo start --web` para probar en navegador, o `npx expo start` para seleccionar un destino compatible.
5. Tener habilitados en el proyecto Firebase **Authentication > Sign-in method > Email/Password** y **Firestore Database**, con reglas de acceso por usuario.

> La configuración de Firebase está en `src/services/firebaseConfig.js`. Para utilizar otro proyecto Firebase, se deben reemplazar sus datos de configuración y configurar sus servicios y reglas. No subir cuentas de servicio ni credenciales administrativas al repositorio.

## Funcionalidades del Módulo 7

### Autenticación y navegación protegida

- `LoginScreen.js`: inicio de sesión mediante `signInWithEmailAndPassword`, validaciones y mensajes de error.
- `RegisterScreen.js`: registro mediante `createUserWithEmailAndPassword`.
- `App.js`: escucha `onAuthStateChanged`, muestra un indicador de carga mientras determina la sesión y alterna entre rutas públicas (`Login`, `Registro`) y privadas (`Inicio`, `AgregarTarea`, `DetalleTarea`).
- `ProfileScreen.js`: muestra información de la cuenta y permite cerrar sesión.

### Tareas persistidas en Firestore

- Colección: **`tasks`**.
- Cada documento de tarea contiene `userId`, `title`, `description`, `category`, `completed` y `createdAt`.
- **Crear:** `addDoc` guarda una tarea vinculada al `uid` autenticado.
- **Leer:** `getDocs` y `where('userId', '==', uid)` consultan las tareas del usuario.
- **Actualizar:** `updateDoc` cambia el estado completada/pendiente.
- **Eliminar:** `deleteDoc` elimina el documento correspondiente.
- `taskSlice.js` implementa estas operaciones con `createAsyncThunk`, almacena los resultados en Redux y ofrece selectores para lista, detalle, filtros y contadores.
- Se muestra un estado de carga y un mensaje de error con opción de reintentar la consulta cuando corresponde.

**Sincronización:** la aplicación utiliza lectura al ingresar a la pantalla y después de operaciones de escritura; **no utiliza un listener `onSnapshot` en tiempo real**. Este enfoque está permitido por el enunciado del checkpoint.

## Organización principal

```text
App.js
src/
  components/         Componentes reutilizables
  constants/          Colores de interfaz
  screens/            Login, registro, tareas, detalle y perfil
  services/
    firebaseConfig.js Configuración y exportación de auth y db
  store/
    store.js          Configuración de Redux
    taskSlice.js      Operaciones Firestore, reducers y selectores
```

## Cómo probar el checkpoint

Las siguientes son **instrucciones de prueba manual**, no un registro de pruebas automatizadas. Marca los resultados una vez ejecutados en tu entorno y en la consola Firebase.

| Prueba | Pasos | Resultado esperado |
|---|---|---|
| Registro | Cerrar sesión, entrar a Registro y crear una cuenta nueva | Firebase crea la cuenta y se muestra el flujo privado |
| Inicio de sesión | Cerrar sesión e ingresar con credenciales válidas | Se abre Inicio / Mis tareas |
| Error de autenticación | Intentar ingresar con contraseña incorrecta | Se presenta un mensaje claro, sin cerrar la app |
| Sesión persistente | Iniciar sesión, cerrar y volver a abrir la app en el mismo entorno | Se recupera la sesión si el entorno conserva el almacenamiento de Firebase |
| Crear tarea | Crear una tarea válida | Aparece en la lista y en Firebase Console > Firestore Database > `tasks` |
| Completar tarea | Cambiar el estado de una tarea | Cambia en la interfaz y en el documento de Firestore |
| Eliminar tarea | Eliminar una tarea | Desaparece de la lista y de Firestore |
| Aislamiento de usuarios | Crear tarea con cuenta A, cerrar sesión e ingresar con cuenta B | B no ve las tareas de A |
| Persistencia de datos | Crear una tarea, cerrar sesión y volver a ingresar con la misma cuenta | La tarea vuelve a cargarse desde Firestore |
| Fallo de red | Desconectar la red e intentar consultar o guardar | Se informa el error sin que la app se cierre |

### Evidencias recomendadas para la entrega

Capturas del registro/login, de la lista de tareas, del documento creado en la colección `tasks` (mostrando `userId`) y de la prueba con dos cuentas. **No incluir contraseñas ni tokens** en capturas.

## Seguridad de Firestore

Filtrar por `userId` en el cliente **no sustituye las reglas de seguridad**. La consola Firebase debe tener reglas que permitan a cada usuario leer y escribir solo sus propios documentos. El archivo `firestore.rules.example` incluye un ejemplo para revisar y adaptar en Firebase Console > Firestore Database > Rules.

**Importante:** el archivo de ejemplo no aplica reglas automáticamente ni prueba que las reglas de producción estén activas. Deben revisarse y publicarse en Firebase.

## Alcance y próximo paso

Este checkpoint cubre autenticación, rutas protegidas, persistencia y sincronización de tareas. **ImagePicker, Firebase Storage y fotografía de perfil** se reservan para la entrega final, según el enunciado de Coderhouse.
