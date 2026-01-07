import fs from "node:fs/promises";
import { BIOME_CONFIG_PATH, getAllRules } from "./generate-biome-rules.ts";

const allRules = await getAllRules();
const biomeConfig = JSON.parse(await fs.readFile(BIOME_CONFIG_PATH, "utf-8"));
biomeConfig.linter.rules = allRules;
await fs.writeFile(
  BIOME_CONFIG_PATH,
  `${JSON.stringify(biomeConfig, null, 2)}\n`,
);
