import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
export const frozenFiles = [
  'src/components/sections/ProblemSignals.astro',
  'src/components/sections/WorkflowSteps.astro',
  'src/components/sections/DemoSection.astro',
  'src/components/islands/WorkflowDemo.tsx',
  'src/components/sections/AutonomySection.astro',
  'src/components/sections/WedgeList.astro',
  'src/components/sections/MethodTimeline.astro',
  'src/components/sections/MeasurementFrame.astro',
  'src/components/sections/FAQ.astro',
  'src/styles/tokens.css',
  'src/styles/global.css',
  'src/styles/motion.css'
];
export function validateFrozenSections(rootDir, baselinePath = path.join(rootDir, 'scripts/frozen-baseline.json')) {
  const baseline = JSON.parse(fs.readFileSync(baselinePath, 'utf8'));
  const files = {};
  for (const name of frozenFiles) {
    const expected = baseline.files?.[name];
    if (!/^[a-f0-9]{64}$/.test(expected || '')) throw new Error(`Missing baseline hash: ${name}`);
    const text = fs.readFileSync(path.join(rootDir, name), 'utf8').replace(/\r\n/g, '\n');
    const actual = crypto.createHash('sha256').update(text).digest('hex');
    if (actual !== expected) throw new Error(`Frozen section changed: ${name}`);
    files[name] = {sha256: actual, exists:true, unchanged:{expected, actual, passed:true}};
  }
  return {timestamp:new Date().toISOString(), normalization:'UTF-8 text with LF line endings', files, allPassed:true};
}
