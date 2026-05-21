const tokenKey = "tutornest_token";

export async function apiFetch<T>(
  url: string,
  init?: RequestInit,
): Promise<T & { message?: string }> {
  const token = typeof window === "undefined" ? null : localStorage.getItem(tokenKey);
  const res = await fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init?.headers ?? {}),
    },
  });

  const data = (await res.json()) as T & { message?: string };
  if (!res.ok) {
    throw new Error(data.message || "Request failed");
  }
  return data;
}
