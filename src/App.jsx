import { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { supabase } from "./lib/supabaseClient";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import RequireAuth from "./routes/RequireAuth";
import { useAuthStore } from "./stores/authStore";

export default function App() {
  const { user, setUser, isLoading } = useAuthStore();

  // Restaurar sesión al refrescar la app
  useEffect(() => {
    const restoreSession = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.error("Error al retomar sesión:", error.message);
        return;
      }
      if (data?.user) setUser(data.user);
    };
    restoreSession();
  }, [setUser]);

  // Escuchar cambios de sesión en tiempo real (login/logout)
  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user || null);
      }
    );

    return () => {
      listener.subscription.unsubscribe(); //  limpiar listener al desmontar
    };
  }, [setUser]);
  if (isLoading) return <p>Cargando sesión...</p>;
  return (
    <Routes>
      {/* Redirige según login */}
      <Route
        path="/"
        element={<Navigate to={user ? "/dashboard" : "/login"} />}
      />

      {/* Público */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protegido: solo si hay sesión */}
      <Route
        path="/dashboard"
        element={
          <RequireAuth>
            <Dashboard />
          </RequireAuth>
        }
      />

      {/* Ruta 404 */}
      <Route path="*" element={<p>404 - Página no encontrada</p>} />
    </Routes>
  );
}
