import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
	palette: {
		mode: "light",
		primary: { main: "#7C3AED" }, // púrpura
		secondary: { main: "#00BCD4" }, // cyan
		success: { main: "#22C55E" },
	},
	shape: { borderRadius: 14 },
	typography: { fontFamily: "var(--font-inter, Inter, system-ui, Arial)" },
	components: {
		MuiButton: {
			styleOverrides: { root: { textTransform: "none", borderRadius: 999 } },
		},
		MuiCard: { styleOverrides: { root: { borderRadius: 18 } } },
	},
});
