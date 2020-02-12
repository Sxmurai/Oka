import { Command, Argument } from "discord-akairo";
import { Message, MessageEmbed } from "discord.js";
import { colors } from "../../Configuration/Config";

export default class PurgeCommand extends Command {
  public constructor() {
    super("purge", {
      aliases: ["purge", "clear"],
      category: "Moderation Commands",
      args: [
        {
          id: "amount",
          type: "number",
          prompt: {
            start: `please provide an amount to clear`,
            retry: `please provide a **number** to clear`
          }
        },

        {
          id: "channel",
          type: Argument.range("number", 1, 101),
          default: (_: Message) => _.channel
        }
      ],
      description: {
        content: "Purges messages from a channel",
        usage: "purge < #channel | id | name >"
      },
      clientPermissions: ["MANAGE_MESSAGES"],
      userPermissions: ["MANAGE_MESSAGES"],
      channel: "guild"
    });
  }

  public async exec(
    message: Message,
    { amount, channel }: { amount: number; channel: any }
  ) {
    if (!channel.permissionsFor(message.guild.me).has("MANAGE_MESSAGES"))
      return message.util.send(
        new MessageEmbed()
          .setColor(colors.red)
          .setDescription(
            `${this.client.emojis.get(
              "660343595626397699"
            )} I cannot access: ${channel}`
          )
      );

    let amt = amount + 1;
    const fetchedMessages = (
      await channel.messages.fetch({ limit: amt }, true)
    ).filter((msg: Message) => msg.deletable && msg.pinned);
    const deleted = await channel.bulkDelete(fetchedMessages);

    await deleted;

    return message.util.send(
      new MessageEmbed()
        .setColor(colors.defaultColor)
        .setDescription(
          `${this.client.emojis.get("660343594477027330")} Deleted: \`${
            deleted.size
          }/${amt}\` in channel: ${channel}`
        )
    );
  }
}
