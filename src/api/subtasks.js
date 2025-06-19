// src/api/subtasks.js

/**
 * Módulo para manejar la API de subtareas.
 * Proporciona funciones para crear, obtener, actualizar y eliminar subtareas
 * asociadas a tareas específicas. Utiliza autenticación con Supabase.
 */

import { supabase } from "../lib/supabaseClient";

// URL base del endpoint para subtareas
const API_URL = "http://localhost:3000/subtasks";

/**
 * Obtiene el token de sesión actual del usuario autenticado con Supabase.
 *
 * @returns {Promise<string>} Token JWT de la sesión actual
 */
async function getSessionToken() {
  const { data } = await supabase.auth.getSession();
  return data.session?.access_token;
}

/**
 * Obtiene las subtareas asociadas a una tarea específica.
 *
 * @param {string} taskId - ID de la tarea principal
 * @returns {Promise} Array de subtareas
 *
 */
export async function fetchSubtasksByTask(taskId) {
  const token = await getSessionToken();

  const res = await fetch(`${API_URL}/${taskId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Error al cargar subtareas");
  return await res.json();
}

/**
 * Crea una nueva subtarea en el backend.
 *
 * @param {Object} subtaskData - Datos de la nueva subtarea
 * @returns {Promise} Subtarea creada

 */
export async function createSubtask(subtaskData) {
  const token = await getSessionToken();

  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(subtaskData),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Error al crear subtarea");
  }

  return await res.json();
}

/**
 * Actualiza una subtarea existente.
 *
 * @param {string} id - ID de la subtarea a actualizar
 * @param {Object} data - Datos actualizados de la subtarea
 * @returns {Promise} Subtarea actualizada
 *
 */
export async function updateSubtask(id, data) {
  const token = await getSessionToken();

  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Error al actualizar subtarea");
  }

  return await res.json();
}

/**
 * elimina una subtarea del sistema.
 *
 * @param {string} id - ID de la subtarea a eliminar
 * @returns {Promise}
 *
 */
export async function deleteSubtask(id) {
  const token = await getSessionToken();

  const res = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Error al eliminar subtarea");
  }
}
