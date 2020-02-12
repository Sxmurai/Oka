/* 

Honestly, I didn't put any work into this command lmfao

*/

import { Command } from "discord-akairo";
import { Message, MessageEmbed } from "discord.js";
import { colors } from "../../Configuration/Config";

const vowels = ["a", "e", "i", "o", "u", "y"];

export default class ShipCommand extends Command {
  public constructor() {
    super("ship", {
      aliases: ["ship", "iship"],
      category: "Miscellaneous Commands",
      args: [
        {
          id: "memberOne",
          type: "member",
          prompt: {
            start: "please provide someone.",
            retry: "please provide a valid member"
          }
        },

        {
          id: "memberTwo",
          type: "member",
          prompt: {
            start: "please provide someone to complete the ship",
            retry: "please provide a valid member"
          }
        }
      ],
      description: {
        content: "Ships two users together OwO",
        usage: "ship [ @member | id | username ] [ @member | id | username ]"
      },
      channel: "guild"
    });
  }

  public exec(
    message: Message,
    { memberOne, memberTwo }: { memberOne: any; memberTwo: any }
  ) {
    const embed = new MessageEmbed()
      .setColor(colors.defaultColor)
      .setDescription(
        `\`${memberOne.displayName}\` 💞 \`${
          memberTwo.displayName
        }\` = \`${this.confuzzleNames(memberOne, memberTwo)}\``
      );

    message.util.send({ embed });
  }

  public confuzzleNames(memberOne, memberTwo) {
    let count1 = -1,
      count2 = -1;
    let mid1 = Math.ceil(memberOne.displayName.length / 2) - 1;
    let mid2 = Math.ceil(memberTwo.displayName.length / 2) - 1;
    let noVowel1 = false,
      noVowel2 = false;
    for (let i = mid1; i >= 0; i--) {
      count1++;
      if (vowels.includes(memberOne.displayName.charAt(i).toLowerCase())) {
        i = -1;
      } else if (i == 0) {
        noVowel1 = true;
      }
    }
    for (let i = mid2; i < memberTwo.displayName.length; i++) {
      count2++;
      if (vowels.includes(memberTwo.displayName.charAt(i).toLowerCase())) {
        i = memberTwo.displayName.length;
      } else if (i == memberTwo.displayName.length - 1) {
        noVowel2 = true;
      }
    }

    let name = "";
    if (noVowel1 && noVowel2) {
      name = memberOne.displayName.substring(0, mid1 + 1);
      name += memberTwo.displayName.substring(mid2);
    } else if (count1 <= count2) {
      name = memberOne.displayName.substring(0, mid1 - count1 + 1);
      name += memberTwo.displayName.substring(mid2);
    } else {
      name = memberOne.displayName.substring(0, mid1 + 1);
      name += memberTwo.displayName.substring(mid2 + count2);
    }
    return name;
  }
}
