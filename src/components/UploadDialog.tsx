"use client";
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Button,
	Stack,
	Typography,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useRef } from "react";

type Props = {
	open: boolean;
	onClose: () => void;
	onPick: (file: File) => void;
	loading?: boolean;
};

export function UploadDialog({ open, onClose, onPick, loading }: Props) {
	const inputRef = useRef<HTMLInputElement>(null);

	return (
		<Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
			<DialogTitle>Upload image</DialogTitle>
			<DialogContent>
				<Stack alignItems="center" spacing={2} sx={{ py: 4 }}>
					<CloudUploadIcon fontSize="large" />
					<Typography variant="body1">Select a file to upload</Typography>
					<input
						ref={inputRef}
						type="file"
						accept="image/*"
						hidden
						onChange={(e) => {
							const f = e.target.files?.[0];
							if (f) onPick(f);
						}}
					/>
					<Button
						variant="outlined"
						onClick={() => inputRef.current?.click()}
						disabled={loading}
					>
						Choose file
					</Button>
				</Stack>
			</DialogContent>
			<DialogActions>
				<Button onClick={onClose}>Close</Button>
			</DialogActions>
		</Dialog>
	);
}
