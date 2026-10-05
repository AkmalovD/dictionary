// Tests run in their own Postgres schema on the dev database, so they never
// touch the words in dev or production.
process.loadEnvFile(`${__dirname}/../.env`);

function withTestSchema(url: string | undefined): string {
  if (!url) throw new Error('Set DATABASE_URL and DIRECT_URL in backend/.env');
  const parsed = new URL(url);
  parsed.searchParams.set('schema', 'test');
  return parsed.toString();
}

process.env.DATABASE_URL = withTestSchema(process.env.DATABASE_URL);
process.env.DIRECT_URL = withTestSchema(process.env.DIRECT_URL);
