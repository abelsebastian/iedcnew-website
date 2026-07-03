import About from "../components/About";
import Connect from "../components/Connect";
import Hero from "../components/Hero";
import Initiatives from "../components/Initiatives";
import Marquee from "../components/Marquee";

export default function Home() {
  return (
    <>
      <Hero />
      <Marquee />
      <About />
      <Initiatives />
      <Connect />
    </>
  );
}
