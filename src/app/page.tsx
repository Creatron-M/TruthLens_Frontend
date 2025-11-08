"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useWallet } from "@/contexts/WalletContext";
import { useTheme } from "@/contexts/ThemeContext";
import WalletButton from "@/components/WalletButton";
import { verifyWalletAccess } from "@/lib/auth";
import { BlockchainIcon } from "@/components/BlockchainIcon";
import {
  ArrowRight,
  Shield,
  Brain,
  Target,
  Zap,
  CheckCircle,
  BarChart3,
  Globe,
  Users,
  TrendingUp,
  Wallet,
  Sun,
  Moon,
} from "lucide-react";

export default function LandingPage() {
  const { isConnected, account } = useWallet();
  const { theme, setTheme } = useTheme();
  const router = useRouter();

  // Auto-redirect to dashboard when wallet is connected
  useEffect(() => {
    if (isConnected && account) {
      // Small delay to ensure smooth transition and let user see the connection success
      const timeoutId = setTimeout(() => {
        router.push("/dashboard");
      }, 800); // Slightly longer delay for better UX
      return () => clearTimeout(timeoutId);
    }
  }, [isConnected, account, router]);

  return (
    <div className="min-h-screen overflow-hidden">
      {/* Theme Toggle Button */}
      <button
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className="fixed top-6 right-6 z-50 p-3 rounded-xl bg-white/10 dark:bg-gray-800/10 backdrop-blur-sm border border-white/20 dark:border-gray-700/20 hover:bg-white/20 dark:hover:bg-gray-700/20 transition-all duration-200"
        aria-label="Toggle theme"
      >
        {theme === "dark" ? (
          <Sun className="w-5 h-5 text-yellow-500" />
        ) : (
          <Moon className="w-5 h-5 text-blue-600" />
        )}
      </button>

      {/* Animated Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Blockchain Network Lines */}
        <div className="absolute inset-0 opacity-10 dark:opacity-20">
          <div className="absolute top-20 left-10 w-2 h-2 bg-blue-400 dark:bg-blue-300 rounded-full animate-pulse"></div>
          <div className="absolute top-32 right-20 w-3 h-3 bg-purple-400 dark:bg-purple-300 rounded-full animate-pulse delay-300"></div>
          <div className="absolute bottom-40 left-1/4 w-2 h-2 bg-cyan-400 dark:bg-cyan-300 rounded-full animate-pulse delay-700"></div>
          <div className="absolute bottom-60 right-1/3 w-2 h-2 bg-indigo-400 dark:bg-indigo-300 rounded-full animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 w-4 h-4 bg-violet-400 dark:bg-violet-300 rounded-full animate-pulse delay-500"></div>

          {/* Connecting Lines */}
          <svg className="absolute inset-0 w-full h-full">
            <defs>
              <linearGradient
                id="lineGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4" />
                <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.4" />
              </linearGradient>
            </defs>
            <path
              d="M50 80 L320 128 L240 320 L480 240 L400 400"
              stroke="url(#lineGradient)"
              strokeWidth="1"
              fill="none"
              className="animate-pulse"
            />
            <path
              d="M800 100 L600 200 L750 350 L900 180"
              stroke="url(#lineGradient)"
              strokeWidth="1"
              fill="none"
              className="animate-pulse delay-300"
            />
          </svg>
        </div>

        {/* AI Brain Circuit Pattern */}
        <div className="absolute top-0 right-0 w-96 h-96 opacity-5 dark:opacity-15 animate-spin-slow">
          <svg
            viewBox="0 0 200 200"
            className="w-full h-full text-gray-600 dark:text-gray-300"
          >
            <circle
              cx="100"
              cy="100"
              r="80"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.5"
            />
            <circle
              cx="100"
              cy="100"
              r="60"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.3"
            />
            <circle
              cx="100"
              cy="100"
              r="40"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.2"
            />
            <path
              d="M100,20 L100,40 M100,160 L100,180 M20,100 L40,100 M160,100 L180,100"
              stroke="currentColor"
              strokeWidth="0.4"
            />
            <circle cx="100" cy="30" r="3" fill="currentColor" />
            <circle cx="100" cy="170" r="3" fill="currentColor" />
            <circle cx="30" cy="100" r="3" fill="currentColor" />
            <circle cx="170" cy="100" r="3" fill="currentColor" />
          </svg>
        </div>

        {/* Floating Geometric Shapes */}
        <div className="absolute bottom-0 left-0 w-64 h-64 opacity-10 dark:opacity-20 animate-bounce-slow">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-purple-400 dark:from-blue-300 dark:to-purple-300 rounded-lg rotate-45 animate-pulse"></div>
        </div>
        <div className="absolute top-1/4 right-1/4 w-20 h-20 opacity-8 dark:opacity-15 animate-float">
          <div className="w-full h-full border-2 border-cyan-400 dark:border-cyan-300 rounded-full animate-spin-slow"></div>
        </div>

        {/* Blockchain Cubes */}
        <div className="absolute top-20 right-10 opacity-20 dark:opacity-30">
          <div className="flex space-x-1">
            <div className="w-4 h-4 bg-blue-400 dark:bg-blue-300 rounded animate-pulse"></div>
            <div className="w-4 h-4 bg-purple-400 dark:bg-purple-300 rounded animate-pulse delay-200"></div>
            <div className="w-4 h-4 bg-cyan-400 dark:bg-cyan-300 rounded animate-pulse delay-400"></div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative min-h-screen bg-gradient-to-br from-background via-blue-50 to-purple-50 dark:from-background dark:via-slate-800 dark:to-slate-900 flex items-center">
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-screen">
            {/* Left Column - Text Content */}
            <div className="flex flex-col justify-center text-left lg:text-left">
              {/* Hero Header */}
              <div className="mb-12">
                <div className="flex items-center lg:justify-start justify-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center mr-4">
                    <span className="text-2xl font-bold text-white">T</span>
                  </div>
                  <h1 className="text-4xl lg:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    TruthLens Oracle
                  </h1>
                </div>
                <p className="text-xl text-gray-900 dark:text-white mb-8">
                  AI-powered credibility and manipulation risk analysis for
                  crypto prediction markets
                </p>

                {/* Supported Cryptocurrencies */}
                <div className="mb-8">
                  <p className="text-sm text-gray-900 dark:text-white mb-4">
                    Supported Markets:
                  </p>
                  <div className="flex items-center lg:justify-start justify-center flex-wrap gap-6">
                    <div className="flex items-center space-x-2">
                      <BlockchainIcon symbol="BTC" size="md" />
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        Bitcoin
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <BlockchainIcon symbol="ETH" size="md" />
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        Ethereum
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <BlockchainIcon symbol="BNB" size="md" />
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        Binance Coin
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-6 lg:items-start items-center">
                {verifyWalletAccess(isConnected, account) ? (
                  <Link
                    href="/dashboard"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center space-x-2"
                  >
                    <span>Go to Dashboard</span>
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                ) : (
                  <div className="space-y-4">
                    <WalletButton
                      variant="primary"
                      size="lg"
                      className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                      showBalance={false}
                      showNetwork={false}
                    />
                    <p className="text-gray-900 dark:text-white text-sm">
                      Connect your wallet to access the dashboard and start
                      analyzing markets
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - Background Image */}
            <div className="relative flex items-center justify-center">
              <img
                src="/images/background.png"
                alt="TruthLens Oracle Background"
                className="w-full h-auto max-h-[1000px] object-contain"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="relative py-20 bg-gradient-to-b from-background to-slate-50 dark:to-slate-900 overflow-hidden"
      >
        {/* Background Tech Pattern */}
        <div className="absolute inset-0 opacity-5 dark:opacity-15">
          <div className="absolute top-10 left-10 w-32 h-32 border border-blue-300 dark:border-blue-400 rounded-lg rotate-12 animate-pulse"></div>
          <div className="absolute top-40 right-20 w-24 h-24 border border-purple-300 dark:border-purple-400 rounded-full animate-spin-slow"></div>
          <div className="absolute bottom-20 left-1/4 w-20 h-20 bg-gradient-to-r from-cyan-200 to-blue-200 dark:from-cyan-400 dark:to-blue-400 rounded-lg rotate-45 animate-pulse"></div>

          {/* Neural Network Pattern */}
          <svg
            className="absolute right-0 top-1/2 w-96 h-96 transform -translate-y-1/2"
            viewBox="0 0 400 400"
          >
            <defs>
              <radialGradient id="neuralGradient" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.1" />
                <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.05" />
              </radialGradient>
            </defs>
            <circle cx="100" cy="100" r="4" fill="url(#neuralGradient)" />
            <circle cx="300" cy="150" r="4" fill="url(#neuralGradient)" />
            <circle cx="200" cy="300" r="4" fill="url(#neuralGradient)" />
            <circle cx="350" cy="300" r="4" fill="url(#neuralGradient)" />
            <line
              x1="100"
              y1="100"
              x2="300"
              y2="150"
              stroke="url(#neuralGradient)"
              strokeWidth="1"
            />
            <line
              x1="300"
              y1="150"
              x2="200"
              y2="300"
              stroke="url(#neuralGradient)"
              strokeWidth="1"
            />
            <line
              x1="200"
              y1="300"
              x2="350"
              y2="300"
              stroke="url(#neuralGradient)"
              strokeWidth="1"
            />
          </svg>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 rounded-2xl flex items-center justify-center mr-4 animate-pulse">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <div className="w-16 h-16 bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 rounded-2xl flex items-center justify-center animate-pulse delay-300">
                <Shield className="w-8 h-8 text-white" />
              </div>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent mb-6">
              Powerful Features for Market Intelligence
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our AI-powered platform provides comprehensive analysis tools to
              help you make informed decisions in volatile markets.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="blockchain-card p-8 rounded-2xl hover:shadow-lg transition-all">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl flex items-center justify-center mb-6 animate-glow">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-card-foreground mb-4">
                AI Credibility Analysis
              </h3>
              <p className="text-muted-foreground mb-4">
                Advanced machine learning algorithms analyze source reliability,
                citation quality, and content bias to provide credibility
                scores.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center text-sm text-muted-foreground">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  OpenAI-powered content analysis
                </li>
                <li className="flex items-center text-sm text-muted-foreground">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Domain reputation checking
                </li>
                <li className="flex items-center text-sm text-muted-foreground">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Bias detection algorithms
                </li>
              </ul>
            </div>

            <div className="blockchain-card p-8 rounded-2xl hover:shadow-lg transition-all">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl flex items-center justify-center mb-6 animate-glow">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-card-foreground mb-4">
                Risk Detection
              </h3>
              <p className="text-muted-foreground mb-4">
                Real-time manipulation detection using sentiment analysis,
                coordinated activity patterns, and market anomalies.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center text-sm text-muted-foreground">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Pump & dump detection
                </li>
                <li className="flex items-center text-sm text-muted-foreground">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Coordinated bot activity
                </li>
                <li className="flex items-center text-sm text-muted-foreground">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Market volatility analysis
                </li>
              </ul>
            </div>

            <div className="blockchain-card p-8 rounded-2xl hover:shadow-lg transition-all">
              <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-green-700 rounded-xl flex items-center justify-center mb-6 animate-glow">
                <Target className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-card-foreground mb-4">
                Custom Questions
              </h3>
              <p className="text-muted-foreground mb-4">
                Ask any market-related question and get AI-powered analysis with
                credibility scoring and risk assessment.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center text-sm text-muted-foreground">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Natural language processing
                </li>
                <li className="flex items-center text-sm text-muted-foreground">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Real-time data analysis
                </li>
                <li className="flex items-center text-sm text-muted-foreground">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Personalized insights
                </li>
              </ul>
            </div>

            <div className="blockchain-card p-8 rounded-2xl hover:shadow-lg transition-all">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-600 to-orange-700 rounded-xl flex items-center justify-center mb-6 animate-glow">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-card-foreground mb-4">
                Real-time Monitoring
              </h3>
              <p className="text-muted-foreground mb-4">
                24/7 monitoring of market conditions with instant alerts and
                updates on credibility changes.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center text-sm text-muted-foreground">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Live market feeds
                </li>
                <li className="flex items-center text-sm text-muted-foreground">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Instant notifications
                </li>
                <li className="flex items-center text-sm text-muted-foreground">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Historical tracking
                </li>
              </ul>
            </div>

            <div className="blockchain-card p-8 rounded-2xl hover:shadow-lg transition-all">
              <div className="w-12 h-12 bg-gradient-to-r from-teal-600 to-teal-700 rounded-xl flex items-center justify-center mb-6 animate-glow">
                <Globe className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-card-foreground mb-4">
                Blockchain Integration
              </h3>
              <p className="text-muted-foreground mb-4">
                Transparent, immutable records of all analysis results stored on
                BSC blockchain with IPFS metadata.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center text-sm text-muted-foreground">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  On-chain attestations
                </li>
                <li className="flex items-center text-sm text-muted-foreground">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  IPFS metadata storage
                </li>
                <li className="flex items-center text-sm text-muted-foreground">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Verifiable results
                </li>
              </ul>
            </div>

            <div className="blockchain-card p-8 rounded-2xl hover:shadow-lg transition-all">
              <div className="w-12 h-12 bg-gradient-to-r from-pink-600 to-pink-700 rounded-xl flex items-center justify-center mb-6 animate-glow">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-card-foreground mb-4">
                Community Insights
              </h3>
              <p className="text-muted-foreground mb-4">
                Analyze social sentiment from multiple sources including news,
                forums, and social media platforms.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center text-sm text-muted-foreground">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Multi-source aggregation
                </li>
                <li className="flex items-center text-sm text-muted-foreground">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Sentiment analysis
                </li>
                <li className="flex items-center text-sm text-muted-foreground">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Trend identification
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section
        id="how-it-works"
        className="py-20 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800"
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold ai-gradient-text mb-6">
              How TruthLens Works
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our sophisticated AI pipeline processes multiple data sources to
              provide you with actionable insights.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center mx-auto mb-6 animate-glow">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="text-xl font-bold text-foreground mb-4">
                Data Collection
              </h3>
              <p className="text-muted-foreground">
                Aggregate real-time data from CoinGecko, news sources, and
                social platforms
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-purple-700 rounded-full flex items-center justify-center mx-auto mb-6 animate-glow">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="text-xl font-bold text-foreground mb-4">
                AI Analysis
              </h3>
              <p className="text-muted-foreground">
                Process content through OpenAI models for credibility scoring
                and bias detection
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-green-700 rounded-full flex items-center justify-center mx-auto mb-6 animate-glow">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="text-xl font-bold text-foreground mb-4">
                Risk Assessment
              </h3>
              <p className="text-muted-foreground">
                Identify manipulation patterns and calculate risk indices using
                advanced algorithms
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-600 to-orange-700 rounded-full flex items-center justify-center mx-auto mb-6 animate-glow">
                <span className="text-2xl font-bold text-white">4</span>
              </div>
              <h3 className="text-xl font-bold text-foreground mb-4">
                Blockchain Storage
              </h3>
              <p className="text-muted-foreground">
                Store immutable attestations on BSC blockchain with IPFS
                metadata for transparency
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
              Ready to Uncover Market Truth?
            </h2>
            <p className="text-xl text-blue-100 mb-12">
              Join the revolution in market intelligence. Start analyzing with
              AI-powered credibility detection today.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {verifyWalletAccess(isConnected, account) ? (
                <Link
                  href="/dashboard"
                  className="bg-background text-primary px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-200 flex items-center justify-center space-x-2"
                >
                  <span>Launch Dashboard</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
              ) : (
                <WalletButton
                  variant="secondary"
                  size="lg"
                  className="bg-background text-primary px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-200"
                  showBalance={false}
                  showNetwork={false}
                />
              )}

              <a
                href="#features"
                className="border-2 border-white/30 dark:border-gray-600/30 text-white dark:text-gray-100 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/10 dark:hover:bg-gray-700/20 transition-all duration-200 flex items-center justify-center space-x-2"
              >
                <span>Explore Features</span>
                <BarChart3 className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                  <span className="text-xl font-bold text-white">T</span>
                </div>
                <span className="text-2xl font-bold">TruthLens</span>
              </div>
              <p className="text-muted-foreground mb-4">
                AI-powered oracle for market credibility analysis and
                manipulation detection.
              </p>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  {verifyWalletAccess(isConnected, account) ? (
                    <Link
                      href="/dashboard"
                      className="hover:text-foreground dark:hover:text-white transition-colors"
                    >
                      Dashboard
                    </Link>
                  ) : (
                    <WalletButton
                      variant="outline"
                      size="sm"
                      className="hover:text-foreground dark:hover:text-white transition-colors text-left p-0 h-auto font-normal justify-start border-none bg-transparent"
                      showBalance={false}
                      showNetwork={false}
                    />
                  )}
                </li>
                <li>
                  <a
                    href="#features"
                    className="hover:text-foreground dark:hover:text-white transition-colors"
                  >
                    Features
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground dark:hover:text-white transition-colors"
                  >
                    Documentation
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground dark:hover:text-white transition-colors"
                  >
                    API Reference
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground dark:hover:text-white transition-colors"
                  >
                    Support
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground dark:hover:text-white transition-colors"
                  >
                    Contact
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground dark:hover:text-white transition-colors"
                  >
                    Privacy
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border mt-12 pt-8 text-center text-muted-foreground">
            <p>&copy; 2025 TruthLens. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
