/**
 * Obtiene el token de acceso (JWT) del usuario autenticado a través de Supabase.
 *
 * Este token es necesario para autenticar las solicitudes al backend protegido
 * con middleware basado en Supabase Auth.
 *
 * @returns {Promise<string|null>} Token JWT actual del usuario, o `null` si no hay sesión activa.
 */
import { supabase } from "../lib/supabaseClient";

export async function getToken() {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  console.log(session?.access_token);

  return session?.access_token;
}
