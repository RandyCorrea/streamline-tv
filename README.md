# StreamTV - IPTV Web Application

A Netflix-style IPTV web application for watching live TV channels. Built with React, Vite, and TailwindCSS.

## Features

- 🎬 **Netflix-style UI** - Beautiful dark theme with smooth animations
- 📺 **Live TV Streaming** - Watch HLS streams directly in browser
- 🔍 **Search** - Find channels by name, category, or country
- ❤️ **Favorites** - Save your favorite channels (localStorage)
- 🕐 **Recently Watched** - Quick access to last viewed channels
- 📱 **Responsive** - Works on desktop and mobile
- ⚡ **Fast** - Static site, no backend required

## Tech Stack

- React 18 + TypeScript
- Vite
- TailwindCSS
- Swiper.js (carousels)
- HLS.js (video streaming)
- localStorage (persistence)

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Development Server

```bash
npm run dev
```

### 3. Build for Production

```bash
npm run build
```

## Channel Data

The app uses a static `channels.json` file for channel data. You can generate this from an M3U playlist.

### Using the M3U Parser

1. Download an M3U playlist (e.g., from [iptv-org](https://github.com/iptv-org/iptv)):

```bash
curl -o playlist.m3u https://iptv-org.github.io/iptv/index.m3u
```

2. Run the parser script:

```bash
node scripts/parse-m3u.js playlist.m3u public/channels.json
```

3. The script will generate `public/channels.json` with this format:

```json
[
  {
    "id": "channel-1",
    "name": "Channel Name",
    "logo": "https://example.com/logo.png",
    "category": "News",
    "country": "USA",
    "streamUrl": "https://example.com/stream.m3u8"
  }
]
```

## Deploying to GitHub Pages

1. Update `vite.config.ts` with your repo name:

```ts
export default defineConfig({
  base: '/your-repo-name/',
  // ...
})
```

2. Build the project:

```bash
npm run build
```

3. Deploy the `dist` folder to GitHub Pages (or use the `gh-pages` package).

### Using gh-pages

```bash
npm install gh-pages --save-dev
```

Add to `package.json`:

```json
{
  "scripts": {
    "deploy": "npm run build && gh-pages -d dist"
  }
}
```

Then run:

```bash
npm run deploy
```

## Project Structure

```
├── public/
│   └── channels.json       # Channel data
├── scripts/
│   └── parse-m3u.js        # M3U to JSON converter
├── src/
│   ├── components/
│   │   ├── ChannelCard.tsx
│   │   ├── ChannelRow.tsx
│   │   ├── Hero.tsx
│   │   ├── Navbar.tsx
│   │   ├── SearchResults.tsx
│   │   ├── SkeletonRow.tsx
│   │   └── VideoPlayer.tsx
│   ├── hooks/
│   │   ├── useChannels.ts
│   │   └── useSearch.ts
│   ├── types/
│   │   └── channel.ts
│   └── pages/
│       └── Index.tsx
└── README.md
```

## Notes

- Streams must support CORS or be HLS format
- Some channels may be geo-restricted or offline
- No backend, authentication, or user accounts
- All data stored locally in browser

## License

MIT
