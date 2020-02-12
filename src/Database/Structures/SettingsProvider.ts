import { Provider } from "discord-akairo";
import { Guild } from "discord.js";
import { Repository, InsertResult, DeleteResult } from "typeorm";
import { Setting } from "../Models/Settings";
import * as _ from "dot-prop";

export default class SettingsProvider extends Provider {
  public repo: Repository<any>;

  public constructor(repository: Repository<any>) {
    super();
    this.repo = repository;
  }

  public async init(): Promise<void> {
    const settings = await this.repo.find();

    for (const setting of settings) {
      this.items.set(setting.guild, JSON.parse(setting.settings));
    }
  }

  public get<T>(
    guild: string | Guild,
    key: string,
    defaultValue: any
  ): T | any {
    const ID = (this.constructor as typeof SettingsProvider).getGuildID(guild);

    if (this.items.has(ID)) {
      return _.get(this.items.get(ID), key, defaultValue);
    }

    return defaultValue;
  }

  public getRaw(guild: string | Guild) {
    const ID = (this.constructor as typeof SettingsProvider).getGuildID(guild);

    return this.items.get(ID);
  }

  public set(
    guild: string | Guild,
    key: string,
    value: any
  ): Promise<InsertResult> {
    const ID = (this.constructor as typeof SettingsProvider).getGuildID(guild);
    const data = this.items.get(ID) || {};

    _.set(data, key, value);

    this.items.set(ID, data);

    return this.repo
      .createQueryBuilder()
      .insert()
      .into(Setting)
      .values({ guild: ID, settings: JSON.stringify(data) })
      .onConflict('("guild") DO UPDATE SET "settings" = :settings')
      .setParameter("settings", JSON.stringify(data))
      .execute();
  }

  public delete(guild: string | Guild, key: string): Promise<DeleteResult> {
    const ID = (this.constructor as typeof SettingsProvider).getGuildID(guild);

    this.items.delete(ID);

    return this.repo.delete(ID);
  }

  public clear(guild: string | Guild): Promise<DeleteResult> {
    const ID = (this.constructor as typeof SettingsProvider).getGuildID(guild);

    this.items.delete(ID);

    return this.repo.delete(ID);
  }

  public static getGuildID(guild: string | Guild): string {
    if (guild instanceof Guild) return guild.id;
    if (guild === "global" || guild === null) return "0";
    if (typeof guild === "string" && /^\d+$/.test(guild)) return guild;

    throw new TypeError(
      'Guild instance is undefined. Valid instances: guildID, "global" or null.'
    );
  }
}
