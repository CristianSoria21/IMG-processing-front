"use client";
import { useState } from "react";
import { Api } from "@/services/api";

export function useUpload(onDone?: () => void) {
	const [loading, setLoading] = useState(false);
	const upload = async (file: File) => {
		setLoading(true);
		try {
			await Api.uploadImage(file);
			onDone?.();
		} finally {
			setLoading(false);
		}
	};
	return { upload, loading };
}
