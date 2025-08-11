"use client";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

type User = { id: string; email: string };
type AuthContextType = {
	isAuthenticated: boolean;
	user: User | null;
	token: string | null;
	setAuth: (p: { token: string; user: User }) => void;
	logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [token, setToken] = useState<string | null>(null);
	const [user, setUser] = useState<User | null>(null);

	// Leer estado inicial desde localStorage
	useEffect(() => {
		const t = localStorage.getItem("token");
		const u = localStorage.getItem("user");
		if (t && u) {
			setToken(t);
			try {
				setUser(JSON.parse(u));
			} catch {
				setUser(null);
			}
		}
	}, []);

	// Sincronizar si cambia en otras pestañas o desde hooks
	useEffect(() => {
		const onStorage = (e: StorageEvent) => {
			if (e.key === "token" || e.key === "user") {
				const t = localStorage.getItem("token");
				const u = localStorage.getItem("user");
				setToken(t);
				setUser(u ? JSON.parse(u) : null);
			}
		};
		const onCustom = () =>
			onStorage(new StorageEvent("storage", { key: "token" }));
		window.addEventListener("storage", onStorage);
		window.addEventListener("auth-changed", onCustom as any);
		return () => {
			window.removeEventListener("storage", onStorage);
			window.removeEventListener("auth-changed", onCustom as any);
		};
	}, []);

	const setAuth: AuthContextType["setAuth"] = ({ token, user }) => {
		localStorage.setItem("token", token);
		localStorage.setItem("user", JSON.stringify(user));
		setToken(token);
		setUser(user);
		window.dispatchEvent(new Event("auth-changed")); // avisa a toda la app
	};

	const logout = () => {
		localStorage.removeItem("token");
		localStorage.removeItem("user");
		setToken(null);
		setUser(null);
		window.dispatchEvent(new Event("auth-changed"));
	};

	const value = useMemo<AuthContextType>(
		() => ({
			isAuthenticated: !!token,
			user,
			token,
			setAuth,
			logout,
		}),
		[token, user]
	);

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuthContext = () => {
	const ctx = useContext(AuthContext);
	if (!ctx) throw new Error("useAuthContext must be used within AuthProvider");
	return ctx;
};
