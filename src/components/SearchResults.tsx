import { Search } from 'lucide-react';
import { Channel } from '@/types/channel';
import { ChannelCard } from './ChannelCard';

interface SearchResultsProps {
  query: string;
  results: Channel[];
  onPlay: (channel: Channel) => void;
  onToggleFavorite: (channelId: string) => void;
  isFavorite: (channelId: string) => boolean;
}

export function SearchResults({
  query,
  results,
  onPlay,
  onToggleFavorite,
  isFavorite,
}: SearchResultsProps) {
  return (
    <div className="pt-24 pb-12 px-4 md:px-8 fade-in">
      <div className="flex items-center gap-3 mb-8">
        <Search className="w-6 h-6 text-muted-foreground" />
        <h2 className="text-2xl font-bold">
          Results for "{query}"
        </h2>
        <span className="text-muted-foreground">
          ({results.length} {results.length === 1 ? 'channel' : 'channels'})
        </span>
      </div>

      {results.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-xl text-muted-foreground">No channels found</p>
          <p className="text-muted-foreground mt-2">
            Try searching for a different name or category
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
          {results.map((channel) => (
            <ChannelCard
              key={channel.id}
              channel={channel}
              isFavorite={isFavorite(channel.id)}
              onPlay={onPlay}
              onToggleFavorite={onToggleFavorite}
            />
          ))}
        </div>
      )}
    </div>
  );
}
