/**
 * Componente Dashboard principal del sistema.
 * Permite visualizar las tareas del usuario autenticado, ordenadas por duración (SJF),
 * así como crear, editar o eliminar tareas y subtareas mediante modales.
 */

import {
  Box,
  Button,
  CircularProgress,
  Container,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import ItemTable from "../components/ItemTable";
import NewTaskModal from "../components/NewTaskModal";
import { supabase } from "../lib/supabaseClient";
import { useAuthStore } from "../stores/authStore";
import { useTaskStore } from "../stores/taskStore";
import { getSJFTasks } from "../utils/sorters";

/**
 * Dashboard principal del usuario logueado.
 * Renderiza:
 * - Bienvenida con email
 * - Botón para crear tareas
 * - Tabla de tareas ordenadas por el algoritmo SJF
 * - Modal para crear/editar tareas
 */
export default function Dashboard() {
  const { user, setUser } = useAuthStore(); // Obtener sesión de usuario
  const { tasks, fetchTasks, loading } = useTaskStore(); // Tareas desde el store

  const [modalOpen, setModalOpen] = useState(false); // Modal de tarea
  const [taskToEdit, setTaskToEdit] = useState(null); // Tarea seleccionada

  // Al cargar el componente, traer las tareas
  useEffect(() => {
    fetchTasks();
  }, []);

  // Cerrar sesión en Supabase
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ mt: 8, p: 4, borderRadius: 3 }}>
        <Stack spacing={2}>
          {/* Título */}
          <Typography variant="h5" fontWeight="bold" align="center">
            ¡Hola, {user?.email}!
          </Typography>

          {/* Acciones: crear tarea, cerrar sesión */}
          <Stack direction="row" spacing={2} justifyContent="space-between">
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                setTaskToEdit(null); // Nueva tarea
                setModalOpen(true);
              }}
            >
              Crear tarea
            </Button>
            <Button variant="outlined" color="error" onClick={handleLogout}>
              Cerrar sesión
            </Button>
          </Stack>

          {/* Tabla de tareas */}
          <Typography variant="h6" mt={2}>
            Tus tareas
          </Typography>

          {loading ? (
            <Box display="flex" justifyContent="center" mt={2}>
              <CircularProgress />
            </Box>
          ) : (
            <ItemTable
              items={getSJFTasks(tasks)} // Algoritmo SJF aplicado aquí
              onItemClick={(task) => {
                setTaskToEdit(task);
                setModalOpen(true);
              }}
              title="Tus tareas (ordenadas por SJF)"
            />
          )}
        </Stack>
      </Paper>

      {/* Modal para crear o editar tareas */}
      <NewTaskModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onTaskCreated={() => {
          setModalOpen(false);
          setTaskToEdit(null);
        }}
        taskToEdit={taskToEdit}
      />
    </Container>
  );
}
