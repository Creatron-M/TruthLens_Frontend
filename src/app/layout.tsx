import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { WalletProvider } from "@/contexts/WalletContext";
import { ThemeProvider } from "@/contexts/ThemeContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TruthLens Oracle",
  description:
    "AI-powered credibility and manipulation risk analysis for crypto prediction markets",
  icons: {
    icon: [
      {
        url: "/favicon.svg",
        type: "image/svg+xml",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider>
          <WalletProvider>
            <div className="min-h-screen bg-background text-foreground transition-colors">
              {children}
            </div>
          </WalletProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
