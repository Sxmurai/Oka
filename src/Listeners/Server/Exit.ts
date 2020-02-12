import { Listener } from "discord-akairo";

export default class ExitListener extends Listener {
  public constructor() {
    super("exit", {
      emitter: "process",
      category: "Server",
      event: "exit"
    });
  }

  public exec(code: number): any {
    console.log(`Exited with code: ${code}`);
  }
}
