import { useState, useMemo } from 'react';
import { Channel } from '@/types/channel';

export function useSearch(channels: Channel[]) {
  const [query, setQuery] = useState('');

  const results = useMemo(() => {
    if (!query.trim()) {
      return [];
    }
    const lowerQuery = query.toLowerCase().trim();
    return channels.filter(channel =>
      channel.name.toLowerCase().includes(lowerQuery) ||
      channel.category.toLowerCase().includes(lowerQuery) ||
      channel.country.toLowerCase().includes(lowerQuery)
    );
  }, [channels, query]);

  const isSearching = query.trim().length > 0;

  return {
    query,
    setQuery,
    results,
    isSearching,
  };
}
