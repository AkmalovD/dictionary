// Tests use their own database file so they never touch the real dictionary.
process.env.DATABASE_URL = 'file:./test.db';
