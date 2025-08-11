"use client";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { ImageCard } from "@/components/ImageCard";
import { UploadDialog } from "@/components/UploadDialog";
import {
	Grid,
	Button,
	TextField,
	Stack,
	Pagination,
	Snackbar,
	Alert,
	CircularProgress,
} from "@mui/material";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import { useImages } from "@/hooks/useImages";
import { useUpload } from "@/hooks/useUpload";
import { Api } from "@/services/api";

export default function Page() {
	const { data, loading, q, setQ, page, setPage, refetch } = useImages();
	const [open, setOpen] = useState(false);
	const [toast, setToast] = useState<string | null>(null);
	const { upload, loading: uploading } = useUpload(async () => {
		setOpen(false);
		setToast("Uploaded");
		refetch();
	});

	const onProcess = async (id: string) => {
		await Api.startProcess(id);
		setToast("Processing started");
		refetch();
	};

	return (
		<AppShell>
			<Stack direction="row" spacing={2} sx={{ mb: 3 }}>
				<TextField
					size="small"
					label="Search"
					value={q}
					onChange={(e) => setQ(e.target.value)}
				/>
				<Button
					startIcon={<AddPhotoAlternateIcon />}
					variant="contained"
					onClick={() => setOpen(true)}
				>
					Upload
				</Button>
			</Stack>

			{loading ? (
				<Stack alignItems="center" sx={{ py: 10 }}>
					<CircularProgress />
				</Stack>
			) : (
				<>
					<Grid container spacing={2}>
						{(data?.items ?? []).map((it) => (
							<Grid key={it.id} item xs={12} sm={6} md={4} lg={3}>
								<ImageCard item={it} onProcess={onProcess} />
							</Grid>
						))}
					</Grid>

					<Stack alignItems="center" sx={{ mt: 3 }}>
						<Pagination
							page={page}
							onChange={(_, p) => setPage(p)}
							count={
								Math.ceil((data?.total ?? 0) / (data?.pageSize ?? 12)) || 1
							}
						/>
					</Stack>
				</>
			)}

			<UploadDialog
				open={open}
				onClose={() => setOpen(false)}
				loading={uploading}
				onPick={(f) => upload(f)}
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
		</AppShell>
	);
}
