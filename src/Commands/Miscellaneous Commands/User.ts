import { Command } from "discord-akairo";
import { Message, MessageEmbed } from "discord.js";

export default class UserCommand extends Command {
  public constructor() {
    super("user", {
      aliases: ["user", "whois", "userinfo"],
      category: "Miscellaneous Commands",
      args: [
        {
          id: "member",
          type: "member",
          default: _ => _.member
        }
      ],
      description: {
        content: "Displays the user information of someone",
        usage: "user [ @user | id | username ]"
      },
      channel: "guild"
    });
  }

  public exec(message: Message, { member }): any {
    let roles = member.roles
      .first(15)
      .slice(0, -1)
      .sort((a: any, b: any) => b.position - a.position)
      .map(r => r)
      .join(", ");
    if (member.roles.size > 16) roles += `...`;
    let object = {
      online: `\`Online\` ${this.client.emojis.get("660283475223379988")}`,
      idle: `\`Idle\` ${this.client.emojis.get("660283475034636288")}`,
      dnd: `\`Do Not Disturb\` ${this.client.emojis.get("660283474527387649")}`,
      offline: `\`Offline\` ${this.client.emojis.get("660283474783109125")}`
    };
    let object2 = {
      online: `${this.client.emojis.get("660283475223379988")}`,
      idle: `${this.client.emojis.get("660283475034636288")}`,
      dnd: `${this.client.emojis.get("660283474527387649")}`,
      offline: `${this.client.emojis.get("660283474783109125")}`
    };
    let obj = { false: "No", true: "Yes" };

    const embed = new MessageEmbed()
      .setColor(member.displayHexColor)
      .setTitle(
        `${object2[member.presence.status]} **${
          member.displayName
        }'s User Information**`
      )
      .setThumbnail(member.user.displayAvatarURL())
      .addField("**User ID**", `\`${member.id}\``, true)
      .addField(
        "**User Discriminator**",
        `\`#${member.user.discriminator}\``,
        true
      )
      .addField(
        "**Join Position**",
        `\`${message.guild.members
          .sort((a: any, b: any) => a.joinedAt - b.joinedAt)
          .map(x => x.id)
          .indexOf(member.id) + 1}\``,
        true
      )
      .addField(
        "**User Joined At**",
        `\`${new Date(member.joinedAt).toLocaleString("en-US")}\``,
        true
      )
      .addField(
        "**User Created At**",
        `\`${new Date(member.user.createdAt).toLocaleString("en-US")}\``,
        true
      )
      .addField("**Bot User**", `\`${obj[member.user.bot]}\``, true)
      .addField("**User Presence**", `${object[member.presence.status]}`, true)
      .addField(
        "**User Game**",
        `\`${
          member.presence.activity ? member.presence.activity.name : "No Game"
        }\``,
        true
      )
      .addField(
        "**Boosting Since**",
        `\`${
          member.premiumSince
            ? new Date(member.premiumSince).toLocaleString("en-US")
            : "Not Boosting"
        }\``,
        true
      )
      .addField(
        "**User Permissions**",
        `\`\`\`${
          member.permissions
            ? this.permissionFormat(member.permissions.toArray())
            : "None"
        }\`\`\``
      )
      .addField(
        "**Highest Role**",
        `${member.roles.highest || "No highest role!"}`
      )
      .addField(
        `**Roles [ ${member.roles.size - 1} ]**`,
        `${roles || "No roles!"}`
      );
    return message.util.send({ embed });
  }

  permissionFormat(permissions: string[]) {
    const result = permissions.map(
      str =>
        `${str
          .replace(/_/g, " ")
          .toLowerCase()
          .replace(/\b(\w)/g, char => char.toUpperCase())}`
    );

    return result.length > 1
      ? `${result.slice(0, -1).join(", ")} and ${result.slice(-1)[0]}`
      : result[0];
  }
}
