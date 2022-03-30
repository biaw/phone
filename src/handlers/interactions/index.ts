import type { AdminCommand, Command, CommandArguments, GlobalCommand } from "../../@types/command";
import type { ApplicationCommandData, Client, CommandInteractionOptionResolver } from "discord.js";
import config from "../../config";
import { join } from "path";
import { phoneLogger } from "../../utils/logger";
import { readdir } from "fs/promises";
import { whitelist } from "../../utils/database";

export default async (client: Client<true>): Promise<void> => {
  const commands = await getCommands("../../commands");
  void client.application.commands.set(commands);

  const adminCommands = await getCommands("../../commands/admin");
  void client.guilds.resolve(config.DISCORD_GUILD_ID)?.commands.set(adminCommands);

  client.on("interactionCreate", async interaction => {
    if (interaction.isCommand()) {
      const adminCommand = adminCommands.find(command => command.name === interaction.commandName);
      if (adminCommand && interaction.guildId === config.DISCORD_GUILD_ID) {
        if (interaction.user.id !== config.DISCORD_OWNER_ID) {
          return interaction.reply({
            content: "⛔ You are not allowed to use this command.",
            ephemeral: true,
          });
        }
        const { execute } = (await import(`../../commands/admin/${adminCommand.name}`) as { default: AdminCommand }).default;
        return void execute(interaction, convertArguments(interaction.options.data));
      }

      const globalCommand = commands.find(command => command.name === interaction.commandName);
      if (globalCommand) {
        const member = interaction.member ?? { roles: [] as string[] };
        const memberRoles = Array.isArray(member.roles) ? member.roles : member.roles.cache.map(role => role.id);
        if (!Object.keys(await whitelist.getAll()).some(id => [interaction.user.id, ...memberRoles].includes(id))) {
          return interaction.reply({
            content: "⛔ You are not allowed to use this command.",
            ephemeral: true,
          });
        }
        // eslint-disable-next-line @typescript-eslint/unbound-method
        const { execute } = (await import(`../../commands/${globalCommand.name}.js`) as { default: GlobalCommand }).default;
        return void execute(interaction, convertArguments(interaction.options.data));
      }
    }

    // if the interaction has been handled then it would've returned before this line
    phoneLogger.info(`Unknown interaction: ${JSON.stringify(interaction.toJSON())}`);
  });
};

async function getCommands(path: string): Promise<ApplicationCommandData[]> {
  return new Promise((resolve, reject) => {
    readdir(join(__dirname, path))
      .then(async files => {
        const commands: ApplicationCommandData[] = [];

        for (const file of files) {
          if (file.endsWith(".js")) {
            const { description, options } = (await import(`${path}/${file}`) as { default: Command }).default;
            commands.push({
              name: file.split(".")[0],
              description,
              ...options && { options },
            });
          }
        }

        resolve(commands);
      })
      .catch(reject);
  });
}

function convertArguments(options: CommandInteractionOptionResolver["data"]): CommandArguments {
  const args: CommandArguments = {};
  for (const option of options) args[option.name] = option.value;
  return args;
}
