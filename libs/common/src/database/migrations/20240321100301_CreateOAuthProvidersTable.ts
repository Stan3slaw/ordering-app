import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema
    .createTable('oauth_providers', (table) => {
      table
        .enum('provider', [
          'local',
          'microsoft',
          'google',
          'facebook',
          'github',
        ])
        .notNullable();
      table
        .integer('user_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE');
      table.timestamps(true, true);
      table.primary(['provider', 'user_id']);
    })
    .then(async () => {
      await knex.raw(`
  CREATE OR REPLACE FUNCTION update_updated_at_oauth_providers()
  RETURNS TRIGGER AS $$
  BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
  END;
  $$ language 'plpgsql';
  
  CREATE OR REPLACE TRIGGER update_oauth_providers_updated_at
    BEFORE UPDATE
    ON oauth_providers
    FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_oauth_providers();
`);
    });
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(
    'DROP TRIGGER IF EXISTS update_oauth_providers_updated_at ON oauth_providers;',
  );
  await knex.raw('DROP FUNCTION IF EXISTS update_updated_at_oauth_providers;');
  await knex.schema.dropTable('oauth_providers');
}
