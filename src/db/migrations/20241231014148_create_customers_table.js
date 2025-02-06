/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = (knex) => {
  return knex.schema.createTable('customers', (table) => {
    table.increments('id').primary().unique().notNullable();
    table.integer('user_id').references('id').inTable('users').onDelete('CASCADE');
    table.text('firstname').notNullable();
    table.text('lastname').notNullable();
    table.text('email').notNullable();
    table.integer('phone_number').notNullable();
    table.boolean('is_consented').notNullable();
    table.integer('age').notNullable();
    table.text('sex').notNullable();
    table.string('height').notNullable();
    table.string('weight').notNullable();
    table.text('occupation').notNullable();
    table.text('acute_pain_type');
    table.json('pain_summary');
    table.integer('pain_degree');
    table.text('pain_duration');
    table.text('activity_level');
    table.json('pain_areas');
    table.text('pain_start_type');
    table.json('pain_start_causes');
    table.text('physical_therapy_history');
    table.text('offered_spinal_surgery');
    table.json('spine_imaging_types');
    table.text('previous_spinal_surgery');
    table.text('limb_weakness_numbness');
    table.text('walking_unsteadiness');
    table.text('offered_procedure');
    table.text('offered_by');
    table.text('discussed_result');
    table.text('surgery_type');
    table.timestamp('surgery_date_time');
    table.text('surgeon');
    table.text('hand_object_manipulation_problem');
    table.text('past_pain_medication');
    table.text('current_pain_medication');
    table.json('painful_activities');
    table.json('painful_leg_activities');
    table.json('helpful_activities');
    table.boolean('unoperational_due_to_pain');
    table.text('physician_visit_for_pain');
    table.text('injection_procedure_for_pain');
    table.json('injection_types');
    table.text('injection_relief');
    table.text('helpful_injection');
    table.text('injection_relief_duration');
    table.text('medical_problem');
    table.text('current_medication');
    table.text('password');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = (knex) => {
  return knex.schema.dropTable('customers');
};
