import { Play, Tv } from 'lucide-react';
import { Channel } from '@/types/channel';

interface HeroProps {
  featuredChannel?: Channel;
  onPlay: (channel: Channel) => void;
  totalChannels: number;
}

export function Hero({ featuredChannel, onPlay, totalChannels }: HeroProps) {
  return (
    <div className="relative min-h-[60vh] md:min-h-[70vh] flex items-end pb-16 md:pb-24">
      {/* Background gradient */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 80% 50% at 50% 0%, hsl(357 83% 47% / 0.15) 0%, transparent 50%),
            linear-gradient(180deg, hsl(0 0% 8%) 0%, hsl(0 0% 6%) 100%)
          `,
        }}
      />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 md:px-8">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 text-primary mb-4">
            <Tv className="w-5 h-5" />
            <span className="text-sm font-medium uppercase tracking-wider">
              Live Television
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">
            Watch Live TV
            <span className="block text-primary">Anywhere</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-lg">
            Stream {totalChannels}+ live channels from around the world. News, sports,
            entertainment, and more — all free.
          </p>

          {featuredChannel && (
            <button
              onClick={() => onPlay(featuredChannel)}
              className="inline-flex items-center gap-3 px-8 py-4 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors group"
            >
              <Play className="w-5 h-5 fill-current group-hover:scale-110 transition-transform" />
              <span>Start Watching</span>
            </button>
          )}
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </div>
  );
}
