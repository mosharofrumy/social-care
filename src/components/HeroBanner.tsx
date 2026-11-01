
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Heart, HandHeart } from "lucide-react";

export default function HeroBanner() {
  return (
    <section className="relative isolate flex min-h-135 items-center overflow-hidden bg-gray-950 sm:min-h-145 lg:min-h-155">

      {/* Background Image */}
      <Image
        src="/social%20banar.png"
        alt="Social Care community"
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />

      {/* Dark Gradient Overlay */}
      <div className="absolute inset-0 z-0 bg-linear-to-r from-gray-950/90 via-gray-950/65 to-gray-950/10" />

      {/* Additional Bottom Overlay */}
      <div className="absolute inset-0 z-0 bg-linear-to-t from-gray-950/40 via-transparent to-gray-950/10" />

      {/* Content */}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-5 py-20 sm:px-8 lg:px-10">

        <div className="max-w-2xl">

          {/* Badge */}
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-emerald-300/30 bg-emerald-500/15 px-4 py-2 text-sm font-semibold text-emerald-300 backdrop-blur-md">
            <Heart size={16} className="fill-emerald-400" />
            Together for Humanity
          </div>

          {/* Heading */}
          <h1 className="text-4xl leading-tight font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
            Small Acts,
            <br />
            <span className="text-emerald-400">
              Big Changes.
            </span>
            <br />
            One Caring Community.
          </h1>

          {/* Paragraph */}
          <p className="mt-6 max-w-xl text-base leading-8 text-gray-200 sm:text-lg">
            Every act of kindness makes a difference.
            Join Social Care and be part of a community
            that believes in helping people, spreading
            hope, and creating a better tomorrow.
          </p>

          {/* Buttons */}
          <div className="mt-9 flex flex-col gap-4 sm:flex-row">

            {/* Primary Button */}
            <Link
              href="/events"
              className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-950/20 transition-all duration-300 hover:-translate-y-1 hover:bg-emerald-500 hover:shadow-emerald-500/20"
            >
              Explore Events
              <ArrowRight
                size={18}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>

            {/* Secondary Button */}
            <Link
              href="/login"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/40 bg-white/10 px-7 py-3.5 text-sm font-bold text-white backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-emerald-400 hover:bg-white/20"
            >
              <HandHeart size={19} />
              Join Our Community
            </Link>

          </div>
        </div>
      </div>
    </section>
  );
}
