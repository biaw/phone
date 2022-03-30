import type { ApplicationCommandData } from "discord.js";
import type { Command } from "../src/@types/command";
import { join } from "path";
import { readdirSync } from "fs";

Object.assign(process.env, {
  DISCORD_TOKEN: "********",
  DISCORD_OWNER_ID: "110090225929191424",
  DISCORD_GUILD_ID: "436571887263285249",
  TWILIO_ACCOUNT_SID: "AC*******",
  TWILIO_AUTH_TOKEN: "********",
  TWILIO_PHONE_NUMBER: "+44********",
  OWNER_PHONE_NUMBER: "+47********",
}, process.env); // avoid config to fail during tests. before you ask: yes, "process.env" is twice on purpose

testCommands();
testCommands("admin");

function testCommands(path = "") {
  const commands: Array<ApplicationCommandData> = [];
  const files = readdirSync(join(__dirname, "..", "build", "commands", path));
  for (const file of files) {
    if (file.endsWith(".js")) {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { description, options }: Command = require(join(__dirname, "..", "build", "commands", path, file)).default;
      commands.push({
        name: file.split(".")[0],
        description,
        ...options && { options },
        type: "CHAT_INPUT",
      });
    }
  }

  describe(`${path || "global"} commands`, () => {
    commands.forEach(command => {
      describe(`command ${command.name}`, () => {
        if (command.type === "CHAT_INPUT") {
          it("should have a valid name", () => expect(command.name).toMatch(/^[\w-]{1,32}$/));
          it("should have a valid description", () => {
            expect(command.description.length).toBeGreaterThanOrEqual(1);
            expect(command.description.length).toBeLessThanOrEqual(100);
          });

          describe("command options", () => {
            it("should be a list of maximum 25 options", () => expect(command.options?.length ?? 0).toBeLessThanOrEqual(25));
            command.options?.forEach(option => {
              describe(`option ${option.name}`, () => {
                it("should have a valid name", () => expect(option.name).toMatch(/^[\w-]{1,32}$/));
                it("should have a valid description", () => {
                  expect(option.description.length).toBeGreaterThanOrEqual(1);
                  expect(option.description.length).toBeLessThanOrEqual(100);
                });
              });
            });
          });
        }

        it("should have a valid execute function", async () => expect((await import(`../build/commands/${path}/${command.name}`)).default.execute).toBeInstanceOf(Function));
      });
    });
  });
}
