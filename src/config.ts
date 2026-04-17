import fs from "fs";
import path from "path";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { randomUUID } from "node:crypto";

type Config = {
  appPath: string;
  port: number;
  jwtSecret: string;
  env: string;
  serviceAccount: Object;
};

const __dirname = dirname(fileURLToPath(import.meta.url));

const configPath = path.join(dirname(__dirname), "config.json");

if (!fs.existsSync(configPath)) {
  console.error(`Config file not found at ${configPath}.`);
  process.exit(1);
}

const fileConfig: Object = JSON.parse(fs.readFileSync(configPath, "utf-8"));

const config: Config = {
  port: 3000,
  jwtSecret: randomUUID(), // Generate a random secret if not provided in config.json
  serviceAccount: {},
  ...fileConfig,
  appPath: __dirname,
  env: process.env.NODE_ENV || "development",
};

export const appPath = config.appPath;
export const port = config.port;

export default config;
