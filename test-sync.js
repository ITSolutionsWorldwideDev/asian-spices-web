// Run with: node test-sync.js [optional_order_id]
async function run() {
  const defaultOrderId = "d39ebf48-71d2-4c88-b09e-ae99ddb355c4"; // ORD-20260000000066
  const orderId = process.argv[2] || defaultOrderId;

  const url = "https://asian-spices-dev-web.vercel.app/api/admin/odoo-sync";
  const body = { orderId };

  console.log("Triggering Odoo sync on:", url);
  console.log("Order UUID:", orderId, orderId === defaultOrderId ? "(ORD-20260000000066)" : "");

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    console.log("\n--- Response ---");
    console.log("HTTP Status:", res.status, res.statusText);
    const data = await res.json().catch(() => null);
    if (data) {
      console.log("JSON Body:\n", JSON.stringify(data, null, 2));
    } else {
      const text = await res.text();
      console.log("Response Text:\n", text);
    }
  } catch (err) {
    console.error("Network / Fetch Error:", err);
  }
}

run();
