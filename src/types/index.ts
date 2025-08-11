export type ImageItem = {
	id: number;
	originalUrl: string;
	processedUrl?: string | null;
	createdAt: string;
};

export type User = {
	name: string;
	email: string;
	password: string;
};

export type AuthUser = { id: string; email: string; name?: string };
export type LoginData = { email: string; password: string };
export type UserRegister = { name: string; email: string; password: string };
export type LoginResponse = { token: string; user: AuthUser };

export type Operation =
	| { type: "GREYSCALE" }
	| { type: "RESIZE"; width: number; height: number }
	| { type: "ROTATE"; deg: number };
