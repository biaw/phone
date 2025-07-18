import type { APIApplicationCommandInteraction } from "discord-api-types/v10";
import { ApplicationCommandType } from "discord-api-types/v10";
import type Env from "../environment";
import { respond } from "../utils/discordInteractions";
import callCommand from "./call";

export default async function commandHandler(interaction: APIApplicationCommandInteraction, request: Request, env: Env): Promise<Response> {
  if (interaction.data.type === ApplicationCommandType.ChatInput) {
    if (interaction.data.name === "call") return respond(await callCommand(interaction as never, request, env));
  }

  return new Response("", { status: 400 });
}
