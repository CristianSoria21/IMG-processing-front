"use client";
import { useEffect, useRef, useState } from "react";
import { Api } from "@/services/api";
import type { JobItem } from "@/types";

export function useJobPoll(jobId?: string, intervalMs = 1500) {
	const [job, setJob] = useState<JobItem | null>(null);
	const timer = useRef<number | null>(null);

	useEffect(() => {
		if (!jobId) return;
		const poll = async () => {
			const { data } = await Api.jobStatus(jobId);
			setJob(data);
			if (data.status === "done" || data.status === "failed") stop();
		};
		const start = () => {
			poll();
			timer.current = window.setInterval(poll, intervalMs);
		};
		const stop = () => {
			if (timer.current) window.clearInterval(timer.current);
			timer.current = null;
		};
		start();
		return stop;
	}, [jobId, intervalMs]);

	return { job };
}
