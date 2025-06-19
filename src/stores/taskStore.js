/**
 * Zustand store para manejar el estado global de las tareas.
 * Proporciona funciones para cargar, crear, actualizar y eliminar tareas usando la API.
 */

import { create } from "zustand";
import {
  createTask,
  deleteTask,
  fetchAllTasks,
  updateTask,
} from "../api/tasks";

/**
 * @typedef {Object} Task
 * @property {string} id - ID único de la tarea
 * @property {string} name - Nombre de la tarea
 * @property {string} description - Descripción de la tarea
 * @property {number} duration - Duración en minutos
 * @property {string} priority_id - ID de prioridad
 * @property {string} state_id - ID de estado
 */

/**
 * Zustand store para tareas
 *
 * @typedef {Object} TaskStore
 * @property {Task[]} tasks - Lista de tareas cargadas
 * @property {boolean} loading - Estado de carga
 * @property {(taskData: Object) => Promise<Task>} addTask - Crea una nueva tarea
 * @property {(id: string, data: Object) => Promise<Task>} updateTask - Actualiza una tarea existente
 * @property {(id: string) => Promise<void>} deleteTask - Elimina una tarea por ID
 * @property {() => Promise<void>} fetchTasks - Carga todas las tareas del usuario
 */
export const useTaskStore = create((set, get) => ({
  /** Lista de tareas cargadas desde la API */
  tasks: [],

  /** Bandera de carga */
  loading: false,

  /**
   * Cargar todas las tareas desde la API
   */
  fetchTasks: async () => {
    set({ loading: true });
    try {
      const data = await fetchAllTasks();
      set({ tasks: data });
    } catch (err) {
      console.error("Error al cargar tareas:", err.message);
    } finally {
      set({ loading: false });
    }
  },

  /**
   * Crear una nueva tarea
   * @param {Object} taskData - Datos de la tarea a crear
   * @returns {Promise<Task>}
   */
  addTask: async (taskData) => {
    try {
      const newTask = await createTask(taskData);
      set({ tasks: [newTask, ...get().tasks] });
      return newTask;
    } catch (err) {
      console.error("Error al agregar tarea:", err.message);
      throw err;
    }
  },

  /**
   * Actualizar una tarea existente
   * @param {string} id - ID de la tarea a actualizar
   * @param {Object} taskData - Datos nuevos
   * @returns {Promise<Task>}
   */
  updateTask: async (id, taskData) => {
    try {
      const updatedTask = await updateTask(id, taskData);
      set({
        tasks: get().tasks.map((t) => (t.id === id ? updatedTask : t)),
      });
      return updatedTask;
    } catch (err) {
      console.error("Error al actualizar tarea:", err.message);
      throw err;
    }
  },

  /**
   * Eliminar una tarea por su ID
   * @param {string} id - ID de la tarea a eliminar
   */
  deleteTask: async (id) => {
    try {
      await deleteTask(id);
      set({ tasks: get().tasks.filter((t) => t.id !== id) });
    } catch (err) {
      console.error("Error al eliminar tarea:", err.message);
      throw err;
    }
  },
}));
