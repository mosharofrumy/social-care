"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Eye, EyeOff, Lock, Mail } from "lucide-react";
import { FcGoogle } from "react-icons/fc";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { isValidEmail } from "@/lib/validation";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = React.useState<
    Partial<Record<"email" | "password", string>>
  >({});
  // Refetching the shared session store guarantees the navbar
  // receives the user (including the photo) on first login.
  const { refetch: refetchSession } = authClient.useSession();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");
    const errors: Partial<Record<"email" | "password", string>> = {};

    if (!isValidEmail(email)) {
      errors.email = "Enter a valid email address.";
    }
    if (!password.trim()) {
      errors.password = "Enter your password.";
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setFieldErrors({});
    setSubmitting(true);

    const { data, error } = await authClient.signIn.email({
      email,
      password,
    });

    if (data) {
      toast.success("Welcome back! You are now logged in.");
      await refetchSession();
      router.replace("/");
    } else if (error) {
      setError(
        error.message && error.status === 401
          ? "Invalid email or password. Please try again."
          : (error.message ??
              "Something went wrong while signing in. Please try again.")
      );
    }

    setSubmitting(false);
  };

  const handleGoogleSignIn = async () => {
    setSubmitting(true);
    setError(null);

    try {
      const { error } = await authClient.signIn.social({
        provider: "google",
        callbackURL: "/",
      });

      if (error) {
        setError(error.message ?? "Google sign-in failed. Please try again.");
      }
    } catch {
      setError("Unable to start Google sign-in. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="flex-1 bg-gray-50 px-4 py-12 transition-colors dark:bg-gray-950 sm:px-6 sm:py-16">
      <Card className="mx-auto w-full max-w-md gap-6 rounded-3xl px-6 py-10 shadow-xl shadow-emerald-900/5 sm:px-10">
        {/* Heading */}
        <CardHeader className="justify-items-center text-center">
          <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl shadow-lg shadow-emerald-800/30">
            <Image
              src="/sc-logo.png"
              alt="Social Care Logo"
              width={64}
              height={64}
              priority
              className="h-full w-full scale-105 object-cover"
            />
          </div>

          <CardTitle className="mt-2 text-3xl font-black tracking-tight">
            Welcome Back
          </CardTitle>

          <CardDescription>
            Sign in to your Social Care account and keep making a difference.
          </CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col gap-7">
          {/* Login Form */}
          <form className="space-y-5" onSubmit={handleSubmit} noValidate>
            {/* Email */}
            <div>
              <Label
                htmlFor="email"
                className="font-bold text-gray-900 dark:text-gray-100"
              >
                Email
              </Label>

              <div className="relative mt-2">
                <Mail
                  size={18}
                  className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-gray-400"
                />

                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="you@example.com"
                  aria-invalid={fieldErrors.email ? true : undefined}
                  aria-describedby={
                    fieldErrors.email ? "email-error" : undefined
                  }
                  onChange={() =>
                    setFieldErrors((current) => ({
                      ...current,
                      email: undefined,
                    }))
                  }
                  className="h-12 rounded-xl border-gray-200 bg-transparent pl-11 text-sm font-medium dark:border-gray-700 dark:bg-transparent"
                />
              </div>
              {fieldErrors.email && (
                <p
                  id="email-error"
                  className="mt-1 text-xs font-semibold text-destructive"
                >
                  {fieldErrors.email}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="password"
                  className="font-bold text-gray-900 dark:text-gray-100"
                >
                  Password
                </Label>

                <Link
                  href="/forgot-password"
                  className="text-xs font-bold text-emerald-700 transition-colors hover:text-emerald-600 dark:text-emerald-400 dark:hover:text-emerald-300"
                >
                  Forgot password?
                </Link>
              </div>

              <div className="relative mt-2">
                <Lock
                  size={18}
                  className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-gray-400"
                />

                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  placeholder="Enter your password"
                  aria-invalid={fieldErrors.password ? true : undefined}
                  aria-describedby={
                    fieldErrors.password ? "password-error" : undefined
                  }
                  onChange={() =>
                    setFieldErrors((current) => ({
                      ...current,
                      password: undefined,
                    }))
                  }
                  className="h-12 rounded-xl border-gray-200 bg-transparent px-11 text-sm font-medium dark:border-gray-700 dark:bg-transparent"
                />

                <button
                  type="button"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 transition-colors hover:text-gray-600 dark:hover:text-gray-300"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {fieldErrors.password && (
                <p
                  id="password-error"
                  className="mt-1 text-xs font-semibold text-destructive"
                >
                  {fieldErrors.password}
                </p>
              )}
            </div>

            {/* Error Message */}
            {error && (
              <p role="alert" className="text-xs font-semibold text-destructive">
                {error}
              </p>
            )}

            {/* Submit */}
            <Button
              type="submit"
              disabled={submitting}
              className="h-12 w-full gap-2 rounded-xl bg-[#176B50] text-sm font-extrabold text-white shadow-md shadow-emerald-900/10 transition-all duration-200 hover:bg-[#12543E] hover:shadow-lg cursor-pointer"
            >
              Sign In
              <ArrowRight size={18} />
            </Button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4">
            <Separator className="w-auto shrink grow bg-gray-200 dark:bg-gray-700" />

            <span className="shrink-0 text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">
              Or Continue With
            </span>

            <Separator className="w-auto shrink grow bg-gray-200 dark:bg-gray-700" />
          </div>

          {/* Google Sign In */}
          <Button
            type="button"
            variant="outline"
            disabled={submitting}
            onClick={handleGoogleSignIn}
            className="h-12 w-full gap-3 rounded-xl border-gray-200 bg-white text-sm font-bold text-gray-900 shadow-sm hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-950 dark:text-white cursor-pointer dark:hover:bg-gray-800"
          >
            <FcGoogle size={20} />
            {submitting ? "Connecting to Google..." : "Continue with Google"}
          </Button>

          {/* Register Link */}
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="font-bold text-emerald-700 transition-colors hover:text-emerald-600 dark:text-emerald-400 dark:hover:text-emerald-300"
            >
              Register here
            </Link>
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
