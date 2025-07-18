import type Env from "../environment";
import { decode, encode } from "./webtoken";

export interface WebhookCredentials {
  id: string;
  token: string;
}

export function encodeWebhookCredentials(credentials: WebhookCredentials, env: Env): Promise<string> {
  return encode(credentials, env);
}

export function decodeWebhookCredentials(token: string): WebhookCredentials {
  return decode<WebhookCredentials>(token);
}
