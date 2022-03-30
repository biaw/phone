import type { AdminCommand } from "../../@types/command";
import { phoneLogger } from "../../utils/logger";
import { whitelist } from "../../utils/database";

export default {
  description: "Whitelist a user or role so they can use global commands",
  options: [
    {
      type: "STRING",
      name: "id",
      description: "The user ID or role ID to whitelist. Keep in mind that role IDs won't work across servers",
      required: true,
    },
  ],
  execute: async (interaction, { id }: { id: string }) => {
    if (await whitelist.get(id)) {
      void whitelist.delete(id);
      phoneLogger.info(`Removed whitelist entry for user/role ID ${id}.`);
      return interaction.reply("🔓 User or role is no longer whitelisted.");
    }

    void whitelist.set(id, true);
    phoneLogger.info(`Whitelisted user/role ID ${id}.`);
    return interaction.reply("🔒 User or role is now whitelisted.");
  },
} as AdminCommand;
