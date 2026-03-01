import React from 'react';
import VideoCard from './VideoCard';
import type { Video } from '../types';

interface VideoListProps {
    children?: React.ReactNode;
    videos: Video[];
}

export const VideoList: React.FC<VideoListProps> = ({ videos }) => {
    return (
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
    );
};