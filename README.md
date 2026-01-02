# StreamTV - IPTV Web Application

A Netflix-style IPTV web application for watching live TV channels. Built with React, Vite, and TailwindCSS.

## 🚀 Fully Automatic Deployment

**This project is 100% autonomous.** No manual configuration required.

### What happens automatically:
1. **Daily at 00:00 UTC**: GitHub Actions downloads the full [IPTV-org](https://github.com/iptv-org/iptv) playlist
2. **Parses ALL channels** from `https://iptv-org.github.io/iptv/index.m3u`
3. **Updates `channels.json`** if changes are detected
4. **Auto-deploys to GitHub Pages** on every push or channel update

### To enable:
1. Fork this repository
2. Go to **Settings → Pages → Source** → Select **GitHub Actions**
3. That's it! The site will be live at `https://your-username.github.io/your-repo-name/`

## Features

- 🎬 **Netflix-style UI** - Beautiful dark theme with smooth animations
- 📺 **Live TV Streaming** - Watch HLS streams directly in browser
- 🔍 **Search** - Find channels by name, category, or country
- ❤️ **Favorites** - Save your favorite channels (localStorage)
- 🕐 **Recently Watched** - Quick access to last viewed channels
- 📱 **Responsive** - Works on desktop and mobile
- ⚡ **Fast** - Static site, no backend required
- 🤖 **Auto-updating** - Channels refresh daily via GitHub Actions

## Tech Stack

- React 18 + TypeScript
- Vite
- TailwindCSS
- Swiper.js (carousels)
- HLS.js (video streaming)
- GitHub Actions (automation)
- localStorage (persistence)

## GitHub Actions Workflows

### 1. Update Channels (`.github/workflows/update-channels.yml`)
- **Schedule**: Daily at 00:00 UTC
- **Action**: Downloads IPTV-org playlist, parses all channels, updates `channels.json`
- **Commits**: Only if changes detected

### 2. Deploy (`.github/workflows/deploy.yml`)
- **Triggers**: Push to main, or after channel update
- **Action**: Builds and deploys to GitHub Pages

## Local Development

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

## Manual Channel Update (Optional)

If you want to update channels manually:

```bash
# Download playlist
curl -o playlist.m3u https://iptv-org.github.io/iptv/index.m3u

# Parse and generate JSON
node scripts/parse-m3u.js playlist.m3u public/channels.json
```

## Project Structure

```
├── .github/
│   └── workflows/
│       ├── update-channels.yml  # Daily channel update
│       └── deploy.yml           # Auto-deploy to Pages
├── public/
│   └── channels.json            # Channel data (auto-generated)
├── scripts/
│   └── parse-m3u.js             # M3U to JSON converter
├── src/
│   ├── components/
│   ├── hooks/
│   ├── types/
│   └── pages/
└── README.md
```

## Notes

- ✅ **No backend required** - 100% static
- ✅ **No secrets or tokens** - Uses only public APIs
- ✅ **Free hosting** - GitHub Pages
- ✅ **Auto-updating** - Daily via GitHub Actions
- ⚠️ Some streams may be geo-restricted or offline
- ⚠️ Streams must support CORS or be HLS format

## License

MIT
