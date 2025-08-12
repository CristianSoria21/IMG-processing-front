import type { Operation } from "@/types";

export function buildOperations(options: {
	grayscale: boolean;
	width: number | null;
	height: number | null;
	rotation: number;
}): Operation[] {
	const ops: Operation[] = [];
	const resizeReady = options.width != null && options.height != null;
	if (options.grayscale) ops.push({ type: "GREYSCALE" });
	if (resizeReady)
		ops.push({
			type: "RESIZE",
			width: options.width!,
			height: options.height!,
		});
	if (options.rotation !== 0)
		ops.push({ type: "ROTATE", deg: Math.round(options.rotation) });
	return ops;
}
