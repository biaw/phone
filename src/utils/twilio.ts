import { Twilio, twiml } from "twilio";
import type { CallInstance } from "twilio/lib/rest/api/v2010/account/call";
import config from "../config";

export const client = new Twilio(config.TWILIO_ACCOUNT_SID, config.TWILIO_AUTH_TOKEN);

export const createCall = async (message: string, to?: string): Promise<CallInstance> => client.calls.create({
  // eslint-disable-next-line @typescript-eslint/no-base-to-string
  twiml: new twiml.VoiceResponse()
    .say(message)
    .toString(),
  to: to ?? config.OWNER_PHONE_NUMBER,
  from: config.TWILIO_PHONE_NUMBER,
});
