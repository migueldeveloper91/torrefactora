import { z } from "zod";

export const taskSchema = z.object({
  name: z.string().min(3, "Nombre requerido"),
  description: z.string().optional(),
  duration: z.number().positive("Debe ser mayor que cero"),
  priority_id: z.string().min(1, "Selecciona prioridad"),
  state_id: z.string().min(1, "Selecciona estado"),
});
