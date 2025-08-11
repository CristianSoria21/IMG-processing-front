"use client";
import { Button } from "@mui/material";
import { useAuthContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export function LogoutButton() {
	const { logout } = useAuthContext();
	const router = useRouter();
	return (
		<Button
			variant="outlined"
			onClick={() => {
				logout();
				router.replace("/login");
			}}
		>
			Logout
		</Button>
	);
}
