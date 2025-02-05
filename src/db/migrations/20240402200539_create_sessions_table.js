/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = (knex) => {
  return knex.schema.createTable('sessions', (table) => {
    table.string('sid').primary().unique().notNullable();
    table.json('sess').notNullable();
    table.string('expire').notNullable();
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = (knex) => {
  return knex.schema.dropTable('sessions')
};
