import CloseIcon from "@mui/icons-material/Close";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
} from "@mui/material";
import { useState } from "react";
import { useSubtaskStore } from "../stores/subtaskStore";
import ConfirmDeleteDialog from "./ConfirmDeleteDialog";
import NewTaskForm from "./NewTaskForm";

/**
 * Modal para crear o editar una subtarea.
 * Este componente reutiliza el formulario `NewTaskForm`, pasándole el `parentTaskId`
 * para indicar que se está creando/editando una subtarea en lugar de una tarea principal.
 *
 * @component
 * @param {Object} props
 * @param {boolean} props.open - Si el modal está abierto o no.
 * @param {Function} props.onClose - Función que se ejecuta al cerrar el modal.
 * @param {string} props.parentTaskId - ID de la tarea a la cual pertenece la subtarea.
 * @param {Object} [props.subtaskToEdit] - Objeto con los datos de la subtarea a editar (si aplica).
 * @param {Function} [props.onSubtaskSaved] - Callback que se ejecuta al guardar o eliminar una subtarea.
 */
export default function NewSubtaskModal({
  open,
  onClose,
  parentTaskId,
  subtaskToEdit = null,
  onSubtaskSaved = () => {},
}) {
  const isEditing = !!subtaskToEdit;
  const deleteSubtask = useSubtaskStore((state) => state.deleteSubtask);
  const [confirmOpen, setConfirmOpen] = useState(false);

  /**
   * Maneja la eliminación de la subtarea actual (si existe).
   */
  const handleDelete = async () => {
    if (!subtaskToEdit) return;

    try {
      await deleteSubtask(subtaskToEdit.id);
      onSubtaskSaved();
      onClose();
    } catch (err) {
      console.error("Error al eliminar subtarea:", err.message);
    } finally {
      setConfirmOpen(false);
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
        <DialogTitle>
          {isEditing ? "Editar Subtarea" : "Nueva Subtarea"}
          <IconButton
            aria-label="cerrar"
            onClick={onClose}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          <NewTaskForm
            parentTaskId={parentTaskId}
            taskToEdit={subtaskToEdit}
            onTaskCreated={() => {
              onSubtaskSaved();
              onClose();
            }}
          />
        </DialogContent>

        <DialogActions sx={{ justifyContent: "space-between" }}>
          {isEditing && (
            <Button color="error" onClick={() => setConfirmOpen(true)}>
              Eliminar subtarea
            </Button>
          )}
          <Button onClick={onClose} color="secondary">
            Cancelar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo de confirmación para eliminar subtarea */}
      <ConfirmDeleteDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleDelete}
        taskName={subtaskToEdit?.name}
      />
    </>
  );
}
