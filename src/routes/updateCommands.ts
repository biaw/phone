// to avoid abuse, check if the request is from the owner by checking the key parameter against the public key

import type { RESTPutAPIApplicationCommandsJSONBody } from "discord-api-types/v10";
import { ApplicationCommandOptionType, ApplicationCommandType, RouteBases, Routes } from "discord-api-types/v10";

export default async function handleUpdateCommands(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const key = url.searchParams.get("key");

  if (!key) return new Response("", { status: 400 });
  if (key !== DISCORD_PUBLIC_KEY) return new Response("", { status: 403 });

  return fetch(RouteBases.api + Routes.applicationCommands(DISCORD_ID), {
    method: "PUT",
    headers: { "Authorization": `Bot ${DISCORD_TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify([
      {
        type: ApplicationCommandType.ChatInput,
        name: "call",
        description: "Call my phone, preferably during emergencies when I'm not already online",
        options: [
          {
            type: ApplicationCommandOptionType.String,
            name: "message",
            description: "The message you want to deliver",
            required: true,
          },
        ],
        /* eslint-disable camelcase */
        // 0 disables it for everyone. the user will have to override the command themselves in the interactions manager in the servers it's added to
        default_member_permissions: "0",
        default_permission: false,
        dm_permission: false,
        /* eslint-enable camelcase */
      },
    ] as RESTPutAPIApplicationCommandsJSONBody),
    cf: { cacheTtl: 0 },
  })
    .then(async res => {
      if (res.status === 200) return new Response(await res.text(), { status: 200 });
      return new Response(await res.text(), { status: res.status });
    })
    .catch(err => new Response(String(err), { status: 500 }));
}
