# 🧑‍💻 Torrefactora - Frontend

Este es el **frontend de la prueba técnica full stack** basada en la gestión de tareas con React, Supabase y Material UI. La app permite al usuario crear, editar, eliminar y visualizar tareas y subtareas, priorizadas con el algoritmo **SJF (Shortest Job First)**.

## 🚀 Tecnologías utilizadas

- [React 18+](https://react.dev/)
- [Zustand](https://github.com/pmndrs/zustand) - manejo de estado global
- [Zod](https://github.com/colinhacks/zod) - validación de formularios
- [Material UI](https://mui.com/) - interfaz visual
- [Supabase Auth](https://supabase.com/) - autenticación
- [Vite](https://vitejs.dev/) - entorno de desarrollo

## 📦 Instalación

1. Clona el repositorio:

```bash
git clone https://github.com/migueldeveloper91/torrefactora.git
cd torrefactora-frontend
```

2. Instala las dependencias:

```bash
npm install
```

3. Crea un archivo `.env` en la raíz del proyecto con tu configuración de Supabase:

```env
VITE_SUPABASE_URL=https://<tu-proyecto>.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOi...
```

4. Ejecuta el proyecto:

```bash
npm run dev
```

El frontend se ejecutará en: `http://localhost:5173`

## ✨ Funcionalidades principales

- 🔐 Registro e inicio de sesión con Supabase
- ✅ Gestión de tareas: crear, editar, eliminar
- 🧩 Gestión de subtareas asociadas a cada tarea
- ⏳ Prioridad por duración con algoritmo **SJF**
- 🧾 Panel con tabla de tareas ordenadas por prioridad
- 🗂️ Diálogo de confirmación al eliminar tareas o subtareas
- 📱 UI moderna y responsive con Material UI

## 📁 Estructura del proyecto

```
📁 src
├── api/                # Conexiones al backend (REST + Supabase)
├── components/         # Componentes UI reutilizables (Modal, Form, Table)
├── lib/                # Cliente de Supabase
├── pages/              # Pantallas principales (Dashboard, Login, Register)
├── schemas/            # Validaciones con Zod
├── stores/             # Zustand stores (authStore, taskStore, subtaskStore)
├── utils/              # Funciones auxiliares (token, sorters, SJF)
```

## 📦 Build para producción

```bash
npm run build
```

Los archivos optimizados se generarán en la carpeta `dist/`.

## ✅ Backend asociado

Este frontend se conecta con el backend disponible en:

🔗 [torrefactora-api](https://github.com/migueldeveloper91/torrefactora-api)

## ✍️ Autor

Desarrollado por [Miguel Rojas](mailto:miguel.rojas1991@gmail.com)

---
