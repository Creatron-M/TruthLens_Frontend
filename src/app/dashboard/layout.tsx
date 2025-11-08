"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Header } from "../../components/Header";
import { Sidebar } from "../../components/Sidebar";
import { useWallet } from "@/contexts/WalletContext";
import { verifyWalletAccess } from "@/lib/auth";
import WalletButton from "@/components/WalletButton";
import { Shield, Wallet } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isConnected, account } = useWallet();
  const router = useRouter();

  // Redirect to landing page if wallet is not connected
  useEffect(() => {
    if (!verifyWalletAccess(isConnected, account)) {
      // Give a small delay to prevent flash
      const timeoutId = setTimeout(() => {
        router.push("/");
      }, 100);
      return () => clearTimeout(timeoutId);
    }
  }, [isConnected, account, router]);

  // Show loading or wallet connection prompt if not connected
  if (!verifyWalletAccess(isConnected, account)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center p-4">
        <div className="bg-card border border-border rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <Shield className="w-16 h-16 text-blue-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-card-foreground mb-2">
            Wallet Required
          </h2>
          <p className="text-muted-foreground mb-6">
            Connect your wallet to access the dashboard
          </p>

          <div className="space-y-4">
            <WalletButton
              variant="primary"
              size="lg"
              className="w-full justify-center"
              showBalance={false}
              showNetwork={false}
            />

            <button
              onClick={() => router.push("/")}
              className="w-full px-4 py-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              ← Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="pl-64">
        <Header />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
