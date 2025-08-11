"use client";
import { ReactNode, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthContext } from "@/context/AuthContext";
import { Stack, CircularProgress } from "@mui/material";

export default function ProtectedLayout({ children }: { children: ReactNode }) {
	const { isAuthenticated, isReady } = useAuthContext();
	const router = useRouter();
	const pathname = usePathname();

	useEffect(() => {
		if (!isReady) return;
		if (!isAuthenticated) {
			router.replace(`/login?next=${encodeURIComponent(pathname)}`);
		}
	}, [isAuthenticated, isReady, pathname, router]);

	if (!isReady) {
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

	if (!isAuthenticated) return null;

	return <>{children}</>;
}
