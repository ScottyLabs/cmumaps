import fs, { writeFile } from "node:fs/promises";
import { parse, stringify, type CommentObject } from "comment-json";
import { BIOME_CONFIG_PATH, getAllRules } from "./generate-rules.ts";

const allRules = await getAllRules();
const biomeConfig = parse(await fs.readFile(BIOME_CONFIG_PATH, "utf-8"), null) as CommentObject;
// @ts-expect-error
biomeConfig.linter.rules = allRules;
await writeFile(BIOME_CONFIG_PATH, `${stringify(biomeConfig, null, 2)}\n`);
