"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Check,
  Eye,
  EyeOff,
  ImagePlus,
  Lock,
  Mail,
  User,
  X,
} from "lucide-react";
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
import { cn } from "@/lib/utils";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { isValidEmail, isValidHttpUrl } from "@/lib/validation";
import { toast } from "sonner";

const passwordRules = [
  {
    label: "At least one uppercase letter (A-Z)",
    test: (value: string) => /[A-Z]/.test(value),
  },
  {
    label: "At least one lowercase letter (a-z)",
    test: (value: string) => /[a-z]/.test(value),
  },
  {
    label: "At least 8 characters",
    test: (value: string) => value.length >= 8,
  },
  {
    label: "No more than 128 characters",
    test: (value: string) => value.length <= 128,
  },
] as const;

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = React.useState(false);
  const [password, setPassword] = React.useState("");
  const [photoUrl, setPhotoUrl] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = React.useState<
    Partial<Record<"name" | "email" | "password" | "photoUrl", string>>
  >({});
  // Refetching the shared session store guarantees the navbar
  // receives the user (including the photo) on first registration/sign-in.
  const { refetch: refetchSession } = authClient.useSession();

  const showPhotoPreview = isValidHttpUrl(photoUrl);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const submittedPassword = String(formData.get("password") ?? "");
    const submittedPhotoUrl = String(formData.get("photoUrl") ?? "").trim();
    const errors: Partial<
      Record<"name" | "email" | "password" | "photoUrl", string>
    > = {};

    if (name.length < 2) {
      errors.name = "Enter your name using at least 2 characters.";
    }
    if (!isValidEmail(email)) {
      errors.email = "Enter a valid email address.";
    }
    if (!passwordRules.every((rule) => rule.test(submittedPassword))) {
      errors.password =
        "Your password must be 8–128 characters and include uppercase and lowercase letters.";
    }
    if (submittedPhotoUrl && !isValidHttpUrl(submittedPhotoUrl)) {
      errors.photoUrl = "Enter a valid http(s) profile photo URL.";
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setFieldErrors({});
    setSubmitting(true);
    setError(null);

    // Better Auth stores the avatar on the built-in "image" user field.
    const profileImage = submittedPhotoUrl || undefined;

    const { data, error } = await authClient.signUp.email({
      name,
      email,
      password: submittedPassword,
      image: profileImage,
    });

    if (data) {
      toast.success("Your account has been created successfully.");
      await refetchSession();
      router.replace("/");
    }
    else if (error) {
      setError(
        error.message ??
          "Registration failed. Please check your details and try again."
      );
    }

    setSubmitting(false);
  }

  const handleGoogleSignUp = async () => {
    setSubmitting(true);
    setError(null);

    try {
      const { error } = await authClient.signIn.social({
        provider: "google",
        callbackURL: "/",
        newUserCallbackURL: "/",
      });

      if (error) {
        setError(error.message ?? "Google sign-up failed. Please try again.");
      }
    } catch {
      setError("Unable to start Google sign-up. Please try again.");
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
            Create Account
          </CardTitle>

          <CardDescription>
            Join Social Care and start making a difference in your community.
          </CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col gap-7">
          <form className="space-y-5" onSubmit={handleSubmit} noValidate>
            {/* Full Name */}
            <div>
              <Label
                htmlFor="name"
                className="font-bold text-gray-900 dark:text-gray-100"
              >
                Full Name
              </Label>

              <div className="relative mt-2">
                <User
                  size={18}
                  className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-gray-400"
                />

                <Input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  placeholder="Your full name"
                  aria-invalid={fieldErrors.name ? true : undefined}
                  aria-describedby={fieldErrors.name ? "name-error" : undefined}
                  onChange={() =>
                    setFieldErrors((current) => ({
                      ...current,
                      name: undefined,
                    }))
                  }
                  className="h-12 rounded-xl border-gray-200 bg-transparent pl-11 text-sm font-medium dark:border-gray-700 dark:bg-transparent"
                />
              </div>
              {fieldErrors.name && (
                <p
                  id="name-error"
                  className="mt-1 text-xs font-semibold text-destructive"
                >
                  {fieldErrors.name}
                </p>
              )}
            </div>

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
              <Label
                htmlFor="password"
                className="font-bold text-gray-900 dark:text-gray-100"
              >
                Password
              </Label>

              <div className="relative mt-2">
                <Lock
                  size={18}
                  className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-gray-400"
                />

                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  value={password}
                  aria-invalid={fieldErrors.password ? true : undefined}
                  aria-describedby={
                    fieldErrors.password ? "password-error" : "password-rules"
                  }
                  onChange={(event) => {
                    setPassword(event.target.value);
                    setFieldErrors((current) => ({
                      ...current,
                      password: undefined,
                    }));
                  }}
                  placeholder="Create a password"
                  className={cn(
                    "h-12 rounded-xl border-gray-200 bg-transparent px-11 text-sm font-medium dark:border-gray-700 dark:bg-transparent",
                    fieldErrors.password &&
                      "border-destructive ring-destructive/20 dark:border-destructive/50",
                  )}
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

              {/* Password Requirements */}
              <ul
                id="password-rules"
                aria-label="Password requirements"
                className="mt-3 space-y-1.5"
              >
                {passwordRules.map((rule) => {
                  const isValid = rule.test(password);

                  return (
                    <li
                      key={rule.label}
                      className={cn(
                        "flex items-center gap-2 text-xs transition-colors",
                        isValid
                          ? "font-semibold text-emerald-700 dark:text-emerald-400"
                          : "text-gray-500 dark:text-gray-400",
                      )}
                    >
                      <span
                        className={cn(
                          "flex h-4 w-4 shrink-0 items-center justify-center rounded-full",
                          isValid
                            ? "bg-emerald-100 dark:bg-emerald-950"
                            : "bg-gray-100 dark:bg-gray-800",
                        )}
                      >
                        {isValid ? (
                          <Check size={11} strokeWidth={3} />
                        ) : (
                          <X size={11} strokeWidth={3} />
                        )}
                      </span>
                      {rule.label}
                    </li>
                  );
                })}
              </ul>

              {fieldErrors.password && (
                <p
                  id="password-error"
                  role="alert"
                  className="mt-2 text-xs font-semibold text-destructive"
                >
                  {fieldErrors.password}
                </p>
              )}
            </div>

            {/* Profile Photo (Optional) */}
            <div>
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="photo-url"
                  className="font-bold text-gray-900 dark:text-gray-100"
                >
                  Profile Photo
                </Label>

                <span className="text-xs font-medium text-gray-400 dark:text-gray-500">
                  Optional
                </span>
              </div>

              <div className="relative mt-2">
                <ImagePlus
                  size={18}
                  className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-gray-400"
                />

                <Input
                  id="photo-url"
                  name="photoUrl"
                  type="url"
                  autoComplete="off"
                  value={photoUrl}
                  onChange={(event) => {
                    setPhotoUrl(event.target.value);
                    setFieldErrors((current) => ({
                      ...current,
                      photoUrl: undefined,
                    }));
                  }}
                  aria-invalid={fieldErrors.photoUrl ? true : undefined}
                  aria-describedby={
                    fieldErrors.photoUrl ? "photo-url-error" : undefined
                  }
                  onBlur={() => {
                    if (photoUrl.trim() && !isValidHttpUrl(photoUrl)) {
                      setFieldErrors((current) => ({
                        ...current,
                        photoUrl: "Enter a valid http(s) profile photo URL.",
                      }));
                    }
                  }}
                  placeholder="https://example.com/photo.jpg"
                  className="h-12 rounded-xl border-gray-200 bg-transparent pl-11 text-sm font-medium dark:border-gray-700 dark:bg-transparent"
                />
              </div>
              {fieldErrors.photoUrl && (
                <p
                  id="photo-url-error"
                  className="mt-1 text-xs font-semibold text-destructive"
                >
                  {fieldErrors.photoUrl}
                </p>
              )}

              {/* Photo Preview */}
              {showPhotoPreview && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={photoUrl.trim()}
                  alt="Profile photo preview"
                  className="mt-3 h-16 w-16 rounded-full border border-gray-200 object-cover shadow-sm dark:border-gray-700"
                />
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
              className="h-12 w-full gap-2 rounded-xl bg-[#176B50] text-sm font-extrabold text-white shadow-md shadow-emerald-900/10 transition-all duration-200 hover:bg-[#12543E] hover:shadow-lg"
            >
              {submitting ? "Creating Account..." : "Create Account"}
            </Button>
          </form>

          <div className="flex items-center gap-4">
            <Separator className="w-auto shrink grow bg-gray-200 dark:bg-gray-700" />
            <span className="shrink-0 text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">
              Or Sign Up With
            </span>
            <Separator className="w-auto shrink grow bg-gray-200 dark:bg-gray-700" />
          </div>

          <Button
            type="button"
            variant="outline"
            disabled={submitting}
            onClick={handleGoogleSignUp}
            className="h-12 w-full gap-3 rounded-xl border-gray-200 bg-white text-sm font-bold text-gray-900 shadow-sm hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-950 dark:text-white dark:hover:bg-gray-800"
          >
            <FcGoogle size={20} />
            {submitting ? "Connecting to Google..." : "Sign up with Google"}
          </Button>

          {/* Login Link */}
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-bold text-emerald-700 transition-colors hover:text-emerald-600 dark:text-emerald-400 dark:hover:text-emerald-300"
            >
              Sign in here
            </Link>
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
