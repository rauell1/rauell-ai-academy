import { useCallback, useEffect, useState } from "react";

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
  }
}
export async function apiRequest<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const response = await fetch(`/api/v1${path}`, {
    ...init,
    headers: { "content-type": "application/json", ...init?.headers },
    credentials: "include",
  });
  let payload: any;
  try {
    payload = await response.json();
  } catch {
    throw new ApiError("The server returned an invalid response.", response.status);
  }
  if (!response.ok)
    throw new ApiError(payload?.error || "The request failed.", response.status);
  if (payload && typeof payload === "object" && "error" in payload && !("id" in payload) && !("title" in payload) && !Array.isArray(payload)) {
    throw new ApiError(payload.error || "The request failed.", response.status);
  }
  return payload as T;
}
export function useApi<T>(path: string | null) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(Boolean(path));
  const load = useCallback(async () => {
    if (!path) return;
    setLoading(true);
    setError("");
    try {
      setData(await apiRequest<T>(path));
    } catch (e) {
      setError(e instanceof Error ? e.message : "The request failed.");
    } finally {
      setLoading(false);
    }
  }, [path]);
  useEffect(() => {
    void load();
  }, [load]);
  return { data, error, loading, reload: load };
}
export type ApiCourse = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  description: string | null;
  level: string;
  estimatedMinutes: number;
  learningOutcomes: string[];
  skills: string[];
  state: string;
  enrolled?: boolean;
  modules?: ApiModule[];
  assessments?: Array<{ id: string; title: string }>;
  projects?: Array<{ id: string; title: string }>;
};
export type ApiModule = {
  id: string;
  title: string;
  description: string | null;
  sortOrder: number;
  lessons: ApiLesson[];
};
export type ApiLesson = {
  id: string;
  moduleId: string;
  slug: string;
  title: string;
  summary: string | null;
  estimatedMinutes: number;
  sortOrder: number;
};
export type DashboardData = {
  user: { name: string };
  enrolled: Array<{
    enrolmentId: string;
    status: string;
    courseId: string;
    slug: string;
    title: string;
    summary: string;
    level: string;
    completionBasisPoints: number | null;
    completedLessons: number | null;
    requiredLessons: number | null;
    lastLessonId: string | null;
  }>;
  recent: Array<{
    lessonId: string;
    title: string;
    viewedAt: string | null;
    completedAt: string | null;
  }>;
  recommendedAction: string;
};
