import type { APIChatInputApplicationCommandInteraction, APIInteractionResponse } from "discord-api-types/v10";
import { ApplicationCommandOptionType } from "discord-api-types/v10";
import { InteractionResponseType } from "discord-api-types/v9";
import makeCall from "../utils/twilio";
import { encodeWebhookCredentials } from "../utils/webhookTokens";

export default async function callCommand(interaction: APIChatInputApplicationCommandInteraction, request: Request): Promise<APIInteractionResponse> {
  const option = interaction.data.options!.find(({ name }) => name === "message")!;
  if (option.type !== ApplicationCommandOptionType.String) throw new Error("Invalid option type");

  const callbackUrl = new URL(request.url);
  callbackUrl.pathname = "/call-updates";
  callbackUrl.searchParams.set("token", await encodeWebhookCredentials({ id: interaction.application_id, token: interaction.token }));

  void makeCall(`Message ${interaction.user?.username ? `from user ${interaction.user.username}` : "from unknown user"}: ${option.value}`, callbackUrl);
  return { type: InteractionResponseType.DeferredChannelMessageWithSource };
}
