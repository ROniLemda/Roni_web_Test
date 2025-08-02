import LandingPageClient from "./landing-page-client" // Import the Client Component
import { getHeroContent } from "@/app/actions/content" // Import the Server Action for data fetching

export default async function Component() {
  // Fetch hero content on the server
  const heroData = await getHeroContent()
  const heroTitle = heroData?.title || "בנה את הנוכחות הדיגיטלית הבאה שלך איתנו"
  const heroDescription =
    heroData?.description || "אנו יוצרים אתרים מודרניים, רספונסיביים ומותאמים אישית שיעזרו לעסק שלך לשגשג באינטרנט."

  // Pass the fetched data as props to the Client Component
  return <LandingPageClient heroTitle={heroTitle} heroDescription={heroDescription} />
}
