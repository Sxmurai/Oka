import { Command } from "discord-akairo";
import { Message, MessageEmbed } from "discord.js";

export default class RolesCommand extends Command {
  public constructor() {
    super("roles", {
      aliases: ["roles", "guildroles", "serveroles"],
      category: "Miscellaneous Commands",
      args: [
        {
          id: "page",
          type: "number",
          default: 1
        }
      ],
      channel: "guild",
      description: {
        content: "Displays all of the roles in the guild"
      }
    });
  }

  public exec(message: Message, { page }: { page: number }) {
    if (message.guild.roles.size == 0)
      return message.util.send("Whoopies, this guild doesn't have any roles!");

    const itemsPerPage = 10;
    const maxPages = Math.ceil(message.guild.roles.size / itemsPerPage);

    if (page > maxPages) page = 1;

    const items = message.guild.roles
      .sort((a, b) => b.position - a.position)
      .map(r => {
        return {
          name: r.name,
          id: r.id,
          members: r.members.size
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
      `Name | ID | Members\`\`\`${toDisplay
        .map(
          role =>
            `${role.name.replace(/[^\x00-\x7F]/g, "")}${" ".repeat(
              Math.floor(
                Math.max(...message.guild.roles.map(role => role.name.length))
              ) + -role.name.replace(/[^\x00-\x7F]/g, "").length
            )} | ${role.id} | ${role.members}`
        )
        .join("\n")}\`\`\`Page: ${page}/${maxPages}`
    );
  }
}
