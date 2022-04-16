exports.up = (knex) => {
  return knex.schema
    .createTable("users", (table) => {
      table.increments("id");
      table.timestamp("created_at").defaultTo(knex.fn.now());
      table.string("user_name", 100).notNullable().unique();
      table.string("password", 64).notNullable();

      table.index(["user_name"]);
    })
    .createTable("sessions", (table) => {
      table.increments("id");
      table.timestamp("created_at").defaultTo(knex.fn.now());
      table.integer("user_id").notNullable().references("id").inTable("users");
      table.string("session", 21).notNullable().unique();

      table.index(["session"]);
    })
    .createTable("notes", (table) => {
      table.increments("id");
      table.timestamp("created_at").defaultTo(knex.fn.now());
      table.timestamp("updated_at").defaultTo(knex.fn.now());
      table.integer("user_id").notNullable().references("id").inTable("users");
      table.string("title", 200).notNullable().checkLength("!=", 0, "notes_title_check_not_empty");
      table.text("text").notNullable().checkLength("!=", 0, "notes_text_check_not_empty");
      table.text("html").notNullable().checkLength("!=", 0, "notes_html_check_not_empty");
      table.boolean("is_archive").defaultTo(false);

      table.index(["title"]);
      table.index(["created_at"]);
    })
    .raw("CREATE INDEX notes_ts_index ON notes USING GIN (to_tsvector('russian', title))");
};

exports.down = (knex) => {
  return knex.schema.dropTable("users").dropTable("sessions").dropTable("notes");
};
