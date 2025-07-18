import { decode as jwtDecode, sign as jwtSign, verify as jwtVerify } from "@tsndr/cloudflare-worker-jwt";
import type Env from "../environment";

export function encode(payload: object, env: Env): Promise<string> {
  return jwtSign(payload, env.DISCORD_PUBLIC_KEY);
}

export function validate(token: string, env: Env): Promise<boolean> {
  return jwtVerify(token, env.DISCORD_PUBLIC_KEY).then(Boolean);
}

// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters
export function decode<T extends object = object>(token: string): T {
  return jwtDecode(token).payload as T;
}
