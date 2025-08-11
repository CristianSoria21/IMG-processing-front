"use client";
import { useEffect, useState } from "react";
import type { ImageItem, Paginated } from "@/types";
import { axiosService } from "@/services/axios";

export function useImages() {
	const [data, setData] = useState<Paginated<ImageItem> | null>(null);
	const [loading, setLoading] = useState(true);
	const [q, setQ] = useState("");
	const [page, setPage] = useState(1);

	// useEffect(() => {
	// 	let active = true;
	// 	setLoading(true);
	// 	listImages(page, q)
	// 		.then((res) => active && setData(res))
	// 		.finally(() => active && setLoading(false));
	// 	return () => {
	// 		active = false;
	// 	};
	// }, [page, q]);

	const listImages = async () => {
		const { data } = await axiosService.get<Paginated<ImageItem>>("/images");
		return data;
	};

	const refetch = () => listImages(page, q).then((r) => setData(r));
	return { data, loading, q, setQ, page, setPage, refetch };
}
