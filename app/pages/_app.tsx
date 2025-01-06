import { PrivyProvider } from '@privy-io/react-auth';

function BlinkShareApp({ Component, pageProps }) {
  return (
    <PrivyProvider
      appId="your-privy-app-id"
      config={{
        appearance: {
          accentColor: "#6A6FF5",
          theme: "#FFFFFF",
          showWalletLoginFirst: false,
          logo: "https://auth.privy.io/logos/privy-logo.png",
          walletChainType: "ethereum-and-solana",
          walletList: ["detected_wallets", "phantom"]
        },
        loginMethods: [
          "email",
          "wallet",
          "google",
          "apple",
          "github",
          "discord"
        ],
        fundingMethodConfig: {
          moonpay: {
            useSandbox: true
          }
        },
        embeddedWallets: {
          createOnLogin: "users-without-wallets",
          requireUserPasswordOnCreate: false
        },
        mfa: {
          noPromptOnMfaRequired: false
        }
      }}
    >
      <Component {...pageProps} />
    </PrivyProvider>
  );
}

export default BlinkShareApp;
