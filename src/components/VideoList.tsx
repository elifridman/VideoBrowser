import React, { useRef, useEffect } from 'react';
import type { Video } from '../types';
import VideoCard from './VideoCard';

interface VideoListProps {
    videos: Video[];
    hasMore: boolean;
    onLoadMore: () => void;
}

const VideoList: React.FC<VideoListProps> = ({ videos, hasMore, onLoadMore }) => {
    const observerTarget = useRef(null);
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                // If the bottom div is visible and there is more data to show
                if (entries[0].isIntersecting && hasMore) {
                    onLoadMore();
                }
            },
            { threshold: 0.1 } // Trigger as soon as the bottom is slightly visible
        );

        if (observerTarget.current) {
            observer.observe(observerTarget.current);
        }

        return () => observer.disconnect();
    }, [onLoadMore, hasMore]);
    return (
        <div className="flex flex-col items-center w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-12 gap-x-8 p-8 max-w-7xl mx-auto">
                {videos.map((video: Video) => (
                    <VideoCard
                        key={video.id}
                        imageUrl={video.imageUrl}
                        title={video.title}
                        artist={video.artist}
                        releaseYear={video.releaseYear}
                    />
                ))}
            </div>
            {/* This div is the "Sentinel". When user scrolls here, more load. */}
            <div ref={observerTarget} className="h-20 w-full flex items-center justify-center">
                {hasMore && (
                    <div className="animate-pulse text-gray-400">
                        Loading more videos...
                    </div>
                )}
            </div>
        </div>
    );
};

export default VideoList;