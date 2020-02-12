import { Command } from "discord-akairo";
import { Message, MessageEmbed } from "discord.js";
import { colors } from "../../Configuration/Config";

export default class PrefixCommand extends Command {
  public constructor() {
    super("prefix", {
      aliases: ["prefix", "setprefix"],
      category: "Moderation Commands",
      args: [
        {
          id: "selected",
          type: "string",
          match: "rest",
          prompt: {
            start: "please provide a prefix"
          }
        }
      ],
      description: {
        content: "Changes the guild prefix",
        usage: "prefix [new prefix]"
      },
      userPermissions: ["MANAGE_GUILD"],
      channel: "guild"
    });
  }

  public exec(message: Message, { selected }: { selected: any }): any {
    this.client.settings.set(message.guild, "config.prefix", selected);

    return message.util.send(
      new MessageEmbed()
        .setColor(colors.defaultColor)
        .setDescription(
          `${this.client.emojis.get(
            "660343594477027330"
          )} Successfully changed the guild prefix to: \`${selected}\``
        )
    );
  }
}
