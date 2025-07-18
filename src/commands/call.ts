import type { APIChatInputApplicationCommandInteraction, APIInteractionResponse } from "discord-api-types/v10";
import { ApplicationCommandOptionType } from "discord-api-types/v10";
import { InteractionResponseType } from "discord-api-types/v9";
import type Env from "../environment";
import makeCall from "../utils/twilio";
import { encodeWebhookCredentials } from "../utils/webhookTokens";

export default async function callCommand(interaction: APIChatInputApplicationCommandInteraction, request: Request, env: Env): Promise<APIInteractionResponse> {
  const option = interaction.data.options!.find(({ name }) => name === "message")!;
  if (option.type !== ApplicationCommandOptionType.String) throw new Error("Invalid option type");

  const callbackUrl = new URL(request.url);
  callbackUrl.pathname = "/call-updates";
  callbackUrl.searchParams.set("token", await encodeWebhookCredentials({ id: interaction.application_id, token: interaction.token }, env));

  await makeCall(`Message ${interaction.member?.user.global_name ? `from user ${interaction.member.user.global_name}` : "from unknown user"}: ${option.value}`, callbackUrl, env);
  return { type: InteractionResponseType.DeferredChannelMessageWithSource };
}
