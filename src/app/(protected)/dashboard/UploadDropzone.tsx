"use client";
import { useState } from "react";
import { Box, Typography, Snackbar, Alert } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

export function UploadDropzone({
	onFileInput,
	onDrop,
	inputRef,
}: {
	onFileInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
	onDrop: (e: React.DragEvent) => void;
	inputRef: React.RefObject<HTMLInputElement>;
}) {
	const [error, setError] = useState<string | null>(null);

	const isValidFile = (f: File) => {
		const t = f.type.toLowerCase();
		const n = f.name.toLowerCase();
		return (
			t === "image/png" ||
			t === "image/jpeg" ||
			n.endsWith(".png") ||
			n.endsWith(".jpg") ||
			n.endsWith(".jpeg")
		);
	};

	const handleDrop: React.DragEventHandler = (e) => {
		e.preventDefault();
		const f = e.dataTransfer.files?.[0];
		if (!f) return;
		if (!isValidFile(f)) {
			setError("Archivo no válido. Solo PNG o JPG.");
			return;
		}
		onDrop(e);
	};

	const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
		const f = e.target.files?.[0];
		if (f && !isValidFile(f)) {
			setError("Archivo no válido. Solo PNG o JPG.");
			e.target.value = "";
			return;
		}
		onFileInput(e);
	};

	return (
		<>
			<Box
				onDragOver={(e) => e.preventDefault()}
				onDrop={handleDrop}
				onClick={() => inputRef.current?.click()}
				sx={{
					border: "1px dashed rgba(148,163,184,.35)",
					borderRadius: 2,
					p: 3,
					textAlign: "center",
					cursor: "pointer",
				}}
			>
				<CloudUploadIcon />
				<Typography mt={1} variant="body2">
					Haz clic o suelta una imagen aquí (PNG/JPG)
				</Typography>
				<input
					ref={inputRef}
					type="file"
					accept="image/png,image/jpeg"
					hidden
					onChange={handleChange}
				/>
			</Box>

			<Snackbar
				open={!!error}
				autoHideDuration={2500}
				onClose={() => setError(null)}
				anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
			>
				<Alert severity="error" variant="filled" onClose={() => setError(null)}>
					{error}
				</Alert>
			</Snackbar>
		</>
	);
}
