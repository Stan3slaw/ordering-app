import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema
    .createTable('orders', (table) => {
      table.increments('id').primary();
      table.string('name').notNullable();
      table.integer('total_price').notNullable();
      table.string('details').nullable();
      table.timestamps(true, true);
    })
    .then(async () => {
      await knex.raw(`
      CREATE OR REPLACE FUNCTION update_updated_at_orders()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = NOW();
        RETURN NEW;
      END;
      $$ language 'plpgsql';
      
      CREATE OR REPLACE TRIGGER update_orders_updated_at
        BEFORE UPDATE
        ON orders
        FOR EACH ROW
      EXECUTE PROCEDURE update_updated_at_orders();
`);
    });
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw('DROP TRIGGER IF EXISTS update_orders_updated_at ON orders;');
  await knex.raw('DROP FUNCTION IF EXISTS update_updated_at_orders;');
  await knex.schema.dropTableIfExists('orders');
}
