import { execSync } from 'node:child_process';
import { PrismaClient } from '@prisma/client';
import './env';

// Start every run from an empty test schema.
export default async function globalSetup() {
  execSync('pnpm prisma db push --skip-generate', {
    cwd: `${__dirname}/..`,
    env: process.env,
    stdio: 'ignore',
  });

  const prisma = new PrismaClient();
  await prisma.termRelation.deleteMany();
  await prisma.term.deleteMany();
  await prisma.topic.deleteMany();
  await prisma.$disconnect();
}
