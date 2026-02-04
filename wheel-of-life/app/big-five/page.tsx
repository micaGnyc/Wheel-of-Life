"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { ChevronDown } from "lucide-react"

// STEN Score Conversion
// Normative data from Baldasaro, Shanahan, & Bauer (2013)
// Sample: N = 15,471 young adults

const STEN_BOUNDARIES: Record<string, number[]> = {
    E: [0.98, 1.36, 1.74, 2.12, 2.50, 2.89, 3.27, 3.65, 4.03],
    A: [0.83, 1.13, 1.44, 1.74, 2.04, 2.34, 2.64, 2.94, 3.25],
    C: [0.83, 1.16, 1.50, 1.84, 2.17, 2.51, 2.84, 3.18, 3.52],
    N: [1.84, 2.18, 2.53, 2.87, 3.21, 3.56, 3.90, 4.24, 4.59],
    O: [0.99, 1.30, 1.61, 1.92, 2.22, 2.53, 2.84, 3.15, 3.46],
  }
  
  const getSten = (score: number, trait: string): number => {
    const boundaries = STEN_BOUNDARIES[trait]
    if (!boundaries) return 5
    
    for (let sten = 0; sten < boundaries.length; sten++) {
      if (score < boundaries[sten]) {
        return sten + 1
      }
    }
    return 10
  }
  
  const getStenDescription = (sten: number): string => {
    if (sten <= 2) return "Very Low"
    if (sten <= 4) return "Low"
    if (sten <= 6) return "Average"
    if (sten <= 8) return "High"
    return "Very High"
  }
  
// Mini-IPIP 20 items
const questions = [
  // Extraversion
  { id: 1, text: "Am the life of the party.", trait: "E", reversed: false },
  { id: 2, text: "Don't talk a lot.", trait: "E", reversed: true },
  { id: 3, text: "Talk to a lot of different people at parties.", trait: "E", reversed: false },
  { id: 4, text: "Keep in the background.", trait: "E", reversed: true },
  
  // Agreeableness
  { id: 5, text: "Sympathize with others' feelings.", trait: "A", reversed: false },
  { id: 6, text: "Am not really interested in others.", trait: "A", reversed: true },
  { id: 7, text: "Feel others' emotions.", trait: "A", reversed: false },
  { id: 8, text: "Am not interested in other people's problems.", trait: "A", reversed: true },
  
  // Conscientiousness
  { id: 9, text: "Get chores done right away.", trait: "C", reversed: false },
  { id: 10, text: "Often forget to put things back in their proper place.", trait: "C", reversed: true },
  { id: 11, text: "Like order.", trait: "C", reversed: false },
  { id: 12, text: "Make a mess of things.", trait: "C", reversed: true },
  
  // Neuroticism
  { id: 13, text: "Have frequent mood swings.", trait: "N", reversed: false },
  { id: 14, text: "Am relaxed most of the time.", trait: "N", reversed: true },
  { id: 15, text: "Get upset easily.", trait: "N", reversed: false },
  { id: 16, text: "Seldom feel blue.", trait: "N", reversed: true },
  
  // Openness
  { id: 17, text: "Have a vivid imagination.", trait: "O", reversed: false },
  { id: 18, text: "Have difficulty understanding abstract ideas.", trait: "O", reversed: true },
  { id: 19, text: "Am not interested in abstract ideas.", trait: "O", reversed: true },
  { id: 20, text: "Do not have a good imagination.", trait: "O", reversed: true },
]

const responseOptions = [
  { value: 1, label: "Strongly Disagree" },
  { value: 2, label: "Disagree" },
  { value: 3, label: "Neither Agree nor Disagree" },
  { value: 4, label: "Agree" },
  { value: 5, label: "Strongly Agree" },
]

interface BigFiveProps {
  email: string
  firstName: string
  age: string
  gender: string[]
  ethnicity: string[]
  optionalNotes: string
  onComplete: (data: unknown) => void
}

export default function BigFiveQuiz({
  firstName,
  age,
  onComplete,
}: BigFiveProps) {
  const [hasStarted, setHasStarted] = useState(false)
  const [responses, setResponses] = useState<Record<number, number | null>>(
    Object.fromEntries(questions.map(q => [q.id, null]))
  )
  const [openEnded, setOpenEnded] = useState({
    strength: "",
    futureself: "",
    goal: ""
  })
  const [showResults, setShowResults] = useState(false)
  const [report, setReport] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [errors, setErrors] = useState<string[]>([])
  const [loadingMessage, setLoadingMessage] = useState("")

  const handleResponseChange = (questionId: number, value: number) => {
    setResponses(prev => ({ ...prev, [questionId]: value }))
  }

  const scrollToAssessment = () => {
    document.getElementById("assessment")?.scrollIntoView({ behavior: "smooth" })
  }

  const calculateScores = () => {
    const traits: Record<string, number[]> = { E: [], A: [], C: [], N: [], O: [] }
    
    questions.forEach(q => {
      const response = responses[q.id]
      if (response !== null) {
        // Reverse score if needed (6 - response for reversed items)
        const score = q.reversed ? (6 - response) : response
        traits[q.trait].push(score)
      }
    })
    
    // Calculate raw average for each trait
    const rawScores: Record<string, number> = {}
    Object.entries(traits).forEach(([trait, values]) => {
      rawScores[trait] = values.length > 0 
        ? values.reduce((a, b) => a + b, 0) / values.length
        : 0
    })
    
    // Convert to STEN scores
    const stenScores: Record<string, number> = {}
    Object.entries(rawScores).forEach(([trait, raw]) => {
      stenScores[trait] = getSten(raw, trait)
    })
    
    return { raw: rawScores, sten: stenScores }
  }  

  const handleSubmit = async () => {
    const unanswered = questions.filter(q => responses[q.id] === null)
  
    if (unanswered.length > 0) {
      setErrors([`Please answer all ${unanswered.length} remaining questions.`])
      return
    }
  
    setErrors([])
    setShowResults(true)
    setTimeout(() => {
      document.getElementById("results")?.scrollIntoView({ behavior: "smooth" })
    }, 100)
    setIsGenerating(true)
    setLoadingMessage("Analyzing your responses...")

    const { sten: stenScores } = calculateScores()

    // Rotate loading messages
    const messages = [
      "Analyzing your responses...",
      "Building your personality profile...",
      "Connecting to research insights...",
      "Identifying your unique patterns...",
      "Crafting personalized recommendations...",
      "Generating your detailed report...",
      "Adding finishing touches...",
      "Almost there..."
    ]
    let messageIndex = 0
    const messageInterval = setInterval(() => {
      messageIndex = (messageIndex + 1) % messages.length
      setLoadingMessage(messages[messageIndex])
    }, 5000)
  
    try {
      const response = await fetch("/api/generate-big-five-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name: firstName,
          scores: stenScores,
          openEnded: openEnded,
          age: age
        })
      })
  
      const data = await response.json()
  
      if (data.success) {
        setReport(data.report)
        
      } else {
        setReport("Failed to generate report. Please try again.")
      }
    } catch (error) {
      console.error("Error:", error)
      setReport("Failed to generate report. Please try again.")
    } finally {
      clearInterval(messageInterval)
      setIsGenerating(false)
      setLoadingMessage("")
    }
    
  }

  const traitNames: Record<string, string> = {
    E: "Extraversion",
    A: "Agreeableness", 
    C: "Conscientiousness",
    N: "Neuroticism",
    O: "Openness to Experience"
  }

  const traitColors: Record<string, string> = {
    E: "#F59E0B",
    A: "#10B981",
    C: "#3B82F6",
    N: "#EF4444",
    O: "#8B5CF6",
  }

  const { sten: stenScores } = calculateScores()

  const renderReport = (reportText: string) => {
    return reportText
      // Remove all code blocks of the form ```math ... ```
      .replace(/```math[\s\S]*?```/g, '')
      // Remove blocks of the form ```math[...]```$$https://...$$
      .replace(/```math\s*\[\d+\]\s*```\$\$https?:\/\/[^\$]+\$\$/g, '')
      // Remove blocks of the form ```math[...]```
      .replace(/```math\s*\[\d+\]\s*```/g, '')
      // Remove blocks of the form ```math\d+```$$...$$
      .replace(/```math\s*\d+\s*```\$\$[^\$]+\$\$/g, '')
      // Remove leftover code fences
      .replace(/```\[\d+\]/g, '')
      .replace(/```math\d+```\([^)]+\)/g, '')
      .split('\n')
      .map((paragraph: string, index: number) => {
        // Main heading (# )
        if (paragraph.startsWith('# ')) {
          return (
            <h2 key={index} className="mt-2 mb-4 text-xl font-bold text-primary">
              {paragraph.replace('# ', '')}
            </h2>
          )
        }
        // Subheading (## )
        if (paragraph.startsWith('## ')) {
          return (
            <h3 key={index} className="mt-6 mb-3 text-lg font-bold">
              {paragraph.replace('## ', '')}
            </h3>
          )
        }
        // Sub-subheading (### )
        if (paragraph.startsWith('### ')) {
          return (
            <h4 key={index} className="mt-4 mb-2 text-base font-semibold">
              {paragraph.replace('### ', '')}
            </h4>
          )
        }
        // Horizontal rule (---)
        if (paragraph.trim() === '---' || paragraph.trim() === '***' || paragraph.trim() === '___') {
          return <hr key={index} className="my-6 border-t border-border" />
        }
        // Bold text
        if (paragraph.includes('**')) {
          const parts = paragraph.split(/\*\*([^*]+)\*\*/g)
          return (
            <p key={index} className="mb-3">
              {parts.map((part: string, i: number) =>
                i % 2 === 1 ? <strong key={i}>{part}</strong> : part
              )}
            </p>
          )
        }
        // Skip empty lines
        if (paragraph.trim() === '') {
          return null
        }
        // Regular paragraph
        return <p key={index} className="mb-3">{paragraph}</p>
      })
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted">
      {/* Hero Section */}
      <section className="relative flex min-h-screen flex-col items-center justify-center px-4 py-12">
        <div className="mx-auto max-w-4xl text-center">
          
          {/* Logo */}
          <div className="flex flex-col items-center gap-2 mb-8">
            <svg viewBox="0 0 100 100" className="h-20 w-20" fill="none">
              <circle cx="50" cy="50" r="42" stroke="#4A9FE8" strokeWidth="7" fill="none"/>
              <path
                d="M50 72 L50 32 M32 52 L50 28 L68 52"
                stroke="#4A9FE8"
                strokeWidth="7"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            </svg>
            <span className="text-base font-bold tracking-wider text-foreground">
              FUTURE COACH
            </span>
          </div>

          <h1 className="mb-4 text-4xl font-bold tracking-tight text-foreground md:text-5xl">
            Big Five Personality
          </h1>

          <p className="mb-8 text-lg text-muted-foreground">
            Discover Your Personality Profile
          </p>

          {/* Framing Text */}
          <div className="mx-auto mb-8 max-w-2xl text-left">
            <p className="mb-4 text-base text-muted-foreground">
              The <span className="font-semibold text-[#4A9FE8]">Big Five</span> is a research-backed framework that describes personality across five key dimensions. Understanding your profile can help you leverage your strengths and navigate challenges.
            </p>
            
            <p className="mb-3 px-6 text-sm text-muted-foreground">
              <strong className="text-[#4A9FE8]">Be honest, not aspirational.</strong> Answer based on how you actually are, not how you wish you were. There are no right or wrong answers.
            </p>
            
            <p className="mb-6 px-6 text-sm text-muted-foreground">
              <strong className="text-[#4A9FE8]">Go with your gut.</strong> Don&apos;t overthink—your first instinct is usually the most accurate.
            </p>
            
            <p className="text-base text-muted-foreground">
              <strong className="text-[#4A9FE8]">Ready?</strong> Let&apos;s get started!
            </p>
          </div>

          {/* Start Button */}
          <Card className="mx-auto mb-8 max-w-md bg-card/80 p-8 shadow-lg backdrop-blur-sm">
            <Button
              onClick={() => {
                setHasStarted(true)
                setTimeout(() => scrollToAssessment(), 100)
              }}
              size="lg"
              className="w-full bg-primary text-lg font-semibold text-primary-foreground hover:bg-primary/90"
            >
              Start Assessment
            </Button>
          </Card>

          <button
            onClick={scrollToAssessment}
            className="animate-bounce text-primary transition-colors hover:text-primary/80"
            aria-label="Scroll to assessment"
          >
            <ChevronDown className="h-8 w-8" />
          </button>
        </div>
      </section>

      {/* Assessment Section */}
      {hasStarted && (
        <section id="assessment" className="px-4 py-20">
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-4 text-center text-3xl font-bold text-foreground md:text-4xl">
              How well do these statements describe you?
            </h2>
            
            <div className="mb-12 rounded-xl bg-gradient-to-r from-violet-500 via-blue-500 to-teal-500 p-6 text-center">
              <p className="text-pretty text-base leading-relaxed text-white md:text-lg">
                For each statement, select how much you agree or disagree.
              </p>
            </div>

            <div className="space-y-6">
              {questions.map((q, index) => (
                <Card key={q.id} className="bg-card p-6 shadow-md">
                  <div className="mb-4">
                    <p className="text-base font-medium text-card-foreground">
                      {index + 1}. {q.text}
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-5">
                    {responseOptions.map((option) => {
                      const gradients: Record<number, string> = {
                        1: "from-violet-500 to-purple-600",
                        2: "from-blue-400 to-cyan-500",
                        3: "from-gray-400 to-gray-500",
                        4: "from-teal-400 to-emerald-500",
                        5: "from-emerald-500 to-green-600",
                      }
                      const isSelected = responses[q.id] === option.value
                      const gradient = gradients[option.value] || ""
                      
                      return (
                        <button
                          key={option.value}
                          onClick={() => handleResponseChange(q.id, option.value)}
                          className={`rounded-xl p-4 text-center transition-all cursor-pointer ${
                            isSelected
                              ? `bg-gradient-to-r ${gradient} text-white shadow-lg scale-105`
                              : "bg-muted hover:bg-muted/80 text-foreground"
                          }`}
                        >
                          <span className="text-sm font-medium leading-tight">{option.label}</span>
                        </button>
                      )
                    })}
                  </div>
                </Card>
              ))}
            </div>

            {/* Open-Ended Questions */}
            <div className="mt-12 space-y-6">
              <div className="mb-8 rounded-xl bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 p-6 text-center">
                <h3 className="mb-4 text-2xl font-bold text-white">
                  You&apos;ve completed the personality assessment! 🎉
                </h3>
                <p className="mb-2 text-base text-white/90">
                  To make your report even more personalized and useful, we&apos;d love to hear from you in your own words.
                </p>
                <p className="mb-2 text-sm text-white/80">
                  These questions help us provide insights most relevant to YOUR specific situation and goals.
                </p>
                <p className="text-sm text-white/80 italic">
                  Feel free to offer as much or as little as you want (we&apos;ve found the sweet spot to be 3-5 sentences).
                </p>
              </div>

              <Card className="bg-card p-6 shadow-md">
                <Label className="mb-2 block text-base font-medium">
                  What&apos;s a personal strength or quality you&apos;re proud of?
                </Label>
                <textarea
                  value={openEnded.strength}
                  onChange={(e) => setOpenEnded({...openEnded, strength: e.target.value})}
                  placeholder="I'm proud of..."
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[80px]"
                />
              </Card>

              <Card className="bg-card p-6 shadow-md">
                <Label className="mb-2 block text-base font-medium">
                  Imagine yourself 1-2 years from now—what kind of person do you want to become? What qualities would you like to develop?
                </Label>
                <textarea
                  value={openEnded.futureself}
                  onChange={(e) => setOpenEnded({...openEnded, futureself: e.target.value})}
                  placeholder="I want to become..."
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[80px]"
                />
              </Card>

              <Card className="bg-card p-6 shadow-md">
                <Label className="mb-2 block text-base font-medium">
                  What&apos;s one goal you&apos;re working on or area of your life where you&apos;d welcome some guidance?
                </Label>
                <textarea
                  value={openEnded.goal}
                  onChange={(e) => setOpenEnded({...openEnded, goal: e.target.value})}
                  placeholder="I'm working on..."
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[80px]"
                />
              </Card>
            </div>

            {/* Errors */}
            {errors.length > 0 && (
              <Card className="mt-8 border-destructive bg-destructive/10 p-4">
                <ul className="list-disc space-y-1 pl-5 text-sm text-destructive">
                  {errors.map((error, idx) => (
                    <li key={idx}>{error}</li>
                  ))}
                </ul>
              </Card>
            )}

            {/* Submit Button */}
            <div className="mt-12 text-center">
              <Button
                onClick={handleSubmit}
                size="lg"
                className="bg-accent px-12 text-lg font-semibold text-accent-foreground shadow-lg hover:bg-accent/90"
              >
                See My Results
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Results Section */}
      {showResults && (
        <section id="results" className="px-4 py-20">
          <div className="mx-auto max-w-4xl">
            <Card className="bg-gradient-to-br from-primary/10 to-accent/10 p-8 shadow-xl md:p-12">
              <h2 className="mb-4 text-center text-3xl font-bold text-foreground md:text-4xl">
                Your Big Five Profile
              </h2>
              <p className="mb-8 text-center text-lg text-muted-foreground">
                Here&apos;s how you scored on each personality dimension.
              </p>

              {/* Bar Chart - STEN Scores */}
              <div className="mb-12 space-y-6">
                {Object.entries(stenScores).map(([trait, sten]) => (
                  <div key={trait} className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-semibold text-foreground">
                        {traitNames[trait]}
                      </span>
                      <span className="text-muted-foreground">
                        {sten}/10 ({getStenDescription(sten)})
                      </span>
                    </div>
                    <div className="h-4 w-full rounded-full bg-muted">
                      <div
                        className="h-4 rounded-full transition-all duration-1000"
                        style={{
                          width: `${(sten / 10) * 100}%`,
                          backgroundColor: traitColors[trait]
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* AI Report */}
              <div className="rounded-xl bg-card p-6 md:p-8">
                {isGenerating ? (
                  <p className="text-center text-muted-foreground">{loadingMessage || "Generating your personalized report..."}</p>
                ) : report ? (
                  <div className="prose prose-sm max-w-none text-card-foreground">
                    {renderReport(report)}
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground">Your report will appear here.</p>
                )}
                
                {/* Continue button - only show when report is loaded */}
                {report && !isGenerating && (
                  <div className="mt-8 text-center">
                    <Button
                      onClick={() => onComplete({
                        rawResponses: responses,
                        rawScores: calculateScores().raw,
                        stenScores: calculateScores().sten,
                        openEnded,
                        report,
                      })}
                      size="lg"
                      className="bg-primary text-primary-foreground"
                    >
                      Continue to Feedback
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </section>
      )}
    </main>
  )
}
