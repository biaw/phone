import { decode as jwtDecode, sign as jwtSign, verify as jwtVerify } from "@tsndr/cloudflare-worker-jwt";

export function encode(payload: object): Promise<string> {
  return jwtSign(payload, DISCORD_PUBLIC_KEY);
}

export function validate(token: string): Promise<boolean> {
  return jwtVerify(token, DISCORD_PUBLIC_KEY).then(Boolean);
}

// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters
export function decode<T extends object = object>(token: string): T {
  return jwtDecode(token).payload as T;
}
