"use client";
import { useEffect, useState } from "react";
import { Api } from "@/services/api";
import type { ImageItem, Paginated } from "@/types";

export function useImages() {
	const [data, setData] = useState<Paginated<ImageItem> | null>(null);
	const [loading, setLoading] = useState(true);
	const [q, setQ] = useState("");
	const [page, setPage] = useState(1);

	useEffect(() => {
		let active = true;
		setLoading(true);
		Api.listImages(page, q)
			.then((res) => active && setData(res.data))
			.finally(() => active && setLoading(false));
		return () => {
			active = false;
		};
	}, [page, q]);

	const refetch = () => Api.listImages(page, q).then((r) => setData(r.data));
	return { data, loading, q, setQ, page, setPage, refetch };
}
