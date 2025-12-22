export async function http<T>(
  input: RequestInfo,
  init?: RequestInit
): Promise<T> {
  const res = await fetch(input, {
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
    ...init,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Request failed");
  }

  // DELETE returns 204
  if (res.status === 204) {
    return undefined as T;
  }

  return res.json() as Promise<T>;
}
