/**
 * Zustand store para manejar la autenticación del usuario en el frontend.
 * Provee el usuario autenticado, un estado de carga inicial, y funciones
 * para establecer o limpiar el usuario globalmente.
 */

import { create } from "zustand";

/**
 * Estado global de autenticación usando Zustand.
 *
 * @typedef {Object} AuthStore
 * @property {Object|null} user - Objeto de usuario autenticado o null si no ha iniciado sesión.
 * @property {boolean} isLoading - Indica si se está cargando la sesión inicial.
 * @property {(user: object) => void} setUser - Establece el usuario y marca isLoading como false.
 * @property {() => void} clearUser - Limpia el usuario del store.
 */
export const useAuthStore = create((set) => ({
  /** Usuario autenticado */
  user: null,

  /** Bandera de carga mientras se valida sesión con Supabase */
  isLoading: true,

  /**
   * Establece el usuario autenticado y finaliza la carga inicial.
   * @param {object} user - Objeto de sesión devuelto por Supabase.
   */
  setUser: (user) => set({ user, isLoading: false }),

  /**
   * Limpia el estado del usuario (logout manual o expiración de sesión).
   */
  clearUser: () => set({ user: null }),
}));
