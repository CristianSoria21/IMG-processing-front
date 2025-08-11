import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
	palette: {
		mode: "dark",
		primary: { main: "#8B5CF6" }, // violet 500
		secondary: { main: "#22D3EE" }, // cyan 300
		success: { main: "#10B981" }, // emerald
		warning: { main: "#F59E0B" }, // amber
		error: { main: "#F43F5E" }, // rose
		info: { main: "#38BDF8" }, // sky
		background: {
			default: "#0B1220", // fondo app
			paper: "#0F172A", // superficies
		},
		text: {
			primary: "#E5E7EB",
			secondary: "#94A3B8",
		},
		divider: "rgba(148,163,184,0.20)",
	},
	shape: { borderRadius: 14 },
	typography: { fontFamily: "var(--font-inter, Inter, system-ui, Arial)" },
	components: {
		MuiCssBaseline: {
			styleOverrides: {
				body: {
					backgroundImage:
						"radial-gradient(1000px 600px at 20% 10%, rgba(139,92,246,.08), transparent)," +
						"radial-gradient(800px 500px at 80% 0%, rgba(34,211,238,.08), transparent)",
				},
			},
		},
		MuiButton: {
			styleOverrides: {
				root: { textTransform: "none", borderRadius: 999, fontWeight: 600 },
			},
		},
		MuiAppBar: {
			styleOverrides: {
				colorPrimary: { backgroundColor: "#0B1220" }, // header acorde al fondo
			},
		},
		MuiCard: {
			styleOverrides: {
				root: {
					borderRadius: 18,
					backgroundImage: "none",
					backgroundColor: "#111827",
					border: "1px solid rgba(148,163,184,0.12)",
				},
			},
		},
		MuiPaper: { styleOverrides: { root: { backgroundImage: "none" } } },
	},
});
