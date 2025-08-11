"use client";
import { axiosService } from "@/services/axios";
import { useState } from "react";

export function useUpload(onDone?: () => void) {
	const [loading, setLoading] = useState(false);
	const upload = async (file: File) => {
		setLoading(true);
		try {
			const form = new FormData();
			form.append("file", file);
			await axiosService.post("/images", form, {
				headers: { "Content-Type": "multipart/form-data" },
			});
			onDone?.();
		} finally {
			setLoading(false);
		}
	};
	return { upload, loading };
}
