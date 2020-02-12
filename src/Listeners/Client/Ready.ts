import { Listener } from "discord-akairo";

export default class ReadyListener extends Listener {
  public constructor() {
    super("ready", {
      emitter: "client",
      category: "Client",
      event: "ready"
    });
  }

  public exec() {
    let activities = [
        `${this.client.guilds.size} guilds`,
        `${this.client.users.size} users`
      ],
      i: number = 0;

    this.client.logger.info(`LAVALINK: Connected...`);

    this.client.user.setStatus("dnd");

    this.client.logger.info(
      `${this.client.user.username} Status: Connect to the discord API.`
    );

    setInterval(() => {
      this.client.user.setActivity(
        `oka help | ${activities[i++ % activities.length]}`,
        { type: "WATCHING" }
      );
    }, 15000);
  }
}
