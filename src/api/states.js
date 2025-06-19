// src/api/states.js

/**
 * Módulo para manejar las peticiones relacionadas con los estados de las tareas.
 * Este archivo proporciona funciones para interactuar con el backend y obtener
 * la lista de estados disponibles (Ej: Iniciada, En Proceso, Terminada).
 */

import { getToken } from "./utils";

// URL base del endpoint de estados
const BASE_URL = "http://localhost:3000/states";

/**
 * Obtiene la lista de estados de tareas desde el backend.
 *
 * Requiere un token JWT válido para autenticación.
 *
 * @returns {Promise} Una promesa que resuelve con un array de estados.
 *
 */
export async function fetchStates() {
  // Obtener token JWT del usuario autenticado
  const token = await getToken();

  // Realizar la petición HTTP al backend
  const res = await fetch(BASE_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  // Manejar error si la respuesta no fue exitosa
  if (!res.ok) throw new Error("Error al obtener estados");

  // Retornar la respuesta como JSON
  return res.json();
}

export async function getStateNameById(id) {
  const all = await fetchStates();
  return all.find((s) => s.id === id)?.name || "";
}
