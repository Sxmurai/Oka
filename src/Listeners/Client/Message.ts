import { Listener } from "discord-akairo";
import { Message } from "discord.js";
import sqlite from "sqlite";
import cleverbot from "cleverbot-free";

export default class MessageListener extends Listener {
  public constructor() {
    super("message", {
      emitter: "client",
      category: "Client",
      event: "message"
    });
  }

  public async exec(message: Message) {
    if (message.channel.type == "dm") {
      if (message.author.bot) return;

      cleverbot(message.content).then(response => {
        if (message.content.startsWith("oka ")) return;
        message.channel.startTyping();
        setTimeout(() => {
          message.channel.send(response);
          message.channel.stopTyping();
        }, Math.random() * (1 - 3) + 1 * 1000);
      });

      this.client.logger.info(
        `Oka Status: Direct Message: ${message.author.tag}(${message.author.id}): ${message.content}`
      );
    }
  }
}
