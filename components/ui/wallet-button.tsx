'use client';

import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { Button } from "@/components/ui/button";

export function WalletButton() {
  const { connected, publicKey } = useWallet();
  const { setVisible } = useWalletModal();

  const handleClick = () => {
    if (!connected) {
      setVisible(true);
    }
  };

  return (
    <Button
      onClick={handleClick}
      className="text-white bg-black border border-white hover:bg-gray-900 hover:text-white transition-colors duration-200"
    >
      {connected
        ? `${publicKey?.toBase58().slice(0, 4)}...${publicKey?.toBase58().slice(-4)}`
        : "Connect Wallet"}
    </Button>
  );
}

