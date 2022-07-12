import { decode, encode } from "./webtoken";

export interface WebhookCredentials {
  id: string;
  token: string;
}

export function encodeWebhookCredentials(credentials: WebhookCredentials): Promise<string> {
  return encode(credentials);
}

export function decodeWebhookCredentials(token: string): WebhookCredentials {
  return decode<WebhookCredentials>(token);
}
