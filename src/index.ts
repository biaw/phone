import handleCallStatusUpdate from "./routes/callStatusUpdate";
import handleInteractionPost from "./routes/interactionPost";
import sendInvite from "./routes/invite";
import handleUpdateCommands from "./routes/updateCommands";

addEventListener("fetch", event => {
  // test environment
  try {
    /* eslint-disable @typescript-eslint/no-unused-expressions */
    DISCORD_ID;
    DISCORD_PUBLIC_KEY;
    DISCORD_TOKEN;
    TWILIO_ACCOUNT_SID;
    TWILIO_AUTH_TOKEN;
    TWILIO_PHONE_NUMBER;
    MY_PHONE_NUMBER;
    FALLBACK_URL;
    /* eslint-enable @typescript-eslint/no-unused-expressions */
  } catch (err) {
    // eslint-disable-next-line no-console
    return event.respondWith(logResponse(new Response("Invalid environment variables", { status: 500 })));
  }

  const { method } = event.request;
  const url = new URL(event.request.url);

  // routes for the owner
  if (method === "GET" && url.pathname === "/update-commands") return event.respondWith(handleUpdateCommands(event.request).then(logResponse));
  if (method === "GET" && url.pathname === "/invite") return event.respondWith(logResponse(sendInvite()));

  // routes for APIs
  if (method === "POST" && url.pathname === "/call-updates") return event.respondWith(handleCallStatusUpdate(event.request).then(logResponse));
  if (method === "POST" && url.pathname === "/interaction") return event.respondWith(handleInteractionPost(event.request).then(logResponse));

  return event.respondWith(logResponse(Response.redirect(FALLBACK_URL)));
});

function logResponse(response: Response): Response {
  // eslint-disable-next-line no-console
  console.log(response.status, response.statusText);
  return response;
}
