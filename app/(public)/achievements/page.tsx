import { Metadata } from "next";
import AchievementsPageClient from "./AchievementsPageClient";

export const metadata: Metadata = {
  title: "Achievements | Pratik Shah - Financial Advisor",
  description: "Learn about Pratik Shah's MDRT (Million Dollar Round Table) global memberships, career milestones, awards, and professional credentials since 2005.",
  openGraph: {
    title: "Achievements | Pratik Shah - Financial Advisor",
    description: "Learn about Pratik Shah's MDRT (Million Dollar Round Table) global memberships, career milestones, awards, and professional credentials since 2005.",
    type: "website",
  },
};

export default function AchievementsPage() {
  return <AchievementsPageClient />;
}
