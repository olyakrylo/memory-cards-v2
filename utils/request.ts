import { Paths } from "../shared/api";

interface ReqRes {
  query: unknown;
  body: unknown;
  result: unknown;
}

export async function request<
  ModuleKey extends keyof Paths,
  PathKey extends keyof Paths[ModuleKey],
  MethodKey extends keyof Paths[ModuleKey][PathKey],
  RR extends ReqRes = Paths[ModuleKey][PathKey][MethodKey] extends ReqRes
    ? Paths[ModuleKey][PathKey][MethodKey]
    : never
>(
  module: ModuleKey,
  path: PathKey,
  method: MethodKey,
  options: {
    query?: RR["query"];
    body?: RR["body"];
    formData?: boolean;
  } = {}
): Promise<RR["result"]> {
  const request: Record<string, any> = {
    method: method.toString().toUpperCase(),
  };

  request.body = options.body;

  if (!options.formData) {
    request.headers = {
      "Content-Type": "application/json",
    };
    request.body = JSON.stringify(options.body);
  }

  const fullPath = [module, path].filter(Boolean).join("/");

  const strQueryParams = Object.entries(
    (options.query as Record<string, any>) ?? {}
  )
    .map(([key, value]) => `${key}=${encodeURIComponent(value as any)}`)
    .join("&");
  const readyQueryParams = strQueryParams ? `?${strQueryParams}` : "";

  const res = await fetch(`/api/${fullPath}${readyQueryParams}`, request);
  return (await res.json()) as RR["result"];
}
