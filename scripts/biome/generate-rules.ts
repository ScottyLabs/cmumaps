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
    useLiteralKeys: "off", // Conflicts with tsc noPropertyAccessFromIndexSignature
    noExcessiveCognitiveComplexity: "off",
    noExcessiveLinesPerFunction: "off",
    noVoid: "off",
    noForEach: "off",
  },
  correctness: {
    // TODO: enable later after we figure out how to get the image size of svgs
    useImageSize: "off",

    noNodejsModules: "off",
    noQwikUseVisibleTask: "off",
    noSolidDestructuredProps: "off",
    noUndeclaredDependencies: "off",
    noUndeclaredVariables: "off",
    useQwikClasslist: "off",
  },
  nursery: {
    noContinue: "off",
    noUnresolvedImports: "off",
    useExplicitType: "off",
    noIncrementDecrement: "off",

    // Common pattern of creating a function for a button violates this rule
    noJsxPropsBind: "off",

    // Not a useful rule
    useMaxParams: "off",

    // TODO: Need to enable later after figure out how to fix it in server with dependncy injection
    noImportCycles: "off",

    noJsxLiterals: "off",
    noSyncScripts: "off",
    useQwikMethodUsage: "off",
    useQwikValidLexicalScope: "off",
    noTernary: "off",

    // Too many false positives
    useAwaitThenable: "off",

    // Vue rules
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
    noBarrelFile: "off",
    noNamespaceImport: "off",
    useSolidForComponent: "off",

    // Next.js rule
    noImgElement: "off",

    // Not a performance issue for our use case
    noReExportAll: "off",

    // Enable later after figure out how to refactor code to not use await in loops
    noAwaitInLoops: "off",
  },
  security: {
    noSecrets: "off",
  },
  style: {
    // Sometimes nested ternary is simpler
    noNestedTernary: "off",

    noEnum: "off",
    noMagicNumbers: "off",
    noProcessEnv: "off",
    useBlockStatements: "off",
    useConsistentMemberAccessibility: {
      level: DEFAULT_RULE_SEVERITY,
      options: {
        accessibility: "explicit",
      },
    },
    useExportsLast: "off",
    useFilenamingConvention: "off",
    useImportType: {
      level: DEFAULT_RULE_SEVERITY,
      options: {
        style: "separatedType",
      },
    },
    noHeadElement: "off",
  },
  suspicious: {
    noConsole: "off",
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
