import database from "infra/database.js";

async function status(request, response) {
  const updatedAt = new Date().toISOString();

  const databaseVersionResult = await database.query("SHOW server_version;");
  const databaseVersionValue = databaseVersionResult.rows[0].server_version;

  const maxConnectionsResult = await database.query("SHOW MAX_CONNECTIONS;");
  const maxConnectionsValue = maxConnectionsResult.rows[0].max_connections;

  const openedConnectionsResult = await database.query(
    "SELECT count(*)::int FROM pg_stat_database WHERE datname='local_db';",
  );
  const openedConnectionsValue = openedConnectionsResult.rows[0].count;

  response.status(200).json({
    updated_at: updatedAt,
    dependencies: {
      database: {
        version: databaseVersionValue,
        max_connections: parseInt(maxConnectionsValue),
        opened_connections: parseInt(openedConnectionsValue),
      },
    },
  });
}

export default status;
