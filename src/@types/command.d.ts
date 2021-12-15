import { ApplicationCommandOptionData, CommandInteraction } from "discord.js";

export type Command = {
  description: string;
  options?: Array<ApplicationCommandOptionData>;
  execute(interaction: CommandInteraction, args: CommandArguments): Promise<void>;
}

// expandable types
export type GlobalCommand = Command;
export type AdminCommand = Command;

export type CommandArguments = {
  [argument: string]: CommandInteractionOption["value"];
}
