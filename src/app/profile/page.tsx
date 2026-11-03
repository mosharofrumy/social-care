"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Check, LoaderCircle } from "lucide-react";

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
import { authClient } from "@/lib/auth-client";
import { isValidHttpUrl } from "@/lib/validation";
import { toast } from "sonner";

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user ?? null;

  const [edits, setEdits] = React.useState<{
    name?: string;
    photoUrl?: string;
  }>({});
  const [saving, setSaving] = React.useState(false);
  const [success, setSuccess] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = React.useState<
    Partial<Record<"name" | "photoUrl", string>>
  >({});

  // Signed-out visitors can't edit a profile.
  React.useEffect(() => {
    if (!isPending && !user) {
      router.replace("/login");
    }
  }, [isPending, user, router]);

  // Local edits take priority over the session values; untouched
  // fields fall back to whatever the session currently holds.
  const name = edits.name ?? user?.name ?? "";
  const photoUrl = edits.photoUrl ?? user?.image ?? "";

  const setName = (value: string) => {
    setEdits((prev) => ({ ...prev, name: value }));
    setFieldErrors((current) => ({ ...current, name: undefined }));
  };

  const setPhotoUrl = (value: string) => {
    setEdits((prev) => ({ ...prev, photoUrl: value }));
    setFieldErrors((current) => ({ ...current, photoUrl: undefined }));
  };

  const showPhotoPreview = isValidHttpUrl(photoUrl);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSuccess(null);
    setError(null);

    const errors: Partial<Record<"name" | "photoUrl", string>> = {};
    if (name.trim().length < 2) {
      errors.name = "Enter your name using at least 2 characters.";
    }
    if (photoUrl.trim() && !isValidHttpUrl(photoUrl)) {
      errors.photoUrl = "Enter a valid http(s) profile photo URL.";
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setFieldErrors({});
    setSaving(true);

    const { data, error: updateError } = await authClient.updateUser({
      name: name.trim(),
      image: photoUrl.trim() || undefined,
    });

    setSaving(false);

    if (data) {
      // Drop local edits so the form falls back to the freshly
      // revalidated session values.
      setEdits({});
      setSuccess("Profile updated successfully.");
      toast.success("Profile updated successfully.");
    } else if (updateError) {
      setError(
        updateError.message ??
          "Something went wrong while updating your profile. Please try again.",
      );
    }
  }

  return (
    <main className="flex-1 bg-gray-50 px-4 py-12 transition-colors dark:bg-gray-950 sm:px-6 sm:py-16">
      <Card className="mx-auto w-full max-w-md gap-6 rounded-3xl px-6 py-10 shadow-xl shadow-emerald-900/5 sm:px-10">
        {/* Heading */}
        <CardHeader className="justify-items-center text-center">
          {/* Photo Preview */}
          {showPhotoPreview ? (
            <Image
              src={photoUrl.trim()}
              alt="Your profile"
              width={80}
              height={80}
              unoptimized
              className="h-20 w-20 rounded-full border border-gray-200 object-cover shadow-md shadow-emerald-900/10 dark:border-gray-700"
            />
          ) : (
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-2xl font-black text-[#176B50] dark:bg-emerald-950 dark:text-emerald-400">
              {(user?.name ?? "").trim().charAt(0).toUpperCase() || "?"}
            </div>
          )}

          <CardTitle className="mt-2 text-3xl font-black tracking-tight">
            Update Profile
          </CardTitle>

          <CardDescription>
            Update your display name and profile picture. The picture accepts an
            image URL.
          </CardDescription>

          <Link
            href="/"
            className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 transition-colors hover:text-emerald-600 dark:text-emerald-400 dark:hover:text-emerald-300"
          >
            <ArrowLeft size={14} />
            Back to Home
          </Link>
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

              <Input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                value={name}
                onChange={(event) => setName(event.target.value)}
                aria-invalid={fieldErrors.name ? true : undefined}
                aria-describedby={fieldErrors.name ? "name-error" : undefined}
                placeholder="Your full name"
                className="mt-2 h-12 rounded-xl border-gray-200 bg-gray-50 text-sm font-medium dark:border-gray-700 dark:bg-input/30"
              />
              {fieldErrors.name && (
                <p
                  id="name-error"
                  className="mt-1 text-xs font-semibold text-destructive"
                >
                  {fieldErrors.name}
                </p>
              )}
            </div>

            {/* Profile Picture URL */}
            <div>
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="photo-url"
                  className="font-bold text-gray-900 dark:text-gray-100"
                >
                  Profile Picture
                </Label>

                <span className="text-xs font-medium text-gray-400 dark:text-gray-500">
                  Image URL
                </span>
              </div>

              <Input
                id="photo-url"
                name="photoUrl"
                type="url"
                autoComplete="off"
                value={photoUrl}
                onChange={(event) => setPhotoUrl(event.target.value)}
                aria-invalid={fieldErrors.photoUrl ? true : undefined}
                aria-describedby={
                  fieldErrors.photoUrl ? "photo-url-error" : undefined
                }
                placeholder="https://example.com/photo.jpg"
                className="mt-2 h-12 rounded-xl border-gray-200 bg-gray-50 text-sm font-medium dark:border-gray-700 dark:bg-input/30"
              />
              {fieldErrors.photoUrl && (
                <p
                  id="photo-url-error"
                  className="mt-1 text-xs font-semibold text-destructive"
                >
                  {fieldErrors.photoUrl}
                </p>
              )}
            </div>

            {/* Messages */}
            {success && (
              <p
                role="status"
                className="flex items-center gap-1.5 text-sm font-semibold text-emerald-700 dark:text-emerald-400"
              >
                <Check size={15} strokeWidth={3} />
                {success}
              </p>
            )}
            {error && (
              <p
                role="alert"
                className="text-sm font-semibold text-destructive"
              >
                {error}
              </p>
            )}

            {/* Save */}
            <Button
              type="submit"
              disabled={saving}
              className="h-12 w-full gap-2 rounded-xl bg-[#176B50] text-sm font-extrabold text-white shadow-md shadow-emerald-900/10 transition-all duration-200 hover:bg-[#12543E] hover:shadow-lg"
            >
              {saving && <LoaderCircle size={18} className="animate-spin" />}
              {saving ? "Saving Changes" : "Save Changes"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
