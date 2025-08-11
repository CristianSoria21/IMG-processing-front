"use client";
import {
	AppBar,
	Toolbar,
	Typography,
	Box,
	Container,
	Button,
} from "@mui/material";
import ImageIcon from "@mui/icons-material/Image";

export function AppShell({ children }: { children: React.ReactNode }) {
	return (
		<Box>
			<AppBar position="sticky" elevation={0}>
				<Toolbar>
					<ImageIcon sx={{ mr: 1 }} />
					<Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700 }}>
						Img Processing
					</Typography>
					<Button variant="contained" color="secondary">
						Login
					</Button>
				</Toolbar>
			</AppBar>
			<Container sx={{ py: 4 }}>{children}</Container>
		</Box>
	);
}
