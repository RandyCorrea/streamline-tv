import { useState, useEffect, useMemo } from 'react';
import { Channel, ChannelsByCategory } from '@/types/channel';

const FAVORITES_KEY = 'iptv-favorites';
const RECENT_KEY = 'iptv-recent';
const MAX_RECENT = 10;

export function useChannels() {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [recentIds, setRecentIds] = useState<string[]>([]);

  // Load channels from JSON
  useEffect(() => {
    async function loadChannels() {
      try {
        const response = await fetch('/channels.json');
        if (!response.ok) {
          throw new Error('Failed to load channels');
        }
        const data = await response.json();
        setChannels(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }
    loadChannels();
  }, []);

  // Load favorites from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(FAVORITES_KEY);
    if (stored) {
      try {
        setFavorites(JSON.parse(stored));
      } catch {
        setFavorites([]);
      }
    }
  }, []);

  // Load recent from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(RECENT_KEY);
    if (stored) {
      try {
        setRecentIds(JSON.parse(stored));
      } catch {
        setRecentIds([]);
      }
    }
  }, []);

  // Group channels by category
  const channelsByCategory = useMemo<ChannelsByCategory>(() => {
    return channels.reduce((acc, channel) => {
      const category = channel.category || 'Uncategorized';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(channel);
      return acc;
    }, {} as ChannelsByCategory);
  }, [channels]);

  // Group channels by country
  const channelsByCountry = useMemo<ChannelsByCategory>(() => {
    return channels.reduce((acc, channel) => {
      const country = channel.country || 'Unknown';
      if (!acc[country]) {
        acc[country] = [];
      }
      acc[country].push(channel);
      return acc;
    }, {} as ChannelsByCategory);
  }, [channels]);

  // Get favorite channels
  const favoriteChannels = useMemo(() => {
    return channels.filter(c => favorites.includes(c.id));
  }, [channels, favorites]);

  // Get recent channels
  const recentChannels = useMemo(() => {
    return recentIds
      .map(id => channels.find(c => c.id === id))
      .filter((c): c is Channel => c !== undefined);
  }, [channels, recentIds]);

  // Toggle favorite
  const toggleFavorite = (channelId: string) => {
    setFavorites(prev => {
      const newFavorites = prev.includes(channelId)
        ? prev.filter(id => id !== channelId)
        : [...prev, channelId];
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
      return newFavorites;
    });
  };

  // Add to recent
  const addToRecent = (channelId: string) => {
    setRecentIds(prev => {
      const filtered = prev.filter(id => id !== channelId);
      const newRecent = [channelId, ...filtered].slice(0, MAX_RECENT);
      localStorage.setItem(RECENT_KEY, JSON.stringify(newRecent));
      return newRecent;
    });
  };

  // Check if channel is favorite
  const isFavorite = (channelId: string) => favorites.includes(channelId);

  return {
    channels,
    loading,
    error,
    channelsByCategory,
    channelsByCountry,
    favoriteChannels,
    recentChannels,
    toggleFavorite,
    addToRecent,
    isFavorite,
  };
}
