import { Listener, Command } from "discord-akairo";
import { Message, MessageEmbed } from "discord.js";
import { colors } from "../../Configuration/Config";

export default class BlockedListener extends Listener {
  public constructor() {
    super("blocked", {
      emitter: "commandHandler",
      category: "Command",
      event: "commandBlocked"
    });
  }

  public exec(message: Message, command: Command, reason: string): any {
    return message.util.send(
      new MessageEmbed()
        .setColor(colors.red)
        .setDescription(
          `${this.client.emojis.get(
            "660343595626397699"
          )} The command: \`${command}\` was blocked for the reason of: \`${reason}\``
        )
    );
  }
}
