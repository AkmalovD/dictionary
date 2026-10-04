import { execSync } from 'node:child_process';
import { rmSync } from 'node:fs';
import './env';

// Start every run from an empty test database.
export default function globalSetup() {
  const root = `${__dirname}/..`;
  rmSync(`${root}/prisma/test.db`, { force: true });
  execSync('pnpm prisma db push --skip-generate', {
    cwd: root,
    env: process.env,
    stdio: 'ignore',
  });
}
