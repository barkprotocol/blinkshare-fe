import { signInAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";

export default async function Login(props: { searchParams: Promise<Message> }) {
  const searchParams = await props.searchParams;

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-medium">Sign in</CardTitle>
        <CardDescription>
          Don't have an account?{" "}
          <Link className="text-primary font-medium hover:underline" href="/sign-up">
            Sign up
          </Link>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="flex flex-col gap-4" action={signInAction}>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email"
              name="email" 
              type="email"
              placeholder="you@example.com" 
              required 
              autoComplete="email"
            />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="password">Password</Label>
              <Link
                className="text-xs text-muted-foreground hover:text-primary hover:underline"
                href="/forgot-password"
              >
                Forgot Password?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              name="password"
              placeholder="Your password"
              required
              autoComplete="current-password"
            />
          </div>
          <SubmitButton pendingText="Signing In...">
            Sign in
          </SubmitButton>
          <FormMessage message={searchParams} />
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-muted-foreground">
          By signing in, you agree to our{" "}
          <Link href="/terms" className="text-primary hover:underline">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="text-primary hover:underline">
            Privacy Policy
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}

