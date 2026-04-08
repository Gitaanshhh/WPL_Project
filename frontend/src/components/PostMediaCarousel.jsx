import React, { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function PostMediaCarousel({ items = [], className = '', maxHeightClass = 'max-h-72' }) {
    const mediaItems = useMemo(
        () => (Array.isArray(items) ? items.filter((item) => item?.signed_url) : []),
        [items]
    );
    const [activeIndex, setActiveIndex] = useState(0);

    if (mediaItems.length === 0) {
        return null;
    }

    const active = mediaItems[Math.min(activeIndex, mediaItems.length - 1)] || mediaItems[0];
    const isVideo = (active.kind || '').toLowerCase() === 'video' || (active.content_type || '').startsWith('video/');

    const goPrev = () => {
        setActiveIndex((prev) => (prev - 1 + mediaItems.length) % mediaItems.length);
    };

    const goNext = () => {
        setActiveIndex((prev) => (prev + 1) % mediaItems.length);
    };

    return (
        <div className={`relative overflow-hidden rounded-xl border border-academic-200 bg-academic-50 ${className}`}>
            <div className={`w-full ${maxHeightClass}`}>
                {isVideo ? (
                    <video
                        key={active.signed_url}
                        src={active.signed_url}
                        controls
                        preload="metadata"
                        className="h-full w-full object-contain bg-black"
                    />
                ) : (
                    <img
                        src={active.signed_url}
                        alt="Post media"
                        loading="lazy"
                        className="h-full w-full object-cover"
                    />
                )}
            </div>

            {mediaItems.length > 1 && (
                <>
                    <button
                        type="button"
                        onClick={goPrev}
                        className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white hover:bg-black/70"
                        aria-label="Previous media"
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </button>
                    <button
                        type="button"
                        onClick={goNext}
                        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white hover:bg-black/70"
                        aria-label="Next media"
                    >
                        <ChevronRight className="h-4 w-4" />
                    </button>
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-black/55 px-2.5 py-0.5 text-xs text-white">
                        {activeIndex + 1}/{mediaItems.length}
                    </div>
                </>
            )}
        </div>
    );
}
