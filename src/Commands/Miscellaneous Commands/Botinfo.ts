import { Command } from "discord-akairo";
import { Message, MessageEmbed } from "discord.js";
import { colors } from "../../Configuration/Config";
import fetch, { RequestInit } from "node-fetch";

export default class BotInfoCommand extends Command {
  public constructor() {
    super("botinfo", {
      aliases: ["botinfo", "info"],
      category: "Miscellaneous Commands",
      description: {
        content: "View the Bot information for Oka!"
      }
    });
  }

  public async exec(message: Message) {
    const embed = new MessageEmbed()
      .setColor(colors.defaultColor)
      .setAuthor(
        `${this.client.user.username} Information`,
        this.client.user.displayAvatarURL()
      ).setDescription(`Hiya, I'm ${
      this.client.user.username
    }. I was made in [TypeScript](${"https://www.typescriptlang.org"}). I am a discord bot made with discord.js-master and discord-akairo. I believe that I should have my source shared, as like a mini example to starters who just want some code to look at. Below, are my stats and github commits.
        
        **Guilds**: ${this.client.guilds.size}
        **Users**: ${this.client.users.size}
        **Developers**: <@${this.client.ownerID}>`);

    let commits = await this.getCommits();
    if (commits) embed.addField("GitHub Commits", commits);

    return message.util.send({ embed });
  }

  private async getCommits() {
    const res = await fetch("https://api.github.com/repos/Sxmurai/Oka/commits");
    let str = "";
    const json = await res.json();

    for (const { sha, html_url, commit, author } of json.slice(0, 5)) {
      str += `[\`${sha.slice(0, 7)}\`](${html_url}) ${commit.message.substr(
        0,
        80
      )} - **[@${author.login.toLowerCase()}](${author.html_url})**\n`;
    }

    return str;
  }
}

export const get = async <T>(
  url: string,
  options?: RequestInit
): Promise<{ data?: T; error?: Error }> => {
  return new Promise(resolve => {
    return fetch(url, options).then(
      async res => resolve({ data: await res.json() }),
      error => resolve({ error })
    );
  });
};
