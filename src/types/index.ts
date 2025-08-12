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

export type UploadOptions = {
	grayscale: boolean;
	width: number | null;
	height: number | null;
	rotation: number;
};

export type AuthValue = {
	isAuthenticated: boolean;
	isReady: boolean;
	user: AuthUser | null;
	token: string | null;
	setAuth: (p: { token: string; user: AuthUser }) => void;
	logout: () => void;
};
