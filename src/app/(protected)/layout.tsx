"use client";
import { ReactNode, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthContext } from "@/context/AuthContext";
import { Stack, CircularProgress } from "@mui/material";

export default function ProtectedLayout({ children }: { children: ReactNode }) {
	const { isAuthenticated } = useAuthContext();
	const router = useRouter();
	const pathname = usePathname();
	const [checking, setChecking] = useState(true);

	useEffect(() => {
		// Evitar parpadeos: verificamos en cliente y redirigimos si no hay sesión
		if (!isAuthenticated) {
			router.replace(`/login?next=${encodeURIComponent(pathname)}`);
		} else {
			setChecking(false);
		}
	}, [isAuthenticated, pathname, router]);

	if (!isAuthenticated || checking) {
		return (
			<Stack
				alignItems="center"
				justifyContent="center"
				sx={{ minHeight: "60vh" }}
			>
				<CircularProgress />
			</Stack>
		);
	}

	return <>{children}</>;
}
