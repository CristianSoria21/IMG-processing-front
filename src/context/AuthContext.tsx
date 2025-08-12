"use client";

import { AuthUser, AuthValue } from "@/types";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

const AuthContext = createContext<AuthValue | null>(null);

const readAuth = (): { token: string | null; user: AuthUser | null } => {
	if (typeof window === "undefined") return { token: null, user: null };
	const t = localStorage.getItem("token");
	const u = localStorage.getItem("user");
	try {
		return { token: t, user: u ? (JSON.parse(u) as AuthUser) : null };
	} catch {
		return { token: t, user: null };
	}
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [auth, setAuthState] = useState(readAuth);
	const [isReady, setIsReady] = useState(false);

	useEffect(() => {
		const sync = () => setAuthState(readAuth());
		setIsReady(true);
		window.addEventListener("storage", sync);
		window.addEventListener("auth-changed", sync as any);
		return () => {
			window.removeEventListener("storage", sync);
			window.removeEventListener("auth-changed", sync as any);
		};
	}, []);

	const setAuth: AuthValue["setAuth"] = ({ token, user }) => {
		localStorage.setItem("token", token);
		localStorage.setItem("user", JSON.stringify(user));
		setAuthState({ token, user });
		window.dispatchEvent(new Event("auth-changed"));
	};

	const logout = () => {
		localStorage.removeItem("token");
		localStorage.removeItem("user");
		setAuthState({ token: null, user: null });
		window.dispatchEvent(new Event("auth-changed"));
	};

	const value = useMemo<AuthValue>(
		() => ({
			isAuthenticated: !!auth.token,
			isReady,
			user: auth.user,
			token: auth.token,
			setAuth,
			logout,
		}),
		[auth, isReady]
	);

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuthContext = () => {
	const ctx = useContext(AuthContext);
	if (!ctx) throw new Error("useAuthContext must be used within AuthProvider");
	return ctx;
};
