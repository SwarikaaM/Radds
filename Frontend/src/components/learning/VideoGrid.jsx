import { Play } from "lucide-react";
import ScrollReveal from "../ui/ScrollReveal";
import Card from "../ui/Card";

export default function VideoGrid({
  videos,
  onVideoSelect,
}) {
  if (!videos.length) {
    return (
      <div className="text-center py-20">
        <h3 className="text-xl font-semibold text-textprimary mb-2">
          No lessons found
        </h3>

        <p className="text-textmuted">
          Try selecting a different category.
        </p>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
      {videos.map((video, index) => (
        <ScrollReveal
          key={video.id}
          delay={index * 0.05}
        >
          <Card
            hover
            glow
            className="overflow-hidden h-full cursor-pointer"
          >
            <button
              onClick={() =>
                onVideoSelect(video)
              }
              className="w-full text-left"
            >
              <div className="relative">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-52 object-cover"
                />

                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />

                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-14 h-14 rounded-full bg-white/95 flex items-center justify-center shadow-lg">
                    <Play
                      size={22}
                      className="text-primary ml-1"
                      fill="currentColor"
                    />
                  </div>
                </div>
              </div>

              <div className="p-5">
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                    {video.category}
                  </span>

                  <span className="px-2.5 py-1 rounded-full bg-accent/10 text-accent text-xs font-medium">
                    {video.difficulty}
                  </span>
                </div>

                <h3 className="font-semibold text-textprimary leading-snug mb-3">
                  {video.title}
                </h3>

                <span className="text-sm text-textmuted">
                  {video.duration}
                </span>
              </div>
            </button>
          </Card>
        </ScrollReveal>
      ))}
    </div>
  );
}