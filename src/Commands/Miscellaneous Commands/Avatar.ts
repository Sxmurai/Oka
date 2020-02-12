import { Command } from "discord-akairo";
import { Message, MessageEmbed, GuildMember } from "discord.js";
import { colors } from "../../Configuration/Config";

export default class AvatarCommand extends Command {
  public constructor() {
    super("avatar", {
      aliases: ["avatar", "profilepicture", "pfp", "av"],
      category: "Miscellaneous Commands",
      args: [
        {
          id: "member",
          type: "member",
          default: (_: Message) => _.member
        }
      ]
    });
  }

  public exec(message: Message, { member }: { member: GuildMember }) {
    return message.util.send(
      new MessageEmbed()
        .setAuthor(
          `${
            member.id == message.author.id ? "Your" : `${member.user.tag}'s`
          } Avatar`,
          member.user.displayAvatarURL(),
          member.user.displayAvatarURL()
        )
        .setColor(colors.defaultColor)
        .setImage(member.user.displayAvatarURL({ dynamic: true, size: 2048 }))
    );
  }
}
