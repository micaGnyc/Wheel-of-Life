"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import WheelOfLifeQuiz from "./wheel-of-life-quiz"


type FlowStep = 
  | "landing"
  | "choose-quiz"
  | "quiz-1"
  | "report-1"
  | "feedback-1"
  | "quiz-2"
  | "report-2"
  | "feedback-2"
  | "final-feedback"
  | "complete"

type QuizType = "wol" | "big-five"

export default function FutureCoachQuiz() {
  // Flow state
  const [currentStep, setCurrentStep] = useState<FlowStep>("landing")
  const [firstQuiz, setFirstQuiz] = useState<QuizType | null>(null)
  const [wolData, setWolData] = useState<any>(null) 
  const [bigFiveData, setBigFiveData] = useState<any>(null)
  // User data
  const [email, setEmail] = useState("")
  const [firstName, setFirstName] = useState("")
  const [age, setAge] = useState("")
  const [gender, setGender] = useState<string[]>([])
  const [ethnicity, setEthnicity] = useState<string[]>([])
  const [optionalNotes, setOptionalNotes] = useState("")
  const [genderSelfDescribe, setGenderSelfDescribe] = useState("")

  
  const handleStartQuiz = (quiz: QuizType) => {
    setFirstQuiz(quiz)
    setCurrentStep("quiz-1")
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted">
      
      {/* Landing Page */}
      {currentStep === "landing" && (
        <section className="flex min-h-screen flex-col items-center justify-center px-4 py-12">
          <div className="mx-auto max-w-2xl text-center">
            
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
              Welcome!
            </h1>

            <p className="mb-8 text-lg text-muted-foreground">
              You're about to take two short quizzes that will help you learn more about yourself. 
              At the end of each quiz, you'll receive a personalized report with insights just for you.
            </p>

            {/* Form */}
            <Card className="p-6 text-left">
              <div className="space-y-4">
                
                {/* Email */}
                <div>
                  <Label htmlFor="email" className="mb-2 block text-sm font-medium">
                    Email address *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full"
                  />
                </div>

                {/* First Name */}
                <div>
                  <Label htmlFor="firstName" className="mb-2 block text-sm font-medium">
                    First name *
                  </Label>
                  <Input
                    id="firstName"
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Your first name"
                    className="w-full"
                  />
                </div>

                {/* Age */}
                <div>
                  <Label htmlFor="age" className="mb-2 block text-sm font-medium">
                    What's your age? (16-24) *
                  </Label>
                  <Input
                    id="age"
                    type="number"
                    min="16"
                    max="24"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    placeholder="18"
                    className="w-full"
                  />
                </div>

                {/* Gender */}
                <div>
                  <Label className="mb-2 block text-sm font-medium">
                    What is your gender? (Check all that apply) *
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
                    {/* Self-describe text field */}
    {gender.includes("self-describe") && (
      <Input
        type="text"
        placeholder="How do you identify?"
        value={genderSelfDescribe}
        onChange={(e) => setGenderSelfDescribe(e.target.value)}
        className="mt-2 ml-6 w-auto"
      />
    )}
                  </div>
                </div>

                {/* Ethnicity */}
                <div>
                  <Label className="mb-2 block text-sm font-medium">
                    What is your race/ethnicity? (Check all that apply) *
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
                <div>
                  <Label htmlFor="notes" className="mb-2 block text-sm font-medium">
                    Anything else we should know? (Optional)
                  </Label>
                  <Input
                    id="notes"
                    type="text"
                    value={optionalNotes}
                    onChange={(e) => setOptionalNotes(e.target.value)}
                    placeholder="e.g., school name, class number..."
                    className="w-full"
                  />
                </div>

                {/* Continue Button */}
                <Button
                  onClick={() => setCurrentStep("choose-quiz")}
                  disabled={!email || !firstName || !age || !gender.length || !ethnicity.length}
                  size="lg"
                  className="w-full mt-4"
                >
                  Continue
                </Button>
              </div>
            </Card>
          </div>
        </section>
      )}

      {/* Choose Quiz */}
      {currentStep === "choose-quiz" && (
        <section className="flex min-h-screen flex-col items-center justify-center px-4 py-12">
          <div className="mx-auto max-w-2xl text-center">
            
            <h1 className="mb-4 text-3xl font-bold tracking-tight text-foreground">
              Choose Your First Quiz
            </h1>

            <p className="mb-8 text-lg text-muted-foreground">
              You'll take both quizzes, but you get to choose which one to start with!
            </p>

            <div className="grid gap-6 md:grid-cols-2">
              
              {/* Wheel of Life Card */}
              <Card 
                className="p-6 cursor-pointer hover:border-primary hover:shadow-lg transition-all"
                onClick={() => handleStartQuiz("wol")}
              >
                <div className="text-4xl mb-4">🎯</div>
                <h2 className="text-xl font-bold mb-2">Wheel of Life</h2>
                <p className="text-sm text-muted-foreground">
                  Explore how satisfied you are across different areas of your life and discover where you might want to focus.
                </p>
                <p className="text-xs text-muted-foreground mt-4">~5 minutes</p>
              </Card>

              {/* Big Five Card */}
              <Card 
                className="p-6 cursor-pointer hover:border-primary hover:shadow-lg transition-all"
                onClick={() => handleStartQuiz("big-five")}
              >
                <div className="text-4xl mb-4">🧠</div>
                <h2 className="text-xl font-bold mb-2">Personality Quiz</h2>
                <p className="text-sm text-muted-foreground">
                  Discover your personality profile across five key dimensions and get insights into your strengths.
                </p>
                <p className="text-xs text-muted-foreground mt-4">~5 minutes</p>
              </Card>

            </div>
          </div>
        </section>
      )}

    {/* Quiz 1 */}
{currentStep === "quiz-1" && firstQuiz === "wol" && (
  <WheelOfLifeQuiz
    email={email}
    firstName={firstName}
    age={age}
    gender={gender}
    ethnicity={ethnicity}
    optionalNotes={optionalNotes}
    onComplete={(data) => {
      setWolData(data)
      setCurrentStep("feedback-1")
    }}
  />
)}

{currentStep === "quiz-1" && firstQuiz === "big-five" && (
  <section className="flex min-h-screen flex-col items-center justify-center px-4 py-12">
    <div className="mx-auto max-w-2xl text-center">
      <h1 className="mb-4 text-3xl font-bold">Big Five Quiz</h1>
      <p className="mb-8 text-muted-foreground">Coming soon - placeholder for now</p>
      <Button onClick={() => setCurrentStep("feedback-1")}>
        Simulate Complete
      </Button>
    </div>
  </section>
)}


      {/* Feedback 1 - Placeholder */}
      {currentStep === "feedback-1" && (
        <section className="flex min-h-screen flex-col items-center justify-center px-4 py-12">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="mb-4 text-3xl font-bold">Feedback on Report 1</h1>
            <p className="mb-8 text-muted-foreground">Feedback questions will go here.</p>
            <Button onClick={() => setCurrentStep("quiz-2")}>
              Continue to Next Quiz
            </Button>
          </div>
        </section>
      )}

      {/* Quiz 2 - Placeholder */}
      {currentStep === "quiz-2" && (
        <section className="flex min-h-screen flex-col items-center justify-center px-4 py-12">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="mb-4 text-3xl font-bold">
              {firstQuiz === "wol" ? "Big Five" : "Wheel of Life"} Quiz
            </h1>
            <p className="mb-8 text-muted-foreground">Second quiz content will go here.</p>
            <Button onClick={() => setCurrentStep("feedback-2")}>
              Simulate Quiz Complete → See Report & Give Feedback
            </Button>
          </div>
        </section>
      )}

      {/* Feedback 2 - Placeholder */}
      {currentStep === "feedback-2" && (
        <section className="flex min-h-screen flex-col items-center justify-center px-4 py-12">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="mb-4 text-3xl font-bold">Feedback on Report 2</h1>
            <p className="mb-8 text-muted-foreground">Feedback questions will go here.</p>
            <Button onClick={() => setCurrentStep("final-feedback")}>
              Continue to Final Feedback
            </Button>
          </div>
        </section>
      )}

      {/* Final Feedback - Placeholder */}
      {currentStep === "final-feedback" && (
        <section className="flex min-h-screen flex-col items-center justify-center px-4 py-12">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="mb-4 text-3xl font-bold">Final Feedback</h1>
            <p className="mb-8 text-muted-foreground">NPS and open-ended questions will go here.</p>
            <Button onClick={() => setCurrentStep("complete")}>
              Submit Feedback
            </Button>
          </div>
        </section>
      )}

      {/* Complete */}
      {currentStep === "complete" && (
        <section className="flex min-h-screen flex-col items-center justify-center px-4 py-12">
          <div className="mx-auto max-w-2xl text-center">
            <div className="text-6xl mb-6">🎉</div>
            <h1 className="mb-4 text-3xl font-bold">Thank You!</h1>
            <p className="mb-8 text-muted-foreground">
              Thank you for your feedback. If you'd like to participate in a conversation 
              to learn more about Future Coach and give more feedback, please check the box below.
            </p>
            <div className="flex items-center justify-center gap-2 mb-8">
              <Checkbox id="want-conversation" />
              <Label htmlFor="want-conversation" className="cursor-pointer">
                Yes, I'd like to participate in a follow-up conversation
              </Label>
            </div>
            <Button 
  variant="outline"
  onClick={() => window.location.href = "https://futurecoach.org"}
>
  Done
</Button>

          </div>
        </section>
      )}

    </main>
  )
}
