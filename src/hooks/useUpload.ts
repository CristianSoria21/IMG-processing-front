"use client";
import { useState } from "react";
import { axiosService } from "@/services/axios";
import type { Operation } from "@/types";

export function useUpload(onDone?: () => void) {
	const [loading, setLoading] = useState(false);
	const upload = async (file: File, operations: Operation[]) => {
		setLoading(true);
		try {
			const form = new FormData();
			form.append("image", file);
			form.append("options", JSON.stringify(operations));
			await axiosService.post("/images/process", form, {
				headers: { "Content-Type": "multipart/form-data" },
			});
			onDone?.();
		} finally {
			setLoading(false);
		}
	};
	return { upload, loading };
}
