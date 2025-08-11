"use client";
import { useState } from "react";
import { Api } from "@/services/api";
import { useRouter } from "next/navigation";
import type { LoginResponse } from "@/types";
import { useAuthContext } from "@/context/AuthContext";

export function useAuth() {
	const router = useRouter();
	const { setAuth } = useAuthContext();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const login = async (email: string, password: string) => {
		setLoading(true);
		setError(null);
		try {
			const { data } = await Api.login(email, password); // LoginResponse
			persistAuth(data);
			// redirección: si hay ?next=..., respétalo
			const next =
				new URLSearchParams(window.location.search).get("next") || "/dashboard";
			router.replace(next);
		} catch (e: any) {
			setError(e.response?.data?.message || "Login failed");
		} finally {
			setLoading(false);
		}
	};

	const register = async (name: string, email: string, password: string) => {
		setLoading(true);
		setError(null);
		try {
			const { data } = await Api.register(email, password, name);
			persistAuth(data);
			router.replace("/dashboard");
		} catch (e: any) {
			setError(e.response?.data?.message || "Register failed");
		} finally {
			setLoading(false);
		}
	};

	const persistAuth = (res: LoginResponse) => {
		setAuth({ token: res.token, user: res.user }); // actualiza contexto + localStorage
	};

	return { login, register, loading, error };
}
