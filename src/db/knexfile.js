// Update with your config settings.

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {



  development: {
    client: 'postgresql',
    connection: {
      database: process.env.POSTGRES_DATABASE_NAME,
      user:     process.env.POSTGRES_USER_NAME,
      password: process.env.POSTGRES_PASSWORD
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },

  

};
