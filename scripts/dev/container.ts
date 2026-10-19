// Compatibility for bun run dev:container; the actual launcher needs only Python.
import process from "node:process";

const candidates =
  process.platform === "win32"
    ? [["py", "-3"], ["python"], ["python3"]]
    : [["python3"], ["python"]];
const interpreter = candidates.find(([command]) => Bun.which(command));
if (!interpreter) {
  console.error("Install Python 3.9 or newer; see docs/src/Setup.md.");
  process.exit(1);
}
const child = Bun.spawnSync(
  [...interpreter, `${import.meta.dir}/dev.py`, "start", ...process.argv.slice(2)],
  { stdin: "inherit", stdout: "inherit", stderr: "inherit" },
);
process.exit(child.exitCode);
