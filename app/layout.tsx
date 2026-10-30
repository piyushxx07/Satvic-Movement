import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Satvic Language Studio",
  description: "A thoughtful workspace for bringing Satvic videos to more languages.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
