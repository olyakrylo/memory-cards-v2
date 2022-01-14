type Method = "get" | "post" | "put" | "delete";

export async function request<T = any>(
  method: Method,
  path: string,
  body?: Record<string, any>
): Promise<T> {
  const request: Record<string, any> = {
    method,
    headers: {
      "Content-Type": "application/json",
    },
  };
  if (body) {
    request.body = JSON.stringify(body);
  }
  const res = await fetch(`/api/${path}`, request);
  return (await res.json()) as T;
}
