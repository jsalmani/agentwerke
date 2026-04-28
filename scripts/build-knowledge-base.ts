/**
 * Knowledge base build script — multi-vertical.
 *
 * Walks every `knowledge-base*` directory at the repo root and emits a
 * corresponding TypeScript module under /lib/.
 *
 *   /knowledge-base/         → /lib/knowledge-base.generated.ts          (parent: Agentwerke)
 *   /knowledge-base-brokerage/ → /lib/knowledge-base-brokerage.generated.ts (BD vertical)
 *   /knowledge-base-{whatever}/ → /lib/knowledge-base-{whatever}.generated.ts
 *
 * Each markdown file in a KB dir is wrapped in <doc id="..."> XML tags
 * for better Claude attention and citation.
 *
 * Run before `next build` (see package.json `build` script).
 * Run manually with: `npm run build:kb`
 */

import { readdirSync, readFileSync, writeFileSync, mkdirSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, '..');
const LIB_DIR = join(REPO_ROOT, 'lib');

function buildOne(kbDirName: string) {
  const kbDir = join(REPO_ROOT, kbDirName);
  const files = readdirSync(kbDir)
    .filter((f) => f.endsWith('.md'))
    .sort(); // Numbered prefixes (01-, 02-, ...) ensure stable ordering

  if (files.length === 0) {
    console.warn(`  (skip) no markdown files in ${kbDirName}`);
    return;
  }

  const docs: string[] = [];
  let totalChars = 0;
  for (const file of files) {
    const content = readFileSync(join(kbDir, file), 'utf8').trim();
    const id = file.replace(/\.md$/, '');
    docs.push(`<doc id="${id}">\n${content}\n</doc>`);
    totalChars += content.length;
  }

  const concatenated = docs.join('\n\n');
  const approxTokens = Math.ceil(totalChars / 4);

  // Build output filename: knowledge-base → knowledge-base.generated.ts
  //                       knowledge-base-brokerage → knowledge-base-brokerage.generated.ts
  const outFile = join(LIB_DIR, `${kbDirName}.generated.ts`);

  // Build a stable export name that's unique per vertical:
  //   knowledge-base → KNOWLEDGE_BASE
  //   knowledge-base-brokerage → KNOWLEDGE_BASE_BROKERAGE
  const exportName = kbDirName.toUpperCase().replace(/-/g, '_');

  const output = `/**
 * AUTO-GENERATED FILE — DO NOT EDIT BY HAND
 *
 * Source: /${kbDirName}/*.md
 * Generated: ${new Date().toISOString()}
 * Files: ${files.length}
 * Approximate tokens: ${approxTokens}
 *
 * To update: edit the markdown files and run \`npm run build:kb\`.
 */

export const ${exportName} = ${JSON.stringify(concatenated)};

export const ${exportName}_META = {
  files: ${JSON.stringify(files)},
  generatedAt: ${JSON.stringify(new Date().toISOString())},
  approximateTokens: ${approxTokens},
};
`;

  mkdirSync(dirname(outFile), { recursive: true });
  writeFileSync(outFile, output, 'utf8');
  console.log(`  ✓ ${kbDirName.padEnd(28, ' ')} ${files.length} files, ~${approxTokens} tokens → ${exportName}`);
}

function main() {
  const candidates = readdirSync(REPO_ROOT)
    .filter((name) => name.startsWith('knowledge-base'))
    .filter((name) => statSync(join(REPO_ROOT, name)).isDirectory());

  if (candidates.length === 0) {
    throw new Error('No knowledge-base directories found at the repo root.');
  }

  console.log(`Building ${candidates.length} knowledge base${candidates.length === 1 ? '' : 's'}...`);
  for (const kb of candidates.sort()) {
    buildOne(kb);
  }
  console.log('Done.');
}

main();
