"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  CalendarCheck,
  CalendarDays,
  CalendarPlus,
  ChevronDown,
  ChevronUp,
  ListChecks,
  LogIn,
  LogOut,
} from "lucide-react";

import ThemeToggle from "@/components/ThemeToggling";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

const eventMenuItems = [
  { label: "Create Event", href: "/events/create", icon: CalendarPlus },
  { label: "Manage Events", href: "/events/manage", icon: ListChecks },
  { label: "Joined Events", href: "/events/joined", icon: CalendarCheck },
] as const;

const Navbar = () => {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [menuOpen, setMenuOpen] = React.useState(false);
  const user = session?.user ?? null;

  if (isPending) {
    return (
      <header className="sticky top-0 z-50 w-full border-b border-gray-200/70 bg-white/85 shadow-sm backdrop-blur-xl transition-colors dark:border-gray-800 dark:bg-gray-950/85">
        <nav className="mx-auto flex h-19 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div />
          <div className="flex items-center gap-3">
            <div className="size-9 animate-pulse rounded-full bg-gray-200 dark:bg-gray-800" />
            <div className="h-11 w-24 animate-pulse rounded-xl bg-gray-200 dark:bg-gray-800" />
          </div>
        </nav>
      </header>
    );
  }

  async function handleLogout() {
    try {
      const { error } = await authClient.signOut();
      if (error) {
        toast.error(error.message || "Could not log out. Please try again.");
        return;
      }

      toast.success("You have been logged out.");
      router.replace("/");
      router.refresh();
    } catch {
      toast.error("Could not log out. Please try again.");
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200/70 bg-white/85 shadow-sm backdrop-blur-xl transition-colors dark:border-gray-800 dark:bg-gray-950/85">
      <nav className="mx-auto flex h-19 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo and Brand */}
        <Link href="/" className="group flex shrink-0 items-center gap-3">
          {/* Logo */}
          <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl shadow-md shadow-emerald-900/20 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-emerald-800/30">
            <Image
              src="/sc-logo.png"
              alt="Social Care Logo"
              width={48}
              height={48}
              priority
              className="h-full w-full object-cover transition-all duration-300 group-hover:scale-110"
            />
          </div>

          {/* Brand Name */}
          <div className="flex flex-col leading-none">
            <span className="text-[25px] font-black tracking-tight">
              <span className="text-[#176B50] dark:text-emerald-400">
                Social
              </span>{" "}
              <span className="text-gray-900 dark:text-white">Care</span>
            </span>

            <span className="mt-1.5 text-[9px] font-bold uppercase tracking-[0.22em] text-gray-500 dark:text-gray-400">
              Together for Humanity
            </span>
          </div>
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex md:items-center">
          <Link
            href="/events"
            className="group flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-bold text-gray-600 transition-all duration-200 hover:bg-emerald-50 hover:text-[#176B50] dark:text-gray-300 dark:hover:bg-emerald-950/50 dark:hover:text-emerald-400"
          >
            <CalendarDays
              size={19}
              className="transition-transform duration-200 group-hover:scale-110"
            />
            Upcoming Events
          </Link>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          <ThemeToggle />

          {user ? (
            <Popover
              open={menuOpen}
              onOpenChange={(open) => setMenuOpen(open)}
            >
              <PopoverTrigger
                aria-label="Open profile menu"
                aria-expanded={menuOpen}
                className="relative rounded-full outline-none transition-shadow focus-visible:ring-2 focus-visible:ring-emerald-500/50 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-950"
              >
                <Avatar size="lg">
                  {user.image && (
                    <AvatarImage
                      referrerPolicy="no-referrer"
                      src={user.image}
                    />
                  )}
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>

                {/* Chevrons replace the green status dot:
                    down arrow when closed, up arrow when open. */}
                <span
                  data-slot="chevron"
                  className="absolute right-0 bottom-0 z-10 flex h-4 w-4 items-center justify-center rounded-full bg-gray-600 text-white text-2xl shadow-md transition-colors "
                >
                  {menuOpen ? (
                    <ChevronUp size={12} strokeWidth={3} />
                  ) : (
                    <ChevronDown size={12} strokeWidth={3} />
                  )}
                </span>
              </PopoverTrigger>

              <PopoverContent align="end" className="w-72">
                {/* Clickable profile header -> /profile (update name & picture) */}
                <Link
                  href="/profile"
                  className="flex items-center gap-3 rounded-xl p-2 transition-colors hover:bg-emerald-50 dark:hover:bg-emerald-950/50"
                >
                  <Avatar size="lg">
                    {user.image && (
                      <AvatarImage
                        referrerPolicy="no-referrer"
                        src={user.image}
                      />
                    )}
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>

                  <div className="min-w-0 flex-1">
                    <PopoverTitle className="truncate font-bold text-gray-900 dark:text-white">
                      {user.name}
                    </PopoverTitle>
                    <PopoverDescription className="truncate text-xs">
                      {user.email}
                    </PopoverDescription>
                  </div>
                </Link>

                {/* Event Actions */}
                <div className="flex flex-col gap-1 pt-1">
                  {eventMenuItems.map((item) => {
                    const Icon = item.icon;

                    return (
                      <Link
                        key={item.label}
                        href={item.href}
                        className="flex items-center gap-2.5 rounded-lg px-2 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-emerald-50 hover:text-[#176B50] dark:text-gray-200 dark:hover:bg-emerald-950/50 dark:hover:text-emerald-400"
                      >
                        <Icon size={16} />
                        {item.label}
                      </Link>
                    );
                  })}
                </div>

                {/* Sign Out */}
                <div className="border-t border-gray-200 pt-1 dark:border-gray-700">
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-2 py-2 text-left text-sm font-semibold text-gray-700 transition-colors hover:bg-rose-50 hover:text-rose-700 dark:text-gray-200 dark:hover:bg-rose-950/50 dark:hover:text-rose-400"
                  >
                    <LogOut size={16} />
                    Log Out
                  </button>
                </div>
              </PopoverContent>
            </Popover>
          ) : (
            /* Login Button */
            <Link
              href="/login"
              className="inline-flex h-11 items-center gap-2 rounded-xl bg-[#176B50] px-5 text-sm font-extrabold text-white shadow-md shadow-emerald-900/10 transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#12543E] hover:shadow-lg active:translate-y-0"
            >
              <LogIn size={18} />
              <span>Login</span>
            </Link>
          )}
        </div>
      </nav>

      {/* Mobile Navigation */}
      <div className="border-t border-gray-100 px-4 py-2 dark:border-gray-800 md:hidden">
        <Link
          href="/events"
          className="flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-bold text-gray-600 transition-colors hover:bg-emerald-50 hover:text-[#176B50] dark:text-gray-300 dark:hover:bg-emerald-950/50 dark:hover:text-emerald-400"
        >
          <CalendarDays size={18} />
          Upcoming Events
        </Link>
      </div>
    </header>
  );
};

export default Navbar;
