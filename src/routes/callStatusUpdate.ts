import type { CallStatus } from "twilio/lib/rest/api/v2010/account/call";
import { update } from "../utils/discordInteractions";
import { decodeWebhookCredentials } from "../utils/webhookTokens";
import { validate } from "../utils/webtoken";

export default async function handleCallStatusUpdate(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const token = url.searchParams.get("token");

  if (!token) return Response.redirect(FALLBACK_URL);
  if (!await validate(token)) return new Response("", { status: 400 });

  const credentials = decodeWebhookCredentials(token);
  const call = await request.formData();

  const callStatus = call.get("CallStatus") as CallStatus;

  let content = "";
  switch (callStatus) {
    case "ringing": {
      content = `☎️ *Calling...* (${timestamp()})`;
      break;
    }
    case "in-progress": {
      content = `📞 Call in progress. (${timestamp()})`;
      break;
    }
    case "completed": {
      content = "🎉 Call completed.";
      break;
    }
    case "failed": {
      content = "💢 Call failed.";
      break;
    }
    case "no-answer": {
      content = "💤 No answer.";
      break;
    }
    case "busy": {
      content = "🚫 Busy.";
      break;
    }
    default: break;
  }

  if (content) await update(credentials.id, credentials.token, { content });
  return new Response("", { status: 200 });
}

function timestamp(): string {
  return `<t:${Math.floor(Date.now() / 1000)}:R>`;
}
