import { NextRequest, NextResponse } from "next/server"

const CASSIDY_WEBHOOK_URL = process.env.CASSIDY_WEBHOOK_URL

export async function POST(request: NextRequest) {
  console.log("CASSIDY_WEBHOOK_URL:", CASSIDY_WEBHOOK_URL) // Add this line

  try {
    const data = await request.json()
    
    // Call Cassidy webhook
    const response = await fetch(CASSIDY_WEBHOOK_URL!, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        first_name: data.first_name,
        scores: data.scores,
        openEnded: data.openEnded,
        age: data.age
      })
    })

    const result = await response.json()
    console.log("Cassidy response:", JSON.stringify(result, null, 2))


    // Extract report from Cassidy response
    const report = result?.workflowRun?.actionResults?.[2]?.output || ""

    return NextResponse.json({ success: true, report })
  } catch (error) {
    console.error("Error generating Big Five report:", error)
    return NextResponse.json(
      { success: false, error: "Failed to generate report" },
      { status: 500 }
    )
  }
}
