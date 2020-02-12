import { Command } from "discord-akairo";
import { Message, MessageEmbed } from "discord.js";
import { colors } from "../../Configuration/Config";

export default class PingCommand extends Command {
  public constructor() {
    super("ping", {
      aliases: ["ping", "latency"],
      category: "Miscellaneous Commands",
      description: {
        content: "Displays the latency of the bot."
      }
    });
  }

  public async exec(message: Message) {
    const sent = await message.util.send("Retriving ping...");
    const timeDiff = sent.createdTimestamp - message.createdTimestamp;

    return message.util.send(
      new MessageEmbed()
        .setColor(colors.defaultColor)
        .setTitle("🏓 | Pong!")
        .setDescription(
          `Response: \`${timeDiff}MS\`\nLatency: \`${Math.round(
            this.client.ws.ping
          )}MS\``
        )
    );
  }
}
