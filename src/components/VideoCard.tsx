import React from 'react';

interface VideoCardProps {
  imageUrl: string;
  title: string;
  artist: string;
  releaseYear: number;
}

const VideoCard: React.FC<VideoCardProps> = ({ imageUrl, title, artist, releaseYear }) => {
  return (
    <div className="flex flex-col w-full group cursor-pointer transition-all">
      
      <div className="w-full aspect-video overflow-hidden shadow-sm">
        <img 
          src={imageUrl} 
          alt={title} 
          className="w-full h-full object-cover transform transition-transform duration-300 group-hover:scale-105"
          loading="lazy" 
        />
      </div>

      <div className="bg-[#fdfde3] p-4 flex flex-col items-center text-center flex-grow">
        
        <h3 className="text-[#1a1a1a] text-lg font-normal leading-snug mb-1">
          {title}
        </h3>
        
        <p className="text-[#1a1a1a] text-md font-normal mb-1">
          {artist}
        </p>
        
        <p className="text-[#1a1a1a] text-md font-normal">
          {releaseYear}
        </p>
      </div>
    </div>
  );
};

export default VideoCard;