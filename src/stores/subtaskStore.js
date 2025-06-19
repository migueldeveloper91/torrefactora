/**
 * Zustand store para manejar el estado global de las subtareas.
 * Incluye lógica para cargar, crear, actualizar y eliminar subtareas desde la API.
 */

import { create } from "zustand";
import {
  createSubtask,
  deleteSubtask,
  fetchSubtasksByTask,
  updateSubtask,
} from "../api/subtasks";

/**
 * Zustand store para subtareas
 *
 * @typedef {Object} SubtaskStore
 * @property {Subtask[]} subtasks - Lista de subtareas cargadas
 * @property {boolean} loading - Estado de carga
 * @property {(taskId: string) => Promise<void>} fetchSubtasks - Carga subtareas asociadas a una tarea
 * @property {(subtaskData: Object) => Promise<Subtask>} addSubtask - Crea una nueva subtarea
 * @property {(id: string, updatedData: Object) => Promise<Subtask>} updateSubtask - Actualiza una subtarea existente
 * @property {(id: string) => Promise<void>} deleteSubtask - Elimina una subtarea por su ID
 */
export const useSubtaskStore = create((set, get) => ({
  /** Lista de subtareas asociadas a una tarea */
  subtasks: [],

  /** Bandera de carga */
  loading: false,

  /**
   * Cargar subtareas asociadas a una tarea específica
   * @param {string} taskId - ID de la tarea padre
   */
  fetchSubtasks: async (taskId) => {
    set({ loading: true });
    try {
      const data = await fetchSubtasksByTask(taskId);
      set({ subtasks: data });
    } catch (err) {
      console.error("Error al cargar subtareas:", err.message);
    } finally {
      set({ loading: false });
    }
  },

  /**
   * Crear una nueva subtarea
   * @param {Object} subtaskData - Datos de la subtarea a crear
   * @returns {Promise<Subtask>}
   */
  addSubtask: async (subtaskData) => {
    try {
      const newSubtask = await createSubtask(subtaskData);
      set({ subtasks: [newSubtask, ...get().subtasks] });
      return newSubtask;
    } catch (err) {
      console.error("Error al agregar subtarea:", err.message);
      throw err;
    }
  },

  /**
   * Actualizar una subtarea existente
   * @param {string} id - ID de la subtarea a actualizar
   * @param {Object} updatedData - Nuevos datos para actualizar
   * @returns {Promise<Subtask>}
   */
  updateSubtask: async (id, updatedData) => {
    try {
      const updatedSubtask = await updateSubtask(id, updatedData);
      set({
        subtasks: get().subtasks.map((s) => (s.id === id ? updatedSubtask : s)),
      });
      return updatedSubtask;
    } catch (err) {
      console.error("Error al actualizar subtarea:", err.message);
      throw err;
    }
  },

  /**
   * Eliminar una subtarea
   * @param {string} id - ID de la subtarea a eliminar
   */
  deleteSubtask: async (id) => {
    try {
      await deleteSubtask(id);
      set({
        subtasks: get().subtasks.filter((s) => s.id !== id),
      });
    } catch (err) {
      console.error("Error al eliminar subtarea:", err.message);
      throw err;
    }
  },
}));
