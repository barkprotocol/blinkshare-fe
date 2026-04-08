"use client";

import { useState } from "react";
import { signInAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { FaDiscord, FaGithub, FaGoogle } from "react-icons/fa";
import { Wallet, Mail } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";

export default function Login({ searchParams }: { searchParams: Message }) {
  const [isLoading, setIsLoading] = useState(false);
  const { connected, publicKey } = useWallet();
  const supabase = createClient();

  const handleOAuthSignIn = async (provider: "google" | "discord" | "github") => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
    } catch (error) {
      toast.error("Failed to sign in. Please try again.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleWalletSignIn = async () => {
    if (!connected || !publicKey) {
      toast.error("Please connect your wallet first");
      return;
    }
    
    setIsLoading(true);
    try {
      // Wallet auth flow - sign a message and verify
      toast.success("Wallet connected! Signing in...");
      // Add your wallet auth logic here
    } catch (error) {
      toast.error("Wallet sign in failed");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md glass-card">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-3xl font-display">Welcome back</CardTitle>
          <CardDescription className="text-muted-foreground">
            Sign in to access your BlinkShare dashboard
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Wallet Sign In */}
          <div className="space-y-3">
            <Label className="text-sm text-muted-foreground">Connect with Wallet</Label>
            <div className="flex gap-3">
              <div className="flex-1 [&_.wallet-adapter-button]:!w-full [&_.wallet-adapter-button]:!h-11 [&_.wallet-adapter-button]:!rounded-lg [&_.wallet-adapter-button]:!bg-primary [&_.wallet-adapter-button]:!text-primary-foreground">
                <WalletMultiButton />
              </div>
              {connected && (
                <Button 
                  onClick={handleWalletSignIn}
                  disabled={isLoading}
                  className="h-11"
                >
                  <Wallet className="h-4 w-4 mr-2" />
                  Sign In
                </Button>
              )}
            </div>
          </div>

          <div className="relative">
            <Separator />
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-3 text-xs text-muted-foreground">
              or continue with
            </span>
          </div>

          {/* Social Sign In */}
          <div className="grid grid-cols-3 gap-3">
            <Button
              variant="outline"
              onClick={() => handleOAuthSignIn("google")}
              disabled={isLoading}
              className="h-11"
            >
              <FaGoogle className="h-4 w-4" />
              <span className="sr-only">Google</span>
            </Button>
            <Button
              variant="outline"
              onClick={() => handleOAuthSignIn("discord")}
              disabled={isLoading}
              className="h-11"
            >
              <FaDiscord className="h-4 w-4" />
              <span className="sr-only">Discord</span>
            </Button>
            <Button
              variant="outline"
              onClick={() => handleOAuthSignIn("github")}
              disabled={isLoading}
              className="h-11"
            >
              <FaGithub className="h-4 w-4" />
              <span className="sr-only">GitHub</span>
            </Button>
          </div>

          <div className="relative">
            <Separator />
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-3 text-xs text-muted-foreground">
              or sign in with email
            </span>
          </div>

          {/* Email Sign In */}
          <form className="space-y-4" action={signInAction}>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="email"
                  name="email" 
                  type="email"
                  placeholder="you@example.com" 
                  required 
                  autoComplete="email"
                  className="pl-10 h-11"
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="password">Password</Label>
                <Link
                  className="text-xs text-primary hover:underline"
                  href="/forgot-password"
                >
                  Forgot Password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                name="password"
                placeholder="Enter your password"
                required
                autoComplete="current-password"
                className="h-11"
              />
            </div>
            <SubmitButton 
              pendingText="Signing In..." 
              className="w-full h-11 bg-primary hover:bg-primary/90"
            >
              Sign in with Email
            </SubmitButton>
            <FormMessage message={searchParams} />
          </form>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <p className="text-sm text-muted-foreground text-center">
            Don&apos;t have an account?{" "}
            <Link className="text-primary font-medium hover:underline" href="/sign-up">
              Sign up
            </Link>
          </p>
          <p className="text-xs text-muted-foreground text-center">
            By signing in, you agree to our{" "}
            <Link href="/terms" className="text-primary hover:underline">
              Terms
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-primary hover:underline">
              Privacy Policy
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
