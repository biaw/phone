import type { RESTPutAPIApplicationCommandsJSONBody } from "discord-api-types/v10";
import { ApplicationCommandOptionType, ApplicationCommandType, RouteBases, Routes } from "discord-api-types/v10";
import type Env from "../environment";

export default async function handleUpdateCommands(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);
  const key = url.searchParams.get("key");

  if (!key) return new Response("", { status: 400 });
  if (key !== env.DISCORD_PUBLIC_KEY) return new Response("", { status: 403 });

  return fetch(RouteBases.api + Routes.applicationCommands(env.DISCORD_ID), {
    method: "PUT",
    headers: { "Authorization": `Bot ${env.DISCORD_TOKEN}`, "Content-Type": "application/json" },
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
    .catch((err: unknown) => new Response(String(err), { status: 500 }));
}
