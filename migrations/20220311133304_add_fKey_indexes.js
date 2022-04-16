exports.up = (knex) => {
  return knex.schema
    .alterTable("sessions", (table) => {
      table.index(["user_id"]);
    })
    .alterTable("notes", (table) => {
      table.index(["user_id"]);
    });
};

exports.down = (knex) => {
  return knex.schema
    .alterTable("sessions", (table) => {
      table.dropIndex(["user_id"]);
    })
    .alterTable("notes", (table) => {
      table.dropIndex(["user_id"]);
    });
};
