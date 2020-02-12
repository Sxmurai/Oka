import { Command } from "discord-akairo";
import { Message, MessageEmbed, GuildMember } from "discord.js";
import { colors } from "../../Configuration/Config";

export default class KickCommand extends Command {
  public constructor() {
    super("kick", {
      aliases: ["kick", "k", "kickum"],
      category: "Moderation Commands",
      args: [
        {
          id: "member",
          type: "member",
          prompt: {
            start: `please provide a member to kick`,
            retry: `please provide a **valid** member to kick.`
          }
        },

        {
          id: "reason",
          type: "string",
          match: "rest",
          default: "No reason provided by moderator."
        }
      ],
      description: {
        content: "Kicks a member from the guild",
        usage: "kick [ @member | id | username ] < reason >"
      },
      clientPermissions: ["KICK_MEMBERS"],
      userPermissions: ["KICK_MEMBERS"],
      channel: "guild"
    });
  }

  public async exec(message: Message, { member, reason }: { member: GuildMember; reason: any }): Promise<Message | Message[]> {
    if (member.user.id == message.author.id)
      return message.util.send(
        new MessageEmbed()
          .setColor(colors.red)
          .setDescription(
            `${this.client.emojis.get(
              "660343595626397699"
            )} You cannot kick yourself!`
          )
      );

    if (!member.kickable)
      return message.util.send(
        new MessageEmbed()
          .setColor(colors.red)
          .setDescription(
            `${this.client.emojis.get(
              "660343595626397699"
            )} I couldn't kick: \`${
              member.user.tag
            }\` because they are higher/the same rank than me.`
          )
      );

    if (member.permissions.has("ADMINISTRATOR"))
      return message.util.send(
        new MessageEmbed()
          .setColor(colors.red)
          .setDescription(
            `${this.client.emojis.get(
              "660343595626397699"
            )} I couldn't kick: \`${
              member.user.tag
            }\` because they are an Administrator.`
          )
      );

    let memberHighest = message.guild.roles.find(
      role => role === member.roles.highest
    );
    if (memberHighest >= message.member.roles.highest)
      return message.util.send(
        new MessageEmbed()
          .setColor(colors.red)
          .setDescription(
            `${this.client.emojis.get(
              "660343595626397699"
            )} You cannot kick someone that is higher/the same rank than you!`
          )
      );

    try {
      await member.kick(reason);
      return message.util
        .send(
          new MessageEmbed()
            .setColor(colors.defaultColor)
            .setDescription(
              `${this.client.emojis.get(
                "660343594477027330"
              )} Successfully banned \`${member.user.tag}\` for: \`${reason}\``
            )
        )
        .then(m => m.delete({ timeout: 15000 }));
    } catch {
      return message.util.send(
        new MessageEmbed()
          .setColor(colors.red)
          .setDescription(
            `${this.client.emojis.get("660343595626397699")} Couldn't kick: \`${
              member.user.tag
            }\`.`
          )
      );
    }
  }
}
