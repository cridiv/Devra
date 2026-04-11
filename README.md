[![Devra Demo](https://img.youtube.com/vi/_MowrvcabKM/maxresdefault.jpg)](https://www.youtube.com/watch?v=_MowrvcabKM)
# Devra - Decentralized Data Marketplace

![Devra Banner](https://img.shields.io/badge/Blockchain-Polkadot-E6007A?style=for-the-badge&logo=polkadot) ![Next.js](https://img.shields.io/badge/Next.js-15.5.5-black?style=for-the-badge&logo=next.js) ![Solidity](https://img.shields.io/badge/Solidity-0.8.28-363636?style=for-the-badge&logo=solidity) ![NestJS](https://img.shields.io/badge/NestJS-11.0.1-E0234E?style=for-the-badge&logo=nestjs)

> A trustless, AI-verified marketplace for trading datasets as NFTs on Polkadot's Westend Asset Hub

## 📋 Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Smart Contracts](#smart-contracts)
- [Backend Services](#backend-services)
- [Frontend Application](#frontend-application)
- [AI Verification](#ai-verification)
- [Deployment](#deployment)
- [Contributing](#contributing)

## 🌟 Overview

Devra revolutionizes data trading by combining blockchain technology, AI verification, and decentralized storage to create a transparent marketplace where:

- **Datasets are NFTs**: Immutable ownership proof on Polkadot
- **AI Quality Assurance**: Automated verification before minting
- **Encrypted Storage**: IPFS-based decentralized storage with encryption
- **Trustless Trading**: Smart contract-powered peer-to-peer transactions
- **Fair Pricing**: Dynamic marketplace with transparent price discovery

### Key Features

✨ **NFT-Based Ownership** - Every dataset is an ERC-721 token  
🤖 **AI Verification** - Quality scoring and authenticity checks  
🔒 **End-to-End Encryption** - RSA encryption before IPFS upload  
💎 **Integrated Marketplace** - List, buy, and cancel listings on-chain  
📊 **Multi-Format Support** - CSV, JSON, ZIP, Parquet, Excel  
🎨 **Modern UI/UX** - Cyberpunk-inspired, responsive design

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend (Next.js)                    │
│  • React 19 + Server Components                             │
│  • Wagmi v2 + Viem (Web3)                                   │
│  • Framer Motion (Animations)                               │
│  • Tailwind CSS v4                                          │
└────────────────┬────────────────────────────────────────────┘
                 │
                 │ RPC Calls (Viem)
                 │
┌────────────────▼────────────────────────────────────────────┐
│              Smart Contract (Solidity 0.8.28)               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  DatasetNFT.sol                                      │   │
│  │  • ERC-721 Implementation                            │   │
│  │  • mint(cid, score)                                  │   │
│  │  • list(tokenId, price)                              │   │
│  │  • buy(tokenId)                                      │   │
│  │  • cancelListing(tokenId)                            │   │
│  └──────────────────────────────────────────────────────┘   │
│                  Deployed on Westend Asset Hub              │
└────────────────┬────────────────────────────────────────────┘
                 │
                 │ Events & Queries
                 │
┌────────────────▼────────────────────────────────────────────┐
│                  Backend (NestJS + Python)                   │
│  ┌─────────────────────┐       ┌─────────────────────┐      │
│  │  NestJS API Server  │       │  AI Verifier (FastAPI)│     │
│  │  • Upload Handler   │◄─────►│  • Quality Analysis  │      │
│  │  • Encryption Svc   │       │  • Fraud Detection   │      │
│  │  • IPFS Integration │       │  • Scoring Engine    │      │
│  │  • BullMQ Jobs      │       │  • ML Models         │      │
│  └──────────┬──────────┘       └─────────────────────┘      │
│             │                                                │
│  ┌──────────▼──────────┐       ┌─────────────────────┐      │
│  │   PostgreSQL        │       │   Redis (BullMQ)    │      │
│  │   (Prisma ORM)      │       │   (Job Queue)       │      │
│  └─────────────────────┘       └─────────────────────┘      │
└────────────────┬────────────────────────────────────────────┘
                 │
                 │ Upload Encrypted Data
                 │
┌────────────────▼────────────────────────────────────────────┐
│                     IPFS (Decentralized Storage)             │
│  • Content-Addressed Storage (CIDs)                         │
│  • Encrypted Dataset Files                                  │
│  • Metadata & Verification Reports                          │
└─────────────────────────────────────────────────────────────┘
```

### Data Flow

1. **Upload Flow**

   ```
   User → Frontend → Backend → AI Verifier → Encryption → IPFS → Get CID
                                                                    ↓
   User ← Frontend ← Smart Contract ← Mint NFT ← Return CID ←─────┘
   ```

2. **Purchase Flow**

   ```
   Buyer → Frontend → Smart Contract.buy() → Transfer Funds → Transfer NFT
                          ↓
   Buyer ← IPFS ← Decrypt ← Access Grant ← Event Listener
   ```

3. **Listing Flow**
   ```
   Owner → Frontend → Smart Contract.list() → Set Price → Emit ListingCreated
   ```

## 🛠️ Tech Stack

### Frontend

| Technology         | Version  | Purpose                           |
| ------------------ | -------- | --------------------------------- |
| **Next.js**        | 15.5.5   | React framework with App Router   |
| **React**          | 19.1.0   | UI library with Server Components |
| **TypeScript**     | 5.x      | Type-safe development             |
| **Tailwind CSS**   | 4.0      | Utility-first styling             |
| **Wagmi**          | 2.19.2   | React hooks for Ethereum          |
| **Viem**           | 2.38.6   | TypeScript Ethereum library       |
| **Framer Motion**  | 12.23.24 | Animation library                 |
| **TanStack Query** | 5.90.7   | Data fetching & caching           |
| **Lucide React**   | 0.545.0  | Icon library                      |

### Backend (NestJS)

| Technology     | Version       | Purpose                 |
| -------------- | ------------- | ----------------------- |
| **NestJS**     | 11.0.1        | Node.js framework       |
| **Prisma**     | 6.17.1        | ORM for PostgreSQL      |
| **BullMQ**     | 5.61.0        | Job queue with Redis    |
| **PostgreSQL** | 8.x           | Relational database     |
| **Redis**      | IORedis 5.8.1 | In-memory cache & queue |
| **Axios**      | 1.12.2        | HTTP client             |

### AI Verification (Python)

| Technology                | Version | Purpose                        |
| ------------------------- | ------- | ------------------------------ |
| **FastAPI**               | Latest  | High-performance API framework |
| **PyTorch**               | Latest  | Deep learning framework        |
| **Transformers**          | Latest  | NLP models (BERT, DistilBERT)  |
| **Sentence-Transformers** | Latest  | Semantic similarity            |
| **Pandas**                | Latest  | Data analysis                  |
| **Scikit-learn**          | Latest  | ML utilities                   |
| **Pillow**                | Latest  | Image processing               |

### Blockchain

| Technology    | Version     | Purpose                    |
| ------------- | ----------- | -------------------------- |
| **Solidity**  | 0.8.28      | Smart contract language    |
| **Polkadot**  | Asset Hub   | EVM-compatible blockchain  |
| **IPFS**      | HTTP Client | Decentralized storage      |
| **Ethers.js** | 6.15.0      | Ethereum library (scripts) |

## 📁 Project Structure

```
Devra/
├── devra-frontend/           # Next.js 15 Frontend
│   ├── app/
│   │   ├── components/       # Reusable UI components
│   │   │   ├── Hero.tsx
│   │   │   ├── Navbar.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── About.tsx
│   │   ├── animations/       # Framer Motion animations
│   │   ├── connect/          # Wallet connection page
│   │   ├── marketplace/      # Dataset marketplace
│   │   ├── datasets/         # User datasets management
│   │   ├── dashboard/        # User dashboard
│   │   └── providers.tsx     # Wagmi & React Query setup
│   ├── lib/
│   │   ├── wagmi.ts          # Web3 configuration
│   │   └── contracts/        # Contract interaction hooks
│   │       ├── useDataset.ts # NFT contract hooks
│   │       └── DatasetNFT.ts # Contract ABI & config
│   ├── hooks/
│   │   ├── useWallet.ts      # Wallet connection hook
│   │   └── useContract.ts    # Generic contract hook
│   └── package.json
│
├── devra-backend/            # NestJS Backend
│   ├── src/
│   │   ├── modules/
│   │   │   ├── upload/       # File upload handling
│   │   │   ├── encryption/   # RSA encryption service
│   │   │   ├── verification/ # AI verification integration
│   │   │   ├── crust/        # IPFS/Crust integration
│   │   │   └── prisma/       # Database service
│   │   ├── common/
│   │   │   └── config/       # Redis & Vault config
│   │   └── main.ts
│   ├── prisma/
│   │   └── schema.prisma     # Database schema
│   └── package.json
│
├── devra-ai_verifier/        # Python AI Service
│   ├── main.py               # FastAPI application
│   ├── requirements.txt      # Python dependencies
│   └── Procfile              # Deployment config
│
├── devra-contracts/          # Solidity Smart Contracts
│   ├── contracts/
│   │   └── DatasetNFT.sol    # Main NFT contract
│   ├── scripts/              # Deployment scripts
│   │   ├── deploy_with_ethers.ts
│   │   └── deploy_with_web3.ts
│   └── tests/                # Contract tests
│
└── README.md                 # This file
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** 20.x or higher
- **npm** or **yarn**
- **Python** 3.10+
- **PostgreSQL** 14+
- **Redis** 7+
- **MetaMask** or **Talisman** wallet

### Installation

#### 1. Clone the Repository

```bash
git clone https://github.com/Nebulaz7/Devra.git
cd Devra
```

#### 2. Frontend Setup

```bash
cd devra-frontend
npm install
cp .env.example .env.local
# Configure your environment variables
npm run dev
# Open http://localhost:3000
```

**Environment Variables (.env.local)**

```env
NEXT_PUBLIC_CONTRACT_ADDRESS=0x25e485fc5492ce1c65cfd438de6d64eb62335cd7
NEXT_PUBLIC_CHAIN_ID=420420421
NEXT_PUBLIC_BACKEND_URL=http://localhost:3000
```

#### 3. Backend Setup

```bash
cd devra-backend
npm install
cp .env.example .env
# Configure database and Redis
npx prisma migrate dev
npm run start:dev
# Backend runs on http://localhost:3000
```

**Environment Variables (.env)**

```env
DATABASE_URL="postgresql://user:password@localhost:5432/devra"
REDIS_HOST=localhost
REDIS_PORT=6379
AI_VERIFIER_URL=http://localhost:5000/
IPFS_GATEWAY=https://ipfs.io
```

#### 4. AI Verifier Setup

```bash
cd devra-ai_verifier
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 5000
# AI service runs on http://localhost:5000/
```

#### 5. Database Migration

```bash
cd devra-backend
npx prisma migrate dev --name init
npx prisma generate
```

## 📜 Smart Contracts

### DatasetNFT.sol

**Deployed Address:** `0x25e485fc5492ce1c65cfd438de6d64eb62335cd7`  
**Network:** Westend Asset Hub (Chain ID: 420420421)  
**Explorer:** [Blockscout](https://westend-asset-hub-eth-explorer.polkadot.io/)

#### Core Functions

```solidity
// Mint a new dataset NFT
function mint(bytes32 cid, uint8 score) external returns (uint256)

// List dataset for sale
function list(uint256 tokenId, uint96 price) external

// Purchase a listed dataset
function buy(uint256 tokenId) external payable

// Cancel listing
function cancelListing(uint256 tokenId) external

// Get dataset info
function datasetInfo(uint256 tokenId) external view returns (Data memory)
```

#### Events

```solidity
event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)
event ListingCreated(uint256 indexed tokenId, uint96 price)
event ListingCancelled(uint256 indexed tokenId)
event Sold(uint256 indexed tokenId, address indexed buyer, uint96 price)
```

### Deployment

```bash
cd devra-contracts
npm install
# Deploy using Remix IDE or:
npx hardhat run scripts/deploy_with_ethers.ts --network westend
```

## 🔧 Backend Services

### Upload Service

Handles multipart file uploads with validation.

```typescript
@Post('upload')
@UseInterceptors(FileInterceptor('file'))
async uploadDataset(
  @UploadedFile() file: Express.Multer.File,
  @Body() dto: CreateDatasetDto
) {
  // 1. Validate file
  // 2. Send to AI verifier
  // 3. Encrypt file
  // 4. Upload to IPFS
  // 5. Return CID
}
```

### Encryption Service

RSA-based encryption for dataset security.

```typescript
async encryptFile(buffer: Buffer, publicKey: string): Promise<Buffer> {
  // AES-256-GCM encryption with RSA-wrapped keys
}
```

### Queue Service (BullMQ)

Background job processing for uploads.

```typescript
@Process('upload-dataset')
async processUpload(job: Job) {
  // 1. Verify with AI
  // 2. Encrypt data
  // 3. Upload to IPFS
  // 4. Update database
}
```

## 🎨 Frontend Application

### Wallet Integration

```typescript
// lib/wagmi.ts
import { createConfig, http } from "wagmi";
import { westendAssetHub } from "./chains";
import { metaMask } from "@wagmi/connectors";

export const config = createConfig({
  chains: [westendAssetHub],
  connectors: [metaMask()],
  transports: {
    [westendAssetHub.id]: http(),
  },
});
```

### Contract Interaction Hooks

```typescript
// lib/contracts/useDataset.ts
export function useMintDataset() {
  const { writeContractAsync } = useWriteContract();

  const mint = async (cid: string) => {
    const hash = await writeContractAsync({
      address: CONTRACT_ADDRESS,
      abi: DatasetNFTABI,
      functionName: "mint",
      args: [cid, 85], // CID and quality score
    });
    return hash;
  };

  return { mint };
}
```

### Components

- **Hero.tsx** - Landing page hero section with 3D animations
- **Navbar.tsx** - Navigation with wallet connection
- **Marketplace.tsx** - Dataset browsing and purchasing
- **Datasets.tsx** - User's owned datasets management
- **MintDatasetModal.tsx** - Multi-step minting workflow

## 🤖 AI Verification

### Verification Pipeline

```python
@app.post("/verify")
async def verify_dataset(file: UploadFile):
    # 1. Extract and parse data
    data = extract_data(file)

    # 2. Quality metrics
    completeness = calculate_completeness(data)
    consistency = check_consistency(data)

    # 3. Fraud detection
    duplicates = detect_duplicates(data)
    anomalies = find_anomalies(data)

    # 4. AI scoring
    score = ml_quality_score(data)

    return {
        "score": score,
        "quality_metrics": {...},
        "fraud_indicators": {...}
    }
```

### Supported Models

- **BERT** - Text quality analysis
- **DistilBERT** - Fast text classification
- **ResNet18** - Image dataset verification
- **Sentence-BERT** - Semantic similarity

## 🌐 Deployment

### Frontend (Vercel)

```bash
cd devra-frontend
vercel deploy --prod
```

**Build Configuration:**

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs"
}
```

### Backend (Railway/Heroku)

```bash
cd devra-backend
# Set environment variables
railway up
```

### AI Verifier (Render)

```yaml
# render.yaml
services:
  - type: web
    name: devra-ai-verifier
    env: python
    buildCommand: pip install -r requirements.txt
    startCommand: uvicorn main:app --host 0.0.0.0 --port $PORT
```

### Database (PostgreSQL)

Use managed services:

- **Supabase** (Recommended)
- **Railway**
- **Render**

## 🧪 Testing

### Frontend Tests

```bash
cd devra-frontend
npm run test
```

### Backend Tests

```bash
cd devra-backend
npm run test
npm run test:e2e
```

### Contract Tests

```bash
cd devra-contracts
npm run test
```

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style

- **Frontend:** ESLint + Prettier
- **Backend:** NestJS style guide
- **Contracts:** Solidity style guide

## 🔗 Links

- **Live Demo:** [https://devra.vercel.app](https://devra.vercel.app)
- **Contract Explorer:** [View on Blockscout](https://westend-asset-hub-eth-explorer.polkadot.io/address/0x25e485fc5492ce1c65cfd438de6d64eb62335cd7)

**Built with ❤️ by the Devra Team**  
_Making data trading fair, transparent, and decentralized_
