"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"

interface FeedbackProps {
  quizType: "wol" | "big-five"
  onComplete: (data: any) => void
}

export default function Feedback({ quizType, onComplete }: FeedbackProps) {
  const [accuracy, setAccuracy] = useState<string | null>(null)
  const [useful, setUseful] = useState<string | null>(null)
  const [length, setLength] = useState<string | null>(null)
  const [feelings, setFeelings] = useState<string[]>([])
  const [feelingsOther, setFeelingsOther] = useState("")

  const handleSubmit = () => {
    onComplete({
      accuracy,
      useful,
      length,
      feelings: feelings.includes("other") 
        ? [...feelings.filter(f => f !== "other"), feelingsOther]
        : feelings,
    })
  }

  const quizName = quizType === "wol" ? "Wheel of Life" : "Personality"

  return (
    <section className="flex min-h-screen flex-col items-center justify-center px-4 py-12">
      <div className="mx-auto max-w-2xl w-full">
        <Card className="p-6 md:p-8">
          <h2 className="mb-2 text-2xl font-bold text-center">
            Quick Feedback on Your {quizName} Report
          </h2>
          <p className="mb-8 text-center text-muted-foreground">
            Please share some quick reactions to your report experience.
          </p>

          <div className="space-y-8">
            {/* Q1: Accuracy */}
            <div>
              <Label className="mb-3 block text-base font-medium">
                How accurate do you feel your report was?
              </Label>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
                {[
                  { value: "not-at-all", label: "Not at all accurate" },
                  { value: "a-little", label: "A little bit accurate" },
                  { value: "fairly", label: "Fairly accurate" },
                  { value: "very", label: "Very accurate" },
                  { value: "extremely", label: "Extremely accurate" },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setAccuracy(option.value)}
                    className={`rounded-lg border-2 p-3 text-center transition-all text-sm ${
                      accuracy === option.value
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Q2: Useful */}
            <div>
              <Label className="mb-3 block text-base font-medium">
                How useful did you find the report?
              </Label>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
                {[
                  { value: "not-at-all", label: "Not at all useful" },
                  { value: "a-little", label: "A little bit useful" },
                  { value: "fairly", label: "Fairly useful" },
                  { value: "very", label: "Very useful" },
                  { value: "extremely", label: "Extremely useful" },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setUseful(option.value)}
                    className={`rounded-lg border-2 p-3 text-center transition-all text-sm ${
                      useful === option.value
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Q3: Length */}
            <div>
              <Label className="mb-3 block text-base font-medium">
                How do you feel about the length of the report?
              </Label>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
                {[
                  { value: "too-short", label: "Too short" },
                  { value: "a-little-short", label: "A little short" },
                  { value: "just-right", label: "Just right" },
                  { value: "a-little-long", label: "A little long" },
                  { value: "too-long", label: "Too long" },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setLength(option.value)}
                    className={`rounded-lg border-2 p-3 text-center transition-all text-sm ${
                      length === option.value
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Q4: Feelings */}
            <div>
              <Label className="mb-3 block text-base font-medium">
                How did reading your report make you feel? (Check all that apply)
              </Label>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {[
                  { value: "happy", label: "Happy" },
                  { value: "sad", label: "Sad" },
                  { value: "anxious", label: "Anxious" },
                  { value: "proud", label: "Proud" },
                  { value: "lost", label: "Lost" },
                  { value: "empowered", label: "Empowered" },
                  { value: "offended", label: "Offended" },
                  { value: "motivated", label: "Motivated" },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      if (feelings.includes(option.value)) {
                        setFeelings(feelings.filter(f => f !== option.value))
                      } else {
                        setFeelings([...feelings, option.value])
                      }
                    }}
                    className={`rounded-lg border-2 p-3 text-center transition-all text-sm ${
                      feelings.includes(option.value)
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
              
              {/* Other option */}
              <div className="mt-3 flex items-center gap-2">
                <Checkbox
                  id="feelings-other"
                  checked={feelings.includes("other")}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setFeelings([...feelings, "other"])
                    } else {
                      setFeelings(feelings.filter(f => f !== "other"))
                      setFeelingsOther("")
                    }
                  }}
                />
                <Label htmlFor="feelings-other" className="text-sm">Other:</Label>
                {feelings.includes("other") && (
                  <Input
                    type="text"
                    value={feelingsOther}
                    onChange={(e) => setFeelingsOther(e.target.value)}
                    placeholder="How did you feel?"
                    className="flex-1"
                  />
                )}
              </div>
            </div>

            {/* Submit */}
            <div className="text-center pt-4">
              <Button
                onClick={handleSubmit}
                disabled={!accuracy || !useful || !length || feelings.length === 0}
                size="lg"
                className="px-12"
              >
                Continue
              </Button>
              {(!accuracy || !useful || !length || feelings.length === 0) && (
                <p className="mt-2 text-sm text-muted-foreground">
                  Please answer all questions
                </p>
              )}
            </div>
          </div>
        </Card>
      </div>
    </section>
  )
}
