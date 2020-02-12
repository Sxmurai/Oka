import {
  AkairoClient,
  CommandHandler,
  ListenerHandler,
  InhibitorHandler,
  Command,
  Listener,
  Inhibitor
} from "discord-akairo";
import { Message } from "discord.js";
import { owners, dPrefixes, dbName } from "../Configuration/Config";
import { config } from "dotenv";
import Logger from "@ayana/logger";
import { PlayerManager } from "discord.js-lavalink";
import { Connection } from "typeorm";
import Database from "../Database/Structures/Database";
import SettingsProvider from "../Database/Structures/SettingsProvider";
import { Setting } from "../Database/Models/Settings";

declare module "discord-akairo" {
  interface AkairoClient {
    inhibitorHandler: InhibitorHandler;
    commandHandler: CommandHandler;
    listenerHandler: ListenerHandler;
    BotOptions: BotOptions;
    config: BotOptions;
    snipes;
    logger: Logger;
    player: PlayerManager;
    settings: SettingsProvider;
    queue;
  }
}

interface BotOptions {
  token?: string;
  owners?: string;
}

const nodes = [
  {
    host: "localhost",
    port: 2223,
    password: "youshallnotpass"
  }
];

export default class OkaClient extends AkairoClient {
  public snipes = new Map();

  public db!: Connection;

  public settings!: SettingsProvider;

  public logger: Logger = Logger.get(OkaClient);

  public queue = new Map();

  public commandHandler: CommandHandler = new CommandHandler(this, {
    prefix: (msg: Message) =>
      msg.guild
        ? this.settings.get(msg.guild.id, "config.prefix", dPrefixes)
        : dPrefixes,
    directory: require("path").join(__dirname, "..", "Commands"),
    ignoreCooldown: owners,
    ignorePermissions: owners,
    automateCategories: true,
    argumentDefaults: {
      prompt: {
        modifyStart: (msg: Message, str: string) =>
          `${msg.author}, ${str}\n\nType: \`cancel\` at any time to cancel the command...`,
        modifyRetry: (msg: Message, str: string) =>
          `${msg.author}, ${str}\n\nType: \`cancel\` at any time to cancel the command...`,
        cancel: (msg: Message) =>
          `${msg.author}, I have cancelled the command for you per your request.`,
        timeout: (msg: Message) =>
          `${msg.author}, whoopies! Looks like you left me hanging there! I went ahead and cancelled the command for you!`,
        ended: (msg: Message) =>
          `${msg.author}, looks like you still haven't gotten it! I've cancelled the command for you.`,
        retries: 3,
        time: 60000
      },
      otherwise: ""
    },
    commandUtilLifetime: 300000,
    defaultCooldown: 6000,
    classToHandle: Command,
    commandUtil: true,
    handleEdits: true,
    blockBots: true,
    blockClient: true
  });

  public listenerHandler: ListenerHandler = new ListenerHandler(this, {
    directory: require("path").join(__dirname, "..", "Listeners"),
    classToHandle: Listener
  });

  public inhibitorHandler: InhibitorHandler = new InhibitorHandler(this, {
    directory: require("path").join(__dirname, "..", "Inhibitors"),
    classToHandle: Inhibitor
  });

  public constructor(config: BotOptions) {
    super(
      {
        ownerID: owners
      },

      {
        disableEveryone: true
      }
    );

    this.config = config;
  }

  private async _init(): Promise<void> {
    this.commandHandler.useListenerHandler(this.listenerHandler);
    this.commandHandler.useInhibitorHandler(this.inhibitorHandler);

    this.listenerHandler.setEmitters({
      commandHandler: this.commandHandler,
      listenerHandler: this.listenerHandler,
      inhibitorHandler: this.inhibitorHandler,
      process: process
    });

    this.db = Database.get(dbName);

    await this.db.connect();
    await this.db.synchronize();

    this.settings = new SettingsProvider(this.db.getRepository(Setting));

    await this.settings.init();

    this.logger.info(`Oka Status: Loaded Database!`);

    await this.commandHandler.loadAll();
    await this.listenerHandler.loadAll();
    await this.inhibitorHandler.loadAll();

    config();
  }

  public async start(): Promise<string> {
    await this._init();
    return this.login(this.config.token);
  }
}
