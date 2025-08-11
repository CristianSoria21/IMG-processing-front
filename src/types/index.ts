export type Paginated<T> = {
	items: T[];
	page: number;
	pageSize: number;
	total: number;
};

export type ImageItem = {
	id: string;
	url: string;
	name: string;
	createdAt: string;
	status?: "ready" | "processing" | "failed";
};

export type JobItem = {
	id: string;
	imageId: string;
	status: "queued" | "running" | "done" | "failed";
	progress?: number;
	resultUrl?: string;
	createdAt: string;
};

export type LoginResponse = {
	token: string;
	user: { id: string; email: string };
};
