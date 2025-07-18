import type Env from "./environment";
import handleCallStatusUpdate from "./routes/callStatusUpdate";
import handleInteractionPost from "./routes/interactionPost";
import sendInvite from "./routes/invite";
import handleUpdateCommands from "./routes/updateCommands";

export default {
  fetch(request, env) {
    switch (request.method) {
      case "GET":
        switch (new URL(request.url).pathname) {
          case "/update-commands": return handleUpdateCommands(request, env).then(logResponse);
          case "/invite": return logResponse(sendInvite(env));
          default: return logResponse(Response.redirect(env.FALLBACK_URL, 307));
        }
      case "POST":
        switch (new URL(request.url).pathname) {
          case "/call-updates": return handleCallStatusUpdate(request, env).then(logResponse);
          case "/interaction": return handleInteractionPost(request, env).then(logResponse);
          default: return logResponse(new Response("Method Not Allowed", { status: 405 }));
        }
      default: return logResponse(new Response("Method Not Allowed", { status: 405 }));
    }
  },
} satisfies ExportedHandler<Env>;

function logResponse(response: Response): Response {
  // eslint-disable-next-line no-console
  console.log(response.status, response.statusText);
  return response;
}
