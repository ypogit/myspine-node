/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */


export const up = (knex) => {
  return knex.schema.createTable('users', (table) => {
    table.increments('id').primary().unique().notNullable();
    table.string('email').unique().notNullable();
    table.string('password').notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = (knex) => {
  return knex.schema.dropTable('users')
};