import {
  MessageCircle,
  Share2,
} from "lucide-react";

import {
  FaLinkedin,
} from "react-icons/fa";

export default function ShareButtons({
  post,
}) {
  const pageUrl =
  typeof window !== "undefined"
    ? window.location.href
    : "";

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(
      pageUrl
    )}&text=${encodeURIComponent(post.title)}`,

    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
      pageUrl
    )}`,

    whatsapp: `https://wa.me/?text=${encodeURIComponent(
      `${post.title} ${pageUrl}`
    )}`,
  };

  const openShare = (url) => {
    window.open(
      url,
      "_blank",
      "noopener,noreferrer"
    );
  };

  return (
    <div className="flex flex-wrap gap-3">
      <button
        onClick={() =>
          openShare(shareLinks.twitter)
        }
        className="
          flex items-center gap-2
          px-4 py-2
          rounded-btn
          border border-[#E2EBF5]
          hover:border-primary/30
          hover:bg-primary/5
          transition-all
        "
      >
        <Share2 size={16} />
        X
      </button>

      <button
        onClick={() =>
          openShare(shareLinks.linkedin)
        }
        className="
          flex items-center gap-2
          px-4 py-2
          rounded-btn
          border border-[#E2EBF5]
          hover:border-primary/30
          hover:bg-primary/5
          transition-all
        "
      >
        <FaLinkedin size={16} />
        LinkedIn
      </button>

      <button
        onClick={() =>
          openShare(shareLinks.whatsapp)
        }
        className="
          flex items-center gap-2
          px-4 py-2
          rounded-btn
          border border-[#E2EBF5]
          hover:border-primary/30
          hover:bg-primary/5
          transition-all
        "
      >
        <MessageCircle size={16} />
        WhatsApp
      </button>
    </div>
  );
}