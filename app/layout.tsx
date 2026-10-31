import type { Metadata } from "next";
import { Instrument_Serif } from "next/font/google";
import "./globals.css";

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  variable: "--font-instrument-serif",
});

export const metadata: Metadata = {
  title: "Satvic Language Studio",
  description: "A thoughtful workspace for bringing Satvic videos to more languages.",
  icons: {
    icon: [{ url: "/logo-icon.svg", type: "image/svg+xml" }],
    shortcut: "/logo-icon.svg",
    apple: "/logo-icon.svg",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body className={instrumentSerif.variable}>{children}</body></html>;
}
