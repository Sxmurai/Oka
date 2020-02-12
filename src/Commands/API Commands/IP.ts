import { Command } from "discord-akairo";
import { Message, MessageEmbed } from "discord.js";
import { colors } from "../../Configuration/Config";
import fetch from "node-fetch";

export default class IPCommand extends Command {
  public constructor() {
    super("ip", {
      aliases: ["ip", "iplookup", "ipaddress"],
      category: "API Commands",
      args: [
        {
          id: "ip",
          type: /((?:^\s*(?:(?:(?:[0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}(?:[0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5]))\s*$)|(?:^\s*(?:(?:(?:[0-9A-Fa-f]{1,4}:){7}(?:[0-9A-Fa-f]{1,4}|:))|(?:(?:[0-9A-Fa-f]{1,4}:){6}(?::[0-9A-Fa-f]{1,4}|(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(?:(?:[0-9A-Fa-f]{1,4}:){5}(?:(?:(?::[0-9A-Fa-f]{1,4}){1,2})|:(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(?:(?:[0-9A-Fa-f]{1,4}:){4}(?:(?:(?::[0-9A-Fa-f]{1,4}){1,3})|(?:(?::[0-9A-Fa-f]{1,4})?:(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(?:(?:[0-9A-Fa-f]{1,4}:){3}(?:(?:(?::[0-9A-Fa-f]{1,4}){1,4})|(?:(?::[0-9A-Fa-f]{1,4}){0,2}:(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(?:(?:[0-9A-Fa-f]{1,4}:){2}(?:(?:(?::[0-9A-Fa-f]{1,4}){1,5})|(?:(?::[0-9A-Fa-f]{1,4}){0,3}:(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(?:(?:[0-9A-Fa-f]{1,4}:){1}(?:(?:(?::[0-9A-Fa-f]{1,4}){1,6})|(?:(?::[0-9A-Fa-f]{1,4}){0,4}:(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(?::(?:(?:(?::[0-9A-Fa-f]{1,4}){1,7})|(?:(?::[0-9A-Fa-f]{1,4}){0,5}:(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(?:%.+)?\s*$))/,
          prompt: {
            start: "please provide an IP",
            retry: "please provide a **valid** IP"
          }
        }
      ],
      description: {
        content: "Uh, basically an IP lookup",
        usage: "ip [ ip ]"
      },
      cooldown: 6000,
      ratelimit: 1
    });
  }

  public async exec(message: Message, { ip }: { ip: any }) {
    const ipAdress: string = ip.match[ip.match.index];
    const res = await fetch(
      `http://api.ipinfodb.com/v3/ip-city/?key=${process.env.IPTOKEN}&ip=${ipAdress}&format=json`
    );
    const json = await res.json();

    if (!json)
      return message.util.send(`oopies, couldn't fetch the IP: \`${ip}\``);

    const embed = new MessageEmbed()
      .setColor(colors.defaultColor)
      .setAuthor(`IP | ${json.ipAddress}`, message.author.displayAvatarURL())
      .setDescription(`
      **Zip Code**: \`${json.zipCode}\`
      **Country Code**: \`${json.countryCode}\`
      **Region**: \`${json.regionName}\`
      **Latitude | Longitude**: \`${json.latitude}\` | \`${json.longitude}\`
      **Time Zone**: \`${json.timeZone}\``);

    return message.util.send({ embed });
  }
}
