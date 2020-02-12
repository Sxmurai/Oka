import { Command } from "discord-akairo";
import { Message, MessageEmbed } from "discord.js";
import { colors } from "../../Configuration/Config";

export default class PinCommand extends Command {
  public constructor() {
    super("pin", {
      aliases: ["pin"],
      category: "Moderation Commands",
      args: [
        {
          id: "msg",
          type: "message",
          prompt: {
            start: "please provide a message ID to pin",
            retry: "please provide a **valid** message ID to pin."
          }
        }
      ],
      description: {
        content: "Pins a message to the channel.",
        usage: "ping [ message id ]"
      },
      clientPermissions: ["MANAGE_MESSAGES"],
      userPermissions: ["MANAGE_MESSAGES"]
    });
  }

  public async exec(message: Message, { msg }: { msg: any }) {
    await msg.pin();

    return message.util.send(
      new MessageEmbed()
        .setColor(colors.defaultColor)
        .setDescription(`The selected [message](${msg.url}) has been pinned.`)
    );
  }
}
