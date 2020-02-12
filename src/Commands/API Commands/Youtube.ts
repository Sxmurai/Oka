import { Command } from "discord-akairo";
import { Message, MessageEmbed, TextChannel } from "discord.js";
import Youtube from "youtube-search";
import { colors } from "../../Configuration/Config";

export default class YoutubeCommand extends Command {
  public constructor() {
    super("youtube", {
      aliases: ["youtube", "youtubesearch"],
      category: "API Commands",
      args: [
        {
          id: "query",
          type: "string",
          match: "content",
          prompt: {
            start: "please provide a youtube channel"
          }
        }
      ],
      description: {
        content: "Searches up the selected YouTube channel",
        usage: "youtube [ query ]"
      },
      channel: "guild",
      userPermissions: (msg: Message) => {
        if (!(<TextChannel>msg.channel).nsfw) return "nsfw";

        return null;
      }
    });
  }

  public exec(message: Message, { query }: { query: any }) {
    const options = {
      maxResults: 1,
      key: process.env.YOUTUBE
    };

    Youtube(query, options, (error, response) => {
      if (!response[0] || error)
        return message.util.send(
          new MessageEmbed()
            .setColor(colors.red)
            .setDescription(
              `${this.client.emojis.get(
                "660343595626397699"
              )} The query: \`${query}\` was not found.`
            )
        );

      return message.util.send(
        new MessageEmbed()
          .setColor(colors.defaultColor)
          .setThumbnail(response[0].thumbnails.high.url)
          .setAuthor(
            `${message.author.tag} | ${response[0].channelTitle}`,
            response[0].thumbnails.high.url,
            response[0].link
          )
          .addField(
            "Joined YouTube",
            `\`${new Date(response[0].publishedAt).toLocaleString("en-US")}\``,
            true
          )
          .addField(`Channel ID`, `\`${response[0].channelId}\``, true)
          .addField(
            "Channel Link",
            `[${response[0].channelTitle}](${response[0].link})`,
            true
          )
          .addField("Channel Description", response[0].description)
      );
    });
  }
}
