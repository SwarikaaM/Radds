// Later
{/* <iframe
  src={`https://www.youtube.com/embed/${video.youtubeId}`}
  ...
/> */}


import {
  useEffect,
  useRef,
} from "react";

import {
  AnimatePresence,
  motion,
} from "framer-motion";

import {
  X,
  PlayCircle,
} from "lucide-react";

export default function VideoModal({
  video,
  onClose,
}) {
  const closeButtonRef = useRef(null);

  useEffect(() => {
    if (!video) return;

    const originalOverflow =
      document.body.style.overflow;

    document.body.style.overflow =
      "hidden";

    closeButtonRef.current?.focus();

    const handleEscape = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener(
      "keydown",
      handleEscape
    );

    return () => {
      document.body.style.overflow =
        originalOverflow;

      document.removeEventListener(
        "keydown",
        handleEscape
      );
    };
  }, [video, onClose]);

  return (
    <AnimatePresence>
      {video && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          exit={{
            opacity: 0,
          }}
        >
          {/* Backdrop */}

          <button
            aria-label="Close modal"
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="video-title"
            initial={{
              scale: 0.95,
              opacity: 0,
            }}
            animate={{
              scale: 1,
              opacity: 1,
            }}
            exit={{
              scale: 0.95,
              opacity: 0,
            }}
            transition={{
              duration: 0.2,
            }}
            className="
              relative
              z-10
              bg-white
              rounded-card
              overflow-hidden
              w-full
              max-w-4xl
              shadow-2xl
            "
          >
            <div className="flex items-center justify-between p-5 border-b border-[#E2EBF5]">
              <div>
                <h2
                  id="video-title"
                  className="font-semibold text-textprimary"
                >
                  {video.title}
                </h2>

                <p className="text-sm text-textmuted mt-1">
                  {video.category}
                </p>
              </div>

              <button
                ref={closeButtonRef}
                onClick={onClose}
                className="
                  p-2
                  rounded-lg
                  hover:bg-lightbg
                  transition-colors
                "
              >
                <X size={18} />
              </button>
            </div>

            {/* Future YouTube Embed */}

            <div className="aspect-video bg-dark flex flex-col items-center justify-center text-white">
              <PlayCircle
                size={64}
                className="mb-4 text-accent"
              />

              <h3 className="font-semibold mb-2">
                Video Player Placeholder
              </h3>

              <p className="text-white/70 text-center max-w-md px-6">
                When YouTube videos are available,
                replace this section with an iframe
                using the video's youtubeId.
              </p>
            </div>

            <div className="p-5">
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                  {video.category}
                </span>

                <span className="px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-medium">
                  {video.difficulty}
                </span>
              </div>

              <p className="text-textmuted">
                Duration: {video.duration}
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}