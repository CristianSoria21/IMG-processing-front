"use client";
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Button,
	Stack,
	Typography,
	Box,
	Switch,
	FormControlLabel,
	TextField,
	Slider,
	IconButton,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import { useEffect, useRef, useState } from "react";
import type { Operation } from "@/types";

export type UploadOptions = {
	grayscale: boolean;
	width: number | null;
	height: number | null;
	rotation: number; // 0..360
};

type Props = {
	open: boolean;
	onClose: () => void;
	onSubmit: (payload: { file: File; operations: Operation[] }) => void; // 👈 ahora envía operations[]
	loading?: boolean;
};

export function UploadDialog({ open, onClose, onSubmit, loading }: Props) {
	const inputRef = useRef<HTMLInputElement>(null);
	const [file, setFile] = useState<File | null>(null);
	const [preview, setPreview] = useState<string | null>(null);
	const [options, setOptions] = useState<UploadOptions>({
		grayscale: false,
		width: null,
		height: null,
		rotation: 0,
	});

	useEffect(() => {
		if (!file) return setPreview(null);
		const url = URL.createObjectURL(file);
		setPreview(url);
		return () => URL.revokeObjectURL(url);
	}, [file]);

	const pickFile = (f?: File) => {
		if (f) setFile(f);
	};
	const onFileInput = (e: React.ChangeEvent<HTMLInputElement>) =>
		pickFile(e.target.files?.[0] || undefined);
	const onDrop = (e: React.DragEvent) => {
		e.preventDefault();
		pickFile(e.dataTransfer.files?.[0] || undefined);
	};

	const onReset = () => {
		setFile(null);
		setOptions({ grayscale: false, width: null, height: null, rotation: 0 });
		if (inputRef.current) inputRef.current.value = "";
	};

	const validDims = (v: number | null) =>
		v == null || (Number.isFinite(v) && v > 0 && v <= 4000);
	const resizeReady = options.width != null && options.height != null;
	const canSubmit =
		!!file && validDims(options.width) && validDims(options.height);

	const submit = () => {
		if (!file || !canSubmit) return;

		const ops: Operation[] = [];
		if (options.grayscale) ops.push({ type: "GREYSCALE" });
		if (resizeReady)
			ops.push({
				type: "RESIZE",
				width: options.width!,
				height: options.height!,
			});
		if (options.rotation !== 0)
			ops.push({ type: "ROTATE", deg: Math.round(options.rotation) });

		onSubmit({ file, operations: ops });
	};

	return (
		<Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
			<DialogTitle
				sx={{
					display: "flex",
					alignItems: "center",
					justifyContent: "space-between",
				}}
			>
				Upload & Transform
				<IconButton onClick={onReset} title="Reset">
					<RestartAltIcon />
				</IconButton>
			</DialogTitle>

			<DialogContent dividers>
				<Stack spacing={3}>
					{/* Dropzone / Picker */}
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
							Click or drop an image here (PNG/JPG)
						</Typography>
						<input
							ref={inputRef}
							type="file"
							accept="image/*"
							hidden
							onChange={onFileInput}
						/>
					</Box>

					{/* Preview + Controls */}
					<Stack direction={{ xs: "column", md: "row" }} spacing={3}>
						<Box
							sx={{
								flex: 1,
								minHeight: 280,
								borderRadius: 2,
								border: "1px solid rgba(148,163,184,.18)",
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								bgcolor: "background.default",
							}}
						>
							{preview ? (
								<img
									src={preview}
									alt="preview"
									style={{
										maxWidth: "100%",
										maxHeight: 260,
										objectFit: "contain",
										filter: options.grayscale ? "grayscale(1)" : "none",
										transform: `rotate(${options.rotation}deg)`,
										transition: "transform .2s ease, filter .2s ease",
									}}
								/>
							) : (
								<Typography variant="body2" color="text.secondary">
									No image selected
								</Typography>
							)}
						</Box>

						<Stack spacing={2} sx={{ width: { xs: "100%", md: 320 } }}>
							<FormControlLabel
								control={
									<Switch
										checked={options.grayscale}
										onChange={(e) =>
											setOptions((o) => ({ ...o, grayscale: e.target.checked }))
										}
									/>
								}
								label="Grayscale"
							/>

							<Stack direction="row" spacing={2}>
								<TextField
									label="Width (px)"
									type="number"
									value={options.width ?? ""}
									onChange={(e) =>
										setOptions((o) => ({
											...o,
											width: e.target.value ? Number(e.target.value) : null,
										}))
									}
									inputProps={{ min: 1, max: 4000 }}
									fullWidth
									error={!validDims(options.width)}
									helperText={
										!validDims(options.width) ? "1–4000 or empty" : " "
									}
								/>
								<TextField
									label="Height (px)"
									type="number"
									value={options.height ?? ""}
									onChange={(e) =>
										setOptions((o) => ({
											...o,
											height: e.target.value ? Number(e.target.value) : null,
										}))
									}
									inputProps={{ min: 1, max: 4000 }}
									fullWidth
									error={!validDims(options.height)}
									helperText={
										!validDims(options.height) ? "1–4000 or empty" : " "
									}
								/>
							</Stack>

							<Typography variant="caption" color="text.secondary">
								Rotation: {options.rotation}°
							</Typography>
							<Slider
								value={options.rotation}
								onChange={(_, v) =>
									setOptions((o) => ({ ...o, rotation: v as number }))
								}
								min={0}
								max={360}
								step={1}
							/>
						</Stack>
					</Stack>
				</Stack>
			</DialogContent>

			<DialogActions>
				<Button onClick={onClose}>Cancel</Button>
				<Button
					onClick={submit}
					variant="contained"
					disabled={!canSubmit || loading}
				>
					{loading ? "Uploading..." : "Upload"}
				</Button>
			</DialogActions>
		</Dialog>
	);
}
