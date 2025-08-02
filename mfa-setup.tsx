"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import Image from "next/image"
import { CheckCircle, XCircle } from "lucide-react"

export function MFASetup() {
  const [isMfaEnabled, setIsMfaEnabled] = useState<boolean | null>(null)
  const [qrCodeImageUrl, setQrCodeImageUrl] = useState<string | null>(null)
  const [sharedSecret, setSharedSecret] = useState<string | null>(null)
  const [twoFactorCode, setTwoFactorCode] = useState("")
  const [message, setMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [enrollmentId, setEnrollmentId] = useState<string | null>(null)

  const supabase = createClient()

  useEffect(() => {
    const checkMfaStatus = async () => {
      const { data, error } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel()
      if (error) {
        console.error("Error fetching MFA status:", error)
        setIsMfaEnabled(false) // Assume not enabled on error
      } else {
        setIsMfaEnabled(data.next_aal === "aal2") // aal2 means MFA is enabled
      }
    }
    checkMfaStatus()
  }, [supabase])

  const handleEnableMFA = async () => {
    setIsLoading(true)
    setMessage("")
    setQrCodeImageUrl(null)
    setSharedSecret(null)
    setTwoFactorCode("")

    const { data, error } = await supabase.auth.mfa.enroll({
      factorType: "totp",
    })

    if (error) {
      setMessage(`שגיאה בהפעלת 2FA: ${error.message}`)
    } else if (data) {
      setQrCodeImageUrl(data.qrCode)
      setSharedSecret(data.sharedSecret)
      setEnrollmentId(data.id)
      setMessage("סרוק את קוד ה-QR עם אפליקציית המאמת שלך והזן את הקוד לאימות.")
    }
    setIsLoading(false)
  }

  const handleVerifyMFAEnrollment = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage("")

    if (!enrollmentId || !twoFactorCode) {
      setMessage("אנא סרוק את קוד ה-QR והזן את הקוד.")
      setIsLoading(false)
      return
    }

    const { error } = await supabase.auth.mfa.challengeAndVerify({
      factorId: enrollmentId,
      code: twoFactorCode,
    })

    if (error) {
      setMessage(`שגיאת אימות: ${error.message}`)
    } else {
      setMessage("2FA הופעל בהצלחה!")
      setIsMfaEnabled(true)
      setQrCodeImageUrl(null)
      setSharedSecret(null)
      setEnrollmentId(null)
      setTwoFactorCode("")
    }
    setIsLoading(false)
  }

  const handleDisableMFA = async () => {
    setIsLoading(true)
    setMessage("")

    // First, get the enrolled factors
    const {
      data: { factors },
      error: getFactorsError,
    } = await supabase.auth.mfa.getFactors()
    if (getFactorsError) {
      setMessage(`שגיאה באחזור גורמי 2FA: ${getFactorsError.message}`)
      setIsLoading(false)
      return
    }

    const totpFactor = factors.find((factor) => factor.factor_type === "totp")
    if (!totpFactor) {
      setMessage("לא נמצא גורם TOTP פעיל לביטול.")
      setIsLoading(false)
      return
    }

    // Unenroll the TOTP factor
    const { error: unenrollError } = await supabase.auth.mfa.unenroll({
      factorId: totpFactor.id,
    })

    if (unenrollError) {
      setMessage(`שגיאה בביטול 2FA: ${unenrollError.message}`)
    } else {
      setMessage("2FA בוטל בהצלחה!")
      setIsMfaEnabled(false)
      setQrCodeImageUrl(null)
      setSharedSecret(null)
      setEnrollmentId(null)
      setTwoFactorCode("")
    }
    setIsLoading(false)
  }

  if (isMfaEnabled === null) {
    return (
      <Card className="w-full max-w-md mx-auto shadow-lg bg-white text-center p-6">
        <p className="text-gray-600">טוען סטטוס 2FA...</p>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg bg-white">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold text-purple-800">אימות דו-שלבי (2FA)</CardTitle>
        <CardDescription className="text-gray-600">
          {isMfaEnabled ? "2FA מופעל. שפר את אבטחת חשבונך." : "2FA אינו מופעל. הוסף שכבת אבטחה נוספת."}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isMfaEnabled ? (
          <div className="text-center">
            <p className="text-green-600 flex items-center justify-center gap-2">
              <CheckCircle className="h-5 w-5" /> 2FA מופעל כעת.
            </p>
            <Button
              onClick={handleDisableMFA}
              className="mt-4 bg-red-600 hover:bg-red-700 text-white"
              disabled={isLoading}
            >
              {isLoading ? "מבטל..." : "בטל 2FA"}
            </Button>
          </div>
        ) : (
          <div>
            {!qrCodeImageUrl ? (
              <div className="text-center">
                <p className="text-red-600 flex items-center justify-center gap-2">
                  <XCircle className="h-5 w-5" /> 2FA אינו מופעל.
                </p>
                <Button
                  onClick={handleEnableMFA}
                  className="mt-4 bg-purple-600 hover:bg-purple-700 text-white"
                  disabled={isLoading}
                >
                  {isLoading ? "מפעיל..." : "הפעל 2FA"}
                </Button>
              </div>
            ) : (
              <form onSubmit={handleVerifyMFAEnrollment} className="space-y-4">
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-2">סרוק את קוד ה-QR עם אפליקציית המאמת שלך:</p>
                  <Image
                    src={qrCodeImageUrl || "/placeholder.svg"}
                    alt="QR Code for 2FA"
                    width={200}
                    height={200}
                    className="mx-auto"
                  />
                  {sharedSecret && (
                    <p className="text-xs text-gray-500 mt-2">
                      או הזן ידנית: <code className="font-mono bg-gray-100 p-1 rounded">{sharedSecret}</code>
                    </p>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="twoFactorCode">קוד אימות</Label>
                  <Input
                    id="twoFactorCode"
                    type="text"
                    placeholder="הזן קוד 2FA"
                    value={twoFactorCode}
                    onChange={(e) => setTwoFactorCode(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                  disabled={isLoading}
                >
                  {isLoading ? "מאמת..." : "אמת והפעל"}
                </Button>
              </form>
            )}
          </div>
        )}
        {message && (
          <p className={`mt-4 text-center text-sm ${message.includes("שגיאה") ? "text-red-500" : "text-green-600"}`}>
            {message}
          </p>
        )}
      </CardContent>
    </Card>
  )
}
