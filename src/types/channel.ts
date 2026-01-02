export interface Channel {
  id: string;
  name: string;
  logo: string;
  category: string;
  country: string;
  streamUrl: string;
}

export interface ChannelsByCategory {
  [category: string]: Channel[];
}
