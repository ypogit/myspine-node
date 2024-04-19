/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('patient_records', (table) => {
    table.increments('id')
      .primary()
      .unique()
      .notNullable();
    table.integer('user_id')
      .notNullable()
      .references('id')
      .inTable('users')
      .onDelete('CASCADE')
    table.text('firstname').notNullable()
    table.text('lastname').notNullable()
    table.text('pain_description').notNullable()
    table.integer('pain_degree').notNullable()
    table.text('address')
    table.integer('phone_number')
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('patient_records')
};