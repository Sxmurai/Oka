import { Command } from "discord-akairo";
import { Message, MessageEmbed } from "discord.js";

export default class RoleCommand extends Command {
  public constructor() {
    super("roleinfo", {
      aliases: ["roleinfo", "rinfo"],
      category: "Miscellaneous Commands",
      args: [
        {
          id: "role",
          type: "role",
          prompt: {
            start: `please provide a role`,
            retry: `please provide a **valid** role`
          }
        }
      ],
      description: {
        content: "Displays information about a role",
        usage: "roleinfo [ @role | id | name ]"
      },
      channel: "guild"
    });
  }

  public exec(message: Message, { role }): any {
    const embed = new MessageEmbed()
      .setColor(role.hexColor)
      .setAuthor(`Roles | ${role.name}`, message.guild.iconURL())
      .addField("Role Name", `\`${role.name}\``, true)
      .addField("Role ID", `\`${role.id}\``, true)
      .addField("Role Position", `\`${role.position}\``, true)
      .addField(
        "Role Mentionable",
        `\`${role.mentionable ? "True" : "False"}\``,
        true
      )
      .addField("Members with role", `\`${role.members.size}\``, true)
      .addField("Role Hex Color", `\`${role.hexColor}\``, true)
      .addField(
        "Role Created At",
        `\`${new Date(role.createdAt).toLocaleString("en-US")}\``,
        true
      )
      .addField("Role Hoisted", `\`${role.hoist ? "True" : "False"}\``, true)
      .addField("Role Managed", `\`${role.managed ? "True" : "False"}\``, true)
      .addField(
        "Role Permissions",
        `\`\`\`${this.permissionFormat(role.permissions.toArray()) ||
          "None"}\`\`\``
      );
    return message.util.send({ embed: embed });
  }

  permissionFormat(permissions: string[]) {
    const result = permissions.map(
      str =>
        `${str
          .replace(/_/g, " ")
          .toLowerCase()
          .replace(/\b(\w)/g, char => char.toUpperCase())}`
    );

    return result.length > 1
      ? `${result.slice(0, -1).join(", ")} and ${result.slice(-1)[0]}`
      : result[0];
  }
}
