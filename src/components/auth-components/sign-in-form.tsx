"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { signIn } from "@/lib/auth/auth-client";

export default function SignInForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  return (
    <div className="grid gap-4">
      <div className="grid gap-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="m@example.com"
          required
          onChange={(e) => {
            setEmail(e.target.value);
          }}
          value={email}
        />
      </div>

      <div className="grid gap-2">
        <div className="flex items-center">
          <Label htmlFor="password">Password</Label>
        </div>

        <Input
          id="password"
          type="password"
          placeholder="password"
          autoComplete="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <div className="flex items-center gap-2">
        <Checkbox
          id="remember"
          onClick={() => {
            setRememberMe(!rememberMe);
          }}
        />
        <Label htmlFor="remember">Remember me</Label>
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={loading}
        onClick={async () => {
          await signIn.email(
            {
              email,
              password,
            },
            {
              onRequest: (ctx) => {
                setLoading(true);
              },
              onResponse: (ctx) => {
                setLoading(false);
              },
            }
          );
        }}
      >
        {loading ? <Loader2 size={16} className="animate-spin" /> : "Login"}
      </Button>
    </div>
  );
}
