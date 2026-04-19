"use client";

import { useState } from "react";
import { Play, CheckCircle2, Coins, Loader2, Clock } from "lucide-react";
import type { VideoItem } from "@/lib/education-data";

interface VideoCardProps {
  video: VideoItem;
  watched: boolean;
  onMarkWatched: (videoId: string) => Promise<boolean>;
}

export default function VideoCard({ video, watched, onMarkWatched }: VideoCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [justWatched, setJustWatched] = useState(false);

  const isWatched = watched || justWatched;

  const handleWatch = async () => {
    if (isWatched || loading) return;
    setLoading(true);
    const success = await onMarkWatched(video.id);
    if (success) setJustWatched(true);
    setLoading(false);
  };

  return (
    <div className="eco-card overflow-hidden">
      {/* Thumbnail / embed */}
      {expanded ? (
        <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
          <iframe
            className="absolute inset-0 w-full h-full"
            src={`https://www.youtube-nocookie.com/embed/${video.youtubeId}?rel=0`}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      ) : (
        <button
          onClick={() => setExpanded(true)}
          className="relative w-full group cursor-pointer"
        >
          <img
            src={`https://img.youtube.com/vi/${video.youtubeId}/mqdefault.jpg`}
            alt={video.title}
            className="w-full h-44 object-cover"
          />
          {/* Play overlay */}
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/40 transition-colors">
            <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <Play className="w-6 h-6 text-surface-800 ml-1" />
            </div>
          </div>
          {/* Duration badge */}
          <span className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-0.5 rounded-md flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {video.duration}
          </span>
          {/* Watched badge */}
          {isWatched && (
            <span className="absolute top-2 right-2 bg-eco-500 text-white text-xs px-2 py-1 rounded-lg flex items-center gap-1 font-medium">
              <CheckCircle2 className="w-3 h-3" />
              Watched
            </span>
          )}
        </button>
      )}

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start gap-2 mb-2">
          <span className="text-lg flex-shrink-0">{video.emoji}</span>
          <div>
            <h3 className="font-semibold text-surface-800 text-sm leading-tight">
              {video.title}
            </h3>
            <span className="text-xs text-surface-400">{video.category}</span>
          </div>
        </div>

        <p className="text-xs text-surface-500 mb-3 leading-relaxed">
          {video.description}
        </p>

        {/* Watch & earn button */}
        <button
          onClick={handleWatch}
          disabled={isWatched || loading}
          className={`w-full py-2 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-all ${
            isWatched
              ? "bg-eco-100 text-eco-700 cursor-default"
              : "btn-primary"
          }`}
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : isWatched ? (
            <>
              <CheckCircle2 className="w-4 h-4" />
              +8 tokens earned
            </>
          ) : (
            <>
              <Coins className="w-4 h-4" />
              Mark as Watched (+8 tokens)
            </>
          )}
        </button>
      </div>
    </div>
  );
}
