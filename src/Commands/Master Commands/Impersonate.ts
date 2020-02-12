import { Command, Argument } from "discord-akairo";
import { Message, GuildMember, User, TextChannel } from "discord.js";

export default class ImpersonateCommand extends Command {
  public constructor() {
    super("impersonate", {
      aliases: ["impersonate"],
      category: "Master Commands",
      args: [
        {
          id: "member",
          type: "user",
          prompt: {
            start: "please provide a user",
            retry: "please provide a **valid** user"
          }
        },

        {
          id: "msg",
          type: "string",
          prompt: {
            start: "please provide a message to say"
          },
          match: "rest"
        }
      ],
      ownerOnly: true,
      description: {
        content: "Impersonates a user",
        usage: "impersonate [ @user | id ] [ message ]"
      },
      clientPermissions: ["MANAGE_MESSAGES", "MANAGE_WEBHOOKS"],
      channel: "guild"
    });
  }

  public async exec(
    message: Message,
    { member, msg }: { member: any; msg: string }
  ) {
    if (message.deletable) await message.delete();
    if (member instanceof GuildMember) member = member;

    const hook = await (<TextChannel>(
      message.channel
    )).createWebhook(member.username, { avatar: member.displayAvatarURL() });

    (await hook.send(msg)) && (await hook.delete());
  }
}
