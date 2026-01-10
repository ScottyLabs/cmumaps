// https://github.com/adamhl8/configs/blob/main/generate-biome-rules.ts
/** biome-ignore-all lint/style/useNamingConvention: some rules violate this rule */
/** biome-ignore-all lint/nursery/useAwaitThenable: external script style */
import { mergeDeep } from "remeda";

/*
 * This script does the following:
 * - Fetches the latest biome schema from `https://biomejs.dev/schemas/latest/schema.json`
 * - Based on that schema, generates a Biome `linter.rules` object where all the rules are set to `"on"` (`allRules`)
 * - Merges the `OVERRIDES` object into `allRules` (`mergedRules`)
 * - Replaces the `linter.rules` object in the Biome config at `BIOME_CONFIG_PATH` with `mergedRules`
 */

export const BIOME_CONFIG_PATH = "./biome.jsonc";
const DEFAULT_RULE_SEVERITY = "error";

const OVERRIDES = {
  complexity: {
    // Conflicts with tsc noPropertyAccessFromIndexSignature
    useLiteralKeys: "off",

    // Not a good metric
    noExcessiveLinesPerFunction: "off",

    // Not a good metric
    noExcessiveCognitiveComplexity: "off",
  },
  correctness: {
    // TODO: enable later after we figure out how to get the image size of svgs
    useImageSize: "off",

    // TODO: figure out how to import mapkit or explain why it can't
    noUndeclaredVariables: "off",

    // None React Rules
    noNodejsModules: "off",
    noQwikUseVisibleTask: "off",
    noSolidDestructuredProps: "off",
    useQwikClasslist: "off",
  },
  nursery: {
    // TODO: Need to enable later after figure out how to fix it in server with dependncy injection
    noImportCycles: "off",

    // Implicit typing are sometimes useful
    useExplicitType: "off",

    // All node.js built in imports are flagged as violations
    noUnresolvedImports: "off",

    // Common pattern of creating a function for a button violates this rule
    noJsxPropsBind: "off",

    // We don't need to worry about internationalization lol
    noJsxLiterals: "off",

    // Too many false positives
    useAwaitThenable: "off",

    // Not a useful rule
    noTernary: "off",

    // Not a useful rule
    noIncrementDecrement: "off",

    // Not a good metric
    noContinue: "off",

    // Not a good metric
    useMaxParams: "off",

    // None React Rules
    useQwikMethodUsage: "off",
    useQwikValidLexicalScope: "off",
    noVueDataObjectDeclaration: "off",
    noVueDuplicateKeys: "off",
    noVueReservedKeys: "off",
    noVueReservedProps: "off",
    noVueVIfWithVFor: "off",
    useVueDefineMacrosOrder: "off",
    useVueHyphenatedAttributes: "off",
    useVueMultiWordComponentNames: "off",
    useVueValidVBind: "off",
    useVueValidVElse: "off",
    useVueValidVElseIf: "off",
    useVueValidVHtml: "off",
    useVueValidVIf: "off",
    useVueValidVOn: "off",
    useVueValidVText: "off",
  },
  performance: {
    // TODO: enable later after figure out how to refactor code to not use await in loops
    noAwaitInLoops: "off",

    // Not a performance issue for our use case
    noBarrelFile: "off",

    // Not a performance issue for our use case
    noReExportAll: "off",

    // Solid rule
    useSolidForComponent: "off",

    // Next.js rule
    noImgElement: "off",
  },
  security: {
    // Too many false positives
    noSecrets: "off",
  },
  style: {
    // TODO: Enable later and replace enums with constant objects or union of strings
    noEnum: "off",

    // Sometimes nested ternary is simpler
    noNestedTernary: "off",

    // Sometimes looks better without curly braces
    useBlockStatements: "off",

    // Sometimes we want to export in the beginning of the file
    useExportsLast: "off",

    // Flags http status codes and 1.0 as violations
    noMagicNumbers: "off",

    // Next.js rule
    noHeadElement: "off",

    useConsistentMemberAccessibility: {
      level: DEFAULT_RULE_SEVERITY,
      options: {
        // Otherwise public modifier is disallowed
        accessibility: "explicit",
      },
    },

    useImportType: {
      level: DEFAULT_RULE_SEVERITY,
      options: {
        // Enforce `import type { T }` instead of `import { type T }`
        style: "separatedType",
      },
    },
  },
  suspicious: {
    // TODO: replace later only when we have a different way of handling logs
    noConsole: "off",

    // None React Rule
    noReactSpecificProps: "off",
  },
};

export async function generateRules() {
  const schema = (await (
    await fetch("https://biomejs.dev/schemas/latest/schema.json")
  ).json()) as BiomeSchema;
  const ruleGroupName = Object.keys(schema.$defs.Rules.properties).filter(
    (key) => key !== "recommended",
  );

  const allRules: AllRules = {};
  for (const groupName of ruleGroupName) {
    // definition names are in PascalCase
    const groupDefinitionName =
      groupName.charAt(0).toUpperCase() + groupName.slice(1);
    const groupDefinition = schema.$defs[groupDefinitionName];
    const ruleNames = Object.keys(groupDefinition?.properties ?? {}).filter(
      (key) => key !== "recommended",
    );

    allRules[groupName] = {};
    for (const ruleName of ruleNames) {
      allRules[groupName][ruleName] = DEFAULT_RULE_SEVERITY;
    }
  }

  return mergeDeep(allRules, OVERRIDES);
}

// ==== types ====

interface BiomeSchema {
  $defs: {
    Rules: {
      properties: Record<string, unknown>;
    };
    [definitionName: string]: {
      properties: Record<string, unknown>;
    };
  };
}

interface AllRules {
  [groupName: string]: {
    [ruleName: string]: string;
  };
}
