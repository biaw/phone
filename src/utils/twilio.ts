import type { CallInstance } from "twilio/lib/rest/api/v2010/account/call";

const token = btoa(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`);

export async function call(message: string, statusCallback: URL): Promise<CallInstance> {
  const endpoint = `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Calls.json`;

  const headers = new Headers();
  headers.set("Authorization", `Basic ${token}`);
  headers.set("Content-Type", "application/x-www-form-urlencoded");

  const body = new URLSearchParams();
  body.append("To", MY_PHONE_NUMBER);
  body.append("From", TWILIO_PHONE_NUMBER);
  body.append("Twiml", `<Response><Say>${message}</Say></Response>`);
  body.append("StatusCallback", statusCallback.toString());
  ["initiated", "ringing", "answered", "completed"].forEach(status => {
    body.append("StatusCallbackEvent", status);
  });

  const response = await fetch(endpoint, { method: "POST", headers, body });
  return response.json();
}
