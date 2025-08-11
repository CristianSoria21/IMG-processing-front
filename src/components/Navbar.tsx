"use client";
import {
	AppBar,
	Toolbar,
	Typography,
	Box,
	Container,
	IconButton,
} from "@mui/material";
import ImageIcon from "@mui/icons-material/Image";
import LogoutIcon from "@mui/icons-material/Logout";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/context/AuthContext";
import { useState } from "react";

export function Navbar({ children }: { children: React.ReactNode }) {
	const router = useRouter();
	const { user, logout } = useAuthContext();
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const open = Boolean(anchorEl);

	const handleClose = () => {
		setAnchorEl(null);
	};

	return (
		<Box>
			<AppBar position="sticky" elevation={0}>
				<Toolbar>
					<ImageIcon sx={{ mr: 1 }} />
					<Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700 }}>
						Procesamiento de imagenes
					</Typography>

					<Box display="flex" alignItems="center">
						<Box textAlign="right" mr={1}>
							<Typography variant="subtitle1" fontWeight={700}>
								{user?.name ?? "Usuario"}
							</Typography>
							<Typography variant="caption" color="text.secondary">
								{user?.email ?? ""}
							</Typography>
						</Box>
						<IconButton
							size="large"
							edge="end"
							color="inherit"
							onClick={() => {
								handleClose();
								logout();
								router.replace("/login");
							}}
							aria-controls={open ? "user-menu" : undefined}
							aria-haspopup="true"
							aria-expanded={open ? "true" : undefined}
						>
							<LogoutIcon />
						</IconButton>
					</Box>
				</Toolbar>
			</AppBar>

			<Container sx={{ py: 4 }}>{children}</Container>
		</Box>
	);
}
