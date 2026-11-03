"use client";

import * as React from "react";
import { CalendarPlus, ChevronDown, MapPin, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { todayISO } from "@/lib/api";
import { isValidHttpUrl } from "@/lib/validation";
import type {
  EventBadge,
  EventFieldErrors,
  EventFormProps,
  EventTypeValue,
} from "@/types";
import { EVENT_BADGES, EVENT_TYPES } from "@/types";

export default function EventForm({
  initialValues,
  submitting,
  requestError,
  submitLabel,
  submittingLabel,
  onSubmit,
}: EventFormProps) {
  const [badge, setBadge] = React.useState<string>(
    initialValues?.badge ?? "New"
  );
  const [title, setTitle] = React.useState(initialValues?.title ?? "");
  const [type, setType] = React.useState<string>(initialValues?.type ?? "");
  const [date, setDate] = React.useState(initialValues?.date ?? "");
  const [thumbnailUrl, setThumbnailUrl] = React.useState(
    initialValues?.thumbnailUrl ?? ""
  );
  const [location, setLocation] = React.useState(
    initialValues?.location ?? ""
  );
  const [volunteersNeeded, setVolunteersNeeded] = React.useState(
    initialValues?.volunteersNeeded
      ? String(initialValues.volunteersNeeded)
      : ""
  );
  const [description, setDescription] = React.useState(
    initialValues?.description ?? ""
  );

  const [fieldErrors, setFieldErrors] = React.useState<EventFieldErrors>({});

  const minDate = todayISO();
  const isThumbnailValid = isValidHttpUrl(thumbnailUrl);

  function clearFieldError(field: keyof EventFieldErrors) {
    setFieldErrors((current) => {
      const next = { ...current };
      delete next[field];
      return next;
    });
  }

  function validate(): EventFieldErrors {
    const errors: EventFieldErrors = {};

    if (!EVENT_BADGES.some((option) => option === badge)) {
      errors.badge = "Please choose a badge for your event.";
    }

    if (title.trim().length < 3) {
      errors.title = "Event title must be at least 3 characters long.";
    }

    if (!EVENT_TYPES.some((option) => option === type)) {
      errors.type = "Please choose an event type from the dropdown.";
    }

    if (!date) {
      errors.date = "Please pick the event date.";
    } else if (
      !/^\d{4}-\d{2}-\d{2}$/.test(date) ||
      Number.isNaN(Date.parse(date)) ||
      new Date(`${date}T00:00:00.000Z`).toISOString().slice(0, 10) !== date
    ) {
      errors.date = "Please enter a valid event date.";
    } else if (date < minDate) {
      errors.date =
        "Event date must be today or a future date — past dates are not allowed.";
    }

    if (!isValidHttpUrl(thumbnailUrl)) {
      errors.thumbnailUrl =
        "Thumbnail image URL must be a valid http(s) image link.";
    }

    if (
      volunteersNeeded.trim() &&
      (!Number.isSafeInteger(Number(volunteersNeeded)) ||
        Number(volunteersNeeded) < 1)
    ) {
      errors.volunteersNeeded =
        "Enter a whole number of volunteers greater than zero.";
    }

    if (description.trim().length < 10) {
      errors.description =
        "Please write a short description (at least 10 characters).";
    }

    return errors;
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setFieldErrors({});
    // Validation guarantees badge/type came from the dropdowns —
    // narrow the string state to the allowed unions at the boundary.
    onSubmit({
      title: title.trim(),
      type: type as EventTypeValue,
      badge: badge as EventBadge,
      date,
      thumbnailUrl: thumbnailUrl.trim(),
      description: description.trim(),
      location: location.trim(),
      volunteersNeeded: Number(volunteersNeeded) || 0,
    });
  }

  const inputClasses =
    "mt-2 h-12 rounded-xl border-gray-200 bg-gray-50 text-sm font-medium dark:border-gray-700 dark:bg-input/30";
  const selectClasses = cn(
    "mt-2 h-12 w-full appearance-none rounded-xl border border-gray-200 bg-gray-50 px-4 text-sm font-medium text-gray-900 outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:border-gray-700 dark:bg-input/30 dark:text-white",
    // Keep native dropdown popups (OS-rendered) in sync with the theme:
    // color-scheme dark restyles the popup + picker, and explicit option
    // colors guarantee readable text on Chromium/Windows.
    "cursor-pointer dark:[color-scheme:dark]",
    "[&>option]:bg-white [&>option]:text-gray-900 dark:[&>option]:bg-gray-950 dark:[&>option]:text-gray-100"
  );

  return (
    <form className="space-y-5" onSubmit={handleSubmit} noValidate>
      {requestError && (
        <p
          role="alert"
          className="rounded-xl bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700 dark:bg-rose-950/50 dark:text-rose-400"
        >
          {requestError}
        </p>
      )}

      {/* Badge */}
      <div>
        <Label
          htmlFor="badge"
          className="font-bold text-gray-900 dark:text-gray-100"
        >
          Event Badge
        </Label>

        <div className="relative">
          <select
            id="badge"
            name="badge"
            value={badge}
            onChange={(event) => {
              setBadge(event.target.value);
              clearFieldError("badge");
            }}
            aria-invalid={fieldErrors.badge ? true : undefined}
            aria-describedby={fieldErrors.badge ? "badge-error" : undefined}
            className={selectClasses}
          >
            {EVENT_BADGES.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <ChevronDown
            size={16}
            className="pointer-events-none absolute top-1/2 right-4 mt-2 -translate-y-1/2 text-gray-400"
          />
        </div>
        {fieldErrors.badge && (
          <p id="badge-error" className="mt-1 text-xs font-semibold text-destructive">
            {fieldErrors.badge}
          </p>
        )}
      </div>

      {/* Title */}
      <div>
        <Label
          htmlFor="title"
          className="font-bold text-gray-900 dark:text-gray-100"
        >
          Event Title
        </Label>

        <Input
          id="title"
          name="title"
          type="text"
          required
          value={title}
          onChange={(event) => {
            setTitle(event.target.value);
            clearFieldError("title");
          }}
          aria-invalid={fieldErrors.title ? true : undefined}
          aria-describedby={fieldErrors.title ? "title-error" : undefined}
          placeholder="e.g. Winter Clothing Drive in Dhaka"
          className={cn(inputClasses, "mt-2")}
        />
        {fieldErrors.title && (
          <p id="title-error" className="mt-1 text-xs font-semibold text-destructive">
            {fieldErrors.title}
          </p>
        )}
      </div>

      {/* Type */}
      <div>
        <Label
          htmlFor="type"
          className="font-bold text-gray-900 dark:text-gray-100"
        >
          Event Type
        </Label>

        <div className="relative">
          <select
            id="type"
            name="type"
            required
            value={type}
            onChange={(event) => {
              setType(event.target.value);
              clearFieldError("type");
            }}
            aria-invalid={fieldErrors.type ? true : undefined}
            aria-describedby={fieldErrors.type ? "type-error" : undefined}
            className={cn(
              selectClasses,
              !type && "text-gray-400 dark:text-gray-500"
            )}
          >
            <option value="" disabled>
              Select event type
            </option>
            {EVENT_TYPES.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <ChevronDown
            size={16}
            className="pointer-events-none absolute top-1/2 right-4 mt-2 -translate-y-1/2 text-gray-400"
          />
        </div>
        {fieldErrors.type && (
          <p id="type-error" className="mt-1 text-xs font-semibold text-destructive">
            {fieldErrors.type}
          </p>
        )}
      </div>

      {/* Date */}
      <div>
        <Label
          htmlFor="date"
          className="font-bold text-gray-900 dark:text-gray-100"
        >
          Event Date
        </Label>

        <Input
          id="date"
          name="date"
          type="date"
          required
          min={minDate}
          value={date}
          onChange={(event) => {
            setDate(event.target.value);
            clearFieldError("date");
          }}
          aria-invalid={fieldErrors.date ? true : undefined}
          aria-describedby={fieldErrors.date ? "date-error" : undefined}
          className={cn(inputClasses, "mt-2 dark:[color-scheme:dark]")}
        />
        {fieldErrors.date && (
          <p id="date-error" className="mt-1 text-xs font-semibold text-destructive">
            {fieldErrors.date}
          </p>
        )}
      </div>

      {/* Thumbnail */}
      <div>
        <Label
          htmlFor="thumbnail"
          className="font-bold text-gray-900 dark:text-gray-100"
        >
          Thumbnail Event Image URL
        </Label>

        <Input
          id="thumbnail"
          name="thumbnailUrl"
          type="url"
          required
          value={thumbnailUrl}
          onChange={(event) => {
            setThumbnailUrl(event.target.value);
            clearFieldError("thumbnailUrl");
          }}
          aria-invalid={fieldErrors.thumbnailUrl ? true : undefined}
          aria-describedby={
            fieldErrors.thumbnailUrl ? "thumbnail-error" : undefined
          }
          placeholder="https://example.com/event-banner.jpg"
          className={cn(inputClasses, "mt-2")}
        />
        {fieldErrors.thumbnailUrl && (
          <p id="thumbnail-error" className="mt-1 text-xs font-semibold text-destructive">
            {fieldErrors.thumbnailUrl}
          </p>
        )}

        {isThumbnailValid && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={thumbnailUrl.trim()}
            alt="Event thumbnail preview"
            className="mt-3 h-36 w-full rounded-xl border border-gray-200 object-cover shadow-sm dark:border-gray-700"
          />
        )}
      </div>

      {/* Location */}
      <div>
        <Label
          htmlFor="location"
          className="font-bold text-gray-900 dark:text-gray-100"
        >
          <MapPin size={14} />
          Location
        </Label>

        <Input
          id="location"
          name="location"
          type="text"
          value={location}
          onChange={(event) => setLocation(event.target.value)}
          placeholder="e.g. Dhaka, Bangladesh"
          className={cn(inputClasses, "mt-2")}
        />
      </div>

      {/* Volunteers */}
      <div>
        <Label
          htmlFor="volunteers"
          className="flex gap-1.5 font-bold text-gray-900 dark:text-gray-100"
        >
          <Users size={14} />
          Volunteers Needed
        </Label>

        <Input
          id="volunteers"
          name="volunteersNeeded"
          type="number"
          min={1}
          value={volunteersNeeded}
          onChange={(event) => {
            setVolunteersNeeded(event.target.value);
            clearFieldError("volunteersNeeded");
          }}
          aria-invalid={fieldErrors.volunteersNeeded ? true : undefined}
          aria-describedby={
            fieldErrors.volunteersNeeded ? "volunteers-error" : undefined
          }
          placeholder="e.g. 25"
          className={cn(inputClasses, "mt-2")}
        />
        {fieldErrors.volunteersNeeded && (
          <p
            id="volunteers-error"
            className="mt-1 text-xs font-semibold text-destructive"
          >
            {fieldErrors.volunteersNeeded}
          </p>
        )}
      </div>

      {/* Description */}
      <div>
        <Label
          htmlFor="description"
          className="font-bold text-gray-900 dark:text-gray-100"
        >
          Description
        </Label>

        <textarea
          id="description"
          name="description"
          required
          rows={4}
          value={description}
          onChange={(event) => {
            setDescription(event.target.value);
            clearFieldError("description");
          }}
          aria-invalid={fieldErrors.description ? true : undefined}
          aria-describedby={
            fieldErrors.description ? "description-error" : undefined
          }
          placeholder="Describe the event: what will happen, who can join, what to bring..."
          className="mt-2 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:border-gray-700 dark:bg-input/30 dark:text-white"
        />
        {fieldErrors.description && (
          <p id="description-error" className="mt-1 text-xs font-semibold text-destructive">
            {fieldErrors.description}
          </p>
        )}
      </div>

      {/* Submit */}
      <Button
        type="submit"
        disabled={submitting}
        className="h-12 w-full gap-2 rounded-xl bg-[#176B50] text-sm font-extrabold text-white shadow-md shadow-emerald-900/10 transition-all duration-200 hover:bg-[#12543E] hover:shadow-lg"
      >
        <CalendarPlus size={18} />
        {submitting ? submittingLabel : submitLabel}
      </Button>
    </form>
  );
}
