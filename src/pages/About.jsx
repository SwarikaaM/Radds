
import AchievementsBanner from "../components/about/AchievementsBanner";
import OurStory from "../components/about/OurStory";
import ValuesSection from "../components/about/ValuesSection";
import LeadershipTeam from "../components/about/LeadershipTeam";
import Registrations from "../components/about/Registrations";
import AboutCTA from "../components/about/AboutCTA";

export default function About() {
  return (
    <>
      <main>
        <AchievementsBanner />
        <OurStory />
        <ValuesSection />
        <LeadershipTeam />
        <Registrations />
        <AboutCTA />
      </main>
    </>
  );
}