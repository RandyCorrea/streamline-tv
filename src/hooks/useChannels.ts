import { useState, useEffect, useMemo } from "react";
import { Channel, ChannelsByCategory } from "@/types/channel";

const FAVORITES_KEY = "iptv-favorites";
const RECENT_KEY = "iptv-recent";
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
        const response = await fetch(
          `${import.meta.env.BASE_URL}channels.json`
        );

        if (!response.ok) {
          throw new Error("Failed to load channels.json");
        }

        const data = await response.json();

        const channelArray: Channel[] = Array.isArray(data)
          ? data
          : Array.isArray(data?.channels)
          ? data.channels
          : [];

        // Normalize channels (CRITICAL)
        const normalized = channelArray
          .filter(Boolean)
          .map((c, index) => ({
            id: c.id ?? `${c.name ?? "channel"}-${index}`,
            name: c.name ?? "Unknown",
            logo: c.logo ?? "",
            category: c.category ?? "Uncategorized",
            country: c.country ?? "Unknown",
            streamUrl: c.streamUrl,
          }))
          .filter(c => typeof c.streamUrl === "string");

        setChannels(normalized);
      } catch (err) {
        console.error("Channel load error:", err);
        setError(err instanceof Error ? err.message : "Unknown error");
        setChannels([]);
      } finally {
        setLoading(false);
      }
    }

    loadChannels();
  }, []);

  // Load favorites
  useEffect(() => {
    try {
      const stored = localStorage.getItem(FAVORITES_KEY);
      if (stored) setFavorites(JSON.parse(stored));
    } catch {
      setFavorites([]);
    }
  }, []);

  // Load recent
  useEffect(() => {
    try {
      const stored = localStorage.getItem(RECENT_KEY);
      if (stored) setRecentIds(JSON.parse(stored));
    } catch {
      setRecentIds([]);
    }
  }, []);

  // Group by category
  const channelsByCategory = useMemo<ChannelsByCategory>(() => {
    if (!Array.isArray(channels)) return {};

    return channels.reduce((acc, channel) => {
      const category = channel.category || "Uncategorized";
      if (!acc[category]) acc[category] = [];
      acc[category].push(channel);
      return acc;
    }, {} as ChannelsByCategory);
  }, [channels]);

  // Group by country
  const channelsByCountry = useMemo<ChannelsByCategory>(() => {
    if (!Array.isArray(channels)) return {};

    return channels.reduce((acc, channel) => {
      const country = channel.country || "Unknown";
      if (!acc[country]) acc[country] = [];
      acc[country].push(channel);
      return acc;
    }, {} as ChannelsByCategory);
  }, [channels]);

  // Favorites
  const favoriteChannels = useMemo(() => {
    if (!Array.isArray(channels)) return [];
    return channels.filter(c => favorites.includes(c.id));
  }, [channels, favorites]);

  // Recent
  const recentChannels = useMemo(() => {
    if (!Array.isArray(channels)) return [];
    return recentIds
      .map(id => channels.find(c => c.id === id))
      .filter((c): c is Channel => Boolean(c));
  }, [channels, recentIds]);

  const toggleFavorite = (channelId: string) => {
    setFavorites(prev => {
      const next = prev.includes(channelId)
        ? prev.filter(id => id !== channelId)
        : [...prev, channelId];
      try {
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const addToRecent = (channelId: string) => {
    setRecentIds(prev => {
      const next = [channelId, ...prev.filter(id => id !== channelId)].slice(
        0,
        MAX_RECENT
      );
      try {
        localStorage.setItem(RECENT_KEY, JSON.stringify(next));
      } catch {}
      return next;
    });
  };

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
