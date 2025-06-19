// src/api/tasks.js

/**
 * Módulo para interactuar con el backend de tareas (tasks).
 * Incluye funciones para crear, obtener, actualizar y eliminar tareas
 * usando autenticación JWT obtenida desde Supabase.
 */

import { getToken } from "./utils";

// URL base del endpoint para tareas
const BASE_URL = "http://localhost:3000/tasks";

/**
 * Obtiene todas las tareas del usuario autenticado.
 *
 * @returns {Promise} Lista de tareas.
 
 */
export async function fetchAllTasks() {
  const token = await getToken();
  const res = await fetch(BASE_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) throw new Error("Error al obtener tareas");
  return res.json();
}

/**
 * Elimina una tarea por su ID.
 *
 * @param {string} id - ID de la tarea a eliminar.
 * @returns {Promise}
 *
 */
export async function deleteTask(id) {
  const token = await getToken();
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) throw new Error("Error al eliminar tarea");
}

/**
 * Crea una nueva tarea con los datos proporcionados.
 *
 * @param {Object} taskData - Objeto con los campos de la nueva tarea.
 * @returns {Promise} La tarea creada.
 *
 */
export async function createTask(taskData) {
  const token = await getToken();
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(taskData),
  });

  if (!res.ok) throw new Error("Error al crear tarea");
  return res.json();
}

/**
 * Actualiza una tarea existente.
 *
 * @param {string} id - ID de la tarea a actualizar.
 * @param {Object} taskData - Datos actualizados de la tarea.
 * @returns {Promise} La tarea actualizada.
 *
 */
export async function updateTask(id, taskData) {
  const token = await getToken();
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(taskData),
  });

  if (!res.ok) throw new Error("Error al actualizar tarea");
  return res.json();
}
