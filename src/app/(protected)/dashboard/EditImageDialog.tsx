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
	Chip,
	Tabs,
	Tab,
	useMediaQuery,
} from "@mui/material";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import { useEffect, useState } from "react";
import { useTheme } from "@mui/material/styles";
import type { ImageItem, Operation, UploadOptions } from "@/types";
import { buildOperations } from "@/services/imageOps";

type Props = {
	open: boolean;
	item: ImageItem | null;
	onClose: () => void;
	onSubmit: (id: number, operations: Operation[]) => void | Promise<void>;
	loading?: boolean;
};

export function EditImageDialog({
	open,
	item,
	onClose,
	onSubmit,
	loading,
}: Props) {
	const [options, setOptions] = useState<UploadOptions>({
		grayscale: false,
		width: null,
		height: null,
		rotation: 0,
	});
	const theme = useTheme();
	const isMdUp = useMediaQuery(theme.breakpoints.up("md"));
	const [tab, setTab] = useState<"original" | "processed" | "preview">(
		"original"
	);

	useEffect(() => {
		if (open) {
			setOptions({ grayscale: false, width: null, height: null, rotation: 0 });
			setTab("original");
		}
	}, [open, item?.id]);

	const validDims = (v: number | null) =>
		v == null || (Number.isFinite(v) && v > 0 && v <= 4000);
	const hasAnyOp =
		options.grayscale ||
		(options.width !== null && options.height !== null) ||
		options.rotation !== 0;
	const canSubmit =
		!!item && hasAnyOp && validDims(options.width) && validDims(options.height);

	const reset = () =>
		setOptions({ grayscale: false, width: null, height: null, rotation: 0 });
	const submit = () => {
		if (!item || !canSubmit) return;
		onSubmit(item.id, buildOperations(options));
	};

	const ImgBox = ({
		label,
		color,
		src,
		emptyText,
	}: {
		label: string;
		color?: "success" | "warning";
		src?: string;
		emptyText?: string;
	}) => (
		<Box
			sx={{
				flex: 1,
				border: "1px solid rgba(148,163,184,.18)",
				borderRadius: 2,
				overflow: "hidden",
			}}
		>
			<Box sx={{ p: 1, display: "flex", alignItems: "center", gap: 1 }}>
				<Chip size="small" label={label} color={color} />
				{label === "Original" && item?.id && (
					<Typography variant="caption" color="text.secondary">
						#{item.id}
					</Typography>
				)}
			</Box>
			<Box
				sx={{
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					height: { xs: "44vh", md: 520 },
					bgcolor: "background.default",
				}}
			>
				{src ? (
					// eslint-disable-next-line @next/next/no-img-element
					<img
						src={src}
						alt={label.toLowerCase()}
						style={{
							maxWidth: "100%",
							maxHeight: "100%",
							objectFit: "contain",
						}}
					/>
				) : (
					<Typography variant="body2" color="text.secondary">
						{emptyText}
					</Typography>
				)}
			</Box>
		</Box>
	);

	const PreviewImg = () => (
		<Box
			sx={{
				flex: 1,
				border: "1px solid rgba(148,163,184,.18)",
				borderRadius: 2,
				overflow: "hidden",
			}}
		>
			<Box sx={{ p: 1, display: "flex", alignItems: "center", gap: 1 }}>
				<Chip size="small" color="warning" label="Vista previa (nueva)" />
			</Box>
			<Box
				sx={{
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					height: { xs: "44vh", md: 520 },
					bgcolor: "background.default",
				}}
			>
				{item && (
					// eslint-disable-next-line @next/next/no-img-element
					<img
						src={item.originalUrl}
						alt="preview"
						style={{
							maxWidth: "100%",
							maxHeight: "100%",
							objectFit: "contain",
							filter: options.grayscale ? "grayscale(1)" : "none",
							transform: `rotate(${options.rotation}deg)`,
							transition: "transform .2s ease, filter .2s ease",
							width: options.width ? `${options.width}px` : "auto",
							height: options.height ? `${options.height}px` : "auto",
						}}
					/>
				)}
			</Box>
		</Box>
	);

	const Controls = (
		<Stack spacing={2} sx={{ width: { xs: "100%", md: 280 } }}>
			<FormControlLabel
				control={
					<Switch
						checked={options.grayscale}
						onChange={(e) =>
							setOptions((o) => ({ ...o, grayscale: e.target.checked }))
						}
					/>
				}
				label="Escala de grises"
			/>
			<Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
				<TextField
					label="Ancho (px)"
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
					helperText={!validDims(options.width) ? "1–4000 o vacío" : " "}
				/>
				<TextField
					label="Alto (px)"
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
					helperText={!validDims(options.height) ? "1–4000 o vacío" : " "}
				/>
			</Stack>
			<Typography variant="caption" color="text.secondary">
				Rotación: {options.rotation}°
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
	);

	return (
		<Dialog
			open={open}
			onClose={onClose}
			fullScreen={!isMdUp}
			maxWidth={false}
			PaperProps={{
				sx: {
					width: { xs: "100%", md: "min(1100px, 94vw)" },
					height: { xs: "100%", md: "min(88vh, 760px)" },
					m: { xs: 0, md: 2 },
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
				Editar imagen
				<IconButton onClick={reset} title="Reset">
					<RestartAltIcon />
				</IconButton>
			</DialogTitle>

			<DialogContent
				dividers
				sx={{ display: "flex", flexDirection: "column", gap: 2 }}
			>
				{!isMdUp ? (
					<>
						<Tabs
							value={tab}
							onChange={(_, v) => setTab(v)}
							variant="fullWidth"
							sx={{ borderBottom: "1px solid rgba(148,163,184,.18)" }}
						>
							<Tab value="original" label="Original" />
							<Tab value="processed" label="Procesada" />
							<Tab value="preview" label="Vista previa" />
						</Tabs>

						<Box
							sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 2 }}
						>
							{tab === "original" && (
								<ImgBox label="Original" src={item?.originalUrl} />
							)}
							{tab === "processed" && (
								<ImgBox
									label="Procesada (actual)"
									color="success"
									src={item?.processedUrl ?? undefined}
									emptyText="No hay imagen procesada"
								/>
							)}
							{tab === "preview" && <PreviewImg />}
							{Controls}
						</Box>
					</>
				) : (
					<Stack direction="row" spacing={3} sx={{ flex: 1, minHeight: 0 }}>
						<Stack direction="row" spacing={3} sx={{ flex: 1, minWidth: 0 }}>
							<ImgBox label="Original" src={item?.originalUrl} />
							<ImgBox
								label="Procesada (actual)"
								color="success"
								src={item?.processedUrl ?? undefined}
								emptyText="No hay imagen procesada"
							/>
							<PreviewImg />
						</Stack>
						{Controls}
					</Stack>
				)}
			</DialogContent>

			<DialogActions sx={{ gap: 1, flexWrap: "wrap" }}>
				<Button onClick={onClose}>Cancelar</Button>
				<Button
					onClick={submit}
					variant="contained"
					disabled={!canSubmit || loading}
				>
					{loading ? "Procesando..." : "Actualizar"}
				</Button>
			</DialogActions>
		</Dialog>
	);
}
