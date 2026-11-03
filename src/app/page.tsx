import Feature from "@/components/Feature";
import HeroBanner from "@/components/HeroBanner";
import Newsletter from "@/components/Newsletter";
import PastEventsGallery from "@/components/home/PastEventsGallery";
import UpcomingEventsSection from "@/components/home/UpcomingEventsSection";

export default function Home() {
  return (
    <div>
      <HeroBanner />
      <Feature />
      <UpcomingEventsSection />
      <PastEventsGallery />
      <Newsletter />
    </div>
  );
}
