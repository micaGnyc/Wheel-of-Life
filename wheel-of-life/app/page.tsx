"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { ChevronDown } from "lucide-react"

// Add animation styles
const wheelAnimationStyles = `
  @keyframes grow-segment {
    0% {
      transform: scale(0);
      opacity: 0;
    }
    100% {
      transform: scale(1);
      opacity: 0.8;
    }
  }
`

// Inject styles into document
if (typeof document !== 'undefined' && !document.querySelector('#wheel-animation-styles')) {
  const styleEl = document.createElement('style')
  styleEl.id = 'wheel-animation-styles'
  styleEl.textContent = wheelAnimationStyles
  document.head.appendChild(styleEl)
}

type Domain = "family" | "friends" | "school" | "work" | "living" | "self" | "overall"

const questions = [
  {
    domain: "family" as Domain,
    emoji: "👨‍👩‍👧‍👦",
    label: "Family",
    question: "My satisfaction with my family life",
    hasNotApplicable: false,
  },
  {
    domain: "friends" as Domain,
    emoji: "👥",
    label: "Friends",
    question: "My satisfaction with my friendships",
    hasNotApplicable: false,
  },
  {
    domain: "school" as Domain,
    emoji: "📚",
    label: "School",
    question: "My satisfaction with my school experience",
    hasNotApplicable: true,
  },
  {
    domain: "work" as Domain,
    emoji: "💼",
    label: "Work",
    question: "My satisfaction with my work/career",
    hasNotApplicable: true,
  },
  {
    domain: "living" as Domain,
    emoji: "🏠",
    label: "Living Space",
    question: "My satisfaction with where I live",
    hasNotApplicable: false,
  },
  {
    domain: "self" as Domain,
    emoji: "💭",
    label: "Self",
    question: "My satisfaction with myself",
    hasNotApplicable: false,
  },
  {
    domain: "overall" as Domain,
    emoji: "✨",
    label: "Overall",
    question: "My satisfaction with my overall life",
    hasNotApplicable: false,
  },
]

const satisfactionOptions = [
  { value: 1, emoji: "😭", label: "Terrible" },
  { value: 2, emoji: "☹️", label: "Unhappy" },
  { value: 3, emoji: "😕", label: "Mostly Dissatisfied" },
  { value: 4, emoji: "😐", label: "Mixed" },
  { value: 5, emoji: "🙂", label: "Mostly Satisfied" },
  { value: 6, emoji: "😊", label: "Pleased" },
  { value: 7, emoji: "🤩", label: "Delighted" },
]

export default function LifeSatisfactionAssessment() {
  const [age, setAge] = useState("")
  const [responses, setResponses] = useState<Record<Domain, number | null>>({
    family: null,
    friends: null,
    school: null,
    work: null,
    living: null,
    self: null,
    overall: null,
  })
  const [notApplicable, setNotApplicable] = useState<Record<string, boolean>>({
    school: false,
    work: false,
  })
  const [showResults, setShowResults] = useState(false)
  const [errors, setErrors] = useState<string[]>([])

  const handleResponseChange = (domain: Domain, value: number) => {
    setResponses((prev) => ({ ...prev, [domain]: value }))
  }

  const handleNotApplicableChange = (domain: string, checked: boolean) => {
    setNotApplicable((prev) => ({ ...prev, [domain]: checked }))
    if (checked) {
      setResponses((prev) => ({ ...prev, [domain]: null }))
    }
  }

  const handleSubmit = () => {
    const newErrors: string[] = []

    if (!age || Number.parseInt(age) < 16 || Number.parseInt(age) > 24) {
      newErrors.push("Please enter a valid age between 16 and 24")
    }

    questions.forEach((q) => {
      const isNotApplicable = notApplicable[q.domain]
      if (!isNotApplicable && responses[q.domain] === null) {
        newErrors.push(`Please answer the question about ${q.label}`)
      }
    })

    if (newErrors.length > 0) {
      setErrors(newErrors)
      return
    }

    setErrors([])
    setShowResults(true)
    setTimeout(() => {
      document.getElementById("results")?.scrollIntoView({ behavior: "smooth" })
    }, 100)
  }

  const scrollToAssessment = () => {
    document.getElementById("assessment")?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <div className="flex justify-center pt-8">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent shadow-lg">
          <svg viewBox="0 0 24 24" className="h-10 w-10" fill="none">
            <circle cx="12" cy="12" r="11" fill="white" opacity="0.2" />
            <path
              d="M12 6 L12 18 M8 10 L12 6 L16 10"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative flex min-h-screen flex-col items-center justify-center px-4 py-20">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-8 inline-block rounded-full bg-primary/10 px-6 py-2 text-sm font-semibold text-primary">
            Future Coach
          </div>
          <h1 className="mb-6 text-balance font-sans text-5xl font-bold tracking-tight text-foreground md:text-7xl">
            Build Your Future with Self-Discovery
          </h1>
          <p className="mb-12 text-pretty text-xl text-muted-foreground md:text-2xl">Find Balance and Success</p>

          <Card className="mx-auto mb-8 max-w-md bg-card/80 p-8 shadow-lg backdrop-blur-sm">
            <Label htmlFor="age" className="mb-2 block text-left text-sm font-medium">
              What's your age? (16-24)
            </Label>
            <Input
              id="age"
              type="number"
              min="16"
              max="24"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="Enter your age"
              className="mb-4 text-lg"
            />
            <Button
              onClick={scrollToAssessment}
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
      <section id="assessment" className="px-4 py-20">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-4 text-center text-3xl font-bold text-foreground md:text-4xl">
            How satisfied are you with these areas of your life?
          </h2>
          <div className="mb-12 rounded-xl bg-card/50 p-6 text-center backdrop-blur-sm">
            <p className="text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">
              Think about your life during the past several weeks. Think about how you spend each day and night, and
              then think about how your life has been most of this time. Indicate how satisfied you are with each area
              of life.
            </p>
          </div>

          <div className="space-y-8">
            {questions.map((q) => {
              const isNotApplicable = notApplicable[q.domain]
              return (
                <Card key={q.domain} className="bg-card p-6 shadow-md transition-shadow hover:shadow-lg md:p-8">
                  <div className="mb-4 flex items-center gap-3">
                    <span className="text-3xl" aria-hidden="true">
                      {q.emoji}
                    </span>
                    <div>
                      <h3 className="text-lg font-semibold text-card-foreground">{q.label}</h3>
                      <p className="text-sm text-muted-foreground">{q.question}</p>
                    </div>
                  </div>

                  <div className="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-4 md:grid-cols-7">
                    {satisfactionOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => handleResponseChange(q.domain, option.value)}
                        disabled={isNotApplicable}
                        className={`flex flex-col items-center gap-2 rounded-xl border-2 p-3 text-center transition-all ${
                          responses[q.domain] === option.value
                            ? "border-primary bg-primary text-primary-foreground shadow-md"
                            : "border-border bg-background hover:border-primary/50 hover:bg-muted"
                        } ${isNotApplicable ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
                      >
                        <span className="text-2xl" aria-hidden="true">
                          {option.emoji}
                        </span>
                        <span className="text-xs font-medium leading-tight">{option.label}</span>
                      </button>
                    ))}
                  </div>

                  {q.hasNotApplicable && (
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id={`na-${q.domain}`}
                        checked={isNotApplicable}
                        onCheckedChange={(checked) => handleNotApplicableChange(q.domain, checked as boolean)}
                      />
                      <Label htmlFor={`na-${q.domain}`} className="cursor-pointer text-sm text-muted-foreground">
                        Not applicable
                      </Label>
                    </div>
                  )}
                </Card>
              )
            })}
          </div>

          {errors.length > 0 && (
            <Card className="mt-8 border-destructive bg-destructive/10 p-4">
              <ul className="list-disc space-y-1 pl-5 text-sm text-destructive">
                {errors.map((error, idx) => (
                  <li key={idx}>{error}</li>
                ))}
              </ul>
            </Card>
          )}

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

      {/* Results Section */}
      {showResults && (
        <section id="results" className="px-4 py-20">
          <div className="mx-auto max-w-4xl">
            <Card className="bg-gradient-to-br from-primary/10 to-accent/10 p-8 shadow-xl md:p-12">
              <h2 className="mb-8 text-center text-3xl font-bold text-foreground md:text-4xl">
                Your Life Satisfaction Wheel
              </h2>

              <div className="mb-12 flex justify-center">
                <div className="relative w-full max-w-2xl">
                  <svg viewBox="0 0 400 400" className="h-auto w-full">
                    {/* Existing subtle grid lines */}
                    {[1, 2, 3, 4, 5, 6, 7].map((ring) => (
                      <circle
                        key={ring}
                        cx="200"
                        cy="200"
                        r={(ring / 7) * 180}
                        fill="none"
                        stroke="hsl(var(--border))"
                        strokeWidth="0.5"
                        opacity="0.3"
                      />
                    ))}

                    {questions
                      .filter((q) => !notApplicable[q.domain])
                      .map((q, index, arr) => {
                        const score = responses[q.domain] || 0
                        const percentage = score / 7
                        const segmentAngle = 360 / arr.length
                        const startAngle = index * segmentAngle - 90
                        const endAngle = startAngle + segmentAngle

                        const gradientColors = [
                          "hsl(330, 100%, 70%)", // Pink/Magenta - Family
                          "hsl(280, 80%, 65%)", // Purple - Friends
                          "hsl(200, 100%, 60%)", // Sky Blue - School
                          "hsl(180, 70%, 55%)", // Turquoise - Work
                          "hsl(160, 65%, 60%)", // Mint - Living
                          "hsl(45, 100%, 65%)", // Yellow - Self
                          "hsl(15, 100%, 65%)", // Orange/Coral - Overall
                        ]

                        const color = gradientColors[index % gradientColors.length]

                        const radius = 180
                        const fillRadius = radius * percentage

                        const startAngleRad = (startAngle * Math.PI) / 180
                        const endAngleRad = (endAngle * Math.PI) / 180

                        const x1 = 200 + fillRadius * Math.cos(startAngleRad)
                        const y1 = 200 + fillRadius * Math.sin(startAngleRad)
                        const x2 = 200 + fillRadius * Math.cos(endAngleRad)
                        const y2 = 200 + fillRadius * Math.sin(endAngleRad)

                        const largeArcFlag = segmentAngle > 180 ? 1 : 0

                        const pathData =
                          fillRadius > 0
                            ? `M 200 200 L ${x1} ${y1} A ${fillRadius} ${fillRadius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`
                            : ""

                        const labelAngle = startAngle + segmentAngle / 2
                        const labelAngleRad = (labelAngle * Math.PI) / 180
                        const labelRadius = 100
                        const labelX = 200 + labelRadius * Math.cos(labelAngleRad)
                        const labelY = 200 + labelRadius * Math.sin(labelAngleRad)

                        // Animation parameters
                        const animationDuration = 0.8
                        const animationDelay = index * 0.1

                        return (
                          <g key={q.domain}>
                            {[0.25, 0.5, 0.75].map((marker) => {
                              const markerRadius = radius * marker
                              const tickLength = 8

                              // Tick on start edge of segment
                              const tickStartX1 = 200 + (markerRadius - tickLength) * Math.cos(startAngleRad)
                              const tickStartY1 = 200 + (markerRadius - tickLength) * Math.sin(startAngleRad)
                              const tickStartX2 = 200 + (markerRadius + tickLength) * Math.cos(startAngleRad)
                              const tickStartY2 = 200 + (markerRadius + tickLength) * Math.sin(startAngleRad)

                              return (
                                <line
                                  key={`tick-${marker}`}
                                  x1={tickStartX1}
                                  y1={tickStartY1}
                                  x2={tickStartX2}
                                  y2={tickStartY2}
                                  stroke="hsl(var(--foreground))"
                                  strokeWidth="1.5"
                                  opacity="0.6"
                                />
                              )
                            })}

                            {/* Radial divider lines from center to outer edge */}
                            <line
                              x1="200"
                              y1="200"
                              x2={200 + radius * Math.cos(startAngleRad)}
                              y2={200 + radius * Math.sin(startAngleRad)}
                              stroke="black"
                              strokeWidth="1.5"
                            />

                            {/* Filled segment with animation */}
                            {pathData && (
                              <path
                                d={pathData}
                                fill={color}
                                opacity="0.8"
                                style={{
                                  transformOrigin: "200px 200px",
                                  transform: "scale(0)",
                                  animation: `grow-segment ${animationDuration}s ${animationDelay}s ease-out forwards`,
                                }}
                              />
                            )}

                            {/* Label text */}
                            <text
                              x={labelX}
                              y={labelY}
                              textAnchor="middle"
                              dominantBaseline="middle"
                              className="fill-foreground text-xs font-bold md:text-sm"
                              style={{ textShadow: "0 0 4px white, 0 0 4px white" }}
                            >
                              {q.label}
                            </text>
                          </g>
                        )
                      })}

                    {/* NEW: VISIBLE GRID MARKERS at 25%, 50%, 75% - MOVED TO RENDER ON TOP */}
                    {[0.25, 0.5, 0.75].map((fraction) => (
                      <circle
                        key={`grid-${fraction}`}
                        cx="200"
                        cy="200"
                        r={180 * fraction}
                        fill="none"
                        stroke="#888888"
                        strokeWidth="2"
                        strokeDasharray="5 5"
                        opacity="0.6"
                      />
                    ))}

                    {/* Outer black border */}
                    <circle cx="200" cy="200" r="180" fill="none" stroke="black" strokeWidth="2" />
                    {/* Center dot */}
                    <circle cx="200" cy="200" r="3" fill="hsl(var(--foreground))" />

                  </svg>
                </div>
              </div>

              <div className="rounded-xl bg-card p-6 text-center md:p-8">
                <p className="text-pretty text-base leading-relaxed text-card-foreground md:text-lg">
                  Amazing work! 🎉 You've just completed your Life Satisfaction Wheel. What you're seeing is a snapshot
                  of your life right now—where you feel satisfied and where there's room to grow. Through this
                  reflection, you've uncovered the gaps between where you are and where you want to be. That clarity?
                  That's power.
                </p>
                <p className="mt-4 text-pretty text-base leading-relaxed text-card-foreground md:text-lg">
                  Take a moment with your wheel. Notice the shape—is it balanced or lopsided? Which area matters most to
                  you right now? This wheel isn't just a picture; it's your starting point for real change. Think about
                  what actions you could take today to improve your priority area, and consider working with a Future
                  Coach to create a plan that actually works for your life. You've got what it takes to build the life
                  you want—we're here to help you get there.
                </p>
              </div>
            </Card>
          </div>
        </section>
      )}

      {/* Footer Spacing */}
      <div className="h-20" />
    </div>
  )
}
