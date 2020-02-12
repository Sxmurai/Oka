import { Command, Flag } from "discord-akairo";
import { Message } from "discord.js";

export default class BlacklistCommand extends Command {
  public constructor() {
    super("blacklist", {
      aliases: ["blacklist", "botban"],
      category: "Master Commands",
      ownerOnly: true,
      description: {
        content: "Displays | Adds | Removes from a blacklist",
        usage: "blacklist < add | remove | view > < user >"
      }
    });
  }

  public *args(): object {
    const method = yield {
      type: [
        ["add", "ban-add", "blacklist-add"],
        ["remove", "delete", "blacklist-remove"],
        ["view", "list"]
      ],

      otherwise: (msg: Message) => {
        //@ts-ignore
        const prefix = this.handler.prefix(msg);

        return `Invalid Method! Please choose from one of these methods by re-running the command..\`\`\`\nadd    | ban-add | blacklist-add    - Adds someone to the blacklist\nremove | delete  | blacklist-remove - Removes someone from the blacklist\nview   | list                       - The blacklist list.\`\`\``;
      }
    };

    return Flag.continue(method);
  }
}
