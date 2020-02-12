import { Command } from "discord-akairo";
import { Message, MessageEmbed } from "discord.js";
import { colors } from "../../Configuration/Config";

export default class UnpinCommand extends Command {
  public constructor() {
    super("unpin", {
      aliases: ["unpin"],
      category: "Moderation Commands",
      args: [
        {
          id: "msg",
          type: async (msg: Message, str: string): Promise<Message | null> => {
            if (!str) return null;
            let message = await msg.channel.messages.fetch(str).catch(() => {
              return null;
            });

            if (!message.pinned || !message.pinnable) return null;

            return message;
          },
          prompt: {
            start: "please provide a message ID to unpin",
            retry: "please provide a **valid** message ID to unpin."
          }
        }
      ],
      description: {
        content: "Unpins a message to the channel.",
        usage: "unpin [ message id ]"
      },
      clientPermissions: ["MANAGE_MESSAGES"],
      userPermissions: ["MANAGE_MESSAGES"]
    });
  }

  public async exec(message: Message, { msg }: { msg: any }) {
    await msg.unpin();

    return message.util.send(
      new MessageEmbed()
        .setColor(colors.defaultColor)
        .setDescription(`The selected [message](${msg.url}) has been unpinned.`)
    );
  }
}
