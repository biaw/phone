import type { CallInstance } from "twilio/lib/rest/api/v2010/account/call";
import type Env from "../environment";

export async function validateTwilioSignature(request: Request, params: FormData, env: Env): Promise<boolean> {
  const signature = request.headers.get("X-Twilio-Signature");
  if (!signature) return false;

  const sorted = [...params.entries()].sort(([a], [b]) => a.localeCompare(b));
  const data = sorted.reduce((acc, [key, value]) => `${acc}${key}${value}`, request.url);

  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(env.TWILIO_AUTH_TOKEN), { name: "HMAC", hash: "SHA-1" }, false, ["sign"]);
  const digest = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(data));
  const expected = btoa(String.fromCharCode(...new Uint8Array(digest)));

  return expected === signature;
}

export default async function makeCall(message: string, statusCallback: URL, env: Env): Promise<CallInstance> {
  const endpoint = `https://api.twilio.com/2010-04-01/Accounts/${env.TWILIO_ACCOUNT_SID}/Calls.json`;
  const token = btoa(`${env.TWILIO_ACCOUNT_SID}:${env.TWILIO_AUTH_TOKEN}`);

  const encoded = new URLSearchParams({
    To: env.MY_PHONE_NUMBER,
    From: env.TWILIO_PHONE_NUMBER,
    Twiml: `<Response><Say>${Array<string>(3)
      .fill(message)
      .join("</Say><Pause length=\"3\"/><Say>")
    }</Say></Response>`,
    StatusCallback: statusCallback.toString(),
  });

  ["initiated", "ringing", "answered", "completed"].forEach(status => {
    encoded.append("StatusCallbackEvent", status);
  });

  const response = await fetch(endpoint, {
    body: encoded,
    method: "POST",
    headers: {
      "Authorization": `Basic ${token}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });
  return response.json();
}
