import { config } from "dotenv";
config();

const {
  DISCORD_TOKEN,
  DISCORD_OWNER_ID,
  DISCORD_GUILD_ID,
  TWILIO_ACCOUNT_SID,
  TWILIO_AUTH_TOKEN,
  TWILIO_PHONE_NUMBER,
  OWNER_PHONE_NUMBER,
} = process.env;

if (!DISCORD_TOKEN) throw new Error("Environment variable DISCORD_TOKEN is required");
if (!DISCORD_OWNER_ID) throw new Error("Environment variable DISCORD_OWNER_ID is required");
if (!DISCORD_GUILD_ID) throw new Error("Environment variable DISCORD_GUILD_ID is required");
if (!TWILIO_ACCOUNT_SID) throw new Error("Environment variable TWILIO_ACCOUNT_SID is required");
if (!TWILIO_AUTH_TOKEN) throw new Error("Environment variable TWILIO_AUTH_TOKEN is required");
if (!TWILIO_PHONE_NUMBER) throw new Error("Environment variable TWILIO_PHONE_NUMBER is required");
if (!OWNER_PHONE_NUMBER) throw new Error("Environment variable OWNER_PHONE_NUMBER is required");

export default {
  DISCORD_TOKEN,
  DISCORD_OWNER_ID,
  DISCORD_GUILD_ID,
  TWILIO_ACCOUNT_SID,
  TWILIO_AUTH_TOKEN,
  TWILIO_PHONE_NUMBER,
  OWNER_PHONE_NUMBER,
};
