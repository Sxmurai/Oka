import { Command } from "discord-akairo";
import { Message, MessageEmbed } from "discord.js";
import { colors } from "../../Configuration/Config";

export default class MemberCountCommand extends Command {
  public constructor() {
    super("membercount", {
      aliases: ["membercount", "mc"],
      category: "Miscellaneous Commands",
      description: {
        content: "Displays the member count of the guild"
      },
      channel: "guild"
    });
  }

  public exec(message: Message) {
    const presences = {
      online: 0,
      idle: 0,
      dnd: 0,
      offline: 0
    };

    for (const [, user] of message.guild.members)
      presences[user.presence.status]++;
    presences;

    let { online, idle, dnd, offline } = presences;

    const embed = new MessageEmbed()
      .setColor(colors.defaultColor)
      .setThumbnail(message.guild.iconURL())
      .setAuthor(
        `${message.guild.name}'s Member Count`,
        message.guild.iconURL()
      ).setDescription(`
            **Total**: \`${message.guild.memberCount}\`
            **Members**: \`${
              message.guild.members.filter(m => !m.user.bot).size
            }\`
            **Bots**: \`${message.guild.members.filter(m => m.user.bot).size}\`
            
            **${this.client.emojis.get(
              "676984869271633921"
            )} Online**: ${online}
            **${this.client.emojis.get("676984869762367510")} Idle**: ${idle}
            **${this.client.emojis.get(
              "676984869498126336"
            )} Do Not Disturb**: ${dnd}
            **${this.client.emojis.get(
              "676984869422891058"
            )} Offline**: ${offline}`);

    return message.util.send({ embed });
  }
}
