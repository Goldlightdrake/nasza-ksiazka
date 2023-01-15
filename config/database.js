// strapi-api/config/database.js
module.exports = ({ env }) => ({
  connection: {
    client: "postgres",
    connection: {
      host: env("PGHOST", "localhost"),
      port: env.int("PGPORT", 5432),
      database: env("PGDATABASE", "bank"),
      user: env("PGUSER", "postgres"),
      password: env("PGPASSWORD", "0000"),
      ssl: {
        rejectUnauthorized: env.bool("DATABASE_SSL_SELF", false),
      },
    },
    debug: false,
  },
});
