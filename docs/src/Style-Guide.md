# Style Guide

## Case Styles

### Typescript

**variableNames/functionName**: camelCase

**.tsx file names**: PascalCase

**.ts files names**: camelCase

### JSON

**File names**: kebab-case

**Fields**: camelCase

### Python

**Everything**: snake_case

**Constants**: SCREAM_CASE

When importing from modules whose names start with an underscore, it is considered an anti‑pattern if the import is not relative within the same package, since such modules are meant to be private implementation details.

### Everything Else

**kebab-case**: (github-branch-name, image-name, folder-name)

## Function Declarations

### Typescript

Use `const` over `function` for function declarations.

```typescript
const myFunction = () => {
  return "Hello, world!";
};
```

## Special Words

**floorplan** is one word!
