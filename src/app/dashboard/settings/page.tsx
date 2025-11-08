"use client";

import { useState, useEffect } from "react";
import { marketService } from "../../../lib/api";
import { useTheme } from "@/contexts/ThemeContext";
import {
  Shield,
  Bell,
  Palette,
  Lock,
  Save,
  RefreshCw,
  Monitor,
  Moon,
  Sun,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

interface UserSettings {
  notifications: {
    marketUpdates: boolean;
    oracleAlerts: boolean;
    riskAlerts: boolean;
  };
  privacy: {
    shareAnalytics: boolean;
    publicAnalysis: boolean;
  };
  display: {
    theme: "light" | "dark" | "system";
    currency: string;
  };
}

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [activeTab, setActiveTab] = useState("notifications");
  const [settings, setSettings] = useState<UserSettings>({
    notifications: {
      marketUpdates: true,
      oracleAlerts: true,
      riskAlerts: true,
    },
    privacy: {
      shareAnalytics: true,
      publicAnalysis: false,
    },
    display: {
      theme: theme,
      currency: "USD",
    },
  });

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load settings from API
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const data = await marketService.getSettings();
        setSettings(data);
      } catch (error) {
        console.error("Failed to load settings:", error);
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

  const tabs = [
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "privacy", label: "Privacy", icon: Shield },
    { id: "display", label: "Display", icon: Palette },
  ];

  const updateSettings = (
    section: keyof UserSettings,
    key: string,
    value: any
  ) => {
    setSettings((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value,
      },
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await marketService.updateSettings(settings);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error("Failed to save settings:", error);
      // Handle error - could show error toast
    } finally {
      setSaving(false);
    }
  };

  const saveSettings = handleSave;

  const renderNotificationsTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
          Alert Preferences
        </h3>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Choose which alerts and notifications you want to receive for market
          analysis and oracle updates.
        </p>
        <div className="space-y-4">
          {[
            {
              key: "marketUpdates",
              label: "Market Analysis Updates",
              desc: "New market analysis and credibility scores",
              icon: Bell,
            },
            {
              key: "oracleAlerts",
              label: "Oracle Status Alerts",
              desc: "System status changes and oracle updates",
              icon: AlertCircle,
            },
            {
              key: "riskAlerts",
              label: "Risk Assessment Alerts",
              desc: "High-risk market detection and warnings",
              icon: Shield,
            },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.key}
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <Icon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                  <div>
                    <div className="font-medium text-gray-900 dark:text-gray-100">
                      {item.label}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                      {item.desc}
                    </div>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={
                      settings.notifications[
                        item.key as keyof typeof settings.notifications
                      ]
                    }
                    onChange={(e) =>
                      updateSettings(
                        "notifications",
                        item.key,
                        e.target.checked
                      )
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 dark:bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 dark:after:border-gray-500 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 dark:peer-checked:bg-blue-500"></div>
                </label>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  const renderPrivacyTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
          Data & Privacy
        </h3>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Control how your data is used and shared to improve the TruthLens
          Oracle platform.
        </p>
        <div className="space-y-4">
          {[
            {
              key: "shareAnalytics",
              label: "Share Usage Analytics",
              desc: "Help improve TruthLens by sharing anonymous usage data",
              warning: false,
            },
            {
              key: "publicAnalysis",
              label: "Public Analysis Results",
              desc: "Allow your analysis results to be visible to other users",
              warning: true,
            },
          ].map((item) => (
            <div
              key={item.key}
              className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <Lock className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                <div>
                  <div className="font-medium text-gray-900 dark:text-gray-100">
                    {item.label}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    {item.desc}
                  </div>
                  {item.warning && (
                    <div className="flex items-center space-x-1 text-amber-600 dark:text-amber-400 text-sm mt-1">
                      <AlertCircle className="w-4 h-4" />
                      <span>Public visibility</span>
                    </div>
                  )}
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={
                    settings.privacy[item.key as keyof typeof settings.privacy]
                  }
                  onChange={(e) =>
                    updateSettings("privacy", item.key, e.target.checked)
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 dark:bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 dark:after:border-gray-500 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 dark:peer-checked:bg-blue-500"></div>
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-900 dark:text-blue-300">
              Blockchain Privacy
            </h4>
            <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
              All wallet interactions are pseudonymous. Your wallet address may
              be visible on-chain but is not linked to personal information.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderDisplayTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
          Interface & Display
        </h3>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Customize the appearance and display preferences for your TruthLens
          dashboard.
        </p>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Theme
            </label>
            <div className="space-y-2">
              {[
                {
                  value: "light",
                  label: "Light Mode",
                  icon: Sun,
                  desc: "Classic light interface",
                },
                {
                  value: "dark",
                  label: "Dark Mode",
                  icon: Moon,
                  desc: "Easy on the eyes",
                },
                {
                  value: "system",
                  label: "System Default",
                  icon: Monitor,
                  desc: "Follow system preference",
                },
              ].map((theme) => {
                const Icon = theme.icon;
                return (
                  <label
                    key={theme.value}
                    className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-600"
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                      <div>
                        <div className="font-medium text-gray-900 dark:text-gray-100">
                          {theme.label}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-300">
                          {theme.desc}
                        </div>
                      </div>
                    </div>
                    <input
                      type="radio"
                      name="theme"
                      value={theme.value}
                      checked={settings.display.theme === theme.value}
                      onChange={(e) => {
                        const newTheme = e.target.value as
                          | "light"
                          | "dark"
                          | "system";
                        setTheme(newTheme);
                        updateSettings("display", "theme", newTheme);
                      }}
                      className="w-4 h-4 text-blue-600 dark:text-blue-400"
                    />
                  </label>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Currency Display
            </label>
            <select
              value={settings.display.currency}
              onChange={(e) =>
                updateSettings("display", "currency", e.target.value)
              }
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400"
            >
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
              <option value="BTC">Bitcoin (₿)</option>
              <option value="ETH">Ethereum (Ξ)</option>
            </select>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
              Default currency for displaying market values and analysis costs
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="relative w-full overflow-hidden">
      {/* Settings Configuration Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Configuration Grid */}
        <div className="absolute inset-0 opacity-5">
          <svg className="w-full h-full">
            <defs>
              <pattern
                id="configGrid"
                width="100"
                height="100"
                patternUnits="userSpaceOnUse"
              >
                <rect
                  width="100"
                  height="100"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="0.5"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="2"
                  fill="currentColor"
                  opacity="0.6"
                />
                <path
                  d="M25,25 L75,25 L75,75 L25,75 Z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="0.3"
                  opacity="0.4"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#configGrid)" />
          </svg>
        </div>

        {/* Gear Icons */}
        <div className="absolute top-20 right-20 w-16 h-16 opacity-10 animate-spin-slow">
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-full h-full"
          >
            <path d="M12 15.5A3.5 3.5 0 0 1 8.5 12A3.5 3.5 0 0 1 12 8.5a3.5 3.5 0 0 1 3.5 3.5 3.5 3.5 0 0 1-3.5 3.5m7.43-2.53c.04-.32.07-.64.07-.97 0-.33-.03-.66-.07-1l2.11-1.63c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.31-.61-.22l-2.49 1c-.52-.39-1.06-.73-1.69-.98l-.37-2.65A.506.506 0 0 0 14 2h-4c-.25 0-.46.18-.5.42l-.37 2.65c-.63.25-1.17.59-1.69.98l-2.49-1c-.22-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64L4.57 11c-.04.34-.07.67-.07 1 0 .33.03.65.07.97L2.46 14.6c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.31.61.22l2.49-1c.52.39 1.06.73 1.69.98l.37 2.65c.04.24.25.42.5.42h4c.25 0 .46-.18.5-.42l.37-2.65c.63-.25 1.17-.59 1.69-.98l2.49 1c.22.09.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.66Z" />
          </svg>
        </div>

        {/* Security Shield Pattern */}
        <div className="absolute bottom-20 left-10 w-24 h-24 opacity-15">
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-full h-full animate-pulse"
          >
            <path d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M12,7C13.4,7 14.8,8.6 14.8,10V11.5C15.4,11.5 16,12.1 16,12.7V16.5C16,17.1 15.4,17.7 14.8,17.7H9.2C8.6,17.7 8,17.1 8,16.5V12.8C8,12.2 8.6,11.6 9.2,11.6V10C9.2,8.6 10.6,7 12,7M12,8.2C11.2,8.2 10.5,8.7 10.5,10V11.5H13.6V10C13.6,8.7 12.8,8.2 12,8.2Z" />
          </svg>
        </div>

        {/* Toggle Switch Pattern */}
        <div className="absolute top-1/2 left-10 opacity-10">
          <div className="flex flex-col space-y-2">
            <div className="w-12 h-6 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-pulse"></div>
            <div className="w-12 h-6 bg-gradient-to-r from-green-400 to-cyan-400 rounded-full animate-pulse delay-300"></div>
            <div className="w-12 h-6 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-pulse delay-600"></div>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="relative z-10 mb-8">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center mr-3 animate-glow">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-3xl font-bold ai-gradient-text">Settings</h1>
          </div>
          <button
            onClick={saveSettings}
            disabled={saving}
            className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all blockchain-card"
          >
            {saving ? (
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
        <p className="text-gray-600 dark:text-gray-300">
          Manage your account preferences and system configuration
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Tabs */}
        <div className="lg:w-1/4">
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-2">
            <nav className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                      activeTab === tab.id
                        ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-600"
                        : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="lg:w-3/4">
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-6">
            {activeTab === "notifications" && renderNotificationsTab()}
            {activeTab === "privacy" && renderPrivacyTab()}
            {activeTab === "display" && renderDisplayTab()}
          </div>
        </div>
      </div>
    </div>
  );
}
