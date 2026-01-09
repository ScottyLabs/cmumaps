// Check if the Biome rules are up to date

import fs from "node:fs/promises";
import process from "node:process";
import { parse } from "comment-json";
import { BIOME_CONFIG_PATH, generateRules } from "./generate-rules.ts";

const generatedRules = await generateRules();
const biomeConfig = parse(await fs.readFile(BIOME_CONFIG_PATH, "utf-8"), null);

// @ts-expect-error
const currentRules = biomeConfig.linter.rules;

// Check if the current rules are the same as the generated rules
if (JSON.stringify(currentRules) === JSON.stringify(generatedRules)) {
  console.debug("Biome config is up to date");
  process.exit(0);
} else {
  console.error("Biome config is not up to date");
  process.exit(1);
}
