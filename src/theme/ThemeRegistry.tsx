"use client";

import * as React from "react";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { theme } from "@/theme/theme";

/**
 * Client-only wrapper for MUI theme & emotion cache.
 * Avoids passing the theme (which has functions) across the server boundary.
 */
export default function ThemeRegistry({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<AppRouterCacheProvider>
			<ThemeProvider theme={theme}>
				<CssBaseline />
				{children}
			</ThemeProvider>
		</AppRouterCacheProvider>
	);
}
