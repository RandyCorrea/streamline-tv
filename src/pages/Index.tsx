import { useState, useMemo } from 'react';
import { Channel } from '@/types/channel';
import { useChannels } from '@/hooks/useChannels';
import { useSearch } from '@/hooks/useSearch';
import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { ChannelRow } from '@/components/ChannelRow';
import { SkeletonRow } from '@/components/SkeletonRow';
import { VideoPlayer } from '@/components/VideoPlayer';
import { SearchResults } from '@/components/SearchResults';

const Index = () => {
  const {
    channels,
    loading,
    error,
    channelsByCategory,
    favoriteChannels,
    recentChannels,
    toggleFavorite,
    addToRecent,
    isFavorite,
  } = useChannels();

  const { query, setQuery, results, isSearching } = useSearch(channels);
  const [activeChannel, setActiveChannel] = useState<Channel | null>(null);

  // Get sorted categories
  const sortedCategories = useMemo(() => {
    return Object.keys(channelsByCategory).sort((a, b) => {
      // Prioritize popular categories
      const priority = ['News', 'Sports', 'Entertainment', 'Music', 'Documentary', 'Kids'];
      const aIndex = priority.indexOf(a);
      const bIndex = priority.indexOf(b);
      if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
      if (aIndex !== -1) return -1;
      if (bIndex !== -1) return 1;
      return a.localeCompare(b);
    });
  }, [channelsByCategory]);

  const handlePlay = (channel: Channel) => {
    setActiveChannel(channel);
    addToRecent(channel.id);
  };

  const handleClosePlayer = () => {
    setActiveChannel(null);
  };

  // Get a featured channel
  const featuredChannel = channels[0];

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Unable to load channels</h2>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar searchQuery={query} onSearchChange={setQuery} />

      {/* Video Player Modal */}
      {activeChannel && (
        <VideoPlayer channel={activeChannel} onClose={handleClosePlayer} />
      )}

      {/* Search Results */}
      {isSearching ? (
        <SearchResults
          query={query}
          results={results}
          onPlay={handlePlay}
          onToggleFavorite={toggleFavorite}
          isFavorite={isFavorite}
        />
      ) : (
        <>
          {/* Hero Section */}
          <Hero
            featuredChannel={featuredChannel}
            onPlay={handlePlay}
            totalChannels={channels.length}
          />

          {/* Loading Skeletons */}
          {loading && (
            <>
              <SkeletonRow />
              <SkeletonRow />
              <SkeletonRow />
            </>
          )}

          {/* Content Rows */}
          {!loading && (
            <div className="pb-16">
              {/* Favorites Row */}
              {favoriteChannels.length > 0 && (
                <ChannelRow
                  title="❤️ My Favorites"
                  channels={favoriteChannels}
                  onPlay={handlePlay}
                  onToggleFavorite={toggleFavorite}
                  isFavorite={isFavorite}
                />
              )}

              {/* Recently Watched */}
              {recentChannels.length > 0 && (
                <ChannelRow
                  title="🕐 Recently Watched"
                  channels={recentChannels}
                  onPlay={handlePlay}
                  onToggleFavorite={toggleFavorite}
                  isFavorite={isFavorite}
                />
              )}

              {/* Categories */}
              {sortedCategories.map((category) => (
                <ChannelRow
                  key={category}
                  title={category}
                  channels={channelsByCategory[category]}
                  onPlay={handlePlay}
                  onToggleFavorite={toggleFavorite}
                  isFavorite={isFavorite}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Index;
