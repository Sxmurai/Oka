import { Listener, Command } from "discord-akairo";
import { Message, MessageEmbed } from "discord.js";
import { colors } from "../../Configuration/Config";

export default class AkairoErrorListener extends Listener {
  public constructor() {
    super("error", {
      emitter: "client",
      category: "Command",
      event: "error"
    });
  }

  exec(error: Error, msg: Message): any {
    console.log(`Oka Status: ${error}`);

    return msg.util.send(
      new MessageEmbed()
        .setColor(colors.red)
        .setDescription(
          `An error has occured:\n\nError:\`${error}\`.\nIf the error does not go away, contact: <@535585397435006987> on discord with the error.`
        )
    );
  }
}
