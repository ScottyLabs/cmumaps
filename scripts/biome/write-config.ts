import fs, { writeFile } from "node:fs/promises";
import { parse, stringify } from "comment-json";
import { BIOME_CONFIG_PATH, generateRules } from "./generate-rules.ts";

const generatedRules = await generateRules();
const biomeConfig = parse(await fs.readFile(BIOME_CONFIG_PATH, "utf-8"));
// @ts-expect-error
biomeConfig.linter.rules = generatedRules;
await writeFile(BIOME_CONFIG_PATH, `${stringify(biomeConfig, null, 2)}\n`);
