"use client"
import { useActionState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { sendContactEmail } from "@/app/actions/send-email" // Import the new Server Action

export function ContactForm() {
  const [state, formAction, isPending] = useActionState(sendContactEmail, null)

  return (
    <Card className="w-full max-w-lg mx-auto shadow-lg bg-white">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold text-purple-800">צור קשר</CardTitle>
        <CardDescription className="text-gray-600">נשמח לשמוע ממך! מלא את הפרטים ונחזור אליך בהקדם.</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-6">
          <div className="grid gap-2">
            <Label htmlFor="name">שם מלא</Label>
            <Input id="name" name="name" placeholder="הכנס את שמך" required disabled={isPending} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">כתובת אימייל</Label>
            <Input id="email" name="email" type="email" placeholder="your@example.com" required disabled={isPending} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="subject">נושא</Label>
            <Input id="subject" name="subject" placeholder="נושא ההודעה" required disabled={isPending} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="message">הודעה</Label>
            <Textarea
              id="message"
              name="message"
              placeholder="כתוב את הודעתך כאן..."
              rows={5}
              required
              disabled={isPending}
            />
          </div>
          <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white" disabled={isPending}>
            {isPending ? "שולח..." : "שלח הודעה"}
          </Button>
          {state && (
            <p className={`mt-4 text-center ${state.success ? "text-green-600" : "text-red-600"}`}>{state.message}</p>
          )}
        </form>
      </CardContent>
    </Card>
  )
}
