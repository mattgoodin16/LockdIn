"use client";

import { signIn } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const [error, setError] = useState("");

  return (
    <main className="min-h-screen bg-[#0A1018] px-4 py-12 text-zinc-100">
      <Card className="mx-auto max-w-md border-white/10 bg-white/5">
        <CardHeader>
          <CardTitle className="text-2xl">Log In</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            className="space-y-4"
            onSubmit={async (e) => {
              e.preventDefault();
              const form = new FormData(e.currentTarget);
              const email = String(form.get("email") || "");
              const password = String(form.get("password") || "");
              const res = await signIn("credentials", {
                email,
                password,
                redirect: false,
                callbackUrl: "/home",
              });
              if (res?.error) {
                setError("Invalid credentials");
                return;
              }
              window.location.href = "/home";
            }}
          >
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" required className="bg-white/5" />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" required className="bg-white/5" />
            </div>
            {error ? <p className="text-sm text-rose-300">{error}</p> : null}
            <Button type="submit" className="w-full bg-cyan-300 text-zinc-900 hover:bg-cyan-200">
              Continue
            </Button>
          </form>
          <p className="mt-4 text-sm text-zinc-400">
            New to LockdIn? <Link href="/signup" className="text-cyan-300">Create account</Link>
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
