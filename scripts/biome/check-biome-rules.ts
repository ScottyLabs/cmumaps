// Check if the Biome rules are up to date

import fs from "node:fs/promises";
import process from "node:process";
import { BIOME_CONFIG_PATH, getAllRules } from "./generate-biome-rules.ts";

const allRules = await getAllRules();
const biomeConfig = JSON.parse(await fs.readFile(BIOME_CONFIG_PATH, "utf-8"));
if (JSON.stringify(biomeConfig.linter.rules) === JSON.stringify(allRules)) {
  console.debug("Biome rules are up to date");
  process.exit(0);
} else {
  console.error("Biome rules are not up to date");
  process.exit(1);
}
