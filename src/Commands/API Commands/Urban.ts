import { Command } from "discord-akairo";
import { Message, MessageEmbed, TextChannel } from "discord.js";
import fetch from "node-fetch";
import { colors } from "../../Configuration/Config";

export default class UrbanCommand extends Command {
  public constructor() {
    super("urban", {
      aliases: ["urban", "urbandictionary"],
      category: "API Commands",
      args: [
        {
          id: "query",
          type: async (_, str: string): Promise<string | string[]> => {
            if (!str) return null;
            const res = await fetch(
              `https://api.urbandictionary.com/v0/define?term=${encodeURIComponent(
                str
              )}`
            );
            const json = await res.json();
            if (!json) return null;

            return json.list[0];
          },
          match: "content",
          prompt: {
            start: `please provide a term to search for.`,
            retry: `please provide a **valid** term to search for`
          }
        }
      ],
      description: {
        content:
          "Displays a definition from the Urban Dictionary, the only *real* dictionary!",
        usage: "urban [ term ]"
      },
      channel: "guild",
      clientPermissions: ["EMBED_LINKS"],
      userPermissions: (msg: Message) => {
        if (!(<TextChannel>msg.channel).nsfw) return "nsfw";

        return null;
      }
    });
  }

  public exec(message: Message, { query }): any {
    let img =
      "https://cdn.discordapp.com/attachments/638917156448501762/673759607923015690/images.png";

    return message.util.send(
      new MessageEmbed()
        .setColor(colors.defaultColor)
        .setAuthor(`Urban Dictionary: ${query.word}`, img, query.permalink)
        .addField("Definition", query.definition)
        .addField("Example", query.example)
        .setFooter(
          `Author: ${query.author} || 👍 ${query.thumbs_up ||
            0} | 👎 ${query.thumbs_down || 0}`
        )
    );
  }
}
