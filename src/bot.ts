import { discordLogger, phoneLogger } from "./utils/logger";
import { Client } from "discord.js";
import config from "./config";
import interactions from "./handlers/interactions";

const client = new Client({
  userAgentSuffix: [
    `Responsible is ${config.DISCORD_OWNER_ID}`,
    "Source: https://github.com/promise/phone",
  ],
  intents: ["GUILDS"],
});

client.once("ready", trueClient => {
  phoneLogger.info(`Discord client is connected as ${trueClient.user.tag}`);

  if (!trueClient.guilds.resolve(config.DISCORD_GUILD_ID)) {
    phoneLogger.warn(`Add the bot to your admin server with this link and restart to set up admin commands: ${trueClient.generateInvite({
      scopes: ["bot", "applications.commands"],
    })}`);
  }

  interactions(trueClient);
});

client
  .on("debug", info => void discordLogger.debug(info))
  .on("error", error => void discordLogger.error(`Cluster errored. ${JSON.stringify({ ...error })}`))
  .on("rateLimit", rateLimitData => void discordLogger.warn(`Rate limit ${JSON.stringify(rateLimitData)}`))
  .on("ready", () => void discordLogger.info("All shards have been connected."))
  .on("shardDisconnect", (event, id) => void discordLogger.warn(`Shard ${id} disconnected. ${JSON.stringify({ ...event })}`))
  .on("shardError", (error, id) => void discordLogger.error(`Shard ${id} errored. ${JSON.stringify({ ...error })}`))
  .on("shardReady", id => void discordLogger.info(`Shard ${id} is ready.`))
  .on("shardReconnecting", id => void discordLogger.warn(`Shard ${id} is reconnecting.`))
  .on("shardResume", (id, replayed) => void discordLogger.info(`Shard ${id} resumed. ${replayed} events replayed.`))
  .on("warn", info => void discordLogger.warn(info))
  .login(config.DISCORD_TOKEN);
