import { Command } from "discord-akairo";
import { Message, User } from "discord.js";

export default class UsersCommand extends Command {
  public constructor() {
    super("users", {
      aliases: ["users", "allusers"],
      category: "Master Commands",
      args: [
        {
          id: "page",
          type: "number",
          default: 1
        }
      ],
      ownerOnly: true,
      description: {
        content: "Pages out the users",
        usage: "users < page >"
      }
    });
  }

  public exec(
    message: Message,
    { page }: { page: number }
  ): Promise<Message | Message[]> {
    const itemsPerPage = 15;
    const maxPages = Math.ceil(this.client.users.size / itemsPerPage);

    if (page > maxPages) page = 1;

    const items = this.client.users
      .sort((a: any, b: any) => a.createdAt - b.createdAt)
      .map((user: any) => {
        return {
          id: user.id,
          name: user.username,
          at: new Date(user.createdAt).toLocaleString("en-GB", {
            timeZone: "UTC",
            hour12: false
          })
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
          u =>
            `${u.name.replace(/[^\x00-\x7F]/g, "")}${" ".repeat(
              Math.floor(
                Math.max(...this.client.users.map(g => g.username.length))
              ) + -u.name.replace(/[^\x00-\x7F]/g, "").length
            )} | ${u.id} | ${u.at}`
        )
        .join("\n")}\`\`\`\nPage: **${page}/${maxPages}**`
    );
  }
}
