"use client";

import { useState } from "react";
import { axiosService } from "@/services/axios";
import { useRouter } from "next/navigation";
import type { LoginData, LoginResponse, User } from "@/types";
import { useAuthContext } from "@/context/AuthContext";

export function useAuth() {
	const router = useRouter();
	const { setAuth } = useAuthContext();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const login = async (loginData: LoginData) => {
		setLoading(true);
		setError(null);
		try {
			const { data } = await axiosService.post<LoginResponse>(
				"/auth/login",
				loginData
			);
			persistAuth(data);
			const next =
				new URLSearchParams(window.location.search).get("next") || "/dashboard";
			router.replace(next);
		} catch (e: any) {
			setError(e.response?.data?.error || "Login failed");
		} finally {
			setLoading(false);
		}
	};

	const register = async (user: User) => {
		setLoading(true);
		setError(null);
		try {
			const { data } = await axiosService.post<LoginResponse>(
				"/auth/register",
				user
			);
			persistAuth(data);
			router.replace("/dashboard");
		} catch (e: any) {
			console.log(e);
			setError(e.response?.data?.error || "Register failed");
		} finally {
			setLoading(false);
		}
	};

	const persistAuth = (res: LoginResponse) => {
		setAuth({ token: res.token, user: res.user });
	};

	return { login, register, loading, error };
}
