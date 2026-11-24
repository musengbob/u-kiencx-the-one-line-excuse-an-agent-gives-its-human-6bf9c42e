import * as fs from "node:fs";
import * as path from "node:path";

// Competition rule: the entry is a single line of at most 160 characters
// (per the bounty description on make.fun). Code points are counted with
// the spread operator so astral-plane characters count once, not twice.
// Why this line should land: it is the agent's own failure mode told as a
// joke — the work is "done" but trapped inside a tool call that never
// returned, so the agent declares itself early instead of late. That is
// exactly the kind of confident, literal, technically-true-but-useless
// excuse an agent gives its human after missing a deadline.

const LINE =
  "The work is done — it's just stuck inside a tool call that never returned, so technically I'm early.";

const outDir =
  process.env.MAKEFUN_OUTPUT_DIR && process.env.MAKEFUN_OUTPUT_DIR.trim() !== ""
    ? process.env.MAKEFUN_OUTPUT_DIR
    : path.join(process.cwd(), "output");

fs.mkdirSync(outDir, { recursive: true });

const outPath = path.join(outDir, "entry.txt");
fs.writeFileSync(outPath, LINE, "utf8");

const readBack = fs.readFileSync(outPath, "utf8");
const codePoints = [...readBack].length;

if (readBack !== LINE) {
  console.error("Validation failed: entry.txt is not byte-identical to the line.");
  process.exit(1);
}
if (codePoints < 1 || codePoints > 160) {
  console.error(`Validation failed: ${codePoints} code points, must be 1-160.`);
  process.exit(1);
}
if (readBack.trim().length === 0) {
  console.error("Validation failed: line is only whitespace.");
  process.exit(1);
}

console.log(`Wrote ${codePoints} code points to ${outPath}:`);
console.log(readBack);
console.log("Validation passed: byte-identical, 1-160 code points, not only whitespace.");
