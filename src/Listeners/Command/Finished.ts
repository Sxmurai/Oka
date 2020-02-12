import { Listener, Command } from "discord-akairo";
import { Message } from "discord.js";

export default class FinishedListener extends Listener {
  public constructor() {
    super("finished", {
      emitter: "commandHandler",
      category: "Command",
      event: "commandFinished"
    });
  }

  public exec(message: Message, command: Command, args: any) {
    this.client.logger.info(
      `Oka Status: Command: ${command} has been executed ${args ? message : ""}`
    );
  }
}
