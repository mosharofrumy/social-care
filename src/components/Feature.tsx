
import {
  Users,
  CalendarDays,
  Heart,
  HandHeart,
  ShieldCheck,
  Globe2,
  Megaphone,
  GraduationCap,
  type LucideIcon,
} from "lucide-react";

// Static Statistics Data
const statistics = [
  {
    title: "Total Volunteers",
    value: "5,250+",
    icon: Users,
    color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400",
  },
  {
    title: "Events Organized",
    value: "285+",
    icon: CalendarDays,
    color: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400",
  },
  {
    title: "Lives Impacted",
    value: "25,000+",
    icon: Heart,
    color: "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-400",
  },
  {
    title: "Total Donations",
    value: "8,95,000+",
    icon: HandHeart,
    color: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400",
  },
];

// Feature Data
const features: {
  title: string;
  description: string;
  icon: LucideIcon;
}[] = [
  {
    title: "Community Events",
    description:
      "Discover and participate in meaningful community events and social activities.",
    icon: CalendarDays,
  },
  {
    title: "Volunteer Management",
    description:
      "Connect with passionate volunteers and make a positive difference together.",
    icon: Users,
  },
  {
    title: "Donation Support",
    description:
      "Support meaningful causes and help people who need assistance.",
    icon: HandHeart,
  },
  {
    title: "Community Awareness",
    description:
      "Spread awareness about important social issues and inspire positive change.",
    icon: Megaphone,
  },
  {
    title: "Safe Community",
    description:
      "Build a trusted and supportive environment where everyone feels welcome.",
    icon: ShieldCheck,
  },
  {
    title: "Education Support",
    description:
      "Help create learning opportunities and a brighter future for everyone.",
    icon: GraduationCap,
  },
  {
    title: "Social Impact",
    description:
      "Work together to create lasting improvements in people's lives.",
    icon: Globe2,
  },
  {
    title: "Make a Difference",
    description:
      "Turn small acts of kindness into meaningful changes in society.",
    icon: Heart,
  },
];

export default function Feature() {
  return (
    <>
      {/* Statistics Section */}
      <section className="bg-white py-16 transition-colors dark:bg-gray-950 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <div className="mb-10 text-center">
            <span className="text-sm font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
              Our Impact
            </span>

            <h2 className="mt-3 text-3xl font-black tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Together We Make a Difference
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-gray-600 dark:text-gray-400 sm:text-base">
              Every contribution, every volunteer, and every
              initiative brings us closer to a better community.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {statistics.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="group rounded-2xl border border-gray-200 bg-gray-50 p-3 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-300 hover:bg-white hover:shadow-xl hover:shadow-emerald-900/5 dark:border-gray-800 dark:bg-gray-900 dark:hover:border-emerald-800 dark:hover:bg-gray-900"
                >
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${item.color}`}>
                    <Icon size={24} />
                  </div>

                  <h3 className="mt-5 text-3xl font-black tracking-tight text-gray-900 dark:text-white">
                    {item.value}
                  </h3>

                  <p className="mt-2 text-sm font-semibold text-gray-500 dark:text-gray-400">
                    {item.title}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-50 py-16 transition-colors dark:bg-gray-900 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          {/* Section Heading */}
          <div className="mb-12 text-center">
            <span className="text-sm font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
              What We Do
            </span>

            <h2 className="mt-3 text-3xl font-black tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Explore Our Features
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-gray-600 dark:text-gray-400 sm:text-base">
              Everything you need to connect, contribute,
              participate, and make a meaningful impact.
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <div
                  key={feature.title}
                  className="group relative rounded-2xl border border-gray-200 bg-white p-6 transition-all duration-300 hover:-translate-y-2 hover:border-emerald-300 hover:shadow-xl hover:shadow-emerald-900/5 dark:border-gray-800 dark:bg-gray-950 dark:hover:border-emerald-800"
                >
                  {/* Icon */}
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 transition-all duration-300 group-hover:bg-emerald-600 group-hover:text-white dark:bg-emerald-950/60 dark:text-emerald-400 dark:group-hover:bg-emerald-600 dark:group-hover:text-white">
                    <Icon size={27} strokeWidth={1.8} />
                  </div>

                  {/* Content */}
                  <h3 className="mt-2 text-lg font-extrabold text-gray-900 dark:text-white">
                    {feature.title}
                  </h3>

                  <p className="mt-2 text-sm leading-7 text-gray-600 dark:text-gray-400">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>

        </div>
      </section>
    </>
  );
}
