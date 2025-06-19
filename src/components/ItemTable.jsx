import {
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

//  Mapeo de colores por nivel de prioridad
const priorityColors = {
  Urgente: "error",
  Normal: "warning",
  Bajo: "success",
};

//  Mapeo de colores por estado de la tarea
const stateColors = {
  Iniciada: "default",
  "En Proceso": "info",
  Terminada: "success",
};

/**
 * Componente reutilizable que muestra una tabla de tareas o subtareas.
 *
 * Muestra los campos: nombre, descripción, duración, prioridad y estado.
 * Puede utilizarse para representar tanto tareas principales como subtareas,
 * siempre que los objetos tengan los campos necesarios.
 *
 * @component
 * @param {Object} props
 * @param {Array} props.items - Lista de objetos a mostrar. Cada objeto debe contener:
 *   - id: string | number
 *   - name: string
 *   - description: string
 *   - duration: number
 *   - priority: string (ej. "Normal", "Urgente", "Bajo")
 *   - state: string (ej. "Iniciada", "En Proceso", "Terminada")
 * @param {Function} props.onItemClick - Función llamada al hacer clic en una fila (recibe el `item`).
 * @param {string} [props.title] - Título opcional que se muestra sobre la tabla.
 */
export default function ItemTable({
  items = [],
  onItemClick = () => {},
  title = "",
}) {
  return (
    <TableContainer component={Paper} sx={{ mt: 2 }}>
      {title && (
        <Typography variant="subtitle1" sx={{ p: 2 }}>
          {title}
        </Typography>
      )}
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>
              <strong>Nombre</strong>
            </TableCell>
            <TableCell>
              <strong>Descripción</strong>
            </TableCell>
            <TableCell>
              <strong>Duración</strong>
            </TableCell>
            <TableCell>
              <strong>Prioridad</strong>
            </TableCell>
            <TableCell>
              <strong>Estado</strong>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((item) => (
            <TableRow
              key={item.id}
              hover
              onClick={() => onItemClick(item)}
              sx={{ cursor: "pointer" }}
            >
              <TableCell>{item.name}</TableCell>
              <TableCell>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  noWrap
                  maxWidth={250}
                >
                  {item.description}
                </Typography>
              </TableCell>
              <TableCell>{item.duration} min</TableCell>
              <TableCell>
                <Chip
                  label={item.priority}
                  color={priorityColors[item.priority] || "default"}
                  size="small"
                />
              </TableCell>
              <TableCell>
                <Chip
                  label={item.state}
                  color={stateColors[item.state] || "default"}
                  size="small"
                />
              </TableCell>
            </TableRow>
          ))}

          {items.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} align="center">
                No hay elementos para mostrar.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
