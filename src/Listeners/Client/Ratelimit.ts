import { Listener } from "discord-akairo";

export default class RatelimitListener extends Listener {
  public constructor() {
    super("ratelimit", {
      emitter: "client",
      category: "Client",
      event: "ratelimit"
    });
  }

  public exec(info: Object) {
    this.client.logger.error(`Oka Status: ${info}`);

    process.exit(1);
  }
}
