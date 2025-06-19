import {
  Box,
  Chip,
  MenuItem,
  Paper,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { useMemo, useState } from "react";

// Colores por prioridad
const priorityColors = {
  Urgente: "error",
  Normal: "warning",
  Bajo: "success",
};

// Colores por estado
const stateColors = {
  Iniciada: "default",
  "En Proceso": "info",
  Terminada: "success",
};

/**
 * ItemTable
 * Componente reutilizable para mostrar una tabla de elementos (tareas o subtareas).
 *
 * Funcionalidades:
 * - Búsqueda por nombre
 * - Filtro por prioridad
 * - Filtro por estado
 * - Paginación configurable
 *
 * Props esperadas:
 * @param {Array} items - Lista de objetos a mostrar. Cada objeto debe tener:
 *   - id: identificador único
 *   - name: nombre del ítem
 *   - description: descripción
 *   - duration: duración en minutos
 *   - priority: prioridad textual (Urgente, Normal, Bajo)
 *   - state: estado textual (Iniciada, En Proceso, Terminada)
 * @param {Function} onItemClick - Función llamada al hacer clic en una fila (recibe el item completo).
 * @param {string} [title] - Título opcional que se muestra encima de la tabla.
 */
export default function ItemTable({
  items = [],
  onItemClick = () => {},
  title = "",
}) {
  // Estados internos para filtros y paginación
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [stateFilter, setStateFilter] = useState("");

  // Filtrar los datos según búsqueda y filtros
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch = item.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesPriority =
        priorityFilter === "" || item.priority === priorityFilter;
      const matchesState = stateFilter === "" || item.state === stateFilter;
      return matchesSearch && matchesPriority && matchesState;
    });
  }, [items, searchTerm, priorityFilter, stateFilter]);

  // Datos paginados
  const paginatedItems = useMemo(() => {
    const start = page * rowsPerPage;
    return filteredItems.slice(start, start + rowsPerPage);
  }, [filteredItems, page, rowsPerPage]);

  return (
    <Paper sx={{ mt: 2 }}>
      {/* Título y filtros */}
      <Box p={2}>
        {title && (
          <Typography variant="subtitle1" gutterBottom>
            {title}
          </Typography>
        )}

        <Stack direction="row" spacing={2} mb={2} flexWrap="wrap">
          {/* Filtro por nombre */}
          <TextField
            label="Buscar por nombre"
            size="small"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(0); // Reiniciar página al buscar
            }}
          />

          {/* Filtro por prioridad */}
          <Select
            size="small"
            displayEmpty
            value={priorityFilter}
            onChange={(e) => {
              setPriorityFilter(e.target.value);
              setPage(0);
            }}
          >
            <MenuItem value="">Todas las prioridades</MenuItem>
            <MenuItem value="Urgente">Urgente</MenuItem>
            <MenuItem value="Normal">Normal</MenuItem>
            <MenuItem value="Bajo">Bajo</MenuItem>
          </Select>

          {/* Filtro por estado */}
          <Select
            size="small"
            displayEmpty
            value={stateFilter}
            onChange={(e) => {
              setStateFilter(e.target.value);
              setPage(0);
            }}
          >
            <MenuItem value="">Todos los estados</MenuItem>
            <MenuItem value="Iniciada">Iniciada</MenuItem>
            <MenuItem value="En Proceso">En Proceso</MenuItem>
            <MenuItem value="Terminada">Terminada</MenuItem>
          </Select>
        </Stack>
      </Box>

      {/* Tabla */}
      <TableContainer>
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
            {paginatedItems.map((item) => (
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

            {paginatedItems.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No hay elementos para mostrar.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Paginación */}
      <TablePagination
        component="div"
        count={filteredItems.length}
        page={page}
        onPageChange={(_, newPage) => setPage(newPage)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(e) => {
          setRowsPerPage(parseInt(e.target.value, 10));
          setPage(0);
        }}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Paper>
  );
}
