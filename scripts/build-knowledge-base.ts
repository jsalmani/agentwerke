/**
 * Knowledge base build script.
 *
 * Concatenates all markdown files in /knowledge-base into a single TypeScript
 * constant exported from /lib/knowledge-base.generated.ts. The constant is
 * wrapped in <doc id="..."> XML tags for better Claude attention and citation.
 *
 * Run automatically before `next build` (see package.json `build` script).
 * Run manually with: `npm run build:kb`
 */

import { readdirSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const KB_DIR = join(__dirname, '..', 'knowledge-base');
const OUT_FILE = join(__dirname, '..', 'lib', 'knowledge-base.generated.ts');

function buildKnowledgeBase() {
  const files = readdirSync(KB_DIR)
    .filter((f) => f.endsWith('.md'))
    .sort(); // Numbered prefixes (01-, 02-, ...) ensure stable ordering

  if (files.length === 0) {
    throw new Error(`No markdown files found in ${KB_DIR}`);
  }

  const docs: string[] = [];
  let totalChars = 0;

  for (const file of files) {
    const content = readFileSync(join(KB_DIR, file), 'utf8').trim();
    const id = file.replace(/\.md$/, '');
    docs.push(`<doc id="${id}">\n${content}\n</doc>`);
    totalChars += content.length;
  }

  const concatenated = docs.join('\n\n');
  const approxTokens = Math.ceil(totalChars / 4); // Rough heuristic

  const output = `/**
 * AUTO-GENERATED FILE — DO NOT EDIT BY HAND
 *
 * Source: /knowledge-base/*.md
 * Generated: ${new Date().toISOString()}
 * Files: ${files.length}
 * Approximate tokens: ${approxTokens}
 *
 * To update: edit the markdown files in /knowledge-base/ and run \`npm run build:kb\`.
 */

export const KNOWLEDGE_BASE = ${JSON.stringify(concatenated)};

export const KNOWLEDGE_BASE_META = {
  files: ${JSON.stringify(files)},
  generatedAt: ${JSON.stringify(new Date().toISOString())},
  approximateTokens: ${approxTokens},
};
`;

  // Make sure the output directory exists
  mkdirSync(dirname(OUT_FILE), { recursive: true });
  writeFileSync(OUT_FILE, output, 'utf8');

  console.log(`✓ Built knowledge base from ${files.length} files`);
  console.log(`  Output: ${OUT_FILE}`);
  console.log(`  Approximate tokens: ${approxTokens}`);
  console.log(`  Cache eligibility: ${approxTokens >= 1024 ? 'YES (Sonnet 1024+, Haiku 4096+)' : 'NO — too small to cache'}`);
}

buildKnowledgeBase();
