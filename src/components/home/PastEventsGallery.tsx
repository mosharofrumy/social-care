"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

const galleryPhotos = [
  {
    src: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=900&q=80",
    alt: "Volunteers working together on a community project",
    label: "Community Action",
  },
  {
    src: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&w=900&q=80",
    alt: "Volunteers joining hands to support their community",
    label: "Volunteer Team",
  },
  {
    src: "https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=900&q=80",
    alt: "Community members sharing donated supplies",
    label: "Donation Drive",
  },
  {
    src: "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?auto=format&fit=crop&w=900&q=80",
    alt: "A volunteer supporting a community cause",
    label: "Helping Hands",
  },
];

export default function PastEventsGallery() {
  return (
    <section className="bg-gray-50 py-16 transition-colors dark:bg-gray-900 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center">
          <span className="text-sm font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
            Community Photos
          </span>

          <h2 className="mt-3 text-3xl font-black tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            Community Event Gallery
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-gray-600 dark:text-gray-400 sm:text-base">
            Moments captured from our community events.
          </p>
        </div>

        {/* Content */}
        <div className="mt-12 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {galleryPhotos.map((photo) => (
            <figure
              key={photo.label}
              className="group relative aspect-square overflow-hidden rounded-2xl border border-gray-200 shadow-sm dark:border-gray-800"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photo.src}
                alt={photo.alt}
                className="h-full w-full object-cover transition-all duration-300 group-hover:scale-110"
              />

              {/* Hover overlay */}
              <div className="absolute inset-x-0 bottom-0 flex flex-col gap-2 bg-linear-to-t from-gray-950/90 to-transparent p-4">
                <h3 className="line-clamp-2 text-sm font-extrabold text-white">
                  {photo.label}
                </h3>
                <span className="self-start rounded-full bg-emerald-500/90 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                  Social Care
                </span>
              </div>
            </figure>
          ))}
        </div>

        {/* View All */}
        <div className="mt-10 text-center">
          <Link
            href="/events"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-7 text-sm font-bold text-gray-900 transition-all duration-200 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-950 dark:text-white dark:hover:bg-gray-800"
          >
            Explore All Events
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
