import { sign as jwtSign, verify as jwtVerify, decode as jwtDecode } from "@tsndr/cloudflare-worker-jwt";

export function encode(payload: object): Promise<string> {
  return jwtSign(payload, DISCORD_PUBLIC_KEY);
}

export function validate(token: string): Promise<boolean> {
  return jwtVerify(token, DISCORD_PUBLIC_KEY).then(Boolean)
}

export function decode<T extends object = object>(token: string): T {
  return jwtDecode(token).payload as T;
}
