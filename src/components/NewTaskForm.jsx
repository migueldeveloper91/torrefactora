/**
 * Componente reutilizable de formulario para crear o editar Tareas y Subtareas.
 * Determina su comportamiento dinámicamente según si recibe una `taskToEdit`
 * (modo edición) y si recibe un `parentTaskId` (modo subtarea).
 */

import { Alert, Button, MenuItem, Stack, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { fetchPriorities } from "../api/priorities";
import { fetchStates } from "../api/states";
import { taskSchema } from "../schemas/taskSchema";
import { useSubtaskStore } from "../stores/subtaskStore";
import { useTaskStore } from "../stores/taskStore";

/**
 * @param {Object} props
 * @param {Function} [props.onTaskCreated] - Callback ejecutado después de guardar la tarea/subtarea.
 * @param {Object|null} [props.taskToEdit] - Objeto de tarea/subtarea a editar (modo edición).
 * @param {string|null} [props.parentTaskId] - ID de la tarea padre. Si se provee, se está creando/editando una subtarea.
 */
export default function NewTaskForm({
  onTaskCreated = () => {},
  taskToEdit = null,
  parentTaskId = null,
}) {
  const [form, setForm] = useState({
    name: "",
    description: "",
    duration: "",
    priority_id: "",
    state_id: "",
  });

  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [priorities, setPriorities] = useState([]);
  const [states, setStates] = useState([]);

  const { addTask, updateTask } = useTaskStore();
  const { addSubtask, updateSubtask } = useSubtaskStore();

  const isEditing = !!taskToEdit;

  // Cargar datos en modo edición y obtener opciones si es tarea principal
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [prioData, stateData] = await Promise.all([
          fetchPriorities(),
          fetchStates(),
        ]);
        setPriorities(prioData);
        setStates(stateData);
      } catch (err) {
        console.error("Error cargando opciones:", err.message);
      }
    };

    fetchOptions();

    if (isEditing) {
      setForm({
        name: taskToEdit.name || "",
        description: taskToEdit.description || "",
        duration: taskToEdit.duration?.toString() || "",
        priority_id: taskToEdit.priority_id || "",
        state_id: taskToEdit.state_id || "",
      });
    }
  }, [taskToEdit]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /**
   * Valida y guarda los datos del formulario según el modo (crear/editar, tarea/subtarea)
   * @param {React.FormEvent} e
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");
    setErrors({});

    const result = taskSchema.safeParse({
      ...form,
      duration: Number(form.duration),
    });

    if (!result.success) {
      const fieldErrors = result.error.format();
      setErrors({
        name: fieldErrors.name?._errors[0],
        description: fieldErrors.description?._errors[0],
        duration: fieldErrors.duration?._errors[0],
        priority_id: fieldErrors.priority_id?._errors[0],
        state_id: fieldErrors.state_id?._errors[0],
      });
      return;
    }

    const payload = {
      ...form,
      duration: Number(form.duration),
    };

    try {
      if (parentTaskId) {
        // Subtarea
        if (isEditing && taskToEdit) {
          await updateSubtask(taskToEdit.id, payload);
        } else {
          await addSubtask({ ...payload, task_id: parentTaskId });
        }
      } else {
        // Tarea
        if (isEditing && taskToEdit) {
          await updateTask(taskToEdit.id, payload);
        } else {
          await addTask(payload);
        }
      }

      if (!isEditing) {
        // Limpiar formulario tras crear
        setForm({
          name: "",
          description: "",
          duration: "",
          priority_id: "",
          state_id: "",
        });
      }

      onTaskCreated();
    } catch (err) {
      setApiError(err.message || "Error al guardar");
    }
  };

  return (
    <div>
      {apiError && <Alert severity="error">{apiError}</Alert>}

      <form onSubmit={handleSubmit}>
        <Stack spacing={2}>
          <TextField
            label="Nombre"
            name="name"
            value={form.name}
            onChange={handleChange}
            error={!!errors.name}
            helperText={errors.name}
            fullWidth
          />

          <TextField
            label="Descripción"
            name="description"
            value={form.description}
            onChange={handleChange}
            error={!!errors.description}
            helperText={errors.description}
            fullWidth
            multiline
          />

          <TextField
            label="Duración (min)"
            name="duration"
            type="number"
            value={form.duration}
            onChange={handleChange}
            error={!!errors.duration}
            helperText={errors.duration}
            fullWidth
          />

          <TextField
            label="Prioridad"
            name="priority_id"
            value={form.priority_id}
            onChange={handleChange}
            select
            error={!!errors.priority_id}
            helperText={errors.priority_id}
            fullWidth
          >
            {priorities.map((p) => (
              <MenuItem key={p.id} value={p.id}>
                {p.name}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="Estado"
            name="state_id"
            value={form.state_id}
            onChange={handleChange}
            select
            error={!!errors.state_id}
            helperText={errors.state_id}
            fullWidth
          >
            {states.map((s) => (
              <MenuItem key={s.id} value={s.id}>
                {s.name}
              </MenuItem>
            ))}
          </TextField>

          <Button type="submit" variant="contained">
            {isEditing ? "Actualizar" : "Crear"}
          </Button>
        </Stack>
      </form>
    </div>
  );
}
