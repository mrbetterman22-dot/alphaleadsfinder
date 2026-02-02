import { createClient } from "@supabase/supabase-js";
import { generateSalesPitch } from "../../services/geminiService";

const supabase = createClient(
  process.env.SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || "",
);

export default async function handler(req: any, res: any) {
  const authHeader = req.headers["authorization"];
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  console.log("Starting Alpha Scan...");

  try {
    // 1. Fetch Active Monitors
    const { data: monitors, error: monitorError } = await supabase
      .from("monitors")
      .select("*")
      .eq("status", "active");

    if (monitorError) throw monitorError;
    console.log(`Found ${monitors?.length || 0} active monitors.`);

    if (!monitors || monitors.length === 0) {
      return res.status(200).json({ message: "No active monitors." });
    }

    for (const monitor of monitors) {
      console.log(`Scanning for ${monitor.keyword} in ${monitor.city}...`);

      // 2. Call Outscraper
      const query = `${monitor.keyword} in ${monitor.city}`;
      const osResponse = await fetch(
        `https://api.outscraper.com/maps/search-v2?query=${encodeURIComponent(query)}&limit=50&async=false`,
        {
          headers: { "X-API-KEY": process.env.OUTSCRAPER_API_KEY || "" },
        },
      );

      const osData = await osResponse.json();
      const businesses = osData.results?.[0] || [];
      console.log(`Outscraper found ${businesses.length} businesses.`);

      for (const biz of businesses) {
        // 3. Save to Leads Table
        const { error: insertError } = await supabase.from("leads").upsert(
          {
            monitor_id: monitor.id,
            business_name: biz.name,
            google_place_id: biz.place_id,
            rating: biz.rating,
            reviews_count: biz.reviews_count,
            type: "new_business",
            email: biz.email || null,
            phone: biz.phone || null,
          },
          { onConflict: "google_place_id" },
        );

        if (insertError) console.error("Insert Error:", insertError.message);
      }

      // 4. Update the Monitor's last_check_date
      await supabase
        .from("monitors")
        .update({ last_check_date: new Date().toISOString() })
        .eq("id", monitor.id);
    }

    return res.status(200).json({ success: true });
  } catch (error: any) {
    console.error("Fatal Error:", error.message);
    return res.status(500).json({ error: error.message });
  }
}
