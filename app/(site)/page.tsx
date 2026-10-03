import { Hero } from "@/components/home/Hero";
import { Leadership } from "@/components/home/Leadership";
import { TeamsGrid } from "@/components/home/TeamsGrid";
import { About } from "@/components/home/About";
import { EventsPreview } from "@/components/home/EventsPreview";
import { SponsorsPreview } from "@/components/home/SponsorsPreview";
import { AlumniPreview } from "@/components/home/AlumniPreview";
import { Contact } from "@/components/home/Contact";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Leadership />
      <TeamsGrid />
      <About />
      <EventsPreview />
      <SponsorsPreview />
      <AlumniPreview />
      <Contact />
    </>
  );
}
