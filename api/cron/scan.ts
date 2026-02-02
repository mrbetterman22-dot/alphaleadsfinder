import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { generateSalesPitch } from "@/services/geminiService";

// Initialize Supabase with the Service Role Key to bypass security
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export async function GET(req: NextRequest) {
  // 1. Verify Authorization using the secret in your Vercel Dashboard
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    // 2. Fetch all active monitors from your Supabase table
    const { data: monitors, error: monitorError } = await supabase
      .from("monitors")
      .select("*")
      .eq("status", "active");

    if (monitorError) throw monitorError;

    for (const monitor of monitors || []) {
      // 3. Call Outscraper API using your installed key
      const query = `${monitor.keyword} in ${monitor.city}`;
      const response = await fetch(
        `https://api.outscraper.com/maps/search-v2?query=${encodeURIComponent(query)}&limit=20&async=false`,
        {
          headers: { "X-API-KEY": process.env.OUTSCRAPER_API_KEY! },
        },
      );
      const data = await response.json();
      const results = data.results?.[0] || [];

      for (const business of results) {
        // 4. Check if the lead already exists
        const { data: existingLead } = await supabase
          .from("leads")
          .select("*")
          .eq("google_place_id", business.place_id)
          .single();

        if (!existingLead) {
          // Bucket 1: The "New Business" (Fresh Lead)
          await supabase.from("leads").insert({
            monitor_id: monitor.id,
            business_name: business.name,
            google_place_id: business.place_id,
            rating: business.rating,
            type: "new_business",
            email: business.email,
            phone: business.phone,
          });
        } else if (business.reviews_count > (existingLead.reviews_count || 0)) {
          // Bucket 2: The "Pain Point" (Pain Hunter)
          const latestReview = business.latest_reviews?.[0]?.text || "";

          // Trigger AI only if "missed call" or "rude staff" pain points are detected
          if (latestReview.toLowerCase().match(/phone|answer|rude|wait|call/)) {
            const pitch = await generateSalesPitch(business.name, latestReview);

            await supabase
              .from("leads")
              .update({
                type: "pain_point",
                review_text: latestReview,
                ai_pitch: pitch,
                rating: business.rating,
              })
              .eq("google_place_id", business.place_id);
          }
        }
      }

      // Update the last check date for the monitor
      await supabase
        .from("monitors")
        .update({ last_check_date: new Date().toISOString() })
        .eq("id", monitor.id);
    }

    return NextResponse.json({
      success: true,
      message: `Processed ${monitors?.length} monitors.`,
    });
  } catch (error: any) {
    console.error("Scan Error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
