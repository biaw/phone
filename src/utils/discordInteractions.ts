import type { APIInteractionResponse, RESTPatchAPIWebhookWithTokenMessageJSONBody } from "discord-api-types/v10";
import { RouteBases, Routes } from "discord-api-types/v10";

export function respond(response: APIInteractionResponse): Response {
  return new Response(JSON.stringify(response), { headers: { "Content-Type": "application/json" } });
}

export async function update(id: string, token: string, payload: RESTPatchAPIWebhookWithTokenMessageJSONBody): Promise<void> {
  await fetch(RouteBases.api + Routes.webhookMessage(id, token), {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    cf: { cacheTtl: 0 },
  });
}
