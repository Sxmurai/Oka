import { Command } from "discord-akairo";
import { Message } from "discord.js";

export default class GuildsCommand extends Command {
  public constructor() {
    super("guilds", {
      aliases: ["guilds", "servers"],
      category: "Master Commands",
      args: [
        {
          id: "page",
          type: "number",
          default: 1
        }
      ],
      ownerOnly: true
    });
  }

  public async exec(
    message: Message,
    { page }: { page: number }
  ): Promise<Message | Message[]> {
    const itemsPerPage = 10;
    const maxPages = Math.ceil(this.client.guilds.size / itemsPerPage);

    if (page > maxPages) page = 1;

    const items = this.client.guilds.map(g => {
      return {
        ID: g.id,
        Name: g.name,
        Members: g.memberCount
      };
    });

    const toDisplay =
      items.length > itemsPerPage
        ? items.slice(
            (page - 1) * itemsPerPage,
            (page - 1) * itemsPerPage + itemsPerPage
          )
        : items;

    return message.util.send(
      `\`\`\`${toDisplay
        .map(
          g =>
            `${g.Name.replace(/[^\x00-\x7F]/g, "")}${" ".repeat(
              Math.floor(
                Math.max(...this.client.guilds.map(g => g.name.length))
              ) + -g.Name.replace(/[^\x00-\x7F]/g, "").length
            )} | ${g.ID} | ${g.Members}`
        )
        .join("\n")}\`\`\`\nPage: **${page}/${maxPages}**`
    );
  }
}
