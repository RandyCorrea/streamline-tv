import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Navigation } from 'swiper/modules';
import { Channel } from '@/types/channel';
import { ChannelCard } from './ChannelCard';

interface ChannelRowProps {
  title: string;
  channels: Channel[];
  onPlay: (channel: Channel) => void;
  onToggleFavorite: (channelId: string) => void;
  isFavorite: (channelId: string) => boolean;
}

export function ChannelRow({
  title,
  channels,
  onPlay,
  onToggleFavorite,
  isFavorite,
}: ChannelRowProps) {
  if (channels.length === 0) {
    return null;
  }

  return (
    <div className="mb-8 md:mb-12 slide-up">
      <h2 className="category-title px-4 md:px-8 mb-4">{title}</h2>
      <div className="px-4 md:px-8">
        <Swiper
          modules={[FreeMode, Navigation]}
          spaceBetween={12}
          slidesPerView={2.2}
          freeMode={true}
          navigation={true}
          breakpoints={{
            480: { slidesPerView: 2.5, spaceBetween: 14 },
            640: { slidesPerView: 3.2, spaceBetween: 16 },
            768: { slidesPerView: 4.2, spaceBetween: 16 },
            1024: { slidesPerView: 5.2, spaceBetween: 18 },
            1280: { slidesPerView: 6.2, spaceBetween: 20 },
          }}
          className="!overflow-visible"
        >
          {channels.map((channel) => (
            <SwiperSlide key={channel.id}>
              <ChannelCard
                channel={channel}
                isFavorite={isFavorite(channel.id)}
                onPlay={onPlay}
                onToggleFavorite={onToggleFavorite}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}
