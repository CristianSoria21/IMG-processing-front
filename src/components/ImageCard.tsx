"use client";
import {
	Card,
	CardMedia,
	CardContent,
	Typography,
	CardActions,
	Button,
	Chip,
} from "@mui/material";
import type { ImageItem } from "@/types";

type Props = { item: ImageItem; onProcess?: (id: string) => void };
export function ImageCard({ item, onProcess }: Props) {
	return (
		<Card>
			<CardMedia
				component="img"
				height="160"
				image={item.url}
				alt={item.name}
			/>
			<CardContent>
				<Typography variant="subtitle1" fontWeight={700}>
					{item.name}
				</Typography>
				<Chip size="small" label={item.status ?? "ready"} sx={{ mt: 1 }} />
			</CardContent>
			<CardActions>
				<Button onClick={() => onProcess?.(item.id)} variant="contained">
					Process
				</Button>
				<Button href={item.url} target="_blank">
					Open
				</Button>
			</CardActions>
		</Card>
	);
}
