import type { ApplicationCommandOptionData, CommandInteraction, CommandInteractionOption } from "discord.js";

export interface Command {
  description: string;
  options?: ApplicationCommandOptionData[];
  execute(interaction: CommandInteraction, args: CommandArguments): Promise<void>;
}

// expandable types
export type GlobalCommand = Command;
export type AdminCommand = Command;

export type CommandArguments = Record<string, CommandInteractionOption["value"]>;
