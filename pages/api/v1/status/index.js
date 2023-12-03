import database from "infra/database.js";

async function status(request, response) {
  const updatedAt = new Date().toISOString();
  const postgresVersion = (await database.query("SELECT version()")).rows[0]
    .version;
  const maxConnections = (await database.query("SHOW MAX_CONNECTIONS")).rows[0]
    .max_connections;
  const usedConnections = (
    await database.query("SELECT sum(numbackends) FROM pg_stat_database;")
  ).rows[0].sum;

  response.status(200).json({
    updated_at: updatedAt,
    database: {
      postgres_version: postgresVersion,
      max_connections: Number(maxConnections),
      used_connections: Number(usedConnections),
    },
  });
}

export default status;
