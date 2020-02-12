import Logger, { DefaultFormatter, LogLevel, LogLevelColor, LogMeta } from "@ayana/logger";
import { Color } from "@ayana/logger/build/util";
import fetcha from "fetcha";

export default class AkaiCanaryLogger extends DefaultFormatter {
  public colored = new Color();
  public get timestamp() {
    return this.colored.gray(
      this.colored.gray(new Date(Date.now()).toLocaleString("en-US"))
    );
  }

  public formatMessage(meta: LogMeta, message: string): string {
    const timestamp = this.colored.gray(this.timestamp);
    const level = this.colored.get(
      (LogLevelColor as any)[meta.level],
      meta.level.padEnd(6)
    );

    const name = `[${this.colored.magenta(
      `[${"Akai Canary"}:`
    )}${this.colored.magenta(`${meta.origin.packageName}`)}${
      meta.uniqueMarker ? `/${this.colored.gray(`${meta.uniqueMarker}`)}` : ""
    }\u001b[22m]`;
    return `${timestamp} ${level}${name}: ${message}`;
  }
}

Logger.getDefaultTransport().setLevel(LogLevel.TRACE);
Logger.setFormatter(new AkaiCanaryLogger());
