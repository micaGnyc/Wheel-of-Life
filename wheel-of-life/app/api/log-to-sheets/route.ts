import { NextRequest, NextResponse } from "next/server"
import { google } from "googleapis"

const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_SHEETS_PRIVATE_KEY?.split('\\n').join('\n'),
  },
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
})

const sheets = google.sheets({ version: "v4", auth })

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    console.log("Received data:", JSON.stringify(data, null, 2))
    const timestamp = new Date().toISOString()
    
    // Build row data matching your sheet columns
    const row = [
      timestamp,
      data.email || "",
      data.name || "",
      data.age || "",
      Array.isArray(data.gender) ? data.gender.join(", ") : data.gender || "",
      Array.isArray(data.ethnicity) ? data.ethnicity.join(", ") : data.ethnicity || "",
      data.notes || "",
      data.quizOrder || "",
      
      // Big Five individual responses (20 items)
      data.bf_responses?.[1] || "",
      data.bf_responses?.[2] || "",
      data.bf_responses?.[3] || "",
      data.bf_responses?.[4] || "",
      data.bf_responses?.[5] || "",
      data.bf_responses?.[6] || "",
      data.bf_responses?.[7] || "",
      data.bf_responses?.[8] || "",
      data.bf_responses?.[9] || "",
      data.bf_responses?.[10] || "",
      data.bf_responses?.[11] || "",
      data.bf_responses?.[12] || "",
      data.bf_responses?.[13] || "",
      data.bf_responses?.[14] || "",
      data.bf_responses?.[15] || "",
      data.bf_responses?.[16] || "",
      data.bf_responses?.[17] || "",
      data.bf_responses?.[18] || "",
      data.bf_responses?.[19] || "",
      data.bf_responses?.[20] || "",
      
      // Big Five open-ended
      data.bf_openEnded?.strength || "",
      data.bf_openEnded?.futureself || "",
      data.bf_openEnded?.goal || "",
      
      // Big Five STEN scores
      data.bf_sten?.E || "",
      data.bf_sten?.A || "",
      data.bf_sten?.C || "",
      data.bf_sten?.N || "",
      data.bf_sten?.O || "",
      
      // Big Five report
      data.bf_report || "",
      
      // Big Five feedback
      data.bf_feedback?.accuracy || "",
      data.bf_feedback?.useful || "",
      data.bf_feedback?.length || "",
      Array.isArray(data.bf_feedback?.feelings) ? data.bf_feedback.feelings.join(", ") : data.bf_feedback?.feelings || "",
      
      // Wheel of Life responses
      data.wol_responses?.family || "",
      data.wol_responses?.friends || "",
      data.wol_responses?.school || "",
      data.wol_responses?.work || "",
      data.wol_responses?.living || "",
      data.wol_responses?.self || "",
      data.wol_responses?.overall || "",
      
      // WoL custom area
      data.wol_customArea?.name || "",
      data.wol_customArea?.score || "",
      
      // WoL prioritization
      Array.isArray(data.wol_whatMatters) ? data.wol_whatMatters.join(", ") : data.wol_whatMatters || "",
      Array.isArray(data.wol_focusAreas) ? data.wol_focusAreas.join(", ") : data.wol_focusAreas || "",
      JSON.stringify(data.wol_deepDive) || "",
      
      // WoL report
      data.wol_report || "",
      
      // WoL feedback
      data.wol_feedback?.accuracy || "",
      data.wol_feedback?.useful || "",
      data.wol_feedback?.length || "",
      Array.isArray(data.wol_feedback?.feelings) ? data.wol_feedback.feelings.join(", ") : data.wol_feedback?.feelings || "",
      
      // Final feedback
      data.nps ?? "",
      data.finalLiked || "",
      data.finalChange || "",
      data.wantConversation ? "Yes" : "No",
      data.completed ? "Yes" : "No",
    ]
    console.log("Attempting to write to sheet...")
    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GOOGLE_SHEETS_SHEET_ID,
      range: "Sheet1!A:BQ",
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [row],
      },
    })
    console.log("Successfully wrote to sheet")
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error logging to sheets:", error)
    return NextResponse.json(
      { success: false, error: "Failed to log data" },
      { status: 500 }
    )
  }
}
