import { useMemo, useState } from "react";

import LearningHero from "../components/learning/LearningHero";
import LearningTabs from "../components/learning/LearningTabs";
import VideoGrid from "../components/learning/VideoGrid";
import VideoModal from "../components/learning/VideoModal";
import LearningPath from "../components/learning/LearningPath";
import GlossarySection from "../components/learning/GlossarySection";

import { learningVideos } from "../data/learningVideos";

export default function Learning() {
  const [activeCategory, setActiveCategory] =
    useState("All");

  const [selectedVideo, setSelectedVideo] =
    useState(null);

  const filteredVideos = useMemo(() => {
    if (activeCategory === "All") {
      return learningVideos;
    }

    return learningVideos.filter(
      (video) =>
        video.category === activeCategory
    );
  }, [activeCategory]);

  return (
    <main >
      <LearningHero />

      <LearningTabs
        activeCategory={activeCategory}
        setActiveCategory={
          setActiveCategory
        }
      />

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <VideoGrid
            videos={filteredVideos}
            onVideoSelect={
              setSelectedVideo
            }
          />
        </div>
      </section>

      <LearningPath />

      {/* <GlossarySection /> */}

      <VideoModal
        video={selectedVideo}
        onClose={() =>
          setSelectedVideo(null)
        }
      />
    </main>
  );
}