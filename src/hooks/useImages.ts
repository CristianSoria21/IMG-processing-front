"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { ImageItem, Operation } from "@/types";
import { axiosService } from "@/services/axios";

export function useImages() {
	const [items, setItems] = useState<ImageItem[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [q, setQ] = useState("");

	const fetch = useCallback(async () => {
		try {
			setLoading(true);
			const { data } = await axiosService.get<ImageItem[]>("/images");
			setItems(data);
		} catch (e: any) {
			setError(e?.response?.data?.error || "Falló al cargar las imágenes");
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		fetch();
	}, [fetch]);

	const deleteImage = useCallback(
		async (id: number) => {
			setItems((prev) => prev.filter((i) => i.id !== id));
			try {
				await axiosService.delete(`/images/${id}`);
			} catch (e: any) {
				setError(e?.response?.data?.error || "Falló al eliminar");
				await fetch();
				throw e;
			}
		},
		[fetch]
	);

	const updateImage = useCallback(
		async (id: number, ops: Operation[]) => {
			await axiosService.put(`/images/${id}`, { options: ops });
			await fetch();
		},
		[fetch]
	);

	const itemsFiltered = useMemo(
		() =>
			items.filter(
				(i) =>
					String(i.id).includes(q) ||
					i.originalUrl.toLowerCase().includes(q.toLowerCase()) ||
					(i.processedUrl ?? "").toLowerCase().includes(q.toLowerCase())
			),
		[items, q]
	);

	return {
		items: itemsFiltered,
		loading,
		error,
		q,
		setQ,
		refetch: fetch,
		deleteImage,
		updateImage,
	};
}
