import { AdminCommand } from "../../@types/command";
import { phoneLogger } from "../../utils/logger";
import { whitelist } from "../../utils/database";

export default {
  description: "Whitelist a user so they can use global commands",
  options: [
    {
      type: "STRING",
      name: "id",
      description: "The user ID to whitelist.",
      required: true,
    },
  ],
  execute: async (interaction, { id }: { id: string; }) => {
    if (await whitelist.get(id)) {
      whitelist.delete(id);
      phoneLogger.info(`Removed whitelist entry for user ID ${id}.`);
      return interaction.reply("🔓 User is no longer whitelisted.");
    }

    whitelist.set(id, true);
    phoneLogger.info(`Whitelisted user ID ${id}.`);
    return interaction.reply("🔒 User is now whitelisted.");
  },
} as AdminCommand;
