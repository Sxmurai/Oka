import { Command } from "discord-akairo";
import { Message, MessageEmbed } from "discord.js";
import { colors } from "../../../Configuration/Config";

export default class BlacklistCommand extends Command {
  public constructor() {
    super("remove", {
      ownerOnly: true,
      category: "Master Commands",
      args: [
        {
          id: "user",
          type: "user",
          match: "rest",
          prompt: {
            start: "please provide a user to remove from the blacklist",
            retry: "please provide a user to remove from the blacklist"
          }
        }
      ]
    });
  }

  public exec(message: Message, { user }: { user: any }) {
    const Blacklist = this.client.settings.get(
      "global",
      "users.blacklisted",
      []
    );

    if (!Blacklist.includes(user.id))
      return message.util.send(
        new MessageEmbed()
          .setColor(colors.red)
          .setDescription(
            `${this.client.emojis.get("660343595626397699")} \`${
              user.tag
            }\` isn't in the blacklist. Use: \`oka blacklist add ${user.id}\``
          )
      );

    Blacklist.splice(Blacklist.indexOf(user.id), 1);

    this.client.settings.set("global", "users.blacklisted", Blacklist);

    return message.util.send(
      new MessageEmbed()
        .setColor(colors.defaultColor)
        .setDescription(
          `${this.client.emojis.get("660343594477027330")} Removed: \`${
            user.tag
          }\` from the blacklist.`
        )
    );
  }
}
