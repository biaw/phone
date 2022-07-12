import handleCallStatusUpdate from "./routes/callStatusUpdate";
import handleInteractionPost from "./routes/interactionPost";
import handleUpdateCommands from "./routes/updateCommands";
import sendInvite from "./routes/invite";

addEventListener("fetch", event => {
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
