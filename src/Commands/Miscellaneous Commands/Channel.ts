import { Command } from "discord-akairo";
import { Message, MessageEmbed } from "discord.js";
import { colors } from "../../Configuration/Config";

export default class ChannelCommand extends Command {
  public constructor() {
    super("channelinfo", {
      aliases: ["channelinfo", "chinfo"],
      category: "Miscellaneous Commands",
      args: [
        {
          id: "channel",
          type: "channel",
          prompt: {
            start: `please provide a channel`,
            retry: `please provide a **valid** channel.`
          }
        }
      ],
      description: {
        content: "Displays the information about a channel",
        usage: "channel [ #channel | id | name ]"
      },
      channel: "guild"
    });
  }

  public exec(message: Message, { channel }): any {
    let types = {
      dm: "Direct Messages",
      text: "Text Channel",
      voice: "Voice Channel",
      category: "Category",
      news: "News Channel",
      store: "GuildStore Channel",
      unknown: "Unknown"
    };

    const embed = new MessageEmbed()
      .setColor(colors.defaultColor)
      .setAuthor(`Channels | ${channel.name}`, message.guild.iconURL())
      .addField("Channel Name", `\`${channel.name}\``, true)
      .addField("Channel ID", `\`${channel.id}\``, true)
      .addField("Channel Type", `\`${types[channel.type]}\``, true)
      .addField(
        "Channel Created At",
        `\`${new Date(channel.createdAt).toLocaleString("en-US")}\``,
        true
      )
      .addField(
        "Channel Category",
        `${channel.parent ? channel.parent.name : "`None`"}`,
        true
      )
      .addField("Position", `\`${channel.rawPosition}\``, true)
      .addField(
        "Last Message",
        `${
          channel.lastMessage
            ? `[Click Me!](${channel.lastMessage.url})`
            : "`None`"
        }`,
        true
      )
      .addField(
        "Slowmode",
        `${
          channel.rateLimitPerUser ? `\`${channel.rateLimitPerUser}s\`` : "`0s`"
        }`,
        true
      )
      .addField("NSFW", `${channel.nsfw ? "`True`" : "`No`"}`, true)
      .addField(
        "Topic",
        `${channel.topic ? channel.topic.substr(0, 50) : "`None`"}`
      );
    return message.util.send({ embed: embed });
  }
}
