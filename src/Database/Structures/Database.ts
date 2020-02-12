import { ConnectionManager } from "typeorm";
import { Setting } from "../Models/Settings";
import { dbName } from "../../Configuration/Config";

const connectionManager = new ConnectionManager();
connectionManager.create({
  name: dbName,
  type: "sqlite",
  database: "./OkaDB.sqlite",
  entities: [Setting]
});

export default connectionManager;
