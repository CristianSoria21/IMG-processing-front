"use client";
import {
	Card,
	CardContent,
	CardActions,
	Button,
	Typography,
	Stack,
	Chip,
	Box,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	IconButton,
	Tooltip,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import type { ImageItem } from "@/types";
import { useState } from "react";

type Props = {
	item: ImageItem;
	onEdit?: (id: number) => void;
	onDelete?: (id: number) => void;
};

export function ImageCard({ item, onEdit, onDelete }: Props) {
	const hasProcessed = !!item.processedUrl;
	const date = new Date(item.createdAt).toLocaleString();
	const [viewer, setViewer] = useState<{
		open: boolean;
		url: string;
		title: string;
	}>({ open: false, url: "", title: "" });

	const openViewer = (url: string, title: string) =>
		setViewer({ open: true, url, title });
	const closeViewer = () => setViewer({ open: false, url: "", title: "" });

	return (
		<>
			<Card
				sx={{
					width: "100%",
					maxWidth: 920, // hace el card “un poco más ancho”
					mx: "auto",
					borderRadius: 2.5,
					overflow: "hidden",
				}}
			>
				{/* Header con imágenes (click para abrir visor) */}
				<Box
					sx={{
						display: "grid",
						gridTemplateColumns: hasProcessed ? "1fr 1fr" : "1fr",
					}}
				>
					<Box sx={{ position: "relative" }}>
						<img
							src={item.originalUrl}
							alt={`original-${item.id}`}
							onClick={() => openViewer(item.originalUrl, "Original")}
							style={{
								width: "100%",
								height: 220,
								objectFit: "cover",
								cursor: "zoom-in",
								display: "block",
							}}
						/>
						<Chip
							label="Original"
							size="small"
							sx={{
								position: "absolute",
								top: 8,
								left: 8,
								bgcolor: "rgba(0,0,0,.5)",
							}}
						/>
					</Box>

					{hasProcessed && (
						<Box sx={{ position: "relative" }}>
							<img
								src={item.processedUrl!}
								alt={`processed-${item.id}`}
								onClick={() => openViewer(item.processedUrl!, "Processed")}
								style={{
									width: "100%",
									height: 220,
									objectFit: "cover",
									cursor: "zoom-in",
									display: "block",
								}}
							/>
							<Chip
								color="success"
								label="Processed"
								size="small"
								sx={{ position: "absolute", top: 8, left: 8 }}
							/>
						</Box>
					)}
				</Box>

				{/* Meta */}
				<CardContent sx={{ pb: 1.5 }}>
					<Stack
						direction="row"
						alignItems="center"
						justifyContent="space-between"
					>
						<Typography variant="subtitle1" fontWeight={700}>
							#{item.id}
						</Typography>
						<Typography variant="caption" color="text.secondary">
							{date}
						</Typography>
					</Stack>
				</CardContent>

				{/* Acciones: Edit / Delete */}
				<CardActions
					sx={{ px: 2, pb: 2, pt: 1, justifyContent: "flex-end", gap: 1 }}
				>
					<Button
						size="small"
						variant="outlined"
						startIcon={<EditIcon />}
						onClick={() => onEdit?.(item.id)}
					>
						Edit
					</Button>
					<Button
						size="small"
						variant="outlined"
						color="error"
						startIcon={<DeleteIcon />}
						onClick={() => onDelete?.(item.id)}
					>
						Delete
					</Button>
				</CardActions>
			</Card>

			{/* Viewer dialog GRANDE y FIJO */}
			<Dialog
				open={viewer.open}
				onClose={closeViewer}
				maxWidth={false} // desactiva maxWidth por defecto
				PaperProps={{
					sx: {
						width: 1000, // ancho fijo
						height: 680, // alto fijo
						m: 2,
						display: "flex",
					},
				}}
			>
				<DialogTitle
					sx={{
						display: "flex",
						alignItems: "center",
						justifyContent: "space-between",
					}}
				>
					{viewer.title}
					<Tooltip title="Close">
						<IconButton onClick={closeViewer}>
							<CloseIcon />
						</IconButton>
					</Tooltip>
				</DialogTitle>

				<DialogContent
					dividers
					sx={{
						p: 0,
						flex: 1,
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						bgcolor: "background.default",
					}}
				>
					{/* Contenedor fijo que no cambia de tamaño */}
					<Box
						sx={{
							width: "100%",
							height: "100%",
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
						}}
					>
						{viewer.url && (
							<img
								src={viewer.url}
								alt={viewer.title}
								style={{
									maxWidth: "100%",
									maxHeight: "100%",
									objectFit: "contain", // mantiene proporción dentro del cuadro fijo
									display: "block",
								}}
							/>
						)}
					</Box>
				</DialogContent>
			</Dialog>
		</>
	);
}
