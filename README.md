# TruthLens Oracle - Frontend

A modern, responsive Next.js application for AI-powered credibility and manipulation risk analysis in crypto prediction markets.

## 🚀 Overview

TruthLens Oracle frontend is built with Next.js 14, TypeScript, and Tailwind CSS, providing a comprehensive dashboard for analyzing cryptocurrency market data with AI-powered insights and blockchain integration.

## 🛠 Tech Stack

### Core Technologies

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript 5.2.2
- **Styling**: Tailwind CSS 3.3.5
- **UI Components**: Custom components with Lucide React icons
- **Blockchain**: Ethers.js 6.8.1
- **State Management**: React Context API
- **Data Fetching**: SWR 2.2.4 with Axios 1.6.2

### Key Features

- 🌙 **Dark/Light Theme Support** - Full theme switching with persistent preferences
- 📱 **Responsive Design** - Mobile-first approach with adaptive layouts
- 🔗 **Wallet Integration** - Connect with MetaMask and other Web3 wallets
- 🤖 **AI Analysis** - Real-time credibility scoring and risk assessment
- 📊 **Interactive Dashboard** - Comprehensive analytics and market monitoring
- 🔐 **Secure Authentication** - Wallet-based access control

## 📁 Project Structure

```
frontend/
├── public/                 # Static assets
│   ├── images/            # Image assets
│   └── favicon.svg        # Website icon
├── src/
│   ├── app/               # Next.js App Router pages
│   │   ├── dashboard/     # Dashboard pages
│   │   │   ├── markets-hub/   # Market analysis hub
│   │   │   ├── settings/      # User settings
│   │   │   ├── status/        # System status
│   │   │   └── page.tsx       # Main dashboard
│   │   ├── globals.css    # Global styles
│   │   ├── layout.tsx     # Root layout
│   │   └── page.tsx       # Landing page
│   ├── components/        # Reusable UI components
│   │   ├── AIStatusPanel.tsx      # AI system status
│   │   ├── BlockchainIcon.tsx     # Crypto icons
│   │   ├── Header.tsx             # Navigation header
│   │   ├── Sidebar.tsx            # Dashboard sidebar
│   │   ├── WalletButton.tsx       # Wallet connection
│   │   └── ...
│   ├── contexts/          # React Context providers
│   │   ├── ThemeContext.tsx       # Theme management
│   │   └── WalletContext.tsx      # Wallet state
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Utilities and configurations
│   │   ├── api.ts         # API client
│   │   ├── auth.ts        # Authentication helpers
│   │   └── wallet.ts      # Wallet utilities
│   └── types/             # TypeScript type definitions
├── tailwind.config.js     # Tailwind CSS configuration
├── next.config.js         # Next.js configuration
└── tsconfig.json          # TypeScript configuration
```

## 🚦 Getting Started

### Prerequisites

- Node.js 18.0.0 or higher
- npm, yarn, or pnpm package manager
- Git

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/Creatron888/TruthLens.git
   cd TruthLens/frontend
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env.local
   ```

   Configure the following variables in `.env.local`:

   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8000
   NEXT_PUBLIC_CHAIN_ID=97  # BSC Testnet
   NEXT_PUBLIC_RPC_URL=https://data-seed-prebsc-1-s1.binance.org:8545/
   ```

4. **Start development server**

   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📱 Pages & Features

### Landing Page (`/`)

- Hero section with theme toggle
- Feature showcase
- Wallet connection prompt
- Responsive design with split layout

### Dashboard (`/dashboard`)

- **Overview Tab**: System metrics and quick stats
- **Analytics Tab**: Detailed market analysis
- **History Tab**: Analysis history with blockchain icons
- **Blockchain Tab**: Network status and performance

### Markets Hub (`/dashboard/markets-hub`)

- **Custom Analysis**: Ask questions about specific markets
- **Risk Assessment**: Comprehensive risk evaluation
- Real-time market data integration

### System Status (`/dashboard/status`)

- Oracle health monitoring
- Service status indicators
- Performance metrics
- API usage statistics

### Settings (`/dashboard/settings`)

- **Notifications**: Alert preferences
- **Privacy**: Data sharing controls
- **Display**: Theme and currency settings

## 🎨 UI Components

### Core Components

#### `Header.tsx`

- Navigation with system status indicators
- Search functionality
- Notifications dropdown
- Wallet integration

#### `Sidebar.tsx`

- Collapsible navigation
- Active route highlighting
- Wallet status display
- Responsive design

#### `BlockchainIcon.tsx`

- Dynamic cryptocurrency icons
- Online icon fetching from cryptologos.cc
- Multiple size variants (xs, sm, md, lg, xl, 2xl)
- Fallback color system

#### `WalletButton.tsx`

- Wallet connection interface
- Balance display
- Network indicator
- Connection state management

### Specialized Components

#### `AIStatusPanel.tsx`

- AI system performance metrics
- Real-time status updates
- Dark theme support

#### `TruthLensWidget.tsx`

- Market analysis interface
- Credibility scoring display
- Risk assessment visualization

## 🎭 Theme System

The application supports comprehensive light/dark theme switching:

### Theme Context

```typescript
const { theme, setTheme } = useTheme();
// theme: 'light' | 'dark' | 'system'
```

### CSS Custom Properties

```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --card: 0 0% 100%;
  --card-foreground: 222.2 84% 4.9%;
  /* ... */
}

[data-theme="dark"] {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  /* ... */
}
```

## 🔗 Blockchain Integration

### Supported Networks

- **Binance Smart Chain Testnet** (Chain ID: 97)
- **Binance Smart Chain Mainnet** (Chain ID: 56)

### Wallet Integration

```typescript
const { isConnected, account, balance, chainId, connect } = useWallet();
```

### Smart Contract Interaction

- Oracle contract integration
- Transaction monitoring
- Real-time blockchain data

## 📊 API Integration

### Market Service

```typescript
// Market data fetching
const markets = await marketService.getMarkets();
const analysis = await marketService.analyzeMarket(query);
const status = await marketService.getStatus();
```

### Real-time Updates

- SWR for data synchronization
- Automatic revalidation
- Error handling and retry logic

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - TypeScript type checking

### Code Quality

- **ESLint** configuration for code consistency
- **TypeScript** for type safety
- **Prettier** formatting (recommended)
- **Husky** for pre-commit hooks (optional)

### Component Development

```typescript
// Example component structure
import { useState } from "react";
import { useTheme } from "@/contexts/ThemeContext";

interface ComponentProps {
  title: string;
  variant?: "primary" | "secondary";
}

export function Component({ title, variant = "primary" }: ComponentProps) {
  const { theme } = useTheme();

  return (
    <div
      className={`rounded-lg ${
        variant === "primary" ? "bg-blue-600" : "bg-gray-600"
      }`}
    >
      {title}
    </div>
  );
}
```

## 🚀 Deployment

### Production Build

```bash
npm run build
npm run start
```

### Environment Configuration

Ensure all production environment variables are set:

- API endpoints
- Blockchain RPC URLs
- Chain IDs
- External service keys

### Hosting Recommendations

- **Vercel** (Recommended for Next.js)
- **Netlify**
- **AWS Amplify**
- **Docker** containerization

## 🔐 Security Considerations

### Wallet Security

- Never store private keys in frontend
- Use secure wallet connection libraries
- Implement proper transaction validation

### API Security

- Environment variable protection
- CORS configuration
- Rate limiting awareness

### Content Security

- Input validation
- XSS prevention
- Secure external resource loading

## 📈 Performance

### Optimization Features

- Next.js Image optimization
- Code splitting with dynamic imports
- Tree shaking for smaller bundles
- SWR caching strategies

### Monitoring

- Core Web Vitals tracking
- Performance metrics
- Error boundary implementation

## 🐛 Troubleshooting

### Common Issues

1. **Wallet Connection Failed**

   - Check MetaMask installation
   - Verify network configuration
   - Clear browser cache

2. **API Connection Issues**

   - Verify backend server is running
   - Check environment variables
   - Validate CORS settings

3. **Theme Not Persisting**
   - Check localStorage permissions
   - Verify theme context provider

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

### Code Style

- Follow existing TypeScript patterns
- Use Tailwind CSS for styling
- Implement proper error handling
- Add JSDoc comments for complex functions

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🔗 Related Links

- [Backend API Documentation](../backend/README.md)
- [Smart Contracts](../contracts/README.md)
- [Integration Guide](./INTEGRATION_GUIDE.md)
- [Live Demo](https://truthlens-oracle.vercel.app)

## 💬 Support

For support and questions:

- Create an issue on GitHub
- Join our Discord community
- Contact the development team

---

Built with ❤️ by the TruthLens Team
