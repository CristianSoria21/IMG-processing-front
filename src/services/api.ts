import type { Paginated, ImageItem, JobItem, LoginResponse } from "@/types";
import { http } from "./http";

export const Api = {
	// Auth endpoints
	login: (email: string, password: string) =>
		http.post<LoginResponse>("/auth/login", { email, password }),

	register: (email: string, password: string, name: string) =>
		http.post<LoginResponse>("/auth/register", { email, password, name }),

	listImages: (page = 1, q = "") =>
		http.get<Paginated<ImageItem>>("/images", { params: { page, q } }),

	uploadImage: (file: File) => {
		const form = new FormData();
		form.append("file", file);
		return http.post<ImageItem>("/images", form, {
			headers: { "Content-Type": "multipart/form-data" },
		});
	},

	startProcess: (imageId: string, preset?: string) =>
		http.post<JobItem>(`/images/${imageId}/process`, { preset }),

	listJobs: () => http.get<JobItem[]>("/jobs"),

	jobStatus: (jobId: string) => http.get<JobItem>(`/jobs/${jobId}`),
};
