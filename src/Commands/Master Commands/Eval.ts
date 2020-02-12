import { Command } from "discord-akairo";
import { Message } from "discord.js";

export default class EvalCommand extends Command {
  public constructor() {
    super("eval", {
      aliases: ["eval", "evaluate"],
      category: "Master Commands",
      args: [
        {
          id: "evaluated",
          type: "string",
          match: "content",
          prompt: {
            start: "please provide some code to execute."
          }
        }
      ],
      ownerOnly: true,
      description: {
        content: "Executes JavaScript code",
        usage: "eval [ code ]"
      }
    });
  }

  public async exec(message: Message, { evaluated }: { evaluated: any }) {
    try {
      let hrStart = process.hrtime();
      let hrDiff = process.hrtime(hrStart);
      let toEval = eval(evaluated);
      typeof toEval !== "string"
        ? (toEval = require("util").inspect(toEval))
        : "";

      return message.util.send(
        `*Executed in: ${hrDiff[1] / 1000000}ms*\n\`\`\`js\n${toEval}\`\`\``
      );
    } catch (err) {
      return message.util.send(`Error:\n\`\`\`js\n${err}\`\`\``);
    }
  }
}
