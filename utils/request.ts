import { Paths } from "./api";

interface ReqRes {
  params: unknown;
  result: unknown;
}

export async function request<
  PathKey extends keyof Paths,
  QueryKey extends keyof Paths[PathKey],
  MethodKey extends keyof Paths[PathKey][QueryKey],
  RR extends ReqRes = Paths[PathKey][QueryKey][MethodKey] extends ReqRes
    ? Paths[PathKey][QueryKey][MethodKey]
    : never
>(
  path: PathKey,
  query: QueryKey,
  method: MethodKey,
  body?: RR["params"]
): Promise<RR["result"]> {
  const request: Record<string, any> = {
    method,
    headers: {
      "Content-Type": "application/json",
    },
  };
  if (body) {
    request.body = JSON.stringify(body);
  }
  const fullPath = [path, query].filter(Boolean).join("/");
  const res = await fetch(`/api/${fullPath}`, request);
  return (await res.json()) as RR["result"];
}
