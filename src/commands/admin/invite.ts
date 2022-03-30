import type { AdminCommand } from "../../@types/command";

export default {
  description: "Get a shareable invite",
  execute: async interaction => interaction.reply(`🔗 <${interaction.client.generateInvite({ scopes: ["applications.commands"]})}>`),
} as AdminCommand;
