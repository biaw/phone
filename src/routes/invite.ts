// this endpoint is not locked since the application should either way be set to be private in the developer portal

import { OAuth2Scopes, RouteBases, Routes } from "discord-api-types/v10";

export default function sendInvite(): Response {
  const url = new URL(RouteBases.api + Routes.oauth2Authorization());
  url.searchParams.set("client_id", DISCORD_ID);
  url.searchParams.set("scope", OAuth2Scopes.ApplicationsCommands);

  return Response.redirect(url.toString());
}
