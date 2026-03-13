import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signUpAction } from "../actions";

export default function SignupPage() {
  return (
    <main className="min-h-screen bg-[#0A1018] px-4 py-12 text-zinc-100">
      <Card className="mx-auto max-w-md border-white/10 bg-white/5">
        <CardHeader>
          <CardTitle className="text-2xl">Create Account</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={signUpAction} className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" required className="bg-white/5" />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" required className="bg-white/5" />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" minLength={8} required className="bg-white/5" />
            </div>
            <Button type="submit" className="w-full bg-cyan-300 text-zinc-900 hover:bg-cyan-200">
              Create and Continue
            </Button>
          </form>
          <p className="mt-4 text-sm text-zinc-400">
            Already have an account? <Link href="/login" className="text-cyan-300">Log in</Link>
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
