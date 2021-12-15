import config from "../config";
import quick from "quick-store";

const whitelistDatabase = quick("database/whitelist.json");
export const whitelist = {
  get(key: string) {
    return new Promise(resolve => {
      whitelistDatabase.getItem(key, resolve);
    });
  },
  set(key: string, value: boolean) {
    return new Promise(resolve => {
      whitelistDatabase.setItem(key, value, resolve);
    });
  },
  delete(key: string) {
    return new Promise(resolve => {
      whitelistDatabase.removeItem(key, resolve);
    });
  },
};

whitelist.set(config.DISCORD_OWNER_ID, true);
