import { Listener } from "discord-akairo";
import { Message } from "discord.js";

export default class MessageDeletedListener extends Listener {
  public constructor() {
    super("deleted", {
      emitter: "client",
      category: "Client",
      event: "messageDelete"
    });
  }

  public async exec(message: Message) {
    this.client.snipes.set(message.channel.id, {
      content: message.content,
      author: message.author,
      date: Date.now(),
      image: message.attachments.first()
        ? message.attachments.map(img => img.proxyURL)
        : undefined
    });
  }
}
