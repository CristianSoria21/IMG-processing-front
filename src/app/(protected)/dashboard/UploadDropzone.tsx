"use client";
import { Box, Typography } from "@mui/material";
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
	return (
		<Box
			onDragOver={(e) => e.preventDefault()}
			onDrop={onDrop}
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
				accept="image/*"
				hidden
				onChange={onFileInput}
			/>
		</Box>
	);
}
