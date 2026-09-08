import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { frozenFiles, validateFrozenSections } from '../scripts/validate-frozen-sections.js';

test('freeze: rejects missing reference, missing hash and changed source', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'dab-freeze-'));
  try {
    assert.throws(() => validateFrozenSections(root));
    for (const name of [...frozenFiles, 'scripts/frozen-baseline.json']) {
      fs.mkdirSync(path.dirname(path.join(root, name)), {recursive:true});
      fs.copyFileSync(name, path.join(root, name));
    }
    assert.equal(validateFrozenSections(root).allPassed, true);
    fs.appendFileSync(path.join(root, frozenFiles[0]), '\n.changed {}');
    assert.throws(() => validateFrozenSections(root), /Frozen section changed/);
    const baseline = JSON.parse(fs.readFileSync(path.join(root, 'scripts/frozen-baseline.json'), 'utf8'));
    delete baseline.files[frozenFiles[0]];
    fs.writeFileSync(path.join(root, 'scripts/frozen-baseline.json'), JSON.stringify(baseline));
    assert.throws(() => validateFrozenSections(root), /Missing baseline hash/);
  } finally { fs.rmSync(root, {recursive:true, force:true}); }
});
