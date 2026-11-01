
import Image from "next/image";
import Link from "next/link";

import {
  Mail,
  MapPin,
  Heart,
  ArrowRight,
} from "lucide-react";

import {
  FaFacebookF,
  FaInstagram,
  FaYoutube,
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-gray-50 transition-colors dark:border-gray-800 dark:bg-gray-950">
      <div className="mx-auto max-w-7xl px-4 pb-8 pt-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-12">

          {/* Brand Information */}
          <div>
            <Link href="/" className="inline-flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl shadow-md shadow-emerald-900/20">
                <Image
                  src="/sc-logo.png"
                  alt="Social Care Logo"
                  width={48}
                  height={48}
                  className="h-full w-full object-cover"
                />
              </div>

              <div>
                <h2 className="text-xl font-black tracking-tight">
                  <span className="text-[#176B50] dark:text-emerald-400">
                    Social
                  </span>{" "}
                  <span className="text-gray-900 dark:text-white">
                    Care
                  </span>
                </h2>

                <p className="mt-1 text-[9px] font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">
                  Together for Humanity
                </p>
              </div>
            </Link>

            <p className="mt-6 text-sm leading-7 text-gray-600 dark:text-gray-400">
              Social Care is a community-driven platform dedicated to
              connecting people, supporting meaningful causes, and
              creating positive changes through kindness and collaboration.
            </p>

            {/* Social Media Icons */}
            <div className="mt-6 flex items-center gap-3">
              <a
                href="https://www.facebook.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-[#1877F2] transition-all duration-300 hover:-translate-y-1 hover:border-[#1877F2] hover:bg-[#1877F2] hover:text-white dark:border-gray-800 dark:bg-gray-900"
              >
                <FaFacebookF size={19} />
              </a>

              <a
                href="https://www.instagram.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-[#E4405F] transition-all duration-300 hover:-translate-y-1 hover:border-[#E4405F] hover:bg-[#E4405F] hover:text-white dark:border-gray-800 dark:bg-gray-900"
              >
                <FaInstagram size={21} />
              </a>

              <a
                href="https://www.youtube.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-[#FF0000] transition-all duration-300 hover:-translate-y-1 hover:border-[#FF0000] hover:bg-[#FF0000] hover:text-white dark:border-gray-800 dark:bg-gray-900"
              >
                <FaYoutube size={21} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-base font-extrabold text-gray-900 dark:text-white uppercase">
              Explore Social Care
            </h3>

            <ul className="mt-6 space-y-4">
              {[
                { name: "Home", href: "/" },
                { name: "Upcoming Events", href: "/events" },
                { name: "Login", href: "/login" },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="group inline-flex items-center gap-2 text-sm text-gray-600 transition-colors hover:text-emerald-600 dark:text-gray-400 dark:hover:text-emerald-400"
                  >
                    <ArrowRight
                      size={14}
                      className="transition-transform group-hover:translate-x-1"
                    />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Our Activities */}
          <div>
            <h3 className="text-base font-extrabold text-gray-900 dark:text-white uppercase">
              Our Activities
            </h3>

            <ul className="mt-6 space-y-4">
              {[
                "Community Events",
                "Volunteer Activities",
                "Donation Support",
                "Social Awareness",
                "Education Support",
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-base font-extrabold text-gray-900 dark:text-white uppercase">
              Get In Touch
            </h3>

            <p className="mt-6 text-sm leading-7 text-gray-600 dark:text-gray-400">
              Want to become a part of our community? We would love to
              connect with you.
            </p>

            <div className="mt-5 space-y-5">

              {/* Email */}
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
                  <Mail size={17} />
                </div>

                <div>
                  <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                    Email
                  </p>

                  <p className="mt-1 text-sm font-medium text-gray-800 dark:text-gray-200">
                    socialcare@info.com
                  </p>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
                  <MapPin size={17} />
                </div>

                <div>
                  <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                    Location
                  </p>

                  <p className="mt-1 text-sm font-medium text-gray-800 dark:text-gray-200">
                    Dhaka, Bangladesh
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-gray-200 pt-7 text-center dark:border-gray-800 sm:flex-row sm:text-left">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            © {new Date().getFullYear()} Social Care. All rights reserved.
          </p>

          <p className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
            Made with
            <Heart
              size={15}
              className="fill-rose-500 text-rose-500"
            />
            for Humanity
          </p>
        </div>
      </div>
    </footer>
  );
}
