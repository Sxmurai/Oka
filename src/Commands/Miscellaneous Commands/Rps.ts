import { Command } from "discord-akairo";
import { Message, MessageEmbed } from "discord.js";
import { colors } from "../../Configuration/Config";

export default class RPSCommands extends Command {
    public constructor() {
        super("rps", {
            aliases: ["rps", "rock-paper-scissors"],
            category: "Miscellaneous Commands",
            args: [
                {
                    id: "choice",
                    prompt: {
                        start: (msg: Message) => `please provide a choice.`,
                        retry: (msg: Message) => `please provide a choice`
                    },
                    type: ["rock", "paper", "scissors"]
                }
            ]
        });
    }

    public exec(message: Message, { choice }: { choice: string }) {
        const possibleResults: Object = {
            rock: ["tied", "lost", "won"],
            paper: ["won", "tie", "lost"],
            scissors: ["lost", "won", "tied"]
        },
        types = Object.keys(possibleResults);

        const botChoice = types[Math.floor(Math.random() * types.length)];

        return message.util.send(
            new MessageEmbed()
                .setColor(colors.defaultColor)
                .setAuthor(`RPS | I ${possibleResults[botChoice][types.findIndex(c => c === choice)]}!`, this.client.user.displayAvatarURL())
                .addField("You choose:", `\`${choice}\``, true)
                .addField("I choose:", `\`${botChoice}\``, true)
        );
    }
}