"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"

interface FinalFeedbackProps {
  onComplete: (data: any) => void
}

export default function FinalFeedback({ onComplete }: FinalFeedbackProps) {
  const [nps, setNps] = useState<number | null>(null)
  const [whatLiked, setWhatLiked] = useState("")
  const [whatChange, setWhatChange] = useState("")

  const handleSubmit = () => {
    onComplete({
      nps,
      whatLiked,
      whatChange,
    })
  }

  return (
    <section className="flex min-h-screen flex-col items-center justify-center px-4 py-12">
      <div className="mx-auto max-w-2xl w-full">
        <Card className="p-6 md:p-8">
          <h2 className="mb-2 text-2xl font-bold text-center">
            Final Feedback
          </h2>
          <p className="mb-8 text-center text-sm text-muted-foreground">
            These quizzes are a prototype of a feature being considered for a life coaching app for young people. You are the first to try them! Your honest feedback will help us understand how to make them better and more useful for other young people. Your responses here and on the quizzes will be kept confidential, no individual responses will be shared, though anonymous quotes may be included in a report, along with aggregated feedback data.
          </p>

          <div className="space-y-8">
            {/* NPS */}
            <div>
              <Label className="mb-3 block text-base font-medium">
                How likely is it that you would recommend quizzes like these to a friend?
              </Label>
              <div className="flex justify-between mb-2">
                <span className="text-xs text-muted-foreground">Not at all likely</span>
                <span className="text-xs text-muted-foreground">Extremely likely</span>
              </div>
              <div className="grid grid-cols-11 gap-1">
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                  <button
                    key={num}
                    onClick={() => setNps(num)}
                    className={`rounded-lg border-2 p-3 text-center transition-all text-sm font-medium ${
                      nps === num
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>

            {/* What Liked */}
            <div>
              <Label className="mb-2 block text-base font-medium">
                Thinking about the overall experience of taking the quizzes and receiving the reports, what did you like?
              </Label>
              <p className="mb-3 text-sm text-muted-foreground">
                You might think about the questions and how clear they were, how the report made you feel, what your expectations were, etc.
              </p>
              <textarea
                value={whatLiked}
                onChange={(e) => setWhatLiked(e.target.value)}
                placeholder="What did you like about the experience..."
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[120px] ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>

            {/* What Change */}
            <div>
              <Label className="mb-2 block text-base font-medium">
                Thinking about the overall experience, what could have been better? What would you change?
              </Label>
              <textarea
                value={whatChange}
                onChange={(e) => setWhatChange(e.target.value)}
                placeholder="What would you improve..."
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[120px] ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>

            {/* Submit */}
            <div className="text-center pt-4">
              <Button
                onClick={handleSubmit}
                disabled={nps === null}
                size="lg"
                className="px-12"
              >
                Submit Feedback
              </Button>
              {nps === null && (
                <p className="mt-2 text-sm text-muted-foreground">
                  Please rate how likely you are to recommend
                </p>
              )}
            </div>
          </div>
        </Card>
      </div>
    </section>
  )
}
