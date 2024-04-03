/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('user_tokens', (table) => {
    table.increments('id')
         .primary()
         .unique()
         .notNullable();
    table.integer('user_id')
         .notNullable()
         .references('id')
         .inTable('users')
         .onDelete('CASCADE');
    table.text('access_token').notNullable();
    table.text('refresh_token').notNullable();
    table.timestamp('access_token_expires_at').notNullable();
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('user_tokens')
};