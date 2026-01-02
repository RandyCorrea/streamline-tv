import { useEffect, useRef, useState } from 'react';
import { X, AlertTriangle, Loader2 } from 'lucide-react';
import Hls from 'hls.js';
import { Channel } from '@/types/channel';

interface VideoPlayerProps {
  channel: Channel;
  onClose: () => void;
}

export function VideoPlayer({ channel, onClose }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const streamUrl = channel.streamUrl;

    // Check if it's an HLS stream
    if (streamUrl.includes('.m3u8')) {
      if (Hls.isSupported()) {
        const hls = new Hls({
          enableWorker: true,
          lowLatencyMode: true,
          backBufferLength: 90,
        });

        hlsRef.current = hls;

        hls.loadSource(streamUrl);
        hls.attachMedia(video);

        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          setLoading(false);
          video.play().catch(() => {
            // Autoplay might be blocked
          });
        });

        hls.on(Hls.Events.ERROR, (_, data) => {
          if (data.fatal) {
            setError('Unable to load stream. The channel may be offline.');
            setLoading(false);
          }
        });
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        // Native HLS support (Safari)
        video.src = streamUrl;
        video.addEventListener('loadedmetadata', () => {
          setLoading(false);
          video.play().catch(() => {});
        });
      } else {
        setError('HLS is not supported in this browser');
        setLoading(false);
      }
    } else {
      // Direct stream URL
      video.src = streamUrl;
      video.addEventListener('loadeddata', () => {
        setLoading(false);
        video.play().catch(() => {});
      });
      video.addEventListener('error', () => {
        setError('Unable to play this stream');
        setLoading(false);
      });
    }

    // Handle escape key
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (hlsRef.current) {
        hlsRef.current.destroy();
      }
    };
  }, [channel.streamUrl, onClose]);

  return (
    <div className="fixed inset-0 z-[100] bg-background">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 p-3 rounded-full bg-background/80 hover:bg-secondary transition-colors"
        aria-label="Close player"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Channel info overlay */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-3 bg-background/80 rounded-lg px-4 py-2">
        <span className="font-medium">{channel.name}</span>
      </div>

      {/* Loading state */}
      {loading && !error && (
        <div className="absolute inset-0 flex items-center justify-center bg-background">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-12 h-12 text-primary animate-spin" />
            <p className="text-muted-foreground">Loading stream...</p>
          </div>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-background">
          <div className="flex flex-col items-center gap-4 text-center px-4">
            <AlertTriangle className="w-16 h-16 text-destructive" />
            <h3 className="text-xl font-medium">Stream Unavailable</h3>
            <p className="text-muted-foreground max-w-md">{error}</p>
            <button
              onClick={onClose}
              className="mt-4 px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      )}

      {/* Video element */}
      <video
        ref={videoRef}
        className={`w-full h-full object-contain ${loading || error ? 'hidden' : ''}`}
        controls
        autoPlay
        playsInline
      />
    </div>
  );
}
