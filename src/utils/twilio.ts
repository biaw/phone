import type { CallInstance } from "twilio/lib/rest/api/v2010/account/call";

export default async function makeCall(message: string, statusCallback: URL): Promise<CallInstance> {
  const endpoint = `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Calls.json`;
  const token = btoa(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`);

  const encoded = new URLSearchParams({
    To: MY_PHONE_NUMBER,
    From: TWILIO_PHONE_NUMBER,
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
