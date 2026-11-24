// Run with: node test-sync.js [optional_order_id]
async function run() {
  const defaultOrderId = "271afd09-9617-499f-91b9-51f1ed486a49"; // ORD-20260000000065
  const orderId = process.argv[2] || defaultOrderId;

  const url = "https://asian-spices-dev-web.vercel.app/api/admin/odoo-sync";
  const body = { orderId };

  console.log("Triggering Odoo sync on:", url);
  console.log("Order UUID:", orderId, orderId === defaultOrderId ? "(ORD-20260000000065)" : "");

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
