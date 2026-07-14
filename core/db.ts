// core/db.ts

import { Pool } from "pg";
import type { QueryResult, QueryResultRow } from "pg";

// 🟢 FIXED: Safely extend globalThis types without using aggressive casting shortcuts
declare global {
  var varGlobalPool: Pool | undefined;
}

export const pool =
  globalThis.varGlobalPool ??
  new Pool({
    connectionString: process.env.DATABASE_URL,
    // 🟢 OPTIMIZED: Scaled settings tailored to prevent serverless pool exhaustion
    max: 3,// 20
    idleTimeoutMillis: 5000,// 30000,
    connectionTimeoutMillis: 5000,//10000, // Raised to 10s to gracefully survive sudden server lag spikes
  });

// pool.on("connect", () => {
//   console.log("New DB connection");
// });

// pool.on("acquire", () => {
//   console.log("Acquire");
// });

// pool.on("remove", () => {
//   console.log("Remove");
// });

if (process.env.NODE_ENV !== "production") {
  globalThis.varGlobalPool = pool;
}

/**
 * Executes a type-safe raw PostgreSQL query using the connection pool
 * @param text The SQL query string (e.g., 'SELECT * FROM users WHERE id = $1')
 * @param params Array of dynamic query arguments matching placeholders
 */
export async function runQuery<T extends QueryResultRow = QueryResultRow>(
  text: string,
  params?: unknown[],
): Promise<QueryResult<T>> {
  const start = Date.now();

  try {
    const result = await pool.query<T>(text, params);

    if (process.env.NODE_ENV !== "production") {
      const duration = Date.now() - start;
      console.log(`[Database Query] ${duration}ms | Rows: ${result.rowCount}`);
    }

    return result;
  } catch (error) {
    console.error("[Database Query Error]", error);
    throw error;
  }
}

type SqlBuildResult = {
  text: string;
  values: any[];
};

function escapeIdentifier(id: string): string {
  return `"${id.replace(/"/g, '""')}"`;
}

/**
 * Build INSERT query dynamically
 */
export function buildInsertQuery(
  table: string,
  data: Record<string, unknown>,
): SqlBuildResult {
  const keys = Object.keys(data);
  const values = Object.values(data);

  if (keys.length === 0) {
    throw new Error(
      "Cannot build INSERT query with an empty data layout payload.",
    );
  }

  const escapedTable = escapeIdentifier(table);
  const escapedColumns = keys.map(escapeIdentifier).join(", ");
  const placeholders = keys.map((_, i) => `$${i + 1}`).join(", ");

  return {
    text: `INSERT INTO ${escapedTable} (${escapedColumns}) VALUES (${placeholders}) RETURNING *;`,
    values,
  };
}

/**
 * Build UPDATE query dynamically
 */
export function buildUpdateQuery(
  table: string,
  data: Record<string, unknown>,
  where: {
    column: string;
    value: unknown;
  },
): SqlBuildResult {
  const keys = Object.keys(data);
  const values = Object.values(data);

  if (keys.length === 0) {
    throw new Error(
      "Cannot build UPDATE query with an empty update data footprint.",
    );
  }

  const escapedTable = escapeIdentifier(table);
  const escapedWhereColumn = escapeIdentifier(where.column);

  // Clean parameter indices map: $1, $2, $3 etc. sequentially matching values position array
  const setClause = keys
    .map((key, i) => `${escapeIdentifier(key)} = $${i + 1}`)
    .join(", ");

  // Append the 'WHERE' comparison constraint token safely right at the very tail-end placeholder position
  const wherePlaceholderIndex = keys.length + 1;

  return {
    text: `UPDATE ${escapedTable} SET ${setClause} WHERE ${escapedWhereColumn} = $${wherePlaceholderIndex} RETURNING *;`,
    values: [...values, where.value],
  };
}

export type { QueryResult, QueryResultRow } from "pg";
