import { Twilio, twiml } from "twilio";
import config from "../config";

export const client = new Twilio(config.TWILIO_ACCOUNT_SID, config.TWILIO_AUTH_TOKEN);

export const createCall = (message: string, to?: string) => client.calls.create({
  twiml: new twiml.VoiceResponse().say(message).toString(),
  to: to || config.OWNER_PHONE_NUMBER,
  from: config.TWILIO_PHONE_NUMBER,
});
