import {
  useWriteContract,
  useReadContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { DATASET_NFT_ADDRESS, parseWND } from "./config";
import { DatasetNFTAbi } from "./DatasetNFT";
import { useState, useCallback } from "react";
import { createPublicClient, http } from "viem";
import { westendAssetHub } from "../wagmi";

// Public RPC client for Asset Hub
const publicClient = createPublicClient({
  chain: westendAssetHub,        // 👈 use the Chain object exported from lib/wagmi
  transport: http(westendAssetHub.rpcUrls.default.http[0]),
});

export function useMintDataset(options?: {
  onSuccess?: (tokenId: number) => void;
  onError?: (err: Error) => void;
}) {
  const [tokenId, setTokenId] = useState<number | undefined>(undefined);
  const [isMinting, setIsMinting] = useState(false);
  const [hash, setHash] = useState<string | undefined>();
  const [error, setError] = useState<Error | null>(null);

  // Read total() from contract
  const { refetch: refetchTotal } = useReadContract({
    address: DATASET_NFT_ADDRESS,
    abi: DatasetNFTAbi,
    functionName: "total",
    query: { enabled: false }
  });

  const { writeContractAsync } = useWriteContract();

  // -----------------------------
  // 🚀 MAIN MINT FUNCTION
  // -----------------------------
  const mint = useCallback(async (cid: string) => {
    try {
      setError(null);
      setIsMinting(true);
      setTokenId(undefined);

      console.log("🚀 Starting mint on Asset Hub with CID:", cid);

      // --- 1️⃣ Token supply before ---
      const beforeRes = await refetchTotal();
      const beforeSupply = Number(beforeRes.data ?? 0);
      console.log("📌 Token supply before:", beforeSupply);

      console.log("📡 MetaMask chainId:", await window.ethereum.request({ method: "eth_chainId" }));

      // --- 2️⃣ Send TX (WITH chainId) ---
const txHash = await writeContractAsync({
  chainId: westendAssetHub.id,
  address: DATASET_NFT_ADDRESS,
  abi: DatasetNFTAbi,
  functionName: "mint",
  args: [cid],
  gas: 3_000_000n,          // 👈 REQUIRED
  gasPrice: 1_000_000_000n, // 👈 REQUIRED
  value: 0n,                // 👈 ALWAYS for nonpayable
});

      console.log("📨 TX Sent:", txHash);
      setHash(txHash);

      // --- 3️⃣ Manual polling for receipt ---
      console.log("⏳ Waiting for receipt…");
      let receipt = null;

      for (let i = 0; i < 60; i++) {
        try {
          receipt = await publicClient.getTransactionReceipt({ hash: txHash });
        } catch (_) {}

        if (receipt) break;
        await new Promise(res => setTimeout(res, 2000));
      }

      if (!receipt) throw new Error("Transaction not included in block (timeout)");

      console.log("🧾 Receipt obtained!");

      // --- 4️⃣ Wait for total() to increase ---
      console.log("⏳ Waiting for total() to increase...");
      let newSupply = beforeSupply;

      for (let i = 0; i < 60; i++) {
        const r = await refetchTotal();
        newSupply = Number(r.data ?? 0);

        console.log(`🔍 total() = ${newSupply}`);

        if (newSupply > beforeSupply) break;
        await new Promise(res => setTimeout(res, 2000));
      }

      if (newSupply === beforeSupply)
        throw new Error("Mint confirmed but token supply did not update");

      const mintedId = newSupply;
      console.log("🎉 Token ID:", mintedId);

      setTokenId(mintedId);
      options?.onSuccess?.(mintedId);

    } catch (err: unknown) {
      console.error("❌ Mint error:", err);
      const caughtError = err instanceof Error ? err : new Error(String(err));
      setError(caughtError);
      options?.onError?.(caughtError);
    } finally {
      setIsMinting(false);
    }
  }, [refetchTotal, writeContractAsync, options]);

  return {
    mint,
    isMinting,
    error,
    hash,
    tokenId,
  };
}

/**
 * Hook for listing a dataset for sale
 */
export function useListDataset() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const list = async (tokenId: number, priceInWND: string) => {
    const priceInWei = parseWND(priceInWND);

    return writeContract({
      address: DATASET_NFT_ADDRESS,
      abi: DatasetNFTAbi, // Remove .abi
      functionName: "list",
      args: [BigInt(tokenId), priceInWei],
    });
  };

  return {
    list,
    isPending,
    isConfirming,
    isSuccess,
    error,
    hash,
  };
}

/**
 * Hook for buying a dataset
 */
export function useBuyDataset() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const buy = async (tokenId: number, price: bigint) => {
    return writeContract({
      address: DATASET_NFT_ADDRESS,
      abi: DatasetNFTAbi, // Remove .abi
      functionName: "buy",
      args: [BigInt(tokenId)],
      value: price,
    });
  };

  return {
    buy,
    isPending,
    isConfirming,
    isSuccess,
    error,
    hash,
  };
}

/**
 * Hook for canceling a listing
 */
export function useCancelListing() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const cancel = async (tokenId: number) => {
    return writeContract({
      address: DATASET_NFT_ADDRESS,
      abi: DatasetNFTAbi,
      functionName: "cancel",
      args: [BigInt(tokenId)],
    });
  };

  return {
    cancel,
    isPending,
    isConfirming,
    isSuccess,
    error,
    hash,
  };
}

/**
 * Hook for transferring an NFT
 */
export function useTransferNFT() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const transfer = async (from: string, to: string, tokenId: number) => {
    return writeContract({
      address: DATASET_NFT_ADDRESS,
      abi: DatasetNFTAbi, // Remove .abi
      functionName: "transferFrom",
      args: [from, to, BigInt(tokenId)],
    });
  };

  return {
    transfer,
    isPending,
    isConfirming,
    isSuccess,
    error,
    hash,
  };
}

/**
 * Hook for setting AI verification score (owner only)
 */
export function useSetScore() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const setScore = async (tokenId: number, score: number) => {
    if (score < 0 || score > 100) {
      throw new Error("Score must be between 0 and 100");
    }

    return writeContract({
      address: DATASET_NFT_ADDRESS,
      abi: DatasetNFTAbi, // Remove .abi
      functionName: "setScore",
      args: [BigInt(tokenId), score],
    });
  };

  return {
    setScore,
    isPending,
    isConfirming,
    isSuccess,
    error,
    hash,
  };
}

// ============ READ HOOKS (View Functions) ============

// Add type for the dataset data tuple
type DatasetData = readonly [
  `0x${string}`, // cid
  bigint, // score
  bigint, // price
  `0x${string}`, // creator
  boolean // listed
];

/**
 * Hook for reading dataset info by tokenId
 */
export function useDatasetInfo(tokenId: number | undefined) {
  const { data, isLoading, error, refetch } = useReadContract({
    address: DATASET_NFT_ADDRESS,
    abi: DatasetNFTAbi,
    functionName: "data",
    args: tokenId ? [BigInt(tokenId)] : undefined,
    query: {
      enabled: !!tokenId && tokenId > 0,
    },
  }) as {
    data: DatasetData | undefined;
    isLoading: boolean;
    error: Error | null;
    refetch: () => void;
  };

  // Log for debugging
  console.log("useDatasetInfo:", { tokenId, data, isLoading, error });

  return {
    dataset: data
      ? {
          cid: data[0],
          score: Number(data[1]),
          price: data[2],
          creator: data[3],
          listed: data[4],
        }
      : undefined,
    isLoading,
    error,
    refetch,
  };
}

/**
 * Hook for reading total supply
 */
export function useTotalSupply() {
  const { data, isLoading, error, refetch } = useReadContract({
    address: DATASET_NFT_ADDRESS,
    abi: DatasetNFTAbi, // Remove .abi
    functionName: "total",
  });

  return {
    total: data ? Number(data) : 0,
    isLoading,
    error,
    refetch,
  };
}

/**
 * Hook for reading user's NFT balance
 */
export function useUserBalance(address?: string) {
  const { data, isLoading, error, refetch } = useReadContract({
    address: DATASET_NFT_ADDRESS,
    abi: DatasetNFTAbi, // Remove .abi
    functionName: "balanceOf",
    args: address ? [address as `0x${string}`] : undefined,
    query: {
      enabled: !!address,
    },
  });

  return {
    balance: data ? Number(data) : 0,
    isLoading,
    error,
    refetch,
  };
}

/**
 * Hook for reading NFT owner
 */
export function useNFTOwner(tokenId?: number) {
  const { data, isLoading, error, refetch } = useReadContract({
    address: DATASET_NFT_ADDRESS,
    abi: DatasetNFTAbi, // Remove .abi
    functionName: "ownerOf",
    args: tokenId ? [BigInt(tokenId)] : undefined,
    query: {
      enabled: !!tokenId,
    },
  });

  return {
    owner: data as `0x${string}` | undefined,
    isLoading,
    error,
    refetch,
  };
}

/**
 * Hook for reading contract owner
 */
export function useContractOwner() {
  const { data, isLoading, error } = useReadContract({
    address: DATASET_NFT_ADDRESS,
    abi: DatasetNFTAbi, // Remove .abi
    functionName: "owner",
  });

  return {
    contractOwner: data as `0x${string}` | undefined,
    isLoading,
    error,
  };
}

/**
 * Hook for reading token name
 */
export function useTokenName() {
  const { data } = useReadContract({
    address: DATASET_NFT_ADDRESS,
    abi: DatasetNFTAbi, // Remove .abi
    functionName: "name",
  });

  return data as string;
}

/**
 * Hook for reading token symbol
 */
export function useTokenSymbol() {
  const { data } = useReadContract({
    address: DATASET_NFT_ADDRESS,
    abi: DatasetNFTAbi, // Remove .abi
    functionName: "symbol",
  });

  return data as string;
}
