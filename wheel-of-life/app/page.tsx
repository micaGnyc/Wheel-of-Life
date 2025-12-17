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
  const [report, setReport] = useState("")
const [isGenerating, setIsGenerating] = useState(false)
const generateReport = async () => {
  setIsGenerating(true)
  
  // Build wheel data with descriptors
  const descriptorMap: Record<number, string> = {
    1: "Terrible",
    2: "Unhappy", 
    3: "Mostly Dissatisfied",
    4: "Mixed",
    5: "Mostly Satisfied",
    6: "Pleased",
    7: "Delighted"
  }
  
  const wheelData: Record<string, {score: number, descriptor: string}> = {}
  
  // Add standard areas
  questions.forEach(q => {
    if (q.domain !== "overall" && !notApplicable[q.domain]) {
      const score = responses[q.domain] || 0
      wheelData[q.label] = {
        score,
        descriptor: descriptorMap[score] || "Not rated"
      }
    }
  })
  
  // Add custom area if exists
  if (customArea.name && customArea.score) {
    wheelData[customArea.name] = {
      score: customArea.score,
      descriptor: descriptorMap[customArea.score] || "Not rated"
    }
  }
  
  // Build deep dive with area labels
  const deepDiveWithLabels: Record<string, {why: string, whatBetter: string}> = {}
  focusAreas.forEach(areaKey => {
    const area = areaKey === "custom" 
      ? customArea.name 
      : questions.find(q => q.domain === areaKey)?.label || areaKey
    deepDiveWithLabels[area] = deepDive[areaKey]
  })
  
  // Get age range
  const ageNum = parseInt(age)
  const ageRange = ageNum <= 17 ? "16-17" : ageNum <= 21 ? "18-21" : "22-24"
  
  try {
    const response = await fetch("/api/generate-report", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        age_range: ageRange,
        wheel_data: wheelData,
        what_matters: whatMatters.map(key => 
          key === "custom" ? customArea.name : questions.find(q => q.domain === key)?.label || key
        ),
        focus_areas: focusAreas.map(key =>
          key === "custom" ? customArea.name : questions.find(q => q.domain === key)?.label || key
        ),
        deep_dive: deepDiveWithLabels
      })
    })
    
    const data = await response.json()
    
    if (data.success) {
      setReport(data.report)
      setShowReport(true)
    } else {
      alert("Failed to generate report. Please try again.")
    }
  } catch (error) {
    console.error("Error:", error)
    alert("Failed to generate report. Please try again.")
  } finally {
    setIsGenerating(false)
  }
}
  const [customArea, setCustomArea] = useState<{name: string, score: number | null}>({name: "", score: null})
  const [whatMatters, setWhatMatters] = useState<string[]>([])
  const [focusAreas, setFocusAreas] = useState<string[]>([])
  const [deepDive, setDeepDive] = useState<Record<string, {why: string, whatBetter: string}>>({})
  const [showReport, setShowReport] = useState(false)  
  const [age, setAge] = useState("")
  const [gender, setGender] = useState<string[]>([])
const [ethnicity, setEthnicity] = useState<string[]>([])
const [optionalNotes, setOptionalNotes] = useState("")
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
  
  {/* Hero Section */}
  <section className="relative flex min-h-screen flex-col items-center justify-center px-4 py-12">
    <div className="mx-auto max-w-4xl text-center">
      
      <div className="flex flex-col items-center gap-3 mb-8">
        <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent shadow-lg">
          <svg viewBox="0 0 24 24" className="h-16 w-16" fill="none">
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
        <div className="inline-block rounded-full bg-primary/10 px-8 py-3 text-lg font-semibold text-primary">
          Future Coach
        </div>
      </div>
      
      <h1 className="mb-6 text-balance font-sans text-5xl font-bold tracking-tight text-foreground md:text-7xl">
        Wheel of Life
      </h1>


          <p className="mb-12 text-pretty text-xl text-muted-foreground md:text-2xl">See Where You Are, Choose Where You're Going</p>
          <div className="mx-auto mb-8 max-w-2xl text-left">
  <p className="mb-4 text-lg font-semibold">A couple things to know before you start:</p>
  
  <p className="mb-4 text-base text-muted-foreground">
    <strong>This is about how happy *you* are, not how well others think you're doing.</strong> For example, you might be succeeding in school—getting good grades—but still feel unsatisfied with your overall school experience. Or you might be just barely passing but have found your calling in theater and feel very satisfied with school. We want to capture how you actually feel—not how you think you "should" feel.
  </p>
  
  <p className="mb-8 text-base text-muted-foreground">
    <strong>This is a snapshot of right now.</strong> Not a report card on your whole life. Just where you are today. Your wheel will change over time—that's the point! This is your starting point.
  </p>
  
  <p className="text-base text-muted-foreground">
    Ready? Let's start with your age.
  </p>
</div>
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
            {/* Demographics - shows after age is entered */}
  {age && (
    <>
      <h3 className="mb-4 mt-6 text-lg font-semibold">A bit more about you</h3>
      
    {/* Gender */}
    <div className="mb-4">
      <Label className="mb-2 block text-left text-sm font-medium">
        How do you identify (gender)? (Check all that apply)
      </Label>
      <div className="space-y-2">
        {[
          { value: "female", label: "Female" },
          { value: "male", label: "Male" },
          { value: "nonbinary", label: "Non-binary" },
          { value: "self-describe", label: "Prefer to self-describe" },
          { value: "no-say", label: "Prefer not to say" },
        ].map((option) => (
          <div key={option.value} className="flex items-center gap-2">
            <Checkbox
              id={`gender-${option.value}`}
              checked={gender.includes(option.value)}
              onCheckedChange={(checked) => {
                if (checked) {
                  setGender([...gender, option.value])
                } else {
                  setGender(gender.filter((g) => g !== option.value))
                }
              }}
            />
            <Label htmlFor={`gender-${option.value}`} className="cursor-pointer text-sm">
              {option.label}
            </Label>
          </div>
        ))}
      </div>
    </div>

    {/* Ethnicity */}
    <div className="mb-4">
      <Label className="mb-2 block text-left text-sm font-medium">
        How do you identifyrace/ethnicity? (Check all that apply)
      </Label>
      <div className="space-y-2">
        {[
          { value: "asian", label: "Asian" },
          { value: "black", label: "Black or African American" },
          { value: "hispanic", label: "Hispanic or Latino" },
          { value: "native-american", label: "Native American or Alaska Native" },
          { value: "pacific-islander", label: "Native Hawaiian or Pacific Islander" },
          { value: "white", label: "White" },
          { value: "two-or-more", label: "Two or more races" },
          { value: "no-say", label: "Prefer not to say" },
        ].map((option) => (
          <div key={option.value} className="flex items-center gap-2">
            <Checkbox
              id={`ethnicity-${option.value}`}
              checked={ethnicity.includes(option.value)}
              onCheckedChange={(checked) => {
                if (checked) {
                  setEthnicity([...ethnicity, option.value])
                } else {
                  setEthnicity(ethnicity.filter((e) => e !== option.value))
                }
              }}
            />
            <Label htmlFor={`ethnicity-${option.value}`} className="cursor-pointer text-sm">
              {option.label}
            </Label>
          </div>
        ))}
      </div>
    </div>
      {/* Optional Notes */}
      <div className="mb-6">
        <Label htmlFor="notes" className="mb-2 block text-left text-sm font-medium">
          Anything else we should know? (Optional)
        </Label>
        <Input
          id="notes"
          type="text"
          placeholder="e.g., school name, partner's name for testing..."
          value={optionalNotes}
          onChange={(e) => setOptionalNotes(e.target.value)}
          className="w-full"
        />
      </div>
    </>
  )}
            <Button
              onClick={scrollToAssessment}
              size="lg"
              className="w-full bg-primary text-lg font-semibold text-primary-foreground hover:bg-primary/90"
            >
              Start Exercise
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
                <div className="mb-4">
  {/* Top row: emoji, label, and checkbox inline */}
  <div className="flex items-center gap-3 mb-2">
    <span className="text-3xl" aria-hidden="true">
      {q.emoji}
    </span>
    <h3 className="text-lg font-semibold text-card-foreground">{q.label}</h3>
    
    {/* Not applicable checkbox right after label */}
    {q.hasNotApplicable && (
      <div className="flex items-center gap-2 ml-2">
        <Checkbox
          id={`na-${q.domain}`}
          checked={isNotApplicable}
          onCheckedChange={(checked) => handleNotApplicableChange(q.domain, checked as boolean)}
        />
        <Label htmlFor={`na-${q.domain}`} className="cursor-pointer text-xs text-muted-foreground whitespace-nowrap">
          N/A
        </Label>
      </div>
    )}
  </div>
  
  {/* Question text below */}
  <p className="text-sm text-muted-foreground ml-12">{q.question}</p>
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
{/* Custom Life Area */}
<Card className="bg-card p-6 shadow-md md:p-8">
  <div className="mb-4">
    <h3 className="text-lg font-semibold text-card-foreground">
      Is there a life area important to you not represented above?
    </h3>
    <p className="text-sm text-muted-foreground">Optional - add your own area</p>
  </div>
  
  <div className="mb-4">
    <Label htmlFor="custom-area-name" className="mb-2 block text-left text-sm font-medium">
      If yes, what is it?
    </Label>
    <Input
      id="custom-area-name"
      type="text"
      placeholder="e.g., Health, Finances, Hobbies, Spirituality..."
      value={customArea.name}
      onChange={(e) => setCustomArea({...customArea, name: e.target.value})}
      className="w-full"
    />
  </div>

  {/* Only show satisfaction scale if they entered a custom area name */}
  {customArea.name && (
    <div>
      <Label className="mb-2 block text-left text-sm font-medium">
        How satisfied are you with your {customArea.name.toLowerCase()}?
      </Label>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 md:grid-cols-7">
        {[
          { value: 1, emoji: "😭", label: "Terrible" },
          { value: 2, emoji: "☹️", label: "Unhappy" },
          { value: 3, emoji: "😕", label: "Mostly Dissatisfied" },
          { value: 4, emoji: "😐", label: "Mixed" },
          { value: 5, emoji: "🙂", label: "Mostly Satisfied" },
          { value: 6, emoji: "😊", label: "Pleased" },
          { value: 7, emoji: "🤩", label: "Delighted" },
        ].map((option) => (
          <button
            key={option.value}
            onClick={() => setCustomArea({...customArea, score: option.value})}
            className={`flex flex-col items-center gap-2 rounded-xl border-2 p-3 text-center transition-all ${
              customArea.score === option.value
                ? "border-primary bg-primary text-primary-foreground shadow-md"
                : "border-border bg-background hover:border-primary/50 hover:bg-muted"
            } cursor-pointer`}
          >
            <span className="text-2xl" aria-hidden="true">
              {option.emoji}
            </span>
            <span className="text-xs font-medium leading-tight">{option.label}</span>
          </button>
        ))}
      </div>
    </div>
  )}
</Card>

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
            <h2 className="mb-4 text-center text-3xl font-bold text-foreground md:text-4xl">
  Your Life Satisfaction Wheel
</h2>
<p className="mb-8 text-center text-lg text-muted-foreground">
  Amazing work! 🎉 You've just completed your Wheel of Life. What you're seeing is a snapshot of your life right now—where you feel satisfied and where there's room to grow.
</p>


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

{[
  ...questions.filter((q) => !notApplicable[q.domain] && q.domain !== "overall"),
  ...(customArea.name && customArea.score ? [{
    domain: "custom",
    emoji: "⭐",
    label: customArea.name,
    question: `My satisfaction with ${customArea.name.toLowerCase()}`
  }] : [])
].map((q, index, arr) => {
  const score = q.domain === "custom" ? (customArea.score || 0) : (responses[q.domain as Domain] || 0)

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

                    {/* Outer border - lightened */}
<circle cx="200" cy="200" r="180" fill="none" stroke="#cccccc" strokeWidth="1" />

                    {/* Center dot */}
                    <circle cx="200" cy="200" r="3" fill="hsl(var(--foreground))" />

                  </svg>
                </div>
              </div>

          {/* Prioritization Questions - show after wheel, before report */}
          {!showReport ? (
            <div className="space-y-8">
              {/* Intro text */}
    <p className="text-center text-base text-muted-foreground">
      Continue reflecting through these questions to get your personalized Wheel of Life report.
    </p>
              {/* Q2: What Matters Most */}
              <div className="rounded-xl bg-card p-6 md:p-8">
                <h3 className="mb-4 text-lg font-semibold">Which areas matter most to you right now?</h3>
                <p className="mb-4 text-sm text-muted-foreground">Select 2-3 areas</p>
                <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                  {[
                    ...questions.filter(q => q.domain !== "overall" && !notApplicable[q.domain]),
                    ...(customArea.name ? [{ domain: "custom", label: customArea.name, emoji: "⭐" }] : [])
                  ].map((q) => (
                    <button
                      key={q.domain}
                      onClick={() => {
                        if (whatMatters.includes(q.domain)) {
                          setWhatMatters(whatMatters.filter(d => d !== q.domain))
                        } else if (whatMatters.length < 3) {
                          setWhatMatters([...whatMatters, q.domain])
                        }
                      }}
                      className={`flex items-center gap-2 rounded-lg border-2 p-3 text-left transition-all ${
                        whatMatters.includes(q.domain)
                          ? "border-primary bg-primary/10"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <span className="text-xl">{q.emoji}</span>
                      <span className="text-sm font-medium">{q.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Q3: Focus Areas */}
              <div className="rounded-xl bg-card p-6 md:p-8">
                <h3 className="mb-4 text-lg font-semibold">Which area(s) do you want to work on?</h3>
                <p className="mb-4 text-sm text-muted-foreground">Select 1-2 areas</p>
                <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                  {[
                    ...questions.filter(q => q.domain !== "overall" && !notApplicable[q.domain]),
                    ...(customArea.name ? [{ domain: "custom", label: customArea.name, emoji: "⭐" }] : [])
                  ].map((q) => (
                    <button
                      key={q.domain}
                      onClick={() => {
                        if (focusAreas.includes(q.domain)) {
                          setFocusAreas(focusAreas.filter(d => d !== q.domain))
                          // Also remove from deepDive
                          const newDeepDive = {...deepDive}
                          delete newDeepDive[q.domain]
                          setDeepDive(newDeepDive)
                        } else if (focusAreas.length < 2) {
                          setFocusAreas([...focusAreas, q.domain])
                          // Initialize deepDive for this area
                          setDeepDive({...deepDive, [q.domain]: {why: "", whatBetter: ""}})
                        }
                      }}
                      className={`flex items-center gap-2 rounded-lg border-2 p-3 text-left transition-all ${
                        focusAreas.includes(q.domain)
                          ? "border-primary bg-primary/10"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <span className="text-xl">{q.emoji}</span>
                      <span className="text-sm font-medium">{q.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Q4: Deep Dive - for each focus area */}
              {focusAreas.map((areaKey) => {
                const area = areaKey === "custom" 
                  ? { domain: "custom", label: customArea.name, emoji: "⭐" }
                  : questions.find(q => q.domain === areaKey)
                
                if (!area) return null
                
                return (
                  <div key={areaKey} className="rounded-xl bg-card p-6 md:p-8">
                    <h3 className="mb-4 text-lg font-semibold flex items-center gap-2">
                      <span>{area.emoji}</span>
                      Tell us more about {area.label}
                    </h3>
                    
                    <div className="mb-4">
                      <Label className="mb-2 block text-sm font-medium">
                        Why do you want to work on {area.label.toLowerCase()}?
                      </Label>
                      <textarea
                        value={deepDive[areaKey]?.why || ""}
                        onChange={(e) => setDeepDive({
                          ...deepDive, 
                          [areaKey]: {...deepDive[areaKey], why: e.target.value}
                        })}
                        placeholder="What's motivating you to focus here..."
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[80px] ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      />
                    </div>

                    <div>
                      <Label className="mb-2 block text-sm font-medium">
                        What would "better" look like in {area.label.toLowerCase()}?
                      </Label>
                      <textarea
                        value={deepDive[areaKey]?.whatBetter || ""}
                        onChange={(e) => setDeepDive({
                          ...deepDive, 
                          [areaKey]: {...deepDive[areaKey], whatBetter: e.target.value}
                        })}
                        placeholder="Describe what improvement would look like for you..."
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[80px] ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      />
                    </div>
                  </div>
                )
              })}

              {/* Generate Report Button */}
              <div className="text-center">
              <Button
  onClick={generateReport}
  disabled={focusAreas.length === 0 || whatMatters.length === 0 || isGenerating}
  size="lg"
  className="bg-accent px-12 text-lg font-semibold text-accent-foreground shadow-lg hover:bg-accent/90"
>
  {isGenerating ? "Generating..." : "Generate My Report"}
</Button>

                {(focusAreas.length === 0 || whatMatters.length === 0) && (
                  <p className="mt-2 text-sm text-muted-foreground">
                    Please select what matters and what you want to work on
                  </p>
                )}
              </div>
            </div>
          ) : (
            /* Report Section */
            <div className="rounded-xl bg-card p-6 md:p-8">
              <h3 className="mb-6 text-center text-xl font-semibold">Your Personalized Report</h3>
              <div className="prose prose-sm max-w-none text-card-foreground">
                {report.split('\n').map((paragraph, index) => {
                  if (paragraph.startsWith('## ')) {
                    return <h2 key={index} className="mt-6 mb-3 text-lg font-bold">{paragraph.replace('## ', '')}</h2>
                  } else if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
                    return <p key={index} className="font-semibold mt-4">{paragraph.replace(/\*\*/g, '')}</p>
                  } else if (paragraph.trim() === '') {
                    return null
                  } else {
                    return <p key={index} className="mb-3">{paragraph}</p>
                  }
                })}
              </div>
              
              <div className="mt-8 text-center">
                <Button
                  onClick={() => {
                    setShowReport(false)
                    setReport("")
                  }}
                  variant="outline"
                >
                  Back to Questions
                </Button>
              </div>
            </div>
          )}
          

        </Card>
      </div>
    </section>
  )}

      {/* Footer Spacing */}
      <div className="h-20" />
    </div>
  )
}
