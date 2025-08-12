"use client";
import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { ImageCard } from "@/components/ImageCard";
import { UploadDialog } from "@/app/(protected)/dashboard/UploadDialog";
import { EditImageDialog } from "./EditImageDialog";
import {
	Grid,
	Button,
	Stack,
	Snackbar,
	Alert,
	CircularProgress,
} from "@mui/material";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import { useImages } from "@/hooks/useImages";
import { useUpload } from "@/hooks/useUpload";
import type { ImageItem, Operation } from "@/types";

export default function DashboardPage() {
	const { items, loading, refetch, deleteImage, updateImage } = useImages();
	const { upload } = useUpload();
	const [openUpload, setOpenUpload] = useState(false);
	const [editOpen, setEditOpen] = useState(false);
	const [selected, setSelected] = useState<ImageItem | null>(null);
	const [busy, setBusy] = useState(false);
	const [toast, setToast] = useState<string | null>(null);

	const onDelete = async (id: number) => {
		try {
			await deleteImage(id);
			setToast("Imagen eliminada");
		} catch {
			setToast("No se pudo eliminar");
		}
	};

	const onEdit = (id: number) => {
		setSelected(items.find((i) => i.id === id) || null);
		setEditOpen(true);
	};

	const onEditSubmit = async (id: number, ops: Operation[]) => {
		try {
			setBusy(true);
			await updateImage(id, ops);
			setToast("Imagen actualizada");
		} catch {
			setToast("Error al actualizar");
		} finally {
			setBusy(false);
			setEditOpen(false);
			setSelected(null);
		}
	};

	return (
		<Navbar>
			<Stack direction="row" sx={{ mb: 3 }}>
				<Button
					startIcon={<AddPhotoAlternateIcon />}
					variant="contained"
					onClick={() => setOpenUpload(true)}
				>
					Subir
				</Button>
			</Stack>

			{loading ? (
				<Stack alignItems="center" sx={{ py: 10 }}>
					<CircularProgress />
				</Stack>
			) : (
				<Grid container spacing={2}>
					{items.map((it) => (
						<Grid key={it.id} size={{ xl: 12, sm: 6, md: 4 }}>
							<ImageCard item={it} onDelete={onDelete} onEdit={onEdit} />
						</Grid>
					))}
				</Grid>
			)}

			<UploadDialog
				open={openUpload}
				onClose={() => setOpenUpload(false)}
				onSubmit={async ({ file, operations }) => {
					await upload(file, operations);
					setOpenUpload(false);
					setToast("Subida iniciada");
					await refetch();
				}}
			/>

			<EditImageDialog
				open={editOpen}
				item={selected}
				loading={busy}
				onClose={() => {
					setEditOpen(false);
					setSelected(null);
				}}
				onSubmit={onEditSubmit}
			/>

			<Snackbar
				open={!!toast}
				autoHideDuration={2000}
				onClose={() => setToast(null)}
			>
				<Alert severity="success" variant="filled">
					{toast}
				</Alert>
			</Snackbar>
		</Navbar>
	);
}
