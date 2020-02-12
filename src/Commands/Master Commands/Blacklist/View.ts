import { Command } from "discord-akairo";
import { Message } from "discord.js";

export default class BlacklistCommand extends Command {
  public constructor() {
    super("view", {
      ownerOnly: true,
      category: "Master Commands",
      args: [
        {
          id: "page",
          type: "number",
          default: 1
        }
      ]
    });
  }

  public exec(
    message: Message,
    { page }: { page: number }
  ): Promise<Message | Message[]> {
    const Blacklist = this.client.settings.get(
      "global",
      "users.blacklisted",
      []
    );

    if (Blacklist.length < 0)
      return message.util.send(
        "There is nobody in the blacklist, therefore there is nothing to show..."
      );

    const itemsPerPage = 10;
    const maxPages = Math.ceil(Blacklist.length / itemsPerPage);

    if (page > maxPages) page = 1;

    const items = Blacklist.map(u => {
      return {
        id: u
      };
    });

    if (maxPages <= 0)
      return message.util.send("Whoo! Nobody has been blacklisted.");

    const toDisplay =
      items.length > itemsPerPage
        ? items.slice(
            (page - 1) * itemsPerPage,
            (page - 1) * itemsPerPage + itemsPerPage
          )
        : items;

    return message.util.send(
      `\`\`\`${toDisplay
        .map(usr => `${usr.id} | ${this.client.users.get(usr.id).tag}`)
        .join("\n")}\`\`\`Page: **${page}/${maxPages}**`
    );
  }
}
