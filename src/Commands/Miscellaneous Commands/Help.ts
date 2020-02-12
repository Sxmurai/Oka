import { Command } from "discord-akairo";
import { Message, MessageEmbed } from "discord.js";
import { colors } from "../../Configuration/Config";

export default class HelpCommand extends Command {
  public constructor() {
    super("help", {
      aliases: ["help", "commands", "helpum"],
      category: "Miscellaneous Commands",
      args: [
        {
          id: "command",
          type: "commandAlias"
        }
      ],
      description: {
        content: "Displays all of the commands the bot has.",
        usage: "help < command >"
      },
      cooldown: 6000,
      ratelimit: 2
    });
  }

  public exec(message: Message, { command }: { command: Command }) {
    if (!command) {
      const embed = new MessageEmbed()
        .setColor(colors.defaultColor)
        .setAuthor(
          `Commands Menu | ${
            message.guild ? message.guild.name : message.author.username
          }`,
          message.guild
            ? message.guild.iconURL()
            : message.author.displayAvatarURL()
        );

      for (const category of this.handler.categories.values()) {
        embed.addField(
          `${category.size} | **${category.id.replace(/(\b\w)/gi, lc =>
            lc.toUpperCase()
          )}**`,
          `${category
            .filter(cmd => cmd.aliases.length > 0)
            .map(cmd => `\`${cmd.aliases[0]}\``)
            .join(" ")}`
        );
      }

      return message.util.send({ embed });
    }

    let {
      aliases,
      clientPermissions,
      userPermissions,
      description,
      cooldown,
      ratelimit,
      ownerOnly
    } = command;

    return message.util.send(
      new MessageEmbed()
        .setColor(colors.defaultColor)
        .setAuthor(
          `${aliases[0].replace(/(\b\w)/gi, lc => lc.toUpperCase())} | ${
            message.guild ? message.guild.name : message.author.username
          }`,
          message.guild
            ? message.guild.iconURL()
            : message.author.displayAvatarURL()
        ).setDescription(`
      **Aliases**: ${aliases.map(alias => `\`${alias}\``).join(", ")}
      **Owner Only**: \`${ownerOnly == true ? "Yes" : "No"}\`
      **Cooldown | Ratelimit**: \`${cooldown || 0}s\` | \`${ratelimit || 1}\`
      **Usage**: ${description.usage || aliases[0]}
      **Description**: ${description.content || aliases[0]}`)
    );
  }
}
