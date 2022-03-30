import config from "../config";
import quick from "quick-store";

const whitelistDatabase = quick("database/whitelist.json");
export const whitelist = {
  async get(key: string): Promise<unknown> {
    return new Promise(resolve => {
      whitelistDatabase.getItem(key, resolve);
    });
  },
  async getAll(): Promise<Record<string, unknown>> {
    return new Promise(resolve => {
      whitelistDatabase.get(resolve);
    });
  },
  async set(key: string, value: boolean): Promise<void> {
    return new Promise(resolve => {
      whitelistDatabase.setItem(key, value, () => resolve(void 0));
    });
  },
  async delete(key: string): Promise<void> {
    return new Promise<void>(resolve => {
      whitelistDatabase.removeItem(key, () => resolve(void 0));
    });
  },
};

void whitelist.set(config.DISCORD_OWNER_ID, true);
