import type { CallInstance } from "twilio/lib/rest/api/v2010/account/call";

const token = btoa(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`);

export default async function makeCall(message: string, statusCallback: URL): Promise<CallInstance> {
  const endpoint = `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Calls.json`;

  const headers = new Headers();
  headers.set("Authorization", `Basic ${token}`);
  headers.set("Content-Type", "application/x-www-form-urlencoded");

  const body = new URLSearchParams();
  body.append("To", MY_PHONE_NUMBER);
  body.append("From", TWILIO_PHONE_NUMBER);
  body.append("Twiml", `<Response><Say>${
    Array<string>(3)
      .fill(message)
      .join("</Say><Pause length=\"3\"/><Say>")
  }</Say></Response>`);
  body.append("StatusCallback", statusCallback.toString());
  ["initiated", "ringing", "answered", "completed"].forEach(status => {
    body.append("StatusCallbackEvent", status);
  });

  const response = await fetch(endpoint, { method: "POST", headers, body, cf: { cacheTtl: 0 } });
  return response.json();
}
