import type { CallStatus } from "twilio/lib/rest/api/v2010/account/call";
import type { GlobalCommand } from "../@types/command";
import config from "../config";
import { createCall } from "../utils/twilio";
import { phoneLogger } from "../utils/logger";

export default {
  description: "Call my phone, preferably during emergencies when I'm not already online",
  options: [
    {
      type: "STRING",
      name: "message",
      description: "The message you want to include in the call",
      required: true,
    },
  ],
  execute: (interaction, { message }: { message: string; }) => Promise.all([
    interaction.reply({
      content: `☎️ *Calling <@${config.DISCORD_OWNER_ID}>...*`,
      allowedMentions: {
        users: [config.DISCORD_OWNER_ID],
      },
    }),
    createCall(`Discord call from guild ${interaction.guild?.name || "UNKNOWN"}, user ${interaction.user.username} says: ${message}`),
  ])
    .then(async ([, call]) => {
      let currentStatus: CallStatus = "queued";
      while (!["completed", "busy", "failed", "no-answer"].includes(currentStatus)) {
        const { status, price, priceUnit, duration } = await call.fetch();
        if (status !== currentStatus) {
          switch (status) {
          case "in-progress": {
            phoneLogger.verbose(`Call in progress: ${JSON.stringify(call.toJSON())}`);
            interaction.editReply("📞 Call in progress.");
            break;
          }
          case "completed": {
            phoneLogger.verbose(`Call completed: ${JSON.stringify(call.toJSON())}`);
            interaction.editReply(`✅ Call finished. Call cost ${price ? `${price} ${priceUnit}` : "~~FREE~~"} and lasted ${parseInt(duration) === 1 ? "1 second" : `${duration} seconds`}.`);
            break;
          }
          case "busy": {
            phoneLogger.verbose(`Call busy: ${JSON.stringify(call.toJSON())}`);
            interaction.editReply("💩 Line is busy.");
            break;
          }
          case "failed": {
            phoneLogger.verbose(`Call failed: ${JSON.stringify(call.toJSON())}`);
            interaction.editReply("💩 Call failed.");
            break;
          }
          case "no-answer": {
            phoneLogger.verbose(`Call without answer: ${JSON.stringify(call.toJSON())}`);
            interaction.editReply("💩 No answer.");
            break;
          }
          }
        }
        currentStatus = status;
      }
    })
    .catch(e => {
      phoneLogger.error(`Error making call: ${JSON.stringify(e)}`);
    }),
} as GlobalCommand;
