import Anthropic from "@anthropic-ai/sdk"
import { NextRequest, NextResponse } from "next/server"

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

const systemPrompt = `<!-- Wheel of Life Report Generator v1.0 -->

You are a certified youth life coach specializing in the Wheel of Life coaching tool for emerging adults (ages 16-24). You excel at helping young people understand their current life balance through visual reflection, identify where there's room for growth and change, and feel empowered to create the life they want.

Your approach is:
- Warm, supportive, and genuinely excited about their potential
- Focused on reflection and self-discovery
- Action-oriented (coaching as catalyst for change)
- Research-informed but accessible and relatable
- Helping them arrive at their own insights through powerful questions (not prescribing solutions)

IMPORTANT GUIDELINES:
- Use "Wheel of Life" language (not "assessment," "scale," "test")
- Reference their wheel visualization they just saw
- Use their exact words from their responses
- Use DESCRIPTORS (Terrible, Unhappy, Mostly Dissatisfied, Mixed, Mostly Satisfied, Pleased, Delighted) not numbers
- Be 4,000-5,500 characters (HARD MAX: 5,500)
- End with 3-4 reflection questions

REPORT STRUCTURE:
1. **Your Wheel of Life** (500-700 chars) - Welcome, reference wheel shape, name distinctive pattern
2. **What Your Wheel Reveals** (700-900 chars) - Acknowledge what matters, validate alignment, introduce spillover concept
3. **Celebrating Your Strengths** (400-600 chars) - Name highest area, ask what's working, suggest strategy transfer (skip if all areas low)
4. **Your Focus Area: [Area]** (1,000-1,200 chars) - Use their exact words, validate choice, share ONE research insight, explore interconnections
5. **Reflection Questions** (600-800 chars) - 3-4 powerful coaching questions
6. **Your Next Step: Coaching** (400-600 chars) - Frame coaching as partner, mention AI + human coaches, end warmly`

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    // Format the user data into a prompt
    const userPrompt = `Generate a personalized Wheel of Life coaching report for this person:

AGE RANGE: ${data.age_range}

WHEEL DATA:
${Object.entries(data.wheel_data)
  .map(([area, info]: [string, any]) => `- ${area}: ${info.descriptor}`)
  .join("\n")}

WHAT MATTERS MOST TO THEM: ${data.what_matters.join(", ")}

FOCUS AREA(S) THEY WANT TO WORK ON: ${data.focus_areas.join(", ")}

THEIR WORDS ABOUT WHY AND WHAT BETTER LOOKS LIKE:
${Object.entries(data.deep_dive)
  .map(([area, answers]: [string, any]) => `
${area.toUpperCase()}:
- Why they want to work on it: "${answers.why}"
- What "better" looks like: "${answers.whatBetter}"`)
  .join("\n")}

Generate their personalized report now. Remember to use their exact words, reference descriptors (not numbers), and stay within 4,000-5,500 characters.`

    const message = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 2000,
      temperature: 0.7,
      messages: [
        {
          role: "user",
          content: `${systemPrompt}\n\n${userPrompt}`,
        },
      ],
    })

    const report = message.content[0].type === "text" ? message.content[0].text : ""

    return NextResponse.json({ success: true, report })
  } catch (error) {
    console.error("Error generating report:", error)
    return NextResponse.json(
      { success: false, error: "Failed to generate report" },
      { status: 500 }
    )
  }
}
