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

export default function RegisterPage() {
	const { register, loading, error } = useAuth();
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		register(name, email, password);
	};

	return (
		<Box
			sx={{
				minHeight: "100vh",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				bgcolor: "grey.100",
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
					<Typography variant="h5" fontWeight={700} gutterBottom>
						Register
					</Typography>
					{error && (
						<Alert severity="error" sx={{ mb: 2 }}>
							{error}
						</Alert>
					)}
					<form onSubmit={handleSubmit}>
						<Stack spacing={2}>
							<TextField
								label="Name"
								fullWidth
								value={name}
								onChange={(e) => setName(e.target.value)}
								required
							/>
							<TextField
								label="Email"
								type="email"
								fullWidth
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								required
							/>
							<TextField
								label="Password"
								type="password"
								fullWidth
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								required
							/>
							<Button
								type="submit"
								variant="contained"
								color="primary"
								fullWidth
								disabled={loading}
							>
								{loading ? "Loading..." : "Register"}
							</Button>
							<Typography variant="body2" textAlign="center">
								Already have an account? <Link href="/login">Login</Link>
							</Typography>
						</Stack>
					</form>
				</CardContent>
			</Card>
		</Box>
	);
}
