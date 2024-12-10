import type { APIApplicationCommandInteraction, APIPingInteraction } from "discord-api-types/v10";
import { InteractionResponseType, InteractionType } from "discord-api-types/v10";
import { isValidRequest, PlatformAlgorithm } from "discord-verify/web";
import commandHandler from "../commands";
import { respond } from "../utils/discordInteractions";

export default async function handleInteractionPost(request: Request): Promise<Response> {
  // check and validate headers
  if (!request.headers.get("X-Signature-Ed25519") || !request.headers.get("X-Signature-Timestamp")) return Response.redirect(FALLBACK_URL, 307);
  if (!await isValidRequest(request, DISCORD_PUBLIC_KEY, PlatformAlgorithm.Cloudflare)) return new Response("", { status: 401 });

  // parse request body
  const interaction = await request.json<APIApplicationCommandInteraction | APIPingInteraction>();

  // if interaction is a ping, respond with a pong
  if (interaction.type === InteractionType.Ping) return respond({ type: InteractionResponseType.Pong });

  return commandHandler(interaction, request);
}
