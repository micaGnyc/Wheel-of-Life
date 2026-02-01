import { NextRequest, NextResponse } from "next/server"
import { google } from "googleapis"


const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  },
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
})

const sheets = google.sheets({ version: "v4", auth })

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    const timestamp = new Date().toISOString()
    
    // Build row data
    const row = [
      timestamp,
      data.email || "",
      data.name || "",
      data.age || "",
      Array.isArray(data.gender) ? data.gender.join(", ") : data.gender || "",
      Array.isArray(data.ethnicity) ? data.ethnicity.join(", ") : data.ethnicity || "",
      data.optionalNotes || "",
      data.responses?.family || "",
      data.responses?.friends || "",
      data.responses?.school || "",
      data.responses?.work || "",
      data.responses?.living || "",
      data.responses?.self || "",
      data.responses?.overall || "",
      data.customArea?.name || "",
      data.customArea?.score || "",
      Array.isArray(data.whatMatters) ? data.whatMatters.join(", ") : data.whatMatters || "",
      Array.isArray(data.focusAreas) ? data.focusAreas.join(", ") : data.focusAreas || "",
      JSON.stringify(data.deepDive) || "",
      data.report || "",
    ]

    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GOOGLE_SHEETS_SHEET_ID,
      range: "Sheet1!A:S",
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [row],
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error logging to sheets:", error)
    return NextResponse.json(
      { success: false, error: "Failed to log data" },
      { status: 500 }
    )
  }
}
