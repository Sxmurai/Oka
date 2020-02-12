import { Listener } from "discord-akairo";
import { MessageEmbed, Guild, TextChannel } from "discord.js";
import { colors } from "../../Configuration/Config";

export default class GuildAddListener extends Listener {
  public constructor() {
    super("guildAdd", {
      emitter: "client",
      category: "Client",
      event: "guildCreate"
    });
  }

  public exec(guild: Guild) {
    let GuildLogger = this.client.channels.find(
      c => c.id === "676585429281275935"
    );

    (<TextChannel>GuildLogger).send(
      new MessageEmbed()
        .setColor(colors.green)
        .setAuthor(
          `New Guild | ${guild.name} (${guild.id})`,
          guild.iconURL()
            ? guild.iconURL()
            : this.client.user.displayAvatarURL()
        )
        .addField("Owner", `<@${guild.ownerID}>`, true)
        .addField("Members", `\`${guild.members.size}\``, true)
        .addField(
          "Bots",
          `\`${guild.members.filter(u => u.user.bot).size}\``,
          true
        )
        .setFooter(
          `Created At: ${new Date(guild.createdAt).toLocaleString(
            "en-US"
          )} | Guild Count: ${this.client.guilds.size}`
        )
    );
  }
}
