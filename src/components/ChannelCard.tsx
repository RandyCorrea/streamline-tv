import { useState } from 'react';
import { Heart, Play, Tv } from 'lucide-react';
import { Channel } from '@/types/channel';

interface ChannelCardProps {
  channel: Channel;
  isFavorite: boolean;
  onPlay: (channel: Channel) => void;
  onToggleFavorite: (channelId: string) => void;
}

export function ChannelCard({ channel, isFavorite, onPlay, onToggleFavorite }: ChannelCardProps) {
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="channel-card cursor-pointer group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onPlay(channel)}
    >
      {/* Card Content */}
      <div className="relative aspect-video overflow-hidden">
        {/* Logo/Image */}
        {channel.logo && !imageError ? (
          <img
            src={channel.logo}
            alt={channel.name}
            className="w-full h-full object-contain p-4 bg-secondary/50"
            onError={() => setImageError(true)}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-secondary/50">
            <Tv className="w-12 h-12 text-muted-foreground" />
          </div>
        )}

        {/* Hover Overlay */}
        <div
          className={`absolute inset-0 bg-background/80 flex items-center justify-center transition-opacity duration-200 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="flex items-center gap-4">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite(channel.id);
              }}
              className={`p-3 rounded-full transition-colors ${
                isFavorite
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary hover:bg-secondary/80'
              }`}
              aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
            </button>
            <button
              className="p-4 rounded-full bg-primary text-primary-foreground hover:scale-110 transition-transform"
              aria-label="Play channel"
            >
              <Play className="w-6 h-6 fill-current" />
            </button>
          </div>
        </div>
      </div>

      {/* Channel Info */}
      <div className="p-3">
        <h3 className="font-medium text-sm truncate">{channel.name}</h3>
        <p className="text-xs text-muted-foreground truncate mt-1">
          {channel.category} • {channel.country}
        </p>
      </div>
    </div>
  );
}
