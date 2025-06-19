/**
 * Componente modal para crear o editar una Tarea.
 * Si está en modo edición (`taskToEdit`), también permite ver, crear, editar y eliminar subtareas asociadas.
 */

import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useSubtaskStore } from "../stores/subtaskStore";
import { useTaskStore } from "../stores/taskStore";
import { getSJFTasks } from "../utils/sorters";
import ConfirmDeleteDialog from "./ConfirmDeleteDialog";
import ItemTable from "./ItemTable";
import NewSubtaskModal from "./NewSubtaskModal";
import NewTaskForm from "./NewTaskForm";

/**
 * @param {Object} props
 * @param {boolean} props.open - Controla si el modal está abierto.
 * @param {Function} props.onClose - Función que cierra el modal principal.
 * @param {Function} props.onTaskCreated - Callback tras crear o actualizar la tarea.
 * @param {Object|null} props.taskToEdit - Si se pasa, activa el modo edición.
 */
export default function NewTaskModal({
  open,
  onClose,
  onTaskCreated,
  taskToEdit,
}) {
  const isEditing = Boolean(taskToEdit);
  const deleteTask = useTaskStore((state) => state.deleteTask);
  const { subtasks, fetchSubtasks } = useSubtaskStore();

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [subtaskModalOpen, setSubtaskModalOpen] = useState(false);
  const [subtaskToEdit, setSubtaskToEdit] = useState(null);

  // Cargar subtareas si se está editando una tarea
  useEffect(() => {
    if (isEditing && taskToEdit?.id) {
      fetchSubtasks(taskToEdit.id);
    }
  }, [isEditing, taskToEdit]);

  /**
   * Elimina la tarea actual
   */
  const handleDelete = async () => {
    if (!taskToEdit) return;
    try {
      await deleteTask(taskToEdit.id);
    } catch (err) {
      console.error("Error al eliminar tarea:", err.message);
    } finally {
      setConfirmOpen(false);
      onClose();
    }
  };

  /**
   * Al guardar o editar una subtarea, recargar la lista y cerrar el submodal
   */
  const handleSubtaskSaved = () => {
    fetchSubtasks(taskToEdit.id);
    setSubtaskToEdit(null);
    setSubtaskModalOpen(false);
  };

  /**
   * Abre el modal para crear nueva subtarea
   */
  const openCreateSubtask = () => {
    setSubtaskToEdit(null);
    setSubtaskModalOpen(true);
  };

  /**
   * Abre el modal para editar una subtarea existente
   * @param {Object} subtask
   */
  const openEditSubtask = (subtask) => {
    setSubtaskToEdit(subtask);
    setSubtaskModalOpen(true);
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
        <DialogTitle>
          {isEditing ? "Editar Tarea" : "Nueva Tarea"}
          <IconButton
            aria-label="cerrar"
            onClick={onClose}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          {/* Formulario para crear/editar tarea */}
          <NewTaskForm
            taskToEdit={taskToEdit}
            onTaskCreated={() => {
              onTaskCreated?.();
              if (!isEditing) onClose(); // Si es nueva, cerrar tras crear
            }}
          />

          {/* Subtareas si estamos editando */}
          {isEditing && (
            <Box mt={4}>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography variant="subtitle1">Subtareas</Typography>
                <Button variant="outlined" onClick={openCreateSubtask}>
                  Agregar subtarea
                </Button>
              </Stack>

              {/* Tabla de subtareas usando orden SJF */}
              <ItemTable
                items={getSJFTasks(subtasks)}
                onItemClick={openEditSubtask}
              />
            </Box>
          )}
        </DialogContent>

        <DialogActions sx={{ justifyContent: "space-between" }}>
          {isEditing && (
            <Button color="error" onClick={() => setConfirmOpen(true)}>
              Eliminar tarea
            </Button>
          )}
          <Button onClick={onClose} color="secondary">
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal para crear o editar subtarea */}
      <NewSubtaskModal
        open={subtaskModalOpen}
        onClose={() => setSubtaskModalOpen(false)}
        parentTaskId={taskToEdit?.id}
        subtaskToEdit={subtaskToEdit}
        onSubtaskSaved={handleSubtaskSaved}
      />

      {/* Confirmación de borrado */}
      <ConfirmDeleteDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleDelete}
        taskName={taskToEdit?.name}
      />
    </>
  );
}
