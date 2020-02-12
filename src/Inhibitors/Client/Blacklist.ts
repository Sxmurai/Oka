import { Inhibitor } from "discord-akairo";
import { Message } from "discord.js";

export default class BlacklistInhibitor extends Inhibitor {
  public constructor() {
    super("blacklist", {
      reason: "blacklist",
      type: "all"
    });
  }

  public exec(message: Message): any {
    const Blacklist = this.client.settings.get(
      "global",
      "users.blacklisted",
      []
    );
    return Blacklist.includes(message.author.id);
  }
}
