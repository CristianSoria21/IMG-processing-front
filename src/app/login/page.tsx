"use client";
import { useState } from "react";
import {
	Box,
	Button,
	Card,
	CardContent,
	TextField,
	Typography,
	Alert,
	Stack,
} from "@mui/material";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";

export default function LoginPage() {
	const { login, loading, error } = useAuth();
	const [form, setForm] = useState({ email: "", password: "" });

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		login(form);
	};

	return (
		<Box
			sx={{
				minHeight: "100vh",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
			}}
		>
			<Card
				sx={{
					maxWidth: 400,
					width: "100%",
					p: 2,
					borderRadius: 4,
					boxShadow: 3,
				}}
			>
				<CardContent>
					<Typography variant="h5" fontWeight={700} gutterBottom mb={2}>
						Inicio de Sesión
					</Typography>
					{error && (
						<Alert severity="error" sx={{ mb: 2 }}>
							{error}
						</Alert>
					)}
					<form onSubmit={handleSubmit}>
						<Stack spacing={2}>
							<TextField
								label="Correo"
								type="email"
								fullWidth
								value={form.email}
								onChange={(e) =>
									setForm((f) => ({ ...f, email: e.target.value }))
								}
								required
							/>
							<TextField
								label="Contraseña"
								type="password"
								fullWidth
								value={form.password}
								onChange={(e) =>
									setForm((f) => ({ ...f, password: e.target.value }))
								}
								required
							/>
							<Button
								type="submit"
								variant="contained"
								color="primary"
								fullWidth
								disabled={loading}
							>
								{loading ? "Cargando..." : "Iniciar Sesíon"}
							</Button>
							<Typography variant="body2" textAlign="center">
								No tienes una cuenta?{" "}
								<Link
									href="/register"
									style={{
										color: "#8B5CF6",
										fontWeight: 700,
									}}
								>
									Registro
								</Link>
							</Typography>
						</Stack>
					</form>
				</CardContent>
			</Card>
		</Box>
	);
}
