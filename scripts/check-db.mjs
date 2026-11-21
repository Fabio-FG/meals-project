// Standalone DB connectivity check — bypasses Nest entirely.
// Usage: npm run check:db
import 'dotenv/config';
import pg from 'pg';

const config = {
  host: process.env.POSTGRES_HOST || 'localhost',
  port: Number(process.env.POSTGRES_PORT || 5432),
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  connectionTimeoutMillis: 5000,
};

console.log(`Connecting to postgres://${config.user}@${config.host}:${config.port}/${config.database} ...`);

const client = new pg.Client(config);
try {
  await client.connect();
  const { rows } = await client.query('SELECT version()');
  console.log('✓ Connected successfully.');
  console.log('  Server:', rows[0].version);
} catch (err) {
  console.error('✗ Connection failed:', err.message);
  process.exitCode = 1;
} finally {
  await client.end();
}
