"use client";
import { useEffect, useState } from "react";
import type { ImageItem } from "@/types";
import { axiosService } from "@/services/axios";

export function useImages() {
	const [items, setItems] = useState<ImageItem[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [q, setQ] = useState("");

	const listImages = async () => {
		const { data } = await axiosService.get<ImageItem[]>("/images");
		return data;
	};

	const load = async () => {
		try {
			setLoading(true);
			const images = await listImages();
			setItems(images);
		} catch (e: any) {
			setError(e?.response?.data?.message || "Failed to load images");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		let active = true;
		setLoading(true);
		listImages()
			.then((images) => active && setItems(images))
			.finally(() => active && setLoading(false));
		return () => {
			active = false;
		};
	}, []);

	// filtro client-side por id o urls
	const filtered = items.filter(
		(i) =>
			String(i.id).includes(q) ||
			i.originalUrl.toLowerCase().includes(q.toLowerCase()) ||
			(i.processedUrl ?? "").toLowerCase().includes(q.toLowerCase())
	);

	return { items: filtered, loading, error, q, setQ, refetch: load };
}
