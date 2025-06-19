import {
  Alert,
  Avatar,
  Box,
  Button,
  Container,
  Link,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { Navigate, Link as RouterLink, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { authSchema } from "../schemas/authSchema";
import { useAuthStore } from "../stores/authStore";

export default function Login() {
  const { user, setUser } = useAuthStore();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");

  if (user) return <Navigate to="/dashboard" replace />;

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setErrors({});

    const result = authSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors = result.error.format();
      setErrors({
        email: fieldErrors.email?._errors[0],
        password: fieldErrors.password?._errors[0],
      });
      return;
    }

    const { data, error } = await supabase.auth.signInWithPassword(form);
    if (error) return setFormError(error.message);

    setUser(data.user);
    navigate("/dashboard");
  };

  return (
    <Container maxWidth="xs">
      <Paper elevation={3} sx={{ mt: 10, p: 4, borderRadius: 3 }}>
        <Box display="flex" flexDirection="column" alignItems="center">
          <Avatar
            src="/logo.png"
            sx={{ width: 72, height: 72, mb: 2 }}
            alt="Logo"
          />
          <Typography variant="h5" fontWeight="bold">
            Iniciar sesión
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Bienvenido de nuevo
          </Typography>
        </Box>

        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 3 }}>
          <Stack spacing={2}>
            {formError && <Alert severity="error">{formError}</Alert>}

            <TextField
              label="Correo electrónico"
              name="email"
              value={form.email}
              onChange={handleChange}
              fullWidth
              error={!!errors.email}
              helperText={errors.email}
            />

            <TextField
              label="Contraseña"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              fullWidth
              error={!!errors.password}
              helperText={errors.password}
            />

            <Button type="submit" variant="contained" fullWidth>
              Entrar
            </Button>
          </Stack>

          <Typography
            variant="body2"
            color="text.secondary"
            align="center"
            sx={{ mt: 3 }}
          >
            ¿No tienes cuenta?{" "}
            <Link component={RouterLink} to="/register">
              Regístrate
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}
