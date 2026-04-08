"use client";

import { useState } from "react";
import { signUpAction } from "@/app/actions";
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
import { Mail, User, Lock } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";

export default function SignUp({ searchParams }: { searchParams: Message }) {
  const [isLoading, setIsLoading] = useState(false);
  const { connected } = useWallet();
  const supabase = createClient();

  const handleOAuthSignUp = async (provider: "google" | "discord" | "github") => {
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
      toast.error("Failed to sign up. Please try again.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md glass-card">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-3xl font-display">Create Account</CardTitle>
          <CardDescription className="text-muted-foreground">
            Join BlinkShare and start creating blinks
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Wallet Sign Up */}
          <div className="space-y-3">
            <Label className="text-sm text-muted-foreground">Sign up with Wallet</Label>
            <div className="[&_.wallet-adapter-button]:!w-full [&_.wallet-adapter-button]:!h-11 [&_.wallet-adapter-button]:!rounded-lg [&_.wallet-adapter-button]:!bg-primary [&_.wallet-adapter-button]:!text-primary-foreground">
              <WalletMultiButton />
            </div>
            {connected && (
              <p className="text-xs text-primary text-center">
                Wallet connected! Complete the form below.
              </p>
            )}
          </div>

          <div className="relative">
            <Separator />
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-3 text-xs text-muted-foreground">
              or continue with
            </span>
          </div>

          {/* Social Sign Up */}
          <div className="grid grid-cols-3 gap-3">
            <Button
              variant="outline"
              onClick={() => handleOAuthSignUp("google")}
              disabled={isLoading}
              className="h-11"
            >
              <FaGoogle className="h-4 w-4" />
              <span className="sr-only">Google</span>
            </Button>
            <Button
              variant="outline"
              onClick={() => handleOAuthSignUp("discord")}
              disabled={isLoading}
              className="h-11"
            >
              <FaDiscord className="h-4 w-4" />
              <span className="sr-only">Discord</span>
            </Button>
            <Button
              variant="outline"
              onClick={() => handleOAuthSignUp("github")}
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
              or sign up with email
            </span>
          </div>

          {/* Email Sign Up */}
          <form className="space-y-4" action={signUpAction}>
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="name"
                  name="name" 
                  placeholder="John Doe" 
                  required 
                  autoComplete="name"
                  className="pl-10 h-11"
                />
              </div>
            </div>
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
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  name="password"
                  placeholder="Create a strong password"
                  required
                  autoComplete="new-password"
                  className="pl-10 h-11"
                />
              </div>
            </div>
            <SubmitButton 
              pendingText="Creating Account..." 
              className="w-full h-11 bg-primary hover:bg-primary/90"
            >
              Create Account
            </SubmitButton>
            <FormMessage message={searchParams} />
          </form>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <p className="text-sm text-muted-foreground text-center">
            Already have an account?{" "}
            <Link className="text-primary font-medium hover:underline" href="/sign-in">
              Sign in
            </Link>
          </p>
          <p className="text-xs text-muted-foreground text-center">
            By signing up, you agree to our{" "}
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
