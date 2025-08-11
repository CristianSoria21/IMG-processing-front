import axios from "axios";

export const axiosService = axios.create({
	baseURL: process.env.NEXT_PUBLIC_API_URL,
	withCredentials: true,
});

axiosService.interceptors.request.use((config) => {
	if (typeof window !== "undefined") {
		const token = localStorage.getItem("token");
		if (token) config.headers.Authorization = `Bearer ${token}`;
	}
	return config;
});
