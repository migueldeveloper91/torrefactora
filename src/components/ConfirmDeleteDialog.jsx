import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

/**
 * Diálogo de confirmación para eliminar una tarea.
 *
 * Este componente se muestra como un modal cuando `open` es `true`. Informa al
 * usuario que eliminar la tarea es irreversible, y ofrece acciones para cancelar
 * o confirmar la eliminación.
 *
 * @component
 * @param {Object} props
 * @param {boolean} props.open - Si el diálogo debe mostrarse.
 * @param {Function} props.onClose - Función llamada al cancelar o cerrar el diálogo.
 * @param {Function} props.onConfirm - Función llamada al confirmar la eliminación.
 * @param {string} props.taskName - Nombre de la tarea que se está por eliminar.
 */
export default function ConfirmDeleteDialog({
  open,
  onClose,
  onConfirm,
  taskName,
}) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>¿Eliminar tarea?</DialogTitle>
      <DialogContent>
        <DialogContentText>
          ¿Estás seguro de que deseas eliminar la tarea{" "}
          <strong>{taskName}</strong>? Esta acción no se puede deshacer.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">
          Cancelar
        </Button>
        <Button onClick={onConfirm} color="error" variant="contained">
          Eliminar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
