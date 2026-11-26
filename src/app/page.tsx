import { Header } from "@/components/Header";
import { Hero } from "@/components/hero/Hero";
import { Intro } from "@/components/sections/Intro";
import { Services } from "@/components/sections/Services";
import { Process } from "@/components/sections/Process";
import { HumanAI } from "@/components/sections/HumanAI";
import { Technology } from "@/components/sections/Technology";
import { Trust } from "@/components/sections/Trust";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { Footer } from "@/components/sections/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main id="main">
        <Hero />
        <Intro />
        <Services />
        <Process />
        <HumanAI />
        <Technology />
        <Trust />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
