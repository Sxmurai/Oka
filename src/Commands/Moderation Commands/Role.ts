import { Command } from "discord-akairo";
import { Message, MessageEmbed, GuildMember } from "discord.js";
import { colors } from "../../Configuration/Config";

export default class RoleCommand extends Command {
  public constructor() {
    super("role", {
      aliases: ["role", "r"],
      category: "Moderation Commands",
      args: [
        {
          id: "method",
          type: ["add", "remove"],
          prompt: {
            start: "please provide a method. Methods: `add`, `remove`",
            retry: "pelase provide a **valid** method. Methods: `add`, `remove`"
          }
        },

        {
          id: "member",
          type: "member",
          prompt: {
            start: "please provide a member",
            retry: "pelase provide a **valid** member"
          }
        },

        {
          id: "role",
          type: "role",
          prompt: {
            start: "please provide a role",
            retry: "please provide a **valid** role"
          }
        },

        {
          id: "reason",
          type: "string",
          match: "rest",
          default: "No reason provided."
        }
      ],
      description: {
        content: "Adds or removes a role from someone.",
        usage:
          "role [ add | remove ] [ @user | id | username ] [ @role | id | name ]"
      },
      clientPermissions: ["MANAGE_ROLES"],
      userPermissions: ["MANAGE_ROLES"]
    });
  }

  public async exec(
    message: Message,
    {
      method,
      member,
      role,
      reason
    }: { method: string; member: GuildMember; role: any; reason: any }
  ) {
    let highestRole = message.guild.roles.find(
      role => role === message.guild.me.roles.highest
    );
    if (member.user.id == message.author.id)
      return message.util.send(
        new MessageEmbed()
          .setColor(colors.red)
          .setDescription(
            `${this.client.emojis.get(
              "660343595626397699"
            )} You cannot ${method} roles with yourself`
          )
      );

    if (role <= highestRole)
      return message.util.send(
        new MessageEmbed()
          .setColor(colors.red)
          .setDescription(
            `${this.client.emojis.get(
              "660343595626397699"
            )} This role is above me. I cannot ${method} that role from that member.`
          )
      );

    if (method == "add") {
      if (member.roles.has(role))
        return message.util.send(
          new MessageEmbed()
            .setColor(colors.red)
            .setDescription(
              `${this.client.emojis.get("660343595626397699")} \`${
                member.user.tag
              }\` already has that role.`
            )
        );

      await member.roles.add(role, reason);

      return message.util.send(
        new MessageEmbed()
          .setColor(colors.defaultColor)
          .setDescription(
            `${this.client.emojis.get(
              "660343594477027330"
            )} Successfully gave: \`${member.user.tag}\` the role: ${role}`
          )
      );
    } else if (method == "remove") {
      if (member.roles.has(role))
        return message.util.send(
          new MessageEmbed()
            .setColor(colors.red)
            .setDescription(
              `${this.client.emojis.get("660343595626397699")} \`${
                member.user.tag
              }\` doesn't has that role.`
            )
        );

      await member.roles.remove(role, reason);

      return message.util.send(
        new MessageEmbed()
          .setColor(colors.defaultColor)
          .setDescription(
            `${this.client.emojis.get(
              "660343594477027330"
            )} Successfully removed: \`${member.user.tag}\` the role: ${role}`
          )
      );
    }
  }
}
