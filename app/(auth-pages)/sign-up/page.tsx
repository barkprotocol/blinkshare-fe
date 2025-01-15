import { signUpAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";

export default async function SignUp(props: { searchParams: Promise<Message> }) {
  const searchParams = await props.searchParams;

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl font-medium">Create an account</CardTitle>
        <CardDescription>
          Already have an account?{" "}
          <Link className="text-primary font-medium hover:underline" href="/login">
            Sign in
          </Link>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="flex flex-col gap-4" action={signUpAction}>
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input 
              id="name"
              name="name" 
              placeholder="John Doe" 
              required 
              autoComplete="name"
            />
          </div>
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
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              name="password"
              placeholder="Create a strong password"
              required
              autoComplete="new-password"
            />
          </div>
          <SubmitButton pendingText="Creating Account...">
            Create Account
          </SubmitButton>
          <FormMessage message={searchParams} />
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-muted-foreground">
          By signing up, you agree to our{" "}
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

