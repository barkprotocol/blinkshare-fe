import { useWallet, WalletContextState } from "@solana/wallet-adapter-react";
import { toast } from "sonner";

export function useWalletActions() {
  const wallet: WalletContextState = useWallet();

  // Prompt the user to connect if not already connected
  const promptConnectWallet = async (): Promise<boolean> => {
    if (!wallet.connected) {
      toast.info("Connecting your wallet...");
      try {
        await wallet.connect();
        toast.success("Wallet connected successfully");
        return true;
      } catch (error) {
        console.error("Failed to connect wallet:", error);
        toast.error("Failed to connect wallet. Please try again.");
        return false;
      }
    }
    return true;
  };

  // Sign a message using the connected wallet
  const signMessage = async (message: string): Promise<string | null> => {
    if (!wallet.connected) {
      const connected = await promptConnectWallet();
      if (!connected) return null;
    }

    const { signMessage: sign, publicKey, connected } = wallet;

    // Type check for wallet connection and signing availability
    if (!connected || !publicKey || !sign) {
      console.error("Wallet is not connected or signing is unavailable");
      toast.error("Wallet is not properly connected or signing is unavailable");
      return null;
    }

    const encodedMessage = new TextEncoder().encode(message);
    try {
      const signedMessage = await sign(encodedMessage);
      return signedMessage ? Buffer.from(signedMessage).toString("base64") : null;
    } catch (error) {
      console.error("Error signing message:", error);
      toast.error("Error signing the message. Please try again.");
      return null;
    }
  };

  // Optional: Disconnect the wallet
  const disconnectWallet = async (): Promise<void> => {
    if (wallet.connected) {
      try {
        await wallet.disconnect();
        toast.success("Wallet disconnected successfully");
      } catch (error) {
        console.error("Failed to disconnect wallet:", error);
        toast.error("Failed to disconnect wallet. Please try again.");
      }
    }
  };

  return {
    wallet,
    signMessage,
    promptConnectWallet,
    disconnectWallet,
  };
}