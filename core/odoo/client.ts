const ODOO_URL = process.env.ODOO_URL!;
const ODOO_DB = process.env.ODOO_DB!;
const ODOO_USERNAME = process.env.ODOO_USERNAME!;
const ODOO_API_KEY = process.env.ODOO_API_KEY!;

let cachedUid: number | null = null;

async function jsonRpcCall(service: string, method: string, args: unknown[]) {
  if (!ODOO_URL) {
    throw new Error("ODOO_URL environment variable is not configured.");
  }

  const res = await fetch(`${ODOO_URL}/jsonrpc`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      method: "call",
      params: { service, method, args },
      id: Date.now(),
    }),
  });

  if (!res.ok) {
    throw new Error(`Odoo HTTP error: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  if (data.error) {
    throw new Error(
      `Odoo RPC error: ${data.error.data?.message || data.error.message}`
    );
  }

  return data.result;
}

export async function getOdooUid(): Promise<number> {
  if (cachedUid) return cachedUid;
  const uid = await jsonRpcCall("common", "authenticate", [
    ODOO_DB,
    ODOO_USERNAME,
    ODOO_API_KEY,
    {},
  ]);
  if (!uid) {
    throw new Error(
      "Odoo authentication failed. Check ODOO_DB, ODOO_USERNAME, or ODOO_API_KEY."
    );
  }
  cachedUid = uid;
  return uid;
}

export async function odooExecute<T = any>(
  model: string,
  method: string,
  args: unknown[] = [],
  kwargs: Record<string, unknown> = {}
): Promise<T> {
  const uid = await getOdooUid();
  return jsonRpcCall("object", "execute_kw", [
    ODOO_DB,
    uid,
    ODOO_API_KEY,
    model,
    method,
    args,
    kwargs,
  ]);
}
