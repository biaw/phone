import jwt from "@tsndr/cloudflare-worker-jwt";

export function encode(payload: object): Promise<string> {
  return jwt.sign(payload, DISCORD_PUBLIC_KEY);
}

export function validate(token: string): Promise<boolean> {
  return jwt.verify(token, DISCORD_PUBLIC_KEY);
}

export function decode<T extends object = object>(token: string): T {
  return jwt.decode(token).payload as T;
}
