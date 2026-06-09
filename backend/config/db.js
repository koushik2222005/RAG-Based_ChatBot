import knex from 'knex';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const db = knex({
  client: 'sqlite3',
  connection: {
    filename: path.join(__dirname, '../user_storage.sqlite')
  },
  useNullAsDefault: true
});

// Initialize database schemas
const initDb = async () => {
  const hasTable = await db.schema.hasTable('users');
  if (!hasTable) {
    await db.schema.createTable('users', (table) => {
      table.increments('id').primary();
      table.string('email').unique().notNullable();
      table.string('password').notNullable();
      table.timestamps(true, true);
    });
    console.log('Database initialized: "users" table created.');
  }
};

initDb().catch((err) => console.error('Database initialization failed:', err));

export default db;