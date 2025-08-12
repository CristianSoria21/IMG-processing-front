"use client";
import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { ImageCard } from "@/components/ImageCard";
import { UploadDialog } from "@/app/(protected)/dashboard/UploadDialog";
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

export default function Page() {
	const { items, loading, refetch } = useImages();
	const [open, setOpen] = useState(false);
	const [toast, setToast] = useState<string | null>(null);
	const { upload, loading: uploading } = useUpload(async () => {
		setOpen(false);
		setToast("Uploaded");
		refetch();
	});

	return (
		<Navbar>
			<Stack direction="row" spacing={2} sx={{ mb: 3 }}>
				<Button
					startIcon={<AddPhotoAlternateIcon />}
					variant="contained"
					onClick={() => setOpen(true)}
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
						<Grid key={it.id} size={4}>
							<ImageCard item={it} />
						</Grid>
					))}
				</Grid>
			)}
			<UploadDialog
				open={open}
				onClose={() => setOpen(false)}
				loading={uploading}
				onSubmit={({ file, operations }) => upload(file, operations)}
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
