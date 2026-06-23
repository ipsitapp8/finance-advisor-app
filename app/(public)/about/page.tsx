import { Metadata } from "next";
import AboutPageClient from "./AboutPageClient";

export const metadata: Metadata = {
  title: "About Me | Pratik Shah - Financial Advisor",
  description: "Learn about Pratik Shah, double MDRT Achiever and certified AMFI / LIC financial advisor with 20+ years of wealth management service.",
  openGraph: {
    title: "About Me | Pratik Shah - Financial Advisor",
    description: "Learn about Pratik Shah, double MDRT Achiever and certified AMFI / LIC financial advisor with 20+ years of wealth management service.",
    type: "website",
  },
};

export default function AboutPage() {
  return <AboutPageClient />;
}
