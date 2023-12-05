import database from "infra/database.js";

async function status(request, response) {
  const updatedAt = new Date().toISOString();

  const databaseVersionResult = await database.query("SHOW server_version;");
  const databaseVersionValue = databaseVersionResult.rows[0].server_version;

  const maxConnectionsResult = await database.query("SHOW MAX_CONNECTIONS;");
  const maxConnectionsValue = maxConnectionsResult.rows[0].max_connections;

  const usedConnections = (
    await database.query("SELECT sum(numbackends) FROM pg_stat_database;")
  ).rows[0].sum;

  response.status(200).json({
    updated_at: updatedAt,
    dependencies: {
      database: {
        version: databaseVersionValue,
        max_connections: Number(maxConnectionsValue),
        used_connections: Number(usedConnections),
      },
    },
  });
}

export default status;
