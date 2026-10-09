import pg from 'pg';
import fs from 'fs';

const envContent = fs.readFileSync('.env', 'utf-8');
let dbUrl = '';
for (const line of envContent.split('\n')) {
  const trimmed = line.trim();
  if (trimmed.startsWith('DATABASE_URL2=')) {
    dbUrl = trimmed.substring('DATABASE_URL2='.length).trim().replace(/^['"]|['"]$/g, '');
    break;
  }
}

const pool = new pg.Pool({ connectionString: dbUrl, ssl: { rejectUnauthorized: false } });

async function run() {
  try {
    const orderRes = await pool.query(`SELECT * FROM store_orders WHERE id = 'c155f482-5073-42bb-ad2f-bdc62ad5db50'`);
    console.log('Order columns:', Object.keys(orderRes.rows[0]));
    console.log('Order row full:', orderRes.rows[0]);

    const addrRes = await pool.query(`SELECT * FROM store_customer_addresses WHERE customer_id = '9196e9f8-bcb3-41da-b026-016ec6d15cf1'`);
    console.log('Customer addresses:', addrRes.rows);
  } catch (e) {
    console.error(e);
  } finally {
    await pool.end();
  }
}

run();
