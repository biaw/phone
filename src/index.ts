import handleCallStatusUpdate from "./routes/callStatusUpdate";
import handleInteractionPost from "./routes/interactionPost";
import sendInvite from "./routes/invite";
import handleUpdateCommands from "./routes/updateCommands";

export default {
  fetch(request) {
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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log("Invalid environment variables");
      return new Response("Invalid environment variables", { status: 500 });
    }

    switch (request.method) {
      case "GET":
        switch (new URL(request.url).pathname) {
          case "/update-commands": return handleUpdateCommands(request).then(logResponse);
          case "/invite": return logResponse(sendInvite());
          default: return logResponse(Response.redirect(FALLBACK_URL, 307));
        }
      case "POST":
        switch (new URL(request.url).pathname) {
          case "/call-updates": return handleCallStatusUpdate(request).then(logResponse);
          case "/interaction": return handleInteractionPost(request).then(logResponse);
          default: return logResponse(new Response("Method Not Allowed", { status: 405 }));
        }
      default: return logResponse(new Response("Method Not Allowed", { status: 405 }));
    }
  },
} satisfies ExportedHandler;

function logResponse(response: Response): Response {
  // eslint-disable-next-line no-console
  console.log(response.status, response.statusText);
  return response;
}
