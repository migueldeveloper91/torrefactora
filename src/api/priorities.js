// src/api/priorities.js

/**
 * Módulo para manejar las peticiones relacionadas con las prioridades.
 * Este archivo contiene funciones que interactúan con la API REST del backend
 * para obtener los datos de prioridades (Ej: Urgente, Normal, Bajo).
 */

import { getToken } from "./utils";

// URL base del endpoint de prioridades
const BASE_URL = "http://localhost:3000/priorities";

/**
 * Obtiene la lista de prioridades disponibles desde el backend.
 *
 * Requiere un token JWT válido para la autenticación.
 *
 * @returns {Promise} Una promesa que resuelve con el array de prioridades.
 *
 */
export async function fetchPriorities() {
  // Obtener el token JWT del usuario autenticado
  const token = await getToken();

  // Realizar la petición HTTP al endpoint protegido
  const res = await fetch(BASE_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  // Manejo de errores si la respuesta no es exitosa
  if (!res.ok) throw new Error("Error al obtener prioridades");

  // Devolver el cuerpo de la respuesta como JSON
  return res.json();
}

export async function getPriorityNameById(id) {
  const all = await fetchPriorities();
  return all.find((p) => p.id === id)?.name || "";
}
